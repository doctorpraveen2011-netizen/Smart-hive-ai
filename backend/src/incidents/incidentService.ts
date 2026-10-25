import prisma from '../utils/prisma.js';
import { broadcastEvent } from '../websocket/index.js';
import { ResponseService } from '../response/responseService.js';

export class IncidentService {
  static async createIncident(data: {
    sessionId: string;
    title: string;
    severity: string;
    risk: number;
    attackType: string;
    predictedAttack: string;
    siteId: string;
    targetAssetId?: string;
  }) {
    const code = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const incident = await prisma.incident.create({
      data: {
        incidentCode: code,
        title: data.title,
        severity: data.severity,
        risk: data.risk,
        attackType: data.attackType,
        predictedAttack: data.predictedAttack,
        siteId: data.siteId,
        sessionId: data.sessionId,
        targetAssetId: data.targetAssetId,
        status: 'INVESTIGATING',
      },
      include: {
        site: true,
        targetAsset: true,
        session: true,
      },
    });

    // Auto-dispatch nearest response team if high/critical
    if (data.risk >= 70) {
      await ResponseService.assignNearestTeam(incident.id, data.siteId);
    }

    broadcastEvent('incident:update', incident);
    return incident;
  }

  static async getIncidents() {
    return prisma.incident.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        site: true,
        targetAsset: true,
        responseTeam: true,
        evidence: true,
        assignments: {
          include: { team: true },
        },
      },
    });
  }

  static async updateIncidentStatus(incidentId: string, status: string) {
    const updated = await prisma.incident.update({
      where: { id: incidentId },
      data: { status },
      include: {
        site: true,
        targetAsset: true,
        responseTeam: true,
      },
    });

    broadcastEvent('incident:update', updated);
    return updated;
  }
}
