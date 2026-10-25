import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  Key,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('SOC_ANALYST');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const demoAccounts = [
    {
      name: 'Ananya Iyer',
      role: 'SOC Lead Analyst',
      email: 'analyst@smartcorp.demo',
      password: 'SmartHive2026!',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      description: 'Primary SOC control plane, deception activation & alert triage',
    },
    {
      name: 'Praveen Balamurugan',
      role: 'Enterprise Admin',
      email: 'admin@smartcorp.demo',
      password: 'Admin2026!',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      description: 'Full administrative governor privileges & policy management',
    },
    {
      name: 'Capt. R. Sundaram',
      role: 'Incident Responder',
      email: 'responder@smartcorp.demo',
      password: 'Responder2026!',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Field response team dispatch & asset containment',
    },
  ];

  const handleQuickLogin = async (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError(null);
    setIsSubmitting(true);
    const res = await login(acc.email, acc.password);
    setIsSubmitting(false);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Authentication failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (mode === 'LOGIN') {
      const res = await login(email, password);
      setIsSubmitting(false);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.error || 'Invalid credentials. Please verify your email and password.');
      }
    } else {
      const res = await register(name, email, password, role);
      setIsSubmitting(false);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.error || 'Failed to create security identity.');
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#060B14] text-slate-200 flex flex-col justify-between font-sans relative overflow-hidden select-none">
      {/* Background Cyber Grid & Glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/20 via-[#060B14] to-[#040810] pointer-events-none"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Top Bar */}
      <div className="relative z-10 px-8 py-6 flex items-center justify-between border-b border-cyan-500/10 bg-[#080E1A]/40 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-md rotate-45 border border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]"></div>
            <div className="relative w-4 h-4 bg-cyan-400 rotate-45"></div>
          </div>
          <div>
            <div className="font-bold text-white text-base tracking-wide flex items-center space-x-1.5">
              <span>SmartHive</span>
              <span className="text-cyan-400">AI</span>
            </div>
            <div className="text-[10px] text-cyan-400/80 font-mono tracking-tight">
              Predict • Detect • Deceive • Protect
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Zero-Trust Gateway Online</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-center gap-10">
        {/* Left Column: Platform Overview & Defense Pillars */}
        <div className="flex-1 space-y-6 max-w-lg text-left hidden lg:block">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Autonomous Defensive Cybersecurity Platform</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Predictive Cyber-Deception & Security Command Center
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed font-sans">
            Enterprise SOC control plane integrating real-time telemetry correlation, counterfactual threat futures,
            adaptive honeynet diversion, and policy-governed safety controls.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-[#09101F]/80 border border-cyan-500/15">
              <Cpu className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white uppercase font-mono">Threat Futures Engine</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Monte Carlo simulation evaluating adversarial trajectory branches before attacks materialize.
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg bg-[#09101F]/80 border border-cyan-500/15">
              <Layers className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white uppercase font-mono">Adaptive Deception Orchestra</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Dynamic decoy infrastructure and synthetic breadcrumbs that silently contain malicious sessions.
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg bg-[#09101F]/80 border border-cyan-500/15">
              <Activity className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white uppercase font-mono">Autonomy Safety Governor</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Cryptographic policy engine enforcing defensive invariants and human sign-off for critical changes.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="w-full max-w-md">
          <div className="soc-panel rounded-xl border border-cyan-500/30 p-6 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-md relative">
            {/* Mode Tabs */}
            <div className="flex items-center space-x-2 border-b border-cyan-500/20 pb-4 mb-5">
              <button
                type="button"
                onClick={() => {
                  setMode('LOGIN');
                  setError(null);
                }}
                className={`flex-1 py-1.5 text-xs font-bold font-mono uppercase tracking-wider rounded transition-all ${
                  mode === 'LOGIN'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('REGISTER');
                  setError(null);
                }}
                className={`flex-1 py-1.5 text-xs font-bold font-mono uppercase tracking-wider rounded transition-all ${
                  mode === 'REGISTER'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Register Identity
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-mono flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              {mode === 'REGISTER' && (
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1">Full Name / Agent Handle</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Officer K. Sharma"
                      className="w-full bg-[#09101F] border border-cyan-500/30 rounded-md pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1">Enterprise Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@smartcorp.demo"
                    className="w-full bg-[#09101F] border border-cyan-500/30 rounded-md pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs font-mono"
                  />
                </div>
              </div>

              {mode === 'REGISTER' && (
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1">Clearance Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#09101F] border border-cyan-500/30 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400 text-xs font-mono"
                  >
                    <option value="SOC_ANALYST">SOC_ANALYST (Triage & Response)</option>
                    <option value="ADMIN">ADMIN (System Administrator)</option>
                    <option value="RESPONDER">RESPONDER (Field Response Team)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1">Security Passphrase</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#09101F] border border-cyan-500/30 rounded-md pl-9 pr-10 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider font-mono rounded-md shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
              >
                <span>{isSubmitting ? 'Authenticating Gateway...' : mode === 'LOGIN' ? 'Sign In to Command Center' : 'Create Clearance Profile'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Demo Login Cards */}
            {mode === 'LOGIN' && (
              <div className="mt-6 pt-5 border-t border-cyan-500/15 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Key className="w-3 h-3 text-cyan-400" />
                    <span>Quick Demo Sign-In (1-Click)</span>
                  </span>
                  <span className="text-[9px] text-slate-500">Pre-seeded accounts</span>
                </div>

                <div className="space-y-1.5">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => handleQuickLogin(acc)}
                      disabled={isSubmitting}
                      className="w-full text-left p-2 rounded bg-[#09101F] hover:bg-[#0D182E] border border-cyan-500/20 hover:border-cyan-400/50 transition-all flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-200 text-xs group-hover:text-cyan-300">
                            {acc.name}
                          </span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${acc.badgeColor}`}>
                            {acc.role}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">{acc.email}</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 px-8 py-4 border-t border-cyan-500/10 bg-[#080E1A]/40 text-center text-[11px] font-mono text-slate-500">
        SmartHive AI Defense Platform • Defensive Cyber-Deception Prototype • Cryptographic Zero-Trust Session Gateway
      </div>
    </div>
  );
};
