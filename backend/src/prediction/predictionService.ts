import axios from 'axios';
import prisma from '../utils/prisma.js';
import { broadcastEvent } from '../websocket/index.js';

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://127.0.0.1:8000';

export class PredictionService {
  static async predictNextStage(sessionId: string) {
    const session = await prisma.threatSession.findUnique({
      where: { id: sessionId },
      include: {
        events: true,
        curiosityProfile: true,
      },
    });

    if (!session) return null;

    let predictionData = {
      current_stage: session.currentStage,
      predicted_next_stage: 'CREDENTIAL_ACCESS_ATTEMPT',
      predicted_attack_type: 'Authentication Anomaly / Kerberos Probing',
      predicted_target: 'AUTH-SRV-01',
      confidence: 84,
      explanation: 'Credential Access is predicted because 11 services enumerated, SSH decoy accessed, credential honeytoken triggered, and authentication anomalies followed.',
    };

    try {
      const resp = await axios.post(`${AI_ENGINE_URL}/predict-next-stage`, {
        current_stage: session.currentStage,
        curiosity: session.curiosityProfile || {},
        event_count: session.events.length,
      }, { timeout: 1500 });
      if (resp.data) {
        predictionData = resp.data;
      }
    } catch (err) {
      // Graceful fallback to deterministic rules when AI engine is initializing
      console.warn('[PREDICTION] AI Engine offline or timed out, applying deterministic intelligence pipeline');
      if (session.currentStage === 'NORMAL' || session.currentStage === 'RECONNAISSANCE') {
        predictionData = {
          current_stage: session.currentStage,
          predicted_next_stage: 'DISCOVERY',
          predicted_attack_type: 'Port & Service Enumeration',
          predicted_target: 'WEB-SRV-01',
          confidence: 80,
          explanation: 'Reconnaissance against public perimeter ports (80/443) strongly predicts network discovery and enumeration.',
        };
      } else if (session.currentStage === 'DISCOVERY') {
        predictionData = {
          current_stage: session.currentStage,
          predicted_next_stage: 'CREDENTIAL_DISCOVERY',
          predicted_attack_type: 'Credential Hunting via Decoy Share',
          predicted_target: 'AUTH-SRV-01',
          confidence: 82,
          explanation: 'Enumeration of internal SMB and SSH services strongly predicts credential harvesting attempts.',
        };
      } else if (session.currentStage === 'CREDENTIAL_DISCOVERY') {
        predictionData = {
          current_stage: session.currentStage,
          predicted_next_stage: 'CREDENTIAL_ACCESS_ATTEMPT',
          predicted_attack_type: 'Authentication Anomaly / Kerberos Probing',
          predicted_target: 'AUTH-SRV-01',
          confidence: 84,
          explanation: 'Credential discovery and honeytoken activation indicate imminent authentication brute-force against AUTH-SRV-01.',
        };
      } else if (session.currentStage === 'CREDENTIAL_ACCESS_ATTEMPT') {
        predictionData = {
          current_stage: session.currentStage,
          predicted_next_stage: 'LATERAL_MOVEMENT_ATTEMPT',
          predicted_attack_type: 'Database Query Injection / Lateral Jump',
          predicted_target: 'DB-PROD-01',
          confidence: 86,
          explanation: 'Authentication anomalies indicate attacker is pivoting toward core transactional database DB-PROD-01.',
        };
      }
    }

    const prediction = await prisma.attackPrediction.create({
      data: {
        sessionId,
        currentStage: predictionData.current_stage,
        observedAttackType: session.observedAttackType,
        suspectedIntent: 'Authentication Access',
        predictedNextStage: predictionData.predicted_next_stage,
        predictedAttackType: predictionData.predicted_attack_type,
        predictedTarget: predictionData.predicted_target,
        confidence: predictionData.confidence,
        riskScore: session.riskScore,
        explanation: predictionData.explanation,
      },
    });

    broadcastEvent('prediction:update', prediction);
    return prediction;
  }
}
