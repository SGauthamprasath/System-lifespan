import pandas as pd
from sklearn.preprocessing import StandardScaler
import joblib

# Load data
df = pd.read_csv("data/system_metrics.csv")

df = df.dropna()

X = df.drop("label", axis=1)
y = df["label"]

# ✅ Use scaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Save scaler
joblib.dump(scaler, "models/scaler.pkl")

# Save processed data
processed_df = pd.DataFrame(X_scaled, columns=X.columns)
processed_df["label"] = y

processed_df.to_csv("data/processed_data.csv", index=False)

print("Preprocessing + scaler saved ✅")