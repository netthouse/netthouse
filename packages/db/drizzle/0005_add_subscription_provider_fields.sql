ALTER TABLE "subscriptions"
  ADD COLUMN IF NOT EXISTS "provider" varchar(50),
  ADD COLUMN IF NOT EXISTS "provider_customer_id" varchar(255),
  ADD COLUMN IF NOT EXISTS "provider_subscription_id" varchar(255),
  ADD COLUMN IF NOT EXISTS "currency" varchar(10),
  ADD COLUMN IF NOT EXISTS "amount" numeric(18, 6);
