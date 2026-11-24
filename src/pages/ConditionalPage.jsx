import { CodeBlock, Kw, Fn, Tag, Attr, Str } from '../components/CodeTokens.jsx';

export default function ConditionalPage({ onAsk }) {
  return (
    <>
      <div className="content-header">
        <span className="content-label">렌더링</span>
        <h1>조건부 렌더링과 리스트 렌더링</h1>

        <div className="easy-callout">
          <span className="emoji">💡</span>
          <span className="text">
            <b>한 줄로 말하면,</b> 조건에 따라 다른 화면을 보여주거나, 목록을
            하나씩 반복해서 그려주는 방법이에요.
          </span>
        </div>

        <p>
          조건에 따라 다른 화면을 보여주고 싶을 때는 if문, 삼항 연산자(? :), 논리
          AND(&&)를 사용해요. 배열 데이터를 목록으로 보여줄 때는 map()을 쓰고, 각
          항목에는 고유한 key를 꼭 지정해야 해요.
        </p>
      </div>

      <CodeBlock>
        <Kw>function</Kw> <Fn>AccessLabel</Fn>({'{ isAdmin }'}) {'{'}
        {'\n'}  <Kw>return</Kw> &lt;<Tag>strong</Tag>&gt;
        {'{isAdmin ? '}
        <Str>'관리자'</Str> : <Str>'일반 사용자'</Str>
        {'}'}&lt;/<Tag>strong</Tag>&gt;;
        {'\n}'}
        {'\n\n'}
        {'{users.'}
        <Fn>map</Fn>
        {'(user => ('}
        {'\n'}  &lt;<Tag>li</Tag> <Attr>key</Attr>={'{user.id}'}&gt;
        {'{user.name}'}&lt;/<Tag>li</Tag>&gt;
        {'\n'}
        {'))}'}
      </CodeBlock>

      <a
        href="https://react.dev/learn/conditional-rendering"
        className="doc-link"
        target="_blank"
        rel="noreferrer"
      >
        공식문서에서 보기 (react.dev) ↗
      </a>

      <div className="suggested-questions">
        <h2>이런 질문도 해보세요</h2>
        <div className="chip-row">
          <button type="button" className="chip" onClick={() => onAsk('key는 왜 꼭 넣어야 해요?')}>
            key는 왜 꼭 넣어야 해요?
          </button>
          <button type="button" className="chip" onClick={() => onAsk('if문 대신 삼항연산자 꼭 써야 하나요?')}>
            if문 대신 삼항연산자 꼭 써야 하나요?
          </button>
        </div>
      </div>
    </>
  );
}
