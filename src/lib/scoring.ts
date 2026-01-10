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
        // missingSkills: string[]; // Deprecated, use allRoles
        allRoles: { name: string; missingSkills: string[] }[];
    };
    domainAnalysis: {
        digital: number; // percentage
        analog: number; // percentage
        explanation: string;
    };
    contactValidation: {
        email: boolean;
        phone: boolean;
        linkedin: boolean;
        github: boolean;
        hdlbits: boolean; // optional
        leetcode: boolean; // optional
    };
}

const COMMON_SECTIONS = [
    "Experience", "Work History", "Education", "Skills", "Summary", "Profile", "Projects", "Certifications"
];

// ECE Domain Keywords
const ECE_DOMAINS = {
    communication: ["signal processing", "dsp", "matlab", "fft", "filters", "wireless", "5g", "lte", "modulation", "communication systems", "rf", "antenna", "spectrum"],
    vlsi: ["verilog", "vhdl", "rtl", "systemverilog", "fpga", "asic", "vivado", "quartus", "cadence", "virtuoso", "synopsys", "layout", "cmos", "mosfet", "digital design", "timing analysis"],
    embedded: ["embedded c", "microcontroller", "arduino", "stm32", "rtos", "arm", "cortex", "uart", "i2c", "spi", "firmware", "iot", "raspberry pi", "sensors", "actuators"],
    software: ["python", "c++", "data structures", "algorithms", "oops", "java", "sql", "machine learning", "ai", "tensorflow", "pytorch", "web development", "react", "node"]
};

// Domain Classification for Digital vs Analog
const ANALOG_KEYWORDS = ["analog", "rf", "antenna", "circuit design", "layout", "cmos", "opamp", "amplifiers", "pcb", "ltspice", "noise", "power electronics"];
const DIGITAL_KEYWORDS = ["digital", "fpga", "verilog", "vhdl", "rtl", "processor", "architecture", "logic", "microcontroller", "embedded", "timing", "memory"];

export function calculateATSScore(text: string): ATSResult {
    let score = 0;
    const lowerText = text.toLowerCase();
    const feedback: string[] = [];
    const foundKeywords: string[] = [];

    // --- 1. General ATS Logic (Existing) ---
    let sectionCount = 0;
    const missingSections: string[] = [];
    const sectionsToCheck = [
        { name: "Experience", keywords: ["experience", "work history", "employment", "internship"] },
        { name: "Education", keywords: ["education", "academic", "degree", "b.tech", "b.e"] },
        { name: "Skills", keywords: ["skills", "technical skills", "competencies"] },
        { name: "Projects", keywords: ["projects", "academic projects", "capstone"] }
    ];

    sectionsToCheck.forEach(section => {
        if (section.keywords.some(k => lowerText.includes(k))) sectionCount++;
        else missingSections.push(section.name);
    });
    const sectionScore = (sectionCount / sectionsToCheck.length) * 40;
    score += sectionScore;

    // Keyword check (simplified for general score)
    const allECEKeywords = [...ECE_DOMAINS.vlsi, ...ECE_DOMAINS.embedded, ...ECE_DOMAINS.communication, ...ECE_DOMAINS.software];
    let keywordCount = 0;
    allECEKeywords.forEach(k => {
        if (lowerText.includes(k)) {
            keywordCount++;
            foundKeywords.push(k);
        }
    });
    const keywordScore = Math.min(keywordCount, 20) * 1.5; // Max 30
    score += keywordScore;

    // Formatting
    let formattingScore = 0;
    const wordCount = text.split(/\s+/).length;
    if (wordCount > 150 && wordCount < 1500) formattingScore += 15;
    if (text.includes("•") || text.includes("- ") || text.includes("* ")) formattingScore += 15;
    score += formattingScore;

    // --- 2. ECE Domain Scores (Radar Chart) ---
    const eceScores = {
        communication: calculateDomainScore(lowerText, ECE_DOMAINS.communication),
        vlsi: calculateDomainScore(lowerText, ECE_DOMAINS.vlsi),
        embedded: calculateDomainScore(lowerText, ECE_DOMAINS.embedded),
        software: calculateDomainScore(lowerText, ECE_DOMAINS.software)
    };

    // --- 3. Role Prediction ---
    const { primaryRole, secondaryRoles, allRoles } = predictRole(eceScores, lowerText);

    // --- 4. Digital vs Analog Analysis ---
    const analogScore = calculateDomainScore(lowerText, ANALOG_KEYWORDS);
    const digitalScore = calculateDomainScore(lowerText, DIGITAL_KEYWORDS);
    const totalDomain = analogScore + digitalScore || 1;
    const analogPercent = Math.round((analogScore / totalDomain) * 100);
    const digitalPercent = Math.round((digitalScore / totalDomain) * 100);

    let domainExplanation = "Balanced profile.";
    if (digitalPercent > 70) domainExplanation = "Strong Digital/Logic Design focus.";
    else if (analogPercent > 70) domainExplanation = "Strong Analog/Hardware Design focus.";

    // --- 5. Contact Validation ---
    const contactValidation = {
        email: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/.test(text),
        phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text) || /\d{10}/.test(text),
        linkedin: /linkedin\.com\/in\/[\w-]+/.test(lowerText),
        github: /github\.com\/[\w-]+/.test(lowerText),
        hdlbits: lowerText.includes("hdlbits"),
        leetcode: lowerText.includes("leetcode")
    };

    // Adjust final feedback
    if (missingSections.length > 0) feedback.push(`Missing sections: ${missingSections.join(", ")}`);
    if (!contactValidation.linkedin) feedback.push("Add your LinkedIn profile.");
    if (!contactValidation.github && (eceScores.software > 30 || eceScores.embedded > 30)) feedback.push("GitHub link recommended for Software/Embedded roles.");

    return {
        score: Math.min(Math.round(score), 100),
        details: { sectionScore, formattingScore, keywordScore, lengthScore: 0 },
        missingSections,
        foundKeywords: [...new Set(foundKeywords)], // dedup
        feedback,
        eceScores,
        rolePrediction: { primaryRole, secondaryRoles, allRoles },
        domainAnalysis: { digital: digitalPercent, analog: analogPercent, explanation: domainExplanation },
        contactValidation
    };
}

function calculateDomainScore(text: string, keywords: string[]): number {
    let count = 0;
    keywords.forEach(k => { if (text.includes(k)) count++; });
    // Normalize: 10 keywords = 100%
    return Math.min(Math.round((count / 8) * 100), 100);
}

// Skill Display Mapping (Capitalization)
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
    return SKILL_DISPLAY_MAP[skill] || skill.charAt(0).toUpperCase() + skill.slice(1);
}

function predictRole(scores: any, text: string) {
    const roles = [
        { name: "Physical Design / VLSI Engineer", score: scores.vlsi * 1.2 + scores.digital * 0.5, required: ECE_DOMAINS.vlsi },
        { name: "FPGA Design Engineer", score: scores.vlsi * 1.1 + scores.embedded * 0.4, required: [...ECE_DOMAINS.vlsi, "fpga", "timing analysis"] },
        { name: "Embedded Firmware Engineer", score: scores.embedded * 1.2 + scores.software * 0.3, required: ECE_DOMAINS.embedded },
        { name: "IoT Solutions Architect", score: scores.embedded * 0.8 + scores.communication * 0.6 + scores.software * 0.4, required: ["iot", "sensors", "wireless", "cloud"] },
        { name: "Communication / RF Engineer", score: scores.communication * 1.2, required: ECE_DOMAINS.communication },
        { name: "Signal Processing Engineer", score: scores.communication * 1.0 + scores.software * 0.5, required: ["dsp", "matlab", "python", "fft"] },
        { name: "Hardware Design Engineer", score: scores.analog * 0.8 + scores.embedded * 0.5 + scores.vlsi * 0.5, required: ["pcb", "schema", "soldering", "testing"] },
        { name: "Software-Oriented ECE", score: scores.software, required: ECE_DOMAINS.software }
    ];

    // Normalize scores manually inside role defs effectively, or just sort raw
    // Note: scores.digital/analog passed in 'scores' object? 
    // Wait, 'scores' arg currently only has {communication, vlsi, embedded, software}. 
    // We need to assume the caller might strictly pass that.
    // Let's stick to the 4 main domains for score calculation to avoid breaking changes without refactoring types heavily.
    // I will simplify the score logic to use the available 4 keys.

    const advancedRoles = [
        { name: "Physical Design / VLSI Engineer", score: scores.vlsi, required: ECE_DOMAINS.vlsi },
        { name: "FPGA Design Engineer", score: (scores.vlsi + scores.embedded) / 2, required: ["fpga", "verilog", "vhdl", "timing analysis"] },
        { name: "Embedded Firmware Engineer", score: scores.embedded, required: ECE_DOMAINS.embedded },
        { name: "IoT Engineer", score: (scores.embedded + scores.communication) / 2, required: ["iot", "sensors", "wireless", "stm32"] },
        { name: "Communication / RF Engineer", score: scores.communication, required: ECE_DOMAINS.communication },
        { name: "DSP Engineer", score: (scores.communication + scores.software) / 2, required: ["dsp", "matlab", "python", "fft"] },
        { name: "Software-Oriented ECE", score: scores.software, required: ECE_DOMAINS.software }
    ];

    // Sort by score descending
    advancedRoles.sort((a, b) => b.score - a.score);

    const primaryRole = advancedRoles[0].name;
    // Take top 3 alternatives
    const secondaryRoles = advancedRoles.slice(1, 4).map(r => r.name);

    // Calculate missing skills for ALL roles with Formatting
    const allRoles = advancedRoles.map(role => ({
        name: role.name,
        missingSkills: role.required
            .filter(k => !text.includes(k)) // check against raw text (lowercase)
            .slice(0, 6) // Top 6 missing
            .map(s => formatSkill(s)) // Format for display
    }));

    return { primaryRole, secondaryRoles, allRoles };
}
