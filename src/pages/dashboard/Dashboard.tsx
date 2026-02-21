import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Clock, BookOpen, TrendingUp, Target, Flame, Download } from "lucide-react";
import { downloadDashboardPdf } from "@/utils/downloadPdf";

const DUMMY_STATS = {
  totalStudyTime: 1240,
  averageQuizScore: 78,
  streak: 5,
};

const DUMMY_STUDY_TIME_PER_SUBJECT = [
  { name: "Mathematics", value: 320, color: "#00d4ff" },
  { name: "Physics", value: 280, color: "#7c3aed" },
  { name: "Chemistry", value: 240, color: "#22c55e" },
  { name: "Biology", value: 200, color: "#f59e0b" },
  { name: "English", value: 200, color: "#ec4899" },
];

const DUMMY_LAST_7_DAYS = [
  { day: "Mon", minutes: 45 },
  { day: "Tue", minutes: 120 },
  { day: "Wed", minutes: 90 },
  { day: "Thu", minutes: 180 },
  { day: "Fri", minutes: 60 },
  { day: "Sat", minutes: 240 },
  { day: "Sun", minutes: 105 },
];

const DUMMY_RECENT_SESSIONS = [
  { subject: "Mathematics", topic: "Calculus", minutes: 45, score: 85 },
  { subject: "Physics", topic: "Thermodynamics", minutes: 60, score: 72 },
  { subject: "Chemistry", topic: "Organic Chemistry", minutes: 30, score: 90 },
  { subject: "Biology", topic: "Cell Division", minutes: 40, score: 78 },
];

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border/50 bg-card/80 p-4 flex items-start gap-3 backdrop-blur-sm"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}20` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-orbitron font-bold" style={{ color }}>
          {value}
        </p>
        {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const totalHours = Math.floor(DUMMY_STATS.totalStudyTime / 60);
  const totalMins = DUMMY_STATS.totalStudyTime % 60;

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await downloadDashboardPdf({
        elementId: "dashboard-report",
        filename: `Dashboard_Report_${new Date().toISOString().split("T")[0]}.pdf`,
        title: "Learning Dashboard Report",
        userName: user?.name,
      });
    } catch (error) {
      console.error("Failed to download PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-orbitron mb-1">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back{user?.name ? `, ${user.name}` : ""}. Here's your learning overview.
          </p>
        </div>
        <button
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-cyan-500 to-cyan-600 text-black hover:from-cyan-400 hover:to-cyan-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed self-start sm:self-auto"
        >
          {isDownloading ? (
            <>
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download Report
            </>
          )}
        </button>
      </div>

      <div id="dashboard-report" className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Clock}
            label="Total study time"
            value={`${totalHours}h ${totalMins}m`}
            sub="All time"
            color="#00d4ff"
          />
          <StatCard
            icon={Target}
            label="Avg quiz score"
            value={`${DUMMY_STATS.averageQuizScore}%`}
            sub="Across subjects"
            color="#22c55e"
          />
          <StatCard
            icon={Flame}
            label="Current streak"
            value={`${DUMMY_STATS.streak} days`}
            sub="Keep it up!"
            color="#f59e0b"
          />
          <StatCard
            icon={BookOpen}
            label="Sessions this week"
            value="12"
            sub="Last 7 days"
            color="#7c3aed"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border/50 bg-card/80 p-4 backdrop-blur-sm"
          >
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Study time (last 7 days)
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={DUMMY_LAST_7_DAYS}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value} min`, "Study time"]}
                />
                <Bar dataKey="minutes" fill="#00d4ff" radius={[4, 4, 0, 0]} name="Minutes" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border border-border/50 bg-card/80 p-4 backdrop-blur-sm"
          >
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-violet-400" />
              Time by subject
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={DUMMY_STUDY_TIME_PER_SUBJECT}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name} ${value}m`}
                >
                  {DUMMY_STUDY_TIME_PER_SUBJECT.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value} min`, ""]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border/50 bg-card/80 p-4 backdrop-blur-sm"
        >
          <h2 className="text-sm font-semibold mb-4">Recent sessions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="pb-2 pr-4">Subject</th>
                  <th className="pb-2 pr-4">Topic</th>
                  <th className="pb-2 pr-4">Minutes</th>
                  <th className="pb-2">Quiz score</th>
                </tr>
              </thead>
              <tbody>
                {DUMMY_RECENT_SESSIONS.map((s, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-3 pr-4 font-medium">{s.subject}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{s.topic}</td>
                    <td className="py-3 pr-4">{s.minutes} min</td>
                    <td className="py-3">{s.score}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
