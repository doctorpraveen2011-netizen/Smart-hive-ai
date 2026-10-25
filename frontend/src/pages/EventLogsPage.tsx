import React, { useState } from 'react';
import { Terminal, Search, Filter, Download, Database, ShieldAlert } from 'lucide-react';

export const EventLogsPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const [events, setEvents] = useState([
    {
      time: '14:26:31.104',
      srcIp: '192.168.1.45',
      dstIp: '10.0.4.15',
      port: '88 (Kerberos)',
      proto: 'TCP',
      tactic: 'T1558.003 - Kerberoasting',
      payload: 'TGS-REQ: krbtgt/SMARTCORP.LOCAL@SMARTCORP.LOCAL',
      hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      result: 'DIVERTED_TO_DECOY',
    },
    {
      time: '14:23:51.884',
      srcIp: '192.168.1.45',
      dstIp: '10.0.3.22',
      port: '445 (SMB)',
      proto: 'TCP',
      tactic: 'T1083 - File Access',
      payload: 'SMB2_CREATE: \\FILE-SRV-01\\Confidential\\admin_backup_password.txt',
      hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      result: 'HONEYTOKEN_TRIGGERED',
    },
    {
      time: '14:22:16.421',
      srcIp: '192.168.1.45',
      dstIp: '10.0.5.10',
      port: '22 (SSH)',
      proto: 'TCP',
      tactic: 'T1110 - Brute Force',
      payload: 'SSH-2.0-OpenSSH_8.2p1 UserAuth: root / Admin2026!',
      hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      result: 'CAPTURED_BY_SSH_DECOY',
    },
    {
      time: '14:21:08.310',
      srcIp: '192.168.1.45',
      dstIp: '10.0.1.5',
      port: '445 / 88 / 3389',
      proto: 'TCP',
      tactic: 'T1046 - Port Scan',
      payload: 'SYN Stealth Scan: 64 packets across ports 20-445',
      hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
      result: 'PROFILE_UPDATED',
    },
    {
      time: '14:20:10.052',
      srcIp: '192.168.1.45',
      dstIp: '10.0.1.1',
      port: '80 / 443',
      proto: 'TCP',
      tactic: 'T1595 - Active Scanning',
      payload: 'GET /robots.txt HTTP/1.1 User-Agent: Mozilla/5.0 (Kali Linux)',
      hash: '01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b',
      result: 'SESSION_INITIALIZED',
    },
  ]);

  const filtered = events.filter(
    (e) =>
      e.tactic.toLowerCase().includes(search.toLowerCase()) ||
      e.srcIp.toLowerCase().includes(search.toLowerCase()) ||
      e.payload.toLowerCase().includes(search.toLowerCase()) ||
      e.port.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 max-w-[1720px] mx-auto pb-8">
      {/* Header */}
      <div className="soc-panel rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              Ingested Telemetry & Event Logs
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Live telemetry ingestion stream from real Kaggle honeypot datasets (AWS & Dionaea CUIP-X25) with
            cryptographic payload hashes.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right text-xs font-mono">
            <span className="text-slate-400">Dataset Source: </span>
            <span className="text-cyan-400 font-bold">AWS Honeypot / Kaggle</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payload, IP, port, or MITRE tactic..."
            className="w-full bg-[#0D1527] border border-cyan-500/20 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
          />
        </div>
      </div>

      {/* Events Table */}
      <div className="soc-panel rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0A1122] text-slate-400 border-b border-cyan-500/20">
              <tr>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Timestamp</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Source → Dest</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Port / Proto</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">MITRE Tactic</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Payload & Hash</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((evt, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-400 text-[11px]">{evt.time}</td>
                  <td className="py-3 px-4 text-slate-200">
                    <div>{evt.srcIp}</div>
                    <div className="text-[10px] text-cyan-400">→ {evt.dstIp}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div>{evt.port}</div>
                    <div className="text-[10px] text-slate-500">{evt.proto}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-white">{evt.tactic}</td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="text-slate-200 truncate">{evt.payload}</div>
                    <div className="text-[9px] text-slate-500 font-mono truncate">
                      SHA256: {evt.hash.substring(0, 24)}...
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                        evt.result.includes('HONEYTOKEN')
                          ? 'bg-red-500/20 text-red-400 border-red-500/40'
                          : evt.result.includes('DIVERTED')
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      }`}
                    >
                      {evt.result}
                    </span>
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
