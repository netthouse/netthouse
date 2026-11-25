ALTER TABLE "subscriptions"
  ADD COLUMN IF NOT EXISTS "provider_payment_id" varchar(255),
  ADD COLUMN IF NOT EXISTS "provider_order_id" varchar(255);

CREATE UNIQUE INDEX IF NOT EXISTS "subscriptions_provider_payment_id_unique"
  ON "subscriptions" ("provider_payment_id")
  WHERE "provider_payment_id" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "subscriptions_provider_order_id_unique"
  ON "subscriptions" ("provider_order_id")
  WHERE "provider_order_id" IS NOT NULL;
