import pandas as pd
data = pd.read_csv("C:/Users/Lenovo/Downloads/CSV FILE/students_data.csv")
print("First 5 rows of the data:")
print(data.head())

print("\nMissing values in each column")
print(data.isnull().sum())

print("\nSummary statistics for numerical columns:")
print(data.describe())
