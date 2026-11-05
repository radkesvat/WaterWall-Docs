import React, {useEffect, useRef, useState, type ReactNode} from 'react';
import styles from './styles.module.css';

type CopyButtonProps = {
  text: string;
  label: string;
  copiedLabel: string;
  failedLabel: string;
};

export function CopyButton({text, label, copiedLabel, failedLabel}: CopyButtonProps): ReactNode {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [copying, setCopying] = useState(false);
  const attempt = useRef(0);

  useEffect(() => {
    attempt.current += 1;
    setStatus('idle');
    setCopying(false);
    return () => { attempt.current += 1; };
  }, [text]);

  async function copy() {
    const current = ++attempt.current;
    setStatus('idle');
    setCopying(true);
    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
        throw new Error('Clipboard unavailable');
      }
      await navigator.clipboard.writeText(text);
      if (attempt.current === current) setStatus('copied');
    } catch {
      if (attempt.current === current) setStatus('failed');
    } finally {
      if (attempt.current === current) setCopying(false);
    }
  }

  return <span>
    <button type="button" className={styles.copyButton} disabled={copying}
      onClick={() => { void copy(); }} dir="auto">{label}</button>
    <span className={styles.copyStatus} role="status" aria-live="polite" aria-atomic="true" dir="auto">
      {status === 'copied' ? copiedLabel : status === 'failed' ? failedLabel : ''}
    </span>
  </span>;
}

// All content remains React text. Links lose their destination; only the
// separately verified documentation sources become clickable elsewhere.
function inlineText(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let cursor = 0;
  let plainStart = 0;
  let linksExhausted = false;

  function token(end: number, content: ReactNode) {
    if (cursor > plainStart) parts.push(text.slice(plainStart, cursor));
    parts.push(<React.Fragment key={cursor}>{content}</React.Fragment>);
    cursor = end;
    plainStart = end;
  }

  while (cursor < text.length) {
    if (text[cursor] === '`') {
      const end = text.indexOf('`', cursor + 1);
      if (end > cursor + 1 && !text.slice(cursor + 1, end).includes('\n')) {
        token(end + 1, <code>{text.slice(cursor + 1, end)}</code>);
        continue;
      }
    } else if (text.startsWith('**', cursor)) {
      const end = text.indexOf('**', cursor + 2);
      if (end > cursor + 2 && !text.slice(cursor + 2, end).includes('\n')) {
        token(end + 2, <strong>{text.slice(cursor + 2, end)}</strong>);
        continue;
      }
    } else if (text[cursor] === '[' && !linksExhausted) {
      const labelEnd = text.indexOf('](', cursor + 1);
      const destinationEnd = labelEnd < 0 ? -1 : text.indexOf(')', labelEnd + 2);
      if (labelEnd >= 0 && destinationEnd >= 0) {
        token(destinationEnd + 1, text.slice(cursor + 1, labelEnd));
        continue;
      }
      // Avoid rescanning a long run of unmatched brackets for each character.
      linksExhausted = true;
    }
    cursor += 1;
  }
  if (plainStart < text.length) parts.push(text.slice(plainStart));
  return parts;
}

const fenceStart = (line: string) => line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
const headingStart = (line: string) => line.match(/^ {0,3}(#{1,6})[ \t]+(.+)$/);

function listStart(line: string): {ordered: boolean; text: string; start?: number} | null {
  const unordered = line.match(/^ {0,3}[-+*][ \t]+(.*)$/);
  if (unordered) return {ordered: false, text: unordered[1]};
  const ordered = line.match(/^ {0,3}(\d{1,9})[.)][ \t]+(.*)$/);
  return ordered ? {ordered: true, start: Number(ordered[1]), text: ordered[2]} : null;
}

function startsBlock(line: string): boolean {
  return Boolean(fenceStart(line) || headingStart(line) || listStart(line));
}

type AnswerProps = {
  text: string;
  copyLabel: string;
  copiedLabel: string;
  copyFailedLabel: string;
};

export function Answer({text, copyLabel, copiedLabel, copyFailedLabel}: AnswerProps): ReactNode {
  // Preserve the complete answer while bypassing parsing for very large outputs.
  if (text.length > 60000) {
    return <p style={{whiteSpace: 'pre-wrap', overflowWrap: 'anywhere'}}>{text}</p>;
  }

  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let cursor = 0;

  while (cursor < lines.length) {
    if (!lines[cursor].trim()) { cursor += 1; continue; }
    const start = cursor;
    const fence = fenceStart(lines[cursor]);
    if (fence) {
      const marker = fence[1];
      const close = new RegExp(`^ {0,3}${marker[0]}{${marker.length},}[ \\t]*$`);
      const info = fence[2].trim().split(/\s+/, 1)[0];
      const language = /^[\w.+#-]{1,32}$/.test(info) ? info : 'text';
      cursor += 1;
      const codeStart = cursor;
      while (cursor < lines.length && !close.test(lines[cursor])) cursor += 1;
      const code = lines.slice(codeStart, cursor).join('\n')
        + (cursor < lines.length && cursor > codeStart ? '\n' : '');
      if (cursor < lines.length) cursor += 1;
      blocks.push(<div className={styles.responseCode} key={start} dir="ltr">
        <div className={styles.responseCodeHeader}>
          <span>{language}</span>
          <CopyButton text={code} label={copyLabel} copiedLabel={copiedLabel} failedLabel={copyFailedLabel} />
        </div>
        <pre><code>{code}</code></pre>
      </div>);
      continue;
    }

    const heading = headingStart(lines[cursor]);
    if (heading) {
      // The answer belongs beneath the conversation heading in the page outline.
      const level = Math.min(6, heading[1].length + 2);
      const content = heading[2].replace(/[ \t]+#+[ \t]*$/, '');
      blocks.push(React.createElement(`h${level}`, {key: start}, inlineText(content)));
      cursor += 1;
      continue;
    }

    const firstItem = listStart(lines[cursor]);
    if (firstItem) {
      const items: ReactNode[] = [];
      while (cursor < lines.length) {
        const item = listStart(lines[cursor]);
        if (!item || item.ordered !== firstItem.ordered) break;
        const itemStart = cursor;
        const content = [item.text];
        cursor += 1;
        while (cursor < lines.length && lines[cursor].trim() && !startsBlock(lines[cursor])) {
          content.push(lines[cursor].trim());
          cursor += 1;
        }
        items.push(<li key={itemStart}>{inlineText(content.join('\n'))}</li>);
      }
      blocks.push(firstItem.ordered
        ? <ol key={start} start={firstItem.start}>{items}</ol>
        : <ul key={start}>{items}</ul>);
      continue;
    }

    const paragraph = [lines[cursor++]];
    while (cursor < lines.length && lines[cursor].trim() && !startsBlock(lines[cursor])) {
      paragraph.push(lines[cursor++]);
    }
    blocks.push(<p key={start}>{inlineText(paragraph.join('\n'))}</p>);
  }
  return blocks;
}
