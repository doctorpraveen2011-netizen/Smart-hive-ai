import prisma from '../utils/prisma.js';
import { broadcastEvent } from '../websocket/index.js';

export class CounterfactualService {
  /**
   * Evaluates What-If Defense Scenarios for a Threat Session
   */
  static async evaluateCounterfactuals(sessionId: string) {
    const session = await prisma.threatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) return [];

    const currentRisk = session.riskScore || 86;

    // What-If scenarios:
    // 1. NO_ACTION
    // 2. AUTH_DECOY (Deploy Kerberos decoy AUTH-DECOY-07 + honeytoken)
    // 3. SHADOW_NETWORK (Reroute session into parallel deception path)
    // 4. SIMULATED_SESSION_ISOLATION (Terminate connection safely)

    const scenarios = [
      {
        proposedAction: 'NO_ACTION',
        progressionRisk: Math.min(98, Math.round(currentRisk * 0.9 + 10)),
        estimatedRiskReduction: 0,
        recommendedAction: false,
        rationale: 'Passive monitoring allows attacker unchecked access to explore production assets.',
        simulatedDefenseOutcome: 'SIMULATED DEFENSE OUTCOME: Attacker advances to Credential Access on AUTH-SRV-01 within ~5 minutes.',
      },
      {
        proposedAction: 'AUTH_DECOY',
        progressionRisk: 31,
        estimatedRiskReduction: Math.max(10, currentRisk - 31),
        recommendedAction: true,
        rationale: 'Deploying AUTH-DECOY-07 intercepts authentication attempts with high fidelity while gathering forensic intelligence without production impact.',
        simulatedDefenseOutcome: 'SIMULATED DEFENSE OUTCOME: Attacker pivots onto decoy domain controller; zero production disruption.',
      },
      {
        proposedAction: 'SHADOW_NETWORK',
        progressionRisk: 18,
        estimatedRiskReduction: Math.max(10, currentRisk - 18),
        recommendedAction: false,
        rationale: 'Diverting full session traffic to deception shadow environment completely protects corporate assets while prolonging attacker engagement.',
        simulatedDefenseOutcome: 'SIMULATED DEFENSE OUTCOME: Attacker explores shadow network topology while forensic hashes are captured.',
      },
      {
        proposedAction: 'SIMULATED_SESSION_ISOLATION',
        progressionRisk: 6,
        estimatedRiskReduction: Math.max(10, currentRisk - 6),
        recommendedAction: false,
        rationale: 'Terminates the simulated connection immediately. Lowers risk instantly but halts threat intelligence collection.',
        simulatedDefenseOutcome: 'SIMULATED DEFENSE OUTCOME: Session severed at edge gateway. Adversary will likely change IP and retry.',
      },
    ];

    // Persist in DB
    await prisma.counterfactualSimulation.deleteMany({ where: { sessionId } });

    const results = await Promise.all(
      scenarios.map((sc) =>
        prisma.counterfactualSimulation.create({
          data: {
            sessionId,
            currentRisk,
            proposedAction: sc.proposedAction,
            progressionRisk: sc.progressionRisk,
            estimatedRiskReduction: sc.estimatedRiskReduction,
            recommendedAction: sc.recommendedAction,
            rationale: sc.rationale,
            simulatedDefenseOutcome: sc.simulatedDefenseOutcome,
          },
        })
      )
    );

    broadcastEvent('counterfactual:update', { sessionId, simulations: results });
    return results;
  }
}
