export default function ChatMessage({ role, text, code, source }) {
  const isUser = role === 'user'

  return (
    <div className={`msg-row ${isUser ? 'msg-row-user' : 'msg-row-bot'}`}>
      <div className={`msg ${isUser ? 'msg-user' : 'msg-bot'}`}>
        <span>{text}</span>
        {code && <pre className="code-block">{code}</pre>}
      </div>
      {source && (
        <a className="source-link" href={source.href} target="_blank" rel="noreferrer">
          출처: {source.label}
        </a>
      )}
    </div>
  )
}
