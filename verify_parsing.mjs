import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Polyfill
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

async function testParse() {
    try {
        const buffer = fs.readFileSync("../Pradeep_ECE_3rd_year.pdf");
        const data = new Uint8Array(buffer);

        console.log("Loading PDF...");
        const loadingTask = pdfjsLib.getDocument({
            data,
            standardFontDataUrl: './node_modules/pdfjs-dist/standard_fonts/',
            disableFontFace: true,
        });

        const pdfDocument = await loadingTask.promise;
        console.log(`PDF Loaded. Pages: ${pdfDocument.numPages}`);

        let fullText = "";
        for (let i = 1; i <= pdfDocument.numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(" ");
            fullText += pageText + "\n";
        }

        console.log("Extraction Success!");
        console.log("First 100 chars:", fullText.substring(0, 100));
    } catch (error) {
        console.error("Test Failed:", error);
        process.exit(1);
    }
}

testParse();
