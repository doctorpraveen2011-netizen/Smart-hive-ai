import React, { useEffect, useState, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { api } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { ThreatFuture } from '../types';
import { GitBranch, Sparkles, Shield, Zap, Layers, Lock, Eye, AlertTriangle } from 'lucide-react';

export const ThreatFuturesPage: React.FC = () => {
  const [futures, setFutures] = useState<ThreatFuture[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<ThreatFuture | null>(null);

  // Section 24: What-If Defense Simulator State
  const [activeDefense, setActiveDefense] = useState<'NO_ACTION' | 'AUTH_DECOY' | 'SHADOW_NETWORK' | 'INCREASE_MONITORING' | 'ISOLATION'>('AUTH_DECOY');

  const defenseScenarios = {
    NO_ACTION: {
      name: 'NO ACTION',
      riskScore: 78,
      compromiseProbability: 78,
      leadTime: '0s',
      color: '#EF4444',
      description: 'Adversary proceeds unabated against real AUTH-SRV-01. High likelihood of Kerberoasting and lateral movement.',
    },
    AUTH_DECOY: {
      name: 'AUTHENTICATION DECOY',
      riskScore: 31,
      compromiseProbability: 31,
      leadTime: '5m 27s',
      color: '#00F0FF',
      description: 'Deploy synthetic AUTH-DECOY-07 matching Curiosity Engine intent. Captures SPN tickets while preserving production.',
    },
    SHADOW_NETWORK: {
      name: 'SHADOW NETWORK DIVERSION',
      riskScore: 18,
      compromiseProbability: 18,
      leadTime: '8m 10s',
      color: '#A855F7',
      description: 'Autonomously divert all adversary TCP traffic into parallel honeynet fabric with synthetic Active Directory.',
    },
    INCREASE_MONITORING: {
      name: 'INCREASE MONITORING',
      riskScore: 54,
      compromiseProbability: 54,
      leadTime: '1m 45s',
      color: '#F59E0B',
      description: 'Increase event velocity recording and enable packet capture on perimeter. Passive defense only.',
    },
    ISOLATION: {
      name: 'SIMULATED SESSION ISOLATION',
      riskScore: 6,
      compromiseProbability: 6,
      leadTime: 'Immediate',
      color: '#10B981',
      description: 'Quarantine adversary session SH-104 and seal volatile evidence with cryptographic hashes.',
    },
  };

  const fetchFutures = async () => {
    try {
      const res = await api.getThreatFutures('SH-104');
      if (res.data) {
        setFutures(res.data);
        if (res.data.length > 0) setSelectedBranch(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFutures();
  }, []);

  useSocket({
    'futures:update': (data: any) => {
      if (data.branches) {
        setFutures(data.branches);
        if (data.branches.length > 0) setSelectedBranch(data.branches[0]);
      }
    },
  });

  const { nodes, edges } = useMemo(() => {
    const rootNode: Node = {
      id: 'root-node',
      type: 'default',
      position: { x: 50, y: 160 },
      data: {
        label: (
          <div className="p-3 text-left w-56 bg-[#0D1836] border-2 border-cyan-400 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                Current Observed Stage
              </span>
              <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-500/40">
                SH-104
              </span>
            </div>
            <div className="font-bold text-white text-xs mt-1">Credential Discovery</div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Asset: AUTH-SRV-01 • Risk: 86/100</div>
          </div>
        ),
      },
    };

    const branchNodes: Node[] = futures.map((f, idx) => {
      const yOffset = idx === 0 ? 40 : idx === 1 ? 160 : idx === 2 ? 280 : 400;
      const xOffset = f.branchDepth === 2 ? 650 : 360;

      return {
        id: f.id || `branch-${idx}`,
        position: { x: xOffset, y: yOffset },
        data: {
          label: (
            <div
              onClick={() => setSelectedBranch(f)}
              className={`p-3 text-left w-64 bg-[#09101F] border rounded-lg shadow-sm cursor-pointer transition-all hover:scale-105 ${
                f.probability >= 60
                  ? 'border-red-500/70 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                  : 'border-cyan-500/30 hover:border-cyan-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Probability
                </span>
                <span
                  className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    f.probability >= 60
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                  }`}
                >
                  {f.probability}%
                </span>
              </div>
              <div className="font-bold text-white text-xs mt-1 truncate">{f.branchName}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                Target: <span className="font-semibold text-cyan-300">{f.predictedTarget}</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800 text-[10px] font-mono">
                <span className="text-slate-500">Projected Risk:</span>
                <span className="font-bold text-red-400">{f.risk}/100</span>
              </div>
            </div>
          ),
        },
      };
    });

    const flowEdges: Edge[] = futures.map((f, idx) => {
      const sourceId = f.branchDepth === 2 ? (branchNodes[0]?.id || 'root-node') : 'root-node';
      return {
        id: `e-${sourceId}-${f.id || idx}`,
        source: sourceId,
        target: f.id || `branch-${idx}`,
        animated: f.probability >= 60,
        style: {
          stroke: f.probability >= 60 ? '#EF4444' : '#00F0FF',
          strokeWidth: f.probability >= 60 ? 2 : 1.5,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: f.probability >= 60 ? '#EF4444' : '#00F0FF',
        },
      };
    });

    return {
      nodes: [rootNode, ...branchNodes],
      edges: flowEdges,
    };
  }, [futures]);

  return (
    <div className="space-y-4 max-w-[1720px] mx-auto pb-8 font-sans">
      {/* Title Header */}
      <div className="soc-panel rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              Threat Futures Engine & What-If Defense Simulator
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl font-mono">
            Simulates multiple plausible future attack branches with calculated probabilities, projected target
            assets, and evidence-grounded risk trajectories.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-300 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Decision Graph Synchronized with Kaggle ML Model</span>
        </div>
      </div>

      {/* Main Flow Canvas & Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 soc-panel rounded-lg h-[520px] overflow-hidden border border-cyan-500/20 relative">
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <Background color="#00F0FF" gap={20} size={1} />
            <Controls className="bg-[#09101F] border-cyan-500/30 text-white fill-white" />
            <MiniMap style={{ background: '#09101F', border: '1px solid rgba(0, 240, 255, 0.2)' }} />
          </ReactFlow>
        </div>

        {/* Selected Branch Detail Card */}
        <div className="soc-panel rounded-lg p-4 space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-cyan-500/15 pb-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Branch Deep Dive
              </div>
              <h2 className="text-sm font-bold text-white mt-1">
                {selectedBranch?.branchName || 'Select a branch'}
              </h2>
            </div>

            {selectedBranch && (
              <div className="space-y-3 text-xs font-mono mt-3">
                <div>
                  <span className="text-slate-500 block">Calculated Probability:</span>
                  <span className="text-base font-bold text-cyan-400">
                    {selectedBranch.probability}%
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Predicted Stage:</span>
                  <span className="font-semibold text-slate-200">{selectedBranch.stage}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Predicted Target Asset:</span>
                  <span className="font-bold text-white">{selectedBranch.predictedTarget}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Projected Attack Risk:</span>
                  <span className="font-bold text-red-400">{selectedBranch.risk}/100</span>
                </div>

                <div className="p-3 bg-[#09101F] border border-cyan-500/20 rounded-md">
                  <span className="font-bold text-cyan-400 block mb-1">Supporting Telemetry Evidence:</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    {selectedBranch.supportingEvidence}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 24: WHAT-IF DEFENSE ENGINE */}
      <div className="soc-panel rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Counterfactual "What-If" Defense Engine (Section 24)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
            Simulated Defense Outcome
          </span>
        </div>

        {/* 5 Scenario Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
          {(Object.keys(defenseScenarios) as Array<keyof typeof defenseScenarios>).map((key) => {
            const sc = defenseScenarios[key];
            const isSelected = activeDefense === key;
            return (
              <button
                key={key}
                onClick={() => setActiveDefense(key)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-950/80 text-white border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                    : 'bg-[#09101F] text-slate-400 border-cyan-500/20 hover:text-slate-200'
                }`}
              >
                <div className="text-[10px] font-bold truncate">{sc.name}</div>
                <div className="text-base font-bold mt-1" style={{ color: sc.color }}>
                  {sc.compromiseProbability}%
                </div>
                <div className="text-[9px] text-slate-500">Risk Outcome</div>
              </button>
            );
          })}
        </div>

        {/* Selected Outcome Details Card */}
        <div className="bg-[#09101F] border border-cyan-500/30 rounded-lg p-4 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 uppercase font-bold">
              Simulation Strategy: <strong className="text-white">{defenseScenarios[activeDefense].name}</strong>
            </span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded border"
              style={{
                backgroundColor: `${defenseScenarios[activeDefense].color}20`,
                borderColor: `${defenseScenarios[activeDefense].color}60`,
                color: defenseScenarios[activeDefense].color,
              }}
            >
              Estimated Compromise: {defenseScenarios[activeDefense].compromiseProbability}%
            </span>
          </div>

          <p className="text-slate-300 leading-relaxed font-sans text-xs">
            {defenseScenarios[activeDefense].description}
          </p>

          <div className="flex justify-between items-center pt-1 text-[10px] text-slate-500">
            <span>Label: <strong>SIMULATED DEFENSE OUTCOME</strong></span>
            <span>Early Warning Advantage: <strong className="text-emerald-400">{defenseScenarios[activeDefense].leadTime}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
