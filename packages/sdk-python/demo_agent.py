import os

from netthouse import X402Client

API = "https://netthouse-api.onrender.com"

client = X402Client(private_key=os.environ["X402_BUYER_PRIVATE_KEY"])
print("Agent address:", client.address)

items = client.discover(API)
print(f"Discovered {len(items)} resources:")
for item in items:
    req = item["accepts"][0]
    price = int(req["maxAmountRequired"]) / 1_000_000
    print(f"  {item['resource']} - {price} USDC on {req['network']}")

print("\nPaying for /market-data ...")
result = client.fetch(API + "/market-data")
print("Status:", result.response.status_code, "| paid:", result.paid)
if result.response.ok:
    body = result.response.json()
    print("txHash:", body.get("txHash"))
    print("data:", body.get("data"))
else:
    print("Error:", result.response.text)