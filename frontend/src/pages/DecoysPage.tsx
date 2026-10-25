import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import {
  Radio,
  Shield,
  Layers,
  Terminal,
  Database,
  Key,
  Globe,
  FileCode,
  FileText,
  Play,
  Square,
  Activity,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DecoyItem {
  id: string;
  name: string;
  type: string;
  hostname: string;
  ip: string;
  status: 'ARMED' | 'ENGAGED' | 'STANDBY';
  interactions: number;
  sessions: number;
  effectiveness: number;
  evidenceCaptured: number;
  lastActivity: string;
  port: number;
  syntheticRole: string;
}

export const DecoysPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDecoy, setSelectedDecoy] = useState<DecoyItem | null>(null);

  const [decoys, setDecoys] = useState<DecoyItem[]>([
    {
      id: 'dec-1',
      name: 'Authentication Decoy',
      type: 'AUTH_DECOY',
      hostname: 'AUTH-DECOY-07',
      ip: '10.0.4.15',
      status: 'ENGAGED',
      interactions: 42,
      sessions: 3,
      effectiveness: 94,
      evidenceCaptured: 12,
      lastActivity: '2 mins ago',
      port: 88,
      syntheticRole: 'Fake Active Directory & Kerberos KDC',
    },
    {
      id: 'dec-2',
      name: 'SSH Honeypot Decoy',
      type: 'SSH_DECOY',
      hostname: 'SSH-DECOY-01',
      ip: '10.0.5.10',
      status: 'ARMED',
      interactions: 128,
      sessions: 9,
      effectiveness: 88,
      evidenceCaptured: 34,
      lastActivity: '14 mins ago',
      port: 22,
      syntheticRole: 'Emulated OpenSSH server with synthetic root user',
    },
    {
      id: 'dec-3',
      name: 'Database Decoy',
      type: 'DB_DECOY',
      hostname: 'DB-DECOY-03',
      ip: '10.0.2.18',
      status: 'ARMED',
      interactions: 19,
      sessions: 2,
      effectiveness: 91,
      evidenceCaptured: 8,
      lastActivity: '1 hour ago',
      port: 5432,
      syntheticRole: 'Synthetic PostgreSQL container with fake customer schemas',
    },
    {
      id: 'dec-4',
      name: 'Web Portal Decoy',
      type: 'WEB_DECOY',
      hostname: 'WEB-DECOY-02',
      ip: '10.0.1.25',
      status: 'ARMED',
      interactions: 210,
      sessions: 14,
      effectiveness: 85,
      evidenceCaptured: 56,
      lastActivity: '32 mins ago',
      port: 443,
      syntheticRole: 'Fake corporate login gateway with synthetic cookies',
    },
    {
      id: 'dec-5',
      name: 'File Store Decoy',
      type: 'FILE_DECOY',
      hostname: 'FILE-DECOY-05',
      ip: '10.0.3.30',
      status: 'ARMED',
      interactions: 35,
      sessions: 4,
      effectiveness: 96,
      evidenceCaptured: 15,
      lastActivity: '5 mins ago',
      port: 445,
      syntheticRole: 'SMB share containing honeytoken documents',
    },
    {
      id: 'dec-6',
      name: 'API Gateway Decoy',
      type: 'API_DECOY',
      hostname: 'API-DECOY-01',
      ip: '10.0.1.99',
      status: 'ARMED',
      interactions: 88,
      sessions: 5,
      effectiveness: 89,
      evidenceCaptured: 22,
      lastActivity: '45 mins ago',
      port: 8080,
      syntheticRole: 'Synthetic REST API endpoints with fake JWT verification',
    },
    {
      id: 'dec-7',
      name: 'Admin Portal Decoy',
      type: 'ADMIN_DECOY',
      hostname: 'ADMIN-DECOY-04',
      ip: '10.0.4.90',
      status: 'STANDBY',
      interactions: 6,
      sessions: 1,
      effectiveness: 92,
      evidenceCaptured: 3,
      lastActivity: '3 hours ago',
      port: 8443,
      syntheticRole: 'Fake internal IT administration dashboard',
    },
  ]);

  useSocket({
    'decoy:activated': (data: any) => {
      setDecoys((prev) =>
        prev.map((d) => (d.hostname === data.hostname ? { ...d, status: 'ENGAGED' } : d))
      );
    },
  });

  const toggleStatus = (id: string) => {
    setDecoys((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: d.status === 'ENGAGED' || d.status === 'ARMED' ? 'STANDBY' : 'ARMED',
            }
          : d
      )
    );
  };

  return (
    <div className="space-y-4 max-w-[1720px] mx-auto pb-8">
      {/* Header */}
      <div className="soc-panel rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-purple-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              Adaptive Deception Lab & Decoy Systems
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Synthetic reality honeynets deployed in parallel to production. Diverts threat sessions away
            from real enterprise assets while capturing cryptographic forensic proof.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded font-semibold">
            {decoys.filter((d) => d.status !== 'STANDBY').length} Active Decoys
          </span>
        </div>
      </div>

      {/* Decoys Grid matching Section 28 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decoys.map((decoy) => (
          <div
            key={decoy.id}
            className={`soc-panel rounded-lg p-4 space-y-3 transition-all ${
              decoy.status === 'ENGAGED'
                ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'hover:border-cyan-400/50'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/15">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                  {decoy.hostname}
                </span>
                <h3 className="text-sm font-bold text-white">{decoy.name}</h3>
              </div>

              <span
                className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                  decoy.status === 'ENGAGED'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500 animate-pulse'
                    : decoy.status === 'ARMED'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                • {decoy.status}
              </span>
            </div>

            <div className="text-[11px] text-slate-300 font-mono">{decoy.syntheticRole}</div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-[#09101F] p-2.5 rounded border border-cyan-500/15">
              <div>
                <span className="text-slate-500 block">Interactions:</span>
                <span className="text-white font-bold">{decoy.interactions}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Threat Sessions:</span>
                <span className="text-cyan-400 font-bold">{decoy.sessions}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Effectiveness:</span>
                <span className="text-emerald-400 font-bold">{decoy.effectiveness}%</span>
              </div>
              <div>
                <span className="text-slate-500 block">Evidence Logs:</span>
                <span className="text-purple-300 font-bold">{decoy.evidenceCaptured} records</span>
              </div>
            </div>

            <div className="text-[9px] font-mono text-slate-500 flex justify-between">
              <span>Port: {decoy.port}</span>
              <span>Last Activity: {decoy.lastActivity}</span>
            </div>

            {/* Controls matching Section 28: ACTIVATE, DEACTIVATE, INSPECT, VIEW SESSION */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                onClick={() => toggleStatus(decoy.id)}
                className={`py-1 text-[10px] font-mono font-bold rounded border transition-colors ${
                  decoy.status === 'STANDBY'
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                {decoy.status === 'STANDBY' ? 'ACTIVATE' : 'DEACTIVATE'}
              </button>
              <button
                onClick={() => setSelectedDecoy(decoy)}
                className="py-1 bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/60 text-[10px] font-mono font-bold rounded"
              >
                INSPECT
              </button>
              <button
                onClick={() => navigate('/intelligence')}
                className="py-1 bg-purple-950/60 text-purple-300 border border-purple-500/40 hover:bg-purple-900/60 text-[10px] font-mono font-bold rounded"
              >
                SESSION
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Decoy Modal */}
      {selectedDecoy && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#09101F] border border-cyan-500/50 rounded-lg max-w-lg w-full p-5 shadow-[0_0_25px_rgba(0,240,255,0.25)] space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                  Decoy Forensic Configuration
                </span>
                <h3 className="text-base font-bold text-white font-mono">{selectedDecoy.name}</h3>
              </div>
              <button
                onClick={() => setSelectedDecoy(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Virtual Hostname:</span>
                <span className="text-white font-bold">{selectedDecoy.hostname}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Shadow IP:</span>
                <span className="text-cyan-400">{selectedDecoy.ip}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Simulated Role:</span>
                <span className="text-slate-200">{selectedDecoy.syntheticRole}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Deception Effectiveness:</span>
                <span className="text-emerald-400 font-bold">{selectedDecoy.effectiveness}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Forensic Records Captured:</span>
                <span className="text-purple-300 font-bold">{selectedDecoy.evidenceCaptured}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/90 border border-cyan-500/20 rounded font-mono text-[10px] text-cyan-300">
              $ docker ps | grep {selectedDecoy.hostname.toLowerCase()}
              <br />
              UP 14 hours (healthy) • Port 0.0.0.0:{selectedDecoy.port}-&gt;{selectedDecoy.port}/tcp
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedDecoy(null);
                  navigate('/shadow-network');
                }}
                className="py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-900 text-xs font-mono font-bold rounded"
              >
                VIEW ON SHADOW NETWORK
              </button>
              <button
                onClick={() => setSelectedDecoy(null)}
                className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold rounded"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
