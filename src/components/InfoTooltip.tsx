"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InfoTooltipProps {
    content: string;
    position?: "top" | "bottom" | "left" | "right";
}

export default function InfoTooltip({ content, position = "top" }: InfoTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    return (
        <div className="relative inline-block ml-1.5 align-middle">
            <button
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onFocus={() => setIsVisible(true)}
                onBlur={() => setIsVisible(false)}
                className="text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                aria-label="Information"
            >
                <Info className="w-4 h-4" />
            </button>

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className={`absolute z-[150] w-64 p-3 rounded-xl bg-card border border-border shadow-xl pointer-events-none ${positionClasses[position]}`}
                    >
                        <p className="text-xs text-muted-foreground leading-relaxed whitespace-normal italic">
                            {content}
                        </p>
                        {/* Arrow */}
                        <div className={`absolute w-2 h-2 bg-card border border-border rotate-45 z-[-1] ${position === "top" ? "bottom-[-5px] left-1/2 -translate-x-1/2 border-t-0 border-l-0" :
                            position === "bottom" ? "top-[-5px] left-1/2 -translate-x-1/2 border-b-0 border-r-0" :
                                position === "left" ? "right-[-5px] top-1/2 -translate-y-1/2 border-b-0 border-l-0" :
                                    "left-[-5px] top-1/2 -translate-y-1/2 border-t-0 border-r-0"
                            }`} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
