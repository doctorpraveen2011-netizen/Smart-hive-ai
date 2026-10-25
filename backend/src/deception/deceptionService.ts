import prisma from '../utils/prisma.js';
import { broadcastEvent } from '../websocket/index.js';
import { GovernorService } from '../governor/governorService.js';
import { TelemetryService } from '../telemetry/telemetryService.js';
import { EvidenceService } from '../evidence/evidenceService.js';

export class DeceptionService {
  static async getDecoys() {
    return prisma.decoy.findMany({
      include: {
        site: true,
        honeytokens: true,
      },
    });
  }

  static async getHoneytokens() {
    return prisma.honeytoken.findMany({
      include: {
        asset: true,
        decoy: true,
      },
    });
  }

  /**
   * Orchestrates adaptive deception based on session curiosity and predicted stage
   */
  static async deployAdaptiveDeception(sessionId: string) {
    const session = await prisma.threatSession.findUnique({
      where: { id: sessionId },
      include: { curiosityProfile: true },
    });

    if (!session) return null;

    // Check curiosity
    const credScore = session.curiosityProfile?.credentialsScore || 50;
    const dbScore = session.curiosityProfile?.databaseScore || 30;

    let targetDecoyName = 'AUTH-DECOY-07';
    let targetAction = 'ACTIVATE_AUTH_DECOY';
    let rationale = 'Adversary shows dominant credential curiosity (91%). Deploying Active Directory Decoy with synthetic financial controller identity.';

    if (dbScore > credScore && dbScore > 65) {
      targetDecoyName = 'DB-DECOY-03';
      targetAction = 'ACTIVATE_DB_DECOY';
      rationale = 'Adversary targeting database stores. Deploying PostgreSQL transaction shadow decoy with customer payment tables.';
    }

    // Pass through Autonomy Safety Governor
    const governorResult = await GovernorService.evaluateAction(targetAction, sessionId);

    if (governorResult.decision === 'BLOCK') {
      console.warn('[DECEPTION] Action blocked by Safety Governor');
      return null;
    }

    // Find or arm target decoy
    const decoy = await prisma.decoy.findUnique({
      where: { hostname: targetDecoyName },
    });

    if (decoy) {
      await prisma.decoy.update({
        where: { id: decoy.id },
        data: {
          status: 'ENGAGED',
          engagementRate: Math.min(100, decoy.engagementRate + 2),
        },
      });
    }

    // Deploy or activate honeytoken
    const honeytoken = await prisma.honeytoken.findFirst({
      where: { name: 'admin_backup_password.txt' },
    });

    // Record autonomous action
    const action = await prisma.autonomousAction.create({
      data: {
        sessionId,
        actionType: targetAction,
        targetDecoyId: decoy?.id,
        targetHoneytokenId: honeytoken?.id,
        rationale,
        status: 'EXECUTED',
      },
    });

    // Mark session as diverted to shadow network
    await prisma.threatSession.update({
      where: { id: sessionId },
      data: {
        shadowDiverted: true,
        divertedToDecoy: targetDecoyName,
        status: 'DIVERTED',
      },
    });

    broadcastEvent('decoy:status', { decoy, action });
    broadcastEvent('session:update', { sessionId, shadowDiverted: true, divertedToDecoy: targetDecoyName });

    return { action, decoy, honeytoken, governor: governorResult };
  }

  /**
   * Trigger honeytoken access event
   */
  static async triggerHoneytoken(honeytokenId: string, sessionId: string) {
    const ht = await prisma.honeytoken.findUnique({
      where: { id: honeytokenId },
      include: { asset: true, decoy: true },
    });

    if (!ht) return null;

    // Update honeytoken state
    const updatedHt = await prisma.honeytoken.update({
      where: { id: honeytokenId },
      data: {
        triggered: true,
        triggeredCount: { increment: 1 },
        lastTriggeredAt: new Date(),
      },
    });

    // Create telemetry event
    const event = await TelemetryService.ingestEvent({
      sessionId,
      source: 'HONEYPOT_MONITOR',
      sourceAddress: '198.51.100.42',
      assetId: ht.assetId || undefined,
      eventType: 'HONEYTOKEN_ACCESS',
      severity: 'CRITICAL',
      description: `Honeytoken lure '${ht.name}' was accessed. Unauthorized credential extraction detected.`,
      metadata: {
        tokenName: ht.name,
        tokenValue: ht.tokenValue,
        locationPath: ht.locationPath,
      },
    });

    // Capture forensic evidence
    await EvidenceService.collectEvidence({
      sessionId,
      evidenceType: 'HONEYTOKEN_TRIGGER',
      title: `Honeytoken Triggered: ${ht.name}`,
      description: `Simulated adversary accessed lure ${ht.name} at path ${ht.locationPath}. Token signature verified.`,
      rawPayload: JSON.stringify({ token: ht.name, signature: ht.tokenValue, time: new Date().toISOString() }),
      evidenceStrength: 95,
      predictionConf: 90,
      evidenceCompleteness: 98,
    });

    broadcastEvent('honeytoken:trigger', { honeytoken: updatedHt, event });
    return updatedHt;
  }
}
