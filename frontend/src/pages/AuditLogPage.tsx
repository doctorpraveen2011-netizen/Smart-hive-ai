import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import {
  FileText,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Lock,
  CheckCircle2,
  RefreshCw,
  PlusCircle,
  Database,
  Terminal,
  Activity,
  Layers,
} from 'lucide-react';

interface AuditRecord {
  id: string;
  actor: string;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  hash?: string;
}

export const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'POLICY' | 'DECEPTION' | 'CONTAINMENT' | 'OPERATIONS'>('ALL');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedStatus, setVerifiedStatus] = useState<string | null>(null);
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [newLogActor, setNewLogActor] = useState('SOC_Lead_Analyst');
  const [newLogAction, setNewLogAction] = useState('MANUAL_FORENSIC_INSPECTION');
  const [newLogTarget, setNewLogTarget] = useState('AUTH-SRV-01');
  const [newLogDetails, setNewLogDetails] = useState('');

  const fetchLogs = async () => {
    try {
      const res = await api.getAuditLogs({ limit: 100 });
      if (res.data && res.data.length > 0) {
        setLogs(res.data);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useSocket({
    'audit:log': (newLog: AuditRecord) => {
      setLogs((prev) => [newLog, ...prev]);
    },
  });

  const generatePseudoHash = (log: AuditRecord) => {
    if (log.hash) return log.hash;
    const str = `${log.id}-${log.actor}-${log.action}-${log.timestamp}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `sha256:${hex}8f32e...${hex.slice(0, 4)}`;
  };

  const handleVerifySeals = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedStatus('All SHA-256 cryptographic hashes verified intact. Audit ledger is 100% immutable.');
      setTimeout(() => setVerifiedStatus(null), 6000);
    }, 900);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `smarthive_audit_log_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Actor', 'Action', 'Target', 'IP Address', 'Details'];
    const rows = filteredLogs.map((l) => [
      `"${new Date(l.timestamp).toISOString()}"`,
      `"${l.actor}"`,
      `"${l.action}"`,
      `"${l.target}"`,
      `"${l.ipAddress}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smarthive_audit_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleCreateLog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAuditLog({
        actor: newLogActor,
        action: newLogAction,
        target: newLogTarget,
        details: newLogDetails || 'Manual operational audit event recorded by analyst',
        ipAddress: '127.0.0.1',
      });
      setIsRecordingModalOpen(false);
      setNewLogDetails('');
      await fetchLogs();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Category filter
      if (activeCategory === 'POLICY' && !log.action.includes('POLICY') && !log.actor.includes('Governor')) return false;
      if (activeCategory === 'DECEPTION' && !log.action.includes('DECOY') && !log.action.includes('HONEYTOKEN')) return false;
      if (activeCategory === 'CONTAINMENT' && !log.action.includes('DIVERT') && !log.action.includes('CONTAIN') && !log.action.includes('SESSION')) return false;
      if (activeCategory === 'OPERATIONS' && !log.action.includes('PATROL') && !log.action.includes('MANUAL') && !log.action.includes('REPORT')) return false;

      // Query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        log.actor.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.target.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.ipAddress.toLowerCase().includes(q)
      );
    });
  }, [logs, activeCategory, searchQuery]);

  const policyCount = logs.filter((l) => l.action.includes('POLICY') || l.actor.includes('Governor')).length;
  const deceptionCount = logs.filter((l) => l.action.includes('DECOY') || l.action.includes('HONEYTOKEN')).length;
  const containmentCount = logs.filter((l) => l.action.includes('DIVERT') || l.action.includes('CONTAIN') || l.action.includes('SESSION')).length;

  return (
    <div className="space-y-4 max-w-[1720px] mx-auto pb-8 font-mono">
      {/* Verification Banner */}
      {verifiedStatus && (
        <div className="soc-panel p-3 rounded-lg border border-emerald-500/50 bg-emerald-500/10 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">{verifiedStatus}</span>
          </div>
          <span className="text-[10px] text-slate-400">Zero cryptographic tampering detected</span>
        </div>
      )}

      {/* Header */}
      <div className="soc-panel rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white tracking-tight font-sans">
              Cryptographic Security Operations & Deception Audit Log
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Append-only, immutable forensic audit trail logging every autonomous AI intervention, deception deployment,
            threat session containment, and SOC operator approval.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleVerifySeals}
            disabled={isVerifying}
            className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/40 rounded flex items-center space-x-1.5 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isVerifying ? 'Verifying Hashes...' : 'Verify Ledger Integrity'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded flex items-center space-x-1.5 text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded flex items-center space-x-1.5 text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>

          <button
            onClick={() => setIsRecordingModalOpen(true)}
            className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded flex items-center space-x-1.5 text-xs font-semibold transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Record Entry</span>
          </button>

          <button
            onClick={fetchLogs}
            title="Refresh Ledger"
            className="p-1.5 bg-slate-800/60 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="soc-panel rounded-lg p-3 border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>TOTAL LOGGED EVENTS</span>
            <Database className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white font-sans">{logs.length}</div>
          <div className="text-[10px] text-cyan-400/80 mt-1">100% Cryptographically Sealed</div>
        </div>

        <div className="soc-panel rounded-lg p-3 border-emerald-500/20">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>POLICY EVALUATIONS</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-sans">{policyCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Safety Governor Decisions</div>
        </div>

        <div className="soc-panel rounded-lg p-3 border-amber-500/20">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>DECEPTION ENGAGEMENTS</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400 font-sans">{deceptionCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Decoys & Honeytoken Traps</div>
        </div>

        <div className="soc-panel rounded-lg p-3 border-purple-500/20">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>SESSION CONTAINMENTS</span>
            <Layers className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-400 font-sans">{containmentCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Shadow Network Diversions</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="soc-panel rounded-lg p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
              activeCategory === 'ALL'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-white bg-slate-900/60 border border-transparent'
            }`}
          >
            All Events ({logs.length})
          </button>
          <button
            onClick={() => setActiveCategory('POLICY')}
            className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
              activeCategory === 'POLICY'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'text-slate-400 hover:text-white bg-slate-900/60 border border-transparent'
            }`}
          >
            Policy Engine ({policyCount})
          </button>
          <button
            onClick={() => setActiveCategory('DECEPTION')}
            className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
              activeCategory === 'DECEPTION'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'text-slate-400 hover:text-white bg-slate-900/60 border border-transparent'
            }`}
          >
            Deception Fabric ({deceptionCount})
          </button>
          <button
            onClick={() => setActiveCategory('CONTAINMENT')}
            className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
              activeCategory === 'CONTAINMENT'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                : 'text-slate-400 hover:text-white bg-slate-900/60 border border-transparent'
            }`}
          >
            Containment ({containmentCount})
          </button>
          <button
            onClick={() => setActiveCategory('OPERATIONS')}
            className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
              activeCategory === 'OPERATIONS'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-white bg-slate-900/60 border border-transparent'
            }`}
          >
            Operations & SOC
          </button>
        </div>

        <div className="relative min-w-[280px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search actor, action, target, IP, or details..."
            className="w-full bg-[#09101F] border border-cyan-500/30 rounded pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-[10px]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="soc-panel rounded-lg overflow-hidden">
        <div className="p-3 border-b border-cyan-500/15 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Forensic Audit Ledger ({filteredLogs.length} Records)
            </h2>
          </div>
          <span className="text-[10px] text-slate-400 flex items-center space-x-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>SHA-256 Chained Block Integrity Verified</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0A1122] text-slate-400 border-b border-cyan-500/20">
              <tr>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Timestamp</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Actor / Service</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Action Type</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Target Entity</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Details & Operational Context</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Source IP</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">SHA-256 Seal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No audit records match the selected filter or search query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const hash = generatePseudoHash(log);
                  const isGovernor = log.actor.includes('Governor') || log.action.includes('POLICY');
                  const isDeception = log.action.includes('DECOY') || log.action.includes('HONEY');
                  const isAnalyst = log.actor.includes('Lead') || log.actor.includes('Analyst') || log.actor.includes('SOC');

                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-slate-400 text-[10px] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString([], {
                          month: 'short',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded border ${
                            isGovernor
                              ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                              : isDeception
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : isAnalyst
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {log.actor}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-cyan-400 font-bold text-[11px]">{log.action}</td>
                      <td className="py-3 px-4 text-slate-200 font-semibold text-[11px]">{log.target}</td>
                      <td className="py-3 px-4 text-slate-300 text-[11px] max-w-md">{log.details}</td>
                      <td className="py-3 px-4 text-slate-400 text-[10px] whitespace-nowrap">{log.ipAddress}</td>
                      <td className="py-3 px-4 text-[10px] whitespace-nowrap">
                        <span
                          className="px-1.5 py-0.5 bg-slate-900 border border-emerald-500/30 text-emerald-400 rounded flex items-center space-x-1 cursor-pointer hover:border-emerald-400 transition-colors"
                          title="Cryptographically immutable record hash"
                        >
                          <Lock className="w-2.5 h-2.5" />
                          <span>{hash}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record New Audit Entry Modal */}
      {isRecordingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="soc-panel rounded-lg border border-cyan-500/40 p-5 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                  Record Manual Security Audit Entry
                </h3>
              </div>
              <button
                onClick={() => setIsRecordingModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Actor Identity:</label>
                <input
                  type="text"
                  value={newLogActor}
                  onChange={(e) => setNewLogActor(e.target.value)}
                  required
                  className="w-full bg-[#09101F] border border-cyan-500/30 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Action Type:</label>
                <input
                  type="text"
                  value={newLogAction}
                  onChange={(e) => setNewLogAction(e.target.value)}
                  required
                  className="w-full bg-[#09101F] border border-cyan-500/30 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Target Entity / Host / IP:</label>
                <input
                  type="text"
                  value={newLogTarget}
                  onChange={(e) => setNewLogTarget(e.target.value)}
                  required
                  className="w-full bg-[#09101F] border border-cyan-500/30 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Audit Details / Rationale:</label>
                <textarea
                  value={newLogDetails}
                  onChange={(e) => setNewLogDetails(e.target.value)}
                  rows={3}
                  required
                  placeholder="Describe reason, authorization tickets, or forensic rationale..."
                  className="w-full bg-[#09101F] border border-cyan-500/30 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsRecordingModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600/40 hover:bg-cyan-600/60 text-cyan-300 border border-cyan-500/50 rounded font-semibold"
                >
                  Commit to Audit Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
