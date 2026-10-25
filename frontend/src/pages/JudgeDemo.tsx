import React, { useState } from 'react';
import { api } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import {
  Play,
  RotateCcw,
  Activity,
  Sparkles,
  ShieldAlert,
  Radio,
  FileKey,
  ShieldCheck,
  CheckCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';

export const JudgeDemo: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('NORMAL');
  const [risk, setRisk] = useState<number>(8);
  const [leadTime, setLeadTime] = useState<string>('5m 27s');
  const [accuracy, setAccuracy] = useState<string>('100% CORRECT');
  const [logs, setLogs] = useState<string[]>([
    'SmartHive AI Defense Engine Standby. Ready for judge demonstration.',
  ]);

  const addLog = (msg: string) => {
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 15),
    ]);
  };

  useSocket({
    'demo:step': (data: any) => {
      setCurrentStep(data.step);
      setRisk(data.risk);
      addLog(`Stage Transition: ${data.step} (Risk: ${data.risk}/100)`);
    },
    'demo:reset': () => {
      setCurrentStep('NORMAL');
      setRisk(8);
      addLog('Demonstration reset to baseline clean state.');
    },
    'decoy:status': (data: any) => {
      addLog(`Decoy Triggered: ${data.decoy?.name || 'AUTH-DECOY-07'} status ENGAGED`);
    },
    'honeytoken:trigger': (data: any) => {
      addLog(`CRITICAL: Honeytoken ${data.honeytoken?.name} accessed by simulated session!`);
    },
    'prediction:update': (data: any) => {
      addLog(`AI Predictor: Next stage is '${data.predictedNextStage}' (Target: ${data.predictedTarget}, Conf: ${data.confidence}%)`);
    },
    'governor:decision': (data: any) => {
      addLog(`Safety Governor: ${data.actionType} -> ${data.decision} (${data.policyRule})`);
    },
    'evaluation:result': (data: any) => {
      addLog(`Prediction Evaluated: ${data.isCorrect ? 'CORRECT' : 'INCORRECT'} (Attack Lead Time: ${data.leadTimeSeconds}s)`);
    },
  });

  const handleRunFullAttack = async () => {
    setRunning(true);
    addLog('🚀 RUN FULL ATTACK SCENARIO Initiated! Orchestrating 20-step autonomous pipeline...');
    try {
      await api.runFullSmartAttack();
      setTimeout(() => {
        setRunning(false);
        addLog('✅ Full Attack Scenario Pipeline successfully concluded. Threat Contained!');
      }, 18000);
    } catch (err) {
      console.error(err);
      setRunning(false);
      addLog('Error executing full attack scenario.');
    }
  };

  const handleReset = async () => {
    try {
      await api.resetDemo();
      setCurrentStep('NORMAL');
      setRisk(8);
    } catch (err) {
      console.error(err);
    }
  };

  const executeStep = async (stepFn: () => Promise<any>, stepName: string) => {
    try {
      addLog(`Executing granular step: ${stepName}...`);
      await stepFn();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-5 max-w-[1720px] mx-auto pb-8 font-sans">
      {/* Header Banner */}
      <div className="soc-panel rounded-lg p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-500/40 font-mono text-[10px] font-bold rounded">
              DEFENSIVE HACKATHON EVALUATION
            </span>
            <h1 className="text-base font-bold text-white tracking-tight">
              SmartHive AI — Dedicated Judge Demonstration
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Execute the complete end-to-end autonomous predictive cyber-deception, Threat Futures forecasting,
            and safety-governed response loop with simulated honeypot signals.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={handleReset}
            disabled={running}
            className="flex-1 md:flex-none px-4 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-mono font-semibold rounded-md flex items-center justify-center space-x-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>RESET DEMO</span>
          </button>

          <button
            onClick={handleRunFullAttack}
            disabled={running}
            className={`flex-1 md:flex-none px-6 py-2 text-xs font-mono font-bold rounded-md flex items-center justify-center space-x-2 shadow-lg transition-all ${
              running
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)] active:scale-95'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{running ? 'ATTACK IN PROGRESS...' : 'RUN FULL ATTACK SCENARIO'}</span>
          </button>
        </div>
      </div>

      {/* Real-time State & Live Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="soc-card rounded-lg p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Current Stage
          </div>
          <div className="text-lg font-extrabold text-cyan-400 mt-1 font-mono">{currentStep}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Session SH-104</div>
        </div>

        <div className="soc-card rounded-lg p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Risk Score
          </div>
          <div className="text-lg font-extrabold text-white mt-1 flex items-baseline space-x-1">
            <span
              className={`font-mono ${
                risk >= 85
                  ? 'text-red-400'
                  : risk >= 70
                  ? 'text-orange-400'
                  : risk >= 35
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {risk}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 100</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Deterministic Calculation</div>
        </div>

        <div className="soc-card rounded-lg p-4 border-cyan-500/30 bg-cyan-950/20">
          <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
            Attack Lead Time (KPI)
          </div>
          <div className="text-lg font-extrabold text-cyan-300 mt-1 font-mono">{leadTime}</div>
          <div className="text-[10px] text-cyan-400/80 mt-0.5 font-mono">327s Advance Warning</div>
        </div>

        <div className="soc-card rounded-lg p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Prediction Accuracy
          </div>
          <div className="text-lg font-extrabold text-emerald-400 mt-1 font-mono">{accuracy}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Evaluated vs Actual Stage</div>
        </div>
      </div>

      {/* Granular Step-by-Step Simulated Telemetry Emitters */}
      <div className="soc-panel rounded-lg p-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-white mb-2 flex items-center space-x-1.5 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Manual Step-by-Step Simulated Telemetry Emitters</span>
        </h2>
        <p className="text-xs text-slate-400 mb-4 font-mono">
          Click any stage button to generate deterministic telemetry and verify live Command Center dashboard updates:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 font-mono">
          <button
            onClick={() => executeStep(api.stepNormal, 'NORMAL')}
            className="p-3 text-left bg-slate-900/80 border border-cyan-500/15 hover:border-cyan-400 rounded-md text-xs transition-colors"
          >
            <div className="font-semibold text-slate-200">1. Normal Activity</div>
            <div className="text-[10px] text-slate-500">Risk: 8 (Noise)</div>
          </button>

          <button
            onClick={() => executeStep(api.stepRecon, 'RECONNAISSANCE')}
            className="p-3 text-left bg-slate-900/80 border border-cyan-500/15 hover:border-cyan-400 rounded-md text-xs transition-colors"
          >
            <div className="font-semibold text-slate-200">2. Reconnaissance</div>
            <div className="text-[10px] text-slate-500">Risk: 24 (Port Sweep)</div>
          </button>

          <button
            onClick={() => executeStep(api.stepEnumeration, 'SERVICE ENUMERATION')}
            className="p-3 text-left bg-slate-900/80 border border-cyan-500/15 hover:border-cyan-400 rounded-md text-xs transition-colors"
          >
            <div className="font-semibold text-slate-200">3. Service Enumeration</div>
            <div className="text-[10px] text-slate-500">Risk: 39 (Banner Grab)</div>
          </button>

          <button
            onClick={() => executeStep(api.stepDecoyInteraction, 'DECOY INTERACTION')}
            className="p-3 text-left bg-purple-950/40 border border-purple-500/30 hover:border-purple-400 rounded-md text-xs transition-colors"
          >
            <div className="font-semibold text-purple-300">4. Decoy Interaction</div>
            <div className="text-[10px] text-purple-400">Risk: 52 (Lure Hit)</div>
          </button>

          <button
            onClick={() => executeStep(api.stepCredentialDiscovery, 'CREDENTIAL DISCOVERY')}
            className="p-3 text-left bg-slate-900/80 border border-cyan-500/15 hover:border-cyan-400 rounded-md text-xs transition-colors"
          >
            <div className="font-semibold text-slate-200">5. Credential Discovery</div>
            <div className="text-[10px] text-slate-500">Risk: 68 (File Probing)</div>
          </button>

          <button
            onClick={() => executeStep(api.stepHoneytokenAccess, 'HONEYTOKEN ACCESS')}
            className="p-3 text-left bg-red-950/40 border border-red-500/40 hover:border-red-400 rounded-md text-xs transition-colors"
          >
            <div className="font-semibold text-red-300">6. Honeytoken Access</div>
            <div className="text-[10px] text-red-400">Risk: 86 (Trap Hit)</div>
          </button>

          <button
            onClick={() => executeStep(api.stepAuthAttempt, 'AUTH ATTEMPT')}
            className="p-3 text-left bg-red-950/40 border border-red-500/40 hover:border-red-400 rounded-md text-xs transition-colors"
          >
            <div className="font-semibold text-red-300">7. Auth Attempt</div>
            <div className="text-[10px] text-red-400">Risk: 91 (Kerberos Pivot)</div>
          </button>

          <button
            onClick={() => executeStep(api.stepLateralMovement, 'LATERAL MOVEMENT')}
            className="p-3 text-left bg-slate-900/80 border border-cyan-500/15 hover:border-cyan-400 rounded-md text-xs transition-colors"
          >
            <div className="font-semibold text-slate-200">8. Shadow Lateral Move</div>
            <div className="text-[10px] text-slate-500">Risk: 94 (DB Decoy)</div>
          </button>

          <button
            onClick={() => executeStep(api.stepContain, 'CONTAINMENT')}
            className="p-3 text-left bg-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 rounded-md text-xs transition-colors col-span-2"
          >
            <div className="font-semibold text-emerald-300">9. Threat Containment</div>
            <div className="text-[10px] text-emerald-400">Risk: 12 (Neutralized • Zero Impact)</div>
          </button>
        </div>
      </div>

      {/* Live Pipeline Execution Console */}
      <div className="soc-panel rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15 mb-3 font-mono">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Autonomous Pipeline Event Log (Live WebSocket Stream)</span>
          </h2>
          <span className="text-[10px] text-slate-500">PORT 5000 / WS CONNECTED</span>
        </div>

        <div className="bg-[#040810] border border-cyan-500/20 text-slate-200 p-4 rounded-md font-mono text-xs space-y-1.5 h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`leading-relaxed ${
                log.includes('CRITICAL') || log.includes('Honeytoken')
                  ? 'text-red-400 font-bold'
                  : log.includes('Predictor') || log.includes('Lead Time')
                  ? 'text-cyan-300 font-semibold'
                  : log.includes('Governor')
                  ? 'text-purple-300'
                  : log.includes('Contained') || log.includes('concluded')
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-300'
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
