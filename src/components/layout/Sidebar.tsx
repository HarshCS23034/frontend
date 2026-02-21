import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Calendar, BarChart3, TrendingUp,
  MessageSquare, Briefcase, User, Zap, ChevronLeft,
  ChevronRight, Bell, LogOut, Flame, Star
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { notifications } from "@/data/mockData";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/planner", icon: Calendar, label: "AI Planner" },
  { path: "/analytics", icon: BarChart3, label: "Analytics" },
  { path: "/prediction", icon: TrendingUp, label: "Prediction" },
  { path: "/assistant", icon: MessageSquare, label: "AI Assistant" },
  { path: "/career", icon: Briefcase, label: "Career" },
  { path: "/profile", icon: User, label: "Profile" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const [showNotifs, setShowNotifs] = useState(false);
  const urgentCount = notifications.filter(n => n.urgent).length;

  const xpToNextLevel = (profile?.level || 1) * 1000;
  const xpProgress = ((profile?.xp || 0) % 1000) / 10;

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col h-screen sticky top-0 overflow-hidden flex-shrink-0"
      style={{ background: "hsl(var(--sidebar-background))", borderRight: "1px solid hsl(var(--sidebar-border))" }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border min-h-[65px]">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--gradient-primary)" }}>
                <Zap className="w-4 h-4 text-black" />
              </div>
              <span className="font-orbitron text-base font-bold gradient-text-primary whitespace-nowrap">Learn Sync</span>
            </motion.div>
          )}
        </AnimatePresence>

        {collapsed && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto" style={{ background: "var(--gradient-primary)" }}>
            <Zap className="w-4 h-4 text-black" />
          </div>
        )}

        <button
          onClick={onToggle}
          className="ml-auto p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground flex-shrink-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* User Profile Summary */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-4 border-b border-sidebar-border"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{ background: "var(--gradient-secondary)" }}>
              {profile?.name?.charAt(0) || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-sidebar-foreground">{profile?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{profile?.examGoal}</p>
            </div>
          </div>

          {/* XP Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-gold" /> Level {profile?.level}</span>
              <span>{profile?.xp} XP</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%`, background: "var(--gradient-gold)" }} />
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5 mt-2">
            <Flame className="w-3.5 h-3.5 text-coral" />
            <span className="text-xs text-muted-foreground">{profile?.streak} day streak</span>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink key={path} to={path}>
              <motion.div
                whileHover={{ x: collapsed ? 0 : 4 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${isActive
                  ? "sidebar-active"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                  }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-cyan" : "text-sidebar-foreground group-hover:text-foreground"}`} />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full"
                    style={{ background: "hsl(var(--cyan))" }}
                  />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground transition-all duration-200"
          >
            <div className="relative">
              <Bell className="w-5 h-5" />
              {urgentCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-black"
                  style={{ background: "hsl(var(--coral))" }}>
                  {urgentCount}
                </span>
              )}
            </div>
            {!collapsed && <span className="text-sm font-medium">Notifications</span>}
          </button>

          {showNotifs && !collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full left-0 right-0 mb-2 glass-card p-3 space-y-2 z-50"
            >
              {notifications.slice(0, 3).map(n => (
                <div key={n.id} className={`text-xs p-2 rounded-lg ${n.urgent ? "bg-coral/10 border border-coral/20" : "bg-muted/50"}`}>
                  <p className="text-foreground">{n.message}</p>
                  <p className="text-muted-foreground mt-0.5">{n.time}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle collapsed={collapsed} />

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
