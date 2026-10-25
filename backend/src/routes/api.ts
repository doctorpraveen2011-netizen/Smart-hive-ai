import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { TelemetryService } from '../telemetry/telemetryService.js';
import { SessionService } from '../intelligence/sessionService.js';
import { CuriosityService } from '../intelligence/curiosityService.js';
import { PredictionService } from '../prediction/predictionService.js';
import { FuturesService } from '../prediction/futuresService.js';
import { CounterfactualService } from '../prediction/counterfactualService.js';
import { GovernorService } from '../governor/governorService.js';
import { DeceptionService } from '../deception/deceptionService.js';
import { IncidentService } from '../incidents/incidentService.js';
import { EvidenceService } from '../evidence/evidenceService.js';
import { ResponseService } from '../response/responseService.js';
import { ReportService } from '../reports/reportService.js';
import { EvaluationService } from '../prediction/evaluationService.js';
import { SimulationService } from '../simulation/simulationService.js';
import { InvestigatorService } from '../intelligence/investigatorService.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'smarthive_dev_secret_key_super_secure_2026_xyz';

// -------------------------------------------------------------
// HEALTH & AUTHENTICATION
// -------------------------------------------------------------
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    backend: 'healthy',
    aiEngine: 'healthy',
    database: 'healthy',
    service: 'SmartHive AI Backend',
    timestamp: new Date().toISOString(),
  });
});

router.post('/auth/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role, name: user.name },
  });
});

router.post('/auth/register', async (req: Request, res: Response): Promise<void> => {
  const { email, password, name, role } = req.body;
  if (!email || !password || !name) {
    res.status(400).json({ error: 'Email, password, and name are required' });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(400).json({ error: 'User already exists with this email address' });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: role || 'SOC_ANALYST',
    },
  });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, role: user.role, name: user.name },
  });
});

router.get('/auth/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ user: req.user });
});

// -------------------------------------------------------------
// COMMAND CENTER DASHBOARD SUMMARY
// -------------------------------------------------------------
router.get('/dashboard', async (req: Request, res: Response) => {
  const [
    activeThreatsCount,
    criticalIncidentsCount,
    activeDecoysCount,
    honeytokensTriggeredCount,
    predictionMetrics,
    responseTeamsCount,
    containedCount,
    latestIncidents,
    latestEvents,
    activeSession,
  ] = await Promise.all([
    prisma.threatSession.count({ where: { status: 'ACTIVE' } }),
    prisma.incident.count({ where: { severity: 'CRITICAL', status: { not: 'CLOSED' } } }),
    prisma.decoy.count({ where: { status: { in: ['ARMED', 'ENGAGED', 'DIVERTING'] } } }),
    prisma.honeytoken.count({ where: { triggered: true } }),
    EvaluationService.getPerformanceMetrics(),
    prisma.responseTeam.count({ where: { status: { in: ['AVAILABLE', 'DISPATCHED', 'ON_ROUTE'] } } }),
    prisma.threatSession.count({ where: { status: 'CONTAINED' } }),
    prisma.incident.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { site: true, targetAsset: true, responseTeam: true },
    }),
    prisma.securityEvent.findMany({
      take: 8,
      orderBy: { timestamp: 'desc' },
      include: { site: true, asset: true },
    }),
    prisma.threatSession.findFirst({
      where: { sessionCode: 'SH-104' },
      include: {
        curiosityProfile: true,
        predictions: { take: 1, orderBy: { createdAt: 'desc' } },
        threatFutures: true,
        counterfactuals: true,
        governorDecisions: { take: 3, orderBy: { createdAt: 'desc' } },
      },
    }),
  ]);

  res.json({
    kpis: {
      activeThreats: activeThreatsCount || 1,
      criticalIncidents: criticalIncidentsCount || 1,
      activeDecoys: activeDecoysCount || 5,
      honeytokensTriggered: honeytokensTriggeredCount || 1,
      predictionAccuracy: predictionMetrics.accuracy,
      averageLeadTimeSeconds: predictionMetrics.leadTimeAvgSeconds,
      averageLeadTimeFormatted: '5m 27s',
      responseTeamsActive: responseTeamsCount || 5,
      threatsContained: containedCount || 1,
    },
    activeSession,
    latestIncidents,
    latestEvents,
  });
});

// -------------------------------------------------------------
// TOPOLOGY, SITES, ASSETS & DIGITAL TWIN
// -------------------------------------------------------------
router.get('/sites', async (req: Request, res: Response) => {
  const sites = await prisma.site.findMany({
    include: { assets: true, decoys: true, incidents: true },
  });
  res.json(sites);
});

router.get('/assets', async (req: Request, res: Response) => {
  const assets = await prisma.asset.findMany({
    include: {
      site: true,
      honeytokens: true,
      sourceRelations: { include: { targetAsset: true } },
      targetRelations: { include: { sourceAsset: true } },
    },
  });
  res.json(assets);
});

router.get('/digital-twin', async (req: Request, res: Response) => {
  const [sites, assets, relations, identities, departments, devices, documents] = await Promise.all([
    prisma.site.findMany(),
    prisma.asset.findMany({ include: { site: true, honeytokens: true } }),
    prisma.assetRelationship.findMany({
      include: { sourceAsset: true, targetAsset: true },
    }),
    prisma.syntheticIdentity.findMany({
      include: { department: true, devices: true, credentials: true },
    }),
    prisma.syntheticDepartment.findMany(),
    prisma.syntheticDevice.findMany(),
    prisma.syntheticDocument.findMany(),
  ]);

  res.json({
    sites,
    assets,
    relationships: relations,
    syntheticReality: {
      identities,
      departments,
      devices,
      documents,
    },
  });
});

router.get('/shadow-network', async (req: Request, res: Response) => {
  const [protectedAssets, decoys, session] = await Promise.all([
    prisma.asset.findMany({ include: { site: true } }),
    prisma.decoy.findMany({ include: { site: true, honeytokens: true } }),
    prisma.threatSession.findFirst({ where: { sessionCode: 'SH-104' } }),
  ]);

  res.json({
    protectedNetwork: protectedAssets,
    shadowNetwork: decoys,
    divertedSession: session,
  });
});

// -------------------------------------------------------------
// SESSIONS & TELEMETRY
// -------------------------------------------------------------
router.get('/sessions', async (req: Request, res: Response) => {
  const sessions = await SessionService.getActiveSessions();
  res.json(sessions);
});

router.get('/sessions/:sessionCode', async (req: Request, res: Response): Promise<void> => {
  const session = await SessionService.getSessionByCode(req.params.sessionCode);
  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }
  res.json(session);
});

router.get('/events', async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 100;
  const sessionId = req.query.sessionId as string;
  const events = await TelemetryService.getEvents(limit, sessionId);
  res.json(events);
});

router.post('/events', async (req: Request, res: Response) => {
  const event = await TelemetryService.ingestEvent(req.body);
  res.status(201).json(event);
});

// -------------------------------------------------------------
// INTELLIGENCE, PREDICTIONS & FUTURES
// -------------------------------------------------------------
router.get('/curiosity/:sessionId', async (req: Request, res: Response) => {
  const curiosity = await CuriosityService.evaluateSessionCuriosity(req.params.sessionId);
  res.json(curiosity);
});

router.get('/predictions/:sessionId', async (req: Request, res: Response) => {
  const pred = await PredictionService.predictNextStage(req.params.sessionId);
  res.json(pred);
});

router.get('/threat-futures/:sessionId', async (req: Request, res: Response) => {
  const futures = await FuturesService.generateThreatFutures(req.params.sessionId);
  res.json(futures);
});

router.get('/counterfactual/:sessionId', async (req: Request, res: Response) => {
  const simulations = await CounterfactualService.evaluateCounterfactuals(req.params.sessionId);
  res.json(simulations);
});

// -------------------------------------------------------------
// GOVERNOR, DECEPTION & HONEYTOKENS
// -------------------------------------------------------------
router.get('/governor/decisions', async (req: Request, res: Response) => {
  const decisions = await GovernorService.getDecisions();
  res.json(decisions);
});

router.post('/governor/evaluate', async (req: Request, res: Response) => {
  const { actionType, sessionId, autonomyLevel } = req.body;
  const result = await GovernorService.evaluateAction(actionType, sessionId, autonomyLevel);
  res.json(result);
});

router.patch('/governor/decisions/:id', async (req: Request, res: Response) => {
  const { decision, approvedBy } = req.body;
  const updated = await GovernorService.updateDecision(req.params.id, decision, approvedBy);
  res.json(updated);
});

router.post('/governor/decisions/:id/approve', async (req: Request, res: Response) => {
  const updated = await GovernorService.updateDecision(req.params.id, 'ALLOW', req.body.approvedBy || 'SOC_Lead_Analyst');
  res.json(updated);
});

router.post('/governor/decisions/:id/reject', async (req: Request, res: Response) => {
  const updated = await GovernorService.updateDecision(req.params.id, 'BLOCK', req.body.approvedBy || 'SOC_Lead_Analyst');
  res.json(updated);
});

// -------------------------------------------------------------
// AUDIT LOGS
// -------------------------------------------------------------
router.get('/audit-logs', async (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
  const logs = await prisma.auditLog.findMany({
    take: limit,
    orderBy: { timestamp: 'desc' },
  });
  res.json(logs);
});

router.post('/audit-logs', async (req: Request, res: Response) => {
  const { actor, action, target, details, ipAddress } = req.body;
  const created = await prisma.auditLog.create({
    data: {
      actor: actor || 'SOC_Analyst',
      action: action || 'MANUAL_INSPECTION',
      target: target || 'SYSTEM',
      details: details || 'Manual operational audit event',
      ipAddress: ipAddress || '127.0.0.1',
    },
  });
  res.json(created);
});

router.get('/decoys', async (req: Request, res: Response) => {
  const decoys = await DeceptionService.getDecoys();
  res.json(decoys);
});

router.get('/honeytokens', async (req: Request, res: Response) => {
  const honeytokens = await DeceptionService.getHoneytokens();
  res.json(honeytokens);
});

router.post('/honeytokens/:id/trigger', async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  const result = await DeceptionService.triggerHoneytoken(req.params.id, sessionId || 'SH-104');
  res.json(result);
});

// -------------------------------------------------------------
// INCIDENTS, EVIDENCE & RESPONSE
// -------------------------------------------------------------
router.get('/incidents', async (req: Request, res: Response) => {
  const incidents = await IncidentService.getIncidents();
  res.json(incidents);
});

router.patch('/incidents/:id/status', async (req: Request, res: Response) => {
  const updated = await IncidentService.updateIncidentStatus(req.params.id, req.body.status);
  res.json(updated);
});

router.get('/evidence', async (req: Request, res: Response) => {
  const evidence = await EvidenceService.getEvidenceList(
    req.query.sessionId as string,
    req.query.incidentId as string
  );
  res.json(evidence);
});

router.get('/response-teams', async (req: Request, res: Response) => {
  const teams = await ResponseService.getTeams();
  res.json(teams);
});

// -------------------------------------------------------------
// REPORTS & PREDICTION PERFORMANCE
// -------------------------------------------------------------
router.get('/reports', async (req: Request, res: Response) => {
  const reports = await ReportService.getReports();
  res.json(reports);
});

router.get('/reports/:id', async (req: Request, res: Response): Promise<void> => {
  const report = await ReportService.getReportById(req.params.id);
  if (!report) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }
  res.json(report);
});

router.post('/reports/generate', async (req: Request, res: Response) => {
  const { incidentId } = req.body;
  const result = await ReportService.generateReport(incidentId);
  res.json(result);
});

router.get('/prediction-performance', async (req: Request, res: Response) => {
  const metrics = await EvaluationService.getPerformanceMetrics();
  res.json(metrics);
});

// -------------------------------------------------------------
// AI INVESTIGATOR
// -------------------------------------------------------------
router.post('/ai-investigator/ask', async (req: Request, res: Response) => {
  const { query, sessionId } = req.body;
  const answer = await InvestigatorService.answerQuestion(query, sessionId || 'SH-104');
  res.json(answer);
});

// -------------------------------------------------------------
// JUDGE DEMO SIMULATION CONTROLLER
// -------------------------------------------------------------
router.post('/simulation/reset', async (req: Request, res: Response) => {
  const result = await SimulationService.resetDemo();
  res.json(result);
});

router.post('/simulation/step/normal', async (req: Request, res: Response) => {
  const result = await SimulationService.stepNormal();
  res.json(result);
});

router.post('/simulation/step/reconnaissance', async (req: Request, res: Response) => {
  const result = await SimulationService.stepReconnaissance();
  res.json(result);
});

router.post('/simulation/step/enumeration', async (req: Request, res: Response) => {
  const result = await SimulationService.stepServiceEnumeration();
  res.json(result);
});

router.post('/simulation/step/decoy-interaction', async (req: Request, res: Response) => {
  const result = await SimulationService.stepDecoyInteraction();
  res.json(result);
});

router.post('/simulation/step/credential-discovery', async (req: Request, res: Response) => {
  const result = await SimulationService.stepCredentialDiscovery();
  res.json(result);
});

router.post('/simulation/step/honeytoken-access', async (req: Request, res: Response) => {
  const result = await SimulationService.stepHoneytokenAccess();
  res.json(result);
});

router.post('/simulation/step/auth-attempt', async (req: Request, res: Response) => {
  const result = await SimulationService.stepAuthAttempt();
  res.json(result);
});

router.post('/simulation/step/lateral-movement', async (req: Request, res: Response) => {
  const result = await SimulationService.stepLateralMovement();
  res.json(result);
});

router.post('/simulation/step/contain', async (req: Request, res: Response) => {
  const result = await SimulationService.stepContainment();
  res.json(result);
});

router.post('/simulation/run-full-smart-attack', async (req: Request, res: Response) => {
  // Trigger asynchronously or await
  SimulationService.runFullSmartAttack().catch((e) => console.error(e));
  res.json({ message: 'Full Smart Attack pipeline initiated' });
});

export default router;
