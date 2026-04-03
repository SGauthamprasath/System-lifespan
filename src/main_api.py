from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

# Load model + scaler
model = joblib.load("models/isolation_forest.pkl")
scaler = joblib.load("models/scaler.pkl")

# Input schema
class SystemMetrics(BaseModel):
    cpu: float
    memory: float
    disk: float
    processes: int

# Reason function
def get_reason(data):
    reasons = []

    if data.cpu > 85:
        reasons.append("High CPU usage")

    if data.memory > 80:
        reasons.append("High memory usage")

    if data.processes > 300:
        reasons.append("Too many processes")

    if not reasons:
        return "Normal behavior"

    return ", ".join(reasons)

# Home route
@app.get("/")
def home():
    return {"message": "API running 🚀"}

# Prediction route
@app.post("/predict")
def predict(data: SystemMetrics):

    # Convert input
    input_df = pd.DataFrame([[
        data.cpu,
        data.memory,
        data.disk,
        data.processes
    ]], columns=["cpu", "memory", "disk", "processes"])

    # ✅ Correct scaling
    input_scaled = scaler.transform(input_df)

    # Prediction
    pred = model.predict(input_scaled)[0]
    result = "Anomaly" if pred == -1 else "Normal"

    # Reason
    reason = get_reason(data) if result == "Anomaly" else "Normal"

    return {
        "prediction": result,
        "reason": reason
    }