import React, { useState } from 'react';
import { LiveThreatMap } from '../components/map/LiveThreatMap';
import { MapPin, Users, ShieldAlert, Radio, AlertTriangle, Shield, Car, ChevronRight, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const IncidentMapPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedIncidentInfo, setSelectedIncidentInfo] = useState<any>(null);

  const sites = [
    { name: 'SmartCorp Mumbai Datacenter (MUM-01)', lat: 19.076, lng: 72.877, risk: 91, status: 'CRITICAL', threat: 'Credential Discovery (Kerberoasting)' },
    { name: 'SmartCorp Chennai HQ (CHN-01)', lat: 13.082, lng: 80.27, risk: 91, status: 'CRITICAL', threat: 'Honeytoken Access Detected' },
    { name: 'SmartCorp Delhi Operations (DEL-01)', lat: 28.704, lng: 77.102, risk: 78, status: 'HIGH', threat: 'Service Enumeration' },
    { name: 'SmartCorp Bengaluru Tech Center (BLR-01)', lat: 12.971, lng: 77.594, risk: 55, status: 'MEDIUM', threat: 'Decoy Interaction (SSH-DECOY-01)' },
    { name: 'SmartCorp Hyderabad Campus (HYD-01)', lat: 17.385, lng: 78.486, risk: 38, status: 'LOW', threat: 'Anomalous Data Access' },
  ];

  return (
    <div className="space-y-4 max-w-[1720px] mx-auto pb-8 font-sans">
      {/* Page Header */}
      <div className="soc-panel rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              Live Threat Map — Standalone Operational View
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl font-mono">
            Dedicated geospatial command center rendering real-time threat telemetry, honeynet decoys, active
            sessions, and response patrol routing with interactive zoom, pan, and layer filters.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300">Live Satellite Telemetry Synced</span>
        </div>
      </div>

      {/* Main Grid: Standalone Live Threat Map (8/12) + Regional Site Dossier (4/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Standalone Map Container */}
        <div className="lg:col-span-8 soc-panel rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15 mb-3">
            <div>
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center space-x-2">
                <span>South Asia Tactical Cartography</span>
              </h2>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Drag to pan • Click +/- to zoom • Click markers for intelligence packages
              </p>
            </div>
            <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-1 rounded border border-cyan-500/30">
              STANDALONE MODE
            </div>
          </div>

          <LiveThreatMap
            mode="standalone"
            height="580px"
            onSelectMarker={(m) => setSelectedIncidentInfo(m)}
          />
        </div>

        {/* Right Side: Regional Sites & Live Patrol Overview */}
        <div className="lg:col-span-4 space-y-4">
          {/* Regional Hubs List */}
          <div className="soc-panel rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/15">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                SmartCorp Operational Sites (5)
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">All Monitored</span>
            </div>

            <div className="space-y-2">
              {sites.map((site) => (
                <div
                  key={site.name}
                  className="p-2.5 rounded bg-[#09101F] border border-cyan-500/15 hover:border-cyan-400/50 transition-colors text-xs font-mono space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate max-w-[200px]">{site.name}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase ${
                        site.status === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-400 border-red-500/40'
                          : site.status === 'HIGH'
                          ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                          : site.status === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      }`}
                    >
                      {site.risk}/100
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">{site.threat}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Patrol Transits Card */}
          <div className="soc-panel rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/15">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Live Patrol Transits
              </h3>
              <button
                onClick={() => navigate('/response-teams')}
                className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300"
              >
                Dispatch Hub →
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#09101F] border border-cyan-500/20 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Car className="w-3.5 h-3.5 text-emerald-400" />
                  <div>
                    <div className="text-white font-bold">Patrol Team 1 (Alpha)</div>
                    <div className="text-[10px] text-slate-400">Target: Mumbai BKC Datacenter</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">6m ETA</span>
                  <span className="text-[9px] text-slate-500">On Route</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#09101F] border border-cyan-500/20 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Car className="w-3.5 h-3.5 text-emerald-400" />
                  <div>
                    <div className="text-white font-bold">Patrol Team 2 (Bravo)</div>
                    <div className="text-[10px] text-slate-400">Target: Chennai Regional HQ</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">8m ETA</span>
                  <span className="text-[9px] text-slate-500">On Route</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
