import React, {useEffect, useRef, useState, type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';
import styles from './styles.module.css';
import {Answer, CopyButton} from './Response';

type Source = {title: string; url: string};
type HistoryMessage = {role: 'user' | 'assistant'; content: string};
type ResponseMode = 'standard' | 'deep';
type ChatRequest = {
  message: string;
  history: HistoryMessage[];
  context: {path: string; title: string; selection: string};
  locale: 'en' | 'fa';
  mode: ResponseMode;
};
type Exchange = {
  id: number;
  question: string;
  selection: boolean;
  mode: ResponseMode;
  answer?: string;
  sources?: Source[];
};

const MAX_MESSAGE_LENGTH = 4000;
const labels = {
  en: {
    title: 'WaterWall Assistant', subtitle: 'Build. Debug. Understand.',
    close: 'Close assistant', clear: 'New conversation',
    welcome: 'What are we working on?',
    intro: 'Bring a configuration, a tricky connection issue, or a part of the docs. Let’s work through it together.',
    starters: [
      {title: 'Review a configuration', detail: 'Understand your JSON and refine it.', icon: 'code', prompt: 'Help me review my WaterWall configuration. Explain any problems and suggest the changes needed.\n\n'},
      {title: 'Work through a problem', detail: 'Trace a connection issue, step by step.', icon: 'route', prompt: 'Help me troubleshoot a WaterWall connection. Here is what I expect, what happens instead, and my configuration:\n\n'},
      {title: 'Explore a concept', detail: 'Connect the details to the bigger picture.', icon: 'book', prompt: 'Help me understand this part of WaterWall. Explain how it works, when to use it, and show a practical example.\n\n'},
    ],
    explain: 'Discuss selection', explainPrompt: 'Please explain this selected part of the documentation and how it applies in practice.',
    selected: 'Selected passage', remove: 'Remove selection',
    truncated: 'Selection limited to the first 8,000 characters.',
    attached: 'Selected passage included', page: 'Reading',
    question: 'Message WaterWall Assistant', placeholder: 'Describe your goal, paste JSON, or ask a follow-up…',
    selectedPlaceholder: 'What would you like to explore about this passage?',
    modeLabel: 'Response mode', modeNames: {standard: 'Standard', deep: 'Deep'},
    modeHints: {standard: 'For most questions and configuration changes.', deep: 'For more involved problems. May take longer.'},
    send: 'Send message', cancel: 'Stop', retry: 'Try again',
    thinking: 'Working on your question', stillThinking: 'Still working on your question',
    thinkingDetail: 'Complex questions can take a few minutes. You can keep reading while I work.',
    privacyLabel: 'About this conversation',
    privacy: 'Your messages, recent conversation, page title and selected text are sent to OpenAI. Do not share passwords, API keys or other secrets. This conversation stays in this tab until you reload or start a new one.',
    note: 'Check important details against the sources.',
    sources: 'Documentation sources', you: 'You', assistant: 'WaterWall',
    copy: 'Copy answer', copyCode: 'Copy code', copied: 'Copied', copyFailed: 'Could not copy. Select and copy the text manually.',
    shortcut: 'Ctrl / ⌘ + Enter to send', characters: 'characters',
    tooLong: 'Messages can contain up to 4,000 characters. Paste a smaller section of your configuration.',
    historyNotice: 'This answer exceeds the conversation context limit. Include the relevant part in your next message.',
    failed: 'Unable to get an answer. Please try again.',
    network: 'Could not reach the assistant. Check your connection and try again.',
    cancelled: 'Request stopped. You can try it again.',
    timeout: 'The assistant took too long to respond. Please try again.',
    limit: 'The assistant has reached a usage limit. Please try again later.',
    unavailable: 'The assistant is temporarily unavailable. Please try again later.',
  },
  fa: {
    title: 'دستیار واتروال', subtitle: 'طراحی، عیب‌یابی و درک عمیق‌تر',
    close: 'بستن دستیار', clear: 'گفتگوی تازه',
    welcome: 'روی چه چیزی کار می‌کنیم؟',
    intro: 'پیکربندی، مشکل اتصال یا بخشی از مستندات را مطرح کنید تا با هم بررسی کنیم.',
    starters: [
      {title: 'بررسی پیکربندی', detail: 'فهمیدن و بهبود تنظیمات JSON شما.', icon: 'code', prompt: 'کمکم کن پیکربندی واتروال را بررسی کنم. مشکلات احتمالی و تغییرات لازم را توضیح بده.\n\n'},
      {title: 'حل یک مشکل', detail: 'بررسی گام‌به‌گام مشکل اتصال.', icon: 'route', prompt: 'کمکم کن اتصال واتروال را عیب‌یابی کنم. انتظار من، اتفاقی که می‌افتد و پیکربندی من به این شکل است:\n\n'},
      {title: 'شناخت یک مفهوم', detail: 'ارتباط جزئیات با تصویر کلی.', icon: 'book', prompt: 'کمکم کن این بخش واتروال را بفهمم. نحوهٔ کار، کاربرد و یک مثال عملی را توضیح بده.\n\n'},
    ],
    explain: 'گفتگو دربارهٔ متن', explainPrompt: 'لطفاً این بخش انتخاب‌شده از مستندات و کاربرد عملی آن را توضیح بده.',
    selected: 'متن انتخاب‌شده', remove: 'حذف متن انتخاب‌شده',
    truncated: 'فقط ۸۰۰۰ نویسهٔ اول متن انتخاب‌شده ارسال می‌شود.',
    attached: 'متن انتخاب‌شده ضمیمه شده است', page: 'در حال مطالعه',
    question: 'پیام به دستیار واتروال', placeholder: 'هدفتان را توضیح دهید، JSON بچسبانید یا گفتگو را ادامه دهید…',
    selectedPlaceholder: 'کدام بخش این متن را می‌خواهید بیشتر بررسی کنیم؟',
    modeLabel: 'حالت پاسخ', modeNames: {standard: 'استاندارد', deep: 'عمیق'},
    modeHints: {standard: 'برای بیشتر پرسش‌ها و تغییرات پیکربندی.', deep: 'برای مسائل پیچیده‌تر. ممکن است بیشتر زمان ببرد.'},
    send: 'ارسال پیام', cancel: 'توقف', retry: 'تلاش دوباره',
    thinking: 'در حال بررسی پرسش شما', stillThinking: 'همچنان در حال بررسی پرسش شما',
    thinkingDetail: 'پرسش‌های پیچیده ممکن است چند دقیقه زمان ببرند. می‌توانید در این مدت به مطالعه ادامه دهید.',
    privacyLabel: 'دربارهٔ این گفتگو',
    privacy: 'پیام‌های شما، گفتگوی اخیر، عنوان صفحه و متن انتخاب‌شده به OpenAI ارسال می‌شود. گذرواژه، کلید API یا اطلاعات محرمانه نفرستید. این گفتگو تا بارگذاری دوبارهٔ صفحه یا شروع گفتگوی تازه در همین زبانه می‌ماند.',
    note: 'جزئیات مهم را با منابع بررسی کنید.',
    sources: 'منابع مستندات', you: 'شما', assistant: 'واتروال',
    copy: 'کپی پاسخ', copyCode: 'کپی کد', copied: 'کپی شد', copyFailed: 'کپی ممکن نشد. متن را انتخاب و دستی کپی کنید.',
    shortcut: 'Ctrl / ⌘ + Enter برای ارسال', characters: 'نویسه',
    tooLong: 'هر پیام می‌تواند تا ۴۰۰۰ نویسه داشته باشد. بخش کوچک‌تری از پیکربندی را بچسبانید.',
    historyNotice: 'این پاسخ از ظرفیت متن گفتگو بزرگ‌تر است. بخش مرتبط را در پیام بعدی بیاورید.',
    failed: 'دریافت پاسخ ممکن نشد. لطفاً دوباره تلاش کنید.',
    network: 'اتصال به دستیار ممکن نشد. اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.',
    cancelled: 'درخواست متوقف شد. می‌توانید دوباره تلاش کنید.',
    timeout: 'دریافت پاسخ بیش از حد طول کشید. لطفاً دوباره تلاش کنید.',
    limit: 'سقف استفاده از دستیار تکمیل شده است. لطفاً بعداً دوباره تلاش کنید.',
    unavailable: 'دستیار موقتاً در دسترس نیست. لطفاً بعداً دوباره تلاش کنید.',
  },
};

function Icon({name, size = 20}: {name: string; size?: number}): ReactNode {
  const paths: Record<string, ReactNode> = {
    code: <><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16" /></>,
    route: <><circle cx="6" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><path d="M9 6h6a4 4 0 0 1 0 8H9a3 3 0 0 0 0 6h6" /></>,
    book: <><path d="M12 5v15M12 5C9 3 5 3 2 4v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-3-1-7-1-10 1Z" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    plus: <path d="M12 5v14M5 12h14" />,
    send: <path d="M12 20V4m-6 6 6-6 6 6" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    chat: <path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6 3V6a2 2 0 0 1 2-2Z" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.chat}</svg>;
}

function currentPageTitle(): string {
  return (document.querySelector('#waterwall-docs-content main h1')?.textContent || document.title).slice(0, 300);
}

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

export default function DocsAssistant({endpoint, open, onOpenChange}: {
  endpoint: string; open: boolean; onOpenChange: (open: boolean) => void;
}): ReactNode {
  const {i18n, siteConfig} = useDocusaurusContext();
  const location = useLocation();
  const locale = i18n.currentLocale === 'fa' ? 'fa' : 'en';
  const copy = labels[locale];
  const setOpen = onOpenChange;
  const [draft, setDraft] = useState('');
  const [mode, setMode] = useState<ResponseMode>('standard');
  const [selection, setSelection] = useState('');
  const [selectionTruncated, setSelectionTruncated] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [inputError, setInputError] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef(0);
  const followResponse = useRef(true);
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
  }, [location.pathname, location.hash]);

  useEffect(() => {
    // Lazy routes can commit their article after the location effect has run.
    // Observe the docs, outside the assistant, so the label follows rendered content.
    const update = () => setPageTitle(currentPageTitle());
    const observer = new MutationObserver(update);
    const content = document.getElementById('waterwall-docs-content');
    if (content) observer.observe(content, {childList: true, characterData: true, subtree: true});
    observer.observe(document.head, {childList: true, characterData: true, subtree: true});
    update();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function captureSelection() {
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
    if (!open || !dialog.current) return;
    const element = dialog.current;
    const mobile = window.matchMedia('(max-width: 999px)');
    function show() {
      const focused = document.activeElement as HTMLElement | null;
      const restore = focused && element.contains(focused) ? focused : textarea.current;
      if (element.open) element.close();
      // Desktop stays interactive so readers can select and navigate the docs.
      if (mobile.matches) element.showModal(); else element.show();
      restore?.focus({preventScroll: true});
    }
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape' && !event.defaultPrevented) {
        event.preventDefault(); setOpen(false);
      }
    }
    show();
    mobile.addEventListener('change', show);
    document.addEventListener('keydown', escape);
    return () => {
      mobile.removeEventListener('change', show);
      document.removeEventListener('keydown', escape);
      element.close();
      launcher.current?.focus({preventScroll: true});
    };
  }, [open, setOpen]);

  useEffect(() => {
    if (!open || !conversation.current || !followResponse.current) return;
    const container = conversation.current;
    const latest = exchanges[exchanges.length - 1];
    const answer = latest?.answer && container.querySelector<HTMLElement>(`[data-answer-id="${latest.id}"]`);
    // Start a long reply at its beginning, while preserving intentional scrollback.
    container.scrollTop = answer && !busy ? answer.offsetTop - 24 : container.scrollHeight;
  }, [exchanges, busy, error, open]);

  useEffect(() => {
    if (!busy) return;
    const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - startedAt.current) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [busy]);

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
    // A retry keeps its original mode even if the next-message setting changed.
    setMode(body.mode);
    startedAt.current = Date.now();
    setElapsed(0);
    followResponse.current = true;
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
          || typeof result.answer !== 'string' || !result.answer.trim()) {
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
    if (!message || activeRequest.current || message.length > MAX_MESSAGE_LENGTH) return;
    setInputError('');
    const id = nextId.current++;
    const body: ChatRequest = {
      message,
      history: recentHistory(exchanges),
      context: {path: `${location.pathname}${location.hash}`.slice(0, 1024), title: currentPageTitle(), selection},
      locale,
      mode,
    };
    setExchanges(current => [...current.slice(-19), {id, question: message, selection: Boolean(selection), mode}]);
    setDraft('');
    void send(body, id);
  }

  function showAssistant() {
    setPageTitle(currentPageTitle());
    if (selection && !draft.trim()) setDraft(copy.explainPrompt);
    setOpen(true);
  }

  function clearConversation() {
    if (activeRequest.current) return;
    setExchanges([]);
    setDraft('');
    setMode('standard');
    setInputError('');
    setSelection('');
    setSelectionTruncated(false);
    window.getSelection()?.removeAllRanges();
    setError('');
    retryRequest.current = null;
    textarea.current?.focus();
  }

  const latestAnswer = [...exchanges].reverse().find(item => item.answer);
  const historyTooLong = latestAnswer && latestAnswer.question.length + latestAnswer.answer!.length > 20000;

  return (
    <div dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <button ref={launcher} type="button" className={styles.launcher} hidden={open}
        onClick={showAssistant} aria-haspopup="dialog" aria-expanded={open} aria-controls="waterwall-assistant">
        <Icon name="chat" />
        {selection ? copy.explain : copy.title}
      </button>
      <dialog ref={dialog} id="waterwall-assistant" className={styles.panel}
        aria-labelledby="waterwall-assistant-title"
        onCancel={event => {event.preventDefault(); setOpen(false);}}>
        <header className={styles.header}>
          <div className={styles.identity}>
            <span className={styles.brandMark} aria-hidden="true">W</span>
            <div><h2 id="waterwall-assistant-title">{copy.title}</h2><span>{copy.subtitle}</span></div>
          </div>
          <div className={styles.headerActions}>
            <button type="button" className={styles.iconButton} onClick={clearConversation}
              disabled={busy || !exchanges.length} aria-label={copy.clear} title={copy.clear}><Icon name="plus" /></button>
            <button type="button" className={styles.iconButton} onClick={() => setOpen(false)} aria-label={copy.close} title={copy.close}>
              <Icon name="close" />
            </button>
          </div>
        </header>
        <div className={styles.pageContext} title={pageTitle}><Icon name="book" size={15} /><span>{copy.page}</span><strong>{pageTitle}</strong></div>
        <div ref={conversation} className={styles.conversation} role="log" aria-live="polite" aria-relevant="additions text" aria-label={copy.title}
          onScroll={event => {
            const element = event.currentTarget;
            followResponse.current = element.scrollHeight - element.scrollTop - element.clientHeight < 80;
          }}>
          {!exchanges.length && <div className={styles.welcome}>
            <span className={styles.welcomeEyebrow}>{copy.subtitle}</span>
            <h3>{copy.welcome}</h3><p>{copy.intro}</p>
            <div className={styles.starters}>
              {copy.starters.map(starter => <button key={starter.icon} type="button" className={styles.starter}
                onClick={() => {setDraft(starter.prompt); setInputError(''); textarea.current?.focus();}}>
                <span className={styles.starterIcon}><Icon name={starter.icon} /></span>
                <span><strong>{starter.title}</strong><span>{starter.detail}</span></span>
                <Icon name="arrow" size={17} />
              </button>)}
            </div>
          </div>}
          {exchanges.map(exchange => <div className={styles.exchange} key={exchange.id} data-mode={exchange.mode}>
            <div className={styles.question}>
              <div className={styles.questionHeading}>
                <span className={styles.speaker}>{copy.you}</span>
                <span className={styles.modeTag} aria-label={`${copy.modeLabel}: ${copy.modeNames[exchange.mode]}`}>{copy.modeNames[exchange.mode]}</span>
              </div>
              <p dir="auto">{exchange.question}</p>
              {exchange.selection && <small><Icon name="book" size={12} />{copy.attached}</small>}
            </div>
            {exchange.answer && <div className={styles.answer} data-answer-id={exchange.id}>
              <div className={styles.answerHeading}><span className={styles.miniMark} aria-hidden="true">W</span><span className={styles.speaker}>{copy.assistant}</span></div>
              <div dir="auto"><Answer text={exchange.answer} copyLabel={copy.copyCode} copiedLabel={copy.copied} copyFailedLabel={copy.copyFailed} /></div>
              {Boolean(exchange.sources?.length) && <nav className={styles.sources} aria-label={copy.sources}>
                <strong><Icon name="book" size={14} />{copy.sources}</strong>
                <div>{exchange.sources.map((source, index) => <a key={`${source.url}-${index}`} href={safeUrl(source.url)!} target="_blank" rel="noopener noreferrer"><span>{index + 1}</span>{source.title}</a>)}</div>
              </nav>}
              <div className={styles.answerActions}><CopyButton text={exchange.answer} label={copy.copy} copiedLabel={copy.copied} failedLabel={copy.copyFailed} /></div>
            </div>}
          </div>)}
          {busy && <div className={styles.status} role="status">
            <div><span className={styles.pulse} aria-hidden="true" /><strong>{elapsed >= 60 ? copy.stillThinking : copy.thinking}</strong>
              <span className={styles.elapsed} aria-hidden="true" dir="ltr">{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}</span></div>
            <p>{copy.thinkingDetail}</p>
          </div>}
          {error && <div className={styles.error} role="alert"><p>{error}</p>
            {retryRequest.current && !busy && <button type="button" className={styles.textButton} onClick={() => {
              const request = retryRequest.current;
              if (request) void send(request.body, request.id);
            }}>{copy.retry}</button>}
          </div>}
        </div>
        <form className={styles.composer} onSubmit={submit}>
          {selection && <div className={styles.selection}>
            <div><strong><Icon name="book" size={14} />{copy.selected}</strong><button type="button" className={styles.textButton} onClick={() => {
              setSelection(''); setSelectionTruncated(false); window.getSelection()?.removeAllRanges();
              textarea.current?.focus();
            }}>{copy.remove}</button></div>
            <blockquote dir="auto">{selection}</blockquote>
            {selectionTruncated && <small>{copy.truncated}</small>}
          </div>}
          {historyTooLong && <p className={styles.contextNotice}>{copy.historyNotice}</p>}
          <fieldset className={styles.modeSelector} disabled={busy} aria-describedby="waterwall-assistant-mode-description">
            <legend>{copy.modeLabel}</legend>
            <div className={styles.modeOptions}>
              {(['standard', 'deep'] as const).map(value => <label key={value} className={styles.modeOption}>
                <input type="radio" name="waterwall-assistant-mode" value={value}
                  checked={mode === value} onChange={() => setMode(value)} />
                <span>{copy.modeNames[value]}</span>
              </label>)}
            </div>
            <p id="waterwall-assistant-mode-description" className={styles.modeHint}>{copy.modeHints[mode]}</p>
          </fieldset>
          <div className={styles.inputFrame}>
            <label className={styles.inputLabel} htmlFor="waterwall-assistant-question">{copy.question}</label>
            <textarea ref={textarea} id="waterwall-assistant-question" value={draft} maxLength={MAX_MESSAGE_LENGTH}
              placeholder={selection ? copy.selectedPlaceholder : copy.placeholder} rows={4} dir="auto"
              aria-describedby={inputError ? 'waterwall-assistant-input-error' : 'waterwall-assistant-shortcut'}
              aria-invalid={Boolean(inputError)}
              onChange={event => {setDraft(event.target.value); setInputError('');}}
              onPaste={event => {
                const input = event.currentTarget;
                const length = draft.length - (input.selectionEnd - input.selectionStart) + event.clipboardData.getData('text').length;
                if (length > MAX_MESSAGE_LENGTH) {event.preventDefault(); setInputError(copy.tooLong);}
              }}
              onKeyDown={event => {
                if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && !event.nativeEvent.isComposing) {
                  event.preventDefault(); submit(event);
                }
              }} />
            <div className={styles.actions}>
              <span className={styles.characterCount} aria-label={`${draft.length} / ${MAX_MESSAGE_LENGTH} ${copy.characters}`}>
                {draft.length.toLocaleString(locale)} / {MAX_MESSAGE_LENGTH.toLocaleString(locale)}
              </span>
              {busy ? <button type="button" className={styles.send} onClick={() => activeRequest.current?.abort()}><span className={styles.stopMark} aria-hidden="true" />{copy.cancel}</button>
                : <button type="submit" className={styles.send} disabled={!draft.trim()}>{copy.send}<Icon name="send" size={16} /></button>}
            </div>
          </div>
          {inputError && <p id="waterwall-assistant-input-error" className={styles.inputError} role="alert">{inputError}</p>}
          <div className={styles.composerMeta}>
            <span id="waterwall-assistant-shortcut" className={styles.shortcut}>{copy.shortcut}</span>
            <details className={styles.privacy}><summary>{copy.privacyLabel}</summary><p>{copy.privacy}</p></details>
          </div>
          <p className={styles.note}>{copy.note}</p>
        </form>
      </dialog>
    </div>
  );
}
