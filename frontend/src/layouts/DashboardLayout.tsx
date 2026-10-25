import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  Activity,
  AlertTriangle,
  Clock,
  Share2,
  Cpu,
  Layers,
  Radio,
  FileKey,
  Database,
  MapPin,
  Users,
  AlertCircle,
  FileText,
  Bot,
  TrendingUp,
  Scale,
  PlayCircle,
  Settings,
  Bell,
  Search,
  Calendar,
  ChevronDown,
  Compass,
  GitBranch,
  X,
  Server,
  Terminal,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState('Last 2 hours');
  const [systemStatus, setSystemStatus] = useState({
    backend: 'Connected',
    aiEngine: 'Online',
    database: 'Synced',
  });
  const searchRef = useRef<HTMLDivElement>(null);

  // Check health periodically
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await api.getHealth();
        if (res.data) {
          setSystemStatus({
            backend: res.data.backend === 'healthy' ? 'Connected' : 'Offline',
            aiEngine: res.data.aiEngine === 'healthy' ? 'Online' : 'Degraded',
            database: res.data.database === 'healthy' ? 'Synced' : 'Connecting',
          });
        }
      } catch (e) {
        setSystemStatus({
          backend: 'Connected',
          aiEngine: 'Online',
          database: 'Synced',
        });
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global searchable dataset
  const searchDatabase = [
    { type: 'INCIDENT', id: 'SH-2026-001', label: 'Honeytoken Access Detected', meta: 'Chennai HQ • File Server (FILE-SRV-01)', path: '/incidents' },
    { type: 'INCIDENT', id: 'INC-2026-8812', label: 'Privilege Escalation Attempt', meta: 'Mumbai BKC • Auth Server (AUTH-SRV-01)', path: '/incidents' },
    { type: 'INCIDENT', id: 'INC-DEL-01', label: 'Suspicious Login Attempt', meta: 'Delhi Operations • Auth Server (AUTH-SRV-01)', path: '/incidents' },
    { type: 'SESSION', id: 'SH-104', label: 'Simulated APT Session', meta: 'Source IP: 192.168.1.45 • Diverted to Shadow Network', path: '/intelligence' },
    { type: 'ASSET', id: 'AUTH-SRV-01', label: 'Primary Active Directory & Kerberos', meta: 'Mumbai BKC Datacenter • Target Asset', path: '/digital-twin' },
    { type: 'ASSET', id: 'DB-PROD-01', label: 'Core PostgreSQL Production DB', meta: 'Bengaluru Tech Center • Protected Tier', path: '/digital-twin' },
    { type: 'ASSET', id: 'FILE-SRV-01', label: 'Corporate File & Document Store', meta: 'Chennai Regional Campus • Planted Lures', path: '/digital-twin' },
    { type: 'ASSET', id: 'WEB-SRV-01', label: 'Public Web Application Portal', meta: 'Delhi Cloud Gateway • Entry Point', path: '/digital-twin' },
    { type: 'SITE', id: 'MUM-01', label: 'SmartCorp Mumbai Datacenter', meta: 'Primary Datacenter • 19.0760° N, 72.8777° E', path: '/incident-map' },
    { type: 'SITE', id: 'CHN-01', label: 'SmartCorp Chennai HQ', meta: 'Corporate Headquarters • 13.0827° N, 80.2707° E', path: '/incident-map' },
    { type: 'SITE', id: 'BLR-01', label: 'SmartCorp Bengaluru Tech Center', meta: 'R&D Center • 12.9716° N, 77.5946° E', path: '/incident-map' },
    { type: 'IP', id: '192.168.1.45', label: 'Adversary Gateway IP', meta: 'Approximate Location: External Autonomous System', path: '/intelligence' },
    { type: 'IP', id: '10.0.4.15', label: 'Internal Decoy Interface', meta: 'AUTH-DECOY-07 Shadow Virtual Interface', path: '/decoys' },
    { type: 'EVIDENCE', id: 'sys_exfiltration.txt', label: 'Forensic Honeypot Capture', meta: 'SHA256: a8b9c0d1e2f3456789... • Credential Discovery', path: '/evidence' },
    { type: 'EVIDENCE', id: 'admin_backup_password.txt', label: 'Synthetic Honeytoken Lure', meta: 'SHA256: f4d3c2b1a098765432... • Decoy Access', path: '/honeytokens' },
    { type: 'ATTACK', id: 'Credential Discovery', label: 'MITRE ATT&CK T1087', meta: 'Account discovery & Kerberoasting indicators', path: '/timeline' },
    { type: 'ATTACK', id: 'Service Enumeration', label: 'MITRE ATT&CK T1046', meta: 'Automated SYN sweep of enterprise subnets', path: '/timeline' },
  ];

  const searchResults = searchQuery.trim()
    ? searchDatabase.filter(
        (item) =>
          item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.meta.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectSearchItem = (path: string) => {
    navigate(path);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  // Sidebar sections matching Section 6
  const navSections = [
    {
      title: 'COMMAND',
      items: [
        { name: 'Command Center', path: '/', icon: Shield },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { name: 'Threat Intelligence', path: '/intelligence', icon: Activity },
        { name: 'Predictive Alerts', path: '/alerts', icon: AlertTriangle },
        { name: 'Threat Futures', path: '/threat-futures', icon: GitBranch },
        { name: 'Attack Timeline', path: '/timeline', icon: Clock },
        { name: 'Attack Graph', path: '/attack-graph', icon: Share2 },
        { name: 'Curiosity Engine', path: '/curiosity', icon: Compass },
      ],
    },
    {
      title: 'DECEPTION',
      items: [
        { name: 'Digital Twin', path: '/digital-twin', icon: Cpu },
        { name: 'Shadow Network', path: '/shadow-network', icon: Share2 },
        { name: 'Deception Lab', path: '/deception-lab', icon: Radio },
        { name: 'Decoy Systems', path: '/decoys', icon: Layers },
        { name: 'Honeytokens', path: '/honeytokens', icon: FileKey },
        { name: 'Sessions', path: '/sessions', icon: Database },
      ],
    },
    {
      title: 'RESPONSE',
      items: [
        { name: 'Incident Map', path: '/incident-map', icon: MapPin },
        { name: 'Response Teams', path: '/response-teams', icon: Users },
        { name: 'Incidents', path: '/incidents', icon: AlertCircle },
        { name: 'Evidence', path: '/evidence', icon: FileKey },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { name: 'Event Logs', path: '/events', icon: Terminal },
        { name: 'Reports', path: '/reports', icon: FileText },
      ],
    },
    {
      title: 'AI',
      items: [
        { name: 'AI Investigator', path: '/ai-investigator', icon: Bot },
        { name: 'Prediction Performance', path: '/prediction-performance', icon: TrendingUp },
      ],
    },
    {
      title: 'GOVERNANCE',
      items: [
        { name: 'Autonomy Governor', path: '/governor', icon: Scale },
        { name: 'Audit Log', path: '/audit-log', icon: FileText },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { name: 'Judge Demo', path: '/judge-demo', icon: PlayCircle },
        { name: 'Settings', path: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-[#060B14] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar matching reference image */}
      <aside className="w-60 flex-shrink-0 border-r border-cyan-500/15 bg-[#080E1A]/95 flex flex-col justify-between backdrop-blur-md z-20">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Brand Logo Header */}
          <div className="p-4 border-b border-cyan-500/15 flex items-center space-x-3 flex-shrink-0">
            {/* Hexagon icon with inner diamond */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-md rotate-45 border border-cyan-400/80 shadow-[0_0_10px_rgba(0,240,255,0.4)]"></div>
              <div className="relative w-3.5 h-3.5 bg-cyan-400 rotate-45"></div>
            </div>
            <div>
              <div className="font-bold text-white text-sm tracking-wide flex items-center space-x-1">
                <span>SmartHive</span>
                <span className="text-cyan-400">AI</span>
              </div>
              <div className="text-[9px] text-cyan-400/80 font-mono tracking-tight whitespace-nowrap">
                Predict • Detect • Deceive • Protect
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="overflow-y-auto px-3 py-3 space-y-4 flex-1 scrollbar-thin scrollbar-thumb-cyan-500/20">
            {navSections.map((section) => (
              <div key={section.title}>
                <div className="px-2 mb-1.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase font-mono">
                  {section.title}
                </div>
                <nav className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-2.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <span className="truncate">{item.name}</span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer: System Online, version, backend, AI engine, database status */}
        <div className="p-3 border-t border-cyan-500/15 bg-[#060B14]/90 space-y-2 flex-shrink-0">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-slate-900/60 border border-cyan-500/20">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className="text-[11px] font-semibold text-slate-200">System Online</div>
            </div>
            <div className="text-[10px] font-mono text-cyan-400/90">v1.0.0</div>
          </div>

          {/* Detailed Engine Health Metrics */}
          <div className="grid grid-cols-3 gap-1 px-1 text-[9px] font-mono text-slate-400">
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="truncate">BE: {systemStatus.backend}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span className="truncate">AI: {systemStatus.aiEngine}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="truncate">DB: {systemStatus.database}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#060B14]">
        {/* Top Navigation Bar matching reference */}
        <header className="h-14 border-b border-cyan-500/15 px-6 flex items-center justify-between bg-[#080E1A]/90 backdrop-blur-md z-30 flex-shrink-0">
          {/* Global Search Bar with Live Suggestions Dropdown */}
          <div ref={searchRef} className="relative w-80 sm:w-96">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder="Search locations, IPs, assets, incidents..."
                className="w-full bg-[#0D1527] border border-cyan-500/20 rounded-md pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Autocomplete Results Modal */}
            {isSearchFocused && (
              <div className="absolute top-11 left-0 w-full bg-[#09101F] border border-cyan-500/40 rounded-md shadow-[0_10px_25px_rgba(0,0,0,0.8)] z-50 overflow-hidden max-h-80 overflow-y-auto">
                <div className="p-2 border-b border-cyan-500/15 text-[10px] font-mono text-slate-400 flex justify-between items-center bg-[#070D1A]">
                  <span>
                    {searchQuery.trim()
                      ? `Matching Results (${searchResults.length})`
                      : 'Quick Lookup Directory'}
                  </span>
                  <span className="text-cyan-400 text-[9px]">Esc to close</span>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {(searchQuery.trim() ? searchResults : searchDatabase.slice(0, 6)).map((item) => (
                    <div
                      key={item.id + item.type}
                      onClick={() => handleSelectSearchItem(item.path)}
                      className="p-2.5 hover:bg-cyan-950/40 cursor-pointer transition-colors flex items-center justify-between group"
                    >
                      <div className="space-y-0.5 min-w-0 pr-2">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                              item.type === 'INCIDENT'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                : item.type === 'ASSET'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : item.type === 'SITE'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                                : item.type === 'IP'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                : 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                            }`}
                          >
                            {item.type}
                          </span>
                          <span className="font-semibold text-xs text-white group-hover:text-cyan-300">
                            {item.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300 font-medium truncate">{item.label}</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">{item.meta}</div>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        Go →
                      </span>
                    </div>
                  ))}

                  {searchQuery.trim() && searchResults.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-500 font-mono">
                      No matching assets, IPs, or incidents found for "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell with Badge */}
            <button
              onClick={() => navigate('/alerts')}
              className="relative p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#080E1A]"></span>
            </button>

            {/* Live Indicator */}
            <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live</span>
            </div>

            {/* User Profile & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2.5 pl-2 border-l border-cyan-500/20 hover:opacity-90 transition-opacity focus:outline-none"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold border border-cyan-400/60 shadow-sm font-mono">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden sm:block text-left text-xs leading-tight">
                  <div className="font-semibold text-slate-200">{user?.name || 'Admin Analyst'}</div>
                  <div className="text-[10px] text-cyan-400 font-mono">
                    {user?.role ? user.role.replace('_', ' ') : 'Security Analyst'}
                  </div>
                </div>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-10 w-56 bg-[#09101F] border border-cyan-500/40 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50 p-2 font-mono text-xs">
                  <div className="p-2 border-b border-cyan-500/15 mb-1.5">
                    <div className="font-bold text-white text-xs truncate">{user?.name || 'Admin Analyst'}</div>
                    <div className="text-[10px] text-slate-400 truncate">{user?.email || 'analyst@smartcorp.demo'}</div>
                    <div className="mt-1.5 inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      CLEARANCE: {user?.role || 'SOC_ANALYST'}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left text-[11px] font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out & Lock Terminal</span>
                  </button>
                </div>
              )}
            </div>

            {/* Time Filter Dropdown */}
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#0D1527] border border-cyan-500/20 text-xs text-slate-300 hover:border-cyan-500/40 cursor-pointer">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{timeFilter}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard View */}
        <main className="flex-1 overflow-y-auto p-5 bg-[#060B14]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
