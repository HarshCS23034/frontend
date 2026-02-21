import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: number;
  subtitle?: string;
  color: string;
  icon: ReactNode;
  suffix?: string;
  trend?: number;
  delay?: number;
}

function CircleProgress({ value, color, size = 80 }: { value: number; color: string; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={6} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold font-orbitron" style={{ color }}>{value}</span>
      </div>
    </div>
  );
}

export default function MetricCard({ title, value, subtitle, color, icon, suffix = "", trend, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card-hover p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-1">{title}</p>
          {trend !== undefined && (
            <span className={`text-xs font-medium ${trend >= 0 ? "text-neon-green" : "text-coral"}`}>
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% vs last week
            </span>
          )}
        </div>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-muted/50 border border-border">
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-orbitron font-bold" style={{ color }}>
            {value}<span className="text-lg">{suffix}</span>
          </div>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <CircleProgress value={value} color={color} />
      </div>
    </motion.div>
  );
}
