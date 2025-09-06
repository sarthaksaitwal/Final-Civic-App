import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button.jsx';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Issues', href: '/issues', icon: FileText },
  { name: 'Review & Approve', href: '/issues', icon: CheckCircle, special: true },
  { name: 'Reports & Analytics', href: '/reports', icon: BarChart3 },
  { name: 'Create Worker', href: '/create-profile', icon: User },
  { name: 'Profile', href: '/profile', icon: User },
];

export function Sidebar({ className, collapsed, setCollapsed }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div
      className={`fixed left-0 z-40 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} ${className || ''}`}
      style={{
        top: '5rem', // Match the navbar height
        height: 'calc(100vh - 5rem)', // Fill below the navbar
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)",
        borderRadius: "1rem",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
        border: "1px solid #e5e7eb", // subtle gray border
      }}
    >
      {/* Navigation */}
      <nav className="flex-1 p-2 flex flex-col h-full">
        <ul className="space-y-1 flex-1">
          {navigation.map((item) => (
            <li key={item.name}>
              {item.special ? (
                <button
                  onClick={() => navigate('/issues', { state: { filterStatus: 'manual' } })}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors w-full",
                    "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    collapsed ? "justify-center" : "justify-start"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                  {!collapsed && <span>{item.name}</span>}
                </button>
              ) : (
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      collapsed ? "justify-center" : "justify-start"
                    )
                  }
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                  {!collapsed && <span>{item.name}</span>}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
        {/* Logout at the bottom */}
        <div className="mt-auto p-2 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full justify-start text-red-600 hover:text-white hover:bg-red-600",
              collapsed ? "px-3" : ""
            )}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className={cn("h-5 w-5", !collapsed && "mr-3")} />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </nav>
    </div>
  );
}