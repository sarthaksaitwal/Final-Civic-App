import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const pageTitles = {
  '/': 'Home',
  '/dashboard': 'Dashboard',
  '/issues': 'Issues',
  '/profile': 'Profile',
  '/reports': 'Reports',
  '/assign-worker': 'Assign Worker',
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
    <nav className="w-full bg-background border-b border-border px-4 py-2 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-primary">{getPageTitle()}</span>
      </div>
      <span className="text-sm text-muted-foreground font-mono">{dateTime.toLocaleString()}</span>
    </nav>
  );
}
