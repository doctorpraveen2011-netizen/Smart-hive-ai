import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Search,
  Filter,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  Shield,
  FileKey,
  Database,
  Radio,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AlertItem {
  id: string;
  time: string;
  type: string;
  location: string;
  asset: string;
  risk: number;
  status: 'Critical' | 'High' | 'Medium' | 'Low';
  details: string;
  mitreRef: string;
}

export const PredictiveAlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [search, setSearch] = useState('');

  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: 'ALT-9921',
      time: '14:22:15',
      type: 'Honeytoken Triggered',
      location: 'Chennai HQ (CHN-01)',
      asset: 'FILE-SRV-01',
      risk: 91,
      status: 'Critical',
      details: 'Synthetic employee_salary_2026.xlsx opened by unauthorized session.',
      mitreRef: 'T1083 / File and Directory Discovery',
    },
    {
      id: 'ALT-9920',
      time: '13:45:02',
      type: 'Authentication Anomaly',
      location: 'Delhi Operations (DEL-01)',
      asset: 'AUTH-SRV-01',
      risk: 78,
      status: 'High',
      details: '14 consecutive Kerberos TGS requests for non-existent service principals.',
      mitreRef: 'T1558.003 / Kerberoasting',
    },
    {
      id: 'ALT-9919',
      time: '12:19:40',
      type: 'Service Enumeration',
      location: 'Mumbai Datacenter (MUM-01)',
      asset: 'WEB-SRV-01',
      risk: 65,
      status: 'Medium',
      details: 'Rapid TCP SYN sweep on ports 22, 88, 445 from external gateway.',
      mitreRef: 'T1046 / Network Service Discovery',
    },
    {
      id: 'ALT-9918',
      time: '11:52:11',
      type: 'Decoy Interaction',
      location: 'Bengaluru R&D (BLR-01)',
      asset: 'SSH-DECOY-01',
      risk: 55,
      status: 'Medium',
      details: 'Brute-force password guessing against fake honeypot SSH daemon.',
      mitreRef: 'T1110 / Brute Force',
    },
    {
      id: 'ALT-9917',
      time: '10:31:55',
      type: 'Suspicious Data Access',
      location: 'Hyderabad Campus (HYD-01)',
      asset: 'FILE-SRV-01',
      risk: 38,
      status: 'Low',
      details: 'Off-hours bulk file enumeration matching pattern for backup artifacts.',
      mitreRef: 'T1082 / System Information Discovery',
    },
    {
      id: 'ALT-9916',
      time: '09:14:20',
      type: 'Decoy Interaction',
      location: 'Mumbai Datacenter (MUM-01)',
      asset: 'AUTH-DECOY-07',
      risk: 84,
      status: 'High',
      details: 'Active diversion executed: adversary query routed to honeypot LDAP server.',
      mitreRef: 'SmartHive / Autonomous Deception',
    },
  ]);

  const filteredAlerts = alerts.filter((a) => {
    const matchFilter = filterSeverity === 'ALL' || a.status.toUpperCase() === filterSeverity;
    const matchSearch =
      a.type.toLowerCase().includes(search.toLowerCase()) ||
      a.location.toLowerCase().includes(search.toLowerCase()) ||
      a.asset.toLowerCase().includes(search.toLowerCase()) ||
      a.details.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-4 max-w-[1720px] mx-auto pb-8">
      {/* Header */}
      <div className="soc-panel rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              Predictive & Anomaly Security Alerts
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Correlated high-priority telemetry triggers from decoys, honeytokens, behavioral models, and
            anomaly detectors across SmartCorp infrastructure.
          </p>
        </div>

        {/* Severity Counts */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-2.5 py-1 bg-red-500/20 text-red-400 border border-red-500/40 rounded">
            1 Critical
          </span>
          <span className="px-2.5 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/40 rounded">
            2 High
          </span>
          <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded">
            2 Medium
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterSeverity(lvl)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all ${
                filterSeverity === lvl
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'bg-[#080E1A] text-slate-400 border border-cyan-500/20 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter alerts by asset, IP, type..."
            className="w-full bg-[#0D1527] border border-cyan-500/20 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
          />
        </div>
      </div>

      {/* Alerts Table matching reference screenshot columns */}
      <div className="soc-panel rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0A1122] text-slate-400 border-b border-cyan-500/20">
              <tr>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Time</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Type</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Location & Asset</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">MITRE Tactic</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Risk Score</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Status</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredAlerts.map((alt) => (
                <tr key={alt.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-400">{alt.time}</td>
                  <td className="py-3 px-4 font-bold text-white">
                    <div>{alt.type}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{alt.details}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-300 font-medium">{alt.location}</div>
                    <div className="text-[10px] text-cyan-400">{alt.asset}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[10px]">{alt.mitreRef}</td>
                  <td className="py-3 px-4 font-bold font-mono">
                    <span
                      className={
                        alt.risk >= 80 ? 'text-red-400' : alt.risk >= 60 ? 'text-orange-400' : 'text-amber-400'
                      }
                    >
                      {alt.risk}/100
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                        alt.status === 'Critical'
                          ? 'bg-red-500/20 text-red-400 border-red-500/40'
                          : alt.status === 'High'
                          ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                          : alt.status === 'Medium'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      }`}
                    >
                      {alt.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigate('/incidents')}
                      className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-[10px] font-bold transition-all"
                    >
                      Investigate →
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
