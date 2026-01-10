"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Target, ArrowRight, CheckCircle } from "lucide-react";

interface RolePredictorProps {
    prediction: {
        primaryRole: string;
        secondaryRoles: string[];
        allRoles: { name: string; missingSkills: string[] }[];
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

            {/* Missing Skills Dynamic Display */}
            <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm font-medium text-destructive mb-2">
                    Skills to Acquire for <span className="font-bold underline">{selectedRoleName}</span>:
                </p>
                {selectedRoleData.missingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {selectedRoleData.missingSkills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded border border-destructive/20 capitalize">
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> You have all key skills for this role!
                    </p>
                )}
            </div>
        </motion.div>
    );
}
