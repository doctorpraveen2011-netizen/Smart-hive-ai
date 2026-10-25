import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import {
  Clock,
  ShieldAlert,
  Radio,
  FileKey,
  TrendingUp,
  Share2,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Activity,
  ArrowRight,
} from 'lucide-react';

interface TimelineEvent {
  time: string;
  stage: string;
  title: string;
  description: string;
  mitreTactic: string;
  status: 'COMPLETED' | 'PREDICTED' | 'ACTIVE';
  target: string;
  source: string;
  category: 'RECON' | 'DECEPTION' | 'PREDICTION' | 'CONTAINMENT';
}

export const AttackTimelinePage: React.FC = () => {
  const [leadTime, setLeadTime] = useState('5m 27s');
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    {
      time: '14:20:10',
      stage: 'Reconnaissance',
      title: 'Initial Subnet Probing',
      description: 'Adversary performed stealth TCP SYN scan against SmartCorp DMZ gateway.',
      mitreTactic: 'TA0043 - Reconnaissance',
      status: 'COMPLETED',
      target: 'WEB-SRV-01',
      source: '192.168.1.45',
      category: 'RECON',
    },
    {
      time: '14:21:08',
      stage: 'Service Enumeration',
      title: 'Port & Service Fingerprinting',
      description: 'Probed ports 22, 88, 445, and 3389 across core internal segments.',
      mitreTactic: 'TA0007 - Discovery',
      status: 'COMPLETED',
      target: 'AUTH-SRV-01',
      source: '192.168.1.45',
      category: 'RECON',
    },
    {
      time: '14:22:16',
      stage: 'SSH Decoy Interaction',
      title: 'First Decoy Engagement',
      description: 'Attempted brute-force authentication against SSH-DECOY-01 with synthetic root usernames.',
      mitreTactic: 'TA0001 - Initial Access',
      status: 'COMPLETED',
      target: 'SSH-DECOY-01',
      source: '192.168.1.45',
      category: 'DECEPTION',
    },
    {
      time: '14:23:02',
      stage: 'Credential Discovery',
      title: 'Active Directory Enumeration',
      description: 'Adversary queried Kerberos SPNs and requested TGS tickets targeting service accounts.',
      mitreTactic: 'TA0006 - Credential Access',
      status: 'COMPLETED',
      target: 'AUTH-SRV-01',
      source: '192.168.1.45',
      category: 'RECON',
    },
    {
      time: '14:23:51',
      stage: 'Honeytoken Trigger',
      title: 'Planted File Opened',
      description: 'Accessed synthetic decoy file admin_backup_password.txt on FILE-SRV-01.',
      mitreTactic: 'TA0009 - Collection',
      status: 'COMPLETED',
      target: 'FILE-SRV-01',
      source: '192.168.1.45',
      category: 'DECEPTION',
    },
    {
      time: '14:24:11',
      stage: 'Prediction Generated',
      title: 'AI Forecast: Credential Access Attempt',
      description: 'RandomForest & IsolationForest models forecast imminent authentication assault on AUTH-SRV-01 (84% confidence).',
      mitreTactic: 'SmartHive AI Prediction',
      status: 'PREDICTED',
      target: 'AUTH-SRV-01',
      source: 'SmartHive AI Engine',
      category: 'PREDICTION',
    },
    {
      time: '14:25:30',
      stage: 'Shadow Network Activated',
      title: 'Adaptive Deception Routing',
      description: 'Autonomy Governor level 1 allowed non-disruptive TCP diversion from AUTH-SRV-01 to AUTH-DECOY-07.',
      mitreTactic: 'Autonomous Deception',
      status: 'ACTIVE',
      target: 'AUTH-DECOY-07',
      source: 'Autonomy Governor',
      category: 'DECEPTION',
    },
    {
      time: '14:26:31',
      stage: 'Predicted Stage Observed',
      title: 'Kerberoasting Attack Executed on Decoy',
      description: 'Adversary executed predicted attack stage inside shadow decoy container without touching production.',
      mitreTactic: 'Prediction Verified (100% Accuracy)',
      status: 'COMPLETED',
      target: 'AUTH-DECOY-07',
      source: '192.168.1.45',
      category: 'PREDICTION',
    },
    {
      time: '14:27:02',
      stage: 'Session Contained',
      title: 'Adversary Quarantined',
      description: 'Session SH-104 isolated; forensic payload snapshot SHA-256 sealed; Patrol Team 1 secured Mumbai site.',
      mitreTactic: 'Containment Complete',
      status: 'COMPLETED',
      target: 'Session SH-104',
      source: 'Patrol Team 1',
      category: 'CONTAINMENT',
    },
  ]);

  useSocket({
    'demo:step': (data: any) => {
      // Dynamic updates during Judge Demo
      if (data.step === 'CONTAIN') {
        setLeadTime('5m 27s');
      }
    },
  });

  return (
    <div className="space-y-4 max-w-[1720px] mx-auto pb-8">
      {/* Header */}
      <div className="soc-panel rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              Attack Timeline & Early Warning Lead Time
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Chronological forensic reconstruction mapping observed telemetry against predictive forecasts,
            deception diversion, and physical containment.
          </p>
        </div>

        {/* Lead Time Metrics Badge */}
        <div className="flex items-center space-x-3">
          <div className="bg-[#09101F] border border-cyan-500/30 rounded-lg p-2.5 px-4 text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Attack Lead Time
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400">{leadTime}</div>
            <div className="text-[9px] text-slate-500 font-mono">Prediction vs Attack Occurrence</div>
          </div>
          <div className="hidden sm:block bg-[#09101F] border border-cyan-500/30 rounded-lg p-2.5 px-4 text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Prediction Accuracy
            </div>
            <div className="text-xl font-bold font-mono text-cyan-400">92.4%</div>
            <div className="text-[9px] text-slate-500 font-mono">Validated by Ground Truth</div>
          </div>
        </div>
      </div>

      {/* Main Timeline Card */}
      <div className="soc-panel rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15 mb-6">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Sequence of Operations: Session SH-104
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Source: 192.168.1.45 • Target: AUTH-SRV-01
          </span>
        </div>

        {/* Timeline Path */}
        <div className="relative border-l-2 border-cyan-500/30 ml-4 sm:ml-6 space-y-6">
          {timelineEvents.map((evt, idx) => (
            <div key={idx} className="relative pl-6 sm:pl-8 group">
              {/* Dot / Icon on line */}
              <div
                className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border flex items-center justify-center ${
                  evt.category === 'PREDICTION'
                    ? 'bg-purple-950 border-purple-400 text-purple-300 shadow-[0_0_10px_#A855F7]'
                    : evt.category === 'DECEPTION'
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_10px_#00F0FF]'
                    : evt.category === 'CONTAINMENT'
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300 shadow-[0_0_10px_#10B981]'
                    : 'bg-red-950 border-red-400 text-red-300 shadow-[0_0_10px_#EF4444]'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    evt.category === 'PREDICTION'
                      ? 'bg-purple-400 animate-pulse'
                      : evt.category === 'DECEPTION'
                      ? 'bg-cyan-400'
                      : evt.category === 'CONTAINMENT'
                      ? 'bg-emerald-400'
                      : 'bg-red-400'
                  }`}
                />
              </div>

              {/* Event Card */}
              <div className="bg-[#09101F] border border-cyan-500/20 rounded-lg p-3.5 hover:border-cyan-400/50 transition-all space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">{evt.time}</span>
                    <span className="text-slate-500">•</span>
                    <span className="font-bold text-sm text-white">{evt.stage}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                        evt.status === 'PREDICTED'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : evt.status === 'ACTIVE'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {evt.status}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                    {evt.mitreTactic}
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-medium">{evt.title}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{evt.description}</p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Source: <strong className="text-slate-300">{evt.source}</strong></span>
                  <span>Target: <strong className="text-cyan-400">{evt.target}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
