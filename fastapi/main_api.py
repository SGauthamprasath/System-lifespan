from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np

app = FastAPI()

model = joblib.load("models/isolation_forest.pkl")
scaler = joblib.load("models/scaler.pkl")

class SystemMetrics(BaseModel):
    cpu: float
    memory: float
    disk: float
    processes: int

def get_reason(data):
    reasons = []
    if data.cpu > 85:
        reasons.append("High CPU usage")
    if data.memory > 80:
        reasons.append("High memory usage")
    if data.disk > 90:
        reasons.append("Low disk space")
    if data.processes > 300:
        reasons.append("Too many processes")
    if not reasons:
        return "Normal behavior"
    return ", ".join(reasons)

def calculate_health_score(data: SystemMetrics, anomaly_score: float) -> int:
    # Start with 100
    score = 100

    # Penalize based on CPU
    if data.cpu > 90:
        score -= 30
    elif data.cpu > 75:
        score -= 20
    elif data.cpu > 50:
        score -= 10

    # Penalize based on Memory
    if data.memory > 90:
        score -= 25
    elif data.memory > 75:
        score -= 15
    elif data.memory > 60:
        score -= 8

    # Penalize based on Disk
    if data.disk > 95:
        score -= 20
    elif data.disk > 85:
        score -= 10
    elif data.disk > 70:
        score -= 5

    # Penalize based on Processes
    if data.processes > 400:
        score -= 15
    elif data.processes > 300:
        score -= 8
    elif data.processes > 200:
        score -= 3

    # Penalize based on ML anomaly score
    # anomaly_score is negative when anomalous
    # ranges roughly from -0.5 (very bad) to 0.5 (very normal)
    if anomaly_score < -0.3:
        score -= 20
    elif anomaly_score < -0.1:
        score -= 10
    elif anomaly_score < 0:
        score -= 5

    # Clamp between 0 and 100
    return max(0, min(100, score))

def get_health_label(score: int) -> str:
    if score >= 80:
        return "Healthy"
    elif score >= 60:
        return "Fair"
    elif score >= 40:
        return "Poor"
    else:
        return "Critical"

@app.get("/")
def home():
    return {"message": "API running 🚀"}

@app.post("/predict")
def predict(data: SystemMetrics):
    input_df = pd.DataFrame([[
        data.cpu,
        data.memory,
        data.disk,
        data.processes
    ]], columns=["cpu", "memory", "disk", "processes"])

    input_scaled = scaler.transform(input_df)

    pred = model.predict(input_scaled)[0]
    anomaly_score = float(model.decision_function(input_scaled)[0])

    result = "Anomaly" if pred == -1 else "Normal"
    reason = get_reason(data) if result == "Anomaly" else "Normal behavior"
    health_score = calculate_health_score(data, anomaly_score)
    health_label = get_health_label(health_score)

    return {
        "prediction":    result,
        "reason":        reason,
        "health_score":  health_score,
        "health_label":  health_label,
        "anomaly_score": anomaly_score
    }