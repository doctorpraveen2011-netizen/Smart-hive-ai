# Kaggle Cyber Threat Dataset Integration Reference

## Dataset Sources:
1. **AWS Honeypot Attack Data**
   - URL: https://www.kaggle.com/datasets/maricinnamon/honeypot-network-attack-dataset
   - Description: Network telemetry gathered from worldwide honeypots documenting external IP scanning, protocol distribution, and attack timelines.
2. **CUIP-X25: Cyber Attacks Dataset (Dionaea Honeypot)**
   - URL: https://www.kaggle.com/datasets/cuipx25/cyber-attacks-dataset
   - Description: Real cyber attacks collected through a Dionaea honeypot deployed on public networks, featuring port probe sequences, protocol anomalies, and credential harvesting attempts.
3. **BETH Dataset (BPF Tracking Honeypot)**
   - URL: https://www.kaggle.com/datasets/katehighnam/beth-dataset
   - Description: Labeled cybersecurity host and network anomalies for intrusion classification.

## Attributes Ingested by SmartHive AI:
- `timestamp`: Connection and probe epoch.
- `source_ip`: Attacker IP address.
- `target_port`: Scanned service port (22=SSH, 80=HTTP, 88=Kerberos, 443=HTTPS, 445=SMB, 1433=MSSQL, 3389=RDP).
- `protocol`: Transport protocol (TCP, UDP).
- `attack_type`: Threat phase (RECON, SERVICE_ENUMERATION, DECOY_INTERACTION, HONEYTOKEN_ACCESS, AUTH_ATTEMPT, LATERAL_MOVEMENT).
- `stage`: MITRE ATT&CK progression stage.
- `packet_count` & `byte_count`: Traffic volume indicators.
- `failed_auth_count`: Authentication brute-force indicator.
- `curiosity_focus`: Category of adversary interest (CREDENTIALS, DATABASE, CLOUD_SECRETS, etc.).
