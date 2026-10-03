import httpx
import json

base_url = "http://backend:8000/api"
transcript = ["# Step 2 API Transcript\n"]

def log_request(method, url, data=None, headers=None):
    transcript.append(f"### {method} {url}")
    if data:
        transcript.append(f"**Payload**:\n```json\n{json.dumps(data, indent=2)}\n```\n")
    if headers:
        transcript.append(f"**Headers**:\n```json\n{json.dumps(headers, indent=2)}\n```\n")

    response = httpx.request(method, base_url + url, json=data, headers=headers)
    transcript.append(f"**Response** (Status {response.status_code}):\n```json\n{json.dumps(response.json(), indent=2)}\n```\n")
    return response

# 1. Login as Admin
login_data = {"username": "admin@groundwork.earth", "password": "Admin@123"}
r = httpx.post(base_url + "/auth/login", data=login_data)
transcript.append(f"### POST /auth/login (Admin)\n**Response** (Status {r.status_code}):\n```json\n{json.dumps(r.json(), indent=2)}\n```\n")
admin_token = r.json().get("access_token")

# 2. Login as Buyer
buyer_data = {"username": "buyer@megacorp.com", "password": "Buyer@123"}
r = httpx.post(base_url + "/auth/login", data=buyer_data)
transcript.append(f"### POST /auth/login (Buyer)\n**Response** (Status {r.status_code}):\n```json\n{json.dumps(r.json(), indent=2)}\n```\n")
buyer_token = r.json().get("access_token")

# 3. Get all transactions (as Admin)
log_request("GET", "/transactions", headers={"Authorization": f"Bearer {admin_token}"})

# 4. Get credits
log_request("GET", "/marketplace/listings")

with open("/project/audit/step2_api_transcript.md", "w") as f:
    f.write("\n".join(transcript))
