import { createSignal, onCleanup, createEffect } from 'solid-js';
import styles from './ChatAppSolid.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  error?: boolean;
}

const CONTACT_EMAIL = 'osebas15@gmail.com';

export default function ChatAppSolid() {
  const [messages, setMessages] = createSignal<Message[]>([]);
  const [input, setInput] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  let chatEndRef: HTMLDivElement | undefined;

  const sendMessage = async () => {
    if (!input().trim()) return;
    const userMsg: Message = { role: 'user', content: input() };
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
        content: `${reason}You can always reach me directly at ${CONTACT_EMAIL}.`,
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

  // Scroll to bottom on new message
  createEffect(() => {
    messages();
    queueMicrotask(() => {
      if (chatEndRef) chatEndRef.scrollIntoView({ behavior: 'smooth' });
    });
  });

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div class={styles.chatApp}>
      <div class={styles.header}>Ask my resume (AI)</div>
      <div class={styles.messages}>
        {messages().map((msg, idx) => (
          <div class={msg.role === 'user' ? styles.userMsg : styles.assistantMsg}>
            {msg.content}
          </div>
        ))}
        {loading() && <div class={styles.loading}>...</div>}
        <div ref={el => (chatEndRef = el)} />
      </div>
      <div class={styles.inputRow}>
        <textarea
          class={styles.input}
          value={input()}
          onInput={e => setInput(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={loading()}
          rows={2}
        />
        <button class={styles.sendBtn} onClick={sendMessage} disabled={loading() || !input().trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
