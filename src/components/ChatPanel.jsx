import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { askChatbot, MAX_QUESTION_LENGTH } from '../api/chat.js';
import RichText from './RichText.jsx';

let nextId = 1;
function makeId() {
  return nextId++;
}

const ChatPanel = forwardRef(function ChatPanel(
  {
    title = '무엇이든 물어보세요',
    // 아래 세 prop은 좁은 화면의 서랍 모드에서만 App이 넘겨준다
    inert = false, // 접혀 있을 때 화면 밖 요소가 키보드 포커스를 받지 않도록
    autoFocus = false, // 서랍이 펼쳐지면 입력창(또는 접기 버튼)으로 포커스 이동
    onClose, // 있으면 헤더에 접기 버튼 표시
  },
  ref,
) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputId = useId();
  const abortRef = useRef(null);
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const closeRef = useRef(null);

  // 새 메시지나 "답변 생성 중" 표시가 생기면 대화창을 맨 아래로 내린다
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, isSending]);

  // 서랍이 펼쳐지면 바로 입력할 수 있게 포커스를 옮긴다 (전송 중이면 접기 버튼으로)
  useEffect(() => {
    if (!autoFocus) return;
    const target = inputRef.current && !inputRef.current.disabled ? inputRef.current : closeRef.current;
    target?.focus({ preventScroll: true });
  }, [autoFocus]);

  // 페이지 콘텐츠의 "이런 질문도 해보세요" 칩이 이 ask()를 호출해서
  // 오른쪽 챗봇에 실제로 질문을 전송한다 (App.jsx가 ref로 연결해줌).
  useImperativeHandle(ref, () => ({ ask: send }));

  async function send(text) {
    const trimmed = text.trim();
    if (!trimmed || isSending || trimmed.length > MAX_QUESTION_LENGTH) return;

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
      // ChatApiError의 message는 화면용 안내 문구 (429 요청 제한·400 입력 오류·타임아웃 등)
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: 'bot',
          isError: true,
          text:
            err?.name === 'ChatApiError'
              ? err.message
              : '답변을 가져오지 못했어요. 잠시 후 다시 시도해주세요.',
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
    <aside
      id="chat-panel"
      className="chat-panel"
      aria-label="React 학습 챗봇"
      inert={inert ? '' : undefined}
    >
      <div className="chat-header">
        <div className="chat-header-text">
          <span className="title">{title}</span>
          <span className="subtitle">공식문서 기반으로 답변해요</span>
        </div>
        {onClose && (
          <button
            ref={closeRef}
            type="button"
            className="chat-close-btn"
            onClick={onClose}
            aria-label="챗봇 접기"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M9 5l7 7-7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      <div ref={logRef} className={`chat-log${messages.length === 0 ? ' empty' : ''}`}>
        {messages.length === 0 && (
          <span className="empty-text">
            아직 대화가 없어요.
            <br />
            본문의 질문 칩을 누르거나
            <br />
            아래 입력창에 직접 물어보세요.
          </span>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`bubble-row ${m.role}${m.isError ? ' error' : ''}`}
          >
            <div className="bubble" role={m.isError ? 'alert' : undefined}>
              {m.role === 'bot' && !m.isError ? <RichText text={m.text} /> : m.text}
            </div>
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
          <div className="bubble-row bot" aria-live="polite">
            <div className="bubble">
              <span className="typing-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="sr-only">답변 생성 중</span>
            </div>
          </div>
        )}
      </div>

      <div className="chat-footer">
        <form className="chat-input-row" onSubmit={handleSubmit}>
          <label htmlFor={inputId} className="sr-only">
            메시지 입력
          </label>
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            className="chat-input"
            placeholder="궁금한 걸 물어보세요"
            value={input}
            maxLength={MAX_QUESTION_LENGTH}
            aria-describedby={`${inputId}-count`}
            disabled={isSending}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={isSending || !input.trim()}
          >
            전송
          </button>
        </form>
        <span
          id={`${inputId}-count`}
          className={`chat-input-count${input.length >= MAX_QUESTION_LENGTH ? ' limit' : ''}`}
        >
          {input.length} / {MAX_QUESTION_LENGTH}
        </span>
      </div>
    </aside>
  );
});

export default ChatPanel;
