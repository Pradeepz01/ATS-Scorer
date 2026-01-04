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

            // Calculate score
            const analysis = calculateATSScore(fullText);

            // Clean up temp file
            fs.unlinkSync(tempFilePath);

            return NextResponse.json({
                text: fullText,
                info: { numPages: result.pages },
                analysis
            });

        } catch (parseError: any) {
            // Clean up temp file if exists
            if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
            throw parseError;
        }

    } catch (error: any) {
        console.error("Error processing PDF:", error);
        return NextResponse.json(
            { error: "Failed to process PDF", details: error.message },
            { status: 500 }
        );
    }
}
