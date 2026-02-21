import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";

interface Topic {
  name: string;
  mastery: number;
  trend: string;
}

interface SubjectCardProps {
  name: string;
  score: number;
  level: "Strong" | "Medium" | "Weak";
  color: string;
  topics: Topic[];
  weeklyHours: number;
  quizScore: number;
  consistency: number;
  delay?: number;
}

const LEVEL_CONFIG = {
  Strong: { bg: "bg-neon-green/10", border: "border-neon-green/30", text: "text-neon-green", emoji: "💪" },
  Medium: { bg: "bg-violet/10", border: "border-violet/30", text: "text-violet", emoji: "📈" },
  Weak: { bg: "bg-coral/10", border: "border-coral/30", text: "text-coral", emoji: "⚠️" },
};

export default function SubjectCard({ name, score, level, color, topics, weeklyHours, quizScore, consistency, delay = 0 }: SubjectCardProps) {
  const config = LEVEL_CONFIG[level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-5 group cursor-pointer hover:border-opacity-60 transition-all duration-300"
      style={{ borderColor: `${color}20` }}
      whileHover={{ y: -3, boxShadow: `0 8px 32px ${color}25` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-sm mb-1">{name}</h3>
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${config.bg} ${config.border} ${config.text}`}>
            {config.emoji} {level}
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-orbitron font-bold" style={{ color }}>{score}</div>
          <div className="text-xs text-muted-foreground">/ 100</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}80` }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: delay + 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "Hours/wk", val: `${weeklyHours}h` },
          { label: "Quiz", val: `${quizScore}%` },
          { label: "Consistency", val: `${consistency}%` },
        ].map(s => (
          <div key={s.label} className="text-center p-2 rounded-lg bg-muted/30">
            <div className="text-sm font-semibold" style={{ color }}>{s.val}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Top topics */}
      <div className="space-y-1.5">
        {topics.slice(0, 3).map(t => (
          <div key={t.name} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground truncate mr-2">{t.name}</span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${t.mastery}%`, background: color }} />
              </div>
              <span className="text-foreground w-6 text-right">{t.mastery}%</span>
              {t.trend === "up" ? <TrendingUp className="w-3 h-3 text-neon-green" /> :
                t.trend === "down" ? <TrendingDown className="w-3 h-3 text-coral" /> :
                  <Minus className="w-3 h-3 text-muted-foreground" />}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end mt-3 text-xs text-muted-foreground group-hover:text-primary transition-colors">
        View details <ChevronRight className="w-3 h-3 ml-1" />
      </div>
    </motion.div>
  );
}
