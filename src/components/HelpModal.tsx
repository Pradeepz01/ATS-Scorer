"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X, CheckCircle2, Zap, Rocket, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";

export default function HelpModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogic, setShowLogic] = useState(false);

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-6 right-6 z-50 p-3 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 backdrop-blur-md transition-all group shadow-lg"
                title="How it works"
            >
                <HelpCircle className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            </button>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Rocket className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Help Center</h2>
                                        <p className="text-xs text-muted-foreground">Mastering your ECE Recruitment Flow</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
                                {/* 1. ATS Compatibility Score */}
                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Zap className="w-4 h-4 text-primary" />
                                        <h3 className="font-semibold">📊 ATS Compatibility Score</h3>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                                        <p className="text-sm font-medium mb-2 text-foreground">What does this score mean?</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            This score estimates how well your resume matches ATS (Applicant Tracking System) expectations for ECE / VLSI / FPGA roles.
                                        </p>
                                        <div className="mt-3 p-2 px-3 rounded-lg bg-primary/5 border border-primary/10 text-[11px] text-primary font-medium">
                                            ⚠️ Note: It does NOT guarantee selection — it predicts shortlisting compatibility based on industry standards.
                                        </div>
                                    </div>
                                </section>

                                {/* 2. Confidence Score */}
                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <ShieldCheck className="w-4 h-4 text-green-500" />
                                        <h3 className="font-semibold">🎯 Confidence Score</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                        Indicates how confident the system is about your analysis, based on:
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            <span className="text-xs">Keyword density</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            <span className="text-xs">Section completeness</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            <span className="text-xs">Context consistency</span>
                                        </div>
                                    </div>
                                </section>

                                {/* 3. Actionable Tips */}
                                <section>
                                    <div className="flex items-center gap-2 mb-4">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                        <h3 className="font-semibold text-foreground">💡 How to Improve Your Score</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-xl border border-blue-500/10 bg-blue-500/5">
                                            <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">Project Optimization</p>
                                            <ul className="text-sm space-y-2 text-muted-foreground">
                                                <li className="flex gap-2">
                                                    <span className="text-blue-500">•</span>
                                                    Add tools used (e.g., Vivado, Virtuoso, Keil)
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="text-blue-500">•</span>
                                                    Define your specific role (e.g., RTL Design, PCB Layout)
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="text-blue-500">•</span>
                                                    Use measurable outcomes (e.g., "Reduced power by 15%")
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl border border-border bg-card">
                                                <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Summary</p>
                                                <p className="text-xs text-muted-foreground">Add a 2–3 line summary aligned with your target role to trigger secondary matching.</p>
                                            </div>
                                            <div className="p-4 rounded-xl border border-border bg-card">
                                                <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Skills in Context</p>
                                                <p className="text-xs text-muted-foreground">Move core keywords from <b>Skills</b> → <b>Projects</b> to get higher contextual bonuses.</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* 4. Learn More (Expandable) */}
                                <section className="bg-muted/20 rounded-xl overflow-hidden border border-border/50">
                                    <button
                                        onClick={() => setShowLogic(!showLogic)}
                                        className="w-full flex items-center justify-between p-4 hover:bg-muted/40 transition-colors"
                                    >
                                        <span className="text-sm font-semibold flex items-center gap-2">
                                            <HelpCircle className="w-4 h-4 text-primary" />
                                            Advanced Algorithm Logic
                                        </span>
                                        {showLogic ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>

                                    <AnimatePresence>
                                        {showLogic && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="p-4 pt-0 text-sm text-muted-foreground space-y-3"
                                            >
                                                <p>Our scoring engine uses a weighted ECE domain matrix. It filters keywords through multiple tiers:</p>
                                                <div className="space-y-2 text-xs">
                                                    <div className="p-2 border-l-2 border-primary bg-muted/30">
                                                        <b>Tier 1 (Core):</b> Foundational industry terms (e.g., Verilog, CMOS).
                                                    </div>
                                                    <div className="p-2 border-l-2 border-primary/50 bg-muted/30">
                                                        <b>Tier 2 (Pro):</b> Specialized tools & flows (e.g., STA, DFT, Virtuoso).
                                                    </div>
                                                    <div className="p-2 border-l-2 border-primary/20 bg-muted/30">
                                                        <b>Flow Verification:</b> High Digital VLSI scores require proof of implementation flows (ASIC/PD).
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </section>
                            </div>

                            {/* Footer */}
                            <div className="p-6 bg-muted/30 border-t border-border flex justify-end">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-6 py-2 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
