import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import {
  Database,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ArrowRight,
  Radio,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ThreatSession {
  id: string;
  sessionCode: string;
  sourceIp: string;
  currentStage: string;
  riskScore: number;
  isDiverted: boolean;
  status: 'ACTIVE' | 'DIVERTED' | 'CONTAINED';
  targetAsset: string;
  dwellTime: string;
  eventsCount: number;
}

export const SessionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ThreatSession[]>([
    {
      id: 'ses-1',
      sessionCode: 'SH-104',
      sourceIp: '192.168.1.45',
      currentStage: 'Credential Access',
      riskScore: 91,
      isDiverted: true,
      status: 'CONTAINED',
      targetAsset: 'AUTH-SRV-01 → AUTH-DECOY-07',
      dwellTime: '7m 14s',
      eventsCount: 20,
    },
    {
      id: 'ses-2',
      sessionCode: 'SH-105',
      sourceIp: '198.51.100.23',
      currentStage: 'Reconnaissance',
      riskScore: 42,
      isDiverted: false,
      status: 'ACTIVE',
      targetAsset: 'WEB-SRV-01',
      dwellTime: '2m 10s',
      eventsCount: 8,
    },
    {
      id: 'ses-3',
      sessionCode: 'SH-102',
      sourceIp: '203.0.113.88',
      currentStage: 'Lateral Movement Attempt',
      riskScore: 84,
      isDiverted: true,
      status: 'CONTAINED',
      targetAsset: 'DB-PROD-01 → DB-DECOY-03',
      dwellTime: '15m 32s',
      eventsCount: 34,
    },
    {
      id: 'ses-4',
      sessionCode: 'SH-101',
      sourceIp: '198.51.100.4',
      currentStage: 'Service Enumeration',
      riskScore: 55,
      isDiverted: true,
      status: 'CONTAINED',
      targetAsset: 'SSH-SRV-01 → SSH-DECOY-01',
      dwellTime: '11m 45s',
      eventsCount: 19,
    },
  ]);

  useSocket({
    'session:contained': (data: any) => {
      setSessions((prev) =>
        prev.map((s) => (s.sessionCode === data.sessionId ? { ...s, status: 'CONTAINED' } : s))
      );
    },
  });

  const handleContain = async (code: string) => {
    try {
      await api.containSession(code);
      setSessions((prev) =>
        prev.map((s) => (s.sessionCode === code ? { ...s, status: 'CONTAINED' } : s))
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4 max-w-[1720px] mx-auto pb-8">
      {/* Header */}
      <div className="soc-panel rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              Threat Sessions & Quarantine Management
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Correlated session tracking showing real-time dwell times, diversion to deception shadow network,
            and cryptographic session containment.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded">
            {sessions.filter((s) => s.status === 'CONTAINED').length} Contained Sessions
          </span>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="soc-panel rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0A1122] text-slate-400 border-b border-cyan-500/20">
              <tr>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Session ID</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Source IP</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Target Asset / Path</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Current Stage</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Dwell Time</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Risk</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Status</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {sessions.map((ses) => (
                <tr key={ses.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-cyan-400">{ses.sessionCode}</td>
                  <td className="py-3 px-4 text-slate-300">{ses.sourceIp}</td>
                  <td className="py-3 px-4 font-medium text-slate-200">
                    <span className="flex items-center space-x-1">
                      <span>{ses.targetAsset}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{ses.currentStage}</td>
                  <td className="py-3 px-4 text-slate-400">{ses.dwellTime}</td>
                  <td className="py-3 px-4 font-bold font-mono">
                    <span className={ses.riskScore >= 80 ? 'text-red-400' : 'text-amber-400'}>
                      {ses.riskScore}/100
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                        ses.status === 'CONTAINED'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : ses.status === 'DIVERTED'
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                          : 'bg-red-500/20 text-red-400 border-red-500/40'
                      }`}
                    >
                      {ses.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => navigate('/intelligence')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold"
                    >
                      Inspect
                    </button>
                    {ses.status !== 'CONTAINED' && (
                      <button
                        onClick={() => handleContain(ses.sessionCode)}
                        className="px-2 py-1 rounded bg-red-950/80 border border-red-500/40 text-red-300 text-[10px] font-bold hover:bg-red-900"
                      >
                        Contain
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
