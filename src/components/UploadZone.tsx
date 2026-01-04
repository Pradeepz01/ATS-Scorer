"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Loader2, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
    onAnalysisComplete: (data: any) => void;
}

export default function UploadZone({ onAnalysisComplete }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const processFile = async (file: File) => {
        if (file.type !== "application/pdf") {
            setError("Please upload a PDF file.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/analyze", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || "Analysis failed");
            }

            const data = await response.json();
            onAnalysisComplete(data.analysis);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to analyze resume. Please try again.");
        } finally {
            setIsLoading(false);
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    return (
        <div className="w-full max-w-xl mx-auto mt-10">
            <motion.div
                layout
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-10 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden",
                    isDragging
                        ? "border-primary bg-primary/5 ring-4 ring-primary/20"
                        : "border-border hover:border-primary/50 hover:bg-muted/50",
                    isLoading && "opacity-50 pointer-events-none"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload")?.click()}
            >
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileChange}
                />

                <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                >
                                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                >
                                    <Upload
                                        className={cn(
                                            "w-16 h-16 transition-colors",
                                            isDragging ? "text-primary" : "text-muted-foreground"
                                        )}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-xl font-semibold tracking-tight">
                            {isLoading ? "Analyzing Resume..." : "Upload your Resume"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {isLoading
                                ? "Extracting matching keywords & sections"
                                : "Drag & drop your PDF or click to browse"}
                        </p>
                    </div>
                </div>

                {/* Dynamic Background Effect */}
                {isDragging && (
                    <motion.div
                        layoutId="drag-overlay"
                        className="absolute inset-0 bg-primary/5 z-[-1]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    />
                )}
            </motion.div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2"
                    >
                        <XCircle className="w-5 h-5" />
                        <p className="text-sm font-medium">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
