import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Brain, Target, AlertTriangle, Zap, BookOpen } from "lucide-react";

// Dummy prediction data
const DUMMY_SUGGESTED_FOCUS = [
  { rank: 1, subject: "Chemistry", reason: "Low quiz score last week", suggestedMinutes: 45, priority: "high" },
  { rank: 2, subject: "Physics", reason: "Topic mastery below target", suggestedMinutes: 60, priority: "high" },
  { rank: 3, subject: "Mathematics", reason: "Keep momentum", suggestedMinutes: 30, priority: "medium" },
  { rank: 4, subject: "Biology", reason: "Revision recommended", suggestedMinutes: 25, priority: "medium" },
];

const DUMMY_METRICS = {
  completionRate: 78,
  burnoutRisk: "Low",
  expectedWeeklyHours: 12,
  nextBestTopic: "Organic Chemistry",
  confidence: 85,
};

export default function Prediction() {
  const { user } = useAuth();

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-orbitron mb-1">Prediction</h1>
        <p className="text-muted-foreground">
          AI-powered learning predictions and recommendations.
        </p>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border/50 bg-card/80 p-4 backdrop-blur-sm flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/20">
            <Target className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Completion rate</p>
            <p className="text-xl font-orbitron font-bold text-cyan-400">{DUMMY_METRICS.completionRate}%</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-xl border border-border/50 bg-card/80 p-4 backdrop-blur-sm flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/20">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Burnout risk</p>
            <p className="text-xl font-orbitron font-bold text-amber-400">{DUMMY_METRICS.burnoutRisk}</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border/50 bg-card/80 p-4 backdrop-blur-sm flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-500/20">
            <Zap className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Expected this week</p>
            <p className="text-xl font-orbitron font-bold text-violet-400">{DUMMY_METRICS.expectedWeeklyHours} hrs</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-border/50 bg-card/80 p-4 backdrop-blur-sm flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-500/20">
            <Brain className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Model confidence</p>
            <p className="text-xl font-orbitron font-bold text-green-400">{DUMMY_METRICS.confidence}%</p>
          </div>
        </motion.div>
      </div>

      {/* Suggested focus */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-border/50 bg-card/80 p-4 backdrop-blur-sm"
      >
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          Suggested focus (dummy data)
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          Recommended topics based on your progress. Next best topic: <strong>{DUMMY_METRICS.nextBestTopic}</strong>.
        </p>
        <div className="space-y-3">
          {DUMMY_SUGGESTED_FOCUS.map((item) => (
            <div
              key={item.rank}
              className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/30 border border-border/50"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                  {item.rank}
                </span>
                <div>
                  <p className="font-medium">{item.subject}</p>
                  <p className="text-xs text-muted-foreground">{item.reason}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-orbitron text-cyan-400">{item.suggestedMinutes} min</p>
                <p className="text-[10px] text-muted-foreground capitalize">{item.priority} priority</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
