import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('smarthive_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Authentication
  login: (data: { email: string; password: string }) => apiClient.post('/auth/login', data),
  register: (data: { email: string; password: string; name: string; role?: string }) =>
    apiClient.post('/auth/register', data),
  getMe: () => apiClient.get('/auth/me'),

  // Health & Dashboard
  getHealth: () => apiClient.get('/health'),
  getDashboard: () => apiClient.get('/dashboard'),

  // Topology & Assets
  getSites: () => apiClient.get('/sites'),
  getAssets: () => apiClient.get('/assets'),
  getDigitalTwin: () => apiClient.get('/digital-twin'),
  getShadowNetwork: () => apiClient.get('/shadow-network'),

  // Sessions & Telemetry
  getSessions: () => apiClient.get('/sessions'),
  getSession: (sessionCode: string) => apiClient.get(`/sessions/${sessionCode}`),
  getEvents: (params?: { limit?: number; sessionId?: string }) => apiClient.get('/events', { params }),

  // Intelligence & Predictions
  getCuriosity: (sessionId: string) => apiClient.get(`/curiosity/${sessionId}`),
  getPredictions: (sessionId: string) => apiClient.get(`/predictions/${sessionId}`),
  getThreatFutures: (sessionId: string) => apiClient.get(`/threat-futures/${sessionId}`),
  getCounterfactual: (sessionId: string) => apiClient.get(`/counterfactual/${sessionId}`),

  // Governor & Deception
  getGovernorDecisions: () => apiClient.get('/governor/decisions'),
  evaluateGovernor: (data: { actionType: string; sessionId?: string; autonomyLevel?: string }) =>
    apiClient.post('/governor/evaluate', data),
  approveGovernorDecision: (id: string, approvedBy?: string) =>
    apiClient.post(`/governor/decisions/${id}/approve`, { approvedBy }),
  rejectGovernorDecision: (id: string, approvedBy?: string) =>
    apiClient.post(`/governor/decisions/${id}/reject`, { approvedBy }),
  getAuditLogs: (params?: { limit?: number }) => apiClient.get('/audit-logs', { params }),
  createAuditLog: (data: { actor?: string; action: string; target: string; details: string; ipAddress?: string }) =>
    apiClient.post('/audit-logs', data),
  getDecoys: () => apiClient.get('/decoys'),
  getHoneytokens: () => apiClient.get('/honeytokens'),
  triggerHoneytoken: (id: string, sessionId?: string) =>
    apiClient.post(`/honeytokens/${id}/trigger`, { sessionId }),

  // Incidents, Evidence & Response
  getIncidents: () => apiClient.get('/incidents'),
  updateIncidentStatus: (id: string, status: string) =>
    apiClient.patch(`/incidents/${id}/status`, { status }),
  getEvidence: (params?: { sessionId?: string; incidentId?: string }) =>
    apiClient.get('/evidence', { params }),
  getResponseTeams: () => apiClient.get('/response-teams'),

  // Reports & Performance
  getReports: () => apiClient.get('/reports'),
  getReportById: (id: string) => apiClient.get(`/reports/${id}`),
  generateReport: (incidentId: string) => apiClient.post('/reports/generate', { incidentId }),
  getPredictionPerformance: () => apiClient.get('/prediction-performance'),

  // AI Investigator
  askInvestigator: (query: string, sessionId?: string) =>
    apiClient.post('/ai-investigator/ask', { query, sessionId }),

  // Judge Demo Simulation
  resetDemo: () => apiClient.post('/simulation/reset'),
  stepNormal: () => apiClient.post('/simulation/step/normal'),
  stepRecon: () => apiClient.post('/simulation/step/reconnaissance'),
  stepEnumeration: () => apiClient.post('/simulation/step/enumeration'),
  stepDecoyInteraction: () => apiClient.post('/simulation/step/decoy-interaction'),
  stepCredentialDiscovery: () => apiClient.post('/simulation/step/credential-discovery'),
  stepHoneytokenAccess: () => apiClient.post('/simulation/step/honeytoken-access'),
  stepAuthAttempt: () => apiClient.post('/simulation/step/auth-attempt'),
  stepLateralMovement: () => apiClient.post('/simulation/step/lateral-movement'),
  stepContain: () => apiClient.post('/simulation/step/contain'),
  containSession: (sessionId?: string) => apiClient.post('/simulation/step/contain', { sessionId }),
  simulateStep: (step: string) => apiClient.post(`/simulation/step/${step.toLowerCase().replace(/_/g, '-')}`),
  runFullSmartAttack: () => apiClient.post('/simulation/run-full-smart-attack'),
};
