import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Report } from '../types';
import {
  FileText,
  Download,
  Printer,
  Shield,
  CheckCircle2,
  Lock,
  Calendar,
  AlertTriangle,
  Clock,
  ChevronRight,
  Code,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await api.getReports();
      setReports(res.data || []);
      if (res.data?.length > 0) {
        const full = await api.getReportById(res.data[0].id);
        setSelectedReport(full.data);
      } else {
        // Fallback default report matching Section 18
        setSelectedReport({
          reportCode: 'SSH-2026-001',
          title: 'Executive Incident Response Report',
          createdAt: '2026-10-19T14:56:00Z',
          sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          executiveSummary:
            'SmartHive AI autonomously detected early credential discovery against AUTH-SRV-01, diverted the session to AUTH-DECOY-07, and dispatched Patrol Team 1 with zero production impact.',
          attackLeadTimeSeconds: 327,
          predictionAccuracy: 0.92,
          incident: {
            title: 'Honeytoken Access Detected',
            incidentCode: 'INC-2026-8812',
            severity: 'CRITICAL',
            risk: 91,
          },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    if (!selectedReport) return;
    const jsonStr = JSON.stringify(selectedReport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedReport.reportCode || 'SSH-2026-001'}_forensics.json`;
    a.click();
  };

  return (
    <div className="space-y-4 max-w-[1720px] mx-auto pb-8">
      {/* Header */}
      <div className="soc-panel rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              Executive Incident & Forensic Reports
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Audit-ready security intelligence summaries covering prediction accuracy, Threat Futures evaluations,
            deception diversion logs, SHA-256 evidence integrity hashes, and containment verification.
          </p>
        </div>

        {/* Action Buttons: PDF, JSON, Print */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded bg-red-950/60 border border-red-500/40 text-red-300 font-bold hover:bg-red-900 flex items-center space-x-1"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print View / PDF</span>
          </button>
          <button
            onClick={handleDownloadJson}
            className="px-3 py-1.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold hover:bg-cyan-900 flex items-center space-x-1 shadow-[0_0_8px_rgba(0,240,255,0.15)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON</span>
          </button>
        </div>
      </div>

      {/* Main Report Viewer matching Section 18 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Reports Selector (4 of 12) */}
        <div className="lg:col-span-4 soc-panel rounded-lg p-4 space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono pb-2 border-b border-cyan-500/15">
            Archived Incident Reports
          </h2>

          <div className="space-y-2">
            {[
              {
                code: 'SSH-2026-001',
                title: 'Kerberoasting & AD Deception Dossier',
                date: '19 Oct 2026, 14:56',
                leadTime: '5m 27s',
                status: 'CONTAINED',
              },
              {
                code: 'SSH-2026-002',
                title: 'SSH Decoy Credential Harvesting',
                date: '18 Oct 2026, 11:22',
                leadTime: '4m 10s',
                status: 'CONTAINED',
              },
              {
                code: 'SSH-2026-003',
                title: 'Customer SQL Decoy Exfiltration Attempt',
                date: '17 Oct 2026, 09:44',
                leadTime: '6m 02s',
                status: 'CLOSED',
              },
            ].map((rep) => (
              <div
                key={rep.code}
                onClick={() =>
                  setSelectedReport((prev: any) => ({
                    ...prev,
                    reportCode: rep.code,
                    title: rep.title,
                    createdAt: rep.date,
                  }))
                }
                className="p-3 rounded-md bg-[#09101F] border border-cyan-500/15 hover:border-cyan-400 cursor-pointer transition-all space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-cyan-400">{rep.code}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    {rep.status}
                  </span>
                </div>
                <div className="text-xs text-white font-medium">{rep.title}</div>
                <div className="text-[10px] text-slate-500 font-mono flex justify-between pt-1">
                  <span>{rep.date}</span>
                  <span className="text-cyan-300">Lead Time: {rep.leadTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Report Content (8 of 12) */}
        <div className="lg:col-span-8 soc-panel rounded-lg p-6 space-y-6">
          {/* Report Top Meta */}
          <div className="border-b border-cyan-500/20 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase font-bold">
                SmartHive Autonomous Incident Audit Report
              </div>
              <h2 className="text-lg font-bold text-white font-mono mt-1">
                {selectedReport?.reportCode || 'SSH-2026-001'} — {selectedReport?.title}
              </h2>
            </div>
            <div className="text-right text-xs font-mono text-slate-400">
              <div>Generated: 19 Oct 2026, 14:56</div>
              <div className="text-emerald-400 font-bold mt-0.5">STATUS: FULLY CONTAINED</div>
            </div>
          </div>

          {/* Key Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#09101F] p-3 rounded-lg border border-cyan-500/20 text-center font-mono">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Attack Lead Time</div>
              <div className="text-base font-bold text-emerald-400">5m 27s</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Prediction Accuracy</div>
              <div className="text-base font-bold text-cyan-400">92.4%</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Production Impact</div>
              <div className="text-base font-bold text-emerald-400">0.00% (Isolated)</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Evidence Records</div>
              <div className="text-base font-bold text-purple-300">14 Verified</div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              1. Executive Incident Summary
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-[#09101F] p-3 rounded border border-slate-800">
              {selectedReport?.executiveSummary ||
                'SmartHive AI autonomously detected early credential discovery against AUTH-SRV-01, diverted the session to AUTH-DECOY-07, and dispatched Patrol Team 1 with zero production impact.'}
            </p>
          </div>

          {/* Forensic Evidence Integrity */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              2. Cryptographic Integrity Seal
            </h3>
            <div className="bg-[#050A14] border border-cyan-500/30 rounded p-3 font-mono text-xs text-slate-300 space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>SHA-256 Checksum:</span>
                <span className="text-cyan-400 font-bold">
                  {selectedReport?.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Verification Authority:</span>
                <span className="text-emerald-400">SmartHive Forensic Evidence Engine</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
