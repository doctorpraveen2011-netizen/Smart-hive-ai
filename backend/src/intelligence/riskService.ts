import prisma from '../utils/prisma.js';
import { broadcastEvent } from '../websocket/index.js';

export class RiskService {
  /**
   * Deterministic 0-100 Risk Engine. No Math.random().
   */
  static calculateDeterministicRisk(params: {
    eventCount: number;
    highestSeverity: string;
    anomalyScore: number; // 0.0 - 1.0
    hasDecoyInteraction: boolean;
    hasHoneytokenHit: boolean;
    stage: string;
    predictionConfidence: number; // 0-100
    assetSensitivity?: string;
  }): { score: number; category: string; reason: string } {
    let score = 5; // Base normal network noise baseline

    // 1. Stage weight (up to 35 pts)
    const stageWeights: Record<string, number> = {
      NORMAL: 5,
      RECONNAISSANCE: 18,
      DISCOVERY: 32,
      CREDENTIAL_DISCOVERY: 54,
      CREDENTIAL_ACCESS_ATTEMPT: 72,
      PRIVILEGE_ESCALATION_ATTEMPT: 78,
      LATERAL_MOVEMENT_ATTEMPT: 84,
      COLLECTION: 88,
      EXFILTRATION_RISK: 94,
      CONTAINED: 12,
    };
    score = stageWeights[params.stage] || 20;

    // 2. Anomaly score boost (up to 15 pts)
    score += Math.round((params.anomalyScore || 0) * 15);

    // 3. Decoy interaction boost (10 pts)
    if (params.hasDecoyInteraction) {
      score += 10;
    }

    // 4. Honeytoken hit (High fidelity indicator: +18 pts)
    if (params.hasHoneytokenHit) {
      score += 18;
    }

    // 5. Target asset sensitivity
    if (params.assetSensitivity === 'CRITICAL') {
      score += 8;
    } else if (params.assetSensitivity === 'HIGH') {
      score += 5;
    }

    // 6. Event velocity / volume clamp
    if (params.eventCount > 15) {
      score += 5;
    }

    // If stage is CONTAINED, drastically reduce risk
    if (params.stage === 'CONTAINED') {
      score = Math.min(score, 15);
    }

    // Clamp score between 0 and 100
    score = Math.max(0, Math.min(100, score));

    // Determine category
    let category = 'LOW';
    if (score >= 85) category = 'CRITICAL';
    else if (score >= 70) category = 'HIGH';
    else if (score >= 50) category = 'MEDIUM';
    else if (score >= 25) category = 'GUARDED';
    else category = 'LOW';

    let reason = `Stage: ${params.stage}`;
    if (params.hasHoneytokenHit) reason += ' + Honeytoken Activated';
    if (params.hasDecoyInteraction) reason += ' + Decoy Lured';

    return { score, category, reason };
  }

  static async updateSessionRisk(sessionId: string) {
    const session = await prisma.threatSession.findUnique({
      where: { id: sessionId },
      include: {
        events: true,
        behaviorProfile: true,
      },
    });

    if (!session) return null;

    const hasDecoy = session.events.some((e: any) => e.eventType === 'DECOY_INTERACTION');
    const hasHoneytoken = session.events.some((e: any) => e.eventType === 'HONEYTOKEN_ACCESS');
    const highestSev = session.events.some((e: any) => e.severity === 'CRITICAL')
      ? 'CRITICAL'
      : session.events.some((e: any) => e.severity === 'HIGH')
      ? 'HIGH'
      : 'MEDIUM';

    const calculated = this.calculateDeterministicRisk({
      eventCount: session.events.length,
      highestSeverity: highestSev,
      anomalyScore: session.behaviorProfile?.anomalyScore || 0.45,
      hasDecoyInteraction: hasDecoy,
      hasHoneytokenHit: hasHoneytoken,
      stage: session.currentStage,
      predictionConfidence: 84,
      assetSensitivity: 'HIGH',
    });

    // Update ThreatSession
    const updated = await prisma.threatSession.update({
      where: { id: sessionId },
      data: {
        riskScore: calculated.score,
        riskCategory: calculated.category,
      },
    });

    // Log RiskHistory record
    const history = await prisma.riskHistory.create({
      data: {
        sessionId,
        riskScore: calculated.score,
        category: calculated.category,
        stage: session.currentStage,
        triggerDesc: calculated.reason,
      },
    });

    broadcastEvent('risk:update', {
      sessionId,
      riskScore: calculated.score,
      category: calculated.category,
      history,
    });

    return updated;
  }
}
