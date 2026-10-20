import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);

console.log("🔑 Новый кошелёк для mainnet:");
console.log("   Address:", account.address);
console.log("   Private Key:", privateKey);
console.log("\n⚠️  Сохраните private key в безопасном месте!");
console.log("   Добавьте его в .env как X402_PRIVATE_KEY (продавец)");
console.log("   Или создайте отдельный для покупателя X402_BUYER_PRIVATE_KEY");