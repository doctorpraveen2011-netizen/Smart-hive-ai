export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Site {
  id: string;
  code: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  address: string;
  riskLevel: string;
  assets?: Asset[];
  decoys?: Decoy[];
}

export interface Asset {
  id: string;
  hostname: string;
  type: string;
  internalAddress: string;
  siteId: string;
  site?: Site;
  status: string;
  sensitivity: string;
  risk: number;
  lastActivity: string;
  deceptionStatus: string;
}

export interface Decoy {
  id: string;
  name: string;
  hostname: string;
  type: string;
  internalAddress: string;
  siteId: string;
  site?: Site;
  status: string;
  effectivenessScore: number;
  engagementRate: number;
  diversionSuccess: number;
  evidenceQuality: number;
  avgEngagementTimeSecs: number;
  templateType: string;
}

export interface Honeytoken {
  id: string;
  name: string;
  type: string;
  tokenValue: string;
  locationPath: string;
  triggered: boolean;
  triggeredCount: number;
  lastTriggeredAt?: string;
  asset?: Asset;
  decoy?: Decoy;
}

export interface ThreatSession {
  id: string;
  sessionCode: string;
  sourceAddress: string;
  targetAsset?: string;
  siteCode?: string;
  currentStage: string;
  stageState: string;
  observedAttackType: string;
  suspectedIntent: string;
  riskScore: number;
  riskCategory: string;
  status: string;
  shadowDiverted: boolean;
  divertedToDecoy?: string;
  events?: SecurityEvent[];
  curiosityProfile?: CuriosityProfile;
  behaviorProfile?: BehaviorProfile;
  predictions?: AttackPrediction[];
  threatFutures?: ThreatFuture[];
  counterfactuals?: CounterfactualSimulation[];
  governorDecisions?: GovernorDecision[];
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  sessionId?: string;
  source: string;
  sourceAddress: string;
  assetId?: string;
  asset?: Asset;
  eventType: string;
  severity: string;
  description: string;
  siteId?: string;
  site?: Site;
  metadata: string;
  sha256Hash: string;
}

export interface CuriosityProfile {
  id: string;
  credentialsScore: number;
  databaseScore: number;
  cloudSecretsScore: number;
  sourceCodeScore: number;
  financialScore: number;
  authInfraScore: number;
  primaryInterest: string;
  evidenceReason: string;
}

export interface BehaviorProfile {
  id: string;
  eventVelocity: number;
  anomalyScore: number;
  dwellTimeSecs: number;
  failedAuthRate: number;
  portsScanned: number;
}

export interface AttackPrediction {
  id: string;
  currentStage: string;
  observedAttackType: string;
  suspectedIntent: string;
  predictedNextStage: string;
  predictedAttackType: string;
  predictedTarget: string;
  confidence: number;
  riskScore: number;
  explanation: string;
  createdAt: string;
}

export interface ThreatFuture {
  id: string;
  branchName: string;
  probability: number;
  stage: string;
  predictedTarget: string;
  risk: number;
  supportingEvidence: string;
  branchDepth: number;
}

export interface CounterfactualSimulation {
  id: string;
  currentRisk: number;
  proposedAction: string;
  progressionRisk: number;
  estimatedRiskReduction: number;
  recommendedAction: boolean;
  rationale: string;
  simulatedDefenseOutcome: string;
}

export interface GovernorDecision {
  id: string;
  actionType: string;
  autonomyLevel: string;
  decision: string;
  policyRule: string;
  reason: string;
  approvedBy: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  incidentCode: string;
  title: string;
  severity: string;
  risk: number;
  attackType: string;
  predictedAttack: string;
  siteId: string;
  site: Site;
  targetAsset?: Asset;
  responseTeam?: ResponseTeam;
  status: string;
  evidenceCount: number;
  createdAt: string;
  assignments?: ResponseAssignment[];
  responseAssignments?: any[];
}

export interface Evidence {
  id: string;
  incidentId?: string;
  sessionId?: string;
  evidenceType: string;
  title: string;
  description: string;
  rawPayload: string;
  sha256Hash: string;
  evidenceStrength: number;
  predictionConf: number;
  evidenceCompleteness: number;
  createdAt: string;
}

export interface ResponseTeam {
  id: string;
  code: string;
  name: string;
  locationName: string;
  latitude: number;
  longitude: number;
  status: string;
  etaMinutes: number;
  contactLead: string;
  phone: string;
}

export interface ResponseAssignment {
  id: string;
  team: ResponseTeam;
  priority: string;
  etaMinutes: number;
  recommendedResponse: string;
  status: string;
}

export interface Report {
  id: string;
  reportCode: string;
  title: string;
  executiveSummary: string;
  reportDataJson: string;
  sha256Hash: string;
  createdAt: string;
  incident: Incident;
}
