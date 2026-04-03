import psutil
import pandas as pd
import time
import random

data = []

for i in range(500):   # more data = better model
    cpu = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory().percent
    disk = psutil.disk_usage('/').percent
    processes = len(psutil.pids())

    # More realistic anomaly (not too obvious)
    if random.random() < 0.08:
        cpu = cpu + random.randint(30, 50)
        memory = memory + random.randint(20, 40)
        processes = processes + random.randint(100, 200)

        cpu = min(cpu, 100)
        memory = min(memory, 100)

        label = -1
    else:
        label = 1

    data.append({
        "cpu": cpu,
        "memory": memory,
        "disk": disk,
        "processes": processes,
        "label": label
    })

df = pd.DataFrame(data)
df.to_csv("data/system_metrics.csv", index=False)

print("Data collected ✅")