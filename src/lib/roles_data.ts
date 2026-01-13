export interface RoleData {
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

export const ROLES_DATA: RoleData[] = [
    {
        "role": "Software Development Engineer / ML-AI",
        "domain": "Software",
        "skills": [
            "Python",
            "C++",
            "Deep Learning frameworks (TensorFlow",
            "PyTorch)",
            "Machine Learning algorithms",
            "Linear Algebra",
            "Calculus",
            "Data structures",
            "System design",
            "Problem-solving",
            "Git"
        ],
        "companies": [
            "Amazon",
            "Appian",
            "NVIDIA",
            "BNY Mellon",
            "Google",
            "Microsoft",
            "Meta"
        ],
        "salary": {
            "avg": "₹18-22 LPA",
            "highest": "₹29 LPA (NVIDIA Intern) / ₹25.51 LPA (Appian)",
            "lowest": "₹8.5 LPA",
            "internship": "₹110,000/month (Amazon) / ₹80,000/month (NVIDIA)"
        },
        "description": "Builds scalable ML systems and AI features by developing algorithms, training models, and deploying intelligent applications. Works with data pipelines, model optimization, and performance tuning. Heavy focus on mathematics, coding, and system-level problem solving."
    },
    {
        "role": "Embedded Systems / Firmware Engineer",
        "domain": "Core",
        "skills": [
            "C/C++",
            "RTOS (FreeRTOS",
            "VxWorks)",
            "Microcontroller programming",
            "Assembly language",
            "UART/SPI/I2C protocols",
            "Device drivers",
            "Real-time systems",
            "Debugging tools (JTAG",
            "debuggers)",
            "Hardware-software integration",
            "Problem-solving"
        ],
        "companies": [
            "Aptiv",
            "Caterpillar",
            "Western Digital",
            "Infinera",
            "Nokia",
            "Siemens",
            "NXP",
            "Samsung",
            "Maxwell Energy Systems",
            "Geotech Systems"
        ],
        "salary": {
            "avg": "₹10-12 LPA",
            "highest": "₹14.56 LPA (Caterpillar)",
            "lowest": "₹2.4 LPA (Startup entry)",
            "internship": "₹35,000/month (Aptiv, Nokia) / ₹15,000/month (Startup)"
        },
        "description": "Develops low-level firmware for microcontrollers and embedded devices in automotive, industrial, IoT applications. Works with RTOS, hardware registers, and communication protocols. Requires deep understanding of hardware-software interaction and real-time constraints."
    },
    {
        "role": "ASIC Design Engineer",
        "domain": "Core",
        "skills": [
            "Verilog",
            "VHDL",
            "SystemVerilog",
            "RTL design",
            "Synthesis (Synopsys)",
            "Cadence",
            "Static Timing Analysis (STA)",
            "EDA tools",
            "Low-power design techniques",
            "Physical design",
            "DFT (Design for Testability)",
            "Formal verification",
            "Problem-solving",
            "Digital design fundamentals"
        ],
        "companies": [
            "NVIDIA",
            "Cadence Design Systems",
            "Qualcomm",
            "Intel",
            "NXP Semiconductors",
            "Microchip",
            "Analog Devices"
        ],
        "salary": {
            "avg": "₹15-20 LPA",
            "highest": "₹29 LPA (NVIDIA, 2021-25 Intern)",
            "lowest": "₹7 LPA",
            "internship": "₹80,000/month (NVIDIA)"
        },
        "description": "Designs Application-Specific Integrated Circuits (ASICs) using HDL and EDA tools for chip-level optimization. Performs RTL design, synthesis, timing closure, and power optimization. Critical role in semiconductor design requiring strong digital electronics and CAD tool expertise."
    },
    {
        "role": "Hardware Developer / Hardware Engineer",
        "domain": "Core",
        "skills": [
            "Digital/Analog circuit design",
            "PCB design",
            "FPGA",
            "Signal integrity",
            "Power delivery",
            "High-speed circuit design",
            "Circuit simulation",
            "Oscilloscopes/Logic analyzers",
            "Schematic capture (OrCAD",
            "Altium)",
            "Hardware debugging"
        ],
        "companies": [
            "Nokia (Infinera)",
            "Qualcomm",
            "Caterpillar",
            "NXP",
            "Intel",
            "Texas Instruments",
            "Cisco",
            "ARM",
            "Enphase Energy",
            "Radical Technologies"
        ],
        "salary": {
            "avg": "₹12-14 LPA",
            "highest": "₹14 LPA (Nokia Infinera)",
            "lowest": "₹3.6 LPA (Startup entry)",
            "internship": "₹40,000/month (Nokia) / ₹10,000/month (Startup)"
        },
        "description": "Designs and validates analog/digital circuits and PCB layouts for hardware products. Works with lab equipment to debug boards and ensure signal integrity and reliability. Involves circuit simulation, hardware testing, and collaboration with firmware teams."
    },
    {
        "role": "Software Testing / QA Engineer",
        "domain": "Software",
        "skills": [
            "Test automation (Selenium",
            "Pytest)",
            "Manual testing",
            "Test case design",
            "JIRA",
            "Bug tracking",
            "Test frameworks",
            "Problem-solving",
            "Communication",
            "Basic programming (Java/Python)"
        ],
        "companies": [
            "Appian",
            "BNY Mellon",
            "ARM",
            "Nokia",
            "Infinera",
            "Qualcomm",
            "SAP LABS",
            "Accenture",
            "Radical Technologies"
        ],
        "salary": {
            "avg": "₹10-15 LPA",
            "highest": "₹19 LPA (Appian Quality Engineer)",
            "lowest": "₹3.5 LPA (Startup entry)",
            "internship": "₹40,000-75,000/month / ₹8,000-12,000/month (Startup)"
        },
        "description": "Ensures product quality through comprehensive test automation, test planning, and defect tracking. Develops test cases, executes regression testing, and validates features across platforms. Works closely with developers to maintain release stability and code quality."
    },
    {
        "role": "Electrical & Automation Engineer",
        "domain": "Core",
        "skills": [
            "PLC programming",
            "SCADA",
            "Industrial automation",
            "Control systems",
            "Power systems",
            "Electrical design",
            "Relay logic",
            "HMI/SCADA tools",
            "Problem-solving",
            "Industry standards (IEC, IEEE)"
        ],
        "companies": [
            "Schneider Electric",
            "Caterpillar",
            "Havells",
            "Siemens",
            "Mahindra & Mahindra",
            "Fuji Electric",
            "BEL",
            "Radical Technologies"
        ],
        "salary": {
            "avg": "₹10-12 LPA",
            "highest": "₹14.56 LPA (Caterpillar) / ₹12 LPA (Schneider)",
            "lowest": "₹3.2 LPA (Startup entry)",
            "internship": "₹35,000/month (Schneider, Aptiv) / ₹8,000/month (Startup)"
        },
        "description": "Designs and maintains industrial electrical systems, automation projects, and control logic in manufacturing plants. Works on PLC/SCADA systems, protection circuits, and automation architecture. Focus on safety standards, uptime, and energy efficiency."
    },
    {
        "role": "VLSI / Physical Design Engineer",
        "domain": "Core",
        "skills": [
            "Verilog/VHDL",
            "Floor planning",
            "Place and route",
            "Clock tree synthesis (CTS)",
            "DRC/LVS verification",
            "EDA tools (Cadence, Synopsys)",
            "Timing closure",
            "Power integrity",
            "Signal integrity",
            "Problem-solving",
            "Digital design"
        ],
        "companies": [
            "Qualcomm",
            "NXP",
            "Intel",
            "Infinera",
            "Nokia",
            "Cadence Design Systems",
            "Microchip",
            "Maxlinear",
            "Analog Devices"
        ],
        "salary": {
            "avg": "₹12-14 LPA",
            "highest": "₹14 LPA (Infinera) / ₹10 LPA (Microchip)",
            "lowest": "₹7 LPA",
            "internship": "₹30,000/month (Microchip)"
        },
        "description": "Converts RTL circuit descriptions into manufacturable silicon layouts using physical design tools. Performs floor planning, placement, routing, and timing analysis to optimize area and power. Critical for bringing designs from logic to actual silicon."
    },
    {
        "role": "Verification Engineer (SV/UVM)",
        "domain": "Core",
        "skills": [
            "SystemVerilog",
            "UVM",
            "Functional Verification",
            "Formal verification",
            "JTAG/Boundary scan",
            "Assertion-Based Verification (SVA)",
            "Simulation tools",
            "Problem-solving",
            "Digital design"
        ],
        "companies": [
            "Qualcomm",
            "NXP",
            "Texas Instruments",
            "Cadence Design Systems",
            "Infinera",
            "Microchip",
            "Analog Devices",
            "Intel"
        ],
        "salary": {
            "avg": "₹11-14 LPA",
            "highest": "₹14 LPA (Infinera) / ₹10 LPA (Microchip)",
            "lowest": "₹8 LPA",
            "internship": "₹30,000/month"
        },
        "description": "Develops and implements Design for Testability strategies to improve chip manufacturability and yield. Creates test patterns, scan chains, and verification methodologies to catch defects early. Essential for ensuring silicon quality before production."
    },
    {
        "role": "Manufacturing Test Engineer (MTT)",
        "domain": "Core",
        "skills": [
            "Test automation",
            "Embedded systems",
            "Oscilloscopes",
            "Multimeters",
            "Circuit debugging",
            "Automated test equipment (ATE)",
            "Real-time debugging",
            "Problem-solving",
            "Power electronics"
        ],
        "companies": [
            "Enphase Energy",
            "ARM",
            "NVIDIA",
            "Texas Instruments",
            "NXP",
            "Qualcomm",
            "Intel"
        ],
        "salary": {
            "avg": "₹7-9 LPA",
            "highest": "₹9+ LPA (Enphase Energy with bonus)",
            "lowest": "₹5 LPA",
            "internship": "₹40,000/month (ARM)"
        },
        "description": "Designs and executes manufacturing test strategies for semiconductor and electronic devices using automated test equipment. Validates boards and ASICs through lab testing, debugging, and quality verification. Bridge between design and production."
    },
    {
        "role": "Design Engineer / Electronics Design",
        "domain": "Core",
        "skills": [
            "Circuit design",
            "PCB design",
            "Hardware debugging",
            "Power delivery",
            "Signal integrity",
            "CAD tools (OrCAD, Altium)",
            "Oscilloscopes",
            "Multimeters",
            "Problem-solving",
            "Electronics fundamentals"
        ],
        "companies": [
            "Ankidyne Pvt Ltd",
            "Surinova",
            "Agnikul Cosmos",
            "Microchip",
            "Samsung R&D",
            "Maxlinear",
            "Siemens",
            "NXP",
            "Radical Technologies",
            "Startup hardware companies"
        ],
        "salary": {
            "avg": "₹6-8 LPA",
            "highest": "₹8 LPA (Agnikul Cosmos)",
            "lowest": "₹3 LPA (Startup entry)",
            "internship": "₹15,000-30,000/month / ₹5,000-8,000 (Startup)"
        },
        "description": "Designs custom analog and digital electronic circuits and PCB layouts for products and systems. Performs circuit simulation, schematic capture, and hardware validation using lab instruments. Requires electronics fundamentals and hands-on debugging skills."
    },
    {
        "role": "Flight Electronics - FPGA Engineer",
        "domain": "Core",
        "skills": [
            "FPGA (Xilinx, Altera)",
            "Verilog/VHDL",
            "Embedded systems",
            "Real-time systems",
            "Low-power design",
            "Hardware simulation",
            "Debugging",
            "Aerospace standards",
            "Problem-solving",
            "Digital design"
        ],
        "companies": [
            "Agnikul Cosmos",
            "SpaceX-like",
            "Defense contractors",
            "Aerospace companies"
        ],
        "salary": {
            "avg": "₹8-10 LPA",
            "highest": "₹8 LPA (Agnikul Cosmos)",
            "lowest": "₹8 LPA",
            "internship": "₹15,000/month"
        },
        "description": "Designs and verifies FPGA-based control systems for aerospace and space applications where reliability and real-time performance are critical. Works with safety-critical systems and must understand aerospace standards. Combines hardware design with embedded systems expertise."
    },
    {
        "role": "RF / Communication Engineer",
        "domain": "Core",
        "skills": [
            "RF theory",
            "Signal processing",
            "MATLAB",
            "Antenna design",
            "Communication protocols (5G, WiFi, LTE)",
            "Microwave design",
            "Simulation tools (ADS, HFSS)",
            "Oscilloscopes",
            "Spectrum analyzers",
            "Problem-solving"
        ],
        "companies": [
            "MBit Wireless",
            "Ericsson",
            "Qualcomm",
            "Airtel",
            "Reliance Jio",
            "Nokia",
            "Visteon",
            "Collins Aerospace",
            "Silicon Labs",
            "Startup wireless companies"
        ],
        "salary": {
            "avg": "₹10-12 LPA",
            "highest": "₹12 LPA (MBit Wireless)",
            "lowest": "₹3 LPA (Startup entry)",
            "internship": "₹20,000-30,000/month / ₹7,000-10,000 (Startup)"
        },
        "description": "Designs RF systems, antennas, and communication subsystems for wireless networks, satellites, and IoT devices. Works with RF simulation tools, performs link budget analysis, and validates performance using test equipment. Combines electronics theory with communication systems knowledge."
    },
    {
        "role": "Analog VLSI / Analog IC Design Engineer",
        "domain": "Core",
        "skills": [
            "Analog circuit design",
            "Mixed-signal design",
            "SPICE simulation",
            "CMOS Layout (DRC/LVS)",
            "Layout design",
            "OP-AMP Design",
            "Bandgap Reference",
            "Noise analysis",
            "CAD tools",
            "Problem-solving"
        ],
        "companies": [
            "Microchip",
            "Analog Devices",
            "Texas Instruments",
            "NXP",
            "Maxlinear",
            "Qualcomm",
            "Intel"
        ],
        "salary": {
            "avg": "₹9-11 LPA",
            "highest": "₹10 LPA (Microchip)",
            "lowest": "₹9 LPA",
            "internship": "₹30,000/month"
        },
        "description": "Designs analog circuits and mixed-signal blocks combining analog and digital functions for integrated circuits. Performs circuit simulation, layout design, and noise/power analysis. Requires deep understanding of analog electronics, SPICE simulation, and precision circuit design."
    },
    {
        "role": "Mixed-Signal VLSI Engineer",
        "domain": "Core",
        "skills": [
            "Analog circuit design",
            "Mixed-signal design",
            "ADC/DAC",
            "CMOS Layout (DRC/LVS)",
            "Layout design",
            "PLL",
            "Spice simulation",
            "Mixed-signal verification",
            "Problem-solving"
        ],
        "companies": [
            "Texas Instruments",
            "Analog Devices",
            "Microchip",
            "NXP",
            "Qualcomm"
        ],
        "salary": {
            "avg": "₹12-16 LPA",
            "highest": "₹22 LPA",
            "lowest": "₹8 LPA",
            "internship": "₹40,000/month"
        },
        "description": "Bridges the gap between analog and digital domains by designing and verifying mixed-signal integrated circuits. Involves ADC/DAC design, PLL frequency synthesizers, and complex layout verification."
    },
    {
        "role": "Entry-level VLSI Design Engineer",
        "domain": "Core",
        "skills": [
            "Digital design",
            "Verilog",
            "CMOS logic",
            "Flip-flops",
            "FSM",
            "Static Timing Analysis",
            "Circuit theory",
            "Logic gates",
            "Problem-solving"
        ],
        "companies": [
            "Microchip",
            "Samsung R&D",
            "HCL Tech",
            "Wipro VLSI",
            "Qualcomm",
            "Startup VLSI firms"
        ],
        "salary": {
            "avg": "₹6-9 LPA",
            "highest": "₹10 LPA",
            "lowest": "₹3.5 LPA",
            "internship": "₹20,000/month"
        },
        "description": "Entry-level position focusing on digital design fundamentals, RTL coding in Verilog, and basic physical design flows. Ideal for freshers with strong academic projects in VLSI."
    },
    {
        "role": "Software Developer / Full-Stack Engineer",
        "domain": "Software",
        "skills": [
            "Java/Python/C++",
            "Web frameworks (React, Spring)",
            "SQL/NoSQL databases",
            "API design",
            "Git",
            "System design",
            "Problem-solving",
            "Database design",
            "Testing frameworks",
            "Node.js",
            "Express",
            "MongoDB"
        ],
        "companies": [
            "Athenahealth",
            "Applied Materials",
            "Loadshare Networks",
            "Disprz",
            "Infosys",
            "HCL",
            "Wipro",
            "Mphasis",
            "TCS",
            "Cognizant",
            "Capgemini",
            "Radical Technologies",
            "Startups"
        ],
        "salary": {
            "avg": "₹6-9 LPA",
            "highest": "₹13.3 LPA (Athenahealth)",
            "lowest": "₹3 LPA (Startup entry)",
            "internship": "₹20,000-45,000/month / ₹10,000-15,000 (Startup)"
        },
        "description": "Develops full-stack applications from backend services to frontend interfaces using programming languages and web frameworks. Designs databases, APIs, and system architectures. Works on feature development, bug fixes, and performance optimization."
    },
    {
        "role": "Data Scientist / Data Analyst",
        "domain": "Software",
        "skills": [
            "Python/R",
            "SQL",
            "Machine Learning algorithms",
            "Statistics",
            "Data visualization (Tableau, Power BI)",
            "Data wrangling",
            "Business analytics",
            "Problem-solving",
            "Mathematics",
            "Communication"
        ],
        "companies": [
            "Amazon",
            "Eucloid",
            "Crayon Data",
            "LatentView Analytics",
            "Mu Sigma",
            "Tredence Analytics",
            "Quantiphi",
            "EXL Service",
            "Startups"
        ],
        "salary": {
            "avg": "₹8-10 LPA",
            "highest": "₹25.51 LPA (Appian) / ₹10 LPA (Tredence)",
            "lowest": "₹2.5 LPA (Startup entry)",
            "internship": "₹30,000-35,000/month / ₹5,000-8,000 (Startup)"
        },
        "description": "Analyzes large datasets to extract business insights and build predictive models using statistical and machine learning techniques. Cleans data, performs statistical analysis, and creates dashboards. Bridges data and business strategy."
    },
    {
        "role": "Systems Engineer / Infrastructure Engineer",
        "domain": "Software",
        "skills": [
            "Linux/Windows",
            "Networking",
            "Cloud platforms (AWS/Azure/GCP)",
            "System administration",
            "Scripting (Bash, Python)",
            "Problem-solving",
            "Infrastructure as Code",
            "CI/CD",
            "Troubleshooting",
            "Docker",
            "Kubernetes"
        ],
        "companies": [
            "Infosys",
            "TCS",
            "Cognizant",
            "HCL",
            "Accenture",
            "Siemens",
            "Reliance Jio",
            "BEL",
            "Brahmos Aerospace",
            "HP",
            "Radical Technologies",
            "Startups"
        ],
        "salary": {
            "avg": "₹6-8 LPA",
            "highest": "₹17 LPA (Brahmos Aerospace)",
            "lowest": "₹3 LPA (Startup entry)",
            "internship": "₹15,000-40,000/month / ₹8,000-10,000 (Startup)"
        },
        "description": "Designs, builds, and maintains infrastructure systems including servers, networks, and cloud platforms. Handles system configuration, monitoring, and optimization. Works on automation, disaster recovery, and infrastructure security."
    },
    {
        "role": "Embedded Linux Engineer",
        "domain": "Software",
        "skills": [
            "C/C++",
            "Embedded Linux",
            "RTOS",
            "Device drivers",
            "Kernel programming",
            "Bootloaders",
            "Problem-solving",
            "Hardware integration",
            "Debugging",
            "Linux command-line",
            "Makefile",
            "Git"
        ],
        "companies": [
            "Qualcomm",
            "NXP",
            "Texas Instruments",
            "Samsung",
            "Siemens",
            "Nokia",
            "Visteon",
            "Broadcom",
            "Startups"
        ],
        "salary": {
            "avg": "₹8-11 LPA",
            "highest": "₹12+ LPA (Estimated)",
            "lowest": "₹4 LPA (Startup entry)",
            "internship": "₹25,000-40,000/month / ₹10,000-15,000 (Startup)"
        },
        "description": "Develops and optimizes embedded Linux systems for IoT, automotive, and consumer devices. Works on kernel modules, device drivers, and bootloaders. Combines embedded systems and Linux OS expertise."
    },
    {
        "role": "Project Engineer Trainee / Firmware Trainee",
        "domain": "Core",
        "skills": [
            "C/C++",
            "Embedded systems",
            "Real-time systems",
            "Debugging",
            "Hardware-software integration",
            "RTOS basics",
            "Problem-solving",
            "Communication"
        ],
        "companies": [
            "Aptiv",
            "E-CON Systems",
            "Tata Elxsi",
            "Visteon",
            "Sony India",
            "Ford Business Solutions",
            "Fuji Electric",
            "Startups"
        ],
        "salary": {
            "avg": "₹7-9 LPA",
            "highest": "₹8.5 LPA (Aptiv multiple)",
            "lowest": "₹2 LPA (Startup entry)",
            "internship": "₹20,000-25,000/month / ₹5,000-8,000 (Startup)"
        },
        "description": "Entry-level role in embedded systems or firmware development working on microcontroller projects and device drivers. Develops under senior guidance, focusing on learning RTOS, debugging techniques, and hardware integration. Gateway to full firmware engineer roles."
    },
    {
        "role": "Programmer Analyst",
        "domain": "Software",
        "skills": [
            "Java",
            "Python",
            "SQL",
            "Data structures",
            "Algorithms",
            "Problem-solving",
            "Coding",
            "Debugging",
            "Git",
            "Database basics",
            "Communication"
        ],
        "companies": [
            "Cognizant",
            "Accenture",
            "Capgemini",
            "HCL",
            "Wipro",
            "IBM",
            "Infosys",
            "TCS",
            "Mindtree",
            "Startups"
        ],
        "salary": {
            "avg": "₹5-7 LPA",
            "highest": "₹8-10 LPA (Accenture variants)",
            "lowest": "₹3 LPA (Startup entry)",
            "internship": "₹15,000-25,000/month / ₹7,000-12,000 (Startup)"
        },
        "description": "Develops software applications and modules using programming languages and structured problem-solving. Writes clean, efficient code and performs unit testing. Works within agile teams to implement features and fix defects."
    },
    {
        "role": "Graduate Engineer Trainee (GET)",
        "domain": "Software & Core",
        "skills": [
            "Technical fundamentals",
            "Problem-solving",
            "Learning ability",
            "Basic programming (Java/Python)",
            "Communication",
            "Adaptability",
            "Quick learning",
            "Attention to detail"
        ],
        "companies": [
            "Infosys",
            "HCL",
            "Cognizant",
            "Mahindra & Mahindra",
            "Motherson",
            "Accenture",
            "Schneider Electric",
            "L&T",
            "Wipro",
            "Startups"
        ],
        "salary": {
            "avg": "₹6-8 LPA",
            "highest": "₹12 LPA (Schneider GET)",
            "lowest": "₹2 LPA (Startup entry)",
            "internship": "₹20,000/month / ₹5,000-8,000 (Startup)"
        },
        "description": "Rotational fresher program providing foundational training in company tech stack and processes. Works on small features, bug fixes, and internal tools under guidance. Designed as pipeline for permanent engineer roles with 18-24 month rotation."
    },
    {
        "role": "R&D Software Engineer",
        "domain": "Software",
        "skills": [
            "Python",
            "MATLAB",
            "C/C++",
            "Research methodology",
            "Algorithm design",
            "Publications/documentation",
            "Linux",
            "Git",
            "Problem-solving",
            "Domain expertise",
            "Simulink"
        ],
        "companies": [
            "Tejas Networks",
            "Samsung R&D",
            "Qualcomm R&D",
            "Nokia Bell Labs",
            "Research institutions",
            "Startups",
            "Tech research teams"
        ],
        "salary": {
            "avg": "₹10-12 LPA",
            "highest": "₹10 LPA (Tejas Networks)",
            "lowest": "₹4 LPA (Startup entry)",
            "internship": "₹30,000/month (Tejas) / ₹10,000-15,000 (Startup)"
        },
        "description": "Develops cutting-edge software for research projects and next-generation technologies. Balances coding with research methodology, algorithm design, and innovation. Often publishes findings and contributes to patent development."
    },
    {
        "role": "SAP / ERP Consultant",
        "domain": "Software",
        "skills": [
            "SAP",
            "ABAP",
            "SQL",
            "Business processes",
            "System configuration",
            "Problem-solving",
            "ERP knowledge",
            "Communication",
            "Data migration"
        ],
        "companies": [
            "SAP LABS",
            "Accenture (SAP practice)",
            "Cap Gemini",
            "Deloitte",
            "Infosys",
            "Cognizant"
        ],
        "salary": {
            "avg": "₹6-10 LPA",
            "highest": "₹10 LPA (Estimated)",
            "lowest": "₹5.5 LPA",
            "internship": "₹20,000/month"
        },
        "description": "Configures and implements enterprise ERP systems (SAP, Oracle) for business operations. Customizes modules for specific business needs, performs data migration, and provides system support. Bridges IT and business departments."
    },
    {
        "role": "Software Quality / Process Engineer",
        "domain": "Software",
        "skills": [
            "Quality assurance methodologies",
            "Test automation (Selenium)",
            "Problem-solving",
            "CMMI/ISO standards",
            "Process improvement",
            "Metrics analysis",
            "Communication",
            "Basic coding"
        ],
        "companies": [
            "Cognizant",
            "Accenture",
            "Capgemini",
            "Infosys",
            "TCS",
            "IBM",
            "HCL",
            "Wipro",
            "Appian"
        ],
        "salary": {
            "avg": "₹7-9 LPA",
            "highest": "₹10 LPA (Estimated)",
            "lowest": "₹6 LPA",
            "internship": "₹20,000-30,000/month"
        },
        "description": "Develops quality standards, test automation frameworks, and process improvements across development teams. Implements QA methodologies, tracks metrics, and ensures compliance with quality standards. Bridges QA and process management."
    },
    {
        "role": "DevOps Engineer",
        "domain": "Software",
        "skills": [
            "Linux",
            "Docker",
            "Kubernetes",
            "AWS/Azure/GCP",
            "CI/CD pipelines",
            "Terraform",
            "Shell scripting",
            "Problem-solving",
            "Monitoring tools",
            "Infrastructure as Code",
            "Git",
            "Jenkins"
        ],
        "companies": [
            "Major Tech Companies",
            "Startups",
            "Qualcomm",
            "Intel",
            "Amazon Web Services",
            "Enphase Energy",
            "Radical Technologies"
        ],
        "salary": {
            "avg": "₹10-13 LPA",
            "highest": "₹15+ LPA (Estimated)",
            "lowest": "₹3.2 LPA (Startup entry)",
            "internship": "₹40,000-60,000/month / ₹8,000-10,000 (Startup)"
        },
        "description": "Manages infrastructure, automates deployment pipelines, and ensures application reliability and scalability. Works with containerization, cloud platforms, and monitoring tools. Combines development and operations expertise."
    },
    {
        "role": "Backend Developer / Node.js Developer",
        "domain": "Software",
        "skills": [
            "JavaScript",
            "Node.js",
            "Express",
            "Python",
            "Django",
            "SQL",
            "API design",
            "Database design",
            "Problem-solving",
            "Git",
            "REST APIs",
            "MongoDB",
            "PostgreSQL"
        ],
        "companies": [
            "Radical Technologies",
            "Startups",
            "Tech companies",
            "E-commerce platforms",
            "SaaS companies"
        ],
        "salary": {
            "avg": "₹5-6 LPA",
            "highest": "₹6+ LPA (Startups with growth)",
            "lowest": "₹3 LPA (Startup entry)",
            "internship": "₹10,000-15,000/month (Startup)"
        },
        "description": "Develops backend services and APIs using Node.js/Python, manages databases, and ensures scalable server architecture. Works on feature development, debugging, and API optimization. Entry point into full-stack or specialized backend roles."
    },
    {
        "role": "IoT Firmware Developer / IoT Engineer",
        "domain": "Core",
        "skills": [
            "C/C++",
            "Microcontroller programming",
            "IoT protocols (MQTT, CoAP, Bluetooth)",
            "Embedded Linux",
            "RTOS",
            "IoT platforms (Arduino, Raspberry Pi)",
            "Problem-solving",
            "Power optimization",
            "Communication protocols"
        ],
        "companies": [
            "Maxwell Energy Systems",
            "IoT startups",
            "Hardware IoT companies",
            "Smart home companies",
            "Industrial IoT platforms",
            "Radical Technologies"
        ],
        "salary": {
            "avg": "₹5-7 LPA",
            "highest": "₹7 LPA (Startups estimate)",
            "lowest": "₹3 LPA (Startup entry)",
            "internship": "₹8,000-12,000/month (Startup)"
        },
        "description": "Develops firmware and software for Internet of Things (IoT) devices including smart sensors, smart home devices, and industrial IoT systems. Works with microcontrollers, wireless protocols, and embedded Linux. Focus on power optimization and connectivity."
    },
    {
        "role": "Junior Full-Stack Web Developer",
        "domain": "Software",
        "skills": [
            "HTML/CSS/JavaScript",
            "React/Vue.js",
            "Node.js/Python",
            "SQL databases",
            "Git",
            "Problem-solving",
            "Basic system design",
            "REST APIs",
            "Agile methodologies"
        ],
        "companies": [
            "Radical Technologies",
            "Startups",
            "Tech companies",
            "Web development agencies",
            "SaaS startups"
        ],
        "salary": {
            "avg": "₹3.5-4.5 LPA",
            "highest": "₹4-5 LPA (Startups)",
            "lowest": "₹2.5 LPA (Startup entry)",
            "internship": "₹2,500-5,000/month (Startup internship)"
        },
        "description": "Develops web applications across frontend (React/Vue) and backend (Node.js/Python) layers. Works on features, bug fixes, and UI/UX improvements. Good entry-level role with rapid learning opportunity in startup environment."
    },
    {
        "role": "Junior Firmware/Embedded Developer (Startup)",
        "domain": "Core",
        "skills": [
            "C/C++",
            "ARM microcontroller basics",
            "RTOS fundamentals",
            "Debugging with JTAG",
            "Problem-solving",
            "Basic hardware integration",
            "Learning mindset",
            "Communication"
        ],
        "companies": [
            "Robotics startups",
            "Hardware startups",
            "IoT companies",
            "Embedded systems startups",
            "Geotech Systems",
            "Startups India"
        ],
        "salary": {
            "avg": "₹3-3.5 LPA",
            "highest": "₹3.5 LPA (Startup estimate)",
            "lowest": "₹2 LPA (Startup entry)",
            "internship": "₹5,000-8,000/month (Startup)"
        },
        "description": "Entry-level embedded systems role in startups focusing on learning core firmware concepts. Works on simple microcontroller projects and device driver basics. Rapid learning environment with hands-on hardware experience."
    },
    {
        "role": "Industrial Automation / Control Systems Technician",
        "domain": "Core",
        "skills": [
            "PLC basics",
            "SCADA",
            "Relay logic",
            "Basic electrical troubleshooting",
            "Industrial protocols",
            "Problem-solving",
            "Mechanical knowledge",
            "Safety compliance",
            "Basic programming (Ladder logic)"
        ],
        "companies": [
            "Radical Technologies",
            "Industrial automation companies",
            "Manufacturing startups",
            "Automation service providers"
        ],
        "salary": {
            "avg": "₹3-4 LPA",
            "highest": "₹4 LPA (Startup estimate)",
            "lowest": "₹2.8 LPA (Startup entry)",
            "internship": "₹8,000-10,000/month (Startup)"
        },
        "description": "Maintains and troubleshoots industrial control systems including PLCs and SCADA. Performs electrical diagnostics and system optimization. Entry point to full automation engineer roles with hands-on experience."
    }
];
