import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import path from 'path';

// Polyfill Promise.withResolvers if missing (Node < 22)
if (typeof Promise.withResolvers === 'undefined') {
    Promise.withResolvers = function () {
        let resolve, reject;
        const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        return { promise, resolve, reject };
    };
}

// Polyfill DOMMatrix
if (typeof global.DOMMatrix === 'undefined') {
    global.DOMMatrix = class DOMMatrix {
        constructor() {
            this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
        }
        translate(x, y) { return this; }
        scale(x, y) { return this; }
        toString() { return "matrix(1, 0, 0, 1, 0, 0)"; }
    };
}

async function parsePDF(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        const data = new Uint8Array(buffer);

        // Explicitly point to standard fonts in node_modules relative to this script or CWD
        // We assume the script is run from project root or we find node_modules
        const standardFontDataUrl = path.join(process.cwd(), 'node_modules/pdfjs-dist/standard_fonts/').split(path.sep).join('/') + '/';

        const loadingTask = pdfjsLib.getDocument({
            data,
            standardFontDataUrl,
            disableFontFace: true,
            // Force disable worker to avoid looking for worker file
            // In legacy build, this often falls back to main thread "fake worker"
            // if we don't specify workerSrc.
            // However, if it fails, we might need to set workerSrc to null or similar.
        });

        const pdfDocument = await loadingTask.promise;

        let fullText = "";
        for (let i = 1; i <= pdfDocument.numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(" ");
            fullText += pageText + "\n";
        }

        // Output JSON result to stdout
        console.log(JSON.stringify({ success: true, text: fullText, pages: pdfDocument.numPages }));
    } catch (error) {
        console.error("Parsing Error:", error);
        console.log(JSON.stringify({ success: false, error: error.message }));
        process.exit(1);
    }
}

const filePath = process.argv[2];
if (!filePath) {
    console.log(JSON.stringify({ success: false, error: "No file path provided" }));
    process.exit(1);
}

parsePDF(filePath);
