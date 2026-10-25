import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { Compass, Key, Database, Cloud, Code, DollarSign, ShieldAlert, Cpu } from 'lucide-react';
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

export const CuriosityEnginePage: React.FC = () => {
  const [curiosity, setCuriosity] = useState<any>({
    credentialsScore: 91,
    databaseScore: 78,
    cloudSecretsScore: 61,
    sourceCodeScore: 43,
    financialScore: 24,
    authInfraScore: 88,
    primaryInterest: 'Credentials & Auth Infrastructure',
    evidenceReason:
      'Session SH-104 repeatedly targeted Kerberos SPNs, LDAP queries, and fake credential honeytoken files.',
  });

  const fetchCuriosity = async () => {
    try {
      const res = await api.getSession('SH-104');
      if (res.data?.curiosityProfile) {
        setCuriosity(res.data.curiosityProfile);
      }
    } catch (e) {
      console.warn('Using baseline curiosity from DB seed');
    }
  };

  useEffect(() => {
    fetchCuriosity();
  }, []);

  useSocket({
    'curiosity:update': (data: any) => {
      setCuriosity(data);
    },
  });

  const curiosityMetrics = [
    { name: 'Credentials', score: curiosity.credentialsScore, icon: Key, color: '#EF4444', desc: 'Focus on administrative passwords and hash extraction' },
    { name: 'Auth Systems', score: curiosity.authInfraScore, icon: ShieldAlert, color: '#F97316', desc: 'Active Directory and Kerberos domain controller probes' },
    { name: 'Databases', score: curiosity.databaseScore, icon: Database, color: '#F59E0B', desc: 'SQL schema discovery and customer table exfiltration attempts' },
    { name: 'Cloud Secrets', score: curiosity.cloudSecretsScore, icon: Cloud, color: '#3B82F6', desc: 'AWS IAM access keys and metadata API endpoints' },
    { name: 'Source Code', score: curiosity.sourceCodeScore, icon: Code, color: '#A855F7', desc: 'Git repository discovery and CI/CD token harvesting' },
    { name: 'Financial Data', score: curiosity.financialScore, icon: DollarSign, color: '#10B981', desc: 'Financial spreadsheet access and ERP database sweeps' },
  ];

  return (
    <div className="space-y-4 max-w-[1720px] mx-auto pb-8">
      {/* Header */}
      <div className="soc-panel rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              Adversary Curiosity Engine
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Calculates real-time intent and interest across 6 key enterprise dimensions based on observed query
            dwell times, target service types, and payload patterns.
          </p>
        </div>

        <div className="bg-[#09101F] border border-cyan-500/30 rounded-lg p-2.5 px-4 text-right">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Primary Focus</div>
          <div className="text-base font-bold font-mono text-red-400">Credentials ({curiosity.credentialsScore}%)</div>
          <div className="text-[9px] text-slate-500 font-mono">Drives Targeted Decoy Selection</div>
        </div>
      </div>

      {/* 6 Dimensions Progress Bars & Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {curiosityMetrics.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="soc-panel rounded-lg p-4 space-y-3 hover:border-cyan-400/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-7 h-7 rounded flex items-center justify-center border"
                    style={{ backgroundColor: `${item.color}15`, borderColor: `${item.color}40`, color: item.color }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-xs text-white">{item.name}</span>
                </div>
                <span className="text-base font-bold font-mono" style={{ color: item.color }}>
                  {item.score}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.score}%`, backgroundColor: item.color }}
                />
              </div>

              <div className="text-[10px] text-slate-400 font-mono">{item.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Recharts Bar Visualization */}
      <div className="soc-panel rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Curiosity Distribution Vector (Session SH-104)
          </h2>
          <span className="text-xs font-mono text-cyan-400">Deterministic Mathematical Algorithm</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={curiosityMetrics}>
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
                {curiosityMetrics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-3 bg-[#09101F] border border-cyan-500/20 rounded text-xs font-mono text-slate-300">
          <span className="text-cyan-400 font-bold block mb-1">Adaptive Deception Strategy:</span>
          Adversary curiosity in Credentials (91%) and Authentication Systems (88%) triggered deployment of
          <strong> AUTH-DECOY-07</strong> and injected synthetic <strong>admin_backup_password.txt</strong>.
        </div>
      </div>
    </div>
  );
};
