# Market Research Tool — Project Agent Guide

## Overview
AI-powered trend intelligence tool that collects trending topics from social media (X/Twitter, Facebook, Instagram), scores them for short-form video suitability, and verifies sources.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Fonts**: Inter (UI) + JetBrains Mono (data)
- **Deployment**: Vercel

## Project Structure
```
app/
  page.tsx              # Main dashboard
  layout.tsx            # Root layout with fonts
  globals.css           # Design system
  api/
    trends/route.ts     # GET /api/trends — collect & score trends
    cron/route.ts       # GET /api/cron — Vercel Cron (daily 8AM UTC)
lib/
  scraper.ts            # Multi-platform trend scraper
  filter.ts             # Short video suitability scorer
  verifier.ts           # News source verification
```

## Key Features
1. **Trend Collection**: Scrapes X/Twitter, Facebook, Instagram for top trending topics
2. **Video Score**: 0-100 score per topic for short-form video potential
3. **Source Verification**: Checks against credible news sources (Reuters, AP, BBC, Bloomberg)
4. **Scheduling**: Vercel Cron job runs daily at 8AM UTC
5. **Dashboard**: Filterable grid by urgency (breaking/trending) and platform

## Vercel Cron Configuration
```json
{ "path": "/api/cron", "schedule": "0 8 * * *" }
```
Requires `CRON_SECRET` env var in production for authorization.

## Environment Variables
- `CRON_SECRET`: Bearer token for cron endpoint security
- `NEXT_PUBLIC_SITE_URL`: Production site URL for absolute URLs

## Dev Commands
```bash
npm run dev    # Development server
npm run build  # Production build
npm run start  # Production server
```

## Deployment
```bash
vercel --prod
```
**Note**: Vercel token expired — Sean needs to run `vercel login` first.
