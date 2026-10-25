import prisma from '../utils/prisma.js';
import { broadcastEvent } from '../websocket/index.js';

export class CuriosityService {
  /**
   * Derive curiosity vector from actual session events
   */
  static async evaluateSessionCuriosity(sessionId: string) {
    const session = await prisma.threatSession.findUnique({
      where: { id: sessionId },
      include: { events: true },
    });

    if (!session) return null;

    let credScore = 15;
    let dbScore = 10;
    let cloudScore = 8;
    let srcScore = 12;
    let finScore = 5;
    let authScore = 14;

    for (const evt of session.events) {
      const type = evt.eventType;
      const desc = evt.description.toLowerCase();
      const meta = evt.metadata ? evt.metadata.toLowerCase() : '';

      // Credentials Focus
      if (type === 'CREDENTIAL_DISCOVERY' || desc.includes('credential') || desc.includes('password') || meta.includes('22')) {
        credScore += 25;
      }
      if (type === 'HONEYTOKEN_ACCESS') {
        credScore += 30;
      }
      if (type === 'AUTH_ATTEMPT' || desc.includes('kerberos') || desc.includes('ntlm') || meta.includes('88')) {
        credScore += 18;
        authScore += 35;
      }

      // Database Focus
      if (desc.includes('database') || desc.includes('sql') || meta.includes('5432') || meta.includes('1433') || meta.includes('3306')) {
        dbScore += 32;
      }

      // Cloud Secrets
      if (desc.includes('aws') || desc.includes('s3') || desc.includes('cloud') || desc.includes('token')) {
        cloudScore += 28;
      }

      // Source Code
      if (desc.includes('gitlab') || desc.includes('ci/cd') || desc.includes('repo') || desc.includes('git')) {
        srcScore += 24;
      }

      // Financial Data
      if (desc.includes('finance') || desc.includes('salary') || desc.includes('q4') || desc.includes('payment')) {
        finScore += 30;
      }

      // Authentication Infrastructure
      if (desc.includes('ldap') || desc.includes('active directory') || desc.includes('auth-srv') || meta.includes('389')) {
        authScore += 26;
      }
    }

    // Clamp 0 to 100
    credScore = Math.min(100, credScore);
    dbScore = Math.min(100, dbScore);
    cloudScore = Math.min(100, cloudScore);
    srcScore = Math.min(100, srcScore);
    finScore = Math.min(100, finScore);
    authScore = Math.min(100, authScore);

    // Identify primary interest
    const interestMap = [
      { name: 'Credentials', score: credScore },
      { name: 'Authentication Infrastructure', score: authScore },
      { name: 'Databases', score: dbScore },
      { name: 'Financial Data', score: finScore },
      { name: 'Cloud Secrets', score: cloudScore },
      { name: 'Source Code', score: srcScore },
    ];
    interestMap.sort((a, b) => b.score - a.score);
    const primaryInterest = interestMap[0].name;

    const explanation = `Adversary exhibits dominant interest in ${primaryInterest} (${interestMap[0].score}%) based on ${session.events.length} observed telemetry signals.`;

    // Persist or update CuriosityProfile
    const profile = await prisma.curiosityProfile.upsert({
      where: { sessionId },
      update: {
        credentialsScore: credScore,
        databaseScore: dbScore,
        cloudSecretsScore: cloudScore,
        sourceCodeScore: srcScore,
        financialScore: finScore,
        authInfraScore: authScore,
        primaryInterest,
        evidenceReason: explanation,
        lastUpdated: new Date(),
      },
      create: {
        sessionId,
        credentialsScore: credScore,
        databaseScore: dbScore,
        cloudSecretsScore: cloudScore,
        sourceCodeScore: srcScore,
        financialScore: finScore,
        authInfraScore: authScore,
        primaryInterest,
        evidenceReason: explanation,
      },
    });

    broadcastEvent('curiosity:update', profile);
    return profile;
  }
}
