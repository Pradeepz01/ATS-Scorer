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
            nextStepEnhancements: string[]; // NEW: Actionable steps
            salary: RoleData['salary'];
            companies: string[];
            description: string;
        }[];
        salaryPrediction: {
            min: number;
            max: number;
        };
        confidenceScore: number;
        eliteScore?: number;
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
        tier1: ["verilog", "vhdl", "systemverilog", "asic", "fpga", "computer architecture", "rtl design", "microarchitecture"],
        tier2: ["vivado", "quartus", "sta", "dft", "logic synthesis", "modelsim", "physical design", "verification", "uvm", "soc", "risc-v", "cadence genus", "clock domain crossing", "cdc", "static timing analysis", "gate level simulation", "rtl", "rtl verification", "cpu design"],
        tier3: ["digital design", "logic design", "fsm", "testbench", "c-model", "data memory", "instruction memory", "fifo", "tapeout", "tinytapeout", "silicon tapeout", "registers", "alu", "control logic"]
    },
    analog_vlsi: {
        tier1: ["analog design", "rf design", "mixed signal", "cmos", "mosfet", "op amp", "operational amplifier", "bandgap reference", "ptat", "ctat"],
        tier2: ["virtuoso", "hspice", "ngspice", "spectre", "ltspice", "lt spice", "layout design", "adc", "dac", "pll", "lna", "mixer", "vco", "rfic", "pmu", "biasing", "oscillators", "cadence virtuoso"],
        tier3: ["matching networks", "smith chart", "vna", "spectrum analyzer", "s-parameters", "noise figure", "linearity", "antenna design", "scl 180nm", "transient analysis", "dc sweep", "temperature sweep", "ic design"]
    },
    embedded: {
        tier1: ["embedded c", "microcontroller", "rtos", "arm", "cortex", "bare metal"],
        tier2: ["stm32", "arduino", "esp32", "uart", "i2c", "spi", "iot", "device drivers", "interrupts", "timers", "nrf24l01", "nrf52", "nrf52840", "nrf modules", "nordic semiconductor", "nrf connect", "peripheral interfacing", "dma", "adc", "dac", "pwm", "mpu6050", "imu", "motor driver", "l298n"],
        tier3: ["raspberry pi", "mqtt", "lora", "sensors", "actuators", "gpio", "can bus", "modbus", "ble", "bluetooth low energy", "dht11", "dht22", "sim800", "gsm module", "gps module", "hc-05", "ultrasonic sensor", "nrf52832", "nrf51822"]
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

const PREMIUM_KEYWORDS = [
    "risc-v", "verilog", "vhdl", "systemverilog", "patent", "stm32", "rtos", "uav", "pcb design",
    "gnu radio", "firmware", "rtl", "asic", "fpga", "physical design", "sta", "dft", "soc",
    "analog design", "rf design", "antenna", "signal processing", "digital electronics",
    "synopsys", "cadence", "mentor", "siemens",
    "xilinx", "intel", "nvidia", "qualcomm", "ti", "analog devices",
    "nxp", "stmicroelectronics", "amd", "apple", "google", "meta"
];


// --- Helper: Detect Elite Industry Signals ---
function detectEliteSignals(text: string): { score: number, signals: string[] } {
    const eliteKeywords = [
        // Holy Grail (Huge Multipliers)
        { word: "tapeout", weight: 8, label: "Chip Tapeout" },
        { word: "tape-out", weight: 8, label: "Chip Tapeout" },
        { word: "mpw", weight: 6, label: "MPW Run" },
        { word: "shakti", weight: 5, label: "Shakti Processor" },
        { word: "risc-v", weight: 5, label: "RISC-V Architecture" },
        { word: "sky130", weight: 4, label: "Sky130 PDK" },

        // Verification & Methodology (High Value)
        { word: "uvm", weight: 4, label: "UVM Verification" },
        { word: "ovm", weight: 3, label: "OVM Verification" },
        { word: "formal verification", weight: 4, label: "Formal Verification" },
        { word: "assertions", weight: 2, label: "SVA/Assertions" },

        // Industrial Tools (Highly weighted for Professional Seniority)
        { word: "genus", weight: 5, label: "Cadence Genus" },
        { word: "innovus", weight: 5, label: "Cadence Innovus" },
        { word: "virtuoso", weight: 5, label: "Cadence Virtuoso" },
        { word: "design compiler", weight: 4, label: "Synopsys DC" },
        { word: "calibre", weight: 4, label: "Mentor Calibre" },

        // Flow Statements (Vertical Jump for Industry Practitioners)
        { word: "rtl to gds", weight: 6, label: "Full ASIC Flow" },
        { word: "rtl-to-gds", weight: 6, label: "Full ASIC Flow" },
        { word: "asic design flow", weight: 5, label: "ASIC Flow" },
        { word: "physical design flow", weight: 5, label: "PD Flow" },
        { word: "synthesis flow", weight: 4, label: "Synthesis Flow" },
        { word: "sta flow", weight: 4, label: "STA/Timing Flow" },
        { word: "post-layout", weight: 3, label: "Post-Layout Verification" },
        { word: "gdsii", weight: 4, label: "GDSII Generation" },
        { word: "pd flow", weight: 5, label: "PD Flow" },
        { word: "netlist to gds", weight: 6, label: "Full ASIC Flow" }
    ];

    let score = 0;
    const foundSignals: string[] = [];
    const lowerText = text.toLowerCase();

    // Track unique elite tools found to reward "Full Flow" knowledge
    const eliteToolsFound: string[] = [];
    const industryTools = [
        "genus", "innovus", "virtuoso", "design compiler", "icc2", "prime time", "primetime",
        "calibre", "uvm", "shakti", "risc-v", "rtl to gds", "rtl-to-gds", "asic design flow",
        "physical design flow", "pd flow", "netlist to gds", "gdsii"
    ];

    eliteKeywords.forEach(k => {
        if (hasMatch(lowerText, k.word) && !foundSignals.includes(k.label)) {
            score += k.weight;
            foundSignals.push(k.label);
            if (industryTools.includes(k.word)) eliteToolsFound.push(k.word);
        }
    });

    // Flow Bonus: Professionals know the whole toolchain.
    // If 3+ unique industry tools are found, add a major score boost.
    if (eliteToolsFound.length >= 3) {
        score += 4; // Vertical jump for industrial readiness
    }

    // Reputability Boost: If experience at top-tier hardware companies is detected
    const TIER1_HARDWARE_COMPANIES = ["intel", "qualcomm", "nvidia", "arm", "broadcom", "amd", "texas instruments", "micron", "samsung semiconductor"];
    if (TIER1_HARDWARE_COMPANIES.some(c => lowerText.includes(c))) {
        score += 5; // Direct boost for industry-vetted talent
    }

    // Add TinyTapeout specific bonus (Now treated as a strong signal)
    if (lowerText.includes("tinytapeout") || lowerText.includes("tiny tapeout")) {
        // Did they ALREADY get points for "tapeout"?
        // If so, we leave it (8pts is generous but okay for a strong student).
        // If not, we ensure they get at least 5 pts.
        if (!foundSignals.includes("Chip Tapeout")) {
            score += 8; // Full Tapeout Credit (Upgraded from 5)
            foundSignals.push("TinyTapeout (MPW)");
        }
    }

    return { score, signals: foundSignals };
}

function predictRole(eceScores: ATSResult['eceScores'], text: string, projectExpText: string = "") {
    const cgpa = extractCGPA(text);

    // 1. Contextual Detection (College Tier & Project Depth)
    const TIER1_COLLEGES = [
        'ceg', 'guindy', 'college of engineering guindy', 'iit', 'nit',
        'bits pilani', 'bits hyderabad', 'iiit', 'psg tech', 'psg college of technology',
        'rvce', 'mit chennai', 'madras institute of technology', 'anna university'
    ];
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

        // 5. Flight Electronics / Drone / UAV Boost
        if (roleData.role.includes("Flight Electronics") && (hasMatch(text, "flight controller") || hasMatch(text, "uav") || hasMatch(text, "drone"))) {
            skillScore += 25; // Massive boost for specific flight domain experience
        }

        // --- ROLE READINESS GATES (Strict Execution Filters) ---
        let finalRoleName = roleData.role;
        let readinessPenalty = 1.0;

        // A. FPGA / Flight Electronics Gate
        if (roleData.role.includes("FPGA") || roleData.role.includes("Flight") || roleData.role.includes("Hardware")) {
            const fpgaReadinessKeywords = ["xdc", "sdc", "timing constraints", "floorplanning", "bitstream", "ila", "vio", "logic analyzer", "board bringup", "schematic"];
            const readinessCount = fpgaReadinessKeywords.filter(k => hasMatch(text, k)).length;

            // Allow if simple keyword count is VERY high (implying deep knowledge even if specific terms missing)
            if (readinessCount < 2 && skillScore < 70) {
                finalRoleName = roleData.role.replace("Engineer", "Trainee").replace("Specialist", "Trainee");
                if (!finalRoleName.includes("Trainee")) finalRoleName += " (Trainee)";
                readinessPenalty = 0.85; // Cap score slightly for trainee roles
            }
        }

        // B. Embedded Prioritization Check
        // If Embedded Readiness is massive, boost Embedded roles relative to partially-matched FPGA roles
        if (rDomain === "embedded") {
            const embeddedExecution = ["bare metal", "isr", "driver development", "hal", "rtos", "freertos", "pcb", "schematic", "i2c", "spi", "uart", "dma"];
            const execCount = embeddedExecution.filter(k => hasMatch(text, k)).length;
            if (execCount >= 3) {
                skillScore += 15; // Execution Bonus
            }
        }

        // C. Digital VLSI Flow Quota (RTL vs GDS)
        if (rDomain === "digital_vlsi") {
            const flowKeywords = ["synthesis", "pnr", "gds", "tapeout", "sta", "dft", "gls", "physical design", "cts"];
            const flowCount = flowKeywords.filter(k => hasMatch(text, k)).length;

            if (flowCount === 0 && !roleData.role.includes("Verification") && !roleData.role.includes("Trainee")) {
                // RTL Only profile -> Downgrade senior implementation roles
                finalRoleName = roleData.role.replace("Engineer", "Trainee");
                if (!finalRoleName.includes("Trainee")) finalRoleName += " (Trainee)";
            }
        }

        // D. Software Role Restriction
        if (roleData.role.includes("Software") && (eceScores.embedded > 40 || eceScores.digital_vlsi > 40)) {
            // If hardware dominant, strictly check for OS/System signals before recommending generic "Software Engineer"
            const sysSoftware = ["linux kernel", "device driver", "operating system", "dsa", "algorithm", "system programming", "distributed systems"];
            const hasSysSoft = sysSoftware.some(k => hasMatch(text, k));

            if (!hasSysSoft) {
                skillScore *= 0.3; // Nuke generic software connection if it's just Python scripting knowledge
            }
        }

        const totalScore = ((domainScore * 0.4) + (skillScore * 0.6)) * readinessPenalty;

        return { ...roleData, role: finalRoleName, score: totalScore, skillScore, rDomain };
    });

    type ScoredRole = (typeof scoredRoles)[0];

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

    // ----------------------------------------------------

    // --- Elite Signal Detection (Tapeout, RISC-V, Premium Tools) ---
    const eliteSignals = detectEliteSignals(text + " " + projectExpText);
    const eliteScore = eliteSignals.score;

    // --- Role Slotting with Elite Awareness ---
    // If a candidate has "Tapeout" or high elite score, prioritize VLSI roles
    if (eliteScore > 8 && rankedDomains[0].name !== "digital_vlsi" && rankedDomains[0].name !== "analog_vlsi") {
        // Force consider VLSI if signals are strong (e.g., embedded engineer who did a tapeout)
        const vlsiRole = findBestRole("digital_vlsi", selectedRoles);
        if (vlsiRole) selectedRoles.unshift(vlsiRole);
    }
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


    // --- 3. Salary Prediction (Linear Model with Primary Role Base) ---
    // We use the Primary Role to set the base sector salary to prevent averaging dilution.
    const primaryRoleData = selectedRoles[0] as ScoredRole;
    const rDomain = primaryRoleData ? primaryRoleData.rDomain : "core";

    // Base Slabs (Strict Calibration for 2026 Freshers)
    let baseMin = 3.5;
    let baseMax = 6.0;

    if (isTier1) {
        // STRONG TIER BASE (Tier 1 Default) - Equalized for Hardware/Software
        // USER REQUEST: Decrease lower LPA by 1 Lakh
        if (rDomain === "digital_vlsi") { baseMin = 5.0; baseMax = 9.5; }
        else if (rDomain === "analog_vlsi") { baseMin = 5.0; baseMax = 9.5; }
        else if (rDomain === "embedded") { baseMin = 4.5; baseMax = 9.0; }
        else if (rDomain === "software") { baseMin = 5.0; baseMax = 9.5; }
        else { baseMin = 4.5; baseMax = 8.5; }
    } else {
        // STANDARD TIER BASE (Tier 2/3 Default)
        if (rDomain === "digital_vlsi") { baseMin = 3.5; baseMax = 6.5; }
        else if (rDomain === "analog_vlsi") { baseMin = 3.0; baseMax = 6.0; }
        else if (rDomain === "embedded") { baseMin = 3.0; baseMax = 6.0; }
        else if (rDomain === "software") { baseMin = 3.5; baseMax = 7.0; }
    }

    // Step B1: Elite Boosts (The "Worth" Factor)
    if (eliteScore > 5) {
        // Segment 1: Points 5 to 13 (Flat for Ishva - Target 7.5-12 LPA)
        const segment1 = Math.min(eliteScore, 13) - 5;
        baseMin += segment1 * 0.15;  // Reduced from 0.25
        baseMax += segment1 * 0.25;  // Reduced from 0.45

        // Segment 2: Points > 13 (Vertical lift for Divyadarshan - Target 10-16 LPA)
        if (eliteScore > 13) {
            let segment2 = eliteScore - 13;
            // Damping for ultra-high scores (keep it sane above 20LPA)
            if (segment2 > 10) segment2 = 10 + (segment2 - 10) * 0.3;

            baseMin += segment2 * 0.4;  // Sharp reduction from 1.5 to hit 10-16 range
            baseMax += segment2 * 0.7;  // Sharp reduction from 2.2
        }
    }

    // Step B2: Patent Bonus (+1.0 LPA Max)
    if (hasMatch(text, "patent") && !hasMatch(text, "design patent")) {
        baseMax += 1.0;
    }

    // Step B3: Internship Bonus (+1.0 LPA base +1 for Elite)
    let internshipBonus = 0;
    if (hasMatch(text + " " + (projectExpText || ""), "intern")) {
        internshipBonus = 1.0;
        const eliteTools = ["cadence", "synopsys", "mentor", "siemens", "risc-v", "shakti", "tapeout"];
        if (eliteTools.some(t => hasMatch(text, t))) {
            internshipBonus += 1.0;
        }
    }
    baseMin += internshipBonus;
    baseMax += internshipBonus;

    // Step C: Depth Boost
    const depthBoost = 1.0 + (depthPoints * 0.003);
    baseMax *= depthBoost;
    baseMin *= (1.0 + (depthPoints * 0.002));

    // Step D: Confidence Penalty (Softened for specialists)
    const confidence = primaryRoleData?.skillScore / 100 || 0.5;
    if (confidence < 0.45) {
        const penaltyFactor = eliteScore > 5 ? 0.7 : 0.4;
        baseMax = baseMin + (baseMax - baseMin) * penaltyFactor;
    }

    let predMin = baseMin;
    let predMax = baseMax;

    // HARD SCORE-BASED CAPS (Guarantee exact ranges per tier)
    if (eliteScore >= 14) {
        // Unicorn Tier (Divyadarshan): Force into 10.0 - 16.5 LPA range
        predMin = Math.max(predMin, 10.0); // Adjusted floor for 10-16 target
        predMax = Math.min(predMax, 17.0); // Prevent overshooting 20LPA
    } else if (eliteScore >= 9 && eliteScore < 14) {
        // Elite Tier (Ishva): Force into 6.5 - 12.0 LPA range (Decreased minimum)
        predMin = Math.max(predMin, 6.5);
        predMax = Math.min(predMax, 12.0); // HARD CAP tightened for Ishva
    }

    // CGPA Persistence (Extra lift for 9+)
    if (cgpa >= 9.0) {
        predMin += 0.3;
        predMax += 0.5;
    }

    // Final Normalization
    predMin = Math.max(3.0, predMin);
    predMax = Math.max(predMin + 1.2, predMax);

    // Absolute Ceiling (Strict caps based on elite score tiers)
    if (eliteScore >= 14) {
        const absoluteCeiling = isTier1 ? 24.0 : 18.0;
        predMax = Math.min(absoluteCeiling, predMax);
    } else if (eliteScore >= 9) {
        predMax = Math.min(predMax, 12.5); // Enforce hard cap for mid-tier elite
    } else {
        predMax = Math.min(predMax, 10.0); // Standard tier cap
    }

    // Ensure reasonable spread
    if (predMax - predMin < 3.0) predMax = predMin + 3.5;


    // 4. Format for UI
    const allRoles = selectedRoles.map(r => ({
        name: r.role,
        score: Math.round(r.score),
        missingSkills: r.skills
            .filter(k => !hasMatch(text, k))
            .slice(0, 5)
            .map(s => formatSkill(s)),
        nextStepEnhancements: generateSuggestions(r.role, text, eliteScore), // NEW: Map specific suggestions to role
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
        maxDomainScore: Math.max(...Object.values(eceScores)),
        eliteScore // Return this so calculateATSScore can log it
    };
}

// --- Role Improvement Suggestions Map ---
interface SuggestionRule {
    action: string;
    suppressIf: string[];
}

const SUGGESTION_DATABASE: Record<string, SuggestionRule[]> = {
    "fpga": [
        {
            action: "Implement a simple RTL control or datapath module and simulate it thoroughly.",
            suppressIf: ["testbench", "simulation", "waveform", "verification", "questasim", "modelsim", "gtkwave", "vcs", "verilator", "simulated", "verified", "tb_", "rtl design"]
        },
        {
            action: "Run synthesis on a free toolchain (Vivado/Quartus) and review timing reports.",
            suppressIf: ["synthesis", "timing analysis", "sta", "timing report", "constraints", "xdc", "sdc", "timing closure", "slack", "critical path", "max frequency", "fmax", "vivado", "quartus"]
        },
        {
            action: "Demonstrate interaction between RTL and embedded firmware in a small system.",
            suppressIf: ["zynq", "microblaze", "nios", "axi", "embedded", "firmware", "driver", "uart", "spi", "i2c", "wishbone", "avalon", "soc", "ps", "pl", "petalinux"]
        },
        {
            action: "Document design assumptions and verification approach clearly in your project README.",
            suppressIf: ["documentation", "readme", "report", "wiki", "paper", "presentation", "documented", "user guide", "github"]
        }
    ],
    "digital": [
        {
            action: "Perform a synthesis run using a standard cell library (even generic 45nm).",
            suppressIf: ["synthesis", "design compiler", "genus", "yosys", "liberty", ".lib", "dc_shell", "rc_shell", "gate level", "netlist", "digital compiler"]
        },
        {
            action: "Run Static Timing Analysis (STA) and fix a setup or hold violation.",
            suppressIf: ["sta", "timing analysis", "primetime", "tempus", "setup", "hold", "slack", "violation", "timing clean", "skew", "clock tree", "pt_shell"]
        },
        {
            action: "Implement a Finite State Machine (FSM) and verify its state transitions.",
            suppressIf: ["fsm", "finite state", "state machine", "mealy", "moore", "state diagram", "transition", "state table"]
        }
    ],
    "embedded": [
        {
            action: "Write a 'Bare Metal' driver for a peripheral (GPIO/UART) without using Arduino libraries.",
            suppressIf: ["bare metal", "driver", "register", "cmsis", "hal", "low-level", "memory map", "volatile", "datasheet", "peripherals", "register map"]
        },
        {
            action: "Implement an interrupt-based routine involved in a real-time task.",
            suppressIf: ["interrupt", "isr", "irq", "latency", "real-time", "rtos", "context switch", "preemptive", "watchdog", "priority"]
        },
        {
            action: "Interface two devices using I2C or SPI and capture the signals on a Logic Analyzer.",
            suppressIf: ["i2c", "spi", "logic analyzer", "saleae", "oscilloscope", "signal", "decoder", "protocol", "waveform", "bus"]
        }
    ],
    "verification": [
        {
            action: "Write a SystemVerilog Assertion (SVA) to verify a protocol property.",
            suppressIf: ["assertion", "sva", "property", "concurrent", "sequence", "assert", "cover property", "formal verification"]
        },
        {
            action: "Build a UVM Monitor or Driver for a simple protocol.",
            suppressIf: ["uvm", "monitor", "driver", "agent", "scoreboard", "tlm", "sequence_item", "environment", "testbench", "vip"]
        },
        {
            action: "Generate and analyze Code Coverage or Functional Coverage reports.",
            suppressIf: ["coverage", "bins", "coverpoint", "cross coverage", "functional coverage", "code coverage", "coverage report"]
        }
    ],
    "software": [
        {
            action: "Implement a multi-threaded application to handle concurrent tasks.",
            suppressIf: ["thread", "concurrency", "mutex", "semaphore", "parallel", "lock", "async", "await", "multithreading", "pthread"]
        },
        {
            action: "Write a script to interface with hardware via Serial/UART.",
            suppressIf: ["serial", "uart", "pyserial", "interface", "hardware", "com port", "baud rate", "ioctl"]
        },
        {
            action: "Optimize a function's performance and measure the execution time difference.",
            suppressIf: ["optimization", "performance", "latency", "profile", "benchmark", "complexity", "big o", "runtime", "speedup"]
        }
    ],
    "trainee": [
        {
            action: "Complete an end-to-end project: Specification -> Design -> Verification.",
            suppressIf: ["end-to-end", "full flow", "lifecycle", "complete", "architecture", "design flow", "from scratch"]
        },
        {
            action: "Focus on one primary domain (Embedded or VLSI) to show technical depth.",
            suppressIf: ["specialization", "focus", "domain", "major", "expertise", "research"]
        }
    ],
    "analog": [
        {
            action: "Design and simulate a basic Op-Amp or OTA in SPICE/Cadence.",
            suppressIf: ["op-amp", "operational amplifier", "ota", "differential pair", "common source", "cascode", "current mirror", "virtuoso", "spectre", "hspice"]
        },
        {
            action: "Perform Layout, DRC, LVS checks for a small analog block.",
            suppressIf: ["layout", "drc", "lvs", "physical design", "calibre", "verification", "floorplan", "assura"]
        },
        {
            action: "Analyze stability (Gain/Phase Margin) of a feedback system.",
            suppressIf: ["stability", "phase margin", "gain margin", "feedback", "bode plot", "frequency response", "compensation"]
        }
    ],
    "communication": [
        {
            action: "Simulate a modulation scheme (BPSK/QPSK/OFDM) in MATLAB/Python.",
            suppressIf: ["bpsk", "qpsk", "ofdm", "modulation", "constellation", "matlab", "simulink", "gnuradio"]
        },
        {
            action: "Design a simple RF component (Filter/Antenna) and simulate S-Parameters.",
            suppressIf: ["filter", "antenna", "s-parameter", "scattering parameters", "hfss", "cst", "ads", "microwave", "matching"]
        },
        {
            action: "Calculate Link Budget or SNR/BER for a communication channel.",
            suppressIf: ["link budget", "snr", "ber", "noise figure", "path loss", "channel model", "fading"]
        }
    ]
};

function generateSuggestions(roleName: string, text: string, eliteScore: number = 0): string[] {
    // Elite Suppression Logic: Candidates with score >= 14 are already optimized
    if (eliteScore >= 14) return [];

    const roleLower = roleName.toLowerCase();
    const lowerText = text.toLowerCase();
    // 1. Determine Priority Domains based on Role
    let domains: string[] = ["trainee"]; // Default

    const ROLE_DOMAIN_PRIORITY: { match: (s: string) => boolean, domains: string[] }[] = [
        { match: s => s.includes("fpga") || s.includes("flight"), domains: ["fpga", "embedded"] },
        { match: s => s.includes("verification"), domains: ["verification", "digital"] },
        { match: s => s.includes("analog") || s.includes("mixed") || s.includes("layout") || s.includes("circuit"), domains: ["analog"] },
        { match: s => s.includes("rf") || s.includes("communication") || s.includes("wireless") || s.includes("signal") || s.includes("dsp"), domains: ["communication"] },
        { match: s => s.includes("vlsi") || s.includes("asic") || s.includes("rtl") || s.includes("digital"), domains: ["digital", "verification"] },
        { match: s => s.includes("embedded") || s.includes("firmware") || s.includes("iot"), domains: ["embedded"] },
        { match: s => s.includes("software") || s.includes("developer") || s.includes("programmer"), domains: ["software"] }
    ];

    const matchedRule = ROLE_DOMAIN_PRIORITY.find(rule => rule.match(roleLower));
    if (matchedRule) {
        domains = matchedRule.domains;
    }

    // 2. Collect Suggestions (Respecting Priority & Limit)
    const actions: string[] = [];

    // Identify all candidate rules from valid domains
    let candidateRules: SuggestionRule[] = [];
    for (const domainKey of domains) {
        if (SUGGESTION_DATABASE[domainKey]) {
            candidateRules = [...candidateRules, ...SUGGESTION_DATABASE[domainKey]];
        }
    }

    // 3. Filter by Suppression & Limits
    for (const rule of candidateRules) {
        // Strict Suppression
        const isPresent = rule.suppressIf.some(kw => hasMatch(lowerText, kw));
        if (!isPresent) {
            // Avoid duplicates if multiple domains suggest same action (unlikely but safe)
            if (!actions.includes(rule.action)) {
                actions.push(rule.action);
            }
        }
        if (actions.length >= 3) break; // Strict Max 3
    }

    return actions;
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
        experience: /experience|work history|work experience|employment|career|internship|internships|training|industrial exposure/i.test(lowerText),
        education: /education|academic|qualification|b\.?e|b\.?tech|bachelor|university|college|institute|degree/i.test(lowerText),
        skills: /skills|technologies|proficiencies|technical stack|competencies/i.test(lowerText),
        projects: /projects?|capstone|academic projects|project experience/i.test(lowerText),
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

    // Keyword Stuffing & Anti-Inflation Check
    const keywordCounts: Record<string, number> = {};
    const words = lowerText.split(/[\s,();/.:]+/).filter(w => w.length > 3);
    words.forEach(w => {
        keywordCounts[w] = (keywordCounts[w] || 0) + 1;
    });

    let stuffingPenalty = 0;
    Object.entries(keywordCounts).forEach(([k, v]) => {
        // Allow higher frequency for common structural words, but penalize technical repetition (>10)
        const commonStructural = ["project", "university", "college", "engineering", "design", "development", "implemented", "system", "using"];
        if (v > 10 && !commonStructural.includes(k)) {
            stuffingPenalty += Math.min((v - 10) * 2, 20);
        }
    });

    if (stuffingPenalty > 0) {
        formattingScore -= stuffingPenalty;
        feedback.push("Keyword repetition detected. Aim for detailed bullet points rather than repetitive technical lists.");
    } else {
        formattingScore += 10;
    }

    // Length check
    const wordCount = words.length;
    let lengthScore = 100;
    if (wordCount < 180) { lengthScore = 60; formattingScore -= 10; feedback.push("Resume depth is thin. Add more technical detail to projects."); }
    else if (wordCount > 1200) { lengthScore = 80; formattingScore -= 10; feedback.push("Resume is overly long. Recruiter-ready resumes are usually 1-2 pages."); }
    else { formattingScore += 5; }

    // Cap formatting
    formattingScore = Math.max(0, Math.min(formattingScore, 100));

    // --- 2. Contextual Weighting (Anti-Inflation) ---
    // Extract text specifically from Projects and Experience
    const projectExpMatch = lowerText.match(/(?:experience|projects|work history|academic projects|internships|professional background)[\s\S]*?(?:skills|certifications|summary|education|hobbies|personal info|$)/i);
    const projectExpText = projectExpMatch ? projectExpMatch[0] : "";

    const eceScores = {
        communication: calculateDomainScore(lowerText, ECE_DOMAINS_TIERED.communication, projectExpText),
        digital_vlsi: calculateDomainScore(lowerText, ECE_DOMAINS_TIERED.digital_vlsi, projectExpText, true),
        analog_vlsi: calculateDomainScore(lowerText, ECE_DOMAINS_TIERED.analog_vlsi, projectExpText),
        embedded: calculateDomainScore(lowerText, ECE_DOMAINS_TIERED.embedded, projectExpText),
        software: calculateDomainScore(lowerText, ECE_DOMAINS_TIERED.software, projectExpText)
    };

    // --- Digital VLSI Flow Constraints (User Request: Anti-Inflation) ---
    // Enforce that high scores (>80) require representation of implementation flows
    const asicFlowKeywords = ["asic flow", "synthesis", "dft", "sta", "timing analysis", "gate level simulation", "yosys", "cadence genus", "design compiler"];
    const pdFlowKeywords = ["physical design", "floorplan", "placement", "routing", "cts", "pdn", "drc", "lvs", "innovus", "icc2", "encounter"];

    const hasAsicFlow = asicFlowKeywords.some(k => hasMatch(lowerText, k));
    const hasPdFlow = pdFlowKeywords.some(k => hasMatch(lowerText, k));
    const hasTapeout = hasMatch(lowerText, "tapeout") || hasMatch(lowerText, "tinytapeout");

    if (eceScores.digital_vlsi > 80 && !hasAsicFlow && !hasPdFlow && !hasTapeout) {
        eceScores.digital_vlsi = 80;
        feedback.push("Digital VLSI score capped at 80. To reach 'Expert' levels, include specific implementation flows (ASIC or Physical Design) and mention tools used (e.g., Synthesis, STA).");
    }

    // Calculate keyword score (Expert Scalability: 1.6x multiplier for better peak recognition)
    const avgDomainScore = (eceScores.communication + eceScores.digital_vlsi + eceScores.analog_vlsi + eceScores.embedded + eceScores.software) / 5;
    const keywordScore = Math.min(avgDomainScore * 1.6, 100);

    // Total Score
    let score = (sectionScore * 0.4) + (formattingScore * 0.3) + (keywordScore * 0.3);

    // Hackathon Bonus
    const hasHackathon = /hackathon|coding contest|ideathon/i.test(lowerText);
    if (hasHackathon) {
        score += 1;
        feedback.push("Hackathon participation detected! (Bonus)");
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
    } else if (contactValidation.leetcode) {
        // Fallback: Profile Exists but API failed or 0 solved
        // Give small "Presence Bonus"
        extraSoftwarePoints = 5;
        feedback.push("LeetCode profile detected (+5 Skill points). verification skipped due to API limits.");
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
    const { primaryRole, secondaryRoles, allRoles, salaryPrediction, topScore, secondScore, maxDomainScore, eliteScore } = predictRole(eceScores, lowerText, projectExpText);

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

    // Low score generic feedback (Only if really low)
    if (score < 40) feedback.push("Overall score needs improvement. Focus on adding keywords and expanding project details.");

    if (maxDomainScore <= 15) {
        feedback.push("Technical domain overlap is very low. Consider adding more core ECE keywords (VLSI, Embedded, or Software) to improve role prediction accuracy.");
    }

    // (REMOVED) Global Role Suggestions push - now handled per-role in RolePredictor UI

    return {
        score: Math.min(Math.round(finalOverallScore), 100),
        details: { sectionScore, formattingScore, keywordScore: finalKeywordScore, lengthScore },
        missingSections,
        foundKeywords: [...new Set(foundKeywords)],
        feedback: [...new Set(feedback)], // dedup
        eceScores,
        rolePrediction: { primaryRole, secondaryRoles, allRoles, salaryPrediction, confidenceScore, eliteScore },
        educationDetails,
        contactValidation,
        platformStats
    };
}

// Helper for domain scores
// Helper for domain scores with weighted tiers and high-sensitivity context scaling
function calculateDomainScore(text: string, tieredKeywords: { tier1: string[], tier2: string[], tier3: string[] }, projectExpText: string = "", isDigitalVLSI: boolean = false): number {
    let rawScore = 0;
    const lowerText = text.toLowerCase();
    const lowerProjExp = projectExpText.toLowerCase();

    // 1. Keyword-based Base Score
    // Restraint: Digital VLSI uses reduced weights (7, 4, 2) to prevent easy inflation
    const t1Weight = isDigitalVLSI ? 7 : 10;
    const t2Weight = isDigitalVLSI ? 4 : 5;
    const t3Weight = 2; // Tier 3 stays same (exposure)

    const processTier = (keywords: string[], weight: number) => {
        keywords.forEach(k => {
            // Anti-Double-Count: Synthesis tools are handled in Flow Quota for Digital VLSI
            const isSynthesisTool = ["yosys", "cadence genus", "design compiler", "vivado", "quartus"].includes(k.toLowerCase());
            if (isDigitalVLSI && isSynthesisTool) return;

            if (hasMatch(lowerText, k)) {
                if (lowerProjExp && hasMatch(lowerProjExp, k)) {
                    rawScore += (weight * 1.5);
                } else {
                    rawScore += weight;
                }
            }
        });
    };

    processTier(tieredKeywords.tier1, t1Weight);
    processTier(tieredKeywords.tier2, t2Weight);
    processTier(tieredKeywords.tier3, t3Weight);

    // 2. Implementation Flow Quota (Digital VLSI Only - Mandatory for Scores > 80)
    if (isDigitalVLSI) {
        let flowScore = 0;
        const asicFlowKeywords = ["asic flow", "synthesis", "yosys", "sta", "dft", "timing analysis", "gate level simulation", "cadence genus", "vivado", "quartus"];
        const pdFlowKeywords = ["physical design", "floorplan", "placement", "routing", "cts", "pdn", "drc", "lvs", "innovus", "tapeout"];

        const allFlows = [...new Set([...asicFlowKeywords, ...pdFlowKeywords])];
        let flowMatches = 0;
        allFlows.forEach(k => {
            if (hasMatch(lowerText, k)) flowMatches++;
        });

        // Each unique flow match gives +5 points, capped at 20
        flowScore = Math.min(flowMatches * 5, 20);

        // Base is capped at 80, then flow is added
        rawScore = Math.min(80, rawScore) + flowScore;
    }

    // 3. Elite Industry Precision Boost (+15 flat points for top hardware Tier-1 companies)
    const TIER1_HARDWARE_COMPANIES = ["intel", "qualcomm", "nvidia", "arm", "broadcom", "amd", "texas instruments", "ti ", "micron", "samsung semiconductor"];
    const hasEliteInternship = TIER1_HARDWARE_COMPANIES.some(company => {
        const regex = new RegExp(`\\b${company}\\b[\\s\\S]{0,100}(?:intern|trainee|experience|engineer)`, 'i');
        return regex.test(lowerProjExp);
    });

    if (hasEliteInternship && rawScore > 10) {
        rawScore += 15;
    }

    return Math.min(100, Math.round(rawScore));
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
