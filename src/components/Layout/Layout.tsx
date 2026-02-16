import { IconHome, IconList, IconEdit, IconCalendar, IconSettings } from '../UI/Icons';
import type { Page } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  return (
    <div className="layout">
      <header className="header">
        <h1>StudyLog</h1>
      </header>

      <main className="main-content">
        {children}
      </main>

      <nav className="bottom-nav">
        <button
          className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          <IconHome />
          <span>Home</span>
        </button>
        <button
          className={`nav-item ${currentPage === 'items' ? 'active' : ''}`}
          onClick={() => onNavigate('items')}
        >
          <IconList />
          <span>Items</span>
        </button>
        <button
          className={`nav-item ${currentPage === 'record' ? 'active' : ''}`}
          onClick={() => onNavigate('record')}
        >
          <div className="record-fab">
            <IconEdit />
          </div>
        </button>
        <button
          className={`nav-item ${currentPage === 'plan' ? 'active' : ''}`}
          onClick={() => onNavigate('plan')}
        >
          <IconCalendar />
          <span>Plan</span>
        </button>
        <button
          className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`}
          onClick={() => onNavigate('settings')}
        >
          <IconSettings />
          <span>Settings</span>
        </button>
      </nav>

      <style>{`
        .layout {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 100%;
          background-color: var(--color-bg-base);
        }
        .header {
          background-color: var(--color-bg-card);
          padding: var(--spacing-md) var(--spacing-lg);
          border-bottom: 1px solid var(--color-border);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .header h1 {
          font-size: var(--font-size-lg);
          color: var(--color-primary);
        }
        .main-content {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 80px; /* Space for bottom nav */
        }
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: var(--color-bg-card);
          border-top: 1px solid var(--color-border);
          display: flex;
          justify-content: space-around;
          padding: var(--spacing-xs) 0;
          height: 64px;
          z-index: 20;
          box-shadow: 0 -1px 3px rgba(0,0,0,0.05);
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: var(--color-text-sub);
          font-size: var(--font-size-xs);
          gap: 4px;
          width: 100%;
        }
        .nav-item.active {
          color: var(--color-primary);
        }
        .record-fab {
          background-color: var(--color-primary);
          color: white;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          box-shadow: var(--shadow-lg);
        }
      `}</style>
    </div>
  );
};
