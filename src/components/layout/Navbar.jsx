import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const pageTitles = {
  '/': 'Home',
  '/dashboard': 'Dashboard',
  '/issues': 'Issues',
  '/profile': 'Profile',
  '/reports': 'Reports',
  '/assign-worker': 'Assign Worker',
  '/create-profile': 'Create Worker',
  // Add more as needed
};

export default function Navbar() {
  const location = useLocation();
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get page title based on current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (pageTitles[path]) return pageTitles[path];
    // Dynamic routes (e.g., /issues/:id, /workers/:id)
    if (/^\/issues\//.test(path)) return 'Issue Details';
    if (/^\/workers\//.test(path)) return 'Worker Details';
    return 'CivicTracker';
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-background px-4 py-4 flex items-center justify-between border-b border-border"
      style={{ height: '5rem' }}
    >
      {/* Left: App Name */}
      <span className="text-lg font-semibold text-foreground">CivicTracker</span>
      {/* Center: Page Title */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span className="text-3xl font-extrabold text-primary">{getPageTitle()}</span>
      </div>
      {/* Right: Date/Time */}
      <span className="flex items-center gap-2 bg-primary px-3 py-1 rounded-full shadow text-base font-semibold text-primary-foreground border border-primary">
        {/* <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
        </svg> */}
        {dateTime.toLocaleString(undefined, {
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })}
      </span>
    </nav>
  );
}
