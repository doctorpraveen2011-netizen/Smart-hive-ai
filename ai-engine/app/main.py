from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from app.models.engine import ai_engine_instance

app = FastAPI(
    title="SmartHive AI Intelligence Engine",
    description="Python FastAPI service powering anomaly scoring, stage classification, and Threat Futures modeling",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnomalyRequest(BaseModel):
    target_port: int = 80
    packet_count: int = 10
    byte_count: int = 1000
    duration_sec: int = 5
    failed_auth_count: int = 0

class PredictionRequest(BaseModel):
    current_stage: str = "NORMAL"
    curiosity: Dict[str, int] = {}
    event_count: int = 1

class ThreatFuturesRequest(BaseModel):
    current_stage: str = "CREDENTIAL_DISCOVERY"
    curiosity: Dict[str, int] = {}

class LeadTimeRequest(BaseModel):
    predicted_action: str
    actual_action: str
    predicted_at_iso: str
    occurred_at_iso: str

@app.get("/health")
def health_check():
    return {
        "status": "ONLINE",
        "service": "SmartHive AI Engine",
        "dataset_trained": ai_engine_instance.is_trained,
        "model_type": "IsolationForest + RandomForest (Kaggle Honeypot Telemetry)"
    }

@app.post("/score-anomaly")
def score_anomaly(req: AnomalyRequest):
    score = ai_engine_instance.score_anomaly(req.dict())
    return {
        "anomaly_score": score,
        "is_anomalous": score >= 0.55,
        "confidence": round(min(1.0, 0.7 + score * 0.3), 2)
    }

@app.post("/predict-next-stage")
def predict_next_stage(req: PredictionRequest):
    pred = ai_engine_instance.predict_next_stage(
        req.current_stage,
        req.curiosity,
        req.event_count
    )
    return pred

@app.post("/evaluate-futures")
def evaluate_futures(req: ThreatFuturesRequest):
    branches = ai_engine_instance.generate_threat_futures(
        req.current_stage,
        req.curiosity
    )
    return {"branches": branches}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
