# SmartHive AI — Project Memory & Architectural Ledger

## 1. System Environment & Specifications
* **Host OS**: Windows (PowerShell Shell).
* **Node.js**: `v24.14.0` | **npm**: `11.9.0`.
* **Python**: `3.14.3` (FastAPI + scikit-learn).
* **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Flow, Recharts, Lucide React, Google Maps JS API.
* **Backend**: Node.js, Express, Socket.IO, Prisma ORM, JWT, bcrypt, Zod.
* **Database**: SQLite for seamless zero-dependency Windows local setup (seamlessly upgradable to PostgreSQL via Prisma schema).
* **Ports Allocated**:
  - Frontend: `http://localhost:5173`
  - Backend: `http://localhost:5000`
  - AI Engine: `http://localhost:8000`

---

## 2. Kaggle Dataset Integration Reference
* **Dataset Name**: AWS Honeypot Network Attack Telemetry & CUIP-X25 Cyber Attacks Honeypot Dataset.
* **Access Link**: [https://www.kaggle.com/datasets/maricinnamon/honeypot-network-attack-dataset](https://www.kaggle.com/datasets/maricinnamon/honeypot-network-attack-dataset)
* **Secondary Link**: [https://www.kaggle.com/datasets/katehighnam/beth-dataset](https://www.kaggle.com/datasets/katehighnam/beth-dataset)
* **Integration Points**:
  - Telemetry parser loads authentic protocol frequencies, source IPs, port probes, and payload hashes.
  - Anomaly scoring models (IsolationForest) and Attack Stage classifiers are trained against this dataset.
  - Zero mock random numbers: all metrics (Risk, Curiosity, Lead Time) are calculated deterministically from stored database events.

---

## 3. Fictional Enterprise Persona: SmartCorp
* **Organization**: SMARTCORP
* **Sites**:
  - `CHN-01`: Chennai Headquarters (13.0827° N, 80.2707° E)
  - `BLR-01`: Bengaluru R&D Center (12.9716° N, 77.5946° E)
  - `MUM-01`: Mumbai Data Center (19.0760° N, 72.8777° E)
  - `DEL-01`: Delhi Operations Hub (28.7041° N, 77.1025° E)
  - `HYD-01`: Hyderabad Cloud Exchange (17.3850° N, 78.4867° E)
* **Core Assets**:
  - `WEB-SRV-01` (Public Web Frontend, Chennai)
  - `AUTH-SRV-01` (Active Directory / Kerberos, Mumbai)
  - `DB-PROD-01` (Core Relational Database, Mumbai)
  - `FILE-SRV-01` (Corporate File Share, Bengaluru)
  - `MAIL-SRV-01` (Exchange / SMTP, Chennai)
  - `DEV-SRV-01` (Internal CI/CD & GitLab, Bengaluru)
  - `API-GATEWAY-01` (Edge Gateway, Delhi)
  - `ADMIN-PORTAL` (Internal Management Dashboard, Hyderabad)
* **Synthetic Reality Persona**:
  - Employee: `Arun Kumar`
  - Department: `Finance`
  - Device: `FIN-LT-014`
  - Email: `arun.kumar@smartcorp.demo`
  - Fake Honeytoken Document: `finance_q4.xlsx`

---

## 4. Architectural Invariants
1. **Frontend Isolation**: Frontend NEVER calls Python directly. Node.js backend handles all routing and validation.
2. **Deterministic Risk Formula**: Derived from:
   $$\text{Risk} = w_1 \cdot \text{Severity} + w_2 \cdot \text{Frequency} + w_3 \cdot \text{Anomaly} + w_4 \cdot \text{HoneytokenHit} + w_5 \cdot \text{TargetSensitivity}$$
3. **Autonomy Safety Governor**: Levels 0–3 strictly gate automated deceptive deployment and response actions.
4. **Attack Lead Time**: Measured as $\Delta t = t_{\text{actual}} - t_{\text{predicted}}$ with median, average, and peak tracking.
