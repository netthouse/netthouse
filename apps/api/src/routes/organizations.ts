import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "@netthouse/db";
import { organizations } from "@netthouse/db";
import { eq } from "drizzle-orm";
import { requireUser } from "../lib/auth.js";

const createOrgSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
});

export async function organizationRoutes(app: FastifyInstance) {
  app.get("/organizations", async (req) => {
    const userId = requireUser(req);
    const rows = await db
      .select()
      .from(organizations)
      .where(eq(organizations.clerkUserId, userId));
    return { organizations: rows };
  });

  app.post("/organizations", async (req, reply) => {
    const userId = requireUser(req);
    const parsed = createOrgSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply
        .status(400)
        .send({ error: "Validation failed", details: parsed.error.issues });
    }
    const { name, slug } = parsed.data;
    const [org] = await db
      .insert(organizations)
      .values({ name, slug, clerkUserId: userId })
      .returning();
    return reply.status(201).send({ organization: org });
  });

  app.get("/organizations/:id", async (req) => {
    const userId = requireUser(req);
    const { id } = req.params as { id: string };
    const [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, id))
      .limit(1);
    if (!org || org.clerkUserId !== userId) {
      return { organization: null };
    }
    return { organization: org };
  });
}