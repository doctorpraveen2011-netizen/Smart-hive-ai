import React, { useEffect, useState, useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap, Node, Edge, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import { api } from '../services/api';
import { Asset } from '../types';
import { Cpu, Server, Shield, Database, Globe, Network, FileKey, X, Users } from 'lucide-react';

export const DigitalTwinPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getDigitalTwin()
      .then((res) => {
        setData(res.data);
        if (res.data?.assets?.length > 0) {
          setSelectedAsset(res.data.assets[1] || res.data.assets[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const { nodes, edges } = useMemo(() => {
    if (!data || !data.assets) return { nodes: [], edges: [] };

    const flowNodes: Node[] = data.assets.map((asset: Asset, idx: number) => {
      const col = idx % 4;
      const row = Math.floor(idx / 4);

      return {
        id: asset.id,
        position: { x: 50 + col * 260, y: 50 + row * 220 },
        data: {
          label: (
            <div
              onClick={() => setSelectedAsset(asset)}
              className={`p-3 text-left w-56 bg-[#09101F] border rounded-lg shadow-md cursor-pointer transition-all hover:scale-105 ${
                asset.hostname === 'AUTH-SRV-01'
                  ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                  : asset.hostname === 'DB-PROD-01'
                  ? 'border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                  : 'border-cyan-500/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  {asset.type}
                </span>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    asset.risk >= 70
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : asset.risk >= 30
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  Risk: {asset.risk}
                </span>
              </div>
              <div className="font-bold text-white text-xs mt-1 font-mono">{asset.hostname}</div>
              <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{asset.internalAddress}</div>
              <div className="text-[9px] text-slate-400 mt-1 truncate">
                {asset.site?.name || 'SmartCorp Site'}
              </div>
            </div>
          ),
        },
      };
    });

    const flowEdges: Edge[] = (data.relationships || []).map((rel: any, idx: number) => ({
      id: rel.id || `edge-${idx}`,
      source: rel.sourceAssetId,
      target: rel.targetAssetId,
      label: `${rel.protocol}:${rel.port}`,
      labelStyle: { fontSize: 9, fontFamily: 'monospace', fill: '#00F0FF' },
      animated: rel.protocol === 'KERBEROS' || rel.protocol === 'HTTPS',
      style: { stroke: '#00F0FF', strokeWidth: 1.5, opacity: 0.6 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#00F0FF' },
    }));

    return { nodes: flowNodes, edges: flowEdges };
  }, [data]);

  return (
    <div className="space-y-4 max-w-[1720px] mx-auto pb-8">
      {/* Header */}
      <div className="soc-panel rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              SmartHive Digital Twin — Enterprise Architecture & Reality Graph
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time digital twin representing SmartCorp assets, network dependencies, synthetic identities,
            and department personas across Chennai, Bengaluru, Mumbai, Delhi, and Hyderabad.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 bg-slate-900 border border-cyan-500/20 text-slate-300 rounded">
            8 Core Assets
          </span>
          <span className="px-2.5 py-1 bg-slate-900 border border-cyan-500/20 text-slate-300 rounded">
            5 Physical Sites
          </span>
        </div>
      </div>

      {/* Main Graph & Slide-out Asset Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 soc-panel rounded-lg h-[580px] overflow-hidden relative">
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <Background color="#00F0FF" gap={20} size={1} />
            <Controls className="bg-[#09101F] border-cyan-500/30 text-white fill-white" />
            <MiniMap
              nodeColor="#00F0FF"
              maskColor="rgba(6, 11, 20, 0.8)"
              className="bg-[#09101F] border border-cyan-500/30"
            />
          </ReactFlow>
        </div>

        {/* Asset Detail Drawer */}
        <div className="soc-panel rounded-lg p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Asset Inspection
                </div>
                <h2 className="text-sm font-bold text-white font-mono mt-0.5">
                  {selectedAsset?.hostname || 'Select Asset'}
                </h2>
              </div>
              {selectedAsset && (
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                    selectedAsset.sensitivity === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                  }`}
                >
                  {selectedAsset.sensitivity} SENSITIVITY
                </span>
              )}
            </div>

            {selectedAsset && (
              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-500">Asset Type:</span>
                  <span className="font-semibold text-slate-200">{selectedAsset.type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-500">Internal IP:</span>
                  <span className="font-mono text-cyan-400">{selectedAsset.internalAddress}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-500">Operating Site:</span>
                  <span className="font-medium text-slate-300">
                    {selectedAsset.site?.name || 'SmartCorp Mumbai'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-500">Current Risk Score:</span>
                  <span className="font-mono font-bold text-red-400">{selectedAsset.risk}/100</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-500">Deception Shadow State:</span>
                  <span className="font-bold text-purple-400">{selectedAsset.deceptionStatus}</span>
                </div>

                {/* Synthetic Reality Persona Tie-in */}
                <div className="mt-4 p-3 bg-[#09101F] border border-cyan-500/20 rounded-md space-y-2">
                  <div className="flex items-center space-x-1.5 font-bold text-white text-[11px]">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Synthetic Reality Persona (Consistency Graph)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 space-y-1">
                    <div>
                      Target Persona: <strong className="text-slate-200">Arun Kumar (Systems Admin)</strong>
                    </div>
                    <div>Department: Infrastructure Operations (Mumbai BKC)</div>
                    <div>Planted Lures: vpn_credentials.txt, admin_backup_password.txt</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
