# MapMyStay 🗺️✨

> **AI-Powered Travel Tracker** — Track your visited countries, unlock achievement badges, and get personalized travel recommendations powered by Claude AI.

Built for the ESMT "Entrepreneurship with LLMs" course, this project demonstrates practical LLM integration in a consumer web application.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://maps-production-e2fa.up.railway.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![Anthropic Claude](https://img.shields.io/badge/AI-Claude%203-purple)](https://anthropic.com)

---

## 🤖 LLM Integration Features

### AI Travel Concierge
A conversational AI assistant powered by **Anthropic Claude 3 Haiku** that provides personalized travel advice:

- **Context-aware responses**: The AI knows your visited countries, badges, and travel patterns
- **Personalized recommendations**: Get destination suggestions based on your travel history
- **Travel expertise**: Ask about visa requirements, best times to visit, local tips, and more
- **Persistent chat history**: Conversations are saved locally for continuity

**Technical Implementation:**
- API Route: `/app/api/chat/route.ts`
- Anthropic SDK integration with custom system prompts
- Travel context injection for personalized responses
- Demo mode fallback when API key is not configured

### AI-Powered Recommendations
Smart destination suggestions combining algorithmic analysis with AI enhancement:

- **Regional completion**: Suggests countries in continents you're already exploring
- **New continent discovery**: Encourages exploring unexplored regions
- **Badge optimization**: Recommends destinations that unlock the next badge
- **AI-enhanced reasoning**: Claude provides personalized explanations

**Technical Implementation:**
- API Route: `/app/api/recommendations/route.ts`
- Hybrid algorithmic + AI approach for robust recommendations
- Graceful degradation to pure algorithmic mode without API key

---

## 🏆 Gamification System

### Duolingo-Style Achievement Badges
13 progressive badges based on country count, inspired by Duolingo's tier system:

| Tier | Badge | Countries Required |
|------|-------|-------------------|
| 🟤 Copper | First Stamp | 1 |
| 🟤 Copper | Curious Traveler | 3 |
| 🟠 Bronze | Explorer | 5 |
| 🟠 Bronze | Adventurer | 10 |
| ⚪ Silver | Wanderer | 15 |
| ⚪ Silver | Globetrotter | 20 |
| 🟡 Gold | World Citizen | 25 |
| 🟡 Gold | Jet Setter | 30 |
| 🔵 Platinum | Passport Master | 40 |
| 🔵 Platinum | World Traveler | 50 |
| 💎 Diamond | Continental Master | 75 |
| 💎 Diamond | World Conqueror | 100 |
| 🌟 Legendary | Ultimate Explorer | 150 |

**Features:**
- Visual progress tracking with tier-colored badges
- Clickable badges with detailed modal showing progress and rewards
- Current tier display and next badge preview
- Fun reward messages for unlocked achievements

**Technical Implementation:**
- Badge definitions: `/lib/badges/definitions.ts`
- Progress calculator: `/lib/badges/calculator.ts`
- UI components: `/components/BadgeProgress.tsx`, `/components/BadgeGallery.tsx`

---

## 🔐 User Authentication & Cloud Sync

### Supabase Integration
Full user authentication with cross-device data synchronization:

- **Email/password authentication** via Supabase Auth
- **Automatic cloud sync** — changes save every 2 seconds
- **Smart data merging** — combines local and cloud data on login
- **Logout clears data** — map becomes blank, ready for next user
- **Login restores data** — your countries reappear from the cloud

**Database Schema:**
```sql
CREATE TABLE user_map_data (
  user_id UUID PRIMARY KEY,
  countries_data JSONB,
  tags_data JSONB,
  settings JSONB,
  updated_at TIMESTAMPTZ
);
```

---

## ✨ Core Features

### Interactive World Map
- Click any country to select and edit
- Visual highlighting of visited countries
- Smooth zoom and pan navigation
- Touch-optimized for mobile devices

### Country Management
- Search countries with live filtering
- Add notes, ratings, and visit dates
- Tag system (Want to Visit, Lived Here, Favorite)
- Track progress with real-time statistics

### Export & Share
- Export map as high-resolution PNG
- Multiple preset sizes (Print, Social, HD, 4K)
- Share via Web Share API or clipboard

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| AI | Anthropic Claude 3 Haiku |
| Auth & DB | Supabase |
| Maps | react-simple-maps |
| Deployment | Railway |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for auth & sync)
- Anthropic API key (optional, for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/absolutebasti/maps.git
cd maps

# Install dependencies
npm install --legacy-peer-deps

# Create environment file
cp .env.example .env.local
```

### Environment Variables

```env
# Supabase (Required for auth)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Anthropic (Optional - enables AI features)
ANTHROPIC_API_KEY=your_anthropic_key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment

Deploy to Railway with one click:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template)

Or deploy manually:
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # AI chat endpoint
│   │   └── recommendations/route.ts # AI recommendations
│   ├── auth/confirm/page.tsx       # Email confirmation page
│   └── page.tsx                    # Main map page
├── components/
│   ├── BadgeProgress.tsx           # Badge sidebar widget
│   ├── BadgeGallery.tsx            # Full badge grid
│   ├── ChatConcierge.tsx           # AI chat interface
│   ├── Recommendations.tsx         # AI recommendations
│   └── AuthProvider.tsx            # Auth context & sync
├── lib/
│   ├── anthropic/                  # AI integration
│   │   ├── client.ts               # Anthropic SDK setup
│   │   └── prompts.ts              # System prompts
│   ├── badges/                     # Gamification
│   │   ├── definitions.ts          # Badge data
│   │   ├── calculator.ts           # Progress logic
│   │   └── geography.ts            # Continent/island data
│   └── supabase/                   # Auth & database
│       ├── auth.ts                 # Authentication
│       └── sync.ts                 # Cloud sync
```

---

## 🎓 ESMT Course Context

This project was built for the **"Entrepreneurship with LLMs"** course at ESMT Berlin. It demonstrates:

1. **Practical LLM Integration** — Real API integration with Anthropic Claude
2. **User-Facing AI Features** — Chat interface and recommendation engine
3. **Graceful Degradation** — App works without AI (demo mode)
4. **Full-Stack Implementation** — Next.js, Supabase, TypeScript
5. **Production Deployment** — Live on Railway

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

**Made with ❤️ for ESMT Berlin**
