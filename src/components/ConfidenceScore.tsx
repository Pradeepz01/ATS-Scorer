"use client";

import { motion } from "framer-motion";

interface ConfidenceScoreProps {
    score: number;
}

export default function ConfidenceScore({ score }: ConfidenceScoreProps) {
    // Determine color and label based on score
    let color = "text-yellow-500";
    let strokeColor = "#EAB308"; // Tailwind yellow-500
    let label = "Tentative";
    let description = "Signals are mixed. The recommendation is a best-guess based on available keywords.";

    if (score >= 75) {
        color = "text-green-500";
        strokeColor = "#22C55E"; // Tailwind green-500
        label = "Solid";
        description = "Strong technical signals detected. High alignment between resume and predicted role.";
    } else if (score >= 40) {
        color = "text-blue-500";
        strokeColor = "#3B82F6"; // Tailwind blue-500
        label = "Moderate";
        description = "Fair match with some missing core elements. System is reasonably confident.";
    }

    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="bg-card/30 backdrop-blur-sm border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-muted/20"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        cx="40"
                        cy="40"
                        r={radius}
                        fill="transparent"
                        stroke={strokeColor}
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold">{score}%</span>
                </div>
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">System Confidence</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight bg-white/10 ${color} border border-current`}>
                        {label}
                    </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 leading-tight">
                    {description}
                </p>
                <div className="group relative inline-block mt-2">
                    <span className="text-[10px] text-primary/70 cursor-help underline underline-offset-2">What is this?</span>
                    <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-popover text-popover-foreground text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-border">
                        This score reflects the system&apos;s certainty in its own recommendation. It is derived from role fit, keyword density, and resume completeness.
                    </div>
                </div>
            </div>
        </div>
    );
}
