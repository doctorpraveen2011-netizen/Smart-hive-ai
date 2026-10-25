import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import {
  Layers,
  ShieldCheck,
  ArrowRight,
  Radio,
  FileKey,
  Server,
  AlertTriangle,
  Database,
  Globe,
  Share2,
} from 'lucide-react';

export const ShadowNetworkPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDiverted, setIsDiverted] = useState(true);

  const fetchShadowData = async () => {
    try {
      const res = await api.getShadowNetwork();
      setData(res.data);
      if (res.data?.divertedSession) {
        setIsDiverted(res.data.divertedSession.shadowDiverted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShadowData();
  }, []);

  useSocket({
    'session:update': (session: any) => {
      if (session.shadowDiverted !== undefined) {
        setIsDiverted(session.shadowDiverted);
      }
    },
    'demo:step': (d: any) => {
      if (d.step === 'SHADOW_DIVERSION' || d.step === 'HONEYTOKEN_ACCESS') {
        setIsDiverted(true);
      }
    },
  });

  return (
    <div className="space-y-4 max-w-[1720px] mx-auto pb-8">
      {/* Page Header */}
      <div className="soc-panel rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-purple-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              Deception Shadow Network — Parallel Topology & Traffic Diversion
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Visual comparison between Protected Production Infrastructure and the Shadow Deception Fabric.
            Demonstrates autonomous TCP diversion when Session SH-104 is lured into fake infrastructure.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span
            className={`text-xs font-mono font-bold px-3 py-1 rounded border uppercase ${
              isDiverted
                ? 'bg-purple-500/20 text-purple-300 border-purple-500 animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            }`}
          >
            {isDiverted ? '• SESSION DIVERTED TO SHADOW' : '• NORMAL ROUTING'}
          </span>
        </div>
      </div>

      {/* Visual Comparison: PROTECTED NETWORK vs DECEPTION SHADOW (Section 27) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Protected Network Column */}
        <div className="soc-panel rounded-lg p-5 space-y-4 border-cyan-500/20">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Protected Production Infrastructure
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              0% Adversary Touch
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Step 1: Gateway */}
            <div className="bg-[#09101F] border border-cyan-500/20 rounded-lg p-3 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-slate-400 block uppercase">Border Tier</span>
                <span className="text-white font-bold">Public Gateway (WEB-SRV-01)</span>
              </div>
              <span className="text-[10px] text-cyan-400">10.0.1.1</span>
            </div>

            <div className="flex justify-center text-slate-600">
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>

            {/* Step 2: Real Auth Server */}
            <div className="bg-[#09101F] border border-cyan-500/20 rounded-lg p-3 flex items-center justify-between opacity-60">
              <div>
                <span className="text-[9px] text-slate-400 block uppercase">Identity & KDC Tier</span>
                <span className="text-slate-200 font-bold">Production KDC (AUTH-SRV-01)</span>
              </div>
              <span className="text-[10px] text-slate-400">10.0.4.10 (Bypassed)</span>
            </div>

            <div className="flex justify-center text-slate-600">
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>

            {/* Step 3: Production DB */}
            <div className="bg-[#09101F] border border-cyan-500/20 rounded-lg p-3 flex items-center justify-between opacity-60">
              <div>
                <span className="text-[9px] text-slate-400 block uppercase">Data Storage Tier</span>
                <span className="text-slate-200 font-bold">PostgreSQL Cluster (DB-PROD-01)</span>
              </div>
              <span className="text-[10px] text-slate-400">10.0.2.5 (Airgapped)</span>
            </div>
          </div>
        </div>

        {/* Deception Shadow Column */}
        <div className="soc-panel rounded-lg p-5 space-y-4 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
          <div className="flex items-center justify-between pb-3 border-b border-purple-500/30">
            <div className="flex items-center space-x-2">
              <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Deception Shadow Path (Live Diverted)
              </h2>
            </div>
            <span className="text-[10px] font-mono text-purple-300 font-bold bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/40">
              Diverted: Session SH-104
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Step 1: Virtual Gateway Diverter */}
            <div className="bg-[#09101F] border border-purple-500/30 rounded-lg p-3 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-purple-300 block uppercase">Diverter Tier</span>
                <span className="text-white font-bold">TCP Interceptor Proxy</span>
              </div>
              <span className="text-[10px] text-purple-300">Proxy → 10.0.4.15</span>
            </div>

            <div className="flex justify-center text-purple-400 animate-bounce">
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>

            {/* Step 2: Auth Decoy */}
            <div className="bg-[#09101F] border border-purple-500/50 rounded-lg p-3 flex items-center justify-between shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              <div>
                <span className="text-[9px] text-purple-300 block uppercase">Synthetic KDC Tier</span>
                <span className="text-white font-bold">Fake Kerberos Server (AUTH-DECOY-07)</span>
              </div>
              <span className="text-[10px] text-cyan-400">10.0.4.15 (Engaged)</span>
            </div>

            <div className="flex justify-center text-purple-400 animate-bounce">
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>

            {/* Step 3: Decoy File / DB / Honeytoken */}
            <div className="bg-[#09101F] border border-purple-500/50 rounded-lg p-3 flex items-center justify-between shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              <div>
                <span className="text-[9px] text-purple-300 block uppercase">Planted Canary Lure</span>
                <span className="text-red-400 font-bold">admin_backup_password.txt</span>
              </div>
              <span className="text-[10px] text-red-400">Triggered (Evidence Logged)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory Banner */}
      <div className="soc-panel rounded-lg p-4 font-mono text-xs text-slate-300 flex items-center justify-between">
        <div className="space-y-1">
          <div className="font-bold text-cyan-400">Autonomy Safety Governor Verification:</div>
          <div className="text-slate-400">
            Adversary traffic is isolated in an unprivileged Docker overlay container. Any command sent by 192.168.1.45
            is answered with synthetic Active Directory responses and logged with SHA-256 integrity sealing.
          </div>
        </div>
      </div>
    </div>
  );
};
