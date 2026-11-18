import reactLogo from '../assets/react-logo.png'

export default function Hero() {
  return (
    <section className="hero">
      <span className="brand-label">React 학습 도우미</span>
      <div className="title-row">
        <img src={reactLogo} alt="React 로고" className="title-logo" />
        <h1>React란?</h1>
      </div>
      <p>
        화면을 이루는 UI를 작은 조각(컴포넌트)으로 나누어 조립하는 자바스크립트
        라이브러리예요. 각 조각이 자신의 상태를 가지고, 상태가 바뀌면 화면도
        자동으로 다시 그려져요.
      </p>
      <a
        className="doc-link"
        href="https://react.dev/learn"
        target="_blank"
        rel="noreferrer"
      >
        공식 문서(react.dev) 바로가기 ↗
      </a>
    </section>
  )
}
