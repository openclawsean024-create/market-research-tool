# 【市場研究工具】規格計劃書

## 2. 資訊架構與動線

### 2.1 網站地圖

Market Research Tool | 首頁（輸入研究目標）| 研究進行中頁（即時進度）| 報告頁（執行摘要/詳細分析/引用來源）| 我的研究（歷史）| 設定
### 2.2 使用者動線

```mermaid\nflowchart TD\n    A([使用者進入首頁]) --> B[選擇研究類型]\n    B --> C{研究類型}\n    C -->|競爭分析| D[輸入競爭對手名稱]\n    C -->|趨勢報告| E[輸入關鍵字或產業]\n    C -->|用戶調研| F[描述目標受眾]\n    D --> G\n    E --> G\n    F --> G[點擊開始研究]\n    G --> H[系統爬取公開資料]\n    H --> I[AI 分析與生成報告]\n    I --> J[產出完整報告]\n    J --> K{滿意結果?}\n    K -->|是| L[匯出報告]\n    K -->|否| M[調整參數重新生成]\n```
## 3. 視覺與 UI

### 3.1 品牌設計指南

Primary: #6366F1 | Secondary: #0F172A | Accent: #10B981 | Warning: #F59E0B | Chart Blue: #3B82F6 | Chart Purple: #8B5CF6 | 字體：Inter + JetBrains Mono
## 1. 專案概述

### 1.1 專案背景與目的

創業者在寫商業計劃書之前，往往需要先做市場研究——但多數人不知道從哪裡下手，只能拼湊一些網路文章，數據缺乏系統性、來源不清楚、結論也缺乏說服力。本工具定位為「AI 驅動的商業研究助理」：輸入競爭對手名稱或產業關鍵字，系統自動爬取公開資料，結合 AI 產生包含 SWOT 分析、數據圖表、趨勢預測的專業商業報告。重點不是取代思考，而是大幅減少「找資料」的時間。
### 1.2 目標受眾（TA）

- 早期創業者：需要在短時間內完成商業計劃書的市場分析章節
- 產品經理：進行競品分析或市場進入評估
- 投資人：做盡職調查時，需要快速掌握一個產業的基本面貌
- 學術研究者：需要快速獲取產業趨勢
### 1.3 專案範圍

- 競爭對手分析（爬取官網、Social Media、News）
- SWOT 分析框架輸出（AI 生成）
- 市場佔有率估算、趨勢報告
- 報告匯出（Markdown / PDF / PPT 格式）
- 引用來源列表
- 即時股市/財務數據、實際訪談記錄管理
- 團隊協作、付費資料庫存取
### 1.4 參考網站分析

CB Insights（數據嚴謹但昂貴）| Crunchbase（創投數據完整但無法做完整報告）| Statista（統計數據齊全但付費牆）| SimilarWeb（流量分析強但僅限數位產品）
## 4. 前端功能規格

- 研究類型選擇：三分頁（競爭分析 / 趨勢報告 / 用戶調研）
- 研究進度指示：三階段（爬蟲 0-40% → 分析 40-70% → 生成 70-100%）
- 執行摘要：1-2 頁精華，核心發現量化呈現
- SWOT 分析模組：四象限矩陣，AI 生成
- 數據圖表：市場規模/趨勢/競爭格局（Chart.js）
- 報告匯出：Markdown（一鍵複製）/ PDF / PPT
- 研究歷史：最多 50 個過往研究，可重新生成或比較
## 5. 後端與技術規格

### 5.1 技術棧

前端：Next.js 14 + Tailwind CSS | 爬蟲：Scrapy + Playwright | AI：Claude API 或 GPT-4o | 報告生成：React-PDF / pptxgenjs | 後端：FastAPI | 任務佇列：Celery + Redis | 部署：Railway + Vercel
### 5.2 第三方 API

Claude API（AI 研究報告生成，按 token 計費）| GPT-4o（備選）| Scrapy Cloud（爬蟲部署）
## 6. 專案時程與驗收標準

```mermaid\ntimeline\n    title Market Research Tool 開發時程\n    phase 1: 爬蟲與資料層 (Week 1-2)\n        Scrapy 爬蟲框架建立 : 3 days\n        Playwright 動態內容處理 : 3 days\n        熱門網站爬蟲適配 : 4 days\n    phase 2: AI 分析引擎 (Week 3-4)\n        Claude API 串接 : 2 days\n        SWOT 分析 Prompt 設計 : 3 days\n    phase 3: 前端報告頁 (Week 5-6)\n        研究進度 UI : 2 days\n        報告頁本體 : 5 days\n        匯出功能 : 3 days\n    phase 4: 後端與排程 (Week 7-8)\n        FastAPI 研究 API : 3 days\n        Celery 任務佇列 : 3 days\n    phase 5: 測試與交付 (Week 9)\n        爬蟲穩定性測試 : 3 days\n        Bug 修復 : 2 days\n```
### 6.2 驗收標準

支援瀏覽器：Chrome/Firefox/Edge 120+ | 報告生成完成率 > 90% | 用戶引用率 > 50% | 平均生成時間 < 10 分鐘 | PDF 匯出成功率 > 95%
## 7. 功能勾選清單

### 前端

### 後端

### DevOps

