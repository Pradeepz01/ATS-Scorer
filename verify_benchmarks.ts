import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { calculateATSScore } from './src/lib/scoring.ts';

const resumes = [
    { name: "Hariish S", path: "d:/USEME FOLDER/ANTIGRAVITY/Hariish_S_CV.pdf", target: "6.5 - 10" },
    { name: "Haries Ragavendra S", path: "d:/USEME FOLDER/ANTIGRAVITY/Hariesragharesume.pdf", target: "3.0 - 4.5" },
    { name: "Pradeep S", path: "d:/USEME FOLDER/ANTIGRAVITY/Pradeep_ECE_3rd_year.pdf", target: "5.0 - 8.0" },
    { name: "Muthusankar AK", path: "d:/USEME FOLDER/ANTIGRAVITY/Resume_Muthusankar.pdf", target: "3.0 - 5.0" }
];

console.log("--- BERRY BENCHMARK VERIFICATION ---");

const results = [];
resumes.forEach(r => {
    try {
        const textOutput = execSync(`node src/scripts/parse-pdf.mjs "${r.path}"`).toString();
        const json = JSON.parse(textOutput);
        const result = calculateATSScore(json.text);

        const data = {
            candidate: r.name,
            target: r.target,
            predicted: `${result.rolePrediction.salaryPrediction.min} - ${result.rolePrediction.salaryPrediction.max} LPA`,
            role: result.rolePrediction.primaryRole
        };
        results.push(data);
        console.log(`Finished ${r.name}`);
    } catch (e) {
        console.error(`Error processing ${r.name}:`, e.message);
    }
});

writeFileSync('benchmarks_final.json', JSON.stringify(results, null, 2), 'utf8');
console.log("Results saved to benchmarks_final.json");
