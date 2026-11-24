import { useRef } from 'react';

// 챗봇 칼럼 왼쪽 경계의 드래그 손잡이 (외부 라이브러리 없이 Pointer Events로 구현).
// 왼쪽으로 끌면 넓어지고 오른쪽으로 끌면 좁아진다. 더블클릭하면 기본 폭, ←/→ 키로도 조절.
export default function ResizeHandle({ width, min, max, defaultWidth, onChange }) {
  const dragRef = useRef(null);
  const clamp = (w) => Math.round(Math.min(max, Math.max(min, w)));

  function handlePointerDown(e) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startWidth: width };
    document.body.classList.add('is-resizing');
  }

  function handlePointerMove(e) {
    if (!dragRef.current) return;
    const { startX, startWidth } = dragRef.current;
    onChange(clamp(startWidth + (startX - e.clientX)));
  }

  function endDrag(e) {
    if (!dragRef.current) return;
    dragRef.current = null;
    document.body.classList.remove('is-resizing');
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  function handleKeyDown(e) {
    const step = e.shiftKey ? 48 : 16;
    if (e.key === 'ArrowLeft') onChange(clamp(width + step));
    else if (e.key === 'ArrowRight') onChange(clamp(width - step));
    else if (e.key === 'Home') onChange(clamp(defaultWidth));
    else return;
    e.preventDefault();
  }

  return (
    <div
      className="chat-resize-handle"
      role="separator"
      aria-orientation="vertical"
      aria-label="챗봇 너비 조절 (더블클릭하면 기본 너비)"
      aria-valuenow={width}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDoubleClick={() => onChange(clamp(defaultWidth))}
      onKeyDown={handleKeyDown}
    />
  );
}
