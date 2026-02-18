import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Briefcase,
  LogOut,
  ChevronLeft,
  Menu,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/leads', icon: Users, label: 'Leads (Kanban)', end: false },
  { to: '/admin/appointments', icon: CalendarDays, label: 'Agendamentos', end: false },
  { to: '/admin/portfolio', icon: Briefcase, label: 'Portfólio', end: false },
  { to: '/admin/reviews', icon: Star, label: 'Reviews', end: false },
];

export function Sidebar() {
  const { signOut, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'h-screen bg-[#0f0f0f] border-r border-white/10 flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
              <span className="text-white text-sm font-bold">SM</span>
            </div>
            <span className="text-white font-semibold text-sm">Admin Panel</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white hover:bg-white/5 h-8 w-8"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                isActive
                  ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        {!collapsed && user && (
          <p className="text-xs text-gray-500 mb-2 truncate px-1">{user.email}</p>
        )}
        <Button
          variant="ghost"
          onClick={signOut}
          className={cn(
            'w-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 text-sm',
            collapsed ? 'px-0 justify-center' : 'justify-start'
          )}
        >
          <LogOut className="w-4 h-4 mr-2 flex-shrink-0" />
          {!collapsed && 'Sair'}
        </Button>
      </div>
    </aside>
  );
}
