import prisma from '../utils/prisma.js';
import { calculateSha256 } from '../utils/crypto.js';
import { broadcastEvent } from '../websocket/index.js';

export interface CollectEvidenceInput {
  incidentId?: string;
  sessionId?: string;
  evidenceType: string;
  title: string;
  description: string;
  rawPayload: string;
  evidenceStrength?: number;
  predictionConf?: number;
  evidenceCompleteness?: number;
}

export class EvidenceService {
  static async collectEvidence(input: CollectEvidenceInput) {
    const sha256 = calculateSha256({
      evidenceType: input.evidenceType,
      title: input.title,
      description: input.description,
      rawPayload: input.rawPayload,
      timestamp: new Date().toISOString(),
    });

    const evidence = await prisma.evidence.create({
      data: {
        incidentId: input.incidentId,
        sessionId: input.sessionId,
        evidenceType: input.evidenceType,
        title: input.title,
        description: input.description,
        rawPayload: input.rawPayload,
        sha256Hash: sha256,
        evidenceStrength: input.evidenceStrength || 90,
        predictionConf: input.predictionConf || 84,
        evidenceCompleteness: input.evidenceCompleteness || 95,
      },
    });

    broadcastEvent('evidence:new', evidence);
    return evidence;
  }

  static async getEvidenceList(sessionId?: string, incidentId?: string) {
    return prisma.evidence.findMany({
      where: {
        sessionId: sessionId || undefined,
        incidentId: incidentId || undefined,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        incident: true,
        session: true,
      },
    });
  }
}
