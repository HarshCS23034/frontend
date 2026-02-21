import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Bot, User, Sparkles, Zap, ThumbsUp, ThumbsDown, Copy, RefreshCw, ChevronDown } from "lucide-react";

const CATEGORIES = [
  { label: "📊 Analytics", prompts: ["What are my weakest topics?", "How is my consistency score?", "Show my study pattern analysis"] },
  { label: "📅 Planning", prompts: ["Create a study plan for next week", "How should I schedule Chemistry?", "Generate revision timetable"] },
  { label: "📚 Concepts", prompts: ["Explain Integration by Parts", "Explain Organic Chemistry basics", "What is Electrochemistry?"] },
  { label: "🚀 Strategy", prompts: ["How should I improve my Chemistry score?", "Best strategy for JEE preparation", "How to improve consistency?"] },
];

const AI_RESPONSES: Record<string, string> = {
  default: "Great question! Based on your performance data, I recommend focusing on your weak areas first. Your Chemistry score is at 58% — spending 2 extra hours daily on Organic Chemistry can improve it by 12% within 3 weeks. Would you like a detailed action plan?",
  chemistry: "For Chemistry improvement:\n\n**1. Organic Chemistry (Priority 1)** — Practice reaction mechanisms daily\n**2. Physical Chemistry** — Focus on numericals and formulas\n**3. Electrochemistry** — Your weakest topic at 45%\n\nStart with 90-minute focused Pomodoro sessions. I'll update your timetable accordingly! 💡",
  plan: "Here's your AI-generated plan for next week:\n\n📅 **Mon-Wed**: Extra 90 min Chemistry daily\n📅 **Thu**: Full mock test (JEE pattern)\n📅 **Fri**: Analysis + weak topic revision\n📅 **Sat-Sun**: Practice papers + Organic Synthesis\n\nThis plan is optimized based on your exam date and current performance. Shall I finalize this?",
  integration: "**Integration by Parts** uses: ∫u dv = uv − ∫v du\n\n**Steps:**\n1. Choose u using LIATE rule\n2. Let the remaining be dv\n3. Find du and v\n4. Apply the formula\n\n**Example:** ∫x·eˣ dx\n- u = x, dv = eˣ dx\n- du = dx, v = eˣ\n- **Result:** x·eˣ − eˣ + C = eˣ(x−1) + C\n\nYour Math score is 88% — you're excellent here! 🎯",
  weak: "Based on your diagnostic data, here are your weakest areas:\n\n🔴 **Electrochemistry** (45%) — Critical\n🟡 **Organic Reactions** (52%) — High Priority\n🟡 **Modern Physics** (68%) — Medium Priority\n🟢 **Ecology** (65%) — Monitor\n\nI've allocated extra time to these in your timetable. Focus on Electrochemistry first — 30 focused minutes daily can make a huge difference in 3 weeks!",
  consistency: "Your consistency score is **74%**, which is in the Medium range.\n\n**Key Insights:**\n- You study best on Thursdays and Saturdays 📈\n- Sundays show lowest engagement\n- Longest streak: 12 days 🔥\n\n**To improve:**\n1. Set a fixed start time daily (e.g., 6:30 AM)\n2. Use the Pomodoro timer for focus blocks\n3. Track missed sessions — reschedule within 24h\n\nConsistency improvement of +10% could boost predicted score by 5%!",
  schedule: "For Chemistry scheduling, I recommend:\n\n📅 **Daily** (6:00-7:30 AM): Organic Chemistry (peak focus time)\n📅 **Tuesday PM**: Physical Chemistry numericals\n📅 **Thursday AM**: Electrochemistry (your weakest — prioritized)\n📅 **Saturday**: Full Chemistry mock + analysis\n\nThis schedule allocates 8h/week to Chemistry vs your current 4h. Shall I update your planner?",
  jee: "**JEE Preparation Strategy:**\n\n**Phase 1 (Now — 60 days):** Focus on weak subjects\n- Chemistry: 3h/day (Organic + Electro)\n- Physics: 2h/day (Modern Physics)\n\n**Phase 2 (60-30 days):** Mock tests + revision\n- Full JEE mock every Friday\n- Weekly analysis sessions\n\n**Phase 3 (Last 30 days):** Revise strong areas, consolidate weak ones\n\nYou're currently in Phase 1. Your Math (88%) is excellent — maintain it with 1.5h/day only!",
};

function getResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("chemistry") && (lower.includes("improve") || lower.includes("score") || lower.includes("help"))) return AI_RESPONSES.chemistry;
  if (lower.includes("chemistry") && lower.includes("schedul")) return AI_RESPONSES.schedule;
  if (lower.includes("plan") || lower.includes("schedule") || lower.includes("timetable") || lower.includes("next week")) return AI_RESPONSES.plan;
  if (lower.includes("integration") || lower.includes("calculus")) return AI_RESPONSES.integration;
  if (lower.includes("weak") || lower.includes("topic") || lower.includes("analytics") || lower.includes("analysis")) return AI_RESPONSES.weak;
  if (lower.includes("consistency") || lower.includes("pattern")) return AI_RESPONSES.consistency;
  if (lower.includes("jee") || lower.includes("strategy") || lower.includes("preparation")) return AI_RESPONSES.jee;
  if (lower.includes("chemistry")) return AI_RESPONSES.chemistry;
  return AI_RESPONSES.default;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  time: string;
  liked?: boolean | null;
}

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", content: "Hi! I'm your AI study assistant 🎓\n\nI have access to all your performance data — scores, trends, consistency, knowledge gaps, and more. I can help you with:\n\n✨ Study strategies tailored to your data\n📊 Explaining your analytics\n📅 Optimizing your timetable\n💡 Concept explanations\n🎯 Goal planning & motivation\n\nWhat would you like to work on today?", time: "Now" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setShowCategories(false);
    const userMsg: Message = { id: Date.now(), role: "user", content: msg, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 800));
    const aiMsg: Message = { id: Date.now() + 1, role: "assistant", content: getResponse(msg), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), liked: null };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const likeMessage = (id: number, liked: boolean) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, liked } : m));
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg lg:text-2xl font-orbitron font-bold flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                <Bot className="w-4 h-4 text-black" />
              </div>
              <span className="gradient-text-primary">AI Study Assistant</span>
            </h1>
            <p className="text-muted-foreground text-xs mt-0.5">Personalized guidance · performance-aware · always learning</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/20">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
              <span className="text-xs text-neon-green font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
        {/* Quick prompt categories */}
        {showCategories && messages.length === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-3">
            <p className="text-xs text-muted-foreground font-medium">💡 Quick start — click a prompt below:</p>
            
            {/* Category tabs */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat, i) => (
                <button key={i} onClick={() => setActiveCategory(i)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${activeCategory === i ? "bg-primary/20 text-primary border-primary/30" : "border-border text-muted-foreground hover:text-foreground"}`}>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Prompts */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES[activeCategory].prompts.map(p => (
                <motion.button key={p} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  onClick={() => sendMessage(p)} whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 rounded-xl text-xs border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-primary/5 transition-all text-left">
                  {p}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                  style={{ background: "var(--gradient-primary)" }}>
                  <Bot className="w-4 h-4 text-black" />
                </div>
              )}

              <div className={`max-w-[78%] lg:max-w-[70%] ${msg.role === "user" ? "" : ""}`}>
                <div className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-tr-sm text-black font-medium"
                    : "glass-card rounded-tl-sm text-foreground"}`}
                  style={msg.role === "user" ? { background: "var(--gradient-primary)" } : {}}>
                  {msg.content}
                </div>

                {/* Message actions */}
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-1 mt-1.5 ml-1">
                    <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                    <div className="flex items-center gap-0.5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => likeMessage(msg.id, true)}
                        className={`p-1 rounded-md hover:bg-muted/50 transition-colors ${msg.liked === true ? "text-neon-green" : "text-muted-foreground hover:text-foreground"}`}>
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button onClick={() => likeMessage(msg.id, false)}
                        className={`p-1 rounded-md hover:bg-muted/50 transition-colors ${msg.liked === false ? "text-coral" : "text-muted-foreground hover:text-foreground"}`}>
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                      <button onClick={() => copyMessage(msg.content)}
                        className="p-1 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
                {msg.role === "user" && (
                  <div className="text-right mt-1">
                    <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-muted border border-border">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--gradient-primary)" }}>
              <Bot className="w-4 h-4 text-black" />
            </div>
            <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-2 h-2 rounded-full bg-cyan"
                    animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.18 }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Re-show categories button */}
        {!showCategories && messages.length > 1 && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
            <button onClick={() => setShowCategories(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
              <Sparkles className="w-3 h-3" /> Quick prompts <ChevronDown className="w-3 h-3" />
            </button>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 lg:p-4 border-t border-border flex-shrink-0 pb-20 lg:pb-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask about study strategies, concepts, or your performance..."
              rows={1}
              style={{ resize: "none", minHeight: "48px", maxHeight: "120px" }}
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none text-sm text-foreground placeholder:text-muted-foreground transition-all"
            />
          </div>
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
            className="p-3 rounded-xl btn-gradient-primary disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 h-12 w-12 flex items-center justify-center">
            {loading ? <RefreshCw className="w-4 h-4 text-black animate-spin" /> : <Send className="w-4 h-4 text-black" />}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
