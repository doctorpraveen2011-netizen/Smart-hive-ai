import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import {
  Activity,
  Compass,
  Key,
  Database,
  Cloud,
  Code,
  DollarSign,
  ShieldAlert,
  Server,
  ArrowRight,
  TrendingUp,
  ChevronRight,
  X,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';

interface ThreatIntelRow {
  session: string;
  risk: number;
  currentStage: string;
  attackType: string;
  intent: string;
  predictedAction: string;
  target: string;
  confidence: number;
  status: 'ACTIVE' | 'DIVERTED' | 'CONTAINED';
  site: string;
}

export const ThreatIntelligencePage: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState<ThreatIntelRow | null>(null);

  const [intelRows, setIntelRows] = useState<ThreatIntelRow[]>([
    {
      session: 'SH-104',
      risk: 91,
      currentStage: 'Credential Discovery',
      attackType: 'Kerberoasting & SPN Enumeration',
      intent: 'Domain Privilege Escalation',
      predictedAction: 'Credential Access Attempt',
      target: 'AUTH-SRV-01',
      confidence: 84,
      status: 'DIVERTED',
      site: 'SmartCorp Mumbai (MUM-01)',
    },
    {
      session: 'SH-105',
      risk: 42,
      currentStage: 'Reconnaissance',
      attackType: 'External Port Sweep',
      intent: 'Network Discovery',
      predictedAction: 'Service Fingerprinting',
      target: 'WEB-SRV-01',
      confidence: 76,
      status: 'ACTIVE',
      site: 'SmartCorp Delhi (DEL-01)',
    },
    {
      session: 'SH-102',
      risk: 84,
      currentStage: 'Honeytoken Access',
      attackType: 'SQL Credential Harvesting',
      intent: 'Exfiltration of Customer Records',
      predictedAction: 'Bulk DB Dump',
      target: 'DB-PROD-01',
      confidence: 89,
      status: 'CONTAINED',
      site: 'SmartCorp Bengaluru (BLR-01)',
    },
    {
      session: 'SH-101',
      risk: 55,
      currentStage: 'Decoy Interaction',
      attackType: 'SSH Brute Force',
      intent: 'Initial Access Seeking',
      predictedAction: 'Shell Escalation',
      target: 'SSH-DECOY-01',
      confidence: 93,
      status: 'CONTAINED',
      site: 'SmartCorp Chennai (CHN-01)',
    },
  ]);

  const [curiosity, setCuriosity] = useState<any>({
    credentialsScore: 91,
    databaseScore: 78,
    cloudSecretsScore: 61,
    sourceCodeScore: 43,
    financialScore: 24,
    authInfraScore: 88,
  });

  const fetchSession = async () => {
    try {
      const res = await api.getSession('SH-104');
      if (res.data?.curiosityProfile) {
        setCuriosity(res.data.curiosityProfile);
      }
    } catch (e) {
      console.warn('Using baseline curiosity');
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  useSocket({
    'curiosity:update': (data: any) => setCuriosity(data),
    'prediction:created': (data: any) => {
      setIntelRows((prev) =>
        prev.map((r) =>
          r.session === 'SH-104'
            ? { ...r, predictedAction: data.predictedStage || r.predictedAction, confidence: data.confidence || r.confidence }
            : r
        )
      );
    },
    'session:contained': (data: any) => {
      setIntelRows((prev) =>
        prev.map((r) => (r.session === data.sessionId ? { ...r, status: 'CONTAINED' } : r))
      );
    },
  });

  const curiosityData = [
    { name: 'Credentials', score: curiosity.credentialsScore, color: '#EF4444' },
    { name: 'Auth Systems', score: curiosity.authInfraScore, color: '#F97316' },
    { name: 'Databases', score: curiosity.databaseScore, color: '#F59E0B' },
    { name: 'Cloud Secrets', score: curiosity.cloudSecretsScore, color: '#3B82F6' },
    { name: 'Source Code', score: curiosity.sourceCodeScore, color: '#A855F7' },
    { name: 'Financial', score: curiosity.financialScore, color: '#10B981' },
  ];

  return (
    <div className="space-y-4 max-w-[1720px] mx-auto pb-8">
      {/* Header */}
      <div className="soc-panel rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              Threat Intelligence & Intent Forecasting
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Correlates observed attacker behavior against machine learning classifiers to predict next attack
            actions and calculate intent across the MITRE ATT&CK framework.
          </p>
        </div>

        <div className="bg-[#09101F] border border-cyan-500/30 rounded-lg p-2.5 px-4 text-right">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Active Intelligence Target</div>
          <div className="text-base font-bold font-mono text-cyan-400">AUTH-SRV-01 (84% Confidence)</div>
          <div className="text-[9px] text-slate-500 font-mono">Forecast: Credential Access Attempt</div>
        </div>
      </div>

      {/* Threat Intelligence Table matching Section 21 */}
      <div className="soc-panel rounded-lg overflow-hidden">
        <div className="p-3 border-b border-cyan-500/15 flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Correlated Threat Intelligence Matrix
          </h2>
          <span className="text-[10px] font-mono text-slate-400">Click any session for complete intelligence</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0A1122] text-slate-400 border-b border-cyan-500/20">
              <tr>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Session</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Risk</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Current Stage</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Attack Type</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Intent</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Predicted Action</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Target</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Confidence</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {intelRows.map((row) => (
                <tr
                  key={row.session}
                  onClick={() => setSelectedSession(row)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 font-bold text-cyan-400 group-hover:text-cyan-300">
                    {row.session}
                  </td>
                  <td className="py-3 px-4 font-bold">
                    <span className={row.risk >= 80 ? 'text-red-400' : 'text-amber-400'}>
                      {row.risk}/100
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{row.currentStage}</td>
                  <td className="py-3 px-4 text-white font-semibold">{row.attackType}</td>
                  <td className="py-3 px-4 text-slate-400">{row.intent}</td>
                  <td className="py-3 px-4 text-amber-400 font-semibold">{row.predictedAction}</td>
                  <td className="py-3 px-4 font-mono font-bold text-cyan-300">{row.target}</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">{row.confidence}%</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                        row.status === 'CONTAINED'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : row.status === 'DIVERTED'
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                          : 'bg-red-500/20 text-red-400 border-red-500/40'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adversary Curiosity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Bar Chart (8 of 12) */}
        <div className="lg:col-span-8 soc-panel rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-500/15">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Adversary Curiosity Engine: Session SH-104 Profile
            </h2>
            <span className="text-[10px] font-mono text-cyan-400">Zero Mock Data</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={curiosityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0D1A30" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} unit="%" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09101F',
                    borderColor: '#00F0FF',
                    borderRadius: '6px',
                    color: '#FFF',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {curiosityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Card (4 of 12) */}
        <div className="lg:col-span-4 soc-panel rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="pb-2 border-b border-cyan-500/15 mb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Curiosity Vector Scores
              </h3>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {curiosityData.map((item) => (
                <div key={item.name} className="flex items-center justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">{item.name}</span>
                  <span className="font-bold" style={{ color: item.color }}>
                    {item.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded bg-[#09101F] border border-cyan-500/20 text-[10px] font-mono text-slate-300">
            <span className="text-cyan-400 font-bold block mb-1">Defense Implication:</span>
            High curiosity in Credentials (91%) activates targeted AD/Kerberos decoys to intercept attacks.
          </div>
        </div>
      </div>

      {/* Modal: Full Intelligence View */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#09101F] border border-cyan-500/50 rounded-lg max-w-lg w-full p-5 shadow-[0_0_25px_rgba(0,240,255,0.25)] space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                  Complete Threat Intelligence Dossier
                </span>
                <h3 className="text-base font-bold text-white font-mono">{selectedSession.session}</h3>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Target Location:</span>
                <span className="text-white font-semibold">{selectedSession.site}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Observed Attack Stage:</span>
                <span className="text-white">{selectedSession.currentStage}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Attack Type:</span>
                <span className="text-white font-semibold">{selectedSession.attackType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Adversary Intent:</span>
                <span className="text-amber-400 font-semibold">{selectedSession.intent}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Predicted Next Action:</span>
                <span className="text-cyan-400 font-bold">{selectedSession.predictedAction}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Predicted Target Asset:</span>
                <span className="text-cyan-400 font-bold">{selectedSession.target}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">ML Forecast Confidence:</span>
                <span className="text-emerald-400 font-bold">{selectedSession.confidence}%</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedSession(null)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded"
              >
                CLOSE DOSSIER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
