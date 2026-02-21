import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BarChart3, TrendingUp, PieChart as PieIcon } from "lucide-react";

// Dummy analytics data
const DUMMY_WEEKLY_TREND = [
  { week: "Week 1", hours: 8.5 },
  { week: "Week 2", hours: 12 },
  { week: "Week 3", hours: 10.5 },
  { week: "Week 4", hours: 14 },
  { week: "Week 5", hours: 11 },
  { week: "Week 6", hours: 15 },
];

const DUMMY_DAILY_BREAKDOWN = [
  { day: "Mon", planned: 2, actual: 1.5 },
  { day: "Tue", planned: 2, actual: 2.25 },
  { day: "Wed", planned: 2, actual: 1.75 },
  { day: "Thu", planned: 2, actual: 2.5 },
  { day: "Fri", planned: 2, actual: 1 },
  { day: "Sat", planned: 3, actual: 4 },
  { day: "Sun", planned: 2, actual: 1.75 },
];

const DUMMY_DIFFICULTY_DIST = [
  { name: "Easy", value: 35, color: "#22c55e" },
  { name: "Medium", value: 45, color: "#f59e0b" },
  { name: "Hard", value: 20, color: "#ef4444" },
];

const DUMMY_QUIZ_SCORES = [
  { subject: "Math", score: 85 },
  { subject: "Physics", score: 72 },
  { subject: "Chemistry", score: 90 },
  { subject: "Biology", score: 78 },
  { subject: "English", score: 88 },
];

export default function Analytics() {
  const { user } = useAuth();

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-orbitron mb-1">Analytics</h1>
        <p className="text-muted-foreground">
          Study analytics and insights{user?.name ? ` for ${user.name}` : ""}.
        </p>
      </div>

      {/* Weekly trend line chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border/50 bg-card/80 p-4 backdrop-blur-sm"
      >
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          Weekly study hours (last 6 weeks)
        </h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={DUMMY_WEEKLY_TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value} hrs`, "Study hours"]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#00d4ff"
              strokeWidth={2}
              dot={{ fill: "#00d4ff" }}
              name="Hours"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Planned vs actual */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border/50 bg-card/80 p-4 backdrop-blur-sm"
        >
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-violet-400" />
            Planned vs actual (this week, hours)
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={DUMMY_DAILY_BREAKDOWN}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="planned" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Planned (hrs)" />
              <Bar dataKey="actual" fill="#00d4ff" radius={[4, 4, 0, 0]} name="Actual (hrs)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Difficulty distribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-border/50 bg-card/80 p-4 backdrop-blur-sm"
        >
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-amber-400" />
            Sessions by difficulty
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={DUMMY_DIFFICULTY_DIST}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name} ${value}%`}
              >
                {DUMMY_DIFFICULTY_DIST.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`${value}%`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Quiz scores by subject */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-border/50 bg-card/80 p-4 backdrop-blur-sm"
      >
        <h2 className="text-sm font-semibold mb-4">Quiz scores by subject</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={DUMMY_QUIZ_SCORES} layout="vertical" margin={{ left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis dataKey="subject" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={50} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value}%`, "Score"]}
            />
            <Bar dataKey="score" fill="#22c55e" radius={[0, 4, 4, 0]} name="Score %" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
