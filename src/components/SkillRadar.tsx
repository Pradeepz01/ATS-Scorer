"use client";

import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

interface SkillRadarProps {
    scores: {
        communication: number;
        vlsi: number;
        embedded: number;
        software: number;
    };
}

export default function SkillRadar({ scores }: SkillRadarProps) {
    const data = [
        { subject: "Communication Systems", A: scores.communication, fullMark: 100 },
        { subject: "VLSI / Digital Design", A: scores.vlsi, fullMark: 100 },
        { subject: "Embedded Systems", A: scores.embedded, fullMark: 100 },
        { subject: "Software & Programming", A: scores.software, fullMark: 100 },
    ];

    // Find strongest domain
    const maxScore = Math.max(scores.communication, scores.vlsi, scores.embedded, scores.software);
    const strongestDomain = data.find(d => d.A === maxScore)?.subject;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6 shadow-sm flex flex-col items-center"
        >
            <h3 className="text-lg font-semibold mb-1 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                ECE Skill Proximity
            </h3>

            <div className="h-[320px] w-full mt-2 relative">
                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl transform scale-75" />

                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data} margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
                        <PolarGrid stroke="var(--border)" strokeOpacity={0.5} />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: "var(--foreground)", fontSize: 10, fontWeight: 500 }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Skill Profile"
                            dataKey="A"
                            stroke="var(--primary)"
                            strokeWidth={3}
                            fill="var(--primary)"
                            fillOpacity={0.5}
                            isAnimationActive={true}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Strongest Domain Highlight */}
            <div className="mt-4 text-center">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Strongest Domain</span>
                <div className="text-sm font-bold text-primary mt-1">
                    {strongestDomain}
                </div>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-4 italic">
                Shape indicates your engineering balance. Broader coverage = more versatile.
            </p>
        </motion.div>
    );
}
