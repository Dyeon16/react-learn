import { CodeBlock, Kw, Fn, Tag, Attr, Num } from '../components/CodeTokens.jsx';

export default function StatePage() {
  return (
    <>
      <div className="content-header">
        <span className="content-label">Hooks</span>
        <h1>useState로 상태 관리하기</h1>

        <div className="easy-callout">
          <span className="emoji">💡</span>
          <span className="text">
            <b>한 줄로 말하면,</b> useState는 컴포넌트가 숫자나 값을 "기억"하게
            해주는 저장 공간이에요.
          </span>
        </div>

        <p>
          컴포넌트가 리렌더링된 뒤에도 값을 "기억"해야 할 때 씁니다. 버튼 클릭
          횟수처럼 시간이 지나며 바뀌고 화면에도 반영돼야 하는 값이면 useState가
          필요합니다. 값을 바꾸는 함수를 호출하면 React가 알아서 해당 컴포넌트를
          다시 그려줍니다.
        </p>
      </div>

      <CodeBlock>
        <Kw>const</Kw> [count, setCount] = <Fn>useState</Fn>(<Num>0</Num>);
        {'\n\n'}
        &lt;<Tag>button</Tag> <Attr>onClick</Attr>={'{() => '}
        <Fn>setCount</Fn>(count + <Num>1</Num>){'}'}&gt;
        {'\n'}  {'{count}'}번 클릭함
        {'\n'}
        &lt;/<Tag>button</Tag>&gt;
      </CodeBlock>

      <a
        href="https://react.dev/learn/state-a-components-memory"
        className="doc-link"
        target="_blank"
        rel="noreferrer"
      >
        공식문서에서 보기 (react.dev) ↗
      </a>

      <div className="suggested-questions">
        <h2>이런 질문도 해보세요</h2>
        <div className="chip-row">
          <span className="chip">useState와 useRef 차이는?</span>
          <span className="chip">상태 업데이트가 비동기인 이유는?</span>
        </div>
      </div>
    </>
  );
}
