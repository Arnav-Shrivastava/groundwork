import httpx
import json

base_url = "http://backend:8000/api"

print("--- Step 9 Validation ---")
print("1. Seed Data should already be in DB from previous steps (using existing seed script)")

buyer_data = {"username": "buyer@megacorp.com", "password": "Buyer@123"}
r = httpx.post(base_url + "/auth/login", data=buyer_data)
if r.status_code == 200:
    buyer_token = r.json().get("access_token")
    print("2. Logged in successfully as buyer@megacorp.com")
else:
    print("Failed to log in", r.json())
    exit(1)

r = httpx.get(base_url + "/marketplace")
listings = r.json()
print(f"3. Fetched listings: {len(listings)} found.")

if len(listings) > 0:
    batch_id = listings[0]["id"]
    print(f"4. Attempting to purchase 100 tonnes from batch {batch_id}")
    
    checkout_r = httpx.post(
        base_url + "/transactions/checkout", 
        json={"batch_id": batch_id, "tonnes_requested": 100},
        headers={"Authorization": f"Bearer {buyer_token}"}
    )
    
    if checkout_r.status_code == 200:
        print("5. Checkout successful!")
        print("Checkout Response:", json.dumps(checkout_r.json(), indent=2))
    else:
        print("Checkout failed:", checkout_r.status_code, checkout_r.json())
else:
    print("No listings found to purchase.")
