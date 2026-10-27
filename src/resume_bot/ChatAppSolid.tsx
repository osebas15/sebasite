import { createSignal, createEffect, For, Show, JSX } from 'solid-js';
import { profile } from '../content/profile';
import styles from './ChatAppSolid.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  error?: boolean;
}

const SUGGESTIONS = [
  'What did you do at Wyndham?',
  "What's your AI workflow?",
  'How do I contact you?',
];

const LINK_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)|(https?:\/\/[^\s)]+)|([\w.+-]+@[\w-]+\.[\w.-]+)/g;

/** Turns markdown links, bare URLs, and emails into anchors; everything else stays text. */
function linkify(text: string): JSX.Element[] {
  const parts: JSX.Element[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK_PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));
    const [whole, mdText, mdHref, url, email] = match;
    const href = mdHref ?? url ?? `mailto:${email}`;
    const external = href.startsWith('http');
    parts.push(
      <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
        {mdText ?? url ?? email ?? whole}
      </a>,
    );
    last = index + whole.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function ChatAppSolid() {
  const [messages, setMessages] = createSignal<Message[]>([]);
  const [input, setInput] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  let logRef: HTMLDivElement | undefined;

  const sendMessage = async (text = input()) => {
    if (!text.trim() || loading()) return;
    const userMsg: Message = { role: 'user', content: text.trim() };
    setMessages([...messages(), userMsg]);
    setInput('');
    setLoading(true);
    try {
      const history = messages()
        .filter(m => !m.error)
        .map(({ role, content }) => ({ role, content }));
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.content) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setMessages([...messages(), { role: 'assistant', content: data.content }]);
    } catch (err) {
      const reason = err instanceof Error && !err.message.startsWith('HTTP') ? `${err.message} ` : '';
      setMessages([...messages(), {
        role: 'assistant',
        content: `${reason}You can always reach me directly at ${profile.email}.`,
        error: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  createEffect(() => {
    messages();
    loading();
    queueMicrotask(() => {
      if (logRef) logRef.scrollTo({ top: logRef.scrollHeight, behavior: 'smooth' });
    });
  });

  return (
    <div class={styles.chatApp}>
      <div
        class={styles.messages}
        ref={el => (logRef = el)}
        role="log"
        aria-live="polite"
        aria-label="Conversation"
      >
        <Show when={messages().length === 0}>
          <p class={styles.empty}>
            Hi, I'm an AI trained on Sebastian's resume. Ask me about his experience, skills, or how to get in touch.
          </p>
        </Show>
        <For each={messages()}>
          {(msg) => (
            <div
              class={msg.role === 'user' ? styles.userMsg : styles.assistantMsg}
              classList={{ [styles.errorMsg]: !!msg.error }}
            >
              <span class="visually-hidden">{msg.role === 'user' ? 'You:' : 'Assistant:'}</span>
              {msg.role === 'assistant' ? linkify(msg.content) : msg.content}
            </div>
          )}
        </For>
        <Show when={loading()}>
          <div class={styles.loading} aria-label="Assistant is typing">
            <span>·</span><span>·</span><span>·</span>
          </div>
        </Show>
      </div>
      <Show when={messages().length === 0}>
        <div class={styles.suggestions}>
          <For each={SUGGESTIONS}>
            {(s) => (
              <button type="button" class={styles.suggestion} onClick={() => sendMessage(s)}>
                {s}
              </button>
            )}
          </For>
        </div>
      </Show>
      <form
        class={styles.inputRow}
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <label for="chat-input" class="visually-hidden">Your message</label>
        <textarea
          id="chat-input"
          class={styles.input}
          value={input()}
          onInput={e => setInput(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about my experience…"
          disabled={loading()}
          rows={2}
          maxLength={2000}
        />
        <button type="submit" class="btn btn-primary" disabled={loading() || !input().trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
