import reactLogo from '../assets/react-logo.svg';

export default function StartPage() {
  return (
    <>
      <div className="hero-row">
        <img src={reactLogo} alt="React 로고" width={36} height={36} />
        <h1>React란?</h1>
      </div>

      <div className="easy-callout">
        <span className="emoji">💡</span>
        <span className="text">
          <b>한 줄로 말하면,</b> 리액트는 화면을 레고 블록처럼 작은 조각으로 나눠서
          조립하는 도구예요. 블록 하나(=컴포넌트)만 바꾸면 그 블록만 다시 그려져요.
        </span>
      </div>

      <p>
        화면을 이루는 UI를 작은 조각(컴포넌트)으로 나누어 조립하는 자바스크립트
        라이브러리예요. 각 조각이 자신의 상태(state)를 가지고, 상태가 바뀌면 화면도
        자동으로 다시 그려져요.
      </p>

      <div className="compare-row">
        <div className="compare-card html">
          <span className="card-title">일반 HTML + JS</span>
          <span className="card-text">
            값이 바뀔 때마다 <code className="html-code">getElementById</code>로
            요소를 직접 찾아 수정해야 해요.
          </span>
        </div>
        <div className="compare-card react">
          <span className="card-title">React</span>
          <span className="card-text">
            state만 바꾸면 돼요. 화면을 다시 그리는 건 React가 알아서 처리해줘요.
          </span>
        </div>
      </div>

      <div className="diff-section">
        <span className="label">React를 쓰면 무엇이 달라지나요?</span>

        <div className="diff-card">
          <span className="diff-title">화면을 보는 사용자 입장에서</span>
          <span className="diff-text">
            버튼을 눌러도 화면 전체가 흑 뀜거리며 새로고침되지 않고, 바뀐 부분만
            조용히 바뀌어요. 페이지를 이동해도 앱처럼 끊김 없이 느껴져요.
          </span>
        </div>

        <div className="diff-card">
          <span className="diff-title">만드는 개발자 입장에서 (난이도)</span>
          <span className="diff-text">
            화면을 작은 조각(컴포넌트)으로 나눠서 만들기 때문에, 복잡한 화면도 한
            번에 다 고민하지 않고 하나씩 나눠서 만들 수 있어요. 한 부분을 고쳐도
            다른 부분까지 깨질까봐 전체를 매번 확인하지 않아도 돼요. 여러 명이 각자
            다른 조각을 맡아 동시에 작업하기도 훨씬 쉬워져요.
          </span>
        </div>
      </div>

      <div className="tree-section">
        <span className="label">React 앱은 이렇게 조립돼요</span>
        <div className="tree-box">
          <div className="tree-app">
            <span className="app-label">App 컴포넌트</span>
            <div className="tree-children">
              <div className="tree-node">
                <span className="node-name">Header</span>
              </div>
              <div className="tree-node has-state">
                <span className="node-name">Counter</span>
                <span className="node-state-tag">state 보유</span>
              </div>
              <div className="tree-node">
                <span className="node-name">Footer</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-banner">
        <span className="arrow">→</span>
        <span className="text">궁금한 점은 오른쪽 챗봇에게 자유롭게 물어보세요.</span>
      </div>
    </>
  );
}
