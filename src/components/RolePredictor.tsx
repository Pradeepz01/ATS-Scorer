"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle, IndianRupee, Building2 } from "lucide-react";

interface RolePredictorProps {
    prediction: {
        primaryRole: string;
        secondaryRoles: string[];
        allRoles: {
            name: string;
            missingSkills: string[];
            nextStepEnhancements?: string[];
            salary: {
                avg: string;
                highest: string;
                lowest: string;
                internship: string;
            };
            companies: string[];
            description: string;
        }[];
        salaryPrediction: {
            min: number;
            max: number;
        };
    };
}

export default function RolePredictor({ prediction }: RolePredictorProps) {
    const [selectedRoleName, setSelectedRoleName] = useState<string>(prediction.primaryRole);

    // Find the currently selected role data
    const selectedRoleData = prediction.allRoles.find(r => r.name === selectedRoleName) || prediction.allRoles[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6 shadow-sm space-y-4"
        >
            <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Recommended Role</h3>
            </div>

            {/* Top Match - Interactive */}
            <div
                onClick={() => setSelectedRoleName(prediction.primaryRole)}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${selectedRoleName === prediction.primaryRole
                    ? "bg-primary/10 border-primary/50 shadow-sm"
                    : "bg-muted/50 border-transparent hover:bg-muted"
                    }`}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-primary font-medium uppercase tracking-wider mb-1">Top Match</p>
                        <div className="text-xl font-bold text-foreground">{prediction.primaryRole}</div>
                    </div>
                    {selectedRoleName === prediction.primaryRole && <CheckCircle className="w-5 h-5 text-primary" />}
                </div>
            </div>

            {/* Alternative Fits - Interactive */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Alternative Fits (Click to view details):</p>
                <div className="flex flex-wrap gap-2">
                    {prediction.secondaryRoles.map((role, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedRoleName(role)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${selectedRoleName === role
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80 hover:text-foreground"
                                }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            {/* Expected CTC Range */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 mt-2">
                <div className="flex items-center gap-2 mb-2">
                    <IndianRupee className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-semibold text-emerald-700">Expected CTC Range</h3>
                </div>

                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-foreground">
                        ₹{prediction.salaryPrediction?.min || "0"} - {prediction.salaryPrediction?.max || "0"}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">LPA</span>
                </div>

                <p className="text-xs text-muted-foreground mt-2 italic">
                    &quot;Estimated compensation inferred from similar entry-level roles with comparable technical profiles.&quot;
                </p>
            </div>

            {/* Companies (Full List) */}
            {selectedRoleData.companies.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-2">
                        <Building2 className="w-3 h-3" /> Top Recruiters
                    </h4>
                    <div className="flex flex-wrap gap-1">
                        {selectedRoleData.companies.map((comp, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 bg-muted rounded text-muted-foreground border border-border/30">
                                {comp}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* NEW: Job Description Box (Small box after alternative roles/CTC) */}
            <div className="bg-muted/50 border border-border rounded-lg p-3 mt-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground block mb-1">About this role:</span>
                    {selectedRoleData.description}
                </p>
            </div>


            {/* Next Step Enhancements (Replaced Skills to Acquire) */}
            <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Next Step Enhancements:
                </p>
                {/* Fallback to missingSkills if nextStepEnhancements not yet populated/empty */}
                {(selectedRoleData.nextStepEnhancements && selectedRoleData.nextStepEnhancements.length > 0) ? (
                    <ul className="space-y-2">
                        {selectedRoleData.nextStepEnhancements.map((tip, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                {tip}
                            </li>
                        ))}
                    </ul>
                ) : (
                    // If no improvements are needed, show success message
                    <p className="text-xs text-green-600 flex items-center gap-1 font-medium bg-green-500/10 p-2 rounded border border-green-500/20">
                        <CheckCircle className="w-3 h-3" /> You are well aligned for this role! Focus on project depth.
                    </p>
                )}
            </div>
        </motion.div>
    );
}
