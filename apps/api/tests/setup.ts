// Устанавливается ДО загрузки любого теста и импорта модулей
process.env.X402_SELLER_ADDRESS =
  process.env.X402_SELLER_ADDRESS ??
  "0x34798CCeF50aaa45194E5E20008711A5Fbfd182C";
process.env.X402_NETWORK = process.env.X402_NETWORK ?? "base-sepolia";