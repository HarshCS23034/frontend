import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

interface ThemeToggleProps {
    collapsed?: boolean;
}

export default function ThemeToggle({ collapsed = false }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground transition-all duration-200"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
            <div className="relative w-5 h-5 flex-shrink-0">
                <AnimatePresence mode="wait" initial={false}>
                    {theme === "dark" ? (
                        <motion.div
                            key="moon"
                            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <Moon className="w-5 h-5 text-violet" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <Sun className="w-5 h-5 text-gold" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {!collapsed && (
                <AnimatePresence mode="wait">
                    <motion.span
                        key={theme}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                        className="text-sm font-medium whitespace-nowrap"
                    >
                        {theme === "dark" ? "Dark Mode" : "Light Mode"}
                    </motion.span>
                </AnimatePresence>
            )}
        </button>
    );
}
