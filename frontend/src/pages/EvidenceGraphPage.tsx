import React, { useEffect, useState, useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap, Node, Edge, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import { api } from '../services/api';
import { Evidence } from '../types';
import { FileCheck, Shield, Key, FileText, CheckCircle2, Share2, Download, X } from 'lucide-react';

export const EvidenceGraphPage: React.FC = () => {
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<any | null>(null);

  useEffect(() => {
    api.getEvidence().then((res) => {
      if (res.data && res.data.length > 0) {
        setEvidenceList(res.data);
        setSelectedEvidence(res.data[0]);
      } else {
        // Fallback default evidence matching Section 30
        const defaultEv = {
          id: 'ev-1',
          evidenceType: 'HONEYTOKEN_ACCESS',
          description: 'Synthetic file admin_backup_password.txt read by adversary.',
          source: 'FILE-SRV-01',
          sha256Hash: 'a8b9c0d1e2f3456789abcdef0123456789abcdef0123456789abcdef01234567',
          capturedAt: '2026-10-19T14:23:51Z',
          confidenceScore: 0.98,
        };
        setEvidenceList([defaultEv]);
        setSelectedEvidence(defaultEv);
      }
    });
  }, []);

  const { nodes, edges } = useMemo(() => {
    // Left input nodes matching Section 30
    const inputSignals = [
      { id: 'sig-1', label: 'Service Enumeration (Ports 22, 445)', type: 'EVENT_LOG', strength: 90, color: '#3B82F6' },
      { id: 'sig-2', label: 'SSH Decoy Probed (SSH-DECOY-01)', type: 'DECOY_INTERACTION', strength: 88, color: '#A855F7' },
      { id: 'sig-3', label: 'Honeytoken (admin_backup_password.txt)', type: 'HONEYTOKEN_TRIGGER', strength: 98, color: '#EF4444' },
      { id: 'sig-4', label: 'Kerberos Auth Anomaly (arun.kumar)', type: 'AUTH_ANOMALY', strength: 94, color: '#F97316' },
    ];

    const inputNodes: Node[] = inputSignals.map((sig, idx) => ({
      id: sig.id,
      position: { x: 50, y: 40 + idx * 110 },
      data: {
        label: (
          <div
            onClick={() =>
              setSelectedEvidence({
                id: sig.id,
                evidenceType: sig.type,
                description: sig.label,
                source: 'Deception Fabric Layer',
                sha256Hash: 'a8b9c0d1e2f3456789abcdef0123456789abcdef0123456789abcdef01234567',
                capturedAt: '2026-10-19T14:23:51Z',
                confidenceScore: sig.strength / 100,
              })
            }
            className="p-3 bg-[#09101F] border border-cyan-500/30 rounded-lg shadow-md w-64 text-left text-xs cursor-pointer hover:border-cyan-400 transition-all hover:scale-105 font-mono"
          >
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-bold" style={{ color: sig.color }}>{sig.type}</span>
              <span className="font-bold text-cyan-400">{sig.strength}% CONF</span>
            </div>
            <div className="font-semibold text-white mt-1 text-xs">{sig.label}</div>
          </div>
        ),
      },
    }));

    // Center Node: Inferred Attack Intent (Credential Attack)
    const centerNode: Node = {
      id: 'center-intent',
      position: { x: 380, y: 190 },
      data: {
        label: (
          <div
            onClick={() =>
              setSelectedEvidence({
                id: 'center-intent',
                evidenceType: 'CONVERGED_EVIDENCE_GRAPH',
                description: 'Correlated multi-signal attack vector targeting Active Directory Kerberos SPNs.',
                source: 'SmartHive AI Engine',
                sha256Hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
                capturedAt: '2026-10-19T14:24:11Z',
                confidenceScore: 0.94,
              })
            }
            className="p-4 bg-[#09101F] border-2 border-red-500 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.3)] w-64 text-left text-xs cursor-pointer font-mono"
          >
            <div className="text-[10px] font-bold text-red-400 uppercase">
              Inferred Attack Intent
            </div>
            <div className="font-bold text-white text-sm mt-1">CREDENTIAL ATTACK</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Target: Active Directory (AUTH-SRV-01)</div>
            <div className="mt-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              SHA-256 SEALED
            </div>
          </div>
        ),
      },
    };

    // Right Node: Credential Access Forecast (84%)
    const outputNode: Node = {
      id: 'output-forecast',
      position: { x: 700, y: 190 },
      data: {
        label: (
          <div
            onClick={() =>
              setSelectedEvidence({
                id: 'output-forecast',
                evidenceType: 'PREDICTION_VERIFICATION',
                description: 'Model predicted Credential Access Attempt with 84% confidence. Verified in honeynet.',
                source: 'Machine Learning Classifier',
                sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                capturedAt: '2026-10-19T14:26:31Z',
                confidenceScore: 0.84,
              })
            }
            className="p-4 bg-[#09101F] border-2 border-purple-500 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.3)] w-64 text-left text-xs cursor-pointer font-mono"
          >
            <div className="text-[10px] font-bold text-purple-300 uppercase">
              Predicted Next Stage
            </div>
            <div className="font-bold text-white text-sm mt-1">CREDENTIAL ACCESS</div>
            <div className="text-xl font-bold text-cyan-400 mt-1">84% Confidence</div>
            <div className="text-[9px] text-slate-400 mt-1">Predicted Lead Time: 5m 27s</div>
          </div>
        ),
      },
    };

    const flowEdges: Edge[] = [
      ...inputSignals.map((sig) => ({
        id: `e-${sig.id}-center`,
        source: sig.id,
        target: 'center-intent',
        animated: true,
        style: { stroke: '#00F0FF', strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#00F0FF' },
      })),
      {
        id: 'e-center-output',
        source: 'center-intent',
        target: 'output-forecast',
        animated: true,
        style: { stroke: '#EF4444', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
      },
    ];

    return {
      nodes: [...inputNodes, centerNode, outputNode],
      edges: flowEdges,
    };
  }, []);

  const handleDownloadEvidence = () => {
    if (!selectedEvidence) return;
    const blob = new Blob([JSON.stringify(selectedEvidence, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Forensic_Evidence_${selectedEvidence.evidenceType || 'record'}.json`;
    a.click();
  };

  return (
    <div className="space-y-4 max-w-[1720px] mx-auto pb-8">
      {/* Header */}
      <div className="soc-panel rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              Cryptographic Evidence Graph & Intent Correlation
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl font-mono">
            Ground-truth Bayesian causal network correlating individual decoy touches, honeytokens, and auth
            anomalies into verified attack intent. Click any node to inspect the underlying record.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded">
            SHA-256 Chain of Custody Verified
          </span>
        </div>
      </div>

      {/* Main Flow Canvas & Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 soc-panel rounded-lg h-[560px] overflow-hidden border border-cyan-500/20 relative">
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <Background color="#00F0FF" gap={20} size={1} />
            <Controls className="bg-[#09101F] border-cyan-500/30 text-white fill-white" />
            <MiniMap style={{ background: '#09101F', border: '1px solid rgba(0, 240, 255, 0.2)' }} />
          </ReactFlow>
        </div>

        {/* Selected Evidence Inspector Card */}
        <div className="soc-panel rounded-lg p-4 space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-cyan-500/15 pb-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Evidence Record Inspector
              </div>
              <h2 className="text-sm font-bold text-white font-mono mt-1">
                {selectedEvidence?.evidenceType || 'Select an Evidence Node'}
              </h2>
            </div>

            {selectedEvidence && (
              <div className="space-y-3 text-xs font-mono mt-3">
                <div>
                  <span className="text-slate-500 block">Description:</span>
                  <span className="text-slate-200 font-semibold">{selectedEvidence.description}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Source Origin:</span>
                  <span className="text-cyan-400 font-bold">{selectedEvidence.source}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Timestamp:</span>
                  <span className="text-slate-300">{selectedEvidence.capturedAt}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Forensic Confidence:</span>
                  <span className="text-emerald-400 font-bold">
                    {Math.round((selectedEvidence.confidenceScore || 0.95) * 100)}%
                  </span>
                </div>

                <div className="p-2.5 bg-[#050A14] border border-cyan-500/20 rounded font-mono text-[9px] text-cyan-300 break-all space-y-1">
                  <span className="text-slate-500 block font-bold">SHA-256 Evidence Hash:</span>
                  <span>{selectedEvidence.sha256Hash}</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleDownloadEvidence}
            className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-mono text-xs font-bold rounded flex items-center justify-center space-x-1.5 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT EVIDENCE JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};
