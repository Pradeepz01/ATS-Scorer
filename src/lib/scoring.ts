import { ROLES_DATA, RoleData } from "./roles_data";

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
    // ECE Specifics
    eceScores: {
        communication: number;
        vlsi: number;
        embedded: number;
        software: number;
    };
    rolePrediction: {
        primaryRole: string;
        secondaryRoles: string[];
        allRoles: {
            name: string;
            missingSkills: string[];
            salary: RoleData['salary'];
            companies: string[];
            description: string;
        }[];
        salaryPrediction: {
            min: number;
            max: number;
        };
    };
    educationDetails?: {
        college: string;
        batch: string;
    };
    contactValidation: {
        email: boolean;
        phone: boolean;
        linkedin: boolean;
        github: boolean;
        hdlbits: boolean;
        leetcode: boolean;
        urls: {
            linkedin?: string;
            github?: string;
            leetcode?: string;
            hdlbits?: string;
        };
    };
    platformStats?: {
        leetcode?: {
            totalSolved: number;
            easySolved: number;
            mediumSolved: number;
            hardSolved: number;
            ranking: number;
            contributionPoints: number;
        };
        hdlbits?: {
            solvedCount?: number; // If we can find it
        };
    };
}

const COMMON_SECTIONS = [
    "Experience", "Work History", "Education", "Skills", "Summary", "Profile", "Projects", "Certifications"
];

// ECE Domain Keywords (Kept for basic eceScores calculation)
const ECE_DOMAINS = {
    communication: ["signal processing", "dsp", "matlab", "fft", "filters", "wireless", "5g", "lte", "modulation", "communication systems", "rf", "antenna", "spectrum"],
    vlsi: ["verilog", "vhdl", "rtl", "systemverilog", "fpga", "asic", "vivado", "quartus", "cadence", "virtuoso", "synopsys", "layout", "cmos", "mosfet", "digital design", "timing analysis"],
    embedded: ["embedded c", "microcontroller", "arduino", "stm32", "rtos", "arm", "cortex", "uart", "i2c", "spi", "firmware", "iot", "raspberry pi", "sensors", "actuators"],
    software: ["python", "c++", "data structures", "algorithms", "oops", "java", "sql", "machine learning", "ai", "tensorflow", "pytorch", "web development", "react", "node"]
};

// Semantic Skill/Alias Mapping
const SKILL_ALIASES: Record<string, string[]> = {
    // Embedded
    "microcontroller programming": ["esp32", "esp8266", "stm32", "arduino", "pic", "avr", "8051", "atmel", "microcontroller", "mcu", "node mcu"],
    "rtos": ["freertos", "vxworks", "zephyr", "micrium", "real-time operating system", "embos"],
    "iot": ["internet of things", "mqtt", "lora", "nodemcu", "thinkspeak", "adafruit io"],
    "embedded c": ["c programming", "low level c", "bare metal"],

    // VLSI
    "verilog": ["hdl", "rtl coding", "hdl programming"],
    "vhdl": ["hdl", "rtl coding"],
    "digital design": ["logic design", "combinational logic", "sequential logic"],
    "eda tools": ["vivado", "quartus", "cadence", "virtuoso", "synopsys", "modelsim", "xilinx", "altera"],

    // Communication
    "signal processing": ["dsp", "fft", "filtering", "sampling", "convolution", "transforms"],
    "matlab": ["simulink", "octave"],
    "wireless": ["5g", "lte", "rf", "antenna", "modulation", "demodulation", "wi-fi", "bluetooth", "lorawan"],

    // Programming
    "python": ["numPy", "pandas", "matplotlib", "scripting"],
    "machine learning": ["deep learning", "neural networks", "ai", "tensorflow", "pytorch", "scikit-learn", "keras"],
    "c++": ["cpp", "c c++", "c/c++", "c,c++", "c & c++", "object oriented programming", "c/cpp"]
};

// Helper to check if a skill (or its aliases) exists in text
function hasMatch(text: string, targetSkill: string): boolean {
    const normalize = (val: string) => val.toLowerCase()
        .replace(/c\s*[\/\,]\s*c\+\+/g, "c c++") // Handle C/C++ or C,C++
        .replace(/\bc\b\s*[\/\,]\s*\bc\+\+\b/g, "c c++")
        .replace(/c\s*\/\s*cpp/g, "c c++");

    const normalizedText = normalize(text);
    const lowerTarget = normalize(targetSkill);

    // 1. Direct match (with word boundary for short tokens)
    const isShort = lowerTarget.length <= 3;
    if (isShort) {
        const regex = new RegExp(`\\b${lowerTarget.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(normalizedText)) return true;
    } else {
        if (normalizedText.includes(lowerTarget)) return true;
    }

    // 2. Alias match
    const aliases = SKILL_ALIASES[lowerTarget];
    if (aliases) {
        for (const alias of aliases) {
            const lowerAlias = alias.toLowerCase();
            const aliasIsShort = lowerAlias.length <= 3;
            if (aliasIsShort) {
                const regex = new RegExp(`\\b${lowerAlias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                if (regex.test(normalizedText)) return true;
            } else {
                if (normalizedText.includes(lowerAlias)) return true;
            }
        }
    }

    return false;
}

// Helper to extract batch/education (flexible naming)
function extractCGPA(text: string): number {
    const cgpaRegex = /(?:cgpa|gpa|score)\s*[:=-]?\s*(\d+(?:\.\d+)?)/i;
    const match = text.match(cgpaRegex);
    if (match) {
        const val = parseFloat(match[1]);
        if (val <= 10) return val;
        if (val <= 100) return val / 10; // Convert percentage to 10 scale
    }
    return 0;
}

// Helper to map roles to our 4 radar domains
function getRoleDomain(role: RoleData): string {
    const title = role.role.toLowerCase();
    const domain = role.domain.toLowerCase();
    if (domain.includes("software") || title.includes("full-stack") || title.includes("web dev")) return "software";
    if (title.includes("embedded") || title.includes("firmware") || title.includes("iot") || title.includes("microcontroller") || title.includes("rtos")) return "embedded";
    if (title.includes("vlsi") || title.includes("asic") || title.includes("rtl") || title.includes("fpga") || title.includes("physical design") || title.includes("verification") || title.includes("digital design") || title.includes("dft")) return "vlsi";
    if (title.includes("communication") || title.includes("rf") || title.includes("antenna") || title.includes("wireless") || title.includes("dsp") || title.includes("signal processing")) return "communication";
    return "core";
}

function predictRole(eceScores: any, text: string) {
    const cgpa = extractCGPA(text);

    // --- Experience & Seniority Detection ---
    const isStudent = /3rd year|4th year|3rd-year|4th-year|student|intern|pursuing|undergraduate/i.test(text);
    const graduatYearMatch = text.match(/\b(202[5-8])\b/);
    const isJunior = isStudent || !!graduatYearMatch;

    // 1. Calculate Score for EACH role
    const scoredRoles = ROLES_DATA.map(roleData => {
        const rDomain = getRoleDomain(roleData);

        let domainScore = 0;
        if (rDomain === "software") domainScore = eceScores.software;
        else if (rDomain === "embedded") domainScore = eceScores.embedded;
        else if (rDomain === "vlsi") domainScore = eceScores.vlsi;
        else if (rDomain === "communication") domainScore = eceScores.communication;
        else domainScore = Math.max(eceScores.vlsi, eceScores.embedded);

        // **Aggressive Software Bias Fix**
        if (rDomain === "software" && (eceScores.embedded > 30 || eceScores.vlsi > 30 || eceScores.communication > 30)) {
            domainScore *= 0.4;
        }

        // Skill match (60%) using semantic engine
        let skillMatchCount = 0;
        roleData.skills.forEach(skill => {
            if (hasMatch(text, skill)) skillMatchCount++;
        });

        const skillScore = (skillMatchCount / roleData.skills.length) * 100;
        const totalScore = (domainScore * 0.4) + (skillScore * 0.6);

        return { ...roleData, score: totalScore, skillScore, rDomain };
    });

    // 2. Sort by score
    scoredRoles.sort((a, b) => b.score - a.score);

    // 3. Selection Strategy (Strict Domain Hierarchy)
    const selectedRoles: typeof scoredRoles = [];

    // Rank User's Domains with heavy bias against Software for ECE radar
    const rankedDomains = [
        { name: "communication", score: eceScores.communication },
        { name: "embedded", score: eceScores.embedded },
        { name: "vlsi", score: eceScores.vlsi },
        { name: "software", score: eceScores.software * 0.5 } // 50% dampener for selection
    ].sort((a, b) => b.score - a.score);

    // Helper to find best role in a specific domain
    const findBestRole = (domainName: string, excludeRoles: typeof scoredRoles) => {
        return scoredRoles.find(r =>
            (r as any).rDomain === domainName &&
            !excludeRoles.includes(r) &&
            r.score > 10 // Lowered threshold slightly to ensure match
        );
    };

    // Slot 1: Primary Domain (Strictly follows Radar Chart)
    const slot1 = findBestRole(rankedDomains[0].name, selectedRoles);
    if (slot1) selectedRoles.push(slot1);
    else if (scoredRoles.length > 0) selectedRoles.push(scoredRoles[0]);

    // Slot 2: Secondary Domain
    const slot2 = rankedDomains[1].score > 20
        ? findBestRole(rankedDomains[1].name, selectedRoles)
        : findBestRole(rankedDomains[0].name, selectedRoles);

    if (slot2) selectedRoles.push(slot2);
    else {
        const nextBest = scoredRoles.find(r => !selectedRoles.includes(r));
        if (nextBest) selectedRoles.push(nextBest);
    }

    // Slot 3: Tertiary Domain
    const slot3 = rankedDomains[2].score > 20
        ? findBestRole(rankedDomains[2].name, selectedRoles)
        : null;

    if (slot3) selectedRoles.push(slot3);
    else {
        // Fallback: Next best overall
        const nextBest = scoredRoles.find(r => !selectedRoles.includes(r));
        if (nextBest) selectedRoles.push(nextBest);
    }

    const primaryRole = selectedRoles[0]?.role || "Unknown Role";
    const secondaryRoles = selectedRoles.slice(1).map(r => r.role);

    // Role discovery improvement: Ensure high confidence or use GET fallback
    let rolesForPrediction = [selectedRoles[0]];
    const bestScore = selectedRoles[0]?.score || 0;

    // --- Weighted Salary Prediction with CGPA Boost ---
    let totalWeight = 0;
    let weightedMin = 0;
    let weightedMax = 0;

    rolesForPrediction.forEach(role => {
        if (role && (role.score > 20 || rolesForPrediction.length === 1)) {
            let [min, max] = parseSalaryRange(role.salary.avg);
            const confidence = role.skillScore / 100;

            // Experience-Aware Scaling:
            if (isJunior) {
                // Cap senior roles for students/interns to realistic entry levels
                const cap = role.domain === "Software" ? 12.5 : 9.5;
                if (max > cap) {
                    max = cap;
                    min = Math.min(min, cap - 2.5);
                }
            }

            // Stricter Salary Logic
            let effectiveMin = min;
            let effectiveMax = max;

            // If low confidence, drag max down to min
            if (confidence < 0.6) {
                effectiveMax = min + (max - min) * 0.2;
            }

            if (min > 0) {
                weightedMin += effectiveMin;
                weightedMax += effectiveMax;
                totalWeight += 1;
            }
        }
    });

    // Fallback if no specific role matched well (The "Hariish" Fix)
    let predMin = totalWeight > 0 ? (weightedMin / totalWeight) : 6.0;
    let predMax = totalWeight > 0 ? (weightedMax / totalWeight) : 8.0;

    // Apply "Market Reality" Stringency (0.85)
    predMax = predMax * 0.9; // Slightly less dampening for the ceiling
    predMin = predMin * 0.85;

    // --- Ceiling-Based Prediction (Target is Max) ---
    const spread = Math.max(1.5, predMax * 0.25);
    predMin = Math.max(3.0, predMax - spread);

    // **CGPA Salary Boost**
    // High CGPA (>8.5) often unlocks "Dream" status companies paying significantly more
    if (cgpa >= 8.5) {
        predMax *= 1.25; // 25% boost to potential max
        predMin *= 1.1;  // 10% boost to base
    } else if (cgpa >= 7.5) {
        predMax *= 1.1; // 10% boost
    }

    // ---------------------------------------

    // 4. Format for UI
    const allRoles = selectedRoles.map(r => ({
        name: r.role,
        missingSkills: r.skills
            .filter(k => !hasMatch(text, k))
            .slice(0, 5)
            .map(s => formatSkill(s)),
        salary: r.salary,
        companies: r.companies,
        description: r.description
    }));

    return {
        primaryRole,
        secondaryRoles,
        allRoles,
        salaryPrediction: {
            min: parseFloat(predMin.toFixed(1)),
            max: parseFloat(predMax.toFixed(1))
        }
    };
}

const ACTION_VERBS = ["developed", "managed", "created", "led", "designed", "implemented", "optimized", "built", "engineered", "maintained", "collaborated"];

export function calculateATSScore(text: string, platformStats?: ATSResult['platformStats'], extractedLinks: string[] = []) {
    const lowerText = text.toLowerCase();

    // ... (existing section extraction) ...
    // Note: Since I'm replacing a function block, I need to be careful with context.
    // Re-implementing parts of calculateATSScore to add feedback rules.

    // --- 1. Flexible Scoring ---
    // Updated heuristics to be more forgiving/inclusive of different terminologies
    const sections = {
        experience: /experience|work history|internship|internships|training|industrial exposure/i.test(lowerText),
        education: /education|academic|qualification|b\.?e|b\.?tech|bachelor|university|college|institute|degree/i.test(lowerText),
        skills: /skills|technologies|proficiencies|technical stack|competencies/i.test(lowerText),
        projects: /projects|capstone|academic projects/i.test(lowerText),
        summary: /summary|profile|objective|about/i.test(lowerText),
        certifications: /certifications|certificates|courses|achievements/i.test(lowerText)
    };

    const missingSections = Object.entries(sections)
        .filter(([_, present]) => !present)
        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

    let sectionScore = 0;
    if (sections.experience) sectionScore += 25;
    if (sections.education) sectionScore += 20;
    if (sections.skills) sectionScore += 20;
    if (sections.projects) sectionScore += 25;
    if (sections.summary) sectionScore += 5;
    if (sections.certifications) sectionScore += 5;

    // Formatting checks
    let formattingScore = 60;

    // Check for "Action Verbs"
    let actionVerbCount = 0;
    ACTION_VERBS.forEach(verb => {
        if (lowerText.includes(verb)) actionVerbCount++;
    });

    let feedback: string[] = [];
    if (actionVerbCount >= 3) formattingScore += 10;
    else feedback.push("Use more strong action verbs (e.g., Developed, Engineered, Optimized).");

    if (actionVerbCount >= 5) formattingScore += 10;

    // Check contact info explicitly for feedback
    const hasEmail = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/.test(text);
    const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text) || /\d{10}/.test(text);

    if (!hasEmail) feedback.push("Email address missing or not detected.");
    if (!hasPhone) feedback.push("Phone number missing or not detected.");

    // Keyword Stuffing Check
    const keywordCounts: Record<string, number> = {};
    const words = lowerText.split(/\s+/);
    words.forEach(w => {
        if (w.length > 4) {
            keywordCounts[w] = (keywordCounts[w] || 0) + 1;
        }
    });

    let stuffingDetected = false;
    Object.entries(keywordCounts).forEach(([k, v]) => {
        if (v > 15 && !["development", "engineer", "project"].includes(k)) {
            stuffingDetected = true;
            feedback.push(`Potential keyword stuffing detected for "${k}". Keep repetition low.`);
        }
    });
    if (!stuffingDetected) formattingScore += 10;

    // Length check
    const wordCount = words.length;
    let lengthScore = 100;
    if (wordCount < 200) { lengthScore = 60; formattingScore -= 10; feedback.push("Resume is too short. Add more detail."); }
    else if (wordCount > 1200) { lengthScore = 80; formattingScore -= 10; feedback.push("Resume is too long. Try to keep it concise."); }
    else { formattingScore += 10; }

    // Cap formatting
    formattingScore = Math.min(formattingScore, 100);

    // --- 2. Contextual Weighting (Anti-Inflation) ---
    // Extract text specifically from Projects and Experience for 1.5x bonus
    const projectExpMatch = lowerText.match(/(?:experience|projects|work history|academic projects|internships)[\s\S]*?(?:skills|certifications|summary|education|$)/i);
    const projectExpText = projectExpMatch ? projectExpMatch[0] : "";

    const eceScores = {
        communication: calculateDomainScore(lowerText, ECE_DOMAINS.communication, projectExpText),
        vlsi: calculateDomainScore(lowerText, ECE_DOMAINS.vlsi, projectExpText),
        embedded: calculateDomainScore(lowerText, ECE_DOMAINS.embedded, projectExpText),
        software: calculateDomainScore(lowerText, ECE_DOMAINS.software, projectExpText)
    };

    // Calculate keyword score (Stricter mapping)
    const avgDomainScore = (eceScores.communication + eceScores.vlsi + eceScores.embedded + eceScores.software) / 4;
    const keywordScore = Math.min(avgDomainScore * 1.5, 100); // Reduced multiplier from 2.0 to 1.5

    // Total Score
    let score = (sectionScore * 0.4) + (formattingScore * 0.3) + (keywordScore * 0.3);

    // Hackathon Bonus
    const hasHackathon = /hackathon|coding contest|ideathon/i.test(lowerText);
    if (hasHackathon) {
        score += 3;
        feedback.push("Hackathon participation detected! (+3 Bonus)");
    }

    // Find keywords for display
    const foundKeywords: string[] = [];
    Object.values(ECE_DOMAINS).flat().forEach(k => {
        if (hasMatch(lowerText, k)) foundKeywords.push(formatSkill(k));
    });

    // --- 3. Education Parsing ---
    const educationDetails = parseEducation(text);

    // --- 4. Contact & Profile Validation (Flexible URLs) ---
    const extractUrl = (pattern: RegExp) => {
        const match = text.match(pattern);
        return match ? match[0].trim() : undefined;
    };

    const linkedinUrl = extractUrl(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w\-\_]+\/?/i) || extractedLinks.find(l => l.includes("linkedin.com/in/"));
    const githubUrl = extractUrl(/(?:https?:\/\/)?(?:www\.)?github\.com\/[\w\-\_]+\/?/i) || extractedLinks.find(l => l.includes("github.com/"));
    const leetcodeUrl = extractUrl(/(?:https?:\/\/)?(?:www\.)?leetcode\.com\/[\w\-\_]+\/?/i) || extractedLinks.find(l => l.includes("leetcode.com/"));
    const hdlbitsUrl = extractUrl(/(?:https?:\/\/)?(?:www\.)?hdlbits\.01xz\.net\/wiki\/User:[\w\-\_]+/i) || extractUrl(/hdlbits\.01xz\.net\/[\w\-\_]+/i) || extractedLinks.find(l => l.includes("hdlbits.01xz.net"));

    const contactValidation = {
        email: hasEmail,
        phone: hasPhone,
        linkedin: !!linkedinUrl,
        github: !!githubUrl,
        hdlbits: !!hdlbitsUrl,
        leetcode: !!leetcodeUrl,
        urls: {
            linkedin: linkedinUrl,
            github: githubUrl,
            leetcode: leetcodeUrl,
            hdlbits: hdlbitsUrl
        }
    };

    // --- 5. Platform Bonus Scoring (NOW BEFORE ROLE PREDICTION) ---
    let extraSoftwarePoints = 0;
    let extraVLSIPoints = 0;

    if (platformStats?.leetcode && platformStats.leetcode.totalSolved > 0) {
        const { totalSolved, easySolved, mediumSolved, hardSolved } = platformStats.leetcode;
        // Boosted Logic: Hard=1.0, Medium=0.3, Easy=0.1
        extraSoftwarePoints = Math.min(
            (easySolved * 0.1) +
            (mediumSolved * 0.3) +
            (hardSolved * 1.0),
            30
        );

        feedback.push(`LeetCode Verified: ${totalSolved} solved (+${Math.round(extraSoftwarePoints)} Skill points).`);
    }

    if (platformStats?.hdlbits?.solvedCount && platformStats.hdlbits.solvedCount > 0) {
        const solved = platformStats.hdlbits.solvedCount;
        // Boosted Logic: 0.5 points per solved problem (capped at 30 points)
        extraVLSIPoints = Math.min(solved * 0.5, 30);

        eceScores.vlsi = Math.min(eceScores.vlsi + extraVLSIPoints, 100);
        feedback.push(`HDLBits Verified: ${solved} solved (+${Math.round(extraVLSIPoints)} Skill points to VLSI).`);
    } else if (contactValidation.hdlbits) {
        feedback.push("HDLBits profile found but stats could not be verified.");
    }

    // Apply software bonus
    eceScores.software = Math.min(eceScores.software + extraSoftwarePoints, 100);

    // --- 6. Role Prediction (Using augmented eceScores) ---
    const { primaryRole, secondaryRoles, allRoles, salaryPrediction } = predictRole(eceScores, lowerText);

    // Recalculate keyword/total score with bonuses
    const finalKeywordScore = Math.min(keywordScore + (extraSoftwarePoints + extraVLSIPoints) / 2, 100);
    const finalOverallScore = Math.min(score + (extraSoftwarePoints + extraVLSIPoints) / 4, 100);

    // Final Feedback Adjustments
    if (missingSections.length > 0) feedback.push(`Missing sections: ${missingSections.join(", ")}`);
    if (!contactValidation.linkedin) feedback.push("Add your LinkedIn profile.");
    if (!contactValidation.github) feedback.push("GitHub link is necessary. Add your project files to GitHub and include the link in your Project section.");
    if (score < 50) feedback.push("Overall score is low. Focus on adding more relevant keywords and sections.");

    return {
        score: Math.min(Math.round(finalOverallScore), 100),
        details: { sectionScore, formattingScore, keywordScore: finalKeywordScore, lengthScore },
        missingSections,
        foundKeywords: [...new Set(foundKeywords)],
        feedback: [...new Set(feedback)], // dedup
        eceScores,
        rolePrediction: { primaryRole, secondaryRoles, allRoles, salaryPrediction },
        educationDetails,
        contactValidation,
        platformStats
    };
}

// Helper for domain scores
// Helper for domain scores with contextual weighting
function calculateDomainScore(text: string, keywords: string[], projectExpText: string = ""): number {
    let rawScore = 0;
    keywords.forEach(k => {
        if (hasMatch(text, k)) {
            // Context Bonus: Keywords in Projects/Experience count 1.5x
            if (projectExpText && hasMatch(projectExpText, k)) {
                rawScore += 1.5;
            } else {
                rawScore += 1.0;
            }
        }
    });
    // Harder difficulty: 20 technical units required for 100%
    return Math.min(Math.round((rawScore / 20) * 100), 100);
}

// Skill Display Mapping
const SKILL_DISPLAY_MAP: Record<string, string> = {
    "signal processing": "Signal Processing", "dsp": "DSP", "matlab": "MATLAB", "fft": "FFT", "filters": "Filters",
    "wireless": "Wireless", "5g": "5G", "lte": "LTE", "modulation": "Modulation", "communication systems": "Comm. Systems",
    "rf": "RF", "antenna": "Antenna", "spectrum": "Spectrum",
    "verilog": "Verilog", "vhdl": "VHDL", "rtl": "RTL", "systemverilog": "SystemVerilog", "fpga": "FPGA",
    "asic": "ASIC", "vivado": "Vivado", "quartus": "Quartus", "cadence": "Cadence", "virtuoso": "Virtuoso",
    "synopsys": "Synopsys", "layout": "Layout", "cmos": "CMOS", "mosfet": "MOSFET", "digital design": "Digital Design",
    "timing analysis": "Timing Analysis",
    "embedded c": "Embedded C", "microcontroller": "Microcontroller", "arduino": "Arduino", "stm32": "STM32",
    "rtos": "RTOS", "arm": "ARM", "cortex": "Cortex", "uart": "UART", "i2c": "I2C", "spi": "SPI",
    "firmware": "Firmware", "iot": "IoT", "raspberry pi": "Raspberry Pi", "sensors": "Sensors", "actuators": "Actuators",
    "python": "Python", "c++": "C++", "data structures": "Data Structures", "algorithms": "Algorithms",
    "oops": "OOPs", "java": "Java", "sql": "SQL", "machine learning": "Machine Learning", "ai": "AI",
    "tensorflow": "TensorFlow", "pytorch": "PyTorch", "web development": "Web Dev", "react": "React", "node": "Node.js"
};

function formatSkill(skill: string): string {
    return SKILL_DISPLAY_MAP[skill.toLowerCase()] || skill.charAt(0).toUpperCase() + skill.slice(1);
}

// Helper to parse "₹18-22 LPA" or "₹10 LPA" -> [min, max]
function parseSalaryRange(salaryStr: string): [number, number] {
    if (!salaryStr || salaryStr === "N/A") return [0, 0];

    // Remove "₹", "LPA", commas, spaces
    const cleanStr = salaryStr.replace(/[₹,LPA\s]/g, "");

    // Check for range "18-22"
    if (cleanStr.includes("-")) {
        const parts = cleanStr.split("-").map(parseFloat);
        return [parts[0] || 0, parts[1] || parts[0] || 0];
    }

    // Single value "18"
    const val = parseFloat(cleanStr);
    return [val || 0, val || 0];
}

function parseEducation(text: string) {
    // Look for patterns like CEG'27, MIT'25, Anna University 2024
    const shortPattern = /([A-Za-z\s&]+)'(\d{2})/i;
    const match = text.match(shortPattern);

    if (match) {
        return {
            college: match[1].trim(),
            batch: `'${match[2]}`
        };
    }

    // Fallback? Maybe standard parsing if needed, but keeping it simple as requested
    return undefined;
}
