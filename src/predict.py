import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Load model
model = joblib.load("models/isolation_forest.pkl")

# Load both datasets
raw_df = pd.read_csv("data/system_metrics.csv")          # original data (for reasoning)
processed_df = pd.read_csv("data/processed_data.csv")    # normalized data (for model)

# Features & labels
X = processed_df.drop("label", axis=1)
y = processed_df["label"]

# Train-test split (keeping raw + processed aligned)
X_train, X_test, y_train, y_test, raw_train, raw_test = train_test_split(
    X, y, raw_df, test_size=0.3, random_state=42
)

# Predict using model
y_pred = model.predict(X_test)

# Convert predictions
y_pred_labels = pd.Series(y_pred).map({1: "Normal", -1: "Anomaly"})
y_test_labels = y_test.map({1: "Normal", -1: "Anomaly"})

# Evaluation
print("\nFinal Evaluation Report:\n")
print(classification_report(y_test_labels, y_pred_labels))

# Create output using RAW data
output = raw_test.copy()
output["actual"] = y_test_labels.values
output["prediction"] = y_pred_labels.values

# -------------------------------
# Reason Logic (using RAW values)
# -------------------------------
def get_reason(row):
    reasons = []

    if row["cpu"] > 85:
        reasons.append("High CPU usage")

    if row["memory"] > 80:
        reasons.append("High memory usage")

    if row["processes"] > 300:
        reasons.append("Too many processes")

    if not reasons:
        return "Unknown anomaly"

    return ", ".join(reasons)

# Apply reason only for anomalies
output["reason"] = output.apply(
    lambda row: get_reason(row) if row["prediction"] == "Anomaly" else "Normal",
    axis=1
)
print("\nSample Predictions with Reasons:\n")
print(output[["cpu", "memory", "processes", "prediction", "reason"]].head())

# Save output
output.to_csv("data/output_predictions.csv", index=False)

print("\nPredictions with reasons saved ✅")