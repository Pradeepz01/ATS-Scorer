"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, Layout, Key, FileText } from "lucide-react";
import { ATSResult } from "@/lib/scoring";
import { cn } from "@/lib/utils";

export default function ScoreDashboard({ result }: { result: ATSResult }) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-500";
        if (score >= 60) return "text-yellow-500";
        return "text-red-500";
    };

    const getProgressColor = (score: number) => {
        if (score >= 80) return "bg-green-500";
        if (score >= 60) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Score Header */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">ATS Compatibility Score</h2>
                <p className="text-muted-foreground">Based on typical tracking system algorithms</p>
            </div>

            {/* Main Score Gauge */}
            <div className="flex justify-center py-8">
                <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Background Circle */}
                    <svg className="absolute w-full h-full transform -rotate-90">
                        <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            className="text-muted/20"
                        />
                        {/* Progress Circle */}
                        <motion.circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            strokeLinecap="round"
                            className={cn("transition-colors duration-500", getScoreColor(result.score))}
                            initial={{ strokeDasharray: "553", strokeDashoffset: "553" }}
                            animate={{ strokeDashoffset: String(553 - (553 * result.score) / 100) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </svg>
                    <div className="text-center">
                        <motion.span
                            className={cn("text-5xl font-bold", getScoreColor(result.score))}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {result.score}%
                        </motion.span>
                    </div>
                </div>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    icon={<Layout className="w-5 h-5 text-blue-500" />}
                    title="Sections"
                    score={Math.round((result.details.sectionScore / 40) * 100)} // Normalize to %
                    description="Presence of key resume sections"
                />
                <MetricCard
                    icon={<Key className="w-5 h-5 text-purple-500" />}
                    title="Keywords"
                    score={Math.round((result.details.keywordScore / 30) * 100)}
                    description="Action verbs and role relevance"
                />
                <MetricCard
                    icon={<FileText className="w-5 h-5 text-orange-500" />}
                    title="Formatting"
                    score={Math.round((result.details.formattingScore / 30) * 100)}
                    description="Layout and readability"
                />
            </div>

            {/* Detailed Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Wait, Found Sections
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">Core sections detected in your resume:</p>
                    <div className="flex flex-wrap gap-2">
                        {["Experience", "Education", "Skills", "Summary", "Contact"]
                            .filter(s => !result.missingSections.includes(s))
                            .map((s) => (
                                <span key={s} className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                                    {s}
                                </span>
                            ))}
                    </div>
                </div>

                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        Improvements
                    </h3>
                    <ul className="space-y-3">
                        {result.feedback.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                                <span className="mt-0.5">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                        {result.missingSections.length > 0 && (
                            <li className="flex items-start gap-3 text-sm text-foreground/80">
                                <span className="mt-0.5">•</span>
                                <span>Consider adding missing sections: {result.missingSections.join(", ")}</span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ icon, title, score, description }: { icon: any, title: string, score: number, description: string }) {
    return (
        <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="p-3 bg-muted rounded-full mb-4">
                {icon}
            </div>
            <h3 className="font-semibold">{title}</h3>
            <div className="mt-2 mb-1 text-2xl font-bold">{score}%</div>
            <p className="text-xs text-muted-foreground">{description}</p>
            {/* Mini Progress Bar */}
            <div className="w-full bg-muted rounded-full h-1.5 mt-4">
                <div
                    className="bg-primary h-1.5 rounded-full"
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    )
}
