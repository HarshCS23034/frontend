import { motion } from "framer-motion";
import { careerPaths } from "@/data/mockData";
import { Briefcase, TrendingUp, Star, ArrowRight } from "lucide-react";

export default function Career() {
  return (
    <div className="p-6 space-y-6 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-orbitron font-bold mb-1 flex items-center gap-3">
          <Briefcase className="w-6 h-6 text-gold" />
          <span className="gradient-text-gold">Career Predictor</span>
        </h1>
        <p className="text-muted-foreground text-sm">AI-matched career paths based on your performance and interests</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {careerPaths.map((career, i) => (
          <motion.div key={career.path}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
            whileHover={{ y: -4 }}
            className="glass-card p-6 cursor-pointer group"
            style={{ borderColor: `${career.color}20` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{career.icon}</div>
                <div>
                  <h3 className="font-bold">{career.path}</h3>
                  <p className="text-xs text-muted-foreground">{career.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-orbitron font-bold" style={{ color: career.color }}>{career.match}%</div>
                <div className="text-xs text-muted-foreground">match</div>
              </div>
            </div>

            <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
              <motion.div className="h-full rounded-full"
                style={{ background: career.color, boxShadow: `0 0 8px ${career.color}80` }}
                initial={{ width: 0 }} animate={{ width: `${career.match}%` }}
                transition={{ duration: 1, delay: 0.3 + i * 0.15 }} />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Salary</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: career.color }}>{career.salary}</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Growth</p>
                <p className="text-xs font-semibold mt-0.5 text-neon-green">{career.growth}</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Match Rank</p>
                <p className="text-xs font-semibold mt-0.5 text-gold">#{i + 1}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-gold" />
                <span className="text-xs text-muted-foreground">Top subjects: {career.topSubjects.join(", ")}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-5">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan" /> AI Career Insight
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Based on your strong performance in <span className="text-cyan">Mathematics (88%)</span> and <span className="text-cyan">Physics (79%)</span>, 
          combined with your interest in Technology and Engineering, <span className="text-foreground font-medium">Software Engineering</span> and{" "}
          <span className="text-foreground font-medium">Data Science</span> are your top career matches. Improving Chemistry will significantly 
          expand your options in Biomedical and Chemical Engineering fields.
        </p>
      </motion.div>
    </div>
  );
}
