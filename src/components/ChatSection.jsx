import { useState } from 'react'
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

export default function ChatSection() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')

  function sendMessage(text) {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMsg = { id: Date.now(), role: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    // TODO: 여기서 API Gateway 엔드포인트(Bedrock Knowledge Bases 연동)를 호출해서
    // 실제 RAG 응답을 받아오면 됩니다. 지금은 프론트엔드 틀만 잡아둔 상태라
    // 데모용 안내 메시지를 대신 붙여줍니다.
    const botMsg = {
      id: Date.now() + 1,
      role: 'bot',
      text: '아직 챗봇 백엔드가 연결되어 있지 않아요. API Gateway + Bedrock Knowledge Bases 연동이 끝나면 여기에 실제 답변이 표시됩니다.',
    }
    setTimeout(() => {
      setMessages((prev) => [...prev, botMsg])
    }, 300)
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <section className="chat-section">
      <div className="chat-header">React 학습 도우미에게 물어보기</div>

      <div className="chat-log">
        {messages.map((m) => (
          <ChatMessage key={m.id} role={m.role} text={m.text} code={m.code} source={m.source} />
        ))}
      </div>

      <div className="chat-footer">
        <div className="chip-row">
          {SUGGESTED.map((q) => (
            <button key={q} type="button" className="chip" onClick={() => sendMessage(q)}>
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
          />
          <button type="submit" className="send-btn">
            전송
          </button>
        </form>
      </div>
    </section>
  )
}
