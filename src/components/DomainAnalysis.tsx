"use client";

import { motion } from "framer-motion";

interface DomainAnalysisProps {
    data: {
        digital: number;
        analog: number;
        explanation: string;
    };
}

export default function DomainAnalysis({ data }: DomainAnalysisProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6 shadow-sm"
        >
            <h3 className="text-lg font-semibold mb-2">Digital vs Analog Focus</h3>
            <p className="text-sm text-muted-foreground mb-4">{data.explanation}</p>

            <div className="relative h-6 w-full bg-muted rounded-full overflow-hidden flex">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${data.digital}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-cyan-500 flex items-center justify-center text-[10px] font-bold text-white relative group"
                >
                    {data.digital > 10 && `Digital ${data.digital}%`}
                </motion.div>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${data.analog}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white relative group"
                >
                    {data.analog > 10 && `Analog ${data.analog}%`}
                </motion.div>
            </div>

            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-cyan-500 rounded-full"></div>Digital (VLSI, Embedded, Software)</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-500 rounded-full"></div>Analog (RF, Circuits, Signal)</span>
            </div>
        </motion.div>
    );
}
