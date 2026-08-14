import { NextResponse } from "next/server";
import { discoverBacklinkOpportunities } from "@/lib/seo-agent/discovery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request): boolean {
  const secret = process.env.SEO_AGENT_CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const opportunities = await discoverBacklinkOpportunities();
    return NextResponse.json({
      ok: true,
      discovered: opportunities.length,
      qualified: opportunities.filter((item) => item.status === "qualified").length,
      opportunities,
    });
  } catch (error) {
    console.error("SEO agent discovery failed", error);
    return NextResponse.json(
      { error: "SEO discovery failed" },
      { status: 500 },
    );
  }
}
