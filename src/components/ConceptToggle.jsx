import { useState } from 'react'

const CONCEPTS = [
  {
    title: '컴포넌트',
    body: '버튼, 카드, 입력창처럼 재사용 가능한 UI 조각이에요. 함수 하나가 화면 일부를 책임져요.',
  },
  {
    title: 'Hooks',
    body: (
      <>
        <code>useState</code>처럼 컴포넌트에 상태나 기능을 더해주는 함수예요.
      </>
    ),
  },
  {
    title: 'JSX',
    body: '자바스크립트 안에 HTML과 비슷한 문법을 써서 화면 모양을 표현하는 방식이에요.',
  },
]

export default function ConceptToggle() {
  const [open, setOpen] = useState(false)

  return (
    <section className="concept-toggle">
      <button
        type="button"
        className="concept-summary"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>핵심 개념 3가지</span>
        <svg
          className={`chevron${open ? ' chevron-open' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="#475569"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="concept-grid">
          {CONCEPTS.map((c) => (
            <div className="concept-card" key={c.title}>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
