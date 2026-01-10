const fs = require('fs');

const csvPath = 'd:\\USEME FOLDER\\ANTIGRAVITY\\ceg_core_skills_jobs_v3_final.csv';
const outputPath = 'd:\\USEME FOLDER\\ANTIGRAVITY\\ats-scorer\\src\\lib\\roles_data.ts';

try {
    const fileContent = fs.readFileSync(csvPath, 'utf-8');

    // Manual CSV parsing to handle quotes
    const parseCSV = (text) => {
        const lines = text.split(/\r?\n/).filter(l => l.trim()); // handle CRLF
        const result = [];

        // Skip header row
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const row = [];
            let inQuotes = false;
            let currentField = '';

            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char === '"') {
                    // Check for escaped quote (two quotes)
                    if (j + 1 < line.length && line[j + 1] === '"') {
                        currentField += '"';
                        j++;
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (char === ',' && !inQuotes) {
                    row.push(currentField.trim());
                    currentField = '';
                } else {
                    currentField += char;
                }
            }
            row.push(currentField.trim());

            // Expected columns: 12
            // 0: Job Role
            // 1: Domain
            // 2: Required Core Skills
            // 3: Companies
            // 4: Batch-wise Salary
            // 5: Avg Entry CTC
            // 6: Highest Package
            // 7: Lowest Package
            // 8: Internship Stipend
            // 9: Internship Range
            // 10: Success Rate
            // 11: Job Summary

            if (row.length > 5) { // ensure we have enough columns
                const obj = {};
                obj.role = row[0];
                obj.domain = row[1];
                // Remove surrounding quotes if they exist and split
                obj.skills = row[2] ? row[2].replace(/^"|"$/g, '').split(/,\s*/).map(s => s.trim()) : [];
                obj.companies = row[3] ? row[3].replace(/^"|"$/g, '').split(/,\s*/).map(s => s.trim()) : [];
                obj.salary = {
                    avg: row[5] || "N/A",
                    highest: row[6] || "N/A",
                    lowest: row[7] || "N/A",
                    internship: row[8] || "N/A"
                };
                // Job Summary is at index 11, but handle if missing
                obj.description = row[11] ? row[11].replace(/^"|"$/g, '') : "No description available.";

                result.push(obj);
            }
        }
        return result;
    };

    const data = parseCSV(fileContent);

    const tsContent = `export interface RoleData {
    role: string;
    domain: string;
    skills: string[];
    companies: string[];
    salary: {
        avg: string;
        highest: string;
        lowest: string;
        internship: string;
    };
    description: string;
}

export const ROLES_DATA: RoleData[] = ${JSON.stringify(data, null, 4)};
`;

    fs.writeFileSync(outputPath, tsContent);
    console.log('Successfully generated roles_data.ts with ' + data.length + ' roles.');

} catch (err) {
    console.error('Error:', err);
    process.exit(1);
}
