
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execPromise = promisify(exec);

async function run() {
    try {
        const scriptPath = path.join(process.cwd(), "src/scripts/parse-pdf.mjs");
        const pdfPath = "d:\\USEME FOLDER\\ANTIGRAVITY\\Pradeep_Hardware_Resume.pdf";

        console.log(`Parsing ${pdfPath}...`);
        const { stdout } = await execPromise(`node "${scriptPath}" "${pdfPath}"`);
        const result = JSON.parse(stdout.trim());

        if (result.success) {
            const text = result.text;
            const leetcodeMatch = text.match(/(?:leetcode\.com\/(?:u\/)?)([\w\-\_]+)/i);

            console.log("\n--- LeetCode Extraction ---");
            if (leetcodeMatch) {
                const username = leetcodeMatch[1].replace(/\/$/, "");
                const cleanUsername = username.trim();
                console.log(`USERNAME:${cleanUsername}`);
            } else {
                console.log("No LeetCode username found in text.");
                // Check links
                const linkMatch = result.links.find(l => l.includes("leetcode.com"));
                if (linkMatch) {
                    console.log("Found in links:", linkMatch);
                }
            }
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
