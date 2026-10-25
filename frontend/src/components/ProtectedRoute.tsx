import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#060B14] flex flex-col items-center justify-center font-mono">
        <div className="relative w-12 h-12 flex items-center justify-center mb-4">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-md rotate-45 border border-cyan-400 animate-spin"></div>
          <Shield className="w-6 h-6 text-cyan-400 animate-pulse" />
        </div>
        <div className="text-cyan-400 font-bold text-xs tracking-widest uppercase">
          Verifying Security Clearance...
        </div>
        <div className="text-slate-500 text-[10px] mt-1 font-sans">
          SmartHive AI Zero-Trust Gateway
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
