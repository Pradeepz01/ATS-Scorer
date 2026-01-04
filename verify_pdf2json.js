const fs = require('fs');
const PDFParser = require("pdf2json");

const pdfParser = new PDFParser(this, 1); // 1 = text content only

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    const text = pdfParser.getRawTextContent();
    console.log("Extraction Success!");
    console.log("First 100 chars:", text.substring(0, 100));
});

const buffer = fs.readFileSync("../Pradeep_ECE_3rd_year.pdf");
// pdf2json expects a file path or buffer parsing via parseBuffer
pdfParser.parseBuffer(buffer);
