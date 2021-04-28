import json
from pathlib import Path
import os

def check_file(file_path):
    with open(file_path) as f:
         try:
            data = json.load(f)
            if "tenantId" not in data:
               print("tenantId missing in file - " + file_path)
            if "moduleName" not in data:
               print("moduleName misisng in file - " + file_path)
         except Exception as ex:
            print(ex)
            print("JSON error in file - " + file_path)

for root, dirs, files in os.walk("data"):
    for file in files:
        if file.endswith(".json"):
            file_path = os.path.join(root, file)
            check_file(file_path)



