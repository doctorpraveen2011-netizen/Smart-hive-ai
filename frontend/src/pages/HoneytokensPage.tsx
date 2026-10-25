import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import {
  FileKey,
  ShieldAlert,
  FileSpreadsheet,
  FileText,
  Database,
  Cloud,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Play,
  Terminal,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HoneytokenItem {
  id: string;
  filename: string;
  type: string;
  location: string;
  asset: string;
  status: 'ARMED' | 'TRIGGERED';
  triggersCount: number;
  lastTriggered?: string;
  sha256: string;
  syntheticPayload: string;
}

export const HoneytokensPage: React.FC = () => {
  const navigate = useNavigate();
  const [honeytokens, setHoneytokens] = useState<HoneytokenItem[]>([
    {
      id: 'ht-1',
      filename: 'admin_backup_password.txt',
      type: 'CREDENTIALS',
      location: 'SmartCorp Chennai HQ',
      asset: 'FILE-SRV-01',
      status: 'TRIGGERED',
      triggersCount: 2,
      lastTriggered: '14:23:51',
      sha256: 'a8b9c0d1e2f3456789abcdef0123456789abcdef0123456789abcdef01234567',
      syntheticPayload: 'admin_domain_sync: P@ssw0rd_Decoy_2026! / KDC_SRV: 10.0.4.15',
    },
    {
      id: 'ht-2',
      filename: 'vpn_credentials.txt',
      type: 'CREDENTIALS',
      location: 'SmartCorp Mumbai Datacenter',
      asset: 'AUTH-SRV-01',
      status: 'ARMED',
      triggersCount: 0,
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      syntheticPayload: 'gateway_user: external_contractor_arun / token: tk_9921_decoy_vpn',
    },
    {
      id: 'ht-3',
      filename: 'employee_salary_2026.xlsx',
      type: 'FINANCIAL',
      location: 'SmartCorp Chennai HQ',
      asset: 'FILE-SRV-01',
      status: 'TRIGGERED',
      triggersCount: 1,
      lastTriggered: '14:22:15',
      sha256: 'c2b1a09876543210fedcba9876543210fedcba9876543210fedcba9876543210',
      syntheticPayload: 'Confidential Executive Compensation & Canary Webhook embedded',
    },
    {
      id: 'ht-4',
      filename: 'finance_q4.xlsx',
      type: 'FINANCIAL',
      location: 'SmartCorp Bengaluru R&D',
      asset: 'FILE-SRV-01',
      status: 'ARMED',
      triggersCount: 0,
      sha256: 'b4a39281706f5e4d3c2b1a0987654321fedcba98765432109876543210abcdef',
      syntheticPayload: 'Audit Ledger FY26 Q4 Projection / Canary Macro Token',
    },
    {
      id: 'ht-5',
      filename: 'customer_backup.sql',
      type: 'DATABASE',
      location: 'SmartCorp Bengaluru Tech Center',
      asset: 'DB-PROD-01',
      status: 'ARMED',
      triggersCount: 0,
      sha256: 'f5e4d3c2b1a09876543210fedcba9876543210abcdef0123456789abcdef0123',
      syntheticPayload: 'CREATE TABLE synthetic_customers (id int, email text canary_ping...)',
    },
    {
      id: 'ht-6',
      filename: 'cloud_credentials.txt',
      type: 'CLOUD_SECRETS',
      location: 'SmartCorp Delhi Gateway',
      asset: 'DEV-SRV-01',
      status: 'ARMED',
      triggersCount: 0,
      sha256: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      syntheticPayload: 'AWS_ACCESS_KEY_ID=AKIA_CANARY_TOKEN_SMARTHIVE_DECEPTION',
    },
    {
      id: 'ht-7',
      filename: 'internal_network_map.pdf',
      type: 'NETWORK_MAP',
      location: 'SmartCorp Hyderabad Campus',
      asset: 'FILE-SRV-01',
      status: 'ARMED',
      triggersCount: 0,
      sha256: '789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234567',
      syntheticPayload: 'Synthetic Topology Map routing adversary to Honeynet VLAN 99',
    },
  ]);

  useSocket({
    'honeytoken:trigger': (data: any) => {
      setHoneytokens((prev) =>
        prev.map((h) =>
          h.filename === (data.filename || 'admin_backup_password.txt')
            ? {
                ...h,
                status: 'TRIGGERED',
                triggersCount: h.triggersCount + 1,
                lastTriggered: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            : h
        )
      );
    },
  });

  const handleSimulateTrigger = async (id: string) => {
    try {
      await api.simulateStep('HONEYTOKEN_ACCESS');
      setHoneytokens((prev) =>
        prev.map((h) =>
          h.id === id
            ? {
                ...h,
                status: 'TRIGGERED',
                triggersCount: h.triggersCount + 1,
                lastTriggered: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            : h
        )
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
            <FileKey className="w-5 h-5 text-red-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              Synthetic Honeytokens & Canary Assets
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Planted high-value decoy files and credentials. Unauthorized access instantly trips automated
            high-fidelity alerts, triggers risk escalation, and reruns predictive ML intent models.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 bg-red-500/20 text-red-400 border border-red-500/40 rounded font-semibold">
            {honeytokens.filter((h) => h.status === 'TRIGGERED').length} Triggered Lures
          </span>
        </div>
      </div>

      {/* Honeytokens List Table */}
      <div className="soc-panel rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0A1122] text-slate-400 border-b border-cyan-500/20">
              <tr>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Filename & Token</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Category</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Planted Location</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Planted Asset</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Triggers</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Status</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {honeytokens.map((ht) => (
                <tr key={ht.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">
                    <div className="flex items-center space-x-2">
                      <FileKey className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{ht.filename}</span>
                    </div>
                    <div className="text-[9px] text-slate-500 font-normal truncate max-w-xs mt-0.5">
                      SHA256: {ht.sha256.substring(0, 24)}...
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[9px] text-cyan-300">
                      {ht.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{ht.location}</td>
                  <td className="py-3 px-4 font-bold text-cyan-400">{ht.asset}</td>
                  <td className="py-3 px-4 text-slate-300">
                    <span className={ht.triggersCount > 0 ? 'text-red-400 font-bold' : 'text-slate-500'}>
                      {ht.triggersCount} {ht.lastTriggered && `(${ht.lastTriggered})`}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                        ht.status === 'TRIGGERED'
                          ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      }`}
                    >
                      • {ht.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleSimulateTrigger(ht.id)}
                      className="px-2.5 py-1 rounded bg-red-950/60 border border-red-500/30 hover:border-red-400 text-red-300 text-[10px] font-bold transition-all"
                    >
                      Trigger Test →
                    </button>
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
