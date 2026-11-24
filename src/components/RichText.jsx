// 챗봇 답변의 ```코드 블록```, `인라인 코드`, **굵게** 만 렌더링하는 최소 마크다운 처리.
// dangerouslySetInnerHTML 없이 React 요소로만 만든다.
function renderInline(text, keyPrefix) {
  return text.split(/(`[^`\n]+`|\*\*[^*\n]+\*\*)/g).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={key} className="inline-code">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function RichText({ text }) {
  const blocks = [];
  const fence = /```[\w-]*\n?([\s\S]*?)(?:```|$)/g;
  let last = 0;
  let match;
  while ((match = fence.exec(text)) !== null) {
    if (match.index > last) blocks.push({ type: 'text', value: text.slice(last, match.index) });
    blocks.push({ type: 'code', value: match[1].replace(/\n$/, '') });
    last = fence.lastIndex;
  }
  if (last < text.length) blocks.push({ type: 'text', value: text.slice(last) });

  return blocks
    .filter((b) => b.value.trim())
    .map((b, i) =>
      b.type === 'code' ? (
        <pre key={i} className="code-block bubble-code">
          {b.value}
        </pre>
      ) : (
        <span key={i} className="bubble-text">
          {renderInline(b.value.trim(), i)}
        </span>
      ),
    );
}
