import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Calendar, Clock, Zap, CheckCircle2, Plus, Flame, X,
  Loader2, AlertCircle, BookOpen, TrendingUp, Brain,
  Target, BarChart3, Trash2, ArrowUpRight, Activity, Shield,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "";
const API = API_BASE ? `${API_BASE}/api` : "/api";

// â”€â”€â”€ Colors â”€â”€â”€
const CHART_COLORS = [
  "#00d4ff", "#7c3aed", "#f59e0b", "#22c55e", "#ef4444",
  "#ec4899", "#06b6d4", "#f97316", "#8b5cf6", "#14b8a6",
];
const DIFF_COLOR_MAP: Record<string, string> = {
  "1": "#22c55e", "2": "#22c55e", "3": "#4ade80",
  "4": "#f59e0b", "5": "#f59e0b", "6": "#eab308", "7": "#f97316",
  "8": "#ef4444", "9": "#ef4444", "10": "#dc2626",
};

const SUBJECT_OPTIONS = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "English", "Computer Science", "History", "Geography",
  "Economics", "Political Science",
];

// â”€â”€â”€ Types â”€â”€â”€
interface DbSession {
  _id: string;
  title: string;
  subject: string;
  topic?: string;
  date: string;
  startTime: string;
  endTime: string;
  studyMinutes: number;
  estimatedDifficulty: number;
  notes?: string;
  goals?: string;
  completed: boolean;
  quizScore?: number;
  createdAt: string;
}

interface DashboardData {
  totalStudyTime: number;
  totalSessions: number;
  completedSessions: number;
  avgDifficulty: number;
  avgMinutesPerDay: number;
  streak: number;
  studyTimePerSubject: { subject: string; totalMinutes: number }[];
  dailyHours: { date: string; label: string; hours: number; minutes: number }[];
  sessionCompletion: { day: string; planned: number; completed: number }[];
  difficultyVsTime: { difficulty: number; minutes: number; subject: string }[];
  predictions: {
    completionRate: number;
    burnoutRisk: string;
    suggestedPlan: { rank: number; subject: string; reason: string; suggestedMinutes: number; avgDifficulty: number }[];
    expectedWeeklyHours: number;
  };
}

// â”€â”€â”€ Custom tooltip â”€â”€â”€
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background/95 backdrop-blur border border-border rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// â”€â”€â”€ Stat Card â”€â”€â”€
function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}20` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-orbitron font-bold" style={{ color }}>{value}</p>
        {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      </div>
    </motion.div>
  );
}

// â”€â”€â”€ Add Session Form â”€â”€â”€
function AddSessionForm({ onClose, onCreated, token }: {
  onClose: () => void; onCreated: (s: DbSession) => void; token: string | null;
}) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [difficulty, setDifficulty] = useState(5);
  const [notes, setNotes] = useState("");
  const [goals, setGoals] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !subject || !date || !startTime || !endTime) {
      setError("Title, subject, date, and times are required."); return;
    }
    if (startTime >= endTime) {
      setError("End time must be after start time."); return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: title.trim(), subject, date, startTime, endTime, estimatedDifficulty: difficulty, notes, goals }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Failed to save."); setSaving(false); return; }
      onCreated(data);
    } catch { setError("Network error. Is the backend running?"); }
    finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
      <form onSubmit={handleSubmit} className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan" /> New Study Session
          </h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-muted/50 transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Session Title *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Morning Math Practice"
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm focus:border-cyan/50 focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Subject *</label>
            <select value={subject} onChange={e => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm focus:border-cyan/50 focus:outline-none">
              <option value="">Selectâ€¦</option>
              {SUBJECT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Date *</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm focus:border-cyan/50 focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Start Time *</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm focus:border-cyan/50 focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">End Time *</label>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm focus:border-cyan/50 focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Difficulty (1â€“10): <span className="font-bold" style={{ color: DIFF_COLOR_MAP[String(difficulty)] }}>{difficulty}</span></label>
            <input type="range" min="1" max="10" value={difficulty} onChange={e => setDifficulty(Number(e.target.value))}
              className="w-full accent-cyan h-2" />
            <div className="flex justify-between text-[9px] text-muted-foreground"><span>Easy</span><span>Hard</span></div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Goals (optional)</label>
            <input type="text" value={goals} onChange={e => setGoals(e.target.value)} placeholder="e.g. Finish Chapter 5"
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm focus:border-cyan/50 focus:outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-muted-foreground mb-1 block">Notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any additional notesâ€¦" rows={2}
              className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm focus:border-cyan/50 focus:outline-none resize-none" />
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="w-full py-2.5 rounded-lg text-sm font-medium transition-all btn-gradient-primary text-black disabled:opacity-50 flex items-center justify-center gap-2">
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Savingâ€¦</> : <><Plus className="w-4 h-4" /> Save Session</>}
        </button>
      </form>
    </motion.div>
  );
}

// â”€â”€â”€ Main Planner â”€â”€â”€
export default function Planner() {
  const { token } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [sessions, setSessions] = useState<DbSession[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchData = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    try {
      const [sessRes, dashRes] = await Promise.all([
        fetch(`${API}/sessions`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/dashboard`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (sessRes.ok) setSessions(await sessRes.json());
      if (dashRes.ok) setDashboard(await dashRes.json());
    } catch { console.error("[Planner] fetch failed"); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreated = (s: DbSession) => {
    setSessions(prev => [s, ...prev]);
    setShowForm(false);
    setSuccessMsg(`âœ… "${s.title}" saved!`);
    setTimeout(() => setSuccessMsg(""), 3000);
    // Refresh dashboard
    setTimeout(() => fetchData(), 300);
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await fetch(`${API}/sessions/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const updated = await res.json();
        setSessions(prev => prev.map(s => s._id === id ? updated : s));
        setTimeout(() => fetchData(), 300);
      }
    } catch { }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API}/sessions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSessions(prev => prev.filter(s => s._id !== id));
        setTimeout(() => fetchData(), 300);
      }
    } catch { }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen gap-2 text-muted-foreground">
      <Loader2 className="w-5 h-5 animate-spin" /> Loading Plannerâ€¦
    </div>
  );

  const d = dashboard;
  const hasSessions = sessions.length > 0;

  return (
    <div className="p-4 lg:p-6 space-y-6 min-h-screen pb-24 lg:pb-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-orbitron font-bold mb-1 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-cyan" />
            <span className="gradient-text-primary">Study Planner</span>
          </h1>
          <p className="text-muted-foreground text-xs lg:text-sm">Your real data Â· dynamic graphs Â· AI predictions</p>
        </div>
        <button onClick={() => setShowForm(f => !f)}
          className="px-4 py-2 rounded-lg text-xs font-medium transition-all bg-cyan/20 text-cyan border border-cyan/30 hover:bg-cyan/30 flex items-center gap-1.5">
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showForm ? "Cancel" : "New Session"}
        </button>
      </motion.div>

      {/* Success toast */}
      <AnimatePresence>
        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="px-4 py-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && <AddSessionForm onClose={() => setShowForm(false)} onCreated={handleCreated} token={token} />}
      </AnimatePresence>

      {/* â”€â”€â”€ Stats Row â”€â”€â”€ */}
      {d && hasSessions && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Clock} label="Total Study Time" value={`${Math.floor(d.totalStudyTime / 60)}h ${d.totalStudyTime % 60}m`} color="#00d4ff" />
          <StatCard icon={BarChart3} label="Sessions" value={`${d.completedSessions}/${d.totalSessions}`} sub="Completed / Total" color="#7c3aed" />
          <StatCard icon={Activity} label="Avg/Day" value={`${Math.floor(d.avgMinutesPerDay / 60)}h ${d.avgMinutesPerDay % 60}m`} sub="Last 30 days" color="#22c55e" />
          <StatCard icon={Flame} label="Active Days" value={d.streak} sub="Last 30 days" color="#f59e0b" />
        </div>
      )}

      {/* â”€â”€â”€ Charts Grid â”€â”€â”€ */}
      {d && hasSessions && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Hours (Line) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
            <h2 className="font-semibold text-sm flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-cyan" /> Daily Study Hours (14 days)
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={d.dailyHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 20% 18%)" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(225 10% 50%)" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(225 10% 50%)" }} unit="h" />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="hours" stroke="#00d4ff" strokeWidth={2} dot={{ r: 3, fill: "#00d4ff" }} name="Hours" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Subject Distribution (Pie) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
            <h2 className="font-semibold text-sm flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-violet" /> Subject Distribution
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={d.studyTimePerSubject.map(s => ({ name: s.subject, value: s.totalMinutes }))}
                  cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}>
                  {d.studyTimePerSubject.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Session Completion (Bar) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
            <h2 className="font-semibold text-sm flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-neon-green" /> Planned vs Completed (7 days)
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={d.sessionCompletion}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 20% 18%)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(225 10% 50%)" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(225 10% 50%)" }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="planned" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Planned" />
                <Bar dataKey="completed" fill="#22c55e" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Difficulty vs Time (Scatter) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-5">
            <h2 className="font-semibold text-sm flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-gold" /> Difficulty vs Time Spent
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 20% 18%)" />
                <XAxis dataKey="difficulty" type="number" domain={[0, 11]} name="Difficulty" tick={{ fontSize: 10, fill: "hsl(225 10% 50%)" }} label={{ value: "Difficulty", position: "insideBottom", offset: -5, fontSize: 10, fill: "hsl(225 10% 50%)" }} />
                <YAxis dataKey="minutes" name="Minutes" tick={{ fontSize: 10, fill: "hsl(225 10% 50%)" }} label={{ value: "Minutes", angle: -90, position: "insideLeft", fontSize: 10, fill: "hsl(225 10% 50%)" }} />
                <Tooltip content={<CustomTooltip />} />
                <Scatter data={d.difficultyVsTime} fill="#f59e0b" name="Sessions">
                  {d.difficultyVsTime.map((entry, i) => (
                    <Cell key={i} fill={DIFF_COLOR_MAP[String(entry.difficulty)] || "#f59e0b"} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {/* â”€â”€â”€ AI Predictions â”€â”€â”€ */}
      {d && hasSessions && d.predictions && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <Brain className="w-4 h-4 text-violet" /> AI Predictions & Insights
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Completion Rate */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <ArrowUpRight className="w-4 h-4 text-cyan" />
                <span className="text-xs font-medium">Expected Completion Rate</span>
              </div>
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(225 20% 14%)" strokeWidth="8" />
                  <motion.circle cx="50" cy="50" r="40" fill="none" stroke="#00d4ff" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 40}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - d.predictions.completionRate / 100) }}
                    transition={{ duration: 1.2 }}
                    style={{ filter: "drop-shadow(0 0 6px #00d4ff80)" }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-orbitron font-bold text-cyan">{d.predictions.completionRate}%</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground text-center">Based on your last 30 days</p>
            </div>

            {/* Burnout Risk */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-gold" />
                <span className="text-xs font-medium">Burnout Risk</span>
              </div>
              <div className="flex items-center justify-center my-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-lg font-orbitron font-bold border-2 ${d.predictions.burnoutRisk === "Low" ? "border-green-500/30 text-green-400 bg-green-500/10"
                    : d.predictions.burnoutRisk === "Medium" ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/10"
                      : "border-red-500/30 text-red-400 bg-red-500/10"
                  }`}>
                  {d.predictions.burnoutRisk}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground text-center">
                Avg {Math.floor(d.avgMinutesPerDay / 60)}h {d.avgMinutesPerDay % 60}m/day Â· Difficulty {d.avgDifficulty}/10
              </p>
              <p className="text-[10px] text-muted-foreground text-center mt-1">
                Projected: {d.predictions.expectedWeeklyHours}h/week
              </p>
            </div>

            {/* Suggested Study Plan */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-violet" />
                <span className="text-xs font-medium">AI-Suggested Focus</span>
              </div>
              <div className="space-y-2">
                {d.predictions.suggestedPlan.length > 0 ? d.predictions.suggestedPlan.map((item) => (
                  <div key={item.rank} className="flex items-start gap-2 p-2 rounded-lg bg-muted/20">
                    <span className="text-xs font-orbitron font-bold text-cyan w-5">#{item.rank}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium">{item.subject}</p>
                      <p className="text-[10px] text-muted-foreground">{item.reason}</p>
                      <p className="text-[10px] text-cyan">â†’ {item.suggestedMinutes}min/day recommended</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-muted-foreground text-center py-4">Add sessions to get AI suggestions</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* â”€â”€â”€ Sessions List â”€â”€â”€ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan" /> All Sessions
          </h2>
          <span className="text-xs text-muted-foreground">{sessions.length} recorded</span>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
            <p className="text-muted-foreground text-sm mb-1">No study sessions yet</p>
            <p className="text-muted-foreground text-xs">Click <strong>"New Session"</strong> to log your first study session.</p>
            <p className="text-muted-foreground text-xs mt-1">Dynamic charts and AI predictions will appear once you have data!</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {sessions.map(s => {
              const dateStr = new Date(s.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
              return (
                <motion.div key={s._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${s.completed ? "border-green-500/20 bg-green-500/5 opacity-70" : "border-border hover:border-primary/30 hover:bg-muted/20"
                    }`}>
                  {/* Completion toggle */}
                  <button onClick={() => handleToggle(s._id)} className="flex-shrink-0 group">
                    {s.completed
                      ? <CheckCircle2 className="w-5 h-5 text-green-400 group-hover:text-green-300" />
                      : <div className="w-5 h-5 rounded-full border-2 border-muted-foreground group-hover:border-cyan transition-colors" />}
                  </button>
                  {/* Difficulty bar */}
                  <div className="w-1.5 h-10 rounded-full flex-shrink-0"
                    style={{ background: DIFF_COLOR_MAP[String(s.estimatedDifficulty)] || "#f59e0b" }} />
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${s.completed ? "line-through text-muted-foreground" : ""}`}>{s.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.subject} Â· {s.startTime}â€“{s.endTime} Â· {s.studyMinutes}min Â·
                      <span style={{ color: DIFF_COLOR_MAP[String(s.estimatedDifficulty)] }}> D{s.estimatedDifficulty}</span>
                    </p>
                    {s.goals && <p className="text-[10px] text-cyan mt-0.5">ðŸŽ¯ {s.goals}</p>}
                  </div>
                  {/* Date & delete */}
                  <div className="text-right flex-shrink-0 flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">{dateStr}</span>
                    <button onClick={() => handleDelete(s._id)} className="p-1 rounded hover:bg-red-500/10 transition-colors group">
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground group-hover:text-red-400" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
