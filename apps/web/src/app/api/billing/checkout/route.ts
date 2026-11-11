import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const formData = await req.formData();
  const orgId = formData.get("orgId");
  const tier = formData.get("tier");

  if (typeof orgId !== "string" || typeof tier !== "string") {
    return NextResponse.json(
      { error: "Invalid checkout data" },
      { status: 400 }
    );
  }

  const res = await fetch(`${API_URL}/billing/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId,
    },
    body: JSON.stringify({ orgId, tier }),
  });

  const data = await res.json();

  if (data.url) {
    return NextResponse.redirect(data.url);
  }

  return NextResponse.json(
    { error: data.error ?? "Failed to create checkout session" },
    { status: res.status || 400 }
  );
}
