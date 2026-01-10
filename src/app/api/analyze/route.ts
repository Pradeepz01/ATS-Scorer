import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import { calculateATSScore } from "@/lib/scoring";
import os from "os";

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Save file to temp path
        const buffer = Buffer.from(await file.arrayBuffer());
        const tempFilePath = path.join(os.tmpdir(), `resume-${Date.now()}.pdf`);
        fs.writeFileSync(tempFilePath, buffer);

        try {
            // Execute the parsing script in a child process
            // This bypasses Next.js bundling issues with pdfjs-dist
            const scriptPath = path.join(process.cwd(), "src/scripts/parse-pdf.mjs");
            const { stdout } = await execPromise(`node "${scriptPath}" "${tempFilePath}"`);

            const result = JSON.parse(stdout.trim());

            if (!result.success) {
                throw new Error(result.error);
            }

            const fullText = result.text;
            const extractedLinks = result.links || [];

            // Combine text and links for better discovery
            const searchSource = fullText + "\n" + extractedLinks.join("\n");


            // --- Parallel Platform Data Fetching ---
            const platformStats: Record<string, unknown> = {};

            const leetcodeMatch = searchSource.match(/(?:leetcode\.com\/(?:u\/)?)([\w\-\_]+)/i);
            const hdlbitsMatch = searchSource.match(/hdlbits\.01xz\.net\/wiki\/Special:VlgStats\/([A-Z0-9]+)/i);

            await Promise.all([
                // 1. Fetch LeetCode
                (async () => {
                    if (leetcodeMatch && leetcodeMatch[1]) {
                        const username = leetcodeMatch[1].replace(/\/$/, "");
                        try {
                            const controller = new AbortController();
                            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

                            const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`, {
                                signal: controller.signal
                            });
                            clearTimeout(timeoutId);

                            if (response.ok) {
                                const data = await response.json();
                                if (data.status === "success") {
                                    platformStats.leetcode = {
                                        totalSolved: data.totalSolved,
                                        easySolved: data.easySolved,
                                        mediumSolved: data.mediumSolved,
                                        hardSolved: data.hardSolved,
                                        ranking: data.ranking,
                                        contributionPoints: data.contributionPoints
                                    };
                                }
                            }
                        } catch (e) {
                            console.error("Failed to fetch LeetCode stats or timed out:", e);
                        }
                    }
                })(),
                // 2. Fetch HDLBits
                (async () => {
                    if (hdlbitsMatch && hdlbitsMatch[1]) {
                        const statsId = hdlbitsMatch[1];
                        try {
                            const controller = new AbortController();
                            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

                            const response = await fetch(`https://hdlbits.01xz.net/wiki/Special:VlgStats/${statsId}`, {
                                signal: controller.signal,
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                                }
                            });
                            clearTimeout(timeoutId);

                            if (response.ok) {
                                const html = await response.text();
                                const solvedMatch = html.match(/Problems solved:<\/(?:td|th)>\s*<td[^>]*>(\d+)<\/td>/i);
                                if (solvedMatch) {
                                    platformStats.hdlbits = {
                                        solvedCount: parseInt(solvedMatch[1])
                                    };
                                }
                            }
                        } catch (e) {
                            console.error("Failed to fetch HDLBits stats or timed out:", e);
                        }
                    }
                })()
            ]);

            // Calculate score with platform data
            const analysis = calculateATSScore(fullText, platformStats, extractedLinks);

            // Clean up temp file
            fs.unlinkSync(tempFilePath);

            return NextResponse.json({
                text: fullText,
                info: { numPages: result.pages },
                analysis
            });

        } catch (parseError: unknown) {
            const error = parseError as Error;
            // Clean up temp file if exists
            if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
            throw error;
        }

    } catch (error: unknown) {
        const err = error as Error;
        console.error("Error processing PDF:", err);
        return NextResponse.json(
            { error: "Failed to process PDF", details: err.message },
            { status: 500 }
        );
    }
}
