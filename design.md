# SmartHive AI — System Design & UI/UX Specification

## 1. Visual Design Philosophy & Aesthetics
SmartHive AI is designed for modern enterprise Security Operations Centers (SOCs) and Executive Threat Briefings. The UI emphasizes high data density, rapid scannability, clarity, and zero visual clutter.

### Color Palette Tokens
- **Background Root**: `#FFFFFF` (Pure White)
- **Background Muted**: `#F8FAFC` (Slate 50)
- **Background Card**: `#FFFFFF` with border `#E2E8F0` (Slate 200)
- **Text Primary**: `#0F172A` (Slate 900)
- **Text Secondary**: `#475569` (Slate 600)
- **Text Muted**: `#94A3B8` (Slate 400)
- **Border Default**: `#E2E8F0`
- **Brand Primary**: `#2563EB` (Blue 600)
- **Brand Focus**: `#1D4ED8` (Blue 700)
- **Severity Colors**:
  - `LOW` (0–24): `#10B981` (Emerald 500)
  - `GUARDED` (25–49): `#0EA5E9` (Sky 500)
  - `MEDIUM` (50–69): `#F59E0B` (Amber 500)
  - `HIGH` (70–84): `#F97316` (Orange 500)
  - `CRITICAL` (85–100): `#EF4444` (Red 500)
- **Deception Indicator**: `#8B5CF6` (Purple 500) - indicates active honeypot or shadow asset diversion.

### Typography
- **Headings & UI**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, sans-serif.
- **Monospace (IPs, Hashes, Session IDs)**: `JetBrains Mono`, `Consolas`, monospace.

---

## 2. Navigation & Sidebar Architecture
Organized strictly by operational domains:

```
COMMAND
└── Command Center (/)

INTELLIGENCE
├── Threat Intelligence (/intelligence)
├── Predictive Alerts (/alerts)
├── Threat Futures (/threat-futures)
├── Attack Timeline (/timeline)
├── Attack Graph (/attack-graph)
└── Curiosity Engine (/curiosity)

DECEPTION
├── Digital Twin (/digital-twin)
├── Shadow Network (/shadow-network)
├── Deception Lab (/deception-lab)
├── Decoy Systems (/decoys)
├── Honeytokens (/honeytokens)
└── Sessions (/sessions)

RESPONSE
├── Incident Map (/incident-map)
├── Response Teams (/response-teams)
├── Incidents (/incidents)
└── Evidence (/evidence)

AI
├── AI Investigator (/ai-investigator)
└── Prediction Performance (/prediction-performance)

GOVERNANCE
├── Autonomy Governor (/governor)
└── Audit Log (/audit-log)

OPERATIONS
├── Event Logs (/events)
└── Reports (/reports)

SYSTEM
├── Judge Demo (/judge-demo)
└── Settings (/settings)
```

---

## 3. Interactive Graph Component Specifications (React Flow)

### 3.1 Digital Twin Topology
- **Nodes**:
  - `SiteNode`: Geographic regional data center (Chennai, Bengaluru, Mumbai, Delhi, Hyderabad).
  - `AssetNode`: Workstation or server card displaying status, OS, IP, active sessions, risk badge, and deception flag.
- **Interactivity**: Clicking an asset slides open an **Asset Detail Drawer** showing dependencies, active telemetry events, synthetic identity ties, and predictions.

### 3.2 Threat Futures Engine
- **Hierarchical Branching**:
  - Root: Current stage (e.g. `Credential Discovery (Risk 86)`).
  - Branch 1: High-probability next stage (e.g. `Credential Access Attempt - 71%`).
  - Branch 2: Secondary pivot (e.g. `Privilege Escalation - 18%`).
  - Branch 3: Termination or diversion (e.g. `Session Disconnects - 11%`).
- **Edge Styling**: Animated dashed strokes weighted by transition probability.

### 3.3 Evidence Confidence Graph
- Nodes represent observed events (`Service Enumeration`, `SSH Decoy Hit`, `Honeytoken Trigger`, `Auth Anomaly`).
- Edges converge on the `Inferred Attack Intent` and `Predicted Next Target`.
- Clicking any node displays the **SHA-256 Evidence Integrity Hash**, timestamp, and raw payload snippet.

### 3.4 Shadow Network Topology
- Dual split-view: **Protected Production Network** (Left) vs. **Deception Shadow Network** (Right).
- Animated red pulse indicator showing the adversary's session `SH-104` diverted cleanly away from `DB-PROD-01` into `DB-DECOY-03`.

---

## 4. Real-Time WebSocket Channel Contract
The backend emits events on the default namespace:
- `event:new`: Newly ingested security event.
- `session:update`: Updated threat session state, risk, or stage.
- `curiosity:update`: Real-time curiosity vector update.
- `prediction:update`: New predicted next action, target, and confidence.
- `futures:update`: Updated Threat Futures tree.
- `counterfactual:update`: Updated what-if defense simulation.
- `governor:decision`: Autonomy safety governor action log.
- `decoy:status`: Decoy activation, engagement, or diversion.
- `honeytoken:trigger`: Honeytoken access alert.
- `incident:update`: Incident created, assigned, or contained.
- `response:dispatch`: Field unit route and ETA update.
- `evaluation:result`: Prediction accuracy and Attack Lead Time calculation.
