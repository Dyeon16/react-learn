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

  return (
    <div className="app-shell">
      <Sidebar current={route} onNavigate={navigate} />

      <main className="content">
        <Page />
      </main>

      {/* key={route}로 페이지를 옮기면 챗봇 대화창이 새로 시작된다 */}
      <ChatPanel
        key={route}
        pageKey={route}
        title={route === 'start' ? '무엇이든 물어보세요' : '더 궁금한 점을 물어보세요'}
      />
    </div>
  );
}
