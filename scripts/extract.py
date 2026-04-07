import zipfile
import os
import urllib.request
import io
import json

zip_url = "https://v0chat-agent-data-prod.s3.us-east-1.amazonaws.com/vm-binary/GblqgAqi9zb/16ca6135c34a37bbda29d60b6cba57e8e918548b7e8f8d4ebb086aebcd26cd98.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA52KF4VHQDTZ5RDMT%2F20260407%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260407T175614Z&X-Amz-Expires=3600&X-Amz-Signature=7d8e352e933208fa83f7a79ba9058934c280fb3969f346a308f5892e12c936e4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"

print("Descargando archivo ZIP...")
with urllib.request.urlopen(zip_url) as response:
    zip_data = response.read()

files_content = {}

with zipfile.ZipFile(io.BytesIO(zip_data), 'r') as zip_ref:
    print("Archivos en el ZIP:")
    for name in zip_ref.namelist():
        print(f"  - {name}")
    print("\n")
    
    # Extract all text files
    for name in zip_ref.namelist():
        if name.endswith('/'):
            continue
        # Skip binary files and node_modules
        if 'node_modules' in name or name.endswith(('.png', '.ico', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.eot')):
            continue
        try:
            content = zip_ref.read(name).decode('utf-8')
            files_content[name] = content
        except:
            pass

# Output as JSON for easy parsing
print("===FILES_JSON_START===")
print(json.dumps(files_content, indent=2))
print("===FILES_JSON_END===")
