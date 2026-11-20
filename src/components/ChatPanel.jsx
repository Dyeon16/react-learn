import { useId, useRef, useState } from 'react';
import { askChatbot } from '../api/chat.js';
import { STARTER_QUESTIONS } from '../data/starterQuestions.js';

let nextId = 1;
function makeId() {
  return nextId++;
}

export default function ChatPanel({ pageKey, title = '무엇이든 물어보세요' }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputId = useId();
  const abortRef = useRef(null);

  const starters = STARTER_QUESTIONS[pageKey] || [];

  async function send(text) {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const userMsg = { id: makeId(), role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { answer, sources } = await askChatbot(trimmed, {
        signal: controller.signal,
      });
      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: 'bot', text: answer, sources },
      ]);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: 'bot',
          isError: true,
          text:
            '답변을 가져오지 못했어요. 잠시 후 다시 시도해주세요.' +
            (err?.message ? ` (${err.message})` : ''),
        },
      ]);
    } finally {
      setIsSending(false);
      abortRef.current = null;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    send(input);
  }

  return (
    <aside className="chat-panel">
      <div className="chat-header">
        <span className="title">{title}</span>
        <span className="subtitle">공식문서 기반으로 답변해요</span>
      </div>

      <div className={`chat-log${messages.length === 0 ? ' empty' : ''}`}>
        {messages.length === 0 && (
          <span className="empty-text">
            아직 대화가 없어요.
            <br />
            아래 질문으로 시작해보세요.
          </span>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`bubble-row ${m.role}${m.isError ? ' error' : ''}`}
          >
            <div className="bubble">{m.text}</div>
            {m.sources?.length > 0 && (
              <div className="bubble-sources">
                {m.sources.map((s) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
                    출처: {s.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}

        {isSending && (
          <div className="bubble-row bot">
            <div className="bubble">
              <span className="typing-dots">
                <span />
                <span />
                <span />
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="chat-footer">
        {starters.length > 0 && (
          <div className="chat-starters">
            {starters.map((q) => (
              <button
                key={q}
                type="button"
                className="chat-starter-btn"
                disabled={isSending}
                onClick={() => send(q)}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <form className="chat-input-row" onSubmit={handleSubmit}>
          <label htmlFor={inputId} className="sr-only">
            메시지 입력
          </label>
          <input
            id={inputId}
            type="text"
            className="chat-input"
            placeholder="궁금한 걸 물어보세요"
            value={input}
            disabled={isSending}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="chat-send-btn" disabled={isSending}>
            전송
          </button>
        </form>
      </div>
    </aside>
  );
}
