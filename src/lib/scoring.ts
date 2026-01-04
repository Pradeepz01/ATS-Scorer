export interface ATSResult {
    score: number;
    details: {
        sectionScore: number;
        formattingScore: number;
        keywordScore: number;
        lengthScore: number;
    };
    missingSections: string[];
    foundKeywords: string[];
    feedback: string[];
}

const COMMON_SECTIONS = [
    "Experience",
    "Work History",
    "Education",
    "Skills",
    "Summary",
    "Profile",
    "Projects",
    "Certifications"
];

const IMPORTANT_KEYWORDS = [
    "led", "managed", "developed", "created", "designed", "implemented", "optimized",
    "team", "communication", "leadership", "analysis", "project", "data",
    "javascript", "python", "react", "node", "sql", "aws", "cloud" // tech bias but good for general ATS example
];

export function calculateATSScore(text: string): ATSResult {
    let score = 0;
    const lowerText = text.toLowerCase();
    const feedback: string[] = [];
    const foundKeywords: string[] = [];

    // 1. Section Detection (40 points)
    let sectionCount = 0;
    const missingSections: string[] = [];

    // Group synonyms
    const sectionsToCheck = [
        { name: "Experience", keywords: ["experience", "work history", "employment"] },
        { name: "Education", keywords: ["education", "academic", "degree"] },
        { name: "Skills", keywords: ["skills", "technical skills", "competencies"] },
        { name: "Contact", keywords: ["email", "phone", "@", "gmail", "com"] } // loose check for contact
    ];

    sectionsToCheck.forEach(section => {
        const found = section.keywords.some(k => lowerText.includes(k));
        if (found) {
            sectionCount++;
        } else {
            missingSections.push(section.name);
        }
    });

    const sectionScore = (sectionCount / sectionsToCheck.length) * 40;
    score += sectionScore;

    if (missingSections.length > 0) {
        feedback.push(`Missing important sections: ${missingSections.join(", ")}`);
    } else {
        feedback.push("All key sections found.");
    }

    // 2. Keyword/Action Verbs (30 points)
    let keywordCount = 0;
    IMPORTANT_KEYWORDS.forEach(k => {
        if (lowerText.includes(k)) {
            keywordCount++;
            foundKeywords.push(k);
        }
    });

    // Cap at 15 keywords for max points
    const keywordScore = Math.min(keywordCount, 15) * 2;
    score += keywordScore;

    if (keywordCount < 5) {
        feedback.push("Try to use more action verbs (led, managed, developed).");
    }

    // 3. Formatting & Length (30 points)
    let formattingScore = 0;

    // Length check (approx 500-2000 words is good)
    const wordCount = text.split(/\s+/).length;
    if (wordCount > 200 && wordCount < 2000) {
        formattingScore += 15;
    } else if (wordCount <= 200) {
        feedback.push("Resume is too short.");
    } else {
        feedback.push("Resume is very long, consider condensing.");
    }

    // Bullet point check (heuristic: look for "•" or "- ")
    if (text.includes("•") || text.includes("- ") || text.includes("* ")) {
        formattingScore += 15;
    } else {
        feedback.push("Use bullet points for better readability.");
    }

    score += formattingScore;

    return {
        score: Math.min(Math.round(score), 100),
        details: {
            sectionScore,
            formattingScore,
            keywordScore,
            lengthScore: formattingScore // reusing formatting for simplicity in breakdown
        },
        missingSections,
        foundKeywords,
        feedback
    };
}
