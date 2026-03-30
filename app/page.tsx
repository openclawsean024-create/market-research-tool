"use client";
// Market Research Tool — Trend Dashboard

import { useState, useEffect } from "react";

interface FilteredTopic {
  id: string;
  platform: string;
  keyword: string;
  volume?: number;
  url: string;
  fetchedAt: string;
  category: string;
  sentiment: string;
  isViral: boolean;
  videoScore: number;
  videoReasons: string[];
  targetAudience: string[];
  videoAngle: string;
  urgency: string;
  verification?: {
    topic: string;
    isVerified: boolean;
    sources: { name: string; credibility: string }[];
    summary: string;
  };
}

interface ApiResponse {
  success: boolean;
  fetchedAt: string;
  total: number;
  top20: FilteredTopic[];
  verifiedTop10: FilteredTopic[];
}

const PLATFORM_COLORS: Record<string, string> = {
  twitter: "badge-twitter",
  facebook: "badge-facebook",
  instagram: "badge-instagram",
};

const PLATFORM_ICONS: Record<string, string> = {
  twitter: "X",
  facebook: "Fb",
  instagram: "Ig",
};

const CATEGORY_COLORS: Record<string, string> = {
  Technology: "#6366f1",
  Entertainment: "#f97316",
  Sports: "#22c55e",
  Finance: "#eab308",
  Lifestyle: "#ec4899",
  Food: "#f97316",
  Music: "#8b5cf6",
  Art: "#06b6d4",
  default: "#6366f1",
};

export default function MarketResearchPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "breaking" | "trending">("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/trends")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(String(e)); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--accent-dim)", border: "1px solid rgba(99,102,241,0.2)" }}>
          <svg className="w-10 h-10 pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 9l-5 5-4-4-3 3"/></svg>
        </div>
        <p className="text-zinc-500 font-medium">Collecting trends across platforms...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
      <div className="text-center">
        <p className="text-red-400 font-bold text-lg mb-2">Failed to load trends</p>
        <p className="text-zinc-500">{error}</p>
      </div>
    </div>
  );

  if (!data?.success) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
      <p className="text-zinc-500">No data available</p>
    </div>
  );

  const filtered = (filter === "all"
    ? data.top20
    : data.top20.filter(t => t.urgency === filter)
  ).filter(t => platformFilter === "all" || t.platform === platformFilter);

  const avgScore = data.top20.length
    ? Math.round(data.top20.reduce((s, t) => s + t.videoScore, 0) / data.top20.length)
    : 0;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>

      {/* Header */}
      <header style={{ background: "rgba(10,10,18,0.95)", borderBottom: "1px solid var(--border)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-light))" }}>
              MR
            </div>
            <div>
              <h1 className="font-black text-white text-lg">Market<span className="gradient-text">Research</span></h1>
              <p className="text-xs text-zinc-600">AI-Powered Trend Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-600">
              Updated {new Date(data.fetchedAt).toLocaleTimeString("zh-TW")}
            </span>
            <button
              onClick={() => window.location.reload()}
              className="text-sm font-bold text-zinc-400 hover:text-white px-4 py-2 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-all"
            >
              ↻ Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { label: "TOPICS COLLECTED", value: data.total, icon: "CHART", color: "var(--accent)" },
            { label: "AVG VIDEO SCORE", value: avgScore, icon: "CLIP", color: "var(--green)" },
            { label: "PLATFORMS", value: 3, icon: "WEB", color: "var(--orange)" },
            { label: "BREAKING NOW", value: data.top20.filter(t => t.urgency === "breaking").length, icon: "ALERT", color: "var(--red)" },
          ].map(stat => (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold tracking-[0.15em] text-zinc-500 uppercase">{stat.icon}</span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-600 uppercase">{stat.label}</span>
              </div>
              <div className="text-3xl font-black" style={{ color: stat.color, fontFamily: "var(--font-jetbrains)" }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <div className="flex gap-2">
            {(["all", "breaking", "trending"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-5 py-2 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: filter === f ? "var(--accent)" : "var(--bg-card)",
                  color: filter === f ? "#fff" : "var(--text-secondary)",
                  border: `1px solid ${filter === f ? "var(--accent)" : "var(--border)"}`,
                }}
              >
                {f === "all" ? "All Topics" : f === "breaking" ? "Breaking" : "Trending"}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {(["all", "twitter", "facebook", "instagram"] as const).map(p => (
              <button
                key={p}
                onClick={() => setPlatformFilter(p)}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: platformFilter === p ? (p === "all" ? "var(--accent)" : "transparent") : "transparent",
                  color: platformFilter === p ? "#fff" : "var(--text-muted)",
                  border: `1px solid ${platformFilter === p ? (p === "all" ? "var(--accent)" : "var(--border)") : "var(--border)"}`,
                }}
              >
                {p === "all" ? "ALL" : `${PLATFORM_ICONS[p]} ${p}`}
              </button>
            ))}
          </div>
        </div>

        {/* Topic grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.slice(0, 18).map((topic, idx) => (
            <div
              key={topic.id}
              className="topic-card fade-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-block text-[10px] font-black tracking-[0.15em] uppercase px-2.5 py-1 rounded-full ${PLATFORM_COLORS[topic.platform] || "badge-twitter"}`}>
                    {PLATFORM_ICONS[topic.platform]} {topic.platform}
                  </span>
                  <span
                    className="inline-block text-[10px] font-black tracking-[0.1em] uppercase px-2.5 py-1 rounded-full"
                    style={{
                      background: `${CATEGORY_COLORS[topic.category] || CATEGORY_COLORS.default}18`,
                      color: CATEGORY_COLORS[topic.category] || CATEGORY_COLORS.default,
                      border: `1px solid ${CATEGORY_COLORS[topic.category] || CATEGORY_COLORS.default}30`,
                    }}
                  >
                    {topic.category}
                  </span>
                </div>
                <span
                  className={`inline-block text-[10px] font-black tracking-[0.1em] uppercase px-2 py-0.5 rounded-full ${
                    topic.urgency === "breaking" ? "urgent-breaking" :
                    topic.urgency === "trending" ? "urgent-trending" : "urgent-evergreen"
                  }`}
                >
                  {topic.urgency === "breaking" ? "BREAKING" : topic.urgency === "trending" ? "TRENDING" : "EVERGREEN"}
                </span>
              </div>

              {/* Keyword */}
              <h3 className="text-xl font-black text-white mb-2 leading-tight">{topic.keyword}</h3>

              {/* Video angle */}
              <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{topic.videoAngle}</p>

              {/* Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-600 uppercase">Video Score</span>
                  <span className="text-sm font-black" style={{
                    color: topic.videoScore >= 80 ? "var(--green)" : topic.videoScore >= 60 ? "var(--orange)" : "var(--red)",
                    fontFamily: "var(--font-jetbrains)"
                  }}>
                    {topic.videoScore}/100
                  </span>
                </div>
                <div className="score-bar">
                  <div
                    className="score-bar-fill"
                    style={{
                      width: `${topic.videoScore}%`,
                      background: topic.videoScore >= 80
                        ? "linear-gradient(90deg, #22c55e, #4ade80)"
                        : topic.videoScore >= 60
                        ? "linear-gradient(90deg, #f97316, #fb923c)"
                        : "linear-gradient(90deg, #ef4444, #f87171)",
                    }}
                  />
                </div>
              </div>

              {/* Reasons */}
              {topic.videoReasons.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {topic.videoReasons.slice(0, 2).map((reason, i) => (
                    <span key={i} className="text-[11px] text-zinc-500 bg-zinc-900 rounded-md px-2 py-0.5">
                      {reason}
                    </span>
                  ))}
                </div>
              )}

              {/* Verification */}
              {topic.verification && (
                <div className="rounded-xl p-3 mb-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    {topic.verification.isVerified ? (
                      <span className="text-xs font-bold text-green-400">✓ Verified</span>
                    ) : (
                      <span className="text-xs font-bold text-yellow-400">⚠ Unverified</span>
                    )}
                    <span className="text-[10px] text-zinc-600">Sources:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {topic.verification.sources.slice(0, 2).map((s, i) => (
                      <span key={i} className="source-tag">{s.name}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Audience */}
              <div className="flex flex-wrap gap-1">
                {topic.targetAudience.slice(0, 2).map((aud, i) => (
                  <span key={i} className="text-[10px] font-medium text-zinc-600 bg-zinc-900 rounded px-2 py-0.5">
                    {aud}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 text-center">
          <p className="text-zinc-700 text-xs">
            Data refreshes every request. Cron automation configured for daily 8AM UTC execution.
            <br />
            <span className="text-zinc-800">Sources: X/Twitter, Facebook, Instagram | Verification: Reuters, AP, BBC, Bloomberg</span>
          </p>
        </div>
      </main>
    </div>
  );
}
