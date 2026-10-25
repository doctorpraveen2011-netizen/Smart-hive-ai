# SmartHive AI
> **Predict • Detect • Deceive • Protect**  
> *Autonomous Predictive Cyber-Deception, Threat Futures, Evidence Intelligence, and Security Response Platform*

SmartHive AI is a full-stack, defensive cybersecurity platform designed to detect early suspicious behavior, forecast plausible multi-stage attack futures, evaluate counterfactual defensive options, safely orchestrate adaptive deception decoys, divert threat sessions into an isolated digital twin shadow network, capture cryptographically verifiable evidence, and coordinate physical/SOC response with high **Attack Lead Time**.

---

## 🚀 Key Highlights & Features

1. **Deterministic Pipeline (Zero Mock Metrics)**:
   All risk scores (0–100), curiosity vectors, stage classifications, and lead times are calculated from real stored telemetry records and ML model inferences. No `Math.random()`.
2. **Kaggle Dataset Training & Seeding**:
   - Primary Dataset: **AWS Honeypot Network Attack Telemetry & CUIP-X25 Honeypot Dataset**
   - Access Link: [https://www.kaggle.com/datasets/maricinnamon/honeypot-network-attack-dataset](https://www.kaggle.com/datasets/maricinnamon/honeypot-network-attack-dataset)
   - Secondary Reference: [https://www.kaggle.com/datasets/katehighnam/beth-dataset](https://www.kaggle.com/datasets/katehighnam/beth-dataset)
3. **Threat Futures Engine**:
   Dynamic multi-branch probabilistic future progression tree rendered in interactive React Flow.
4. **Counterfactual "What-If" Defense Simulator**:
   Simulates expected threat progression under alternative defensive actions (No Action vs. Auth Decoy vs. Shadow Network vs. Isolation) to recommend optimal risk reduction.
5. **Autonomy Safety Governor**:
   Strict policy gating (Levels 0–3: ALLOW, HUMAN APPROVAL, BLOCK) ensuring automated deception never impacts production operations.
6. **Adaptive Deception & Shadow Network**:
   Parallel deception path reflecting SmartCorp's Digital Twin topology.
7. **Evidence Cryptographic Integrity**:
   Every evidence artifact is timestamped with an `Evidence Integrity Hash` (SHA-256).
8. **Attack Lead Time Metric**:
   Measures early warning capability ($\Delta t$) between predicted attack intent and actual simulated occurrence.
9. **Dedicated Judge Demo**:
   Single-click full attack simulation + granular step-by-step triggers with live WebSocket updates across all components.

---

## 🛠️ Tech Stack

* **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Flow, Recharts, Lucide React, Axios, Socket.IO Client, Google Maps JS API.
* **Backend**: Node.js, TypeScript, Express.js, Socket.IO, Prisma ORM, JWT, bcrypt, Zod.
* **Database**: SQLite (default zero-config local engine on Windows) / PostgreSQL.
* **AI Engine**: Python 3, FastAPI, scikit-learn, NumPy, Pandas, Joblib.
* **Architecture**: Strict modular micro-engine layout.

---

## ⚡ Quick Start on Windows

### 1. Prerequisites
- **Node.js**: v18+ (tested on v24)
- **Python**: v3.10+ (tested on v3.14)
- **PowerShell**

### 2. Database & Backend Setup
```powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# Generate Prisma client and initialize database
npx prisma generate
npx prisma db push
npm run seed

# Start backend server (runs on port 5000)
npm run dev
```

### 3. AI Engine Setup
```powershell
# In a new terminal, navigate to ai-engine
cd ai-engine

# Create virtual environment and activate
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies and train models on Kaggle dataset
pip install -r requirements.txt
python -m app.train

# Start FastAPI server (runs on port 8000)
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 4. Frontend Setup
```powershell
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite dev server (runs on port 5173)
npm run dev
```

Visit **http://localhost:5173** to access the SmartHive AI Command Center.

---

## 🛡️ Default Development Credentials
- **Username / Email**: `analyst@smartcorp.demo`
- **Password**: `SmartHive2026!`
- **Role**: `SOC_ANALYST` (Full access to all command and demo controls)

---

## 🏛️ SmartCorp Enterprise Topology
- **Sites**: Chennai (HQ), Bengaluru (R&D), Mumbai (Datacenter), Delhi (Ops), Hyderabad (Cloud Hub).
- **Assets**: `WEB-SRV-01`, `AUTH-SRV-01`, `DB-PROD-01`, `FILE-SRV-01`, `MAIL-SRV-01`, `DEV-SRV-01`, `API-GATEWAY-01`, `ADMIN-PORTAL`.
- **Synthetic Personas**: Arun Kumar (Finance, `FIN-LT-014`, `finance_q4.xlsx`).
