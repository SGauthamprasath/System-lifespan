import os

os.system("python src/collect_data.py")
os.system("python src/preprocess.py")
os.system("python src/train_model.py")
os.system("python src/predict.py")