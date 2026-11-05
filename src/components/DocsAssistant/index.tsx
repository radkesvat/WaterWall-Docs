import React, {useEffect, useRef, useState, type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';
import styles from './styles.module.css';

type Source = {title: string; url: string};
type HistoryMessage = {role: 'user' | 'assistant'; content: string};
type ChatRequest = {
  message: string;
  history: HistoryMessage[];
  context: {path: string; title: string; selection: string};
  locale: 'en' | 'fa';
};
type Exchange = {
  id: number;
  question: string;
  selection: boolean;
  answer?: string;
  sources?: Source[];
};

const labels = {
  en: {
    title: 'Ask WaterWall', subtitle: 'A little help with the docs',
    close: 'Close assistant', clear: 'Clear conversation',
    welcome: 'What would you like to understand?',
    intro: 'Ask about WaterWall, or close this panel and select a passage in the docs to explore it together.',
    example: 'How do WaterWall chains work?', explain: 'Explain selection',
    explainPrompt: 'Please explain this selected part of the documentation.',
    selected: 'Selected documentation', remove: 'Remove selection',
    truncated: 'Selection limited to the first 8,000 characters.',
    attached: 'Selected documentation included', page: 'Current page',
    question: 'Your question', placeholder: 'Ask a question about WaterWall…',
    send: 'Send question', cancel: 'Stop', retry: 'Try again',
    thinking: 'Looking through the documentation…',
    privacy: 'Your messages, recent conversation, page title and selected text are sent to OpenAI. Do not share passwords, API keys or other secrets.',
    note: 'AI answers can be mistaken. Check the linked documentation.',
    sources: 'Documentation sources', you: 'You', assistant: 'WaterWall assistant',
    failed: 'Unable to get an answer. Please try again.',
    network: 'Could not reach the assistant. Check your connection and try again.',
    cancelled: 'Request stopped. You can try it again.',
    timeout: 'The assistant took too long to respond. Please try again.',
    limit: 'The assistant has reached a usage limit. Please try again later.',
    unavailable: 'The assistant is temporarily unavailable. Please try again later.',
  },
  fa: {
    title: 'از واتروال بپرسید', subtitle: 'همراه شما در خواندن مستندات',
    close: 'بستن دستیار', clear: 'پاک کردن گفتگو',
    welcome: 'دربارهٔ چه چیزی می‌خواهید بدانید؟',
    intro: 'دربارهٔ واتروال بپرسید، یا این پنجره را ببندید و بخشی از مستندات را برای توضیح انتخاب کنید.',
    example: 'زنجیره‌ها در واتروال چگونه کار می‌کنند؟', explain: 'توضیح بخش انتخاب‌شده',
    explainPrompt: 'لطفاً این بخش انتخاب‌شده از مستندات را توضیح بده.',
    selected: 'بخش انتخاب‌شده از مستندات', remove: 'حذف بخش انتخاب‌شده',
    truncated: 'فقط ۸۰۰۰ نویسهٔ اول بخش انتخاب‌شده ارسال می‌شود.',
    attached: 'بخش انتخاب‌شده از مستندات ضمیمه شده است', page: 'صفحهٔ فعلی',
    question: 'پرسش شما', placeholder: 'پرسشی دربارهٔ واتروال بنویسید…',
    send: 'ارسال پرسش', cancel: 'توقف', retry: 'تلاش دوباره',
    thinking: 'در حال جستجو در مستندات…',
    privacy: 'پیام‌های شما، گفتگوی اخیر، عنوان صفحه و متن انتخاب‌شده به OpenAI ارسال می‌شود. گذرواژه، کلید API یا اطلاعات محرمانه نفرستید.',
    note: 'پاسخ هوش مصنوعی ممکن است اشتباه باشد. مستندات پیوندشده را بررسی کنید.',
    sources: 'منابع مستندات', you: 'شما', assistant: 'دستیار واتروال',
    failed: 'دریافت پاسخ ممکن نشد. لطفاً دوباره تلاش کنید.',
    network: 'اتصال به دستیار ممکن نشد. اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.',
    cancelled: 'درخواست متوقف شد. می‌توانید دوباره تلاش کنید.',
    timeout: 'دریافت پاسخ بیش از حد طول کشید. لطفاً دوباره تلاش کنید.',
    limit: 'سقف استفاده از دستیار تکمیل شده است. لطفاً بعداً دوباره تلاش کنید.',
    unavailable: 'دستیار موقتاً در دسترس نیست. لطفاً بعداً دوباره تلاش کنید.',
  },
};

// Keep complete recent turns, within the backend's count and character limits.
function recentHistory(exchanges: Exchange[]): HistoryMessage[] {
  const turns: HistoryMessage[][] = [];
  let size = 0;
  for (let i = exchanges.length - 1; i >= 0 && turns.length < 5; i--) {
    const {question, answer} = exchanges[i];
    if (!answer) continue;
    if (size + question.length + answer.length > 20000) break;
    turns.unshift([
      {role: 'user', content: question},
      {role: 'assistant', content: answer},
    ]);
    size += question.length + answer.length;
  }
  return turns.flat();
}

function InlineText({text}: {text: string}): ReactNode {
  const parts = text.split(/(`[^`\n]+`|\*\*[^*\n]+\*\*|\[[^\]\n]+\]\([^\s)]+\))/g);
  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      // Only backend-verified citations below become clickable links.
      return <React.Fragment key={index}>{link[1]}</React.Fragment>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

// Intentionally a small renderer: model output never becomes HTML or MDX.
function Answer({text}: {text: string}): ReactNode {
  return text.split(/(```[^\n]*\n[\s\S]*?(?:```|$))/g).map((part, index) => {
    if (part.startsWith('```')) {
      const code = part.replace(/^```[^\n]*\n/, '').replace(/```$/, '');
      return <pre key={index} dir="ltr"><code>{code.trimEnd()}</code></pre>;
    }
    return part.split(/\n\s*\n/).filter(Boolean).map((paragraph, paragraphIndex) => (
      <p key={`${index}-${paragraphIndex}`}><InlineText text={paragraph} /></p>
    ));
  });
}

export default function DocsAssistant({endpoint}: {endpoint: string}): ReactNode {
  const {i18n, siteConfig} = useDocusaurusContext();
  const location = useLocation();
  const locale = i18n.currentLocale === 'fa' ? 'fa' : 'en';
  const copy = labels[locale];
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [selection, setSelection] = useState('');
  const [selectionTruncated, setSelectionTruncated] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const conversation = useRef<HTMLDivElement>(null);
  const activeRequest = useRef<AbortController | null>(null);
  const retryRequest = useRef<{id: number; body: ChatRequest} | null>(null);
  const nextId = useRef(1);

  useEffect(() => {
    setSelection('');
    setSelectionTruncated(false);
    setPageTitle((document.querySelector('article h1')?.textContent || document.title).slice(0, 300));
  }, [location.pathname, location.hash]);

  useEffect(() => {
    function captureSelection() {
      if (dialog.current?.open) return;
      const selected = window.getSelection();
      if (!selected || selected.isCollapsed || !selected.rangeCount) return;
      const range = selected.getRangeAt(0);
      const ancestor = range.commonAncestorContainer;
      const element = ancestor.nodeType === Node.ELEMENT_NODE ? ancestor as Element : ancestor.parentElement;
      // Both ends must belong to one rendered documentation article.
      if (!element?.closest('article .theme-doc-markdown, article.theme-doc-markdown')) return;
      const value = selected.toString().trim();
      if (!value) return;
      setSelection(value.slice(0, 8000));
      setSelectionTruncated(value.length > 8000);
    }
    document.addEventListener('selectionchange', captureSelection);
    document.addEventListener('pointerup', captureSelection);
    document.addEventListener('keyup', captureSelection);
    return () => {
      document.removeEventListener('selectionchange', captureSelection);
      document.removeEventListener('pointerup', captureSelection);
      document.removeEventListener('keyup', captureSelection);
    };
  }, []);

  useEffect(() => {
    if (open) {
      if (!dialog.current?.open) dialog.current?.showModal();
      textarea.current?.focus();
    } else if (dialog.current?.open) {
      dialog.current.close();
    }
  }, [open]);

  useEffect(() => {
    if (conversation.current) conversation.current.scrollTop = conversation.current.scrollHeight;
  }, [exchanges, busy, error, open]);

  useEffect(() => () => activeRequest.current?.abort(), []);

  function safeUrl(value: string): string | null {
    try {
      const url = new URL(value, siteConfig.url);
      const publicOrigin = new URL(siteConfig.url).origin;
      const localOrigin = typeof window === 'undefined' ? publicOrigin : window.location.origin;
      const base = siteConfig.baseUrl.replace(/\/$/, '').replace(/\/fa$/, '');
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
      if (url.origin !== publicOrigin && url.origin !== localOrigin) return null;
      if (!url.pathname.startsWith(`${base}/docs/`) && !url.pathname.startsWith(`${base}/fa/docs/`)) return null;
      return url.href;
    } catch {
      return null;
    }
  }

  async function send(body: ChatRequest, id: number) {
    if (activeRequest.current) return;
    const controller = new AbortController();
    activeRequest.current = controller;
    retryRequest.current = {id, body};
    setBusy(true);
    setError('');
    let timedOut = false;
    // Leave room for the backend's reasoning timeout and Vercel's 300s ceiling.
    const timeout = window.setTimeout(() => { timedOut = true; controller.abort(); }, 310000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'omit',
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      if (!response.ok) {
        setError(response.status === 429 ? copy.limit : response.status >= 500 ? copy.unavailable : copy.failed);
        return;
      }
      const result: unknown = await response.json();
      if (!result || typeof result !== 'object' || !('answer' in result)
          || typeof result.answer !== 'string' || !result.answer.trim() || result.answer.length > 60000) {
        setError(copy.failed);
        return;
      }
      const answer = result.answer;
      const sources = 'sources' in result && Array.isArray(result.sources)
        ? result.sources.filter((source): source is Source => Boolean(source)
          && typeof source.title === 'string' && typeof source.url === 'string'
          && Boolean(safeUrl(source.url))).slice(0, 12)
        : [];
      setExchanges(current => current.map(item => item.id === id ? {...item, answer, sources} : item));
      retryRequest.current = null;
    } catch {
      setError(controller.signal.aborted ? timedOut ? copy.timeout : copy.cancelled : copy.network);
    } finally {
      window.clearTimeout(timeout);
      activeRequest.current = null;
      setBusy(false);
    }
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || activeRequest.current) return;
    const id = nextId.current++;
    const body: ChatRequest = {
      message,
      history: recentHistory(exchanges),
      context: {path: `${location.pathname}${location.hash}`.slice(0, 1024), title: pageTitle, selection},
      locale,
    };
    setExchanges(current => [...current.slice(-19), {id, question: message, selection: Boolean(selection)}]);
    setDraft('');
    void send(body, id);
  }

  function showAssistant() {
    setPageTitle((document.querySelector('article h1')?.textContent || document.title).slice(0, 300));
    if (selection && !draft.trim()) setDraft(copy.explainPrompt);
    setOpen(true);
  }

  function clearConversation() {
    if (activeRequest.current) return;
    setExchanges([]);
    setError('');
    retryRequest.current = null;
    textarea.current?.focus();
  }

  return (
    <div dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <button ref={launcher} type="button" className={styles.launcher}
        onClick={showAssistant} aria-haspopup="dialog" aria-expanded={open} aria-controls="waterwall-assistant">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6 3V6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M7 9h10M7 13h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        {selection ? copy.explain : copy.title}
      </button>
      <dialog ref={dialog} id="waterwall-assistant" className={styles.panel}
        aria-labelledby="waterwall-assistant-title" aria-describedby="waterwall-assistant-privacy"
        onCancel={() => setOpen(false)}
        onClose={() => { setOpen(false); launcher.current?.focus(); }}>
        <header className={styles.header}>
          <div><h2 id="waterwall-assistant-title">{copy.title}</h2><span>{copy.subtitle}</span></div>
          <button type="button" className={styles.iconButton} onClick={() => setOpen(false)} aria-label={copy.close}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </header>
        <div className={styles.pageContext} title={pageTitle}>{copy.page}: <strong>{pageTitle}</strong></div>
        <div ref={conversation} className={styles.conversation} role="log" aria-live="polite" aria-relevant="additions text" aria-label={copy.title}>
          {!exchanges.length && <div className={styles.welcome}>
            <span className={styles.welcomeMark} aria-hidden="true">W</span>
            <h3>{copy.welcome}</h3><p>{copy.intro}</p>
            <button type="button" className={styles.example} onClick={() => { setDraft(copy.example); textarea.current?.focus(); }}>{copy.example}<span aria-hidden="true"> ↗</span></button>
          </div>}
          {exchanges.map(exchange => <div className={styles.exchange} key={exchange.id}>
            <div className={styles.question}>
              <span className={styles.speaker}>{copy.you}</span><p dir="auto">{exchange.question}</p>
              {exchange.selection && <small>{copy.attached}</small>}
            </div>
            {exchange.answer && <div className={styles.answer}>
              <span className={styles.speaker}>{copy.assistant}</span>
              <div dir="auto"><Answer text={exchange.answer} /></div>
              {Boolean(exchange.sources?.length) && <nav className={styles.sources} aria-label={copy.sources}>
                <strong>{copy.sources}</strong>
                {exchange.sources.map((source, index) => <a key={`${source.url}-${index}`} href={safeUrl(source.url)!} target="_blank" rel="noopener noreferrer">{index + 1}. {source.title}</a>)}
              </nav>}
            </div>}
          </div>)}
          {busy && <p className={styles.status} role="status"><span className={styles.pulse} aria-hidden="true" />{copy.thinking}</p>}
          {error && <div className={styles.error} role="alert"><p>{error}</p>
            {retryRequest.current && !busy && <button type="button" className={styles.textButton} onClick={() => {
              const request = retryRequest.current;
              if (request) void send(request.body, request.id);
            }}>{copy.retry}</button>}
          </div>}
        </div>
        <form className={styles.composer} onSubmit={submit}>
          {selection && <div className={styles.selection}>
            <div><strong>{copy.selected}</strong><button type="button" className={styles.textButton} onClick={() => {
              setSelection(''); setSelectionTruncated(false); window.getSelection()?.removeAllRanges();
              textarea.current?.focus();
            }}>{copy.remove}</button></div>
            <blockquote dir="auto">{selection}</blockquote>
            {selectionTruncated && <small>{copy.truncated}</small>}
          </div>}
          <label className={styles.inputLabel} htmlFor="waterwall-assistant-question">{copy.question}</label>
          <textarea ref={textarea} id="waterwall-assistant-question" value={draft} maxLength={4000}
            placeholder={copy.placeholder} rows={3} dir="auto" onChange={event => setDraft(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); submit(event); }
            }} />
          <div className={styles.actions}>
            <button type="button" className={styles.textButton} onClick={clearConversation} disabled={busy || !exchanges.length}>{copy.clear}</button>
            {busy ? <button type="button" className={styles.send} onClick={() => activeRequest.current?.abort()}>{copy.cancel}</button>
              : <button type="submit" className={styles.send} disabled={!draft.trim()}>{copy.send}<span aria-hidden="true"> ↑</span></button>}
          </div>
          <p id="waterwall-assistant-privacy" className={styles.privacy}>{copy.privacy}</p>
          <p className={styles.note}>{copy.note}</p>
        </form>
      </dialog>
    </div>
  );
}
