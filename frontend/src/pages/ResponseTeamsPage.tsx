import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { ResponseTeam } from '../types';
import { Users, Shield, MapPin, Clock, Car, ChevronRight, X, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ResponseTeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<any[]>([
    {
      id: '1',
      name: 'Patrol Team 1 (Alpha Unit)',
      callsign: 'PATROL-ALPHA',
      location: 'Mumbai BKC Datacenter',
      status: 'On Route',
      eta: '6 min',
      distance: '3.2 km',
      assignedIncident: 'INC-2026-8812 (Mumbai)',
      officers: ['Officer R. Sharma', 'Specialist V. Nair'],
      equipment: ['Faraday Cage Kit', 'Airgap Forensic USB', 'Perimeter Jammer'],
    },
    {
      id: '2',
      name: 'Patrol Team 2 (Bravo Unit)',
      callsign: 'PATROL-BRAVO',
      location: 'Chennai Regional Campus',
      status: 'On Route',
      eta: '6 min',
      distance: '4.8 km',
      assignedIncident: 'SH-2026-001 (Chennai)',
      officers: ['Officer K. Raman', 'Analyst S. Priya'],
      equipment: ['Forensic Workstation', 'Hardware Key Decoupler'],
    },
    {
      id: '3',
      name: 'Patrol Team 3 (Charlie Unit)',
      callsign: 'PATROL-CHARLIE',
      location: 'Delhi Operations Hub',
      status: 'Monitoring',
      eta: '12 min',
      distance: '8.5 km',
      assignedIncident: 'INC-DEL-01 (Delhi)',
      officers: ['Officer A. Verma', 'Tech Specialist D. Kumar'],
      equipment: ['Network Tap', 'Emergency Fiber Cutters'],
    },
    {
      id: '4',
      name: 'Patrol Team 4 (Delta Unit)',
      callsign: 'PATROL-DELTA',
      location: 'Bengaluru R&D Tech Center',
      status: 'Monitoring',
      eta: '12 min',
      distance: '7.1 km',
      assignedIncident: 'Monitoring Active Honeytokens',
      officers: ['Officer M. Hegde', 'Forensic Lead P. Rao'],
      equipment: ['Memory Capture Dongles', 'Encrypted Comm Link'],
    },
    {
      id: '5',
      name: 'Patrol Team 5 (Echo Unit)',
      callsign: 'PATROL-ECHO',
      location: 'Hyderabad Campus',
      status: 'On Site',
      eta: 'Standby',
      distance: '0.5 km',
      assignedIncident: 'Perimeter Secured',
      officers: ['Officer T. Reddy', 'Specialist N. Joshi'],
      equipment: ['Server Rack Lockout Bars', 'LTE Hotspot Backups'],
    },
  ]);

  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);

  useSocket({
    'response:assigned': (data: any) => {
      setTeams((prev) =>
        prev.map((t) => (t.id === '1' ? { ...t, status: 'On Route', eta: '6 min' } : t))
      );
    },
    'response:updated': (data: any) => {
      setTeams((prev) =>
        prev.map((t) => (t.id === data.teamId ? { ...t, status: data.status, eta: data.eta } : t))
      );
    },
  });

  return (
    <div className="space-y-4 max-w-[1720px] mx-auto pb-8">
      {/* Header */}
      <div className="soc-panel rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              Tactical Response Units & Patrol Coordination
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Autonomous dispatch and real-time transit telemetry for SmartCorp on-site physical security units
            and cyber-first responder teams.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded">
            5 Deployed Units Active
          </span>
        </div>
      </div>

      {/* Response Teams Table matching Section 15 */}
      <div className="soc-panel rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0A1122] text-slate-400 border-b border-cyan-500/20">
              <tr>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Team & Callsign</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Current Location</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Assigned Target / Mission</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Transit ETA</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Status</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {teams.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedTeam(t)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-bold text-white flex items-center space-x-2">
                    <Car className="w-3.5 h-3.5 text-cyan-400" />
                    <div>
                      <div>{t.name}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{t.callsign}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{t.location}</td>
                  <td className="py-3 px-4 text-cyan-400 font-medium">{t.assignedIncident}</td>
                  <td className="py-3 px-4 font-bold text-slate-200">{t.eta}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                        t.status === 'On Route'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : t.status === 'On Site'
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                          : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                      }`}
                    >
                      • {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTeam(t);
                      }}
                      className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-[10px] font-bold transition-all"
                    >
                      View Intelligence →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Response Intelligence Package Drawer (Section 35) */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#09101F] border border-cyan-500/50 rounded-lg max-w-lg w-full p-5 shadow-[0_0_25px_rgba(0,240,255,0.25)] space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                  Response Intelligence Package (Section 35)
                </span>
                <h3 className="text-base font-bold text-white font-mono">{selectedTeam.name}</h3>
              </div>
              <button
                onClick={() => setSelectedTeam(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Callsign:</span>
                <span className="text-white font-bold">{selectedTeam.callsign}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Current Base:</span>
                <span className="text-white">{selectedTeam.location}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Assigned Incident:</span>
                <span className="text-red-400 font-bold">{selectedTeam.assignedIncident}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Transit ETA / Distance:</span>
                <span className="text-emerald-400 font-bold">
                  {selectedTeam.eta} ({selectedTeam.distance})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Assigned Officers:</span>
                <span className="text-slate-200">{selectedTeam.officers.join(', ')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Forensic Kit:</span>
                <span className="text-slate-400">{selectedTeam.equipment.join(' • ')}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/90 border border-cyan-500/20 rounded text-[11px] font-mono text-slate-300">
              <span className="text-cyan-400 font-bold block mb-1">Tactical Response Protocol:</span>
              Secure physical server rack containing target asset. Capture volatile memory dump from honeypot
              hypervisor. Verify airgap isolation between production subnet and shadow network.
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedTeam(null);
                  navigate('/incident-map');
                }}
                className="py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-900 text-xs font-mono font-bold rounded"
              >
                TRACK ON MAP
              </button>
              <button
                onClick={() => setSelectedTeam(null)}
                className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold rounded"
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
