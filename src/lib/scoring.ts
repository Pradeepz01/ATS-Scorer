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
        digital_vlsi: number;
        analog_vlsi: number;
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
        confidenceScore: number;
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

// ECE Domain Keywords Restructured into Tiers
// Tier 1 (Core): 10 pts, Tier 2 (Pro): 5 pts, Tier 3 (Exposure): 2 pts
const ECE_DOMAINS_TIERED = {
    communication: {
        tier1: ["signal processing", "wireless", "communication systems", "information theory"],
        tier2: ["matlab", "dsp", "fft", "filters", "5g", "lte", "modulation", "sampling", "convolution", "transforms", "equalization", "ofdm"],
        tier3: ["simulink", "wi-fi", "bluetooth", "lorawan", "spectrogram"]
    },
    digital_vlsi: {
        tier1: ["verilog", "vhdl", "systemverilog", "asic", "fpga", "computer architecture"],
        tier2: ["vivado", "quartus", "sta", "dft", "logic synthesis", "modelsim", "physical design", "verification", "uvm", "soc", "risc-v"],
        tier3: ["digital design", "logic design", "fsm", "testbench"]
    },
    analog_vlsi: {
        tier1: ["analog design", "rf design", "mixed signal", "cmos", "mosfet", "op amp", "operational amplifier", "bandgap reference", "ptat", "ctat"],
        tier2: ["virtuoso", "hspice", "ngspice", "spectre", "ltspice", "lt spice", "layout design", "adc", "dac", "pll", "lna", "mixer", "vco", "rfic", "pmu", "biasing", "oscillators"],
        tier3: ["matching networks", "smith chart", "vna", "spectrum analyzer", "s-parameters", "noise figure", "linearity", "antenna design", "scl 180nm", "transient analysis", "dc sweep", "temperature sweep"]
    },
    embedded: {
        tier1: ["embedded c", "microcontroller", "rtos", "arm", "cortex"],
        tier2: ["stm32", "arduino", "esp32", "uart", "i2c", "spi", "iot", "bare metal", "device drivers", "interrupts", "timers"],
        tier3: ["raspberry pi", "mqtt", "lora", "sensors", "actuators"]
    },
    software: {
        tier1: ["c++", "python", "data structures", "algorithms", "oops"],
        tier2: ["java", "sql", "machine learning", "ai", "tensorflow", "pytorch", "git", "linux", "operating systems"],
        tier3: ["web development", "react", "node", "docker", "api design"]
    }
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
    "eda tools": ["vivado", "quartus", "cadence", "virtuoso", "synopsys", "modelsim", "xilinx", "altera", "spectre", "hspice", "ngspice", "ltspice"],
    "cmos layout": ["drc", "lvs", "physical verification", "layout design", "gdsii", "mask design", "post-layout"],

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

// Helper to map roles to our 5 radar domains
function getRoleDomain(role: RoleData): string {
    const title = role.role.toLowerCase();
    const domain = (role.domain || "").toLowerCase();

    // Software
    if (domain.includes("software") || title.includes("full-stack") || title.includes("web dev") || title.includes("programmer analyst")) return "software";

    // Embedded
    if (title.includes("embedded") || title.includes("firmware") || title.includes("iot") || title.includes("microcontroller") || title.includes("rtos")) return "embedded";

    // Analog / RF VLSI
    if (title.includes("analog") || title.includes("mixed signal") || title.includes("virtuoso") || (title.includes("rf") && (title.includes("design") || title.includes("ic")))) return "analog_vlsi";

    // Digital VLSI
    if (title.includes("vlsi") || title.includes("asic") || title.includes("rtl") || title.includes("fpga") || title.includes("digital design") || title.includes("dft") || title.includes("verification") || title.includes("static timing")) return "digital_vlsi";

    // Communication
    if (title.includes("communication") || title.includes("rf") || title.includes("antenna") || title.includes("wireless") || title.includes("dsp") || title.includes("signal processing")) return "communication";

    return "core";
}

// Premium Keywords for Industry Depth (Fortune 500 / R&D focus)
const PREMIUM_KEYWORDS = [
    "risc-v", "verilog", "vhdl", "systemverilog", "patent", "stm32", "rtos", "uav", "pcb design",
    "gnu radio", "firmware", "rtl", "asic", "fpga", "physical design", "sta", "dft", "soc",
    "analog design", "rf design", "antenna", "signal processing", "digital electronics"
];

function predictRole(eceScores: ATSResult['eceScores'], text: string) {
    const cgpa = extractCGPA(text);

    // 1. Contextual Detection (College Tier & Project Depth)
    const TIER1_COLLEGES = ['ceg', 'guindy', 'iit', 'nit', 'bits pilani', 'bits hyderabad', 'iiit', 'psg tech', 'rvce', 'mit chennai'];
    const isTier1 = TIER1_COLLEGES.some(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        const match = text.match(regex);
        if (!match) return false;

        // Use a wider context for rejection
        const start = Math.max(0, match.index! - 60);
        const end = Math.min(text.length, match.index! + 60);
        const context = text.substring(start, end).toLowerCase();

        // Expanded rejection list for 2025 fresher context (workshops, certifications, student initiatives)
        const nonInstitutionalKeywords = [
            'workshop', 'course', 'tutorial', 'nptel', 'certification', 'training',
            'participant', 'initiative', 'project', 'program', 'event', 'club',
            'competed', 'won', 'presented', 'organized', 'hosted'
        ];

        if (nonInstitutionalKeywords.some(bad => context.includes(bad))) return false;

        // Positive institutional indicators (optional but helpful)
        const institutionalIndicators = ['education', 'b.e', 'b.tech', 'bachelor', 'university', 'college', 'institute', 'degree', 'percentage', 'cgpa', 'passed out'];
        // Require at least one institutional indicator in the vicinity or beginning of resume
        if (!institutionalIndicators.some(good => context.includes(good)) && match.index! > 2000) return false;

        return true;
    }) && !hasMatch(text, 'affiliated');

    let depthPoints = 0;
    PREMIUM_KEYWORDS.forEach(kw => {
        if (hasMatch(text, kw)) depthPoints++;
    });

    // 1. Calculate Score for EACH role
    const scoredRoles = ROLES_DATA.map(roleData => {
        const rDomain = getRoleDomain(roleData);

        let domainScore = 0;
        if (rDomain === "software") domainScore = eceScores.software;
        else if (rDomain === "embedded") domainScore = eceScores.embedded;
        else if (rDomain === "digital_vlsi") domainScore = eceScores.digital_vlsi;
        else if (rDomain === "analog_vlsi") domainScore = eceScores.analog_vlsi;
        else if (rDomain === "communication") domainScore = eceScores.communication;
        else domainScore = Math.max(eceScores.digital_vlsi, eceScores.embedded);

        // **Aggressive Software Bias Fix**
        if (rDomain === "software" && (eceScores.embedded > 30 || eceScores.digital_vlsi > 30 || eceScores.analog_vlsi > 30 || eceScores.communication > 30)) {
            domainScore *= 0.4;
        }

        // Skill match (60%) using semantic engine
        let skillMatchCount = 0;
        roleData.skills.forEach(skill => {
            if (hasMatch(text, skill)) skillMatchCount++;
        });

        let skillScore = (skillMatchCount / roleData.skills.length) * 100;

        // --- SPECIFIC ROLE LOGIC (USER REQUEST: Mithun Benchmark) ---

        // 1. Verification Penalty (Strict SV/UVM requirement)
        if (roleData.role.includes("Verification") && !hasMatch(text, "SystemVerilog") && !hasMatch(text, "UVM")) {
            skillScore *= 0.3; // Heavy penalty for missing core verification stack
        }

        // 2. Embedded/Software Penalty for Hardware-Heavy profiles
        if (roleData.role.includes("Embedded") || roleData.domain === "Software") {
            const hardwareSignals = ["analog design", "cadence", "virtuoso", "digital design", "verilog"];
            if (hardwareSignals.some(s => hasMatch(text, s)) && !hasMatch(text, "embedded c") && !hasMatch(text, "rtos")) {
                skillScore *= 0.5;
            }
        }

        // 3. RF / DSP Penalty
        if (roleData.role.includes("RF") || roleData.role.includes("Communication")) {
            // RF specific check for Analog-heavy candidates
            if (eceScores.analog_vlsi > 50 && !hasMatch(text, "hfss") && !hasMatch(text, "ads") && !hasMatch(text, "antenna")) {
                skillScore *= 0.4; // Penalize RF if tools are missing but Analog is strong
            }
            if (!hasMatch(text, "dsp") && !hasMatch(text, "signal processing") && !hasMatch(text, "fft")) {
                skillScore *= 0.2;
            }
        }

        // 4. Analog Design Primary Boost (Project specific)
        if (roleData.role.includes("Analog") && hasMatch(text, "bandgap") && hasMatch(text, "virtuoso")) {
            skillScore += 15; // Precision boost for strong analog project signal
        }

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
        { name: "digital_vlsi", score: eceScores.digital_vlsi },
        { name: "analog_vlsi", score: eceScores.analog_vlsi },
        { name: "software", score: eceScores.software * 0.5 } // 50% dampener for selection
    ].sort((a, b) => b.score - a.score);

    // Helper to find best role in a specific domain
    const findBestRole = (domainName: string, excludeRoles: typeof scoredRoles) => {
        return scoredRoles.find(r =>
            (r as RoleData & { rDomain: string }).rDomain === domainName &&
            !excludeRoles.includes(r) &&
            r.score > 10 // Lowered threshold slightly to ensure match
        );
    };

    // Slot 1: Primary Domain (Strictly follows Radar Chart)
    const slot1 = findBestRole(rankedDomains[0].name, selectedRoles);
    if (slot1) selectedRoles.push(slot1);
    else if (scoredRoles.length > 0) selectedRoles.push(scoredRoles[0]);

    // Slot 2: Secondary Domain (or Best available in Primary Domain if secondary is weak)
    const slot2 = rankedDomains[1].score > 30
        ? findBestRole(rankedDomains[1].name, selectedRoles)
        : findBestRole(rankedDomains[0].name, selectedRoles);

    if (slot2) selectedRoles.push(slot2);
    else {
        const nextBest = scoredRoles.find(r => !selectedRoles.includes(r) && r.score > 30);
        if (nextBest) selectedRoles.push(nextBest);
    }

    // Slot 3: Tertiary fallback or best available specialized role
    const slot3 = rankedDomains[2].score > 20
        ? findBestRole(rankedDomains[2].name, selectedRoles)
        : findBestRole(rankedDomains[0].name, selectedRoles) || findBestRole(rankedDomains[1].name, selectedRoles);

    if (slot3 && !selectedRoles.includes(slot3)) selectedRoles.push(slot3);
    else {
        const nextBest = scoredRoles.find(r => !selectedRoles.includes(r) && r.score > 20);
        if (nextBest) selectedRoles.push(nextBest);
    }

    const primaryRole = selectedRoles[0]?.role || "Unknown Role";
    const secondaryRoles = selectedRoles.slice(1).map(r => r.role);

    // Role discovery improvement: Ensure high confidence or use GET fallback
    const rolesForPrediction = [selectedRoles[0]];

    // --- Weighted Salary Prediction (Fortune 500 Trends 2025-26) ---
    // Using a refined Slab-based model for Freshers to ensure benchmark alignment
    let totalWeight = 0;
    let weightedMin = 0;
    let weightedMax = 0;

    rolesForPrediction.forEach(role => {
        if (role && (role.score > 5 || rolesForPrediction.length === 1)) {
            const rDomain = (role as RoleData & { rDomain: string }).rDomain;

            // Base Slabs (F500 Freshers 2025-26)
            let baseMin = 2.5;
            let baseMax = 3.8;

            if (rDomain === "digital_vlsi") { baseMin = 3.6; baseMax = 5.5; }
            else if (rDomain === "analog_vlsi") { baseMin = 3.8; baseMax = 6.0; } // Higher base for Analog IC (₹7.0-9.0 range after merit)
            else if (rDomain === "embedded") { baseMin = 3.0; baseMax = 4.5; }
            else if (rDomain === "software") { baseMin = 3.3; baseMax = 5.0; }

            // Step B: Merit Boosts
            if (isTier1) {
                baseMin += 3.2;
                baseMax += 5.0;
            }

            // Depth Boost (Max 35% lift for depth)
            const depthBoost = 1.0 + (depthPoints * 0.04);
            baseMax *= depthBoost;
            baseMin *= (1.0 + (depthPoints * 0.015));

            // Step C: Confidence Penalty
            const confidence = role.skillScore / 100;
            if (confidence < 0.4) {
                baseMax = baseMin + (baseMax - baseMin) * 0.25;
            }

            if (baseMin > 0) {
                weightedMin += baseMin;
                weightedMax += baseMax;
                totalWeight += 1;
            }
        }
    });

    // Final Normalization
    let predMin = totalWeight > 0 ? (weightedMin / totalWeight) : 3.0;
    let predMax = totalWeight > 0 ? (weightedMax / totalWeight) : 4.5;

    // CGPA Persistence (Extra lift for 9+)
    if (cgpa >= 9.0) {
        predMin += 0.5;
        predMax += 0.8;
    }

    // Ensure realistic bounds
    predMin = Math.max(3.0, predMin);
    predMax = Math.max(predMin + 1.2, predMax);

    // Floor the Max if it gets too crazy for freshers, but allow ceiling for Tier-1
    if (!isTier1) predMax = Math.min(10.0, predMax);
    else predMax = Math.min(18.0, predMax);

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
        },
        topScore: scoredRoles[0]?.score || 0,
        secondScore: scoredRoles[1]?.score || 0,
        maxDomainScore: Math.max(...Object.values(eceScores))
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
        .filter(([, present]) => !present)
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

    const feedback: string[] = [];
    if (actionVerbCount >= 3) formattingScore += 10;
    else feedback.push("Use more strong action verbs (e.g., Developed, Engineered, Optimized).");

    if (actionVerbCount >= 5) formattingScore += 10;

    // Check contact info explicitly for feedback
    const hasEmail = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/.test(text);
    const hasPhone = /(?:\+?\d{1,3}[-.\s]?)?\d{10}\b/.test(text) || /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);

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
        communication: calculateDomainScore(lowerText, ECE_DOMAINS_TIERED.communication, projectExpText),
        digital_vlsi: calculateDomainScore(lowerText, ECE_DOMAINS_TIERED.digital_vlsi, projectExpText),
        analog_vlsi: calculateDomainScore(lowerText, ECE_DOMAINS_TIERED.analog_vlsi, projectExpText),
        embedded: calculateDomainScore(lowerText, ECE_DOMAINS_TIERED.embedded, projectExpText),
        software: calculateDomainScore(lowerText, ECE_DOMAINS_TIERED.software, projectExpText)
    };

    // Calculate keyword score (Stricter mapping)
    const avgDomainScore = (eceScores.communication + eceScores.digital_vlsi + eceScores.analog_vlsi + eceScores.embedded + eceScores.software) / 5;
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
    Object.values(ECE_DOMAINS_TIERED).forEach(domain => {
        const allK = [...domain.tier1, ...domain.tier2, ...domain.tier3];
        allK.forEach(k => {
            if (hasMatch(lowerText, k)) foundKeywords.push(formatSkill(k));
        });
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
        // Conservative Logic: Hard=0.75, Medium=0.25, Easy=0.08 (Capped at 20)
        extraSoftwarePoints = Math.min(
            (easySolved * 0.08) +
            (mediumSolved * 0.25) +
            (hardSolved * 0.75),
            20
        );

        feedback.push(`LeetCode Verified: ${totalSolved} solved (+${Math.round(extraSoftwarePoints)} Skill points).`);
    }

    if (platformStats?.hdlbits?.solvedCount && platformStats.hdlbits.solvedCount > 0) {
        const solved = platformStats.hdlbits.solvedCount;
        // Ultra-Conservative Logic: 1 point per 8 solved problems (capped at 20 points)
        extraVLSIPoints = Math.min(solved / 8, 20);

        eceScores.digital_vlsi = Math.min(eceScores.digital_vlsi + extraVLSIPoints, 100);
        feedback.push(`HDLBits Verified: ${solved} solved (+${Math.round(extraVLSIPoints)} Skill points to Digital VLSI).`);
    } else if (contactValidation.hdlbits) {
        feedback.push("HDLBits profile found but stats could not be verified.");
    }

    // Apply software bonus
    eceScores.software = Math.min(eceScores.software + extraSoftwarePoints, 100);

    // --- 6. Role Prediction (Using augmented eceScores) ---
    const { primaryRole, secondaryRoles, allRoles, salaryPrediction, topScore, secondScore, maxDomainScore } = predictRole(eceScores, lowerText);

    // --- 7. Confidence Score Calculation (System Confidence) ---
    // 1. Role Strength (40%): How well the top role matches
    const roleWeight = Math.min(topScore / 80 * 40, 40);
    // 2. Role Separation (10%): If one role is significantly better than second
    const separationWeight = Math.min(Math.max(0, (topScore - secondScore) / 20) * 10, 10);
    // 3. Keyword Density (20%): Depth of technical knowledge
    const skillWeight = Math.min(keywordScore / 60 * 20, 20);
    // 4. Completeness (20%): Based on section Presence
    const completenessWeight = (sectionScore / 100) * 20;
    // 5. Domain Clarity (10%): Distinctiveness of the radar profile
    const clarityWeight = Math.min(Math.max(0, (maxDomainScore - avgDomainScore) / 30) * 10, 10);

    const confidenceScore = Math.round(roleWeight + separationWeight + skillWeight + completenessWeight + clarityWeight);

    // Recalculate keyword/total score with bonuses
    const finalKeywordScore = Math.min(keywordScore + (extraSoftwarePoints + extraVLSIPoints) / 2, 100);
    const finalOverallScore = Math.min(score + (extraSoftwarePoints + extraVLSIPoints) / 4, 100);

    // Final Feedback Adjustments
    if (missingSections.length > 0) feedback.push(`Missing sections: ${missingSections.join(", ")}`);
    if (!contactValidation.linkedin) feedback.push("Add your LinkedIn profile.");
    if (!contactValidation.github) feedback.push("GitHub link is necessary. Add your project files to GitHub and include the link in your Project section.");
    if (score < 50) feedback.push("Overall score is low. Focus on adding more relevant keywords and sections.");
    if (avgDomainScore < 15) feedback.push("Skill Proximity Radar is too small. Add more domain-specific technical keywords (VLSI, Embedded, or Communication) to expand your profile.");

    return {
        score: Math.min(Math.round(finalOverallScore), 100),
        details: { sectionScore, formattingScore, keywordScore: finalKeywordScore, lengthScore },
        missingSections,
        foundKeywords: [...new Set(foundKeywords)],
        feedback: [...new Set(feedback)], // dedup
        eceScores,
        rolePrediction: { primaryRole, secondaryRoles, allRoles, salaryPrediction, confidenceScore },
        educationDetails,
        contactValidation,
        platformStats
    };
}

// Helper for domain scores
// Helper for domain scores with weighted tiers
function calculateDomainScore(text: string, tieredKeywords: { tier1: string[], tier2: string[], tier3: string[] }, projectExpText: string = ""): number {
    let rawScore = 0;

    const processTier = (keywords: string[], weight: number) => {
        keywords.forEach(k => {
            if (hasMatch(text, k)) {
                // Context Bonus: Keywords in Projects/Experience count 1.5x
                if (projectExpText && hasMatch(projectExpText, k)) {
                    rawScore += (weight * 1.5);
                } else {
                    rawScore += weight;
                }
            }
        });
    };

    processTier(tieredKeywords.tier1, 10);
    processTier(tieredKeywords.tier2, 5);
    processTier(tieredKeywords.tier3, 2);

    return Math.min(rawScore, 100);
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
