import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { CommandCenter } from './pages/CommandCenter';
import { JudgeDemo } from './pages/JudgeDemo';
import { ThreatFuturesPage } from './pages/ThreatFuturesPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { ShadowNetworkPage } from './pages/ShadowNetworkPage';
import { IncidentMapPage } from './pages/IncidentMapPage';
import { EvidenceGraphPage } from './pages/EvidenceGraphPage';
import { AIInvestigatorPage } from './pages/AIInvestigatorPage';
import { GovernorPage } from './pages/GovernorPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { ReportsPage } from './pages/ReportsPage';
import { PredictionPerformancePage } from './pages/PredictionPerformancePage';
import { ThreatIntelligencePage } from './pages/ThreatIntelligencePage';
import { DecoysPage } from './pages/DecoysPage';
import { HoneytokensPage } from './pages/HoneytokensPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { ResponseTeamsPage } from './pages/ResponseTeamsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AttackTimelinePage } from './pages/AttackTimelinePage';
import { PredictiveAlertsPage } from './pages/PredictiveAlertsPage';
import { CuriosityEnginePage } from './pages/CuriosityEnginePage';
import { SessionsPage } from './pages/SessionsPage';
import { EventLogsPage } from './pages/EventLogsPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Command Center Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CommandCenter />} />
            <Route path="judge-demo" element={<JudgeDemo />} />
            <Route path="threat-futures" element={<ThreatFuturesPage />} />
            <Route path="digital-twin" element={<DigitalTwinPage />} />
            <Route path="shadow-network" element={<ShadowNetworkPage />} />
            <Route path="incident-map" element={<IncidentMapPage />} />
            <Route path="evidence" element={<EvidenceGraphPage />} />
            <Route path="ai-investigator" element={<AIInvestigatorPage />} />
            <Route path="governor" element={<GovernorPage />} />
            <Route path="autonomy-governor" element={<GovernorPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="prediction-performance" element={<PredictionPerformancePage />} />
            <Route path="intelligence" element={<ThreatIntelligencePage />} />
            <Route path="curiosity" element={<CuriosityEnginePage />} />
            <Route path="alerts" element={<PredictiveAlertsPage />} />
            <Route path="timeline" element={<AttackTimelinePage />} />
            <Route path="attack-graph" element={<EvidenceGraphPage />} />
            <Route path="deception-lab" element={<DecoysPage />} />
            <Route path="decoys" element={<DecoysPage />} />
            <Route path="honeytokens" element={<HoneytokensPage />} />
            <Route path="sessions" element={<SessionsPage />} />
            <Route path="incidents" element={<IncidentsPage />} />
            <Route path="response-teams" element={<ResponseTeamsPage />} />
            <Route path="audit-log" element={<AuditLogPage />} />
            <Route path="events" element={<EventLogsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
