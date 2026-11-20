import { CodeBlock, Kw, Fn, Tag, Attr, Str } from '../components/CodeTokens.jsx';

export default function EventHandlingPage() {
  return (
    <>
      <div className="content-header">
        <span className="content-label">이벤트</span>
        <h1>이벤트 핸들링</h1>

        <div className="easy-callout">
          <span className="emoji">💡</span>
          <span className="text">
            <b>한 줄로 말하면,</b> 이벤트 핸들링은 사용자가 클릭하거나 입력했을
            때 "무엇을 할지" 미리 적어두는 거예요.
          </span>
        </div>

        <p>
          클릭, 입력, 폼 제출처럼 사용자의 행동에 반응하는 함수를 이벤트 핸들러라고
          해요. React에서는 <code className="inline-code">onClick</code>,{' '}
          <code className="inline-code">onChange</code>,{' '}
          <code className="inline-code">onSubmit</code> 같은 JSX 속성으로 핸들러
          함수를 전달해요. 이때 함수를 호출하지 말고 그대로 전달해야 해요.
        </p>
      </div>

      <CodeBlock>
        <Kw>export default function</Kw> <Fn>SaveButton</Fn>() {'{'}
        {'\n'}  <Kw>function</Kw> <Fn>handleSave</Fn>() {'{'}
        {'\n'}    <Fn>alert</Fn>(<Str>'저장 버튼을 클릭했습니다.'</Str>);
        {'\n'}  {'}'}
        {'\n\n'}  <Kw>return</Kw> &lt;<Tag>button</Tag>{' '}
        <Attr>onClick</Attr>={'{handleSave}'}&gt;저장&lt;/<Tag>button</Tag>&gt;;
        {'\n}'}
      </CodeBlock>

      <a
        href="https://react.dev/learn/responding-to-events"
        className="doc-link"
        target="_blank"
        rel="noreferrer"
      >
        공식문서에서 보기 (react.dev) ↗
      </a>

      <div className="suggested-questions">
        <h2>이런 질문도 해보세요</h2>
        <div className="chip-row">
          <span className="chip">onClick={'{fn()}'}과 onClick={'{fn}'} 차이는?</span>
          <span className="chip">이벤트 전파는 어떻게 막아요?</span>
        </div>
      </div>
    </>
  );
}
