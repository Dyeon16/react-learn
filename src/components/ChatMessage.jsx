export default function ChatMessage({ role, text, code, source, onRetry }) {
  const isUser = role === 'user'
  const isError = role === 'error'

  return (
    <div className={`msg-row ${isUser ? 'msg-row-user' : 'msg-row-bot'}`}>
      <div className={`msg ${isUser ? 'msg-user' : isError ? 'msg-error' : 'msg-bot'}`}>
        <span>{text}</span>
        {code && <pre className="code-block">{code}</pre>}
        {isError && onRetry && (
          <button type="button" className="retry-btn" onClick={onRetry}>
            다시 시도
          </button>
        )}
      </div>
      {source && (
        <a className="source-link" href={source.href} target="_blank" rel="noreferrer">
          출처: {source.label}
        </a>
      )}
    </div>
  )
}
