import "dotenv/config";
import { createPublicClient, http, formatEther, formatUnits } from "viem";
import { baseSepolia } from "viem/chains";

const USDC = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
const erc20Abi = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const client = createPublicClient({ chain: baseSepolia, transport: http() });

const wallets = [
  ["SELLER", process.env.X402_SELLER_ADDRESS],
  ["BUYER ", process.env.X402_BUYER_ADDRESS],
];

for (const [name, addr] of wallets) {
  if (!addr) {
    console.log(`${name}: адрес не задан в .env`);
    continue;
  }
  const eth = await client.getBalance({ address: addr });
  const usdc = await client.readContract({
    address: USDC,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [addr],
  });
  console.log(`${name} ${addr}`);
  console.log(`   ETH : ${formatEther(eth)}`);
  console.log(`   USDC: ${formatUnits(usdc, 6)}`);
}