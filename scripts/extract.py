import zipfile
import os
import urllib.request
import io
import json

zip_url = "https://v0chat-agent-data-prod.s3.us-east-1.amazonaws.com/vm-binary/GblqgAqi9zb/16ca6135c34a37bbda29d60b6cba57e8e918548b7e8f8d4ebb086aebcd26cd98.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA52KF4VHQDTZ5RDMT%2F20260407%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260407T175614Z&X-Amz-Expires=3600&X-Amz-Signature=7d8e352e933208fa83f7a79ba9058934c280fb3969f346a308f5892e12c936e4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"

print("Descargando archivo ZIP...")
with urllib.request.urlopen(zip_url) as response:
    zip_data = response.read()

# Extract all files to output
base_path = "/vercel/share/v0-project/extracted_content"

with zipfile.ZipFile(io.BytesIO(zip_data), 'r') as zip_ref:
    # List all files first
    print("Files in ZIP:")
    for name in zip_ref.namelist():
        print(f"  - {name}")
    
    # Extract all files
    zip_ref.extractall(base_path)
    print(f"\nExtracted to: {base_path}")
    
    # Print contents of key text files for context
    text_extensions = ('.tsx', '.ts', '.json', '.css', '.mjs', '.sql')
    for name in zip_ref.namelist():
        if name.endswith(text_extensions) and 'node_modules' not in name:
            try:
                content = zip_ref.read(name).decode('utf-8')
                full_path = os.path.join(base_path, name)
                print(f"\n=== {name} ===")
                print(f"Saved to: {full_path}")
            except:
                pass
