import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { Incident } from '../types';
import {
  AlertCircle,
  Shield,
  CheckCircle2,
  Users,
  MapPin,
  ChevronRight,
  X,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const IncidentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const fetchIncidents = async () => {
    try {
      const res = await api.getIncidents();
      setIncidents(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  useSocket({
    'incident:update': () => fetchIncidents(),
    'incident:created': () => fetchIncidents(),
    'demo:reset': () => fetchIncidents(),
  });

  const handleStatusChange = async (incidentId: string, newStatus: string) => {
    try {
      await api.updateIncidentStatus(incidentId, newStatus);
      await fetchIncidents();
      if (selectedIncident?.id === incidentId) {
        setSelectedIncident((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4 max-w-[1720px] mx-auto pb-8">
      {/* Header */}
      <div className="soc-panel rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              Incident Management & Containment Lifecycle
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Correlated high-severity cyber and physical security incidents with target assets, response teams,
            and automated containment transitions.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 bg-red-500/20 text-red-400 border border-red-500/40 rounded font-semibold">
            {incidents.filter((i) => i.status !== 'CLOSED').length} Active Incidents
          </span>
        </div>
      </div>

      {/* Incidents List Table */}
      <div className="soc-panel rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0A1122] text-slate-400 border-b border-cyan-500/20">
              <tr>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Code</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Title & Site</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Target Asset</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Severity & Risk</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Assigned Team</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Status</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {incidents.map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">{inc.incidentCode}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-white text-xs">{inc.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{inc.site?.name}</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-300">
                    {inc.targetAsset?.hostname || 'AUTH-SRV-01'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`font-mono font-bold text-[9px] px-2 py-0.5 rounded border uppercase ${
                          inc.severity === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-400 border-red-500/40'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        }`}
                      >
                        {inc.severity}
                      </span>
                      <span className="font-mono text-slate-400 font-bold">{inc.risk}/100</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {inc.responseAssignments?.[0]?.responseTeam?.name || 'Patrol Team 1'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                        inc.status === 'CONTAINED'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : inc.status === 'DISPATCHED'
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                          : 'bg-red-500/20 text-red-400 border-red-500/40'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIncident(inc);
                      }}
                      className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-[10px] font-bold transition-all"
                    >
                      Dossier →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Incident Dossier Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#09101F] border border-cyan-500/50 rounded-lg max-w-lg w-full p-5 shadow-[0_0_25px_rgba(0,240,255,0.25)] space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                  Incident Intelligence Record
                </span>
                <h3 className="text-base font-bold text-white font-mono">{selectedIncident.incidentCode}</h3>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Incident Title:</span>
                <span className="text-white font-semibold">{selectedIncident.title}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Site Location:</span>
                <span className="text-white">{selectedIncident.site?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Target Asset:</span>
                <span className="text-cyan-400 font-bold">
                  {selectedIncident.targetAsset?.hostname || 'AUTH-SRV-01'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Severity & Risk:</span>
                <span className="font-bold text-red-400">
                  {selectedIncident.severity} ({selectedIncident.risk}/100)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Lifecycle Status:</span>
                <span className="text-emerald-400 font-bold">{selectedIncident.status}</span>
              </div>
            </div>

            {/* Lifecycle Action Buttons */}
            <div className="pt-2 space-y-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Update Lifecycle State:</div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleStatusChange(selectedIncident.id, 'INVESTIGATING')}
                  className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded"
                >
                  INVESTIGATING
                </button>
                <button
                  onClick={() => handleStatusChange(selectedIncident.id, 'DISPATCHED')}
                  className="py-1.5 bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs font-mono font-bold rounded border border-blue-500/40"
                >
                  DISPATCH
                </button>
                <button
                  onClick={() => handleStatusChange(selectedIncident.id, 'CONTAINED')}
                  className="py-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-mono font-bold rounded border border-emerald-500/40"
                >
                  CONTAIN
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    setSelectedIncident(null);
                    navigate('/incident-map');
                  }}
                  className="py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-900 text-xs font-mono font-bold rounded"
                >
                  VIEW ON MAP
                </button>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold rounded"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
