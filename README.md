#  ECE Specialized ATS Scorer and Resume Analyser 
Out ATS Scorer is a specialized Applicant Tracking System (ATS) Resume Scorer specifically engineered for Electronics and Communication Engineering (ECE) students and professionals. Unlike generic ATS tools, ResuMatch uses a deep technical scoring engine to analyze hardware, embedded systems, and VLSI expertise.

![Dashboard Preview](file:///d:/USEME%20FOLDER/ANTIGRAVITY/public/preview.png) *(Note: AI-powered domain analysis for core engineering)*

## 🚀 Key Features

- **Domain Radar Analysis**: Visualizes expertise across 5 core domains: Digital VLSI, Analog VLSI, Embedded Systems, Communication, and Software.
- **Smart Role Prediction**: Automatically matches resumes to 20+ specialized ECE job roles using multi-layered scoring logic.
- **Verification Engine**: Fetches and verifies LeetCode and HDLBits profiles via extracted hyperlinks for verified skill bonuses.
- **Confidence Scoring**: Calculates a reliability score (0-100%) based on CGPA, College Tier, Internship Depth, and Profile Verification.
- **Interactive Feedback**: Provides actionable, industry-grade tips on formatting, technical depth, and industry flow representation.

## 🧠 The Scoring Logic

ResuMatch uses a high-sensitivity scoring architecture to ensure high-accuracy results for elite profiles:

### 1. Tiered Keyword Matching
Keywords are categorized into three tiers for each domain, ensuring that simple keyword density doesn't inflate scores without specialization:
- **Tier 1 (Core)**: 7-10 pts (Foundational industry terms like Verilog, CMOS, Embedded C).
- **Tier 2 (Pro)**: 4-5 pts (Specialized tools/frameworks like Vivado, Virtuoso, FreeRTOS).
- **Tier 3 (Exposure)**: 2 pts (Supporting keywords and protocols).

### 2. Digital VLSI Flow Quota
To prevent score inflation from theoretical knowledge, the system implements a strict **Flow Quota**. The top 20 points of the Digital VLSI score are reserved for practical implementation flows:
- **ASIC Flow**: Synthesis (Yosys/Genus), STA, DFT, Gate-Level Simulation.
- **Physical Design**: Placement, Routing, Floorplanning, DRC/LVS.
- **Tapeout**: Proof of actual silicon tapeout experience or TinyTapeout participation.
*Failure to demonstrate multi-tool flow knowledge naturally restrains the domain score to the 60-80 range.*

### 3. Verification & Confidence
The engine looks for hyperlinks to external platforms and applies verification bonuses:
- **LeetCode/HDLBits**: Verified problem counts add domain-specific bonuses for Software and Digital VLSI respectively.
- **Confidence Factor**: A metric reflecting the reliability of the analysis based on resume density, institutional recognition, and internship experience.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org) (App Router)
- **Styling**: Vanilla CSS / Tailwind (for utils) with Glassmorphism support.
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org)
- **Icons**: [Lucide React](https://lucide.dev)
- **Parsing**: Custom PDF annotation and text extraction engine (`parse-pdf.mjs`).

## 📦 Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd ats-scorer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

### Usage

1. Open `http://localhost:3000` in your browser.
2. Upload your ECE resume (PDF format).
3. View your Domain Radar, Role Recommendations, and Technical Feedback.
4. Ensure your LinkedIn, GitHub, and LeetCode links are in the PDF to trigger verification bonuses.

## 📄 License
MIT License - Specialized tool for ECE career advancement.
