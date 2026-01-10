"use client";

import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

interface ContactChecklistProps {
    validation: {
        email: boolean;
        phone: boolean;
        linkedin: boolean;
        github: boolean;
        hdlbits: boolean; // optional
        leetcode: boolean; // optional
    };
}

export default function ContactChecklist({ validation }: ContactChecklistProps) {
    const items = [
        { label: "Email Address", valid: validation.email, required: true },
        { label: "LinkedIn URL", valid: validation.linkedin, required: true },
        { label: "GitHub Profile", valid: validation.github, required: true }, // Treated as "Strongly Recommended"
        { label: "Phone Number", valid: validation.phone, required: false },
        { label: "HDLBits Profile", valid: validation.hdlbits, required: false },
        { label: "LeetCode Profile", valid: validation.leetcode, required: false },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6 shadow-sm"
        >
            <h3 className="text-lg font-semibold mb-4">Contact & Profiles</h3>
            <div className="space-y-3">
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            {item.label} {item.required ? <span className="text-destructive">*</span> : <span className="text-xs text-muted-foreground/50">(Optional)</span>}
                        </span>
                        <div className="flex items-center gap-2">
                            {item.valid ? (
                                <Check className="w-4 h-4 text-green-500" />
                            ) : (
                                item.required ? <X className="w-4 h-4 text-destructive" /> : <span className="text-xs text-muted-foreground">-</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
