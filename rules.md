# SmartHive AI — Operational & Engineering Rules

## 1. Defensive Security Boundary Rules
1. **Defensive Purpose Only**: SmartHive AI is an autonomous cyber-deception and threat response platform designed strictly for defensive operations, threat simulation, honeynet orchestration, and research.
2. **Zero Destructive Payloads**: Under no circumstances should real malware, ransomware, credential dumpers, exploit payloads, or external internet scanners be created or executed.
3. **Simulated Telemetry Sandbox**: All simulated attacks and decoy interactions must strictly execute inside `simulation/` and `deception-lab/` utilizing synthetic events and sandbox telemetry.

---

## 2. Telemetry & Data Integrity Rules
1. **No Fake Metrics / No `Math.random()` for Security Metrics**:
   - Scores (Risk, Curiosity, Confidence, Lead Time) must be deterministically calculated from real stored database events and ML model outputs.
   - Initial ML models are trained on real Kaggle honeypot telemetry (AWS Honeypot / CUIP-X25 Dionaea dataset).
2. **Dataset Access**:
   - Provide direct Kaggle reference links ([https://www.kaggle.com/datasets/maricinnamon/honeypot-network-attack-dataset](https://www.kaggle.com/datasets/maricinnamon/honeypot-network-attack-dataset)).
3. **Cryptographic Integrity**:
   - All generated evidence artifacts must include a computed SHA-256 `Evidence Integrity Hash`.
   - Never claim formal legal ISO-17025 forensic certification; refer to it as "Evidence Integrity Hash".

---

## 3. UI/UX & Design Guidelines
1. **Color Palette**:
   - Primary Background: Crisp White (`#FFFFFF`).
   - Secondary Panels & Cards: Light Gray (`#F8FAFC` / `#F1F5F9`).
   - Border Lines: Minimal, sleek thin borders (`#E2E8F0`).
   - Typography: Enterprise Dark Navy (`#0F172A`, `#1E293B`, `#334155`).
   - Accents: Subtle Blue (`#2563EB`), Emerald Green (`#059669` for safe/active), Amber (`#D97706` for guarded), Crimson (`#DC2626` for critical).
2. **Prohibited Aesthetics**:
   - NO Matrix green terminal rain.
   - NO Cyberpunk neon glows, pulsating lasers, or sci-fi gimmicks.
   - NO Glassmorphism with heavy blur or dark hacker aesthetics.
   - Must present as an enterprise-grade SecOps / Cyber Command platform (similar to CrowdStrike Falcon, SentinelOne, Microsoft Defender).

---

## 4. Autonomy Safety Governor Rules
Every autonomous deception and response action MUST pass through the Autonomy Safety Governor before execution:
* **Level 0 (Observe)**: Record telemetry only. All autonomous actions disabled.
* **Level 1 (Recommend)**: Suggest deception and containment actions; require SOC analyst click-to-approve.
* **Level 2 (Safe Deception Automation - Default)**:
  - `Activate Decoy` -> **ALLOW** (automated).
  - `Deploy Honeytoken` -> **ALLOW** (automated).
  - `Redirect Simulated Session to Shadow Network` -> **ALLOW** (automated).
  - `Increase Telemetry Sampling` -> **ALLOW** (automated).
* **Level 3 (Controlled Response)**:
  - `Dispatch Physical Response Team` -> **ALLOW** or **HUMAN APPROVAL** based on policy threshold.
  - `Production Endpoint Isolation` -> **HUMAN APPROVAL MANDATORY**.
  - `Production Firewall Rule Injection` -> **HUMAN APPROVAL MANDATORY**.
  - `Disable Real Active Directory Account` -> **HUMAN APPROVAL MANDATORY**.
  - `Unknown / Destructive Action` -> **BLOCK**.

---

## 5. API & Error Handling Rules
1. **Graceful Fallbacks**:
   - Backend Offline: Render explicit banner: `BACKEND UNAVAILABLE`.
   - Database Offline: Render explicit banner: `DATABASE OFFLINE`.
   - AI Engine Offline: Fall back gracefully to internal rule-based inference with banner: `AI ENGINE OFFLINE - RUNNING LOCAL HEURISTICS`.
   - Google Maps Key Missing: Display interactive fallback map view with message: `MAP CONFIGURATION REQUIRED (DEMO MOCK ACTIVE)`.
   - Empty Telemetry: Display `NO TELEMETRY AVAILABLE`.
2. **Never Invent Evidence**:
   - If telemetry for an entity is missing or insufficient, state: `Insufficient telemetry is available.`
