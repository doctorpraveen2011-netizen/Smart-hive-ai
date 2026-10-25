import prisma from '../utils/prisma.js';
import { calculateSha256 } from '../utils/crypto.js';
import { broadcastEvent } from '../websocket/index.js';

export interface IngestEventInput {
  sessionId?: string;
  source: string;
  sourceAddress: string;
  assetId?: string;
  eventType: string;
  severity: string;
  description: string;
  siteId?: string;
  metadata?: Record<string, any>;
}

export class TelemetryService {
  static async ingestEvent(input: IngestEventInput) {
    const metaStr = JSON.stringify(input.metadata || {});
    const sha256 = calculateSha256({
      timestamp: new Date().toISOString(),
      sourceAddress: input.sourceAddress,
      eventType: input.eventType,
      severity: input.severity,
      metadata: metaStr,
    });

    const event = await prisma.securityEvent.create({
      data: {
        sessionId: input.sessionId,
        source: input.source,
        sourceAddress: input.sourceAddress,
        assetId: input.assetId,
        eventType: input.eventType,
        severity: input.severity,
        description: input.description,
        siteId: input.siteId,
        metadata: metaStr,
        sha256Hash: sha256,
      },
      include: {
        asset: true,
        site: true,
      },
    });

    broadcastEvent('event:new', event);
    return event;
  }

  static async getEvents(limit = 100, sessionId?: string) {
    return prisma.securityEvent.findMany({
      where: sessionId ? { sessionId } : undefined,
      take: limit,
      orderBy: { timestamp: 'desc' },
      include: {
        asset: true,
        site: true,
      },
    });
  }
}
