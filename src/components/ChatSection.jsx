import { useState, useRef, useEffect } from 'react'
import ChatMessage from './ChatMessage.jsx'

const INITIAL_MESSAGES = [
  { id: 1, role: 'user', text: 'useState는 언제 쓰는 거예요?' },
  {
    id: 2,
    role: 'bot',
    text:
      '컴포넌트가 리렌더링된 뒤에도 값을 "기억"해야 할 때 써요. 예를 들어 버튼을 누른 횟수처럼, 시간이 지나며 바뀌고 화면에도 반영돼야 하는 값이면 useState가 필요해요.',
    code: 'const [count, setCount] = useState(0);',
    source: {
      label: "react.dev — State: A Component's Memory",
      href: 'https://react.dev/learn/state-a-components-memory',
    },
  },
]

const SUGGESTED = ['컴포넌트란 정확히 뭔가요?', 'Props와 State의 차이는?', 'JSX에서 조건문은 어떻게 써요?']

// TODO: 실제 연동 시 이 함수만 fetch(API Gateway 엔드포인트)로 교체하면 됩니다.
// 지금은 백엔드가 없어서 300ms 뒤 데모 응답을 반환하는 걸로 흉내만 냅니다.
// 네트워크 요청이므로 실패할 수 있다는 전제로 Promise reject 경로도 열어둡니다.
function fetchBotReply(question) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 실패 케이스를 보고 싶으면 아래 줄 주석을 풀어서 테스트할 수 있습니다.
      // if (Math.random() < 0.3) return reject(new Error('network'))
      resolve(
        `아직 챗봇 백엔드가 연결되어 있지 않아요. API Gateway + Bedrock Knowledge Bases 연동이 끝나면 "${question}"에 대한 실제 답변이 여기에 표시됩니다.`,
      )
    }, 700)
  })
}

export default function ChatSection() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const logRef = useRef(null)

  useEffect(() => {
    const el = logRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages, isSending])

  async function sendMessage(text) {
    const trimmed = text.trim()
    if (!trimmed || isSending) return

    const userMsg = { id: Date.now(), role: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsSending(true)

    try {
      const replyText = await fetchBotReply(trimmed)
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'bot', text: replyText }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'error',
          text: '답변을 가져오지 못했어요. 네트워크 상태를 확인하고 다시 시도해 주세요.',
          retryText: trimmed,
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <section className="chat-section">
      <div className="chat-header">React 학습 도우미에게 물어보기</div>

      <div className="chat-log" ref={logRef}>
        {messages.map((m) => (
          <ChatMessage
            key={m.id}
            role={m.role}
            text={m.text}
            code={m.code}
            source={m.source}
            onRetry={m.role === 'error' ? () => sendMessage(m.retryText) : undefined}
          />
        ))}

        {isSending && (
          <div className="msg-row msg-row-bot">
            <div className="msg msg-bot msg-typing" aria-label="답변 입력 중">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}
      </div>

      <div className="chat-footer">
        <div className="chip-row">
          {SUGGESTED.map((q) => (
            <button
              key={q}
              type="button"
              className="chip"
              disabled={isSending}
              onClick={() => sendMessage(q)}
            >
              {q}
            </button>
          ))}
        </div>

        <form className="input-row" onSubmit={handleSubmit}>
          <label htmlFor="chatInput" className="sr-only">
            메시지 입력
          </label>
          <input
            id="chatInput"
            type="text"
            placeholder="React에 대해 무엇이든 물어보세요"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="chat-input"
            disabled={isSending}
          />
          <button type="submit" className="send-btn" disabled={isSending}>
            {isSending ? '전송 중…' : '전송'}
          </button>
        </form>
      </div>
    </section>
  )
}
