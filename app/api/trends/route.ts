import { NextResponse } from "next/server";
import { scrapeAll } from "@/lib/scraper";
import { filterAndScore } from "@/lib/filter";
import { verifyTopic } from "@/lib/verifier";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const allTrends = await scrapeAll();
    const scored = filterAndScore(allTrends);
    
    // Verify top 10 topics
    const top10 = scored.slice(0, 10);
    const verified = top10.map(t => ({
      ...t,
      verification: verifyTopic(t.keyword),
    }));

    return NextResponse.json({
      success: true,
      fetchedAt: new Date().toISOString(),
      total: scored.length,
      top20: scored,
      verifiedTop10: verified,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
