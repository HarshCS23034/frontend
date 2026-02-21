import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Calendar, BarChart3, TrendingUp, MessageSquare, User, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const BOTTOM_NAV = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { path: "/planner", icon: Calendar, label: "Planner" },
  { path: "/analytics", icon: BarChart3, label: "Analytics" },
  { path: "/prediction", icon: TrendingUp, label: "Predict" },
  { path: "/assistant", icon: MessageSquare, label: "AI Chat" },
  { path: "/profile", icon: User, label: "Profile" },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border"
      style={{ background: "hsl(var(--sidebar-background))", backdropFilter: "blur(20px)" }}>
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        {BOTTOM_NAV.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink key={path} to={path} className="flex flex-col items-center gap-0.5 px-2 py-1 relative min-w-[52px]">
              {isActive && (
                <motion.div
                  layoutId="bottomNavActive"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "hsl(var(--primary) / 0.15)" }}
                />
              )}
              <Icon className={`w-5 h-5 relative ${isActive ? "text-cyan" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-medium relative ${isActive ? "text-cyan" : "text-muted-foreground"}`}>{label}</span>
            </NavLink>
          );
        })}

        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center gap-0.5 px-2 py-1 relative min-w-[52px]"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Moon className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Sun className="w-5 h-5 text-muted-foreground" />
          )}
          <span className="text-[10px] font-medium text-muted-foreground">Theme</span>
        </button>
      </div>
    </nav>
  );
}
