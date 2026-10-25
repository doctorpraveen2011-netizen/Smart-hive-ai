import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { useNavigate, NavLink } from 'react-router-dom';
import { LiveThreatMap } from '../components/map/LiveThreatMap';
import {
  ShieldAlert,
  Shield,
  Car,
  AlertTriangle,
  FileText,
  Cpu,
  ShieldCheck,
  MapPin,
  ExternalLink,
  ChevronRight,
  Download,
  Send,
  Share2,
  FlaskConical,
  Radio,
  FileKey,
  X,
  Clock,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  Locate,
  CheckCircle2,
  GitBranch,
  Zap,
} from 'lucide-react';

export const CommandCenter: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // KPIs matching screenshot
  const [kpis, setKpis] = useState({
    activeThreats: 7,
    activePatrols: 5,
    criticalAlerts: 2,
    incidents: 3,
    systemsMonitored: 24,
    threatsContained: 5,
  });

  // Selected marker / modal
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [activePatrolDrawer, setActivePatrolDrawer] = useState<any>(null);

  // Patrol Teams matching screenshot
  const [patrolTeams, setPatrolTeams] = useState([
    { id: '1', name: 'Patrol Team 1', location: 'Mumbai, MH', status: 'On Route', eta: '6 min', lat: 19.076, lng: 72.877 },
    { id: '2', name: 'Patrol Team 2', location: 'Chennai, TN', status: 'On Route', eta: '6 min', lat: 13.082, lng: 80.270 },
    { id: '3', name: 'Patrol Team 3', location: 'Delhi, DL', status: 'Monitoring', eta: '12 min', lat: 28.704, lng: 77.102 },
    { id: '4', name: 'Patrol Team 4', location: 'Bengaluru, KA', status: 'Monitoring', eta: '12 min', lat: 12.971, lng: 77.594 },
    { id: '5', name: 'Patrol Team 5', location: 'Hyderabad, TS', status: 'On Site', eta: '12 min', lat: 17.385, lng: 78.486 },
  ]);

  // Recent Alerts matching screenshot
  const [recentAlerts, setRecentAlerts] = useState([
    { time: '14:22', type: 'Honeytoken Triggered', location: 'Chennai, TN', risk: 91, status: 'Critical' },
    { time: '13:45', type: 'Login Attempt', location: 'Delhi, DL', risk: 78, status: 'High' },
    { time: '12:19', type: 'Port Scan', location: 'Mumbai, MH', risk: 65, status: 'Medium' },
    { time: '11:52', type: 'Decoy Interaction', location: 'Bengaluru, KA', risk: 55, status: 'Medium' },
    { time: '10:31', type: 'Data Access', location: 'Hyderabad, TS', risk: 38, status: 'Low' },
  ]);

  // Latest Incidents matching screenshot
  const [latestIncidents, setLatestIncidents] = useState([
    {
      id: 'inc-1',
      severity: 'CRITICAL',
      title: 'Honeytoken Access Detected',
      asset: 'File Server (FILE-SRV-01)',
      meta: '16:55 • Chennai, IN',
      actionLabel: 'Patrol Dispatched',
      actionType: 'patrol',
      risk: 91,
      target: 'AUTH-SRV-01',
    },
    {
      id: 'inc-2',
      severity: 'HIGH',
      title: 'Suspicious Login Attempt',
      asset: 'Auth Server (AUTH-SRV-01)',
      meta: '15:45 • Delhi, IN',
      actionLabel: 'Investigating',
      actionType: 'investigate',
      risk: 78,
      target: 'AUTH-SRV-01',
    },
    {
      id: 'inc-3',
      severity: 'MEDIUM',
      title: 'Unusual Port Scanning',
      asset: 'Web Server (WEB-SRV-01)',
      meta: '15:18 • Mumbai, IN',
      actionLabel: 'Monitoring',
      actionType: 'monitor',
      risk: 65,
      target: 'WEB-SRV-01',
    },
    {
      id: 'inc-4',
      severity: 'HIGH',
      title: 'Decoy Interaction',
      asset: 'SSH Decoy (SSH-SRV-01)',
      meta: '11:03 • Bengaluru, IN',
      actionLabel: 'Deception',
      actionType: 'deception',
      risk: 55,
      target: 'SSH-DECOY-01',
    },
    {
      id: 'inc-5',
      severity: 'LOW',
      title: 'Anomalous Data Access',
      asset: 'File Server (FILE-SRV-01)',
      meta: '10:51 • Hyderabad, IN',
      actionLabel: 'Resolved',
      actionType: 'resolved',
      risk: 38,
      target: 'FILE-SRV-01',
    },
  ]);

  // Evidence state
  const [evidenceData, setEvidenceData] = useState({
    title: 'File Access Log: sys_exfiltration.txt',
    sourceIp: '192.168.1.45',
    timestamp: '16:32:17',
    attackType: 'Credential Discovery',
    sha256: 'a8b9c0d1e2f3456789abcdef0123456789abcdef0123456789abcdef01234567',
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await api.getDashboard();
      if (res.data && res.data.kpis) {
        setKpis((prev) => ({
          ...prev,
          activeThreats: res.data.kpis.activeThreats ?? prev.activeThreats,
          threatsContained: res.data.kpis.threatsContained ?? prev.threatsContained,
        }));
      }
    } catch (err) {
      console.warn('[COMMAND CENTER] Backend check:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Real-time updates from WebSocket simulation
  useSocket({
    'demo:step': (data: any) => {
      if (data.step === 'RECONNAISSANCE') {
        setKpis((prev) => ({ ...prev, activeThreats: 7, criticalAlerts: 2 }));
      } else if (data.step === 'HONEYTOKEN_ACCESS') {
        setKpis((prev) => ({ ...prev, activeThreats: 8, criticalAlerts: 3 }));
      } else if (data.step === 'CONTAIN') {
        setKpis((prev) => ({ ...prev, activeThreats: 6, threatsContained: 6 }));
      }
    },
    'honeytoken:trigger': (data: any) => {
      setRecentAlerts((prev) => [
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'Honeytoken Triggered',
          location: 'Chennai, TN',
          risk: 91,
          status: 'Critical',
        },
        ...prev.slice(0, 4),
      ]);
    },
  });

  // Download Evidence Real Action
  const handleDownloadEvidence = () => {
    const payload = JSON.stringify(
      {
        artifact: 'sys_exfiltration.txt',
        sourceIp: evidenceData.sourceIp,
        timestamp: evidenceData.timestamp,
        attackType: evidenceData.attackType,
        sha256Hash: evidenceData.sha256,
        status: 'CAPTURED_BY_SMARTHIVE_DECEPTION_FABRIC',
      },
      null,
      2
    );
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Evidence_${evidenceData.attackType.replace(/\s+/g, '_')}_${Date.now()}.json`;
    a.click();
  };

  // Download Report Real Action
  const handleDownloadReport = () => {
    const reportData = JSON.stringify(
      {
        reportCode: 'SSH-2026-001',
        title: 'Executive Incident Response Report',
        generatedAt: '19 Oct 2026, 14:56',
        executiveSummary:
          'SmartHive AI autonomously detected early credential discovery against AUTH-SRV-01, diverted the session to AUTH-DECOY-07, and dispatched Patrol Team 1 with zero production impact.',
        attackLeadTime: '5m 27s',
        status: 'CONTAINED',
        sha256Checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
      null,
      2
    );
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Incident_Report_SSH-2026-001.json`;
    a.click();
  };

  return (
    <div className="space-y-4 max-w-[1720px] mx-auto pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-1 gap-2">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Security Operations Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time threat monitoring, incident response and patrol coordination
          </p>
        </div>
      </div>

      {/* 1. TOP KPI ROW — 6 COMPACT CARDS MATCHING REFERENCE SCREENSHOT */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Active Threats */}
        <div
          onClick={() => navigate('/intelligence')}
          className="soc-card rounded-lg p-3.5 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] border-cyan-500/20"
        >
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block">
                Active Threats
              </span>
              <span className="text-xl font-bold text-white font-mono">{kpis.activeThreats}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-red-400 font-mono mt-2 pt-2 border-t border-slate-800/80">
            <ArrowUpRight className="w-3 h-3 text-red-400" />
            <span>2 vs last 24h</span>
          </div>
        </div>

        {/* Card 2: Active Patrols */}
        <div
          onClick={() => navigate('/response-teams')}
          className="soc-card rounded-lg p-3.5 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] border-cyan-500/20"
        >
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Car className="w-4 h-4" />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block">
                Active Patrols
              </span>
              <span className="text-xl font-bold text-white font-mono">{kpis.activePatrols}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-cyan-400 font-mono mt-2 pt-2 border-t border-slate-800/80">
            <ArrowUpRight className="w-3 h-3 text-cyan-400" />
            <span>1 vs last 24h</span>
          </div>
        </div>

        {/* Card 3: Critical Alerts */}
        <div
          onClick={() => navigate('/alerts')}
          className="soc-card rounded-lg p-3.5 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] border-cyan-500/20"
        >
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block">
                Critical Alerts
              </span>
              <span className="text-xl font-bold text-white font-mono">{kpis.criticalAlerts}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-red-400 font-mono mt-2 pt-2 border-t border-slate-800/80">
            <ArrowUpRight className="w-3 h-3 text-red-400" />
            <span>1 vs last 24h</span>
          </div>
        </div>

        {/* Card 4: Incidents */}
        <div
          onClick={() => navigate('/incidents')}
          className="soc-card rounded-lg p-3.5 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] border-cyan-500/20"
        >
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block">
                Incidents
              </span>
              <span className="text-xl font-bold text-white font-mono">{kpis.incidents}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-emerald-400 font-mono mt-2 pt-2 border-t border-slate-800/80">
            <ArrowDownRight className="w-3 h-3 text-emerald-400" />
            <span>1 vs last 24h</span>
          </div>
        </div>

        {/* Card 5: Systems Monitored */}
        <div
          onClick={() => navigate('/digital-twin')}
          className="soc-card rounded-lg p-3.5 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] border-cyan-500/20"
        >
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block">
                Systems Monitored
              </span>
              <span className="text-xl font-bold text-white font-mono">{kpis.systemsMonitored}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-emerald-400 font-mono mt-2 pt-2 border-t border-slate-800/80">
            <ArrowUpRight className="w-3 h-3 text-emerald-400" />
            <span>0 active</span>
          </div>
        </div>

        {/* Card 6: Threats Contained */}
        <div
          onClick={() => navigate('/sessions')}
          className="soc-card rounded-lg p-3.5 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] border-cyan-500/20"
        >
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block">
                Threats Contained
              </span>
              <span className="text-xl font-bold text-white font-mono">{kpis.threatsContained}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-emerald-400 font-mono mt-2 pt-2 border-t border-slate-800/80">
            <ArrowUpRight className="w-3 h-3 text-emerald-400" />
            <span>2 vs last 24h</span>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE ROW — LIVE THREAT MAP (~62%) VS LATEST INCIDENTS (~38%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Live Threat Map Card (8 columns out of 12) */}
        <div className="lg:col-span-8 soc-panel rounded-lg p-4 flex flex-col justify-between relative overflow-hidden">
          {/* Map Title Header */}
          <div className="flex items-center justify-between mb-3 z-10">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Live Threat Map</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Real-time view of threats, assets and patrol positions
              </p>
            </div>
            <NavLink
              to="/incident-map"
              className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <span>View Standalone Map</span>
              <ChevronRight className="w-3 h-3" />
            </NavLink>
          </div>

          {/* Interactive Live Threat Map */}
          <LiveThreatMap
            mode="embedded"
            height="400px"
            onSelectMarker={(m) => setSelectedMarker(m)}
          />
        </div>

        {/* Right: Latest Incidents Panel (4 columns out of 12) */}
        <div className="lg:col-span-4 soc-panel rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-cyan-500/15 mb-2.5">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Latest Incidents</span>
              </h2>
              <NavLink to="/incidents" className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300">
                View All
              </NavLink>
            </div>

            {/* List of 5 Incidents matching screenshot */}
            <div className="space-y-2">
              {latestIncidents.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() =>
                    setSelectedMarker({
                      code: inc.id,
                      site: inc.meta,
                      locationType: 'SIMULATED_INCIDENT_SITE',
                      risk: inc.risk,
                      severity: inc.severity,
                      observedAttack: inc.title,
                      predictedAttack: 'Credential Access Attempt',
                      predictedTarget: inc.target,
                      confidence: 84,
                      evidenceCount: 5,
                      assignedTeam: 'Patrol Team 1',
                      eta: '6 minutes',
                    })
                  }
                  className="p-2.5 rounded-md bg-[#0D1527]/90 border border-cyan-500/15 hover:border-cyan-400/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="space-y-1 min-w-0 pr-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[9px] font-bold font-mono px-1.5 py-0.2 rounded uppercase ${
                          inc.severity === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : inc.severity === 'HIGH'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                            : inc.severity === 'MEDIUM'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        {inc.severity}
                      </span>
                      <span className="font-semibold text-xs text-white truncate">{inc.title}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{inc.asset}</div>
                    <div className="text-[9px] text-slate-500 font-mono">{inc.meta}</div>
                  </div>

                  {/* Right Action Button Pill */}
                  <div
                    className={`flex-shrink-0 text-[10px] font-mono px-2 py-1 rounded border flex items-center space-x-1 transition-colors ${
                      inc.actionType === 'patrol'
                        ? 'bg-red-950/60 text-red-300 border-red-500/40 group-hover:bg-red-900/60'
                        : inc.actionType === 'investigate'
                        ? 'bg-orange-950/60 text-orange-300 border-orange-500/40'
                        : inc.actionType === 'deception'
                        ? 'bg-purple-950/60 text-purple-300 border-purple-500/40'
                        : inc.actionType === 'resolved'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    <span>{inc.actionLabel}</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. LOWER SECTION — 4 PANELS MATCHING REFERENCE SCREENSHOT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Panel 1: Active Patrols Table (4 of 12 columns) */}
        <div className="lg:col-span-4 soc-panel rounded-lg p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/15 mb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Active Patrols
              </h3>
              <NavLink to="/response-teams" className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300">
                View All
              </NavLink>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[10px] text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="py-1.5 font-normal">Team</th>
                    <th className="py-1.5 font-normal">Location</th>
                    <th className="py-1.5 font-normal">Status</th>
                    <th className="py-1.5 font-normal">ETA</th>
                    <th className="py-1.5 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-[11px]">
                  {patrolTeams.map((team) => (
                    <tr key={team.id} className="hover:bg-slate-800/40">
                      <td className="py-2 text-slate-200 flex items-center space-x-1.5">
                        <Car className="w-3 h-3 text-cyan-400" />
                        <span>{team.name}</span>
                      </td>
                      <td className="py-2 text-slate-400">{team.location}</td>
                      <td className="py-2">
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                            team.status === 'On Route'
                              ? 'text-emerald-400'
                              : team.status === 'Monitoring'
                              ? 'text-cyan-400'
                              : 'text-blue-400'
                          }`}
                        >
                          • {team.status}
                        </span>
                      </td>
                      <td className="py-2 text-slate-300">{team.eta}</td>
                      <td className="py-2 text-right">
                        <button
                          onClick={() => setActivePatrolDrawer(team)}
                          className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold px-1.5 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/40"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Panel 2: Recent Alerts Table (3 of 12 columns) */}
        <div className="lg:col-span-3 soc-panel rounded-lg p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/15 mb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Recent Alerts
              </h3>
              <NavLink to="/alerts" className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300">
                View All
              </NavLink>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[10px] text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="py-1.5 font-normal">Time</th>
                    <th className="py-1.5 font-normal">Type</th>
                    <th className="py-1.5 font-normal">Location</th>
                    <th className="py-1.5 font-normal">Risk</th>
                    <th className="py-1.5 font-normal text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-[11px]">
                  {recentAlerts.map((alt, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-2 text-slate-400">{alt.time}</td>
                      <td className="py-2 text-slate-200 truncate max-w-[100px]">{alt.type}</td>
                      <td className="py-2 text-slate-400">{alt.location}</td>
                      <td className="py-2 font-bold text-slate-200">{alt.risk}</td>
                      <td className="py-2 text-right">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            alt.status === 'Critical'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                              : alt.status === 'High'
                              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                              : alt.status === 'Medium'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          }`}
                        >
                          {alt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Panel 3: Incident Evidence Card (2 of 12 columns) */}
        <div className="lg:col-span-2 soc-panel rounded-lg p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/15 mb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Incident Evidence
              </h3>
              <NavLink to="/evidence" className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300">
                View All
              </NavLink>
            </div>

            {/* Terminal Preview Box */}
            <div className="bg-[#050A14] border border-cyan-500/20 rounded p-2 font-mono text-[9px] text-cyan-400/90 leading-tight space-y-0.5">
              <div className="text-slate-400 truncate font-semibold">{evidenceData.title}</div>
              <div className="text-[8px] text-slate-600 truncate">SHA256: {evidenceData.sha256.substring(0, 20)}...</div>
              <div className="text-slate-500 pt-1">$ cat /var/log/auth.log</div>
              <div className="text-red-400">ALERT: Honeytoken file accessed</div>
            </div>

            {/* Metadata Fields */}
            <div className="space-y-1 text-[10px] font-mono mt-2.5">
              <div className="flex justify-between text-slate-400">
                <span>Source IP:</span>
                <span className="text-slate-200">{evidenceData.sourceIp}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Timestamp:</span>
                <span className="text-slate-200">{evidenceData.timestamp}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Attack Type:</span>
                <span className="text-slate-200">{evidenceData.attackType}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadEvidence}
            className="w-full mt-3 py-1.5 border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 text-[10px] font-mono font-bold rounded flex items-center justify-center space-x-1.5 transition-all shadow-[0_0_8px_rgba(0,240,255,0.15)]"
          >
            <Download className="w-3 h-3 text-cyan-400" />
            <span>Download Evidence</span>
          </button>
        </div>

        {/* Panel 4: Latest Report & Quick Actions (3 of 12 columns) */}
        <div className="lg:col-span-3 soc-panel rounded-lg p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/15 mb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Latest Report
              </h3>
              <NavLink to="/reports" className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300">
                View All
              </NavLink>
            </div>

            <div className="text-xs font-mono space-y-0.5">
              <div className="font-bold text-white">Incident Report SSH-2026-001</div>
              <div className="text-[10px] text-slate-400">Generated 19 Oct 2026, 14:56</div>
            </div>

            {/* PDF & Download Buttons matching screenshot */}
            <div className="flex items-center space-x-2 mt-2">
              <button
                onClick={() => navigate('/reports')}
                className="px-2.5 py-1 bg-red-950/60 border border-red-500/50 hover:bg-red-900/60 text-red-300 text-[10px] font-mono font-bold rounded flex items-center space-x-1"
              >
                <span>PDF</span>
              </button>
              <button
                onClick={handleDownloadReport}
                className="flex-1 py-1 bg-cyan-950/60 border border-cyan-500/50 hover:bg-cyan-900/60 text-cyan-300 text-[10px] font-mono font-bold rounded flex items-center justify-center space-x-1 shadow-[0_0_8px_rgba(0,240,255,0.15)]"
              >
                <Download className="w-3 h-3 text-cyan-400" />
                <span>Download</span>
              </button>
            </div>

            {/* Quick Actions List matching screenshot */}
            <div className="mt-3 pt-2.5 border-t border-cyan-500/15 space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Quick Actions
              </div>

              <button
                onClick={() => navigate('/response-teams')}
                className="w-full text-left p-1.5 rounded bg-slate-900/60 border border-cyan-500/20 hover:border-cyan-400 text-[10px] text-slate-200 font-mono flex items-center space-x-1.5 transition-colors"
              >
                <Send className="w-3 h-3 text-cyan-400" />
                <span>Alert Response Team</span>
              </button>

              <button
                onClick={() => navigate('/attack-graph')}
                className="w-full text-left p-1.5 rounded bg-slate-900/60 border border-cyan-500/20 hover:border-cyan-400 text-[10px] text-slate-200 font-mono flex items-center space-x-1.5 transition-colors"
              >
                <Share2 className="w-3 h-3 text-cyan-400" />
                <span>View Full Attack Graph</span>
              </button>

              <button
                onClick={() => navigate('/deception-lab')}
                className="w-full text-left p-1.5 rounded bg-slate-900/60 border border-cyan-500/20 hover:border-cyan-400 text-[10px] text-slate-200 font-mono flex items-center space-x-1.5 transition-colors"
              >
                <FlaskConical className="w-3 h-3 text-cyan-400" />
                <span>Open Deception Lab</span>
              </button>

              <button
                onClick={() => navigate('/threat-futures')}
                className="w-full text-left p-1.5 rounded bg-slate-900/60 border border-cyan-500/20 hover:border-cyan-400 text-[10px] text-slate-200 font-mono flex items-center space-x-1.5 transition-colors"
              >
                <GitBranch className="w-3 h-3 text-cyan-400" />
                <span>View Threat Futures</span>
              </button>

              <button
                onClick={() => navigate('/threat-futures')}
                className="w-full text-left p-1.5 rounded bg-slate-900/60 border border-cyan-500/20 hover:border-cyan-400 text-[10px] text-slate-200 font-mono flex items-center space-x-1.5 transition-colors"
              >
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>Run What-If Analysis</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODAL / POPUP: DETAILED INCIDENT INTELLIGENCE PACKAGE (WHEN MARKER IS CLICKED) */}
      {selectedMarker && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#09101F] border border-cyan-500/50 rounded-lg max-w-lg w-full p-5 shadow-[0_0_25px_rgba(0,240,255,0.25)] space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                  Incident Intelligence Package
                </span>
                <h3 className="text-base font-bold text-white font-mono">{selectedMarker.code}</h3>
              </div>
              <button
                onClick={() => setSelectedMarker(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Site / Location:</span>
                <span className="font-semibold text-white">{selectedMarker.site}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Location Type:</span>
                <span className="text-cyan-300 font-semibold">{selectedMarker.locationType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Risk Score & Severity:</span>
                <span className="font-bold text-red-400">
                  {selectedMarker.risk}/100 ({selectedMarker.severity})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Observed Attack:</span>
                <span className="text-white">{selectedMarker.observedAttack}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Predicted Attack:</span>
                <span className="text-amber-400 font-semibold">{selectedMarker.predictedAttack}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Predicted Target:</span>
                <span className="text-cyan-400 font-bold">{selectedMarker.predictedTarget}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">AI Confidence:</span>
                <span className="text-emerald-400 font-bold">{selectedMarker.confidence}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Assigned Response:</span>
                <span className="text-blue-400 font-bold">
                  {selectedMarker.assignedTeam} (ETA: {selectedMarker.eta})
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedMarker(null);
                  navigate('/incidents');
                }}
                className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded"
              >
                VIEW INCIDENT
              </button>
              <button
                onClick={() => {
                  setSelectedMarker(null);
                  navigate('/evidence');
                }}
                className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded"
              >
                VIEW EVIDENCE
              </button>
              <button
                onClick={() => {
                  setSelectedMarker(null);
                  navigate('/timeline');
                }}
                className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded"
              >
                ATTACK TIMELINE
              </button>
              <button
                onClick={() => {
                  setSelectedMarker(null);
                  navigate('/response-teams');
                }}
                className="py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-900 text-xs font-mono font-bold rounded"
              >
                ALERT RESPONSE TEAM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. PATROL DETAILS SLIDE-OUT DRAWER */}
      {activePatrolDrawer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-[#09101F] border-l border-cyan-500/40 w-96 h-full p-5 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Patrol Unit Dispatch</span>
                  <h3 className="text-base font-bold text-white font-mono">{activePatrolDrawer.name}</h3>
                </div>
                <button
                  onClick={() => setActivePatrolDrawer(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs font-mono text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-500">Current Base:</span>
                  <span className="text-white font-semibold">{activePatrolDrawer.location}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-500">Status:</span>
                  <span className="text-emerald-400 font-bold">{activePatrolDrawer.status}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-500">Transit ETA:</span>
                  <span className="text-cyan-400 font-bold">{activePatrolDrawer.eta}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-500">Assigned Incident:</span>
                  <span className="text-white font-mono">INC-2026-8812</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 border border-cyan-500/20 rounded text-[11px] font-mono text-slate-300 leading-relaxed">
                <span className="text-cyan-400 font-bold block mb-1">Recommended Response:</span>
                Deploy physical site perimeter isolation at Mumbai BKC Datacenter. Secure server room rack containing
                AUTH-SRV-01 and capture volatile forensic memory from AUTH-DECOY-07.
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setActivePatrolDrawer(null);
                  navigate('/incident-map');
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded"
              >
                TRACK PATROL ON MAP
              </button>
              <button
                onClick={() => setActivePatrolDrawer(null)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold rounded"
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
