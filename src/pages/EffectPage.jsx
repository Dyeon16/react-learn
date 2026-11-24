import { CodeBlock, Kw, Fn, Num } from '../components/CodeTokens.jsx';

export default function EffectPage({ onAsk }) {
  return (
    <>
      <div className="content-header">
        <span className="content-label">Hooks</span>
        <h1>useEffect와 사이드 이펙트</h1>

        <div className="easy-callout">
          <span className="emoji">💡</span>
          <span className="text">
            <b>한 줄로 말하면,</b> useEffect는 컴포넌트가 화면에 나타나거나
            사라질 때 "추가로 해야 할 일"을 처리하는 곳이에요.
          </span>
        </div>

        <p>
          Effect는 컴포넌트를 React 바깥의 시스템과 동기화할 때 사용해요. 타이머,
          외부 라이브러리, 서버 연결 같은 게 예시예요. 의존성 배열로 언제 다시
          실행할지 정하고, cleanup 함수로 뒷정리를 해요.
        </p>
      </div>

      <CodeBlock>
        <Fn>useEffect</Fn>
        {'(() => {'}
        {'\n'}  <Kw>const</Kw> id = <Fn>setInterval</Fn>
        {'(() => {'}
        {'\n'}    <Fn>setSeconds</Fn>
        {'(s => s + '}
        <Num>1</Num>
        {');'}
        {'\n'}  {'}, '}
        <Num>1000</Num>
        {');'}
        {'\n\n'}  <Kw>return</Kw> {'() => '}
        <Fn>clearInterval</Fn>(id);
        {'\n}, []);'}
      </CodeBlock>

      <a
        href="https://react.dev/learn/synchronizing-with-effects"
        className="doc-link"
        target="_blank"
        rel="noreferrer"
      >
        공식문서에서 보기 (react.dev) ↗
      </a>

      <div className="suggested-questions">
        <h2>이런 질문도 해보세요</h2>
        <div className="chip-row">
          <button type="button" className="chip" onClick={() => onAsk('useEffect는 아무 때나 써도 되나요?')}>
            useEffect는 아무 때나 써도 되나요?
          </button>
          <button type="button" className="chip" onClick={() => onAsk('의존성 배열을 비워두면 뭐가 달라져요?')}>
            의존성 배열을 비워두면 뭐가 달라져요?
          </button>
        </div>
      </div>
    </>
  );
}
