"use client";

import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { motion } from "framer-motion";

interface SkillRadarProps {
    scores: {
        communication: number;
        digital_vlsi: number;
        analog_vlsi: number;
        embedded: number;
        software: number;
    };
}

export default function SkillRadar({ scores }: SkillRadarProps) {
    const data = [
        { subject: "Digital VLSI", A: scores.digital_vlsi, fullMark: 100 },
        { subject: "Analog VLSI/RF", A: scores.analog_vlsi, fullMark: 100 },
        { subject: "Embedded Systems", A: scores.embedded, fullMark: 100 },
        { subject: "Communication/Signal Processing", A: scores.communication, fullMark: 100 },
        { subject: "Software/Programming", A: scores.software, fullMark: 100 },
    ];

    // Find strongest domain
    const maxScore = Math.max(scores.communication, scores.digital_vlsi, scores.analog_vlsi, scores.embedded, scores.software);
    const strongestDomain = data.find(d => d.A === maxScore)?.subject || "";

    // Custom tick renderer to handle long labels without truncation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderCustomAxisTick = (props: any) => {
        const { x, y, payload, textAnchor } = props;
        // Split on / or space for very long ones
        const parts = payload.value.split("/");

        return (
            <g transform={`translate(${x},${y})`}>
                {parts.map((part: string, i: number) => (
                    <text
                        key={i}
                        x={0}
                        y={i * 13 - (parts.length > 1 ? 6 : 0)}
                        textAnchor={textAnchor}
                        fill="var(--foreground)"
                        fontSize={10.7}
                        fontWeight={500}
                        className="select-none"
                    >
                        {part.trim()}
                    </text>
                ))}
            </g>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6 shadow-sm flex flex-col items-center"
        >
            <h3 className="text-lg font-semibold mb-1 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Domain Profile
            </h3>

            <div className="h-[420px] w-full mt-2 relative">
                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl transform scale-75" />

                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data} margin={{ top: 20, right: 45, bottom: 20, left: 45 }}>
                        <PolarGrid stroke="var(--border)" strokeOpacity={0.5} />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={renderCustomAxisTick}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                fontSize: '12px'
                            }}
                            itemStyle={{ color: 'var(--primary)', fontWeight: 600 }}
                        />
                        <Radar
                            name="Score"
                            dataKey="A"
                            stroke="var(--primary)"
                            strokeWidth={4}
                            fill="var(--primary)"
                            fillOpacity={0.65}
                            isAnimationActive={true}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Strongest Domain Highlight */}
            <div className="mt-4 text-center">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Primary Strength</span>
                <div className="text-sm font-bold text-primary mt-1">
                    {strongestDomain}
                </div>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-4 italic max-w-[280px]">
                This profile shows how your skills are distributed across ECE domains. Balanced profiles suit system roles; strong peaks suit specialist roles.
            </p>
        </motion.div>
    );
}
