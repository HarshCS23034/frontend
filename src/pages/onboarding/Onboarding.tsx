import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ChevronRight, ChevronLeft, Zap, Check, GraduationCap, Target, Clock, Star, BookOpen, Briefcase } from "lucide-react";
import { SUBJECTS_LIST, BOARDS, CLASSES, EXAM_GOALS, CAREER_INTERESTS } from "@/data/mockData";

const STEPS = [
  { title: "Class & Board", icon: GraduationCap, subtitle: "Tell us about your academic level" },
  { title: "Subjects", icon: BookOpen, subtitle: "Select the subjects you're studying" },
  { title: "Exam Goal", icon: Target, subtitle: "What exam are you preparing for?" },
  { title: "Study Time", icon: Clock, subtitle: "How much time can you dedicate?" },
  { title: "Strengths & Weaknesses", icon: Star, subtitle: "Help AI understand your profile" },
  { title: "Career Interests", icon: Briefcase, subtitle: "What's your dream career path?" },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    class: "",
    board: "",
    subjects: [] as string[],
    examGoal: "",
    examDate: "",
    dailyStudyHours: 4,
    strengths: [] as string[],
    weaknesses: [] as string[],
    careerInterests: [] as string[],
  });
  const { completeOnboarding, profile } = useAuth();
  const navigate = useNavigate();

  const toggleItem = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

  const isStepValid = () => {
    if (step === 0) return data.class && data.board;
    if (step === 1) return data.subjects.length >= 2;
    if (step === 2) return data.examGoal;
    if (step === 3) return data.dailyStudyHours >= 1;
    if (step === 4) return data.strengths.length >= 1 && data.weaknesses.length >= 1;
    if (step === 5) return data.careerInterests.length >= 1;
    return true;
  };

  const handleFinish = () => {
    completeOnboarding({
      ...data,
      name: profile?.name || "Student",
      email: profile?.email || "",
    });
    navigate("/dashboard");
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      <div className="orb w-96 h-96 top-0 left-0 animate-pulse-glow" style={{ background: "hsl(191 100% 50%)", opacity: 0.1 }} />
      <div className="orb w-80 h-80 bottom-0 right-0 animate-float" style={{ background: "hsl(263 70% 60%)", opacity: 0.1 }} />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="font-orbitron text-lg font-bold gradient-text-primary">Learn Sync</span>
          </div>
          <p className="text-sm text-muted-foreground">Setting up your AI learning profile</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Step {step + 1} of {STEPS.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--gradient-primary)" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          {/* Step indicators */}
          <div className="flex justify-between mt-3">
            {STEPS.map((s, i) => (
              <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${i < step ? "bg-cyan text-black" : i === step ? "border-2 border-cyan text-cyan" : "bg-muted text-muted-foreground"}`}>
                {i < step ? <Check className="w-3 h-3" /> : i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted/50 border border-border">
                  {(() => { const Icon = STEPS[step].icon; return <Icon className="w-5 h-5 text-cyan" />; })()}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{STEPS[step].title}</h2>
                  <p className="text-sm text-muted-foreground">{STEPS[step].subtitle}</p>
                </div>
              </div>

              {/* Step 0: Class & Board */}
              {step === 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Select Class</label>
                    <div className="grid grid-cols-4 gap-2">
                      {CLASSES.map(c => (
                        <button key={c} onClick={() => setData(d => ({ ...d, class: c }))}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 border ${data.class === c ? "border-cyan text-cyan bg-cyan/10 glow-cyan" : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Select Board</label>
                    <div className="grid grid-cols-3 gap-2">
                      {BOARDS.map(b => (
                        <button key={b} onClick={() => setData(d => ({ ...d, board: b }))}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 border ${data.board === b ? "border-cyan text-cyan bg-cyan/10" : "border-border text-muted-foreground hover:text-foreground"}`}>
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Subjects */}
              {step === 1 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Select at least 2 subjects</p>
                  <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                    {SUBJECTS_LIST.map(s => (
                      <button key={s} onClick={() => setData(d => ({ ...d, subjects: toggleItem(d.subjects, s) }))}
                        className={`py-2 px-3 rounded-lg text-sm text-left font-medium transition-all duration-200 border flex items-center gap-2 ${data.subjects.includes(s) ? "border-cyan text-cyan bg-cyan/10" : "border-border text-muted-foreground hover:text-foreground"}`}>
                        {data.subjects.includes(s) && <Check className="w-3 h-3 flex-shrink-0" />}
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Exam Goal */}
              {step === 2 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {EXAM_GOALS.map(g => (
                      <button key={g} onClick={() => setData(d => ({ ...d, examGoal: g }))}
                        className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 border ${data.examGoal === g ? "border-cyan text-cyan bg-cyan/10" : "border-border text-muted-foreground hover:text-foreground"}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Target Exam Date</label>
                    <input type="date" value={data.examDate} onChange={e => setData(d => ({ ...d, examDate: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-cyan focus:outline-none text-foreground" />
                  </div>
                </div>
              )}

              {/* Step 3: Study Hours */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl font-orbitron font-bold gradient-text-primary mb-2">{data.dailyStudyHours}</div>
                    <div className="text-muted-foreground">hours per day</div>
                  </div>
                  <input type="range" min="1" max="16" value={data.dailyStudyHours}
                    onChange={e => setData(d => ({ ...d, dailyStudyHours: Number(e.target.value) }))}
                    className="w-full accent-cyan h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1h (Minimal)</span>
                    <span>8h (Dedicated)</span>
                    <span>16h (Intense)</span>
                  </div>
                </div>
              )}

              {/* Step 4: Strengths & Weaknesses */}
              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neon-green mb-2 block">💪 Strong Subjects</label>
                    <div className="flex flex-wrap gap-2">
                      {data.subjects.length > 0 ? data.subjects.map(s => (
                        <button key={s} onClick={() => setData(d => ({ ...d, strengths: toggleItem(d.strengths, s), weaknesses: d.weaknesses.filter(w => w !== s) }))}
                          className={`py-1.5 px-3 rounded-full text-sm transition-all duration-200 border ${data.strengths.includes(s) ? "border-neon-green text-neon-green bg-neon-green/10" : "border-border text-muted-foreground hover:text-foreground"}`}>
                          {s}
                        </button>
                      )) : <p className="text-sm text-muted-foreground">No subjects selected. Go back and select subjects.</p>}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-coral mb-2 block">⚠️ Weak Subjects (Need More Focus)</label>
                    <div className="flex flex-wrap gap-2">
                      {data.subjects.map(s => (
                        <button key={s} onClick={() => setData(d => ({ ...d, weaknesses: toggleItem(d.weaknesses, s), strengths: d.strengths.filter(w => w !== s) }))}
                          className={`py-1.5 px-3 rounded-full text-sm transition-all duration-200 border ${data.weaknesses.includes(s) ? "border-coral text-coral bg-coral/10" : "border-border text-muted-foreground hover:text-foreground"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Career Interests */}
              {step === 5 && (
                <div>
                  <div className="grid grid-cols-2 gap-2">
                    {CAREER_INTERESTS.map(c => (
                      <button key={c} onClick={() => setData(d => ({ ...d, careerInterests: toggleItem(d.careerInterests, c) }))}
                        className={`py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 border flex items-center gap-2 ${data.careerInterests.includes(c) ? "border-violet text-violet bg-violet/10" : "border-border text-muted-foreground hover:text-foreground"}`}>
                        {data.careerInterests.includes(c) && <Check className="w-3 h-3" />}
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-border/60 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!isStepValid()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium btn-gradient-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleFinish} disabled={!isStepValid()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium btn-gradient-primary disabled:opacity-40 disabled:cursor-not-allowed">
                <Zap className="w-4 h-4" /> Launch AI Engine
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
