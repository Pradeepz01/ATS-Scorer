"use client";

import { useState } from "react";
import UploadZone from "@/components/UploadZone";
import ScoreDashboard from "@/components/ScoreDashboard";
import { ATSResult } from "@/lib/scoring";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";

export default function Home() {
  const [result, setResult] = useState<ATSResult | null>(null);

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24 selection:bg-primary/20 relative">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-10">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          ATS Resume Scorer
        </p>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-primary/20 before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:from-primary/10 before:dark:opacity-20 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 z-[-1]">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 text-center">
          Analyze Your Resume
        </h1>
      </div>

      <p className="mt-4 text-muted-foreground text-center max-w-lg mx-auto">
        Check your ATS score and get instant feedback on formatting, keywords, and structural compatibility.
      </p>

      <div className="w-full max-w-5xl mt-8 mb-auto">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <UploadZone onAnalysisComplete={setResult} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-8">
                <button
                  onClick={() => setResult(null)}
                  className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
                >
                  Analyze another resume
                </button>
              </div>
              <ScoreDashboard analysis={result} onReset={() => setResult(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}
