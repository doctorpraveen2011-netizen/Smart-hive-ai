import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import {
  Shield,
  Plus,
  Minus,
  Locate,
  Maximize2,
  Minimize2,
  ExternalLink,
  Layers,
  Filter,
  Car,
  AlertTriangle,
  Radio,
  FileKey,
  X,
  Compass,
  ChevronRight,
  Send,
  Eye,
} from 'lucide-react';

interface LiveThreatMapProps {
  mode?: 'embedded' | 'standalone' | 'fullscreen';
  height?: string;
  onSelectMarker?: (marker: any) => void;
}

export const LiveThreatMap: React.FC<LiveThreatMapProps> = ({
  mode = 'embedded',
  height = '420px',
  onSelectMarker,
}) => {
  const navigate = useNavigate();

  // Zoom and Pan state for interactive navigation
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(mode === 'fullscreen');

  // Layer filters
  const [layers, setLayers] = useState({
    incidents: true,
    patrols: true,
    decoys: true,
    honeytokens: true,
    predictions: true,
    routes: true,
  });

  // Selected Marker State
  const [selectedPin, setSelectedPin] = useState<any>(null);

  // Live simulation trigger state
  const [criticalPulse, setCriticalPulse] = useState(true);

  // Listen to WebSocket events to update map live
  useSocket({
    'demo:step': (data: any) => {
      if (data.step === 'HONEYTOKEN_ACCESS' || data.step === 'KERBEROS_ATTACK') {
        setCriticalPulse(true);
      }
    },
    'honeytoken:trigger': () => {
      setCriticalPulse(true);
    },
  });

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Center on specific cities
  const centerOnCity = (cityName: string) => {
    switch (cityName) {
      case 'Mumbai':
        setZoom(1.6);
        setPan({ x: -120, y: -80 });
        break;
      case 'Delhi':
        setZoom(1.6);
        setPan({ x: -80, y: 140 });
        break;
      case 'Chennai':
        setZoom(1.6);
        setPan({ x: -160, y: -200 });
        break;
      case 'Bengaluru':
        setZoom(1.6);
        setPan({ x: -100, y: -190 });
        break;
      case 'Hyderabad':
        setZoom(1.6);
        setPan({ x: -140, y: -120 });
        break;
      default:
        handleReset();
    }
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Trigger internal or external selection
  const handleMarkerClick = (markerData: any) => {
    setSelectedPin(markerData);
    if (onSelectMarker) {
      onSelectMarker(markerData);
    }
  };

  return (
    <div
      className={`relative rounded-md overflow-hidden bg-[#070E1B] border border-cyan-500/20 select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : 'w-full'
      }`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* Top Map Action Bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
        {/* Left: Tactical Controls */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {/* Zoom & Pan Group */}
          <div className="flex flex-col space-y-1 bg-[#0D1527]/90 border border-cyan-500/25 rounded p-1 shadow-lg backdrop-blur-md">
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              title="Recenter Map"
              className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
            >
              <Locate className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick City Jump Pills (visible when standalone or fullscreen) */}
          {(mode === 'standalone' || isFullscreen) && (
            <div className="hidden sm:flex items-center space-x-1 bg-[#0D1527]/90 border border-cyan-500/25 rounded p-1 shadow-lg backdrop-blur-md font-mono text-[10px]">
              <button
                onClick={() => handleReset()}
                className="px-2 py-1 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded"
              >
                All India
              </button>
              <button
                onClick={() => centerOnCity('Mumbai')}
                className="px-2 py-1 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded"
              >
                Mumbai
              </button>
              <button
                onClick={() => centerOnCity('Delhi')}
                className="px-2 py-1 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded"
              >
                Delhi
              </button>
              <button
                onClick={() => centerOnCity('Chennai')}
                className="px-2 py-1 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded"
              >
                Chennai
              </button>
              <button
                onClick={() => centerOnCity('Bengaluru')}
                className="px-2 py-1 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded"
              >
                Bengaluru
              </button>
            </div>
          )}
        </div>

        {/* Right: Standalone / Fullscreen and Layer Toggles */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {/* Layer toggles dropdown */}
          <div className="hidden md:flex items-center space-x-1.5 bg-[#0D1527]/90 border border-cyan-500/25 rounded px-2.5 py-1 shadow-lg backdrop-blur-md text-[10px] font-mono text-slate-300">
            <Layers className="w-3.5 h-3.5 text-cyan-400 mr-1" />
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.incidents}
                onChange={(e) => setLayers({ ...layers, incidents: e.target.checked })}
                className="accent-red-500"
              />
              <span>Incidents</span>
            </label>
            <span className="text-slate-600">|</span>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.patrols}
                onChange={(e) => setLayers({ ...layers, patrols: e.target.checked })}
                className="accent-emerald-500"
              />
              <span>Patrols</span>
            </label>
            <span className="text-slate-600">|</span>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.decoys}
                onChange={(e) => setLayers({ ...layers, decoys: e.target.checked })}
                className="accent-purple-500"
              />
              <span>Decoys</span>
            </label>
          </div>

          {/* Separate / Fullscreen Toggle Button */}
          {mode === 'embedded' ? (
            <button
              onClick={() => navigate('/incident-map')}
              title="Open Separate Live Threat Map Page"
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-[#0D1527]/90 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-[10px] font-mono font-bold rounded shadow-lg backdrop-blur-md transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>Open Separately</span>
            </button>
          ) : (
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              className="p-1.5 bg-[#0D1527]/90 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 rounded shadow-lg backdrop-blur-md"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Interactive Map Viewport (Supports Drag & Zoom) */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden`}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.25s ease-out',
            width: '100%',
            height: '100%',
          }}
          className="relative w-full h-full"
        >
          {/* SVG Tactical South Asia Base Map */}
          <svg
            className="w-full h-full object-cover select-none pointer-events-none"
            viewBox="0 0 800 500"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Dark Ocean Shading */}
            <rect width="800" height="500" fill="#070E1B" />

            {/* Tactical Grid Pattern */}
            <defs>
              <pattern id="tacticalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 240, 255, 0.05)" strokeWidth="1" />
              </pattern>
              <radialGradient id="mumbaiPulse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#00F0FF" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="800" height="500" fill="url(#tacticalGrid)" />

            {/* South Asia & Indian Peninsula Outline */}
            <path
              d="M 160 120 Q 220 100 280 80 Q 360 70 420 110 Q 480 140 540 180 Q 560 240 520 280 Q 460 300 420 360 Q 380 430 350 450 Q 330 420 300 360 Q 250 300 220 250 Q 180 200 160 120 Z"
              fill="#0A162C"
              stroke="rgba(0, 240, 255, 0.25)"
              strokeWidth="1.5"
            />

            {/* Sri Lanka */}
            <ellipse cx="370" cy="460" rx="14" ry="20" fill="#0A162C" stroke="rgba(0, 240, 255, 0.25)" strokeWidth="1" />

            {/* Geographic Country & Body of Water Labels */}
            <text x="180" y="160" fill="#475569" fontSize="11" fontFamily="sans-serif">Pakistan</text>
            <text x="350" y="240" fill="#64748B" fontSize="16" fontWeight="bold" fontFamily="sans-serif" letterSpacing="2">India</text>
            <text x="440" y="180" fill="#475569" fontSize="11" fontFamily="sans-serif">Nepal</text>
            <text x="510" y="240" fill="#475569" fontSize="11" fontFamily="sans-serif">Bangladesh</text>
            <text x="350" y="490" fill="#475569" fontSize="9" fontFamily="sans-serif">Sri Lanka</text>
            <text x="150" y="380" fill="#1E293B" fontSize="11" fontStyle="italic" fontFamily="sans-serif">Arabian Sea</text>
            <text x="460" y="380" fill="#1E293B" fontSize="11" fontStyle="italic" fontFamily="sans-serif">Bay of Bengal</text>

            {/* Major Hub Cities */}
            <text x="330" y="145" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">New Delhi</text>
            <text x="240" y="315" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">Mumbai</text>
            <text x="310" y="395" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">Bengaluru</text>
            <text x="380" y="405" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">Chennai</text>
            <text x="360" y="335" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">Hyderabad</text>

            {/* Tactical Transit Vectors / Routes */}
            {layers.routes && (
              <>
                <line x1="330" y1="160" x2="310" y2="210" stroke="rgba(249, 115, 22, 0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="310" y1="210" x2="270" y2="310" stroke="rgba(0, 240, 255, 0.5)" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="270" y1="310" x2="350" y2="390" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="270" y1="310" x2="360" y2="335" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="1" strokeDasharray="3 3" />
              </>
            )}

            {/* Active Session Concentric Pulse Rings on Mumbai */}
            <circle cx="270" cy="310" r="50" fill="url(#mumbaiPulse)" />
            <circle cx="270" cy="310" r="35" fill="none" stroke="#00F0FF" strokeWidth="1.5" opacity="0.6" strokeDasharray="5 3" />
            <circle cx="270" cy="310" r="20" fill="none" stroke="#00F0FF" strokeWidth="1" opacity="0.8" />
          </svg>

          {/* Interactive HTML Marker Layers Placed Over SVG Coordinate Space */}

          {/* 1. New Delhi: High Risk / Incident Marker */}
          {layers.incidents && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleMarkerClick({
                  code: 'INC-DEL-01',
                  site: 'SmartCorp Delhi Operations',
                  locationType: 'ORGANIZATION_SITE',
                  risk: 78,
                  severity: 'HIGH',
                  observedAttack: 'Service Enumeration & Port Scan',
                  predictedAttack: 'Privilege Escalation Attempt',
                  predictedTarget: 'DEV-SRV-01',
                  confidence: 81,
                  evidenceCount: 4,
                  assignedTeam: 'Patrol Team 3',
                  eta: '12 minutes',
                });
              }}
              className="absolute top-[32%] left-[40%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
            >
              <div className="w-6 h-6 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse">
                <div className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                  !
                </div>
              </div>
            </div>
          )}

          {/* 2. Patrol Team 1 En Route to Mumbai (Green Shield with Tooltip) */}
          {layers.patrols && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleMarkerClick({
                  code: 'PATROL-01',
                  site: 'Patrol Team 1 (En Route)',
                  locationType: 'RESPONSE_TEAM_LOCATION',
                  risk: 15,
                  severity: 'DISPATCHED',
                  observedAttack: 'Securing Perimeter',
                  predictedAttack: 'On Schedule (6m ETA)',
                  predictedTarget: 'AUTH-SRV-01',
                  confidence: 99,
                  evidenceCount: 0,
                  assignedTeam: 'Patrol Team 1 (Alpha Unit)',
                  eta: '6 minutes',
                });
              }}
              className="absolute top-[44%] left-[34%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
            >
              {/* Tooltip bubble matching screenshot */}
              <div className="absolute -top-7 -left-12 bg-slate-900/95 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/40 shadow-lg whitespace-nowrap">
                Patrol Team 1 (6m)
              </div>
              <div className="w-6 h-6 rounded-full bg-emerald-600/30 border border-emerald-400 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.8)]">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          )}

          {/* 3. Mumbai: Critical Incident & Active Threat Session */}
          {layers.incidents && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleMarkerClick({
                  code: 'INC-MUM-8812',
                  site: 'SmartCorp Mumbai Datacenter',
                  locationType: 'SIMULATED_INCIDENT_SITE',
                  risk: 91,
                  severity: 'CRITICAL',
                  observedAttack: 'Credential Discovery (Kerberoasting)',
                  predictedAttack: 'Credential Access Attempt',
                  predictedTarget: 'AUTH-SRV-01',
                  confidence: 84,
                  evidenceCount: 6,
                  assignedTeam: 'Patrol Team 1',
                  eta: '6 minutes',
                });
              }}
              className="absolute top-[62%] left-[33%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-30"
            >
              <div className="w-7 h-7 rounded-full bg-blue-500/30 border border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.8)]">
                <div className="w-3.5 h-3.5 bg-red-600 rounded-full animate-ping absolute"></div>
                <div className="w-3.5 h-3.5 bg-red-600 rounded-full border border-white"></div>
              </div>
            </div>
          )}

          {/* 4. Central India Decoy System (Orange Decoy) */}
          {layers.decoys && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleMarkerClick({
                  code: 'DECOY-CENTRAL-01',
                  site: 'Central Cloud Gateway Decoy',
                  locationType: 'DECOY_SYSTEM_LOCATION',
                  risk: 45,
                  severity: 'ARMED',
                  observedAttack: 'Monitoring Honeynet Subnet',
                  predictedAttack: 'Zero Infiltration',
                  predictedTarget: 'AUTH-DECOY-07',
                  confidence: 95,
                  evidenceCount: 3,
                  assignedTeam: 'Automated Deception Orchestrator',
                  eta: 'Active',
                });
              }}
              className="absolute top-[43%] left-[43%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
            >
              <div className="w-5 h-5 rounded-full bg-amber-500/30 border border-amber-400 flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.6)]">
                <div className="w-2.5 h-2.5 bg-amber-400 rounded-full"></div>
              </div>
            </div>
          )}

          {/* 5. Chennai: Critical Incident SH-2026-001 (Honeytoken Trigger) */}
          {layers.honeytokens && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleMarkerClick({
                  code: 'SH-2026-001',
                  site: 'SmartCorp Chennai HQ',
                  locationType: 'SIMULATED_INCIDENT_SITE',
                  risk: 91,
                  severity: 'CRITICAL',
                  observedAttack: 'Honeytoken Access Detected',
                  predictedAttack: 'Authentication Abuse',
                  predictedTarget: 'FILE-SRV-01',
                  confidence: 90,
                  evidenceCount: 6,
                  assignedTeam: 'Patrol Team 2',
                  eta: '8 minutes',
                });
              }}
              className="absolute top-[80%] left-[47%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
            >
              <div className="w-6 h-6 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse">
                <div className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                  !
                </div>
              </div>
            </div>
          )}

          {/* 6. Bengaluru: Decoy System */}
          {layers.decoys && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleMarkerClick({
                  code: 'DECOY-BLR-01',
                  site: 'SmartCorp Bengaluru R&D',
                  locationType: 'DECOY_SYSTEM_LOCATION',
                  risk: 55,
                  severity: 'MEDIUM',
                  observedAttack: 'SSH Decoy Interaction',
                  predictedAttack: 'Brute Force Escalation',
                  predictedTarget: 'SSH-DECOY-01',
                  confidence: 88,
                  evidenceCount: 5,
                  assignedTeam: 'Patrol Team 4',
                  eta: '12 minutes',
                });
              }}
              className="absolute top-[78%] left-[39%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
            >
              <div className="w-5 h-5 rounded-full bg-purple-600/30 border border-purple-400 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.6)]">
                <div className="w-2.5 h-2.5 bg-purple-400 rounded-full"></div>
              </div>
            </div>
          )}

          {/* 7. South India Patrol Unit (Green Shield) */}
          {layers.patrols && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleMarkerClick({
                  code: 'PATROL-02',
                  site: 'Patrol Team 2 (Bravo Unit)',
                  locationType: 'RESPONSE_TEAM_LOCATION',
                  risk: 10,
                  severity: 'DISPATCHED',
                  observedAttack: 'En Route to Chennai HQ',
                  predictedAttack: 'On Schedule (8m ETA)',
                  predictedTarget: 'FILE-SRV-01',
                  confidence: 99,
                  evidenceCount: 0,
                  assignedTeam: 'Patrol Team 2',
                  eta: '8 minutes',
                });
              }}
              className="absolute top-[88%] left-[45%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-600/30 border border-emerald-400 flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.8)]">
                <Shield className="w-3 h-3 text-emerald-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Map Legend matching exact screenshot layout (Right-hand side) */}
      <div className="absolute top-3 right-3 bg-[#0D1527]/90 border border-cyan-500/25 rounded-md p-3 text-xs w-48 shadow-xl backdrop-blur-md z-20 space-y-2 pointer-events-auto">
        <div className="font-bold text-white text-[11px] pb-1 border-b border-cyan-500/20 tracking-wider uppercase font-mono">
          Map Legend
        </div>
        <div className="space-y-1.5 text-[10px] text-slate-300">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_6px_#EF4444]"></span>
            <span>High Risk Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Medium Risk Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span>Decoy System</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-white"></span>
            <span>Honeytoken Trigger</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
            <span>Patrol Team</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Active Session</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full border border-dashed border-cyan-400"></span>
            <span>Predicted Target</span>
          </div>
        </div>

        {/* Threat Level sub-legend */}
        <div className="pt-2 border-t border-cyan-500/20">
          <div className="font-bold text-white text-[10px] pb-1 font-mono uppercase">Threat Level</div>
          <div className="space-y-1 text-[10px] text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Critical</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span>High</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Low</span>
            </div>
          </div>
        </div>
      </div>

      {/* Marker Intelligence Popup Modal (Section 13) */}
      {selectedPin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#09101F] border border-cyan-500/50 rounded-lg max-w-lg w-full p-5 shadow-[0_0_25px_rgba(0,240,255,0.25)] space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                  Incident Intelligence Package
                </span>
                <h3 className="text-base font-bold text-white font-mono">{selectedPin.code}</h3>
              </div>
              <button onClick={() => setSelectedPin(null)} className="text-slate-400 hover:text-white p-1 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Site Location:</span>
                <span className="font-semibold text-white">{selectedPin.site}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Location Type:</span>
                <span className="text-cyan-300 font-semibold">{selectedPin.locationType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Risk Score & Severity:</span>
                <span className="font-bold text-red-400">
                  {selectedPin.risk} / 100 ({selectedPin.severity})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Observed Attack:</span>
                <span className="text-white">{selectedPin.observedAttack}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Predicted Attack:</span>
                <span className="text-amber-400 font-semibold">{selectedPin.predictedAttack}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Predicted Target:</span>
                <span className="text-cyan-400 font-bold">{selectedPin.predictedTarget}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Confidence:</span>
                <span className="text-emerald-400 font-bold">{selectedPin.confidence}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Evidence Records:</span>
                <span className="text-slate-200">{selectedPin.evidenceCount} records</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Assigned Response:</span>
                <span className="text-blue-400 font-bold">
                  {selectedPin.assignedTeam} (ETA: {selectedPin.eta})
                </span>
              </div>
            </div>

            {/* Modal Actions matching Section 13: VIEW INCIDENT, VIEW EVIDENCE, ATTACK TIMELINE, ALERT RESPONSE TEAM */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedPin(null);
                  navigate('/incidents');
                }}
                className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded"
              >
                VIEW INCIDENT
              </button>
              <button
                onClick={() => {
                  setSelectedPin(null);
                  navigate('/evidence');
                }}
                className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded"
              >
                VIEW EVIDENCE
              </button>
              <button
                onClick={() => {
                  setSelectedPin(null);
                  navigate('/timeline');
                }}
                className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded"
              >
                ATTACK TIMELINE
              </button>
              <button
                onClick={() => {
                  setSelectedPin(null);
                  navigate('/response-teams');
                }}
                className="py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-900 text-xs font-mono font-bold rounded shadow-[0_0_10px_rgba(0,240,255,0.2)]"
              >
                ALERT RESPONSE TEAM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
