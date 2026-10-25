import prisma from '../utils/prisma.js';
import { broadcastEvent } from '../websocket/index.js';
import { RiskService } from './riskService.js';
import { CuriosityService } from './curiosityService.js';

export class SessionService {
  static async getActiveSessions() {
    return prisma.threatSession.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        events: {
          take: 10,
          orderBy: { timestamp: 'desc' },
        },
        curiosityProfile: true,
        behaviorProfile: true,
        predictions: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  static async getSessionByCode(sessionCode: string) {
    return prisma.threatSession.findUnique({
      where: { sessionCode },
      include: {
        events: {
          orderBy: { timestamp: 'desc' },
        },
        curiosityProfile: true,
        behaviorProfile: true,
        predictions: {
          orderBy: { createdAt: 'desc' },
        },
        threatFutures: true,
        counterfactuals: true,
        riskHistories: {
          orderBy: { timestamp: 'asc' },
        },
        autonomousActions: {
          include: { targetDecoy: true, targetHoneytoken: true },
        },
        governorDecisions: true,
        evidence: true,
        evaluations: true,
      },
    });
  }

  static async updateSessionStage(
    sessionId: string,
    stage: string,
    stageState: string = 'OBSERVED',
    observedAttackType?: string,
    suspectedIntent?: string
  ) {
    const session = await prisma.threatSession.update({
      where: { id: sessionId },
      data: {
        currentStage: stage,
        stageState: stageState,
        observedAttackType: observedAttackType || undefined,
        suspectedIntent: suspectedIntent || undefined,
      },
    });

    // Recalculate Risk & Curiosity
    await RiskService.updateSessionRisk(sessionId);
    await CuriosityService.evaluateSessionCuriosity(sessionId);

    broadcastEvent('session:update', session);
    return session;
  }
}
