import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, MessageCircle, FileText, Settings, History as HistoryIcon } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Header */}
      {!isHome && (
        <header className="p-4 bg-white dark:bg-gray-800 shadow-sm z-10 sticky top-0 flex justify-center items-center">
          <h1 className="text-lg font-bold text-primary dark:text-indigo-400">SmartStudy AI</h1>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe">
        <div className="flex justify-around items-center h-16">
          <NavItem to="/" icon={<Home size={24} />} label="Home" />
          <NavItem to="/history" icon={<HistoryIcon size={24} />} label="History" />
          <NavItem to="/tutor" icon={<MessageCircle size={24} />} label="Tutor" />
          <NavItem to="/settings" icon={<Settings size={24} />} label="Settings" />
        </div>
      </nav>
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
          isActive
            ? 'text-primary dark:text-indigo-400'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        }`
      }
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  );
};

export default Layout;
