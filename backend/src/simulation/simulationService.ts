import prisma from '../utils/prisma.js';
import { broadcastEvent } from '../websocket/index.js';
import { TelemetryService } from '../telemetry/telemetryService.js';
import { SessionService } from '../intelligence/sessionService.js';
import { CuriosityService } from '../intelligence/curiosityService.js';
import { RiskService } from '../intelligence/riskService.js';
import { PredictionService } from '../prediction/predictionService.js';
import { FuturesService } from '../prediction/futuresService.js';
import { CounterfactualService } from '../prediction/counterfactualService.js';
import { GovernorService } from '../governor/governorService.js';
import { DeceptionService } from '../deception/deceptionService.js';
import { EvidenceService } from '../evidence/evidenceService.js';
import { IncidentService } from '../incidents/incidentService.js';
import { ResponseService } from '../response/responseService.js';
import { EvaluationService } from '../prediction/evaluationService.js';
import { ReportService } from '../reports/reportService.js';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class SimulationService {
  private static isRunningFullAttack = false;

  static async getOrCreateDemoSession() {
    let session = await prisma.threatSession.findUnique({
      where: { sessionCode: 'SH-104' },
    });

    if (!session) {
      session = await prisma.threatSession.create({
        data: {
          sessionCode: 'SH-104',
          sourceAddress: '198.51.100.42',
          targetAsset: 'AUTH-SRV-01',
          siteCode: 'MUM-01',
          currentStage: 'NORMAL',
          stageState: 'SIMULATED',
          observedAttackType: 'NORMAL_TRAFFIC',
          suspectedIntent: 'BENIGN',
          riskScore: 8,
          riskCategory: 'LOW',
          status: 'ACTIVE',
        },
      });
    }

    return session;
  }

  static async resetDemo() {
    this.isRunningFullAttack = false;
    const session = await this.getOrCreateDemoSession();

    // Reset session state
    await prisma.threatSession.update({
      where: { id: session.id },
      data: {
        currentStage: 'NORMAL',
        stageState: 'SIMULATED',
        observedAttackType: 'NORMAL_TRAFFIC',
        suspectedIntent: 'BENIGN',
        riskScore: 8,
        riskCategory: 'LOW',
        status: 'ACTIVE',
        shadowDiverted: false,
        divertedToDecoy: null,
      },
    });

    // Reset decoys
    await prisma.decoy.updateMany({
      data: { status: 'ARMED' },
    });

    // Reset honeytokens
    await prisma.honeytoken.updateMany({
      data: { triggered: false },
    });

    // Reset response teams
    await prisma.responseTeam.updateMany({
      data: {
        status: 'AVAILABLE',
        assignedIncident: null,
        etaMinutes: 0,
      },
    });

    // Close incidents
    await prisma.incident.updateMany({
      where: { sessionId: session.id },
      data: { status: 'CLOSED' },
    });

    // Initialize baseline profiles
    await CuriosityService.evaluateSessionCuriosity(session.id);
    await RiskService.updateSessionRisk(session.id);

    broadcastEvent('demo:reset', { sessionId: session.id, status: 'RESET_COMPLETE' });
    return { success: true, message: 'Demo reset to clean baseline state' };
  }

  // --- Granular Steps ---

  static async stepNormal() {
    const session = await this.getOrCreateDemoSession();
    await TelemetryService.ingestEvent({
      sessionId: session.id,
      source: 'WEB_GATEWAY',
      sourceAddress: session.sourceAddress,
      eventType: 'NORMAL_ACTIVITY',
      severity: 'INFO',
      description: 'Standard HTTP GET /index.html and assets requested.',
      metadata: { port: 80, protocol: 'TCP' },
    });
    await SessionService.updateSessionStage(session.id, 'NORMAL', 'OBSERVED', 'BENIGN_TRAFFIC', 'NORMAL');
    broadcastEvent('demo:step', { step: 'NORMAL', risk: 8 });
    return { step: 'NORMAL', risk: 8 };
  }

  static async stepReconnaissance() {
    const session = await this.getOrCreateDemoSession();
    await TelemetryService.ingestEvent({
      sessionId: session.id,
      source: 'NETWORK_IDS',
      sourceAddress: session.sourceAddress,
      eventType: 'RECONNAISSANCE',
      severity: 'LOW',
      description: 'TCP SYN sweeps detected across peripheral ports (8080, 8443).',
      metadata: { ports: [8080, 8443], tool: 'nmap-stealth' },
    });
    await SessionService.updateSessionStage(session.id, 'RECONNAISSANCE', 'OBSERVED', 'Perimeter Port Sweep', 'Reconnaissance');
    broadcastEvent('demo:step', { step: 'RECONNAISSANCE', risk: 24 });
    return { step: 'RECONNAISSANCE', risk: 24 };
  }

  static async stepServiceEnumeration() {
    const session = await this.getOrCreateDemoSession();
    await TelemetryService.ingestEvent({
      sessionId: session.id,
      source: 'HOST_AGENT',
      sourceAddress: session.sourceAddress,
      eventType: 'SERVICE_ENUMERATION',
      severity: 'MEDIUM',
      description: 'Targeted banner grabs on SSH (22) and SMB (445) services.',
      metadata: { ports: [22, 445], protocol: 'TCP' },
    });
    await SessionService.updateSessionStage(session.id, 'DISCOVERY', 'OBSERVED', 'Service Banner Grabbing', 'Asset Discovery');
    await FuturesService.generateThreatFutures(session.id);
    await CounterfactualService.evaluateCounterfactuals(session.id);
    broadcastEvent('demo:step', { step: 'SERVICE_ENUMERATION', risk: 39 });
    return { step: 'SERVICE_ENUMERATION', risk: 39 };
  }

  static async stepDecoyInteraction() {
    const session = await this.getOrCreateDemoSession();
    await DeceptionService.deployAdaptiveDeception(session.id);
    await TelemetryService.ingestEvent({
      sessionId: session.id,
      source: 'HONEYPOT',
      sourceAddress: session.sourceAddress,
      eventType: 'DECOY_INTERACTION',
      severity: 'MEDIUM',
      description: 'Adversary initiated connection handshake with AUTH-DECOY-07.',
      metadata: { decoy: 'AUTH-DECOY-07', port: 88 },
    });
    broadcastEvent('demo:step', { step: 'DECOY_INTERACTION', risk: 52 });
    return { step: 'DECOY_INTERACTION', risk: 52 };
  }

  static async stepCredentialDiscovery() {
    const session = await this.getOrCreateDemoSession();
    await TelemetryService.ingestEvent({
      sessionId: session.id,
      source: 'HONEYPOT',
      sourceAddress: session.sourceAddress,
      eventType: 'CREDENTIAL_DISCOVERY',
      severity: 'HIGH',
      description: 'Adversary probed decoy directory share searching for backup passwords.',
      metadata: { file: 'admin_backup_password.txt' },
    });
    await SessionService.updateSessionStage(session.id, 'CREDENTIAL_DISCOVERY', 'OBSERVED', 'Credential Hunting', 'Authentication Access');
    await PredictionService.predictNextStage(session.id);
    await FuturesService.generateThreatFutures(session.id);
    broadcastEvent('demo:step', { step: 'CREDENTIAL_DISCOVERY', risk: 68 });
    return { step: 'CREDENTIAL_DISCOVERY', risk: 68 };
  }

  static async stepHoneytokenAccess() {
    const session = await this.getOrCreateDemoSession();
    const ht = await prisma.honeytoken.findFirst({ where: { name: 'admin_backup_password.txt' } });
    if (ht) {
      await DeceptionService.triggerHoneytoken(ht.id, session.id);
    }
    await RiskService.updateSessionRisk(session.id);
    broadcastEvent('demo:step', { step: 'HONEYTOKEN_ACCESS', risk: 86 });
    return { step: 'HONEYTOKEN_ACCESS', risk: 86 };
  }

  static async stepAuthAttempt() {
    const session = await this.getOrCreateDemoSession();
    await TelemetryService.ingestEvent({
      sessionId: session.id,
      source: 'AUTH_CONTROLLER',
      sourceAddress: session.sourceAddress,
      eventType: 'AUTH_ATTEMPT',
      severity: 'CRITICAL',
      description: 'Adversary attempted Kerberos authentication with synthetic credentials.',
      metadata: { user: 'arun.kumar', target: 'AUTH-DECOY-07' },
    });
    await SessionService.updateSessionStage(session.id, 'CREDENTIAL_ACCESS_ATTEMPT', 'OBSERVED', 'Kerberos Ticket Request', 'Credential Access Attempt');
    await EvaluationService.evaluatePrediction(session.id, 'Credential Access Attempt');
    broadcastEvent('demo:step', { step: 'AUTH_ATTEMPT', risk: 91 });
    return { step: 'AUTH_ATTEMPT', risk: 91 };
  }

  static async stepLateralMovement() {
    const session = await this.getOrCreateDemoSession();
    await TelemetryService.ingestEvent({
      sessionId: session.id,
      source: 'NETWORK_IDS',
      sourceAddress: session.sourceAddress,
      eventType: 'LATERAL_MOVEMENT_SIMULATION',
      severity: 'CRITICAL',
      description: 'Adversary redirected inside Shadow Network toward DB-DECOY-03.',
      metadata: { source: 'AUTH-DECOY-07', target: 'DB-DECOY-03' },
    });
    await SessionService.updateSessionStage(session.id, 'LATERAL_MOVEMENT_ATTEMPT', 'SIMULATED', 'Shadow Lateral Movement', 'Data Discovery');
    broadcastEvent('demo:step', { step: 'LATERAL_MOVEMENT_SIMULATION', risk: 94 });
    return { step: 'LATERAL_MOVEMENT_SIMULATION', risk: 94 };
  }

  static async stepContainment() {
    const session = await this.getOrCreateDemoSession();
    await SessionService.updateSessionStage(session.id, 'CONTAINED', 'SIMULATED', 'Deception Isolation', 'Contained');
    await prisma.threatSession.update({
      where: { id: session.id },
      data: { status: 'CONTAINED', riskScore: 12, riskCategory: 'LOW' },
    });
    await prisma.incident.updateMany({
      where: { sessionId: session.id, status: { not: 'CLOSED' } },
      data: { status: 'CONTAINED' },
    });
    broadcastEvent('demo:step', { step: 'CONTAIN', risk: 12, status: 'THREAT CONTAINED' });
    return { step: 'CONTAIN', risk: 12, status: 'THREAT CONTAINED - PROTECTED ASSET UNAFFECTED' };
  }

  // --- FULL SMART ATTACK ORCHESTRATOR ---

  static async runFullSmartAttack() {
    if (this.isRunningFullAttack) {
      return { message: 'Full Smart Attack is already in progress' };
    }
    this.isRunningFullAttack = true;

    try {
      console.log('[DEMO] Starting Full Smart Attack Orchestration...');
      const session = await this.getOrCreateDemoSession();

      // 1. NORMAL (Risk 8)
      await this.stepNormal();
      await delay(1200);

      // 2. Reconnaissance (Risk 24)
      await this.stepReconnaissance();
      await delay(1200);

      // 3. Service Enumeration (Risk 39)
      await this.stepServiceEnumeration();
      await delay(1200);

      // 4. Curiosity Engine & Threat Futures
      await CuriosityService.evaluateSessionCuriosity(session.id);
      await FuturesService.generateThreatFutures(session.id);
      await delay(1000);

      // 5. Counterfactual Engine evaluates
      await CounterfactualService.evaluateCounterfactuals(session.id);
      await delay(1000);

      // 6. Safety Governor auto-allows safe deception
      await GovernorService.evaluateAction('ACTIVATE_AUTH_DECOY', session.id);
      await delay(800);

      // 7. Deception deployed: Activate AUTH-DECOY-07 + deploy honeytoken
      await DeceptionService.deployAdaptiveDeception(session.id);
      await delay(1000);

      // 8. Simulated session interacts with honeytoken
      await this.stepHoneytokenAccess();
      await delay(1200);

      // 9. Prediction Generated: Credential Access Attempt
      await PredictionService.predictNextStage(session.id);
      await delay(1000);

      // 10. Threat Futures update & Shadow Network activates
      await FuturesService.generateThreatFutures(session.id);
      await delay(800);

      // 11. Evidence Graph grows & Incident created
      const site = await prisma.site.findFirst({ where: { code: 'MUM-01' } });
      const asset = await prisma.asset.findFirst({ where: { hostname: 'AUTH-SRV-01' } });

      const incident = await IncidentService.createIncident({
        sessionId: session.id,
        title: 'Critical Threat Session SH-104 - Credential Access Risk',
        severity: 'CRITICAL',
        risk: 86,
        attackType: 'Credential Discovery / Honeytoken Trap',
        predictedAttack: 'Credential Access Attempt against AUTH-SRV-01',
        siteId: site?.id || '',
        targetAssetId: asset?.id || '',
      });

      // Collect evidence with SHA-256 integrity hash
      await EvidenceService.collectEvidence({
        incidentId: incident.id,
        sessionId: session.id,
        evidenceType: 'PREDICTION_SNAPSHOT',
        title: 'Predictive Threat Futures Branch Validated',
        description: 'Attack intent prediction confirmed 84% probability of Credential Access Attempt targeting AUTH-SRV-01.',
        rawPayload: JSON.stringify({ prediction: 'CREDENTIAL_ACCESS_ATTEMPT', confidence: 84, target: 'AUTH-SRV-01' }),
      });
      await delay(1200);

      // 12. Response team assigned with route + ETA
      if (site) {
        await ResponseService.assignNearestTeam(incident.id, site.id);
      }
      await delay(1200);

      // 13. Generate Executive Report
      await ReportService.generateReport(incident.id);
      await delay(1000);

      // 14. Predicted simulated stage occurs: Kerberos auth attempt
      await this.stepAuthAttempt();
      await delay(1200);

      // 15. Evaluation: Prediction evaluated CORRECT, Lead Time calculated (e.g. 5m 27s / 327s)
      await EvaluationService.evaluatePrediction(session.id, 'Credential Access Attempt');
      await delay(1000);

      // 16. Containment: Threat contained, protected asset unaffected
      await this.stepContainment();

      console.log('[DEMO] Full Smart Attack completed successfully.');
      this.isRunningFullAttack = false;

      return {
        success: true,
        status: 'THREAT CONTAINED - PROTECTED ASSET UNAFFECTED',
        sessionCode: 'SH-104',
        leadTime: '5m 27s',
        predictionAccuracy: '100% CORRECT',
      };
    } catch (err: any) {
      this.isRunningFullAttack = false;
      console.error('[DEMO ERROR]', err);
      throw err;
    }
  }
}
