const START_TIMEOUT_MS = 90000;
const POLL_TIMEOUT_MS = 45000;
const CANCEL_TIMEOUT_MS = 45000;
const MAX_POLL_RETRIES = 3;

export class JobTimeoutError extends Error {}
export class JobProtocolError extends Error {}

function jobsUrl(endpoint: string): string {
  const url = new URL(endpoint);
  if (!/\/chat\/?$/.test(url.pathname)) throw new JobProtocolError('Invalid assistant endpoint.');
  url.pathname = url.pathname.replace(/\/chat\/?$/, '/jobs');
  return url.href;
}

function aborted(signal: AbortSignal): void {
  if (signal.aborted) throw new DOMException('Request aborted', 'AbortError');
}

async function request(url: string, body: object, signal: AbortSignal, timeoutMs: number): Promise<Response> {
  aborted(signal);
  const deadline = new AbortController();
  const timer = setTimeout(() => deadline.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'omit',
      body: JSON.stringify(body),
      signal: AbortSignal.any([signal, deadline.signal]),
    });
    // Include the body in the per-request deadline, rather than just the headers.
    const text = await response.text();
    aborted(signal);
    if (deadline.signal.aborted) throw new JobTimeoutError('Assistant request timed out.');
    return new Response(text || null, {status: response.status, headers: response.headers});
  } catch (error) {
    aborted(signal);
    if (deadline.signal.aborted) throw new JobTimeoutError('Assistant request timed out.');
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function wait(milliseconds: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timer);
      signal.removeEventListener('abort', onAbort);
      reject(new DOMException('Request aborted', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, milliseconds);
    signal.addEventListener('abort', onAbort, {once: true});
    if (signal.aborted) onAbort();
  });
}

async function pending(response: Response, expectedTicket?: string): Promise<{ticket: string; retryAfterMs: number}> {
  let data: unknown;
  try { data = await response.json(); } catch { throw new JobProtocolError('Invalid pending response.'); }
  if (!data || typeof data !== 'object' || Array.isArray(data)
    || !('status' in data) || data.status !== 'pending'
    || !('ticket' in data) || typeof data.ticket !== 'string' || !/^[a-f0-9]{64}$/.test(data.ticket)
    || (expectedTicket !== undefined && data.ticket !== expectedTicket)) {
    throw new JobProtocolError('Invalid pending response.');
  }
  const delay = 'retryAfterMs' in data && typeof data.retryAfterMs === 'number' && Number.isFinite(data.retryAfterMs)
    ? data.retryAfterMs : 2000;
  return {ticket: data.ticket, retryAfterMs: Math.min(10000, Math.max(1000, delay))};
}

async function cancel(url: string, ticket: string): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CANCEL_TIMEOUT_MS);
  try {
    await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'omit',
      body: JSON.stringify({action: 'cancel', ticket}),
      signal: controller.signal,
      keepalive: true,
    });
  } catch {
    // Best effort; server-side expiry also bounds abandoned jobs. Never restart.
  } finally {
    clearTimeout(timer);
  }
}

async function retryablePoll(response: Response): Promise<boolean> {
  if (response.status !== 502 && response.status !== 503) return false;
  try {
    const failure: unknown = await response.clone().json();
    if (failure && typeof failure === 'object' && !Array.isArray(failure) && 'code' in failure
      && typeof failure.code === 'string'
      && ['incomplete_response', 'empty_response', 'upstream_timeout'].includes(failure.code)) return false;
  } catch { /* A proxy's malformed response can be transient too. */ }
  return true;
}

export async function runAssistantJob(endpoint: string, body: object, signal: AbortSignal): Promise<Response> {
  const url = jobsUrl(endpoint);
  let ticket: string | undefined;
  let complete = false;
  let cancellationSent = false;
  const cancelPending = () => {
    if (!ticket || complete || cancellationSent) return;
    cancellationSent = true;
    // Independent signal and keepalive let Stop/unmount settle immediately.
    void cancel(url, ticket);
  };
  signal.addEventListener('abort', cancelPending, {once: true});
  try {
    // A lost start response is ambiguous: never create a second job automatically.
    let response = await request(url, {...body, action: 'start'}, signal, START_TIMEOUT_MS);
    if (response.status !== 202) return response;
    let state = await pending(response);
    ticket = state.ticket;
    aborted(signal);
    let failures = 0;
    while (true) {
      await wait(state.retryAfterMs, signal);
      try {
        response = await request(url, {action: 'poll', ticket}, signal, POLL_TIMEOUT_MS);
      } catch (error) {
        aborted(signal);
        if (++failures <= MAX_POLL_RETRIES) continue;
        throw error;
      }
      if (await retryablePoll(response) && ++failures <= MAX_POLL_RETRIES) continue;
      if (response.status !== 202) {
        complete = response.ok;
        return response;
      }
      state = await pending(response, ticket);
      failures = 0;
    }
  } finally {
    signal.removeEventListener('abort', cancelPending);
    if (!complete) cancelPending();
  }
}
