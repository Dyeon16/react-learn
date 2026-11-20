import { CURRICULUM } from '../data/curriculum.js';
import reactLogo from '../assets/react-logo.svg';

export default function Sidebar({ current, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={reactLogo} alt="React 로고" width={24} height={24} />
        <span>React 학습 도우미</span>
      </div>

      {CURRICULUM.map((item) => (
        <button
          key={item.path}
          type="button"
          className={`nav-item${current === item.path ? ' active' : ''}`}
          onClick={() => onNavigate(item.path)}
          aria-current={current === item.path ? 'page' : undefined}
        >
          {item.label}
        </button>
      ))}
    </aside>
  );
}
