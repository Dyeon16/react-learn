import { CodeBlock, Kw, Fn, Tag, Comp, Attr, Str } from '../components/CodeTokens.jsx';

export default function ComponentsPage() {
  return (
    <>
      <div className="content-header">
        <span className="content-label">컴포넌트</span>
        <h1>컴포넌트와 Props</h1>

        <div className="easy-callout">
          <span className="emoji">💡</span>
          <span className="text">
            <b>한 줄로 말하면,</b> 컴포넌트는 레고 블록 하나, Props는 그 블록에 끼워
            넣는 설정값이에요.
          </span>
        </div>

        <p>
          컴포넌트는 화면 일부를 맡는 재사용 가능한 UI 단위예요. JSX를 반환하는
          자바스크립트 함수로 작성하고, 이름은 대문자로 시작해요. Props는 부모
          컴포넌트가 자식 컴포넌트에게 값을 전달하는 방법이에요.
        </p>
      </div>

      <CodeBlock>
        <Kw>function</Kw> <Fn>Welcome</Fn>({'{ name }'}) {'{'}
        {'\n'}  <Kw>return</Kw> &lt;<Tag>h2</Tag>&gt;{'{name}'}님, 환영합니다!&lt;/
        <Tag>h2</Tag>&gt;;
        {'\n}'}
        {'\n\n'}
        <Kw>export default function</Kw> <Fn>App</Fn>() {'{'}
        {'\n'}  <Kw>return</Kw> &lt;<Comp>Welcome</Comp> <Attr>name</Attr>=
        <Str>"팡"</Str> /&gt;;
        {'\n}'}
      </CodeBlock>

      <a
        href="https://react.dev/learn/your-first-component"
        className="doc-link"
        target="_blank"
        rel="noreferrer"
      >
        공식문서에서 보기 (react.dev) ↗
      </a>

      <div className="suggested-questions">
        <h2>이런 질문도 해보세요</h2>
        <div className="chip-row">
          <span className="chip">Props와 State의 차이는?</span>
          <span className="chip">컴포넌트 이름은 꼭 대문자여야 해요?</span>
        </div>
      </div>
    </>
  );
}
