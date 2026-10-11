import { createApiKey } from "@netthouse/db";

const orgId = process.argv[2];
const name = process.argv[3] ?? "Bootstrap Admin Key";

if (!orgId) {
  console.error("Usage: npx tsx src/scripts/create-first-key.ts <orgId> [name]");
  process.exit(1);
}

const key = await createApiKey({
  orgId,
  name,
  scopes: ["admin", "read", "write", "transact"],
});

console.log("=== API KEY CREATED ===");
console.log("id:", key.id);
console.log("name:", key.name);
console.log("scopes:", key.scopes);
console.log("key:", key.key);
console.log("=== SAVE THIS KEY NOW, IT IS SHOWN ONLY ONCE ===");

process.exit(0);