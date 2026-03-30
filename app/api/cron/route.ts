import { NextResponse } from "next/server";
import { scrapeAll } from "@/lib/scraper";
import { filterAndScore } from "@/lib/filter";

// Vercel Cron job — runs daily at 8am UTC
export async function GET(request: Request) {
  // Verify cron secret for security
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const allTrends = await scrapeAll();
    const scored = filterAndScore(allTrends);
    
    const result = {
      success: true,
      ranAt: new Date().toISOString(),
      totalCollected: allTrends.length,
      topVideoTopics: scored.slice(0, 5).map(t => ({
        keyword: t.keyword,
        platform: t.platform,
        videoScore: t.videoScore,
        videoAngle: t.videoAngle,
        urgency: t.urgency,
      })),
    };

    // In production: save to database, send notifications, auto-post to site
    console.log("[CRON] Market research run complete:", JSON.stringify(result, null, 2));

    return NextResponse.json(result);
  } catch (error) {
    console.error("[CRON] Error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
