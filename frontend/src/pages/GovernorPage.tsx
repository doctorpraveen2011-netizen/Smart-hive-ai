import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Zap,
  Clock,
  Check,
  X,
  Play,
  RotateCcw,
} from 'lucide-react';

interface DecisionRecord {
  id: string;
  actionType?: string;
  actionName?: string;
  category?: string;
  riskTier?: string;
  autonomyLevel?: string;
  decision: string;
  policyRule?: string;
  policyMatched?: string;
  reason?: string;
  approvedBy?: string;
  createdAt?: string;
  timestamp?: string;
}

export const GovernorPage: React.FC = () => {
  const [decisions, setDecisions] = useState<DecisionRecord[]>([]);
  const [currentLevel, setCurrentLevel] = useState<string>('LEVEL_2');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [testAction, setTestAction] = useState<string>('PRODUCTION_FIREWALL_MODIFICATION');
  const [actionFeedback, setActionFeedback] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

  const fetchDecisions = async () => {
    try {
      const res = await api.getGovernorDecisions();
      if (res.data && res.data.length > 0) {
        setDecisions(res.data);
      }
    } catch (err) {
      console.error('Failed to load governor decisions:', err);
    }
  };

  useEffect(() => {
    fetchDecisions();
  }, []);

  useSocket({
    'governor:decision': (newDec: DecisionRecord) => {
      setDecisions((prev) => {
        const exists = prev.findIndex((d) => d.id === newDec.id);
        if (exists >= 0) {
          const updated = [...prev];
          updated[exists] = newDec;
          return updated;
        }
        return [newDec, ...prev];
      });
    },
  });

  const handleApprove = async (id: string, actionName: string) => {
    try {
      await api.approveGovernorDecision(id, 'SOC_Incident_Commander');
      setDecisions((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                decision: 'ALLOW',
                approvedBy: 'SOC_Incident_Commander (Manual Signoff)',
                reason: 'Human SOC Commander approved production deployment',
              }
            : d
        )
      );
      setActionFeedback({
        message: `Approved: ${actionName} was authorized for immediate execution.`,
        type: 'success',
      });
      setTimeout(() => setActionFeedback(null), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: string, actionName: string) => {
    try {
      await api.rejectGovernorDecision(id, 'SOC_Incident_Commander');
      setDecisions((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                decision: 'BLOCK',
                approvedBy: 'SOC_Incident_Commander (Blocked)',
                reason: 'Human SOC Commander rejected production change to maintain business continuity',
              }
            : d
        )
      );
      setActionFeedback({
        message: `Blocked: ${actionName} was denied by human signoff. Zero production impact.`,
        type: 'danger',
      });
      setTimeout(() => setActionFeedback(null), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestEvaluate = async () => {
    setIsEvaluating(true);
    try {
      const res = await api.evaluateGovernor({
        actionType: testAction,
        autonomyLevel: currentLevel,
      });
      await fetchDecisions();
      setActionFeedback({
        message: `Evaluation completed: ${testAction} -> ${res.data.decision} (${res.data.reason})`,
        type: res.data.decision === 'ALLOW' ? 'success' : 'danger',
      });
      setTimeout(() => setActionFeedback(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getActionName = (dec: DecisionRecord) => dec.actionName || dec.actionType || 'GENERIC_SECURITY_ACTION';

  const getCategory = (dec: DecisionRecord) => {
    if (dec.category) return dec.category;
    const name = getActionName(dec);
    if (name.includes('PROD') || name.includes('FIREWALL') || name.includes('ENDPOINT')) return 'PRODUCTION_INTERVENTION';
    if (name.includes('DECOY')) return 'SAFE_DECEPTION';
    if (name.includes('HONEY') || name.includes('LURE')) return 'SYNTHETIC_LURE';
    if (name.includes('REDIRECT') || name.includes('SHADOW') || name.includes('SESSION')) return 'SESSION_ROUTING';
    if (name.includes('PATROL')) return 'PHYSICAL_RESPONSE';
    return 'DEFENSIVE_AUTONOMY';
  };

  const getRiskTier = (dec: DecisionRecord) => {
    if (dec.riskTier) return dec.riskTier;
    const name = getActionName(dec);
    if (name.includes('FIREWALL') || name.includes('DESTRUCTIVE') || name.includes('DISRUPTIVE')) return 'CRITICAL';
    if (name.includes('PROD') || name.includes('ACCOUNT') || name.includes('REDIRECT') || name.includes('PATROL')) return 'MEDIUM';
    return 'LOW';
  };

  const getPolicyRule = (dec: DecisionRecord) => dec.policyMatched || dec.policyRule || dec.reason || 'POL-DEF-00: Baseline Autonomous Defensive Policy';

  const formatTimestamp = (dec: DecisionRecord) => {
    if (dec.timestamp) return dec.timestamp;
    if (dec.createdAt) {
      try {
        const date = new Date(dec.createdAt);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      } catch {
        return 'Recent';
      }
    }
    return '14:26:15';
  };

  const pendingApprovals = decisions.filter(
    (d) => (d.decision === 'HUMAN_APPROVAL' || d.decision === 'HUMAN_APPROVAL_REQUIRED') && !d.approvedBy?.includes('Signoff')
  );

  const allowCount = decisions.filter((d) => d.decision === 'ALLOW').length;
  const blockCount = decisions.filter((d) => d.decision === 'BLOCK').length;

  return (
    <div className="space-y-4 max-w-[1720px] mx-auto pb-8">
      {/* Feedback Banner */}
      {actionFeedback && (
        <div
          className={`soc-panel p-3 rounded-lg border flex items-center justify-between text-xs font-mono animate-fadeIn ${
            actionFeedback.type === 'success'
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
              : 'border-red-500/50 bg-red-500/10 text-red-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            {actionFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            )}
            <span>{actionFeedback.message}</span>
          </div>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-slate-400 hover:text-white text-xs font-mono ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="soc-panel rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              Autonomy Safety Governor — Policy Engine & Audit Trail
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Strict policy-gated control plane evaluating every AI action (ALLOW, APPROVAL, BLOCK). Safe
            deception decoys and honeytokens are auto-permitted; disruptive production changes require human signoff.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="text-slate-400">Autonomy Level:</span>
          <select
            value={currentLevel}
            onChange={(e) => setCurrentLevel(e.target.value)}
            className="bg-[#09101F] border border-cyan-500/40 rounded px-2.5 py-1 text-xs font-semibold text-cyan-300 focus:outline-none"
          >
            <option value="LEVEL_0">Level 0: Observe Only (All Require Sign-off)</option>
            <option value="LEVEL_1">Level 1: Recommend Only</option>
            <option value="LEVEL_2">Level 2: Safe Deception Automation (Default)</option>
            <option value="LEVEL_3">Level 3: Controlled Active Response</option>
          </select>
        </div>
      </div>

      {/* Safety Policy Rules Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="soc-panel rounded-lg p-4 space-y-2 border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold uppercase text-[11px]">
              <CheckCircle2 className="w-4 h-4" />
              <span>ALLOW: Safe Simulated Actions</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {allowCount} Auto-Permitted
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Activate decoy container, deploy synthetic file lure, increase event velocity logging, redirect
            session into shadow honeynet. Zero production impact.
          </p>
        </div>

        <div className="soc-panel rounded-lg p-4 space-y-2 border-amber-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-400 font-bold uppercase text-[11px]">
              <AlertTriangle className="w-4 h-4" />
              <span>APPROVAL: Production Changes</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {pendingApprovals.length} Pending Sign-off
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Modifying production BGP routing, severing VLAN trunks, modifying production Active Directory
            accounts, or restarting real database clusters.
          </p>
        </div>

        <div className="soc-panel rounded-lg p-4 space-y-2 border-red-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-red-400 font-bold uppercase text-[11px]">
              <XCircle className="w-4 h-4" />
              <span>BLOCK: Destructive Operations</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
              {blockCount} Strict Blocked
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Unapproved counter-offensive malware injection, wiping attacker systems, or unverified payload
            execution. Strictly prohibited by defensive mandate.
          </p>
        </div>
      </div>

      {/* Human Approval Queue (Active Sign-off Section) */}
      {pendingApprovals.length > 0 && (
        <div className="soc-panel rounded-lg p-4 border border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-[#0A1122] to-amber-950/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                Active Human Sign-Off Queue ({pendingApprovals.length} Production Action Awaiting Authorization)
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400">SOC Commander Privilege Required</span>
          </div>

          <div className="space-y-3">
            {pendingApprovals.map((dec) => {
              const name = getActionName(dec);
              return (
                <div
                  key={dec.id}
                  className="bg-[#09101F] border border-amber-500/30 rounded p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-bold tracking-wide">{name}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                        {getRiskTier(dec)}
                      </span>
                      <span className="text-slate-500 text-[10px]">[{formatTimestamp(dec)}]</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{getPolicyRule(dec)}</p>
                    {dec.reason && (
                      <p className="text-slate-400 text-[10px] italic">Impact evaluation: {dec.reason}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                    <button
                      onClick={() => handleApprove(dec.id, name)}
                      className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/50 rounded flex items-center space-x-1.5 transition-colors font-semibold"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>APPROVE ACTION</span>
                    </button>
                    <button
                      onClick={() => handleReject(dec.id, name)}
                      className="px-3 py-1.5 bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/50 rounded flex items-center space-x-1.5 transition-colors font-semibold"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>REJECT / BLOCK</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Simulator / Evaluation Test Bench */}
      <div className="soc-panel rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center space-x-2 text-cyan-400 font-bold uppercase text-[11px]">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Interactive Governor Policy Test Bench</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={testAction}
            onChange={(e) => setTestAction(e.target.value)}
            className="bg-[#09101F] border border-cyan-500/30 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
          >
            <option value="ACTIVATE_AUTH_DECOY">ACTIVATE_AUTH_DECOY (Harmless Decoy)</option>
            <option value="DEPLOY_HONEYTOKEN">DEPLOY_HONEYTOKEN (Synthetic Lure)</option>
            <option value="REDIRECT_SHADOW_NETWORK">REDIRECT_SHADOW_NETWORK (Traffic Diversion)</option>
            <option value="PRODUCTION_ENDPOINT_ISOLATION">PRODUCTION_ENDPOINT_ISOLATION (Prod Change)</option>
            <option value="PRODUCTION_FIREWALL_MODIFICATION">PRODUCTION_FIREWALL_MODIFICATION (Prod Change)</option>
            <option value="DISABLE_REAL_ACCOUNT">DISABLE_REAL_ACCOUNT (Identity Lock)</option>
            <option value="DESTRUCTIVE_COUNTER_EXPLOIT">DESTRUCTIVE_COUNTER_EXPLOIT (Offensive Payload)</option>
          </select>

          <button
            onClick={handleTestEvaluate}
            disabled={isEvaluating}
            className="px-3 py-1 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/50 rounded flex items-center space-x-1 font-semibold disabled:opacity-50 transition-colors"
          >
            <Play className="w-3 h-3" />
            <span>{isEvaluating ? 'Evaluating...' : 'Evaluate Against Policy'}</span>
          </button>

          <button
            onClick={fetchDecisions}
            title="Refresh Decisions"
            className="p-1 bg-slate-800/60 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Decision Audit Log Table */}
      <div className="soc-panel rounded-lg overflow-hidden">
        <div className="p-3 border-b border-cyan-500/15 flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Autonomous Action Decisions Audit Log</span>
          </h2>
          <span className="text-[10px] font-mono text-slate-400">Cryptographic audit persistence</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0A1122] text-slate-400 border-b border-cyan-500/20">
              <tr>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Action Proposed</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Category</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Risk Tier</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Decision</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Policy Reference</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Timestamp</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-right">Sign-Off Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {decisions.map((dec) => {
                const name = getActionName(dec);
                const category = getCategory(dec);
                const riskTier = getRiskTier(dec);
                const policyRule = getPolicyRule(dec);
                const timestamp = formatTimestamp(dec);
                const isPending = dec.decision === 'HUMAN_APPROVAL' || dec.decision === 'HUMAN_APPROVAL_REQUIRED';

                return (
                  <tr key={dec.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-cyan-400">{name}</td>
                    <td className="py-3 px-4 text-slate-300">{category}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          riskTier === 'CRITICAL'
                            ? 'text-red-400 bg-red-500/10 border border-red-500/30'
                            : riskTier === 'MEDIUM'
                            ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                            : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                        }`}
                      >
                        {riskTier}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                          dec.decision === 'ALLOW'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : dec.decision === 'BLOCK'
                            ? 'bg-red-500/20 text-red-400 border-red-500/40'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        }`}
                      >
                        {dec.decision}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 text-[10px] max-w-md truncate" title={policyRule}>
                      {policyRule}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[10px] whitespace-nowrap">{timestamp}</td>
                    <td className="py-3 px-4 text-right">
                      {isPending && !dec.approvedBy?.includes('Signoff') ? (
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleApprove(dec.id, name)}
                            className="px-2 py-0.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded text-[10px] font-semibold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(dec.id, name)}
                            className="px-2 py-0.5 bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/40 rounded text-[10px] font-semibold"
                          >
                            Block
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          {dec.approvedBy || (dec.decision === 'ALLOW' ? 'Auto-Engine' : 'System Policy')}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
