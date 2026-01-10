"use client";

import { motion } from "framer-motion";
import { AlertCircle, FileText } from "lucide-react";
import { ATSResult } from "@/lib/scoring";
import { cn } from "@/lib/utils";
import SkillRadar from "./SkillRadar";
import RolePredictor from "./RolePredictor";
import ContactChecklist from "./ContactChecklist";

interface ScoreDashboardProps {
    analysis: ATSResult;
    onReset: () => void;
}

export default function ScoreDashboard({ analysis, onReset }: ScoreDashboardProps) {
    const { score, details, missingSections, feedback, eceScores, rolePrediction, educationDetails, contactValidation, platformStats } = analysis;

    const getScoreColor = (s: number) => {
        if (s >= 80) return "text-green-500";
        if (s >= 50) return "text-yellow-500";
        return "text-destructive";
    };

    const getScoreLabel = (s: number) => {
        if (s >= 80) return "Excellent";
        if (s >= 50) return "Needs Improvement";
        return "Critical Issues";
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col md:flex-row gap-8 items-start">

                {/* LEFT COLUMN: Score & Core Metrics */}
                <div className="w-full md:w-1/3 space-y-6">
                    {/* Main Score Card */}
                    <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-8 text-center shadow-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h2 className="text-lg font-medium text-muted-foreground mb-4">ATS Compatibility Score</h2>
                        <div className="relative inline-flex items-center justify-center">
                            <svg className="w-40 h-40 transform -rotate-90">
                                <circle
                                    className="text-muted/20"
                                    strokeWidth="8"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="70"
                                    cx="80"
                                    cy="80"
                                />
                                <motion.circle
                                    className={cn(getScoreColor(score))}
                                    strokeWidth="8"
                                    strokeDasharray={440}
                                    strokeDashoffset={440 - (440 * score) / 100}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="70"
                                    cx="80"
                                    cy="80"
                                    initial={{ strokeDashoffset: 440 }}
                                    animate={{ strokeDashoffset: 440 - (440 * score) / 100 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className={cn("text-4xl font-bold", getScoreColor(score))}>{score}</span>
                                <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">/ 100</span>
                            </div>
                        </div>
                        <p className={cn("mt-4 font-semibold text-lg", getScoreColor(score))}>
                            {getScoreLabel(score)}
                        </p>
                    </div>

                    {/* Breakdown Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-card/30 p-4 rounded-lg border border-border/50">
                            <div className="text-muted-foreground text-xs uppercase mb-1">Sections</div>
                            <div className="text-xl font-bold">{Math.round(details.sectionScore * 0.4)}/40</div>
                        </div>
                        <div className="bg-card/30 p-4 rounded-lg border border-border/50">
                            <div className="text-muted-foreground text-xs uppercase mb-1">Context</div>
                            <div className="text-xl font-bold">{Math.round(details.keywordScore * 0.3)}/30</div>
                        </div>
                        <div className="bg-card/30 p-4 rounded-lg border border-border/50">
                            <div className="text-muted-foreground text-xs uppercase mb-1">Format</div>
                            <div className="text-xl font-bold">{Math.round(details.formattingScore * 0.3)}/30</div>
                        </div>
                    </div>

                    {/* Student Info (New) */}
                    {educationDetails && (
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <div className="text-xs text-muted-foreground uppercase">Detected Pattern</div>
                                <div className="font-semibold text-primary">{educationDetails.college}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-muted-foreground uppercase">Batch</div>
                                <div className="font-bold">{educationDetails.batch}</div>
                            </div>
                        </div>
                    )}

                    {/* Improvement Suggestions (Moved to Left) */}
                    <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Action Items
                        </h3>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {missingSections.length > 0 && (
                                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                    <h4 className="font-medium text-destructive text-sm mb-1 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" /> Missing Sections
                                    </h4>
                                    <ul className="text-xs text-muted-foreground list-disc list-inside">
                                        {missingSections.map((s) => <li key={s}>{s}</li>)}
                                    </ul>
                                </div>
                            )}
                            {feedback.map((item, idx) => (
                                <div key={idx} className="flex gap-3 text-sm text-muted-foreground p-2 hover:bg-muted/50 rounded transition-colors">
                                    <div className="mt-1 min-w-[4px] h-4 bg-primary rounded-full" />
                                    <p>{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* MIDDLE COLUMN: ECE Specifics */}
                <div className="w-full md:w-1/3 space-y-6">
                    {/* NEW: Radar Chart */}
                    {eceScores && <SkillRadar scores={eceScores} />}

                    {/* NEW: Contact Checklist */}
                    {contactValidation && <ContactChecklist validation={contactValidation} platformStats={platformStats} />}
                </div>

                {/* RIGHT COLUMN: Roles */}
                <div className="w-full md:w-1/3 space-y-6">
                    {/* NEW: Role Predictor */}
                    {rolePrediction && <RolePredictor prediction={rolePrediction} />}
                </div>
            </div>

            <div className="flex justify-center pt-8">
                <button
                    onClick={onReset}
                    className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 active:scale-95"
                >
                    Analyze Another Resume
                </button>
            </div>
        </div>
    );
}
