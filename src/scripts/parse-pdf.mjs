import fs from 'fs';
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

// Polyfill DOMMatrix FIRST before importing pdfjs-dist
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

// Main execution function
async function main() {
    const filePath = process.argv[2];
    if (!filePath) {
        console.log(JSON.stringify({ success: false, error: "No file path provided" }));
        process.exit(1);
    }

    try {
        // Dynamic import ensures polyfills are set before library loads
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

        const buffer = fs.readFileSync(filePath);
        const data = new Uint8Array(buffer);

        // Explicitly point to standard fonts in node_modules relative to this script or CWD
        const standardFontDataUrl = path.join(process.cwd(), 'node_modules/pdfjs-dist/standard_fonts/').split(path.sep).join('/') + '/';

        const loadingTask = pdfjsLib.getDocument({
            data,
            standardFontDataUrl,
            disableFontFace: true,
        });

        const pdfDocument = await loadingTask.promise;

        let fullText = "";
        let extractedLinks = [];

        for (let i = 1; i <= pdfDocument.numPages; i++) {
            const page = await pdfDocument.getPage(i);

            // 1. Extract Text
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(" ");
            fullText += pageText + "\n";

            // 2. Extract Hyperlinks (Annotations)
            const annotations = await page.getAnnotations();
            for (const annotation of annotations) {
                if (annotation.subtype === 'Link' && annotation.url) {
                    extractedLinks.push(annotation.url);
                }
            }
        }

        // Output JSON result to stdout
        console.log(JSON.stringify({
            success: true,
            text: fullText,
            pages: pdfDocument.numPages,
            links: extractedLinks
        }));
    } catch (error) {
        console.error("Parsing Error:", error);
        console.log(JSON.stringify({ success: false, error: error.message }));
        process.exit(1);
    }
}

main();
