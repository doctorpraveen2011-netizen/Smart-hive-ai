# SmartHive AI — Product Requirements Document (PRD)

## 1. Product Overview & Purpose
**SmartHive AI** is an Autonomous Predictive Cyber-Deception, Threat Futures, Evidence Intelligence, and Security Response Platform built for next-generation defensive cybersecurity operations.

Unlike traditional reactive Security Information and Event Management (SIEM) and Security Orchestration, Automation, and Response (SOAR) platforms that alert defenders *after* an asset has been compromised, SmartHive AI operates on the principle of:
> **Predict • Detect • Deceive • Protect**

SmartHive detects early suspicious signals, forecasts plausible attack progression paths (Threat Futures), evaluates counterfactual ("what-if") defense actions, safely deploys adaptive deception environments and honeytokens, diverts the threat session into an isolated digital twin shadow network, gathers cryptographically verifiable evidence, and coordinates authorized response teams with high Attack Lead Time.

---

## 2. Core Value Proposition & Metrics
1. **Attack Lead Time (Major KPI)**: Quantifies how far in advance SmartHive accurately predicted an attacker's next move before the stage occurred (e.g., 5m 27s lead time), enabling preemptive containment.
2. **Zero Production Risk**: Autonomous actions are governed by an Autonomy Safety Governor (Levels 0–3) preventing unapproved disruption to production systems.
3. **Deterministic, Real-Dataset Intelligence**: Derived from real Kaggle honeypot and intrusion detection telemetry (CUIP-X25 Dionaea Honeypot dataset & AWS Honeypot telemetry), avoiding fake random metrics.
4. **Predictive Deception Shadow Network**: Dynamically routes threat actors into a parallel synthetic reality graph with decoy assets, preventing exposure of actual corporate assets.

---

## 3. Real Dataset Source & Access Link
As mandated, SmartHive AI is built upon real-world honeypot and cyber intrusion telemetry, not random metrics or mock data:
* **Primary Kaggle Dataset**: **AWS Honeypot & Network Attack Telemetry** / **CUIP-X25 Cyber Attacks Honeypot Dataset**
  * **Kaggle Access Link**: [https://www.kaggle.com/datasets/maricinnamon/honeypot-network-attack-dataset](https://www.kaggle.com/datasets/maricinnamon/honeypot-network-attack-dataset)
  * **Secondary Reference (BETH Honeypot Telemetry)**: [https://www.kaggle.com/datasets/katehighnam/beth-dataset](https://www.kaggle.com/datasets/katehighnam/beth-dataset)
  * **LUFlow Network Intrusion & Honeynet Dataset**: [https://www.kaggle.com/datasets/michaelfeil/luflow-network-intrusion-detection-data-set](https://www.kaggle.com/datasets/michaelfeil/luflow-network-intrusion-detection-data-set)
* **Dataset Characteristics Used**:
  * Real external IP addresses, port probe sequences, protocol distribution (SSH, HTTP, SMB, RDP).
  * Honeypot decoy interaction timestamps, payload attempt signatures, and lateral movement timelines.
  * Supervised multi-class labels for anomaly scoring, stage transition matrices, and curiosity scoring.

---

## 4. User Personas & Roles
1. **SOC Analyst**: Monitors real-time telemetry, reviews Threat Futures trees, inspects Evidence Graphs, interacts with AI Investigator, and generates executive reports.
2. **Security Architect / Admin**: Configures deception templates, inspects Digital Twin topology and Shadow Network routing, manages Autonomy Safety Governor policies.
3. **Incident Response Lead (Responder)**: Coordinates field response teams, reviews response intelligence packages, tracks team dispatch and containment ETAs.
4. **Hackathon Judge / Auditor**: Executes the Judge Demo (Full Smart Attack & Step-by-Step triggers), validates Attack Lead Time, verifies evidence SHA-256 hashes, and evaluates prediction accuracy.

---

## 5. Logical Pipeline Architecture
1. **TELEMETRY**: Ingests network, host, auth, decoy, and honeytoken events.
2. **EVENT INGESTION**: Validates schema via Zod and normalizes event structures.
3. **THREAT SESSION CORRELATION**: Aggregates disparate events by IP, session identifier, and behavior into structured `ThreatSession` (e.g., `SH-104`).
4. **BEHAVIOR ANALYSIS**: Computes event velocity, payload anomaly score, and stage duration.
5. **ADVERSARY CURIOSITY ENGINE**: Quantifies adversary interest across 6 categories: Credentials, Databases, Cloud Secrets, Source Code, Financial Data, Authentication Infrastructure.
6. **ATTACK STAGE CLASSIFICATION**: Maps session into MITRE ATT&CK-aligned phases (Reconnaissance, Discovery, Credential Discovery, Credential Access Attempt, Lateral Movement, Exfiltration, Contained).
7. **ATTACK INTENT PREDICTION**: Computes predicted next stage, target asset, risk, and confidence.
8. **THREAT FUTURES ENGINE**: Generates multi-branch probabilistic decision tree of possible future stages.
9. **COUNTERFACTUAL "WHAT-IF" DEFENSE ENGINE**: Simulates outcomes across defensive intervention options (No Action vs. Auth Decoy vs. Shadow Network vs. Isolation).
10. **AUTONOMY SAFETY GOVERNOR**: Enforces safety policy gating (Levels 0–3: ALLOW, HUMAN APPROVAL, BLOCK).
11. **ADAPTIVE DECEPTION ORCHESTRATOR**: Selects and deploys optimal decoy based on curiosity profile and counterfactual score.
12. **DIGITAL TWIN / SHADOW NETWORK**: Projects enterprise asset topology vs. parallel deception shadow graph.
13. **EVIDENCE COLLECTION**: Compiles timestamped evidence with SHA-256 integrity hashes.
14. **INCIDENT CREATION**: Escalates critical sessions into full Incident records with target asset and severity.
15. **LOCATION INTELLIGENCE**: Integrates SmartCorp sites (Chennai, Bengaluru, Mumbai, Delhi, Hyderabad) with Google Maps.
16. **AUTHORIZED RESPONSE COORDINATION**: Assigns nearest available Response Team with calculated route, ETA, and response intelligence package.
17. **REPORT GENERATION**: Produces professional PDF/Printable reports and JSON exports.
18. **PREDICTION EVALUATION**: Evaluates predicted next action against actual simulated outcome.
19. **ATTACK LEAD TIME**: Calculates and visualizes the early warning window.
20. **DECEPTION EFFECTIVENESS LEARNING**: Updates decoy engagement and diversion metrics based on historical outcomes.

---

## 6. Functional Requirements
* **Command Center**: Clean, enterprise white UI with KPI cards, real-time threat map, latest incidents, live Threat Futures node preview, alerts, and governor audit.
* **Judge Demo**: Instant single-click "Run Full Smart Attack" and manual stage triggers with immediate real-time WebSocket updates across all components.
* **AI Investigator**: Interactive natural language Q&A grounded strictly in stored database telemetry.
* **Exporting**: One-click printable PDF view and raw JSON evidence package export.
