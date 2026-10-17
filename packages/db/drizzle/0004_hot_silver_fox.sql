CREATE TABLE "x402_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"tx_hash" varchar(66) NOT NULL,
	"from_address" varchar(42) NOT NULL,
	"to_address" varchar(42) NOT NULL,
	"amount" numeric(20, 6) NOT NULL,
	"network" varchar(50) DEFAULT 'base-sepolia' NOT NULL,
	"resource" varchar(500) NOT NULL,
	"description" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "x402_payments_tx_hash_unique" UNIQUE("tx_hash")
);
--> statement-breakpoint
ALTER TABLE "x402_payments" ADD CONSTRAINT "x402_payments_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "x402_payments_org_idx" ON "x402_payments" USING btree ("org_id");