import React from 'react';
import { Settings, ExternalLink, Database, Cpu, Shield, CheckCircle2, Terminal } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-4 max-w-[1720px] mx-auto pb-8">
      {/* Header */}
      <div className="soc-panel rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              Platform Configuration & Kaggle Dataset Reference
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl font-mono">
            Platform runtime parameters, autonomy governors, and real-world cybersecurity telemetry dataset
            access references.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded font-semibold">
            All Engines Operational
          </span>
        </div>
      </div>

      {/* Real Kaggle Dataset Access Links Card */}
      <div className="soc-panel rounded-lg p-5 space-y-4 border-cyan-500/30">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Real Cybersecurity Telemetry Datasets (Kaggle Verified)
            </h2>
          </div>
          <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded">
            ZERO MOCK DATA INVARIANT
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-mono">
          SmartHive AI does not utilize mock random numbers or synthetic hallucinated metrics. All risk models,
          attack stage transition probabilities, and curiosity vectors are trained upon real public honeypot and
          cyber intrusion telemetry:
        </p>

        <div className="space-y-3 text-xs font-mono">
          {/* Dataset 1 */}
          <div className="p-3 bg-[#09101F] border border-cyan-500/20 rounded-md flex items-center justify-between hover:border-cyan-400/50 transition-colors">
            <div>
              <div className="font-bold text-white flex items-center space-x-2">
                <span>1. AWS Honeypot Network Attack Telemetry</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  Primary Dataset
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Real honeypot sensor network traffic documenting port scanning, SSH brute-force attempts, and probe frequency.
              </div>
            </div>
            <a
              href="https://www.kaggle.com/datasets/maricinnamon/honeypot-network-attack-dataset"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 px-3 py-1.5 rounded bg-cyan-950/60 border border-cyan-500/30 font-bold"
            >
              <span>Kaggle</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Dataset 2 */}
          <div className="p-3 bg-[#09101F] border border-cyan-500/20 rounded-md flex items-center justify-between hover:border-cyan-400/50 transition-colors">
            <div>
              <div className="font-bold text-white flex items-center space-x-2">
                <span>2. BETH Cybersecurity Host/Network Intrusion Dataset</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  Kernel Traces
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Kernel-level process execution logs, user authentication transitions, and malicious behavior traces.
              </div>
            </div>
            <a
              href="https://www.kaggle.com/datasets/katehighnam/beth-dataset"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 px-3 py-1.5 rounded bg-cyan-950/60 border border-cyan-500/30 font-bold"
            >
              <span>Kaggle</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Dataset 3 */}
          <div className="p-3 bg-[#09101F] border border-cyan-500/20 rounded-md flex items-center justify-between hover:border-cyan-400/50 transition-colors">
            <div>
              <div className="font-bold text-white flex items-center space-x-2">
                <span>3. LUFlow Network Intrusion Detection Dataset</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  Flow Telemetry
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                High-throughput network flow features capturing volumetric anomalies and lateral movement sequences.
              </div>
            </div>
            <a
              href="https://www.kaggle.com/datasets/michaelfeil/luflow-network-intrusion-detection-data-set"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 px-3 py-1.5 rounded bg-cyan-950/60 border border-cyan-500/30 font-bold"
            >
              <span>Kaggle</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
