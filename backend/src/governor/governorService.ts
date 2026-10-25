import prisma from '../utils/prisma.js';
import { broadcastEvent } from '../websocket/index.js';

export type AutonomyLevel = 'LEVEL_0' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3';
export type GovernorDecisionResult = 'ALLOW' | 'HUMAN_APPROVAL' | 'BLOCK';

export class GovernorService {
  /**
   * Evaluate proposed action against Safety Governor policies
   */
  static async evaluateAction(
    actionType: string,
    sessionId?: string,
    requestedLevel?: AutonomyLevel
  ): Promise<{ decision: GovernorDecisionResult; policyRule: string; reason: string }> {
    // Fetch system-configured autonomy level
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'AUTONOMY_LEVEL' },
    });
    const level: AutonomyLevel = (requestedLevel || setting?.value || 'LEVEL_2') as AutonomyLevel;

    let decision: GovernorDecisionResult = 'BLOCK';
    let policyRule = '';
    let reason = '';

    // Level 0: Pure Observation
    if (level === 'LEVEL_0') {
      decision = 'HUMAN_APPROVAL';
      policyRule = 'Level 0 Policy: Strict Observer Mode. All actions require manual intervention.';
      reason = 'Autonomy is locked to passive observation.';
    }
    // Level 1: Recommendation only
    else if (level === 'LEVEL_1') {
      decision = 'HUMAN_APPROVAL';
      policyRule = 'Level 1 Policy: Autonomous actions presented as recommendations for SOC Analyst review.';
      reason = 'Requires 1-click human confirmation in SecOps queue.';
    }
    // Level 2 & 3: Automated Safe Deception & Controlled Response
    else {
      switch (actionType) {
        case 'ACTIVATE_DECOY':
        case 'ACTIVATE_AUTH_DECOY':
        case 'ACTIVATE_DB_DECOY':
          decision = 'ALLOW';
          policyRule = 'Safe Deception Policy: Decoy activation is harmless to production and auto-approved.';
          reason = 'Zero risk to corporate assets; intercepts adversary traffic safely.';
          break;

        case 'DEPLOY_HONEYTOKEN':
          decision = 'ALLOW';
          policyRule = 'Honeytoken Policy: Deployment of synthetic passive lures is auto-approved.';
          reason = 'Synthetic files have no executable payload; enables early warning.';
          break;

        case 'INCREASE_MONITORING':
        case 'INCREASE_TELEMETRY':
          decision = 'ALLOW';
          policyRule = 'Monitoring Policy: Dynamic telemetry increase is read-only and auto-approved.';
          reason = 'Elevated logging captures deeper forensic detail.';
          break;

        case 'REDIRECT_SIMULATED_SESSION':
        case 'REDIRECT_SHADOW_NETWORK':
          decision = 'ALLOW';
          policyRule = 'Shadow Network Policy: Diverting simulated session to decoy network is auto-approved.';
          reason = 'Preserves production server integrity while preserving threat intelligence collection.';
          break;

        case 'ISOLATE_SIMULATED_DEMO_SESSION':
          decision = 'ALLOW';
          policyRule = 'Sandbox Policy: Immediate termination of simulated demo attack session is auto-approved.';
          reason = 'Simulated session quarantine resets risk to safe containment baseline.';
          break;

        case 'PRODUCTION_ENDPOINT_ISOLATION':
          decision = 'HUMAN_APPROVAL';
          policyRule = 'Production Boundary Policy: Disconnecting real production host requires human authority.';
          reason = 'Could impact legitimate corporate operations; requires SOC Incident Lead signoff.';
          break;

        case 'DISABLE_REAL_ACCOUNT':
          decision = 'HUMAN_APPROVAL';
          policyRule = 'Identity Governance Policy: Locking production employee credentials requires human verification.';
          reason = 'Prevents accidental lockout of genuine personnel.';
          break;

        case 'PRODUCTION_FIREWALL_MODIFICATION':
          decision = 'HUMAN_APPROVAL';
          policyRule = 'Network Infrastructure Policy: Permanent corporate firewall changes require Change Control.';
          reason = 'Risk of enterprise connectivity interruption.';
          break;

        case 'DESTRUCTIVE_PAYLOAD':
        case 'EXTERNAL_EXPLOIT':
        default:
          decision = 'BLOCK';
          policyRule = 'Absolute Defensive Invariant: Destructive or unauthorized actions are strictly prohibited.';
          reason = 'Violates defensive cybersecurity boundary rules.';
          break;
      }
    }

    // Persist decision in GovernorDecision table
    const record = await prisma.governorDecision.create({
      data: {
        sessionId,
        actionType,
        autonomyLevel: level,
        decision,
        policyRule,
        reason,
        approvedBy: decision === 'ALLOW' ? 'AUTONOMOUS_POLICY_ENGINE' : 'PENDING_SOC_ANALYST',
      },
    });

    broadcastEvent('governor:decision', record);
    return { decision, policyRule, reason };
  }

  static async getDecisions(limit = 50) {
    return prisma.governorDecision.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { session: true },
    });
  }

  static async updateDecision(id: string, decision: 'ALLOW' | 'BLOCK', approvedBy = 'SOC_Lead_Analyst') {
    const updated = await prisma.governorDecision.update({
      where: { id },
      data: {
        decision,
        approvedBy,
        reason:
          decision === 'ALLOW'
            ? 'Human SOC Analyst approved production change'
            : 'Human SOC Analyst rejected production change to maintain continuity',
      },
    });
    broadcastEvent('governor:decision', updated);
    return updated;
  }
}
