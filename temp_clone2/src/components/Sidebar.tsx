import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft,
  ChevronRight,
  Lock,
  LogOut,
  Warehouse,
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpRight,
  Boxes,
  RotateCcw,
  Settings,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';
import { MENU_ITEMS } from '../config/menu';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const { user, logout } = useAuth();

  // Auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsCollapsed]);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="relative flex h-screen flex-col bg-[#0f172a] shadow-2xl z-20"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-8 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-primary text-white shadow-xl hover:bg-primary/90 focus:outline-none transition-transform active:scale-95"
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Logo Area */}
      <div className="flex h-24 items-center justify-center border-b border-white/5 bg-[#0a0f1d]">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-slate-800 text-white shadow-lg border border-white/10">
            <Warehouse size={24} strokeWidth={2.5} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-xl font-black tracking-widest">
                <span className="text-white">WMS</span>
                <span className="text-accent underline decoration-2 underline-offset-4">MASTER</span>
              </div>
              <span className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase mt-1">
                Warehouse Core
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
        {/* Dashboard Button */}
        <div>
          <NavLink
            to="/"
            className={({ isActive }) => twMerge(clsx(
              "group flex items-center rounded-xl px-4 py-3.5 text-sm font-black uppercase tracking-wider transition-all",
              isActive || window.location.pathname === '/'
                ? "bg-[#E3624A] text-white shadow-md shadow-[#E3624A]/20" 
                : "text-slate-300 hover:bg-white/5 hover:text-white",
              isCollapsed && "justify-center px-0"
            ))}
            title={isCollapsed ? "Dashboard" : undefined}
          >
            <LayoutDashboard size={20} className={clsx("shrink-0", isCollapsed ? "mr-0" : "mr-4")} />
            {!isCollapsed && <span>Dashboard</span>}
          </NavLink>
        </div>

        {/* Modules Section */}
        <div>
          {!isCollapsed && (
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">
              WMS Modules
            </h3>
          )}
          <div className="space-y-1.5">
            {MENU_ITEMS.filter(item => item.id !== 'dashboard').map((item) => {
              const Icon = item.icon;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => twMerge(clsx(
                    "group flex items-center rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all",
                    isActive 
                      ? "bg-white/10 text-white" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white",
                    isCollapsed && "justify-center px-0"
                  ))}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon size={18} className={clsx("shrink-0", isCollapsed ? "mr-0" : "mr-4")} />
                  
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 truncate">{item.name}</span>
                      <ChevronRightIcon size={14} className="text-slate-500 group-hover:text-white transition-colors" />
                    </>
                  )}

                  {item.isConfidential && (
                    <Lock 
                      size={12} 
                      className={clsx(
                        "text-red-400", 
                        isCollapsed ? "absolute top-2 right-2" : "ml-2"
                      )} 
                    />
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Actual User Profile Area */}
      {user && (
        <div className="bg-[#0a1329] p-4">
          <div className={clsx("flex items-center justify-between", isCollapsed ? "justify-center" : "gap-3")}>
            <div className="flex items-center gap-3 overflow-hidden">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-10 w-10 shrink-0 rounded-full object-cover border-2 border-[#111f42]"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E3624A] text-white font-bold">
                  {user.name.charAt(0)}
                </div>
              )}
              {!isCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-xs font-black text-white uppercase tracking-wider">{user.name}</span>
                  <span className="truncate text-[9px] text-[#E3624A] font-black uppercase tracking-widest mt-0.5">{user.role || 'LEAD DEVELOPER'}</span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button 
                onClick={logout} 
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0" 
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
          {isCollapsed && (
            <button 
              onClick={logout} 
              className="mt-4 w-full flex justify-center p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" 
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      )}

    </motion.aside>
  );
}
