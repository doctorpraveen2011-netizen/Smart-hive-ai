import prisma from '../utils/prisma.js';
import { broadcastEvent } from '../websocket/index.js';

export class ResponseService {
  static async getTeams() {
    return prisma.responseTeam.findMany({
      include: {
        incidents: true,
        assignments: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  static async assignNearestTeam(incidentId: string, siteId: string) {
    const site = await prisma.site.findUnique({ where: { id: siteId } });
    const teams = await prisma.responseTeam.findMany({
      where: { status: 'AVAILABLE' },
    });

    if (!site || teams.length === 0) return null;

    // Calculate nearest team using haversine formula
    let bestTeam = teams[0];
    let minDistance = Infinity;

    for (const team of teams) {
      const dLat = (team.latitude - site.latitude) * (Math.PI / 180);
      const dLon = (team.longitude - site.longitude) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(site.latitude * (Math.PI / 180)) *
          Math.cos(team.latitude * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distKm = 6371 * c;

      if (distKm < minDistance) {
        minDistance = distKm;
        bestTeam = team;
      }
    }

    const etaMinutes = Math.max(8, Math.round(minDistance / 1.2)); // Approx city response speed

    // Update team status
    await prisma.responseTeam.update({
      where: { id: bestTeam.id },
      data: {
        status: 'DISPATCHED',
        assignedIncident: incidentId,
        etaMinutes,
        lastUpdate: new Date(),
      },
    });

    // Update incident
    await prisma.incident.update({
      where: { id: incidentId },
      data: {
        responseTeamId: bestTeam.id,
        status: 'RESPONSE_DISPATCHED',
      },
    });

    // Create Response Assignment with Intelligence Package
    const assignment = await prisma.responseAssignment.create({
      data: {
        incidentId,
        teamId: bestTeam.id,
        priority: 'P1_CRITICAL',
        etaMinutes,
        recommendedResponse: `Deploy physical site perimeter isolation at ${site.name}. Secure server room rack containing targeted asset and capture volatile memory dump from auth controller decoy.`,
        status: 'DISPATCHED',
      },
      include: {
        incident: true,
        team: true,
      },
    });

    broadcastEvent('response:dispatch', {
      incidentId,
      team: bestTeam,
      etaMinutes,
      assignment,
    });

    return assignment;
  }
}
