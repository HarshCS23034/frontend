// Mock AI data for the platform

export const subjectData = [
  {
    name: "Mathematics",
    score: 88,
    level: "Strong",
    color: "#00d4ff",
    topics: [
      { name: "Calculus", mastery: 92, trend: "up" },
      { name: "Algebra", mastery: 88, trend: "up" },
      { name: "Trigonometry", mastery: 85, trend: "stable" },
      { name: "Statistics", mastery: 78, trend: "up" },
      { name: "Coordinate Geometry", mastery: 91, trend: "up" },
    ],
    weeklyHours: 8,
    quizScore: 91,
    consistency: 94,
  },
  {
    name: "Physics",
    score: 79,
    level: "Medium",
    color: "#7c3aed",
    topics: [
      { name: "Mechanics", mastery: 85, trend: "up" },
      { name: "Electrostatics", mastery: 72, trend: "down" },
      { name: "Thermodynamics", mastery: 78, trend: "stable" },
      { name: "Optics", mastery: 82, trend: "up" },
      { name: "Modern Physics", mastery: 68, trend: "down" },
    ],
    weeklyHours: 6,
    quizScore: 76,
    consistency: 82,
  },
  {
    name: "Chemistry",
    score: 58,
    level: "Weak",
    color: "#f59e0b",
    topics: [
      { name: "Organic Chemistry", mastery: 52, trend: "down" },
      { name: "Physical Chemistry", mastery: 65, trend: "stable" },
      { name: "Inorganic Chemistry", mastery: 58, trend: "down" },
      { name: "Electrochemistry", mastery: 45, trend: "down" },
      { name: "Chemical Kinetics", mastery: 61, trend: "up" },
    ],
    weeklyHours: 4,
    quizScore: 55,
    consistency: 62,
  },
  {
    name: "Biology",
    score: 74,
    level: "Medium",
    color: "#22c55e",
    topics: [
      { name: "Cell Biology", mastery: 82, trend: "up" },
      { name: "Genetics", mastery: 78, trend: "stable" },
      { name: "Human Physiology", mastery: 72, trend: "up" },
      { name: "Ecology", mastery: 65, trend: "down" },
      { name: "Evolution", mastery: 70, trend: "stable" },
    ],
    weeklyHours: 5,
    quizScore: 72,
    consistency: 76,
  },
];

export const aiMetrics = {
  academicHealth: 76,
  productivity: 82,
  consistency: 74,
  focus: 88,
  predictedScore: 78,
  confidence: 85,
  overallRank: "Top 15%",
};

export const weeklyActivity = [
  { day: "Mon", hours: 5.5, tasks: 8, score: 82 },
  { day: "Tue", hours: 6.0, tasks: 10, score: 88 },
  { day: "Wed", hours: 4.5, tasks: 7, score: 75 },
  { day: "Thu", hours: 7.0, tasks: 12, score: 91 },
  { day: "Fri", hours: 5.0, tasks: 9, score: 84 },
  { day: "Sat", hours: 8.5, tasks: 14, score: 92 },
  { day: "Sun", hours: 3.0, tasks: 5, score: 70 },
];

export const predictionData = [
  { month: "Sep", predicted: 62, actual: 60 },
  { month: "Oct", predicted: 67, actual: 65 },
  { month: "Nov", predicted: 70, actual: 68 },
  { month: "Dec", predicted: 73, actual: 72 },
  { month: "Jan", predicted: 76, actual: 74 },
  { month: "Feb", predicted: 78, actual: null },
  { month: "Mar", predicted: 81, actual: null },
  { month: "Apr", predicted: 84, actual: null },
  { month: "May", predicted: 87, actual: null },
];

export const heatmapData = Array.from({ length: 52 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => ({
    week,
    day,
    value: Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : 0,
  }))
).flat();

export const achievements = [
  { id: 1, name: "First Step", desc: "Complete your first study session", xp: 50, unlocked: true, icon: "🎯" },
  { id: 2, name: "Week Warrior", desc: "Study for 7 consecutive days", xp: 200, unlocked: true, icon: "⚡" },
  { id: 3, name: "Math Wizard", desc: "Score 90%+ in Math quiz", xp: 300, unlocked: true, icon: "🧮" },
  { id: 4, name: "Night Owl", desc: "Complete 10 late-night sessions", xp: 150, unlocked: true, icon: "🦉" },
  { id: 5, name: "Speed Learner", desc: "Finish a topic in record time", xp: 100, unlocked: true, icon: "🚀" },
  { id: 6, name: "Perfectionist", desc: "Score 100% in any quiz", xp: 500, unlocked: false, icon: "💎" },
  { id: 7, name: "Bookworm", desc: "Study 100 hours total", xp: 400, unlocked: false, icon: "📚" },
  { id: 8, name: "Legend", desc: "Reach Level 20", xp: 1000, unlocked: false, icon: "👑" },
];

export const careerPaths = [
  {
    path: "Software Engineering",
    match: 92,
    color: "#00d4ff",
    icon: "💻",
    topSubjects: ["Mathematics", "Physics"],
    description: "Build the future of technology",
    salary: "₹12-40 LPA",
    growth: "High",
  },
  {
    path: "Data Science & AI",
    match: 88,
    color: "#7c3aed",
    icon: "🤖",
    topSubjects: ["Mathematics", "Statistics"],
    description: "Drive intelligence and insights",
    salary: "₹15-50 LPA",
    growth: "Very High",
  },
  {
    path: "Biomedical Engineering",
    match: 76,
    color: "#22c55e",
    icon: "🧬",
    topSubjects: ["Biology", "Physics"],
    description: "Revolutionize healthcare",
    salary: "₹8-25 LPA",
    growth: "High",
  },
  {
    path: "Research Scientist",
    match: 71,
    color: "#f59e0b",
    icon: "🔬",
    topSubjects: ["Chemistry", "Biology"],
    description: "Advance human knowledge",
    salary: "₹6-20 LPA",
    growth: "Moderate",
  },
];

export const todayTasks = [
  { id: 1, subject: "Mathematics", topic: "Integration by Parts", type: "Study", duration: 90, priority: "High", completed: true },
  { id: 2, subject: "Chemistry", topic: "Organic Reactions", type: "Quiz", duration: 30, priority: "Critical", completed: false },
  { id: 3, subject: "Physics", topic: "Electrostatics Revision", type: "Revision", duration: 60, priority: "Medium", completed: true },
  { id: 4, subject: "Chemistry", topic: "Electrochemistry", type: "Practice", duration: 45, priority: "High", completed: false },
  { id: 5, subject: "Mathematics", topic: "Mock Test Review", type: "Analysis", duration: 60, priority: "Medium", completed: false },
  { id: 6, subject: "Biology", topic: "Cell Division Notes", type: "Study", duration: 45, priority: "Low", completed: false },
];

export const notifications = [
  { id: 1, type: "alert", message: "Chemistry quiz scheduled in 2 hours!", time: "2h", urgent: true },
  { id: 2, type: "streak", message: "Keep it up! 12-day study streak 🔥", time: "Today", urgent: false },
  { id: 3, type: "reminder", message: "Organic Chemistry revision overdue", time: "Yesterday", urgent: true },
  { id: 4, type: "achievement", message: "New achievement unlocked: Speed Learner 🚀", time: "2d ago", urgent: false },
  { id: 5, type: "exam", message: "JEE Advanced: 87 days remaining", time: "Today", urgent: false },
];

export const radarData = [
  { subject: "Math", A: 88, fullMark: 100 },
  { subject: "Physics", A: 79, fullMark: 100 },
  { subject: "Chemistry", A: 58, fullMark: 100 },
  { subject: "Biology", A: 74, fullMark: 100 },
  { subject: "Consistency", A: 74, fullMark: 100 },
  { subject: "Speed", A: 82, fullMark: 100 },
];

export const aiRecommendations = [
  {
    priority: "Critical",
    subject: "Chemistry",
    action: "Focus on Organic Chemistry for 2h daily this week",
    impact: "+12% predicted score",
    color: "coral",
  },
  {
    priority: "High",
    subject: "Physics",
    action: "Revise Modern Physics concepts with past papers",
    impact: "+8% in Physics",
    color: "violet",
  },
  {
    priority: "Medium",
    subject: "Mathematics",
    action: "Practice 10 Statistics problems daily",
    impact: "Maintain strong score",
    color: "cyan",
  },
  {
    priority: "Low",
    subject: "Biology",
    action: "Review Ecology and Environment chapters",
    impact: "+5% in Biology",
    color: "neon-green",
  },
];

export const SUBJECTS_LIST = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "English", "History", "Geography", "Economics",
  "Computer Science", "Political Science", "Psychology",
  "Accountancy", "Business Studies",
];

export const BOARDS = ["CBSE", "ICSE", "State Board", "IB", "Cambridge"];
export const CLASSES = ["9th", "10th", "11th", "12th"];
export const EXAM_GOALS = [
  "JEE Main", "JEE Advanced", "NEET", "CUET", "UPSC",
  "CAT", "GATE", "Board Exams", "SAT", "GRE",
];
export const CAREER_INTERESTS = [
  "Engineering", "Medicine", "Law", "Finance",
  "Technology", "Research", "Design", "Management",
  "Arts", "Civil Services",
];
