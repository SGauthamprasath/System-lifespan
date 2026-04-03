import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

df = pd.read_csv("data/processed_data.csv")

X = df.drop("label", axis=1)

model = IsolationForest(
    n_estimators=200,
    contamination=0.08,
    random_state=42
)

model.fit(X)

joblib.dump(model, "models/isolation_forest.pkl")

print("Model trained ✅")