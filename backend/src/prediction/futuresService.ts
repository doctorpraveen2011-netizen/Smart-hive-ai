import axios from 'axios';
import prisma from '../utils/prisma.js';
import { broadcastEvent } from '../websocket/index.js';

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://127.0.0.1:8000';

export class FuturesService {
  static async generateThreatFutures(sessionId: string) {
    const session = await prisma.threatSession.findUnique({
      where: { id: sessionId },
      include: { curiosityProfile: true, events: true },
    });

    if (!session) return [];

    let branches: any[] = [];

    try {
      const resp = await axios.post(`${AI_ENGINE_URL}/evaluate-futures`, {
        current_stage: session.currentStage,
        curiosity: session.curiosityProfile || {},
      }, { timeout: 1500 });

      if (resp.data && resp.data.branches) {
        branches = resp.data.branches;
      }
    } catch (err) {
      // Deterministic calculation
      const cred = session.curiosityProfile?.credentialsScore || 70;
      const db = session.curiosityProfile?.databaseScore || 40;

      if (session.currentStage === 'CREDENTIAL_DISCOVERY' || session.currentStage === 'DISCOVERY') {
        branches = [
          {
            branchName: 'Credential Access Attempt',
            probability: 71,
            stage: 'CREDENTIAL_ACCESS_ATTEMPT',
            predictedTarget: 'AUTH-SRV-01',
            risk: 86,
            supportingEvidence: `Adversary exhibits ${cred}% credential curiosity and activated synthetic honeytoken.`,
          },
          {
            branchName: 'Privilege Escalation Attempt',
            probability: 18,
            stage: 'PRIVILEGE_ESCALATION_ATTEMPT',
            predictedTarget: 'DEV-SRV-01',
            risk: 68,
            supportingEvidence: 'CI/CD runner enumeration observed on port 8080.',
          },
          {
            branchName: 'Session Stops / Decoy Dormancy',
            probability: 11,
            stage: 'CONTAINED',
            predictedTarget: 'AUTH-DECOY-07',
            risk: 18,
            supportingEvidence: 'Intermittent beaconing indicates automated script without operator takeover.',
          },
        ];
      } else if (session.currentStage === 'CREDENTIAL_ACCESS_ATTEMPT') {
        branches = [
          {
            branchName: 'Database Lateral Movement',
            probability: 64,
            stage: 'LATERAL_MOVEMENT_ATTEMPT',
            predictedTarget: 'DB-PROD-01',
            risk: 92,
            supportingEvidence: `Elevated database curiosity (${db}%) after authentication probing.`,
          },
          {
            branchName: 'Corporate File Share Staging',
            probability: 24,
            stage: 'COLLECTION',
            predictedTarget: 'FILE-SRV-01',
            risk: 76,
            supportingEvidence: 'SMB port 445 querying observed on internal subnet.',
          },
          {
            branchName: 'Session Disconnected',
            probability: 12,
            stage: 'CONTAINED',
            predictedTarget: 'NONE',
            risk: 15,
            supportingEvidence: 'Shadow network firewall diversion active.',
          },
        ];
      } else {
        branches = [
          {
            branchName: 'Reconnaissance Escalation',
            probability: 65,
            stage: 'DISCOVERY',
            predictedTarget: 'WEB-SRV-01',
            risk: 42,
            supportingEvidence: 'Port 80/443 banner grabbing',
          },
          {
            branchName: 'API Endpoint Fuzzing',
            probability: 25,
            stage: 'DISCOVERY',
            predictedTarget: 'API-GATEWAY-01',
            risk: 35,
            supportingEvidence: 'REST parameter probing',
          },
          {
            branchName: 'Benign Noise Decay',
            probability: 10,
            stage: 'NORMAL',
            predictedTarget: 'NONE',
            risk: 8,
            supportingEvidence: 'Low packet burst velocity',
          },
        ];
      }
    }

    // Clear old branches for this session and insert fresh ones
    await prisma.threatFuture.deleteMany({ where: { sessionId } });

    const createdBranches = await Promise.all(
      branches.map((b, index) =>
        prisma.threatFuture.create({
          data: {
            sessionId,
            branchName: b.branchName,
            probability: b.probability,
            stage: b.stage,
            predictedTarget: b.predictedTarget,
            risk: b.risk,
            supportingEvidence: b.supportingEvidence,
            branchDepth: index === 0 ? 1 : 2,
          },
        })
      )
    );

    broadcastEvent('futures:update', { sessionId, branches: createdBranches });
    return createdBranches;
  }
}
