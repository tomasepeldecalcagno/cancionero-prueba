import zipfile
import os

zip_path = "/vercel/share/v0-project/cancionero.zip"
extract_to = "/vercel/share/v0-project/extracted"

with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    zip_ref.extractall(extract_to)
    print("Archivos extraídos:")
    for name in zip_ref.namelist():
        print(f"  - {name}")
