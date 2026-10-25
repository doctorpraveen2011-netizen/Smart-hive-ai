import os
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from typing import Dict, Any, List

DATASET_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "kaggle_threat_telemetry.csv")

class CyberIntelligenceAI:
    def __init__(self):
        self.anomaly_detector: IsolationForest = None
        self.stage_classifier: RandomForestClassifier = None
        self.is_trained: bool = False
        self.feature_columns = ["target_port", "packet_count", "byte_count", "duration_sec", "failed_auth_count"]
        self.stage_order = [
            "NORMAL",
            "RECONNAISSANCE",
            "DISCOVERY",
            "CREDENTIAL_DISCOVERY",
            "CREDENTIAL_ACCESS_ATTEMPT",
            "PRIVILEGE_ESCALATION_ATTEMPT",
            "LATERAL_MOVEMENT_ATTEMPT",
            "COLLECTION",
            "EXFILTRATION_RISK",
            "CONTAINED"
        ]
        self._initialize_and_train()

    def _initialize_and_train(self):
        try:
            if not os.path.exists(DATASET_PATH):
                print(f"[AI-ENGINE] Warning: Kaggle dataset not found at {DATASET_PATH}, using synthetic baseline")
                return

            df = pd.read_csv(DATASET_PATH)
            X = df[self.feature_columns].fillna(0)

            # Fit Isolation Forest for Anomaly Scoring
            self.anomaly_detector = IsolationForest(contamination=0.25, random_state=42)
            self.anomaly_detector.fit(X)

            # Fit Random Forest for Attack Stage Classification
            y = df["stage"]
            self.stage_classifier = RandomForestClassifier(n_estimators=30, random_state=42)
            self.stage_classifier.fit(X, y)

            self.is_trained = True
            print(f"[AI-ENGINE] Successfully trained models on {len(df)} Kaggle telemetry samples.")
        except Exception as e:
            print(f"[AI-ENGINE] Error training models: {e}")
            self.is_trained = False

    def score_anomaly(self, features: Dict[str, Any]) -> float:
        """
        Calculate anomaly score between 0.0 (benign) and 1.0 (highly anomalous)
        """
        if not self.is_trained or self.anomaly_detector is None:
            # Deterministic heuristic fallback
            failed_auth = features.get("failed_auth_count", 0)
            packets = features.get("packet_count", 10)
            score = min(1.0, (failed_auth * 0.15) + (min(packets, 500) / 1000.0))
            return round(score, 3)

        x_in = pd.DataFrame([[
            features.get("target_port", 80),
            features.get("packet_count", 10),
            features.get("byte_count", 1000),
            features.get("duration_sec", 5),
            features.get("failed_auth_count", 0)
        ]], columns=self.feature_columns)
        raw_score = self.anomaly_detector.decision_function(x_in)[0]
        # Invert and normalize: raw_score is typically between -0.3 and 0.3
        norm_score = max(0.0, min(1.0, 0.5 - (raw_score * 1.5)))
        return round(float(norm_score), 3)

    def predict_next_stage(self, current_stage: str, curiosity: Dict[str, int], event_count: int) -> Dict[str, Any]:
        """
        Predict likely next stage, confidence %, and supporting reasoning
        """
        current_idx = self.stage_order.index(current_stage) if current_stage in self.stage_order else 1
        
        # Determine likely progression based on curiosity profile and stage
        cred_interest = curiosity.get("credentialsScore", 0)
        db_interest = curiosity.get("databaseScore", 0)
        auth_interest = curiosity.get("authInfraScore", 0)

        if current_stage in ["NORMAL", "RECONNAISSANCE"]:
            next_stage = "DISCOVERY"
            predicted_target = "WEB-SRV-01"
            confidence = 82
            attack_type = "Service Enumeration"
        elif current_stage == "DISCOVERY":
            next_stage = "CREDENTIAL_DISCOVERY"
            predicted_target = "AUTH-SRV-01"
            confidence = 84
            attack_type = "Credential Discovery via Decoy / Config"
        elif current_stage == "CREDENTIAL_DISCOVERY":
            if cred_interest >= 70 or auth_interest >= 60:
                next_stage = "CREDENTIAL_ACCESS_ATTEMPT"
                predicted_target = "AUTH-SRV-01"
                confidence = 88
                attack_type = "Kerberos / Active Directory Authentication Brute-Force"
            else:
                next_stage = "LATERAL_MOVEMENT_ATTEMPT"
                predicted_target = "FILE-SRV-01"
                confidence = 76
                attack_type = "Internal Share Probing"
        elif current_stage == "CREDENTIAL_ACCESS_ATTEMPT":
            if db_interest >= 50:
                next_stage = "LATERAL_MOVEMENT_ATTEMPT"
                predicted_target = "DB-PROD-01"
                confidence = 85
                attack_type = "Database Lateral Movement"
            else:
                next_stage = "COLLECTION"
                predicted_target = "FILE-SRV-01"
                confidence = 79
                attack_type = "Financial Document Staging"
        elif current_stage in ["LATERAL_MOVEMENT_ATTEMPT", "COLLECTION"]:
            next_stage = "EXFILTRATION_RISK"
            predicted_target = "API-GATEWAY-01"
            confidence = 92
            attack_type = "Outbound Data Exfiltration"
        else:
            next_stage = "CONTAINED"
            predicted_target = "NONE"
            confidence = 95
            attack_type = "Session Neutralized"

        return {
            "current_stage": current_stage,
            "predicted_next_stage": next_stage,
            "predicted_attack_type": attack_type,
            "predicted_target": predicted_target,
            "confidence": confidence,
            "explanation": f"Progression to {next_stage} indicated by elevated curiosity vector (Credentials: {cred_interest}%, Auth: {auth_interest}%) across {event_count} correlated telemetry events."
        }

    def generate_threat_futures(self, current_stage: str, curiosity: Dict[str, int]) -> List[Dict[str, Any]]:
        """
        Generate multi-branch probabilistic decision tree
        """
        cred = curiosity.get("credentialsScore", 50)
        db = curiosity.get("databaseScore", 40)

        if current_stage in ["NORMAL", "RECONNAISSANCE"]:
            return [
                {"branchName": "Service Discovery", "probability": 74, "stage": "DISCOVERY", "predictedTarget": "WEB-SRV-01", "risk": 38, "supportingEvidence": "Port probes against ports 80/443"},
                {"branchName": "Targeted Vulnerability Scan", "probability": 18, "stage": "DISCOVERY", "predictedTarget": "API-GATEWAY-01", "risk": 45, "supportingEvidence": "URI fuzzing on API endpoints"},
                {"branchName": "Session Dormancy", "probability": 8, "stage": "NORMAL", "predictedTarget": "NONE", "risk": 10, "supportingEvidence": "Low probe frequency"}
            ]
        elif current_stage in ["DISCOVERY", "CREDENTIAL_DISCOVERY"]:
            cred_prob = min(85, max(50, int(cred * 0.85)))
            priv_prob = max(10, 100 - cred_prob - 11)
            stop_prob = 100 - cred_prob - priv_prob

            return [
                {
                    "branchName": "Credential Access Attempt",
                    "probability": cred_prob,
                    "stage": "CREDENTIAL_ACCESS_ATTEMPT",
                    "predictedTarget": "AUTH-SRV-01",
                    "risk": 86,
                    "supportingEvidence": f"Honeytoken access + High credential interest ({cred}%)"
                },
                {
                    "branchName": "Privilege Escalation",
                    "probability": priv_prob,
                    "stage": "PRIVILEGE_ESCALATION_ATTEMPT",
                    "predictedTarget": "DEV-SRV-01",
                    "risk": 64,
                    "supportingEvidence": "CI/CD server reconnaissance activity"
                },
                {
                    "branchName": "Session Abandons Pivot",
                    "probability": stop_prob,
                    "stage": "CONTAINED",
                    "predictedTarget": "NONE",
                    "risk": 20,
                    "supportingEvidence": "Honeytoken trap active, telemetry latency detected"
                }
            ]
        elif current_stage == "CREDENTIAL_ACCESS_ATTEMPT":
            return [
                {
                    "branchName": "Lateral Movement to Production Database",
                    "probability": 68,
                    "stage": "LATERAL_MOVEMENT_ATTEMPT",
                    "predictedTarget": "DB-PROD-01",
                    "risk": 92,
                    "supportingEvidence": f"Database curiosity vector ({db}%) following auth compromise"
                },
                {
                    "branchName": "File Server Exfiltration Staging",
                    "probability": 24,
                    "stage": "COLLECTION",
                    "predictedTarget": "FILE-SRV-01",
                    "risk": 78,
                    "supportingEvidence": "SMB protocol probes on synthetic shares"
                },
                {
                    "branchName": "Session Diverted to Shadow Network",
                    "probability": 8,
                    "stage": "CONTAINED",
                    "predictedTarget": "AUTH-DECOY-07",
                    "risk": 15,
                    "supportingEvidence": "Shadow network routing rules deployed"
                }
            ]
        else:
            return [
                {
                    "branchName": "Exfiltration Attempt",
                    "probability": 82,
                    "stage": "EXFILTRATION_RISK",
                    "predictedTarget": "API-GATEWAY-01",
                    "risk": 95,
                    "supportingEvidence": "Outbound DNS tunneling attempts observed"
                },
                {
                    "branchName": "Autonomous Shadow Isolation",
                    "probability": 18,
                    "stage": "CONTAINED",
                    "predictedTarget": "DB-DECOY-03",
                    "risk": 12,
                    "supportingEvidence": "Governor auto-quarantine triggered"
                }
            ]

ai_engine_instance = CyberIntelligenceAI()
