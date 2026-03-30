/**
 * Topic Filter — Short Video Suitability Assessment
 * Determines if a trending topic is suitable for short-form video content
 */

import type { TrendItem } from "./scraper";

export interface FilteredTopic extends TrendItem {
  videoScore: number;        // 0-100, how video-friendly
  videoReasons: string[];    // Why it's good/bad for short video
  targetAudience: string[];  // Who would watch this
  videoAngle: string;        // How to frame it as short video
  urgency: "breaking" | "trending" | "evergreen";
}

const SHORT_VIDEO_KEYWORDS: Record<string, number> = {
  // High video potential
  "AI": 85, "crypto": 70, "viral": 95, "gaming": 88, "movie": 90,
  "music": 92, "fitness": 85, "food": 88, "travel": 82, "fashion": 80,
  "pet": 86, "sports": 84, "dance": 95, "comedy": 93, "tutorial": 78,
  "marathon": 75, "stock": 65, "tech": 80, "art": 83, "diy": 82,
  // Lower video potential
  "layoffs": 40, "climate": 60, "politics": 45, "crime": 30,
};

const VIDEO_ANGLE_TEMPLATES: Record<string, string[]> = {
  "Technology": [
    "5 things you didn't know about {keyword}",
    "{keyword} explained in 60 seconds",
    "Why everyone is talking about {keyword}",
  ],
  "Entertainment": [
    "{keyword} moment you missed",
    "Reacting to {keyword} 🔥",
    "{keyword} breakdown in 30 seconds",
  ],
  "Sports": [
    "{keyword} highlights reel",
    "Behind the scenes of {keyword}",
    "{keyword} that broke the internet",
  ],
  "Finance": [
    "{keyword} explained simply",
    "What {keyword} means for you",
    "{keyword} in under 60 seconds",
  ],
  "Lifestyle": [
    "Day in the life with {keyword}",
    "{keyword} aesthetic",
    "POV: {keyword}",
  ],
  default: [
    "Why {keyword} is going viral",
    "{keyword} trend explained",
    "Everything about {keyword} in 1 minute",
  ],
};

export function scoreTopicForVideo(item: TrendItem): FilteredTopic {
  const baseScore = SHORT_VIDEO_KEYWORDS[item.keyword.toLowerCase()] ?? 60;
  const sentimentBonus = item.sentiment === "positive" ? 10 : item.sentiment === "negative" ? -15 : 0;
  const viralBonus = item.isViral ? 15 : 0;
  const volumeBonus = (item.volume && item.volume > 100000) ? 10 : 0;

  const videoScore = Math.min(100, Math.max(0, baseScore + sentimentBonus + viralBonus + volumeBonus));

  const reasons: string[] = [];
  if (videoScore >= 80) reasons.push("High visual/story potential");
  if (item.isViral) reasons.push("Already demonstrated viral capability");
  if (item.sentiment === "positive") reasons.push("Positive sentiment drives shares");
  if (item.volume && item.volume > 50000) reasons.push("Large audience reach");
  if (item.category === "Entertainment") reasons.push("Entertainment content excels on short video");
  if (["tutorial", "how", "explain"].some(k => item.keyword.toLowerCase().includes(k))) {
    reasons.push("Educational content has high retention");
  }
  if (videoScore < 50) reasons.push("May require creative framing for video format");

  const angles = VIDEO_ANGLE_TEMPLATES[item.category]
    ? VIDEO_ANGLE_TEMPLATES[item.category]
    : VIDEO_ANGLE_TEMPLATES["default"];
  const angleTemplate = angles[Math.floor(Math.random() * angles.length)];
  const videoAngle = angleTemplate.replace("{keyword}", item.keyword);

  const audiences = getTargetAudience(item);
  const urgency = getUrgency(item);

  return {
    ...item,
    videoScore,
    videoReasons: reasons,
    targetAudience: audiences,
    videoAngle,
    urgency,
  };
}

function getTargetAudience(item: TrendItem): string[] {
  const map: Record<string, string[]> = {
    "Technology": ["Tech enthusiasts", "Early adopters", "Generations Z & Alpha"],
    "Entertainment": ["Gen Z", "Millennials", "Pop culture fans"],
    "Sports": ["Sports fans", "Athletes", "Fitness community"],
    "Finance": ["Investors", "Finance professionals", "Young adults managing money"],
    "Lifestyle": ["Women 18-34", "Lifestyle seekers", "Content consumers"],
    "Food": ["Foodies", "Home cooks", "Health-conscious eaters"],
    "Music": ["Music lovers", "Gen Z", "Concert-goers"],
    "Art": ["Art community", "Creatives", "Designers"],
    "DIY": ["Makers", "Home enthusiasts", "Creative professionals"],
    "default": ["General audience", "Content consumers"],
  };
  return map[item.category] || map["default"];
}

function getUrgency(item: TrendItem): "breaking" | "trending" | "evergreen" {
  if (item.isViral && item.volume && item.volume > 200000) return "breaking";
  if (item.isViral) return "trending";
  return "evergreen";
}

export function filterAndScore(topics: TrendItem[]): FilteredTopic[] {
  return topics
    .map(scoreTopicForVideo)
    .sort((a, b) => b.videoScore - a.videoScore)
    .slice(0, 20); // Top 20 most video-ready topics
}
