import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { achievements, subjectData, aiMetrics } from "@/data/mockData";
import { User, Star, Flame, Trophy, Clock, Target, Shield, TrendingUp, BookOpen, Activity } from "lucide-react";

function MiniRing({ value, color, size = 40 }: { value: number; color: string; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="hsl(225 20% 14%)" strokeWidth="5" />
      <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
        strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ transform: "rotate(-90deg)", transformOrigin: "center", filter: `drop-shadow(0 0 3px ${color}80)` }} />
    </svg>
  );
}

export default function Profile() {
  const { profile, logout } = useAuth();

  const scores = [
    { label: "Academic Health", value: aiMetrics.academicHealth, color: "hsl(191 100% 50%)", icon: Activity },
    { label: "Productivity", value: aiMetrics.productivity, color: "hsl(263 70% 60%)", icon: Zap },
    { label: "Consistency", value: aiMetrics.consistency, color: "hsl(142 76% 55%)", icon: Shield },
    { label: "Focus Score", value: aiMetrics.focus, color: "hsl(45 100% 58%)", icon: Target },
    { label: "Knowledge Retention", value: 71, color: "hsl(340 82% 62%)", icon: BookOpen },
    { label: "Predicted Score", value: aiMetrics.predictedScore, color: "hsl(15 100% 65%)", icon: TrendingUp },
  ];

  const xpPercent = ((profile?.xp || 0) % 1000) / 10;

  return (
    <div className="p-4 lg:p-6 space-y-6 min-h-screen pb-24 lg:pb-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl lg:text-2xl font-orbitron font-bold gradient-text-primary">My Profile</h1>
        <p className="text-muted-foreground text-xs mt-1">Learning intelligence overview · performance summary</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          className="glass-card p-6 text-center lg:col-span-1">
          {/* Avatar */}
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="w-full h-full rounded-full flex items-center justify-center text-2xl font-bold"
              style={{ background: "var(--gradient-secondary)" }}>
              {profile?.name?.charAt(0)}
            </div>
            {/* Online ring */}
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-neon-green border-2 border-background flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            </div>
          </div>

          <h2 className="font-bold text-lg">{profile?.name}</h2>
          <p className="text-xs text-muted-foreground mb-1">{profile?.email}</p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-xs text-primary font-medium">{profile?.examGoal} Aspirant</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { icon: Star, label: "Level", value: profile?.level, color: "text-gold" },
              { icon: Flame, label: "Streak", value: `${profile?.streak}d`, color: "text-coral" },
              { icon: Trophy, label: "XP Points", value: profile?.xp, color: "text-violet" },
              { icon: Clock, label: "Study Hours", value: `${profile?.totalStudyHours}h`, color: "text-cyan" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="p-3 rounded-xl bg-muted/30 border border-border">
                <Icon className={`w-4 h-4 ${color} mx-auto mb-1.5`} />
                <p className={`font-bold text-sm ${color}`}>{value}</p>
                <p className="text-[10px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          {/* XP Progress */}
          <div className="text-left">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-gold" /> Level {profile?.level}</span>
              <span>{profile?.xp} / {(profile?.level || 1) * 1000} XP</span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: "var(--gradient-gold)" }}
                initial={{ width: 0 }} animate={{ width: `${xpPercent}%` }} transition={{ duration: 1, delay: 0.5 }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 text-right">{1000 - ((profile?.xp || 0) % 1000)} XP to Level {(profile?.level || 1) + 1}</p>
          </div>

          <button onClick={logout}
            className="mt-4 w-full py-2.5 rounded-xl border border-destructive/30 text-destructive text-xs font-medium hover:bg-destructive/10 transition-all">
            Sign Out
          </button>
        </motion.div>

        {/* Right side */}
        <div className="lg:col-span-2 space-y-5">
          {/* Academic Profile */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-cyan" /> Academic Profile
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "Class", value: profile?.class },
                { label: "Board", value: profile?.board },
                { label: "Exam Goal", value: profile?.examGoal },
                { label: "Daily Study", value: `${profile?.dailyStudyHours}h/day` },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl bg-muted/30 border border-border">
                  <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
                  <p className="font-semibold text-sm">{value}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 rounded-xl bg-muted/30 border border-border">
                <p className="text-[10px] text-muted-foreground mb-2">Subjects</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile?.subjects.map(s => <span key={s} className="px-2 py-0.5 rounded-full text-xs bg-cyan/10 text-cyan border border-cyan/20">{s}</span>)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 border border-border">
                <p className="text-[10px] text-muted-foreground mb-2">Career Interests</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile?.careerInterests.map(c => <span key={c} className="px-2 py-0.5 rounded-full text-xs bg-violet/10 text-violet border border-violet/20">{c}</span>)}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Performance Rings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-violet" /> Performance Intelligence Scores
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {scores.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div key={s.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.07 }}
                    className="text-center" whileHover={{ y: -3 }}>
                    <div className="relative inline-block mb-2">
                      <MiniRing value={s.value} color={s.color} size={48} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-bold" style={{ color: s.color }}>{s.value}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">{s.label.split(" ").slice(-1)}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Subject Mastery */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-gold" /> Subject Mastery
            </h2>
            <div className="space-y-3">
              {subjectData.map((s, i) => (
                <motion.div key={s.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.07 }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                      <span className="text-sm font-medium">{s.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                        s.level === "Strong" ? "bg-neon-green/15 text-neon-green" :
                        s.level === "Medium" ? "bg-gold/15 text-gold" : "bg-coral/15 text-coral"}`}>
                        {s.level}
                      </span>
                    </div>
                    <span className="text-sm font-orbitron font-bold" style={{ color: s.color }}>{s.score}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}60` }}
                      initial={{ width: 0 }} animate={{ width: `${s.score}%` }} transition={{ duration: 0.8, delay: 0.5 + i * 0.07 }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Achievements */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2 text-sm"><Trophy className="w-4 h-4 text-gold" /> Achievements</h2>
          <span className="text-xs text-muted-foreground">{achievements.filter(a => a.unlocked).length}/{achievements.length} unlocked · {achievements.filter(a => a.unlocked).reduce((s, a) => s + a.xp, 0)} XP earned</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {achievements.map(a => (
            <motion.div key={a.id} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all cursor-pointer ${a.unlocked ? "border-gold/30 bg-gold/5 shadow-[0_0_12px_hsl(45_100%_58%/0.1)]" : "border-border bg-muted/20 opacity-40 grayscale"}`}
              title={`${a.name}: ${a.desc}`}>
              <div className="text-xl">{a.icon}</div>
              <div className="text-[10px] text-center text-muted-foreground font-medium leading-tight">{a.name}</div>
              <div className="text-[10px] text-gold font-mono">+{a.xp}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Fix missing import
function Zap({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
}
