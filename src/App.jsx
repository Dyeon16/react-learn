import { useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import ChatPanel from './components/ChatPanel.jsx';
import ResizeHandle from './components/ResizeHandle.jsx';
import StartPage from './pages/StartPage.jsx';
import ComponentsPage from './pages/ComponentsPage.jsx';
import StatePage from './pages/StatePage.jsx';
import EventHandlingPage from './pages/EventHandlingPage.jsx';
import ConditionalPage from './pages/ConditionalPage.jsx';
import EffectPage from './pages/EffectPage.jsx';
import { useHashRoute } from './hooks/useHashRoute.js';
import { useMediaQuery } from './hooks/useMediaQuery.js';

const PAGES = {
  start: StartPage,
  components: ComponentsPage,
  state: StatePage,
  events: EventHandlingPage,
  conditional: ConditionalPage,
  effect: EffectPage,
};

// global.css 의 서랍(@media max-width: 1100px) 기준과 같은 값
const DRAWER_QUERY = '(max-width: 1100px)';

// 넓은 화면에서 챗봇 칼럼 폭 (드래그로 조절, 새로고침하면 기본값)
const CHAT_DEFAULT_WIDTH = 340;
const CHAT_MIN_WIDTH = 280;
const CHAT_MAX_WIDTH = 640;
const SIDEBAR_PLUS_MIN_CONTENT = 660; // 사이드바 240 + 본문 최소 420

function useViewportWidth() {
  const [w, setW] = useState(() => window.innerWidth);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return w;
}

export default function App() {
  const [route, navigate] = useHashRoute('start');
  const Page = PAGES[route] || StartPage;

  // 좁은 화면에서는 챗봇이 오른쪽 서랍(탭을 누르면 펼쳐짐)으로 바뀐다
  const isDrawer = useMediaQuery(DRAWER_QUERY);
  const [chatOpen, setChatOpen] = useState(false);
  const tabRef = useRef(null);
  const drawerOpen = isDrawer && chatOpen;

  // 챗봇 폭: 본문이 너무 좁아지지 않도록 창 크기에 맞춰 최대값을 제한
  const viewportWidth = useViewportWidth();
  const [chatWidth, setChatWidth] = useState(CHAT_DEFAULT_WIDTH);
  const chatMaxWidth = Math.max(
    CHAT_MIN_WIDTH,
    Math.min(CHAT_MAX_WIDTH, viewportWidth - SIDEBAR_PLUS_MIN_CONTENT),
  );
  const effectiveChatWidth = Math.min(chatWidth, chatMaxWidth);

  // 페이지 콘텐츠의 "이런 질문도 해보세요" 칩에서 오른쪽 챗봇으로
  // 질문을 바로 전송할 수 있도록, ChatPanel의 ask()를 ref로 들고 있는다.
  // 서랍 모드에서는 답변이 보이도록 서랍을 같이 연다.
  const chatRef = useRef(null);
  const askChat = (question) => {
    if (isDrawer) setChatOpen(true);
    chatRef.current?.ask(question);
  };

  function closeChat() {
    setChatOpen(false);
    tabRef.current?.focus();
  }

  // 서랍이 열려 있을 때 Esc로 닫기
  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeChat();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  return (
    <div className="app-shell">
      <Sidebar current={route} onNavigate={navigate} />

      <main className="content">
        <Page onAsk={askChat} />
      </main>

      {isDrawer && (
        <div
          className={`chat-backdrop${drawerOpen ? ' visible' : ''}`}
          onClick={closeChat}
          aria-hidden="true"
        />
      )}

      <div
        className={`chat-drawer${drawerOpen ? ' open' : ''}`}
        style={isDrawer ? undefined : { '--chat-width': `${effectiveChatWidth}px` }}
      >
        {isDrawer && (
          <button
            ref={tabRef}
            type="button"
            className="chat-tab"
            aria-expanded={drawerOpen}
            aria-controls="chat-panel"
            onClick={() => setChatOpen(true)}
            tabIndex={drawerOpen ? -1 : 0}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 5h16v11H8l-4 4V5z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            <span className="chat-tab-label">챗봇</span>
          </button>
        )}

        {!isDrawer && (
          <ResizeHandle
            width={effectiveChatWidth}
            min={CHAT_MIN_WIDTH}
            max={chatMaxWidth}
            defaultWidth={CHAT_DEFAULT_WIDTH}
            onChange={setChatWidth}
          />
        )}

        {/* 페이지를 옮겨도 같은 ChatPanel 인스턴스를 유지해서 대화 내역이 남는다.
            (key를 route로 주면 페이지 이동마다 새로 마운트되어 대화가 지워지므로 주지 않는다.
             대화는 메모리에만 있으므로 새로고침하면 초기화된다.) */}
        <ChatPanel
          ref={chatRef}
          title="무엇이든 물어보세요"
          inert={isDrawer && !chatOpen}
          autoFocus={drawerOpen}
          onClose={isDrawer ? closeChat : undefined}
        />
      </div>
    </div>
  );
}
