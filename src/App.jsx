import { useRef } from 'react';
import Sidebar from './components/Sidebar.jsx';
import ChatPanel from './components/ChatPanel.jsx';
import StartPage from './pages/StartPage.jsx';
import ComponentsPage from './pages/ComponentsPage.jsx';
import StatePage from './pages/StatePage.jsx';
import EventHandlingPage from './pages/EventHandlingPage.jsx';
import ConditionalPage from './pages/ConditionalPage.jsx';
import EffectPage from './pages/EffectPage.jsx';
import { useHashRoute } from './hooks/useHashRoute.js';

const PAGES = {
  start: StartPage,
  components: ComponentsPage,
  state: StatePage,
  events: EventHandlingPage,
  conditional: ConditionalPage,
  effect: EffectPage,
};

export default function App() {
  const [route, navigate] = useHashRoute('start');
  const Page = PAGES[route] || StartPage;

  // 페이지 콘텐츠의 "이런 질문도 해보세요" 칩에서 오른쪽 챗봇으로
  // 질문을 바로 전송할 수 있도록, ChatPanel의 ask()를 ref로 들고 있는다.
  const chatRef = useRef(null);
  const askChat = (question) => chatRef.current?.ask(question);

  return (
    <div className="app-shell">
      <Sidebar current={route} onNavigate={navigate} />

      <main className="content">
        <Page onAsk={askChat} />
      </main>

      {/* key={route}로 페이지를 옮기면 챗봇 대화창이 새로 시작된다 */}
      <ChatPanel
        key={route}
        ref={chatRef}
        title={route === 'start' ? '무엇이든 물어보세요' : '더 궁금한 점을 물어보세요'}
      />
    </div>
  );
}
