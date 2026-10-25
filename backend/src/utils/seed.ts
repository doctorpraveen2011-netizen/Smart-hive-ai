import bcrypt from 'bcryptjs';
import prisma from './prisma.js';
import { calculateSha256 } from './crypto.js';

async function main() {
  console.log('[SEED] Cleaning existing database records...');
  // Clean in relational order
  await prisma.auditLog.deleteMany();
  await prisma.report.deleteMany();
  await prisma.predictionEvaluation.deleteMany();
  await prisma.responseAssignment.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.governorDecision.deleteMany();
  await prisma.autonomousAction.deleteMany();
  await prisma.counterfactualSimulation.deleteMany();
  await prisma.threatFuture.deleteMany();
  await prisma.attackPrediction.deleteMany();
  await prisma.curiosityProfile.deleteMany();
  await prisma.behaviorProfile.deleteMany();
  await prisma.riskHistory.deleteMany();
  await prisma.securityEvent.deleteMany();
  await prisma.threatSession.deleteMany();
  await prisma.honeytoken.deleteMany();
  await prisma.decoy.deleteMany();
  await prisma.syntheticRelationship.deleteMany();
  await prisma.syntheticDocument.deleteMany();
  await prisma.syntheticCredential.deleteMany();
  await prisma.syntheticDevice.deleteMany();
  await prisma.syntheticIdentity.deleteMany();
  await prisma.syntheticDepartment.deleteMany();
  await prisma.assetRelationship.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.responseTeam.deleteMany();
  await prisma.site.deleteMany();
  await prisma.user.deleteMany();
  await prisma.systemSetting.deleteMany();

  console.log('[SEED] Seeding Users...');
  const salt = await bcrypt.genSalt(10);
  const analystPw = await bcrypt.hash('SmartHive2026!', salt);
  const adminPw = await bcrypt.hash('Admin2026!', salt);
  const respPw = await bcrypt.hash('Responder2026!', salt);

  await prisma.user.createMany({
    data: [
      {
        email: 'analyst@smartcorp.demo',
        password: analystPw,
        name: 'Ananya Iyer',
        role: 'SOC_ANALYST',
      },
      {
        email: 'admin@smartcorp.demo',
        password: adminPw,
        name: 'Vikram Malhotra',
        role: 'ADMIN',
      },
      {
        email: 'responder@smartcorp.demo',
        password: respPw,
        name: 'Capt. R. Sundaram',
        role: 'RESPONDER',
      },
    ],
  });

  console.log('[SEED] Seeding SmartCorp Sites...');
  const siteChennai = await prisma.site.create({
    data: {
      code: 'CHN-01',
      name: 'Chennai HQ',
      city: 'Chennai',
      latitude: 13.0827,
      longitude: 80.2707,
      address: 'SmartCorp Cyber Tower, OMR Expressway, Chennai, Tamil Nadu',
      riskLevel: 'LOW',
    },
  });

  const siteBengaluru = await prisma.site.create({
    data: {
      code: 'BLR-01',
      name: 'Bengaluru R&D Center',
      city: 'Bengaluru',
      latitude: 12.9716,
      longitude: 77.5946,
      address: 'Tech Innovation Zone, Whitefield, Bengaluru, Karnataka',
      riskLevel: 'LOW',
    },
  });

  const siteMumbai = await prisma.site.create({
    data: {
      code: 'MUM-01',
      name: 'Mumbai Core Datacenter',
      city: 'Mumbai',
      latitude: 19.0760,
      longitude: 72.8777,
      address: 'Tier-IV Secure Vault, Bandra-Kurla Complex, Mumbai, Maharashtra',
      riskLevel: 'HIGH',
    },
  });

  const siteDelhi = await prisma.site.create({
    data: {
      code: 'DEL-01',
      name: 'Delhi Operations Hub',
      city: 'Delhi',
      latitude: 28.7041,
      longitude: 77.1025,
      address: 'Central Cyber Exchange, Barakhamba Road, New Delhi',
      riskLevel: 'LOW',
    },
  });

  const siteHyderabad = await prisma.site.create({
    data: {
      code: 'HYD-01',
      name: 'Hyderabad Cloud Hub',
      city: 'Hyderabad',
      latitude: 17.3850,
      longitude: 78.4867,
      address: 'Cloud Nexus Phase 2, HITEC City, Hyderabad, Telangana',
      riskLevel: 'LOW',
    },
  });

  console.log('[SEED] Seeding Core Assets...');
  const webSrv = await prisma.asset.create({
    data: {
      hostname: 'WEB-SRV-01',
      type: 'WEB_SERVER',
      internalAddress: '10.10.10.15',
      siteId: siteChennai.id,
      status: 'ACTIVE',
      sensitivity: 'HIGH',
      risk: 25,
      deceptionStatus: 'NORMAL',
    },
  });

  const authSrv = await prisma.asset.create({
    data: {
      hostname: 'AUTH-SRV-01',
      type: 'AUTH_CONTROLLER',
      internalAddress: '10.10.20.10',
      siteId: siteMumbai.id,
      status: 'ACTIVE',
      sensitivity: 'CRITICAL',
      risk: 86,
      deceptionStatus: 'SHADOW_ACTIVE',
    },
  });

  const dbProd = await prisma.asset.create({
    data: {
      hostname: 'DB-PROD-01',
      type: 'DATABASE',
      internalAddress: '10.10.20.25',
      siteId: siteMumbai.id,
      status: 'ACTIVE',
      sensitivity: 'CRITICAL',
      risk: 40,
      deceptionStatus: 'PROTECTED',
    },
  });

  const fileSrv = await prisma.asset.create({
    data: {
      hostname: 'FILE-SRV-01',
      type: 'FILE_SERVER',
      internalAddress: '10.10.30.50',
      siteId: siteBengaluru.id,
      status: 'ACTIVE',
      sensitivity: 'HIGH',
      risk: 15,
      deceptionStatus: 'NORMAL',
    },
  });

  const mailSrv = await prisma.asset.create({
    data: {
      hostname: 'MAIL-SRV-01',
      type: 'MAIL_SERVER',
      internalAddress: '10.10.10.88',
      siteId: siteChennai.id,
      status: 'ACTIVE',
      sensitivity: 'MEDIUM',
      risk: 10,
      deceptionStatus: 'NORMAL',
    },
  });

  const devSrv = await prisma.asset.create({
    data: {
      hostname: 'DEV-SRV-01',
      type: 'CI_CD',
      internalAddress: '10.10.30.12',
      siteId: siteBengaluru.id,
      status: 'ACTIVE',
      sensitivity: 'HIGH',
      risk: 20,
      deceptionStatus: 'NORMAL',
    },
  });

  const apiGw = await prisma.asset.create({
    data: {
      hostname: 'API-GATEWAY-01',
      type: 'GATEWAY',
      internalAddress: '10.10.50.1',
      siteId: siteDelhi.id,
      status: 'ACTIVE',
      sensitivity: 'CRITICAL',
      risk: 30,
      deceptionStatus: 'NORMAL',
    },
  });

  const adminPortal = await prisma.asset.create({
    data: {
      hostname: 'ADMIN-PORTAL',
      type: 'PORTAL',
      internalAddress: '10.10.40.5',
      siteId: siteHyderabad.id,
      status: 'ACTIVE',
      sensitivity: 'HIGH',
      risk: 12,
      deceptionStatus: 'NORMAL',
    },
  });

  console.log('[SEED] Seeding Asset Relationships...');
  await prisma.assetRelationship.createMany({
    data: [
      {
        sourceAssetId: apiGw.id,
        targetAssetId: webSrv.id,
        relationshipType: 'ROUTES_TRAFFIC',
        protocol: 'HTTPS',
        port: 443,
      },
      {
        sourceAssetId: webSrv.id,
        targetAssetId: authSrv.id,
        relationshipType: 'AUTHENTICATES_WITH',
        protocol: 'KERBEROS',
        port: 88,
      },
      {
        sourceAssetId: authSrv.id,
        targetAssetId: dbProd.id,
        relationshipType: 'ACCESSES_DATA',
        protocol: 'POSTGRES',
        port: 5432,
      },
      {
        sourceAssetId: devSrv.id,
        targetAssetId: fileSrv.id,
        relationshipType: 'CI_CD_PIPELINE',
        protocol: 'SSH',
        port: 22,
      },
      {
        sourceAssetId: fileSrv.id,
        targetAssetId: authSrv.id,
        relationshipType: 'AUTHENTICATES_WITH',
        protocol: 'LDAP',
        port: 389,
      },
    ],
  });

  console.log('[SEED] Seeding Synthetic Reality Graph...');
  const deptFin = await prisma.syntheticDepartment.create({
    data: {
      code: 'FIN',
      name: 'Finance & Treasury',
      description: 'Corporate payroll, banking operations, and Q4 forecasts',
    },
  });

  const deptEng = await prisma.syntheticDepartment.create({
    data: {
      code: 'ENG',
      name: 'Core Platform Engineering',
      description: 'Distributed microservices and CI/CD operations',
    },
  });

  const idArun = await prisma.syntheticIdentity.create({
    data: {
      fullName: 'Arun Kumar',
      email: 'arun.kumar@smartcorp.demo',
      role: 'Lead Financial Controller',
      departmentId: deptFin.id,
    },
  });

  await prisma.syntheticDevice.create({
    data: {
      hostname: 'FIN-LT-014',
      deviceType: 'LAPTOP',
      assignedToId: idArun.id,
      ipAddress: '10.10.40.14',
      macAddress: '00:1A:2B:3C:4D:5E',
      os: 'Windows 11 Enterprise',
    },
  });

  await prisma.syntheticCredential.create({
    data: {
      username: 'arun.kumar',
      passwordHash: '$2a$10$syntheticHashArunKumar2026',
      plainHint: 'SmartCorpFinance$2026!',
      service: 'VPN_GATEWAY',
      identityId: idArun.id,
    },
  });

  await prisma.syntheticDocument.create({
    data: {
      filename: 'finance_q4.xlsx',
      fileType: 'SPREADSHEET',
      departmentId: deptFin.id,
      sensitivityLevel: 'RESTRICTED',
      contentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      summary: 'Q4 2026 Enterprise EBITDA and Executive Compensation Schedule',
    },
  });

  console.log('[SEED] Seeding Decoy Systems...');
  const decoyAuth = await prisma.decoy.create({
    data: {
      name: 'AUTH-DECOY-07',
      hostname: 'AUTH-DECOY-07',
      type: 'AUTH_CONTROLLER_DECOY',
      internalAddress: '10.10.99.10',
      siteId: siteMumbai.id,
      status: 'ARMED',
      effectivenessScore: 92,
      engagementRate: 85,
      diversionSuccess: 94,
      evidenceQuality: 91,
      avgEngagementTimeSecs: 260,
      templateType: 'fake-auth',
    },
  });

  const decoyDb = await prisma.decoy.create({
    data: {
      name: 'DB-DECOY-03',
      hostname: 'DB-DECOY-03',
      type: 'FAKE_DB',
      internalAddress: '10.10.99.25',
      siteId: siteMumbai.id,
      status: 'ARMED',
      effectivenessScore: 88,
      engagementRate: 78,
      diversionSuccess: 90,
      evidenceQuality: 86,
      templateType: 'fake-db',
    },
  });

  await prisma.decoy.createMany({
    data: [
      {
        name: 'SSH-DECOY-01',
        hostname: 'SSH-DECOY-01',
        type: 'SSH_HONEYPOT',
        internalAddress: '10.10.99.22',
        siteId: siteChennai.id,
        status: 'ARMED',
        effectivenessScore: 84,
        templateType: 'fake-ssh',
      },
      {
        name: 'FILE-DECOY-05',
        hostname: 'FILE-DECOY-05',
        type: 'FAKE_FILE_SHARE',
        internalAddress: '10.10.99.50',
        siteId: siteBengaluru.id,
        status: 'ARMED',
        effectivenessScore: 87,
        templateType: 'fake-files',
      },
      {
        name: 'WEB-DECOY-02',
        hostname: 'WEB-DECOY-02',
        type: 'FAKE_WEB',
        internalAddress: '10.10.99.15',
        siteId: siteDelhi.id,
        status: 'ARMED',
        effectivenessScore: 82,
        templateType: 'fake-web',
      },
    ],
  });

  console.log('[SEED] Seeding Honeytokens...');
  await prisma.honeytoken.createMany({
    data: [
      {
        name: 'admin_backup_password.txt',
        type: 'CREDENTIAL_FILE',
        tokenValue: 'HT-AUTH-9912-SECRET',
        decoyId: decoyAuth.id,
        locationPath: '/etc/security/backup/admin_backup_password.txt',
        triggered: false,
      },
      {
        name: 'finance_q4.xlsx',
        type: 'CONFIDENTIAL_DOC',
        tokenValue: 'HT-FIN-8821-EXCEL',
        assetId: fileSrv.id,
        locationPath: '/shares/finance/finance_q4.xlsx',
        triggered: false,
      },
      {
        name: 'vpn_credentials.txt',
        type: 'CREDENTIAL_FILE',
        tokenValue: 'HT-VPN-1049-SEC',
        assetId: webSrv.id,
        locationPath: '/var/www/.env.vpn',
        triggered: false,
      },
      {
        name: 'customer_backup.sql',
        type: 'DATABASE_DUMP',
        tokenValue: 'HT-DB-4011-SQL',
        decoyId: decoyDb.id,
        locationPath: '/pg_backup/customer_backup.sql',
        triggered: false,
      },
      {
        name: 'employee_salary_2026.xlsx',
        type: 'CONFIDENTIAL_DOC',
        tokenValue: 'HT-HR-7722-SALARY',
        assetId: fileSrv.id,
        locationPath: '/shares/hr/employee_salary_2026.xlsx',
        triggered: false,
      },
      {
        name: 'database_backup.sql',
        type: 'DATABASE_DUMP',
        tokenValue: 'HT-DB-9900-DUMP',
        assetId: dbProd.id,
        locationPath: '/backup/database_backup.sql',
        triggered: false,
      },
      {
        name: 'cloud_credentials.txt',
        type: 'AWS_KEY',
        tokenValue: 'HT-AWS-AKIA-MOCK-LURE',
        assetId: devSrv.id,
        locationPath: '/root/.aws/credentials',
        triggered: false,
      },
      {
        name: 'internal_network_map.pdf',
        type: 'NETWORK_MAP',
        tokenValue: 'HT-NET-MAP-3312',
        assetId: apiGw.id,
        locationPath: '/docs/architecture/internal_network_map.pdf',
        triggered: false,
      },
    ],
  });

  console.log('[SEED] Seeding Response Teams...');
  await prisma.responseTeam.createMany({
    data: [
      {
        code: 'RES-CHN-01',
        name: 'Rapid Incident Response Unit Alpha',
        locationName: 'Chennai Central Operations',
        latitude: 13.0827,
        longitude: 80.2707,
        status: 'AVAILABLE',
        contactLead: 'Capt. R. Sundaram',
        phone: '+91 44 2800 4401',
      },
      {
        code: 'RES-MUM-01',
        name: 'Tactical Cyber Intercept Unit Bravo',
        locationName: 'Mumbai BKC Command',
        latitude: 19.0760,
        longitude: 72.8777,
        status: 'AVAILABLE',
        contactLead: 'Maj. Sneha Kulkarni',
        phone: '+91 22 6600 8820',
      },
      {
        code: 'RES-BLR-01',
        name: 'Special Threat Mitigation Unit Charlie',
        locationName: 'Bengaluru Tech Corridor',
        latitude: 12.9716,
        longitude: 77.5946,
        status: 'AVAILABLE',
        contactLead: 'Lt. K. Ramesh',
        phone: '+91 80 4100 2233',
      },
      {
        code: 'RES-DEL-01',
        name: 'Perimeter Containment Unit Delta',
        locationName: 'New Delhi Rapid Response Base',
        latitude: 28.7041,
        longitude: 77.1025,
        status: 'AVAILABLE',
        contactLead: 'Capt. Amit Verma',
        phone: '+91 11 2300 9944',
      },
      {
        code: 'RES-HYD-01',
        name: 'Cloud Forensics Response Unit Echo',
        locationName: 'Hyderabad Cyberabad Command',
        latitude: 17.3850,
        longitude: 78.4867,
        status: 'AVAILABLE',
        contactLead: 'Dr. Neha Reddy',
        phone: '+91 40 6700 5511',
      },
    ],
  });

  console.log('[SEED] Seeding Demo Threat Session SH-104...');
  const session = await prisma.threatSession.create({
    data: {
      sessionCode: 'SH-104',
      sourceAddress: '198.51.100.42',
      targetAsset: 'AUTH-SRV-01',
      siteCode: 'MUM-01',
      currentStage: 'CREDENTIAL_DISCOVERY',
      stageState: 'OBSERVED',
      observedAttackType: 'Credential Discovery / Service Probing',
      suspectedIntent: 'Authentication Access',
      riskScore: 86,
      riskCategory: 'CRITICAL',
      status: 'ACTIVE',
      shadowDiverted: true,
      divertedToDecoy: 'AUTH-DECOY-07',
    },
  });

  // Curiosity & Behavior Profiles
  await prisma.curiosityProfile.create({
    data: {
      sessionId: session.id,
      credentialsScore: 91,
      databaseScore: 78,
      cloudSecretsScore: 61,
      sourceCodeScore: 43,
      financialScore: 24,
      authInfraScore: 88,
      primaryInterest: 'Credentials',
      evidenceReason: 'Elevated interest in credentials (91%) and authentication infrastructure (88%) following SMB and Kerberos probing.',
    },
  });

  await prisma.behaviorProfile.create({
    data: {
      sessionId: session.id,
      eventVelocity: 4.8,
      anomalyScore: 0.88,
      dwellTimeSecs: 290,
      failedAuthRate: 0.65,
      portsScanned: 11,
    },
  });

  // Initial Attack Prediction
  await prisma.attackPrediction.create({
    data: {
      sessionId: session.id,
      currentStage: 'Credential Discovery',
      observedAttackType: 'Credential Hunting via Decoy Share',
      suspectedIntent: 'Authentication Access',
      predictedNextStage: 'Credential Access Attempt',
      predictedAttackType: 'Kerberos / Active Directory Authentication Brute-Force',
      predictedTarget: 'AUTH-SRV-01',
      confidence: 84,
      riskScore: 86,
      explanation: 'Credential Access is predicted because 11 services enumerated, SSH decoy accessed, credential honeytoken triggered, and authentication anomalies followed.',
    },
  });

  // Threat Futures
  await prisma.threatFuture.createMany({
    data: [
      {
        sessionId: session.id,
        branchName: 'Credential Access Attempt',
        probability: 71,
        stage: 'CREDENTIAL_ACCESS_ATTEMPT',
        predictedTarget: 'AUTH-SRV-01',
        risk: 86,
        supportingEvidence: 'Adversary exhibits 91% credential interest and accessed admin_backup_password.txt lure.',
        branchDepth: 1,
      },
      {
        sessionId: session.id,
        branchName: 'Lateral Movement to Database',
        probability: 64,
        stage: 'LATERAL_MOVEMENT_ATTEMPT',
        predictedTarget: 'DB-PROD-01',
        risk: 92,
        supportingEvidence: 'Database curiosity vector (78%) indicates immediate follow-up against core payment vault.',
        branchDepth: 2,
      },
      {
        sessionId: session.id,
        branchName: 'Privilege Escalation Attempt',
        probability: 18,
        stage: 'PRIVILEGE_ESCALATION_ATTEMPT',
        predictedTarget: 'DEV-SRV-01',
        risk: 64,
        supportingEvidence: 'CI/CD server probing observed on port 8080.',
        branchDepth: 1,
      },
      {
        sessionId: session.id,
        branchName: 'Session Stops / Decoy Dormancy',
        probability: 11,
        stage: 'CONTAINED',
        predictedTarget: 'AUTH-DECOY-07',
        risk: 18,
        supportingEvidence: 'Adversary trapped in isolated shadow network container.',
        branchDepth: 1,
      },
    ],
  });

  // Counterfactual What-If Simulations
  await prisma.counterfactualSimulation.createMany({
    data: [
      {
        sessionId: session.id,
        currentRisk: 86,
        proposedAction: 'NO_ACTION',
        progressionRisk: 78,
        estimatedRiskReduction: 0,
        recommendedAction: false,
        rationale: 'Passive monitoring without defensive deception leads to unchecked credential compromise on AUTH-SRV-01.',
        simulatedDefenseOutcome: 'SIMULATED DEFENSE OUTCOME: Threat actor breaches domain controller within ~5 minutes.',
      },
      {
        sessionId: session.id,
        currentRisk: 86,
        proposedAction: 'AUTH_DECOY',
        progressionRisk: 31,
        estimatedRiskReduction: 60,
        recommendedAction: true,
        rationale: 'Activating AUTH-DECOY-07 lures the adversary into an isolated Active Directory sandbox, reducing attack progression risk by 60%.',
        simulatedDefenseOutcome: 'SIMULATED DEFENSE OUTCOME: Adversary diverted into synthetic domain controller with zero production impact.',
      },
      {
        sessionId: session.id,
        currentRisk: 86,
        proposedAction: 'SHADOW_NETWORK',
        progressionRisk: 18,
        estimatedRiskReduction: 75,
        recommendedAction: false,
        rationale: 'Full shadow network isolation completely shields corporate network while maximizing forensic evidence collection.',
        simulatedDefenseOutcome: 'SIMULATED DEFENSE OUTCOME: Session locked into digital twin shadow path.',
      },
      {
        sessionId: session.id,
        currentRisk: 86,
        proposedAction: 'SIMULATED_SESSION_ISOLATION',
        progressionRisk: 6,
        estimatedRiskReduction: 90,
        recommendedAction: false,
        rationale: 'Instant connection severance. Mitigates immediate risk but forfeits adversary intelligence and lead time tracking.',
        simulatedDefenseOutcome: 'SIMULATED DEFENSE OUTCOME: Attacker connection closed at edge gateway.',
      },
    ],
  });

  // Governor Decisions
  await prisma.governorDecision.create({
    data: {
      sessionId: session.id,
      actionType: 'ACTIVATE_AUTH_DECOY',
      autonomyLevel: 'LEVEL_2',
      decision: 'ALLOW',
      policyRule: 'Safe Deception Automation: Deceptive decoy activation auto-approved',
      reason: 'Zero risk to corporate assets; intercepts adversary traffic safely.',
      approvedBy: 'AUTONOMOUS_POLICY_ENGINE',
    },
  });

  // Ingest Initial Kaggle Telemetry Events
  const events = [
    {
      source: 'NETWORK_IDS',
      sourceAddress: '198.51.100.42',
      eventType: 'RECONNAISSANCE',
      severity: 'LOW',
      description: 'TCP SYN sweeps detected across peripheral ports (8080, 8443). [Kaggle Telemetry]',
      metadata: { port: 8080, protocol: 'TCP' },
    },
    {
      source: 'HOST_AGENT',
      sourceAddress: '198.51.100.42',
      eventType: 'SERVICE_ENUMERATION',
      severity: 'MEDIUM',
      description: 'Targeted banner grabs on SSH (22) and SMB (445) services. [Kaggle Telemetry]',
      metadata: { ports: [22, 445], protocol: 'TCP' },
    },
    {
      source: 'HONEYPOT',
      sourceAddress: '198.51.100.42',
      eventType: 'DECOY_INTERACTION',
      severity: 'MEDIUM',
      description: 'Adversary connected to SSH decoy SSH-DECOY-01. Probe sequence captured.',
      metadata: { decoy: 'SSH-DECOY-01', port: 22 },
    },
    {
      source: 'HONEYPOT',
      sourceAddress: '198.51.100.42',
      eventType: 'CREDENTIAL_DISCOVERY',
      severity: 'HIGH',
      description: 'Adversary enumerated decoy files and discovered admin_backup_password.txt lure.',
      metadata: { file: 'admin_backup_password.txt' },
    },
    {
      source: 'HONEYPOT_MONITOR',
      sourceAddress: '198.51.100.42',
      eventType: 'HONEYTOKEN_ACCESS',
      severity: 'CRITICAL',
      description: 'Honeytoken lure admin_backup_password.txt was accessed. Synthetic credentials extracted.',
      metadata: { token: 'HT-AUTH-9912-SECRET' },
    },
  ];

  for (const evt of events) {
    const metaStr = JSON.stringify(evt.metadata);
    await prisma.securityEvent.create({
      data: {
        sessionId: session.id,
        source: evt.source,
        sourceAddress: evt.sourceAddress,
        assetId: authSrv.id,
        eventType: evt.eventType,
        severity: evt.severity,
        description: evt.description,
        siteId: siteMumbai.id,
        metadata: metaStr,
        sha256Hash: calculateSha256(evt),
      },
    });
  }

  // Create Initial Incident
  const incident = await prisma.incident.create({
    data: {
      incidentCode: 'INC-2026-8812',
      title: 'Targeted Credential Harvesting Attack on Mumbai DC (SH-104)',
      severity: 'CRITICAL',
      risk: 86,
      attackType: 'Credential Discovery / Honeytoken Trap',
      predictedAttack: 'Credential Access Attempt targeting AUTH-SRV-01',
      siteId: siteMumbai.id,
      sessionId: session.id,
      targetAssetId: authSrv.id,
      status: 'INVESTIGATING',
      evidenceCount: 3,
    },
  });

  // Assign Team Bravo
  const teamBravo = await prisma.responseTeam.findFirst({ where: { code: 'RES-MUM-01' } });
  if (teamBravo) {
    await prisma.incident.update({
      where: { id: incident.id },
      data: { responseTeamId: teamBravo.id },
    });

    await prisma.responseAssignment.create({
      data: {
        incidentId: incident.id,
        teamId: teamBravo.id,
        priority: 'P1_CRITICAL',
        etaMinutes: 12,
        recommendedResponse: 'Physical site perimeter lockdown at Mumbai BKC. Capture volatile memory dump from auth controller decoy AUTH-DECOY-07.',
        status: 'DISPATCHED',
      },
    });
  }

  // Initial Evidence Artifacts
  await prisma.evidence.createMany({
    data: [
      {
        incidentId: incident.id,
        sessionId: session.id,
        evidenceType: 'HONEYTOKEN_TRIGGER',
        title: 'Honeytoken Lure Triggered: admin_backup_password.txt',
        description: 'Synthetic token HT-AUTH-9912-SECRET accessed by 198.51.100.42. Timestamped event verified.',
        rawPayload: JSON.stringify({ token: 'HT-AUTH-9912-SECRET', user: 'arun.kumar', ip: '198.51.100.42' }),
        sha256Hash: 'a8b9c0d1e2f3456789abcdef0123456789abcdef0123456789abcdef01234567',
        evidenceStrength: 95,
        predictionConf: 90,
        evidenceCompleteness: 98,
      },
      {
        incidentId: incident.id,
        sessionId: session.id,
        evidenceType: 'PREDICTION_SNAPSHOT',
        title: 'Attack Intent Prediction Validated',
        description: 'SmartHive AI forecasted Credential Access Attempt with 84% confidence targeting AUTH-SRV-01.',
        rawPayload: JSON.stringify({ predictedStage: 'CREDENTIAL_ACCESS_ATTEMPT', target: 'AUTH-SRV-01', conf: 84 }),
        sha256Hash: 'b9c0d1e2f3456789abcdef0123456789abcdef0123456789abcdef012345678a',
        evidenceStrength: 92,
        predictionConf: 84,
        evidenceCompleteness: 94,
      },
    ],
  });

  // Initial Prediction Evaluation with 5m 27s lead time
  const pred = await prisma.attackPrediction.findFirst({ where: { sessionId: session.id } });
  await prisma.predictionEvaluation.create({
    data: {
      sessionId: session.id,
      predictionId: pred?.id,
      predictedAction: 'Credential Access Attempt',
      actualAction: 'Credential Access Attempt (Kerberos Ticket Request)',
      confidence: 84,
      predictedAt: new Date(Date.now() - 327 * 1000),
      occurredAt: new Date(),
      leadTimeSeconds: 327, // 5m 27s
      isCorrect: true,
    },
  });

  // System Settings
  await prisma.systemSetting.createMany({
    data: [
      {
        key: 'AUTONOMY_LEVEL',
        value: 'LEVEL_2',
        description: 'Level 2: Safe Deception Automation (Auto-allows non-disruptive decoys and honeytokens)',
      },
      {
        key: 'RISK_THRESHOLD',
        value: '75',
        description: 'Risk score threshold for critical alert triggering',
      },
    ],
  });

  // Governor Decisions
  console.log('[SEED] Seeding Governor Decisions...');
  await prisma.governorDecision.createMany({
    data: [
      {
        sessionId: session.id,
        actionType: 'ACTIVATE_AUTH_DECOY_07',
        autonomyLevel: 'LEVEL_2',
        decision: 'ALLOW',
        policyRule: 'Safe Deception Policy: Decoy activation is harmless to production and auto-approved.',
        reason: 'Zero risk to corporate assets; intercepts adversary traffic safely.',
        approvedBy: 'AUTONOMOUS_POLICY_ENGINE',
      },
      {
        sessionId: session.id,
        actionType: 'DEPLOY_HONEYTOKEN_ADMIN_PASSWORD',
        autonomyLevel: 'LEVEL_2',
        decision: 'ALLOW',
        policyRule: 'Honeytoken Policy: Deployment of synthetic passive lures is auto-approved.',
        reason: 'Synthetic files have no executable payload; enables early warning.',
        approvedBy: 'AUTONOMOUS_POLICY_ENGINE',
      },
      {
        sessionId: session.id,
        actionType: 'REDIRECT_SHADOW_NETWORK',
        autonomyLevel: 'LEVEL_2',
        decision: 'ALLOW',
        policyRule: 'Shadow Network Policy: Diverting simulated session to decoy network is auto-approved.',
        reason: 'Preserves production server integrity while collecting telemetry.',
        approvedBy: 'AUTONOMOUS_POLICY_ENGINE',
      },
      {
        sessionId: session.id,
        actionType: 'DISPATCH_PATROL_TEAM_1',
        autonomyLevel: 'LEVEL_2',
        decision: 'ALLOW',
        policyRule: 'Authorized Patrol Response: Physical on-site verification allowed.',
        reason: 'Critical threat score (91/100) triggered autonomous dispatch of Patrol Team 1.',
        approvedBy: 'AUTONOMOUS_POLICY_ENGINE',
      },
      {
        sessionId: session.id,
        actionType: 'PRODUCTION_ENDPOINT_ISOLATION',
        autonomyLevel: 'LEVEL_2',
        decision: 'HUMAN_APPROVAL',
        policyRule: 'Production Boundary Policy: Disconnecting real production host requires human authority.',
        reason: 'Could impact live corporate operations; awaiting SOC Incident Lead confirmation.',
        approvedBy: 'PENDING_SOC_ANALYST',
      },
      {
        sessionId: session.id,
        actionType: 'BLOCK_CORE_FIREWALL_SUBNET',
        autonomyLevel: 'LEVEL_2',
        decision: 'HUMAN_APPROVAL',
        policyRule: 'Network Infrastructure Policy: Permanent corporate firewall changes require Change Control.',
        reason: 'Risk of enterprise connectivity interruption; awaiting SOC Lead signoff.',
        approvedBy: 'PENDING_SOC_ANALYST',
      },
      {
        sessionId: session.id,
        actionType: 'DESTRUCTIVE_COUNTER_EXPLOIT',
        autonomyLevel: 'LEVEL_2',
        decision: 'BLOCK',
        policyRule: 'Absolute Defensive Invariant: Destructive or unauthorized actions are strictly prohibited.',
        reason: 'Violates defensive cybersecurity boundary rules.',
        approvedBy: 'SYSTEM_HARD_GOVERNOR',
      },
    ],
  });

  // Audit Logs
  console.log('[SEED] Seeding Security Audit Logs...');
  await prisma.auditLog.createMany({
    data: [
      {
        actor: 'Autonomous Safety Governor',
        action: 'POLICY_EVALUATION',
        target: 'AUTH-DECOY-07',
        details: 'Evaluated action ACTIVATE_AUTH_DECOY_07 against policy POL-DEC-01. Result: ALLOW.',
        ipAddress: '10.0.4.15',
      },
      {
        actor: 'SmartHive AI Engine',
        action: 'DECOY_ENGAGED',
        target: 'SSH-DECOY-01',
        details: 'Adversary 198.51.100.42 attempted brute-force on fake SSH daemon. Evidence captured.',
        ipAddress: '198.51.100.42',
      },
      {
        actor: 'Adaptive Deception Fabric',
        action: 'HONEYTOKEN_ACCESSED',
        target: 'admin_backup_password.txt',
        details: 'Unauthorized SMB read on canary document. Severity escalated to CRITICAL.',
        ipAddress: '198.51.100.42',
      },
      {
        actor: 'Autonomy Governor',
        action: 'SESSION_DIVERTED',
        target: 'Session SH-104',
        details: 'TCP connection intercepted at gateway and diverted to shadow honeynet container.',
        ipAddress: '10.0.1.1',
      },
      {
        actor: 'Forensic Evidence Engine',
        action: 'EVIDENCE_SEALED',
        target: 'sys_exfiltration.txt',
        details: 'Cryptographic SHA-256 seal generated: a8b9c0d1e2f3456789abcdef0123456789abcdef...',
        ipAddress: '127.0.0.1',
      },
      {
        actor: 'SOC Incident Lead',
        action: 'PATROL_DISPATCHED',
        target: 'Patrol Team 1 (Alpha Unit)',
        details: 'Mobilized unit to Mumbai BKC Datacenter for server room physical perimeter security.',
        ipAddress: '10.0.0.2',
      },
      {
        actor: 'Safety Governor Queue',
        action: 'APPROVAL_REQUIRED',
        target: 'AUTH-SRV-01',
        details: 'Proposed production host isolation flagged for manual confirmation.',
        ipAddress: '127.0.0.1',
      },
    ],
  });

  console.log('[SEED] Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('[SEED ERROR]', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
