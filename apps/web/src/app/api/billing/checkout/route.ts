import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function POST(req: Request) {
  const formData = await req.formData();
  const orgId = formData.get("orgId") as string;
  const tier = formData.get("tier") as string;

  const res = await fetch(`${API_URL}/billing/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orgId, tier }),
  });

  const data = await res.json();

  if (data.url) {
    return NextResponse.redirect(data.url);
  }

  return NextResponse.json({ error: data.error ?? "Failed" }, { status: 400 });
}