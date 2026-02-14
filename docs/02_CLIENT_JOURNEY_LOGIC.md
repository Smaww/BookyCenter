# 02_CLIENT_JOURNEY_LOGIC

## Technical Business Logic: The Complete Client Dashboard Architecture

**Document Version:** 1.0  
**Last Updated:** February 12, 2026  
**Classification:** System Architecture & UX Logic — Post-Login Client Experience  
**Author:** Product Architecture & UX Engineering Team  
**Depends On:** `BOOKY_CENTER_BUSINESS_MASTER.md` (v5.0)

---

## Table of Contents

1. [The 'Smart Auth' Gateway (Entry Logic)](#1-the-smart-auth-gateway-entry-logic)
2. [The 'Social Marketplace' Feed (Home Screen)](#2-the-social-marketplace-feed-home-screen)
3. [The Discovery & Booking Engine (Core Utility)](#3-the-discovery--booking-engine-core-utility)
4. [Gamification & Loyalty (Retention System)](#4-gamification--loyalty-retention-system)
5. [Checkout & Notifications (The Closing)](#5-checkout--notifications-the-closing)
6. [Data Models & API Contract Summary](#6-data-models--api-contract-summary)
7. [Edge Cases & Error Handling](#7-edge-cases--error-handling)

---

## 1. The 'Smart Auth' Gateway (Entry Logic)

### 1.1 The 5-Second Entry Rule

> **Design Law:** A new user must go from "I want to sign up" to "I see relevant services near me" in **≤ 5 seconds of active input**. Every additional second increases drop-off by 20%.

### 1.2 Identity: Phone Number as Primary ID

The Egyptian market is phone-first. SIM penetration is 102% (multi-SIM culture). Phone number is the universal identifier.

#### Authentication Flow

```
USER TAPS "حساب جديد"
         │
         ▼
   ┌─────────────────────┐
   │  Account Type Modal  │
   │  "عايز تسجل كـ إيه؟" │
   │                     │
   │  [👤 عميل]  [🏪 تاجر] │
   └────────┬────────────┘
            │ User selects "عميل"
            ▼
   ┌─────────────────────┐
   │   Phone Number Input  │
   │   +20 | ___________  │
   │   [أرسل كود التحقق]    │
   └────────┬────────────┘
            │
            ▼
   ┌─────────────────────┐
   │   OTP Verification    │
   │   4-digit code        │
   │   (60s countdown)     │
   │   [Resend] available  │
   │   after timeout       │
   └────────┬────────────┘
            │ Verified ✓
            ▼
   ┌─────────────────────┐
   │   Quick Profile       │
   │   (Name + Photo)      │
   │   [Import from Google]│
   │   [Import from FB]    │
   │   [أو اكتب اسمك]      │
   └────────┬────────────┘
            │
            ▼
   ┌─────────────────────┐
   │   Geo-Permission      │
   │   "عشان نوريك أقرب    │
   │    خدمة ليك"          │
   │   [سماح] [ليس الآن]    │
   └────────┬────────────┘
            │
            ▼
   ┌─────────────────────┐
   │   CLIENT DASHBOARD    │
   │   (Home Screen)       │
   │   Services filtered   │
   │   by location ✓       │
   └───────────────────────┘
```

### 1.3 The Fork: Account Type Selection

| Property | Value |
|----------|-------|
| **Trigger** | User clicks "حساب جديد" on the Landing Page Navbar |
| **Component** | `AuthSelectionModal` (already implemented in `LandingPage.jsx`) |
| **Options** | "عميل" (Client) / "تاجر" (Merchant) |
| **Backend Flag** | `user.account_type: "client" | "merchant"` |
| **Persistence** | Stored in `users` table; cannot be changed without contacting support |

**User Story:**
> *As a new visitor, I want to clearly choose whether I'm a customer or a merchant so that I only see features relevant to me.*

### 1.4 OTP Verification Logic

| Rule | Specification |
|------|--------------|
| **OTP Length** | 4 digits |
| **OTP Expiry** | 120 seconds |
| **Max Attempts** | 3 per session (then 15-minute cooldown) |
| **Resend Cooldown** | 60 seconds |
| **Provider** | SMS via Twilio / Vodafone Bulk SMS API |
| **Fallback** | WhatsApp OTP if SMS fails after 30s |
| **Rate Limit** | Max 5 OTPs per phone number per hour |
| **Validation** | Egyptian phone format: `+20 1[0125] XXX XXXX` |

**User Story:**
> *As a new user, I want to verify my phone number quickly with a 4-digit OTP so that my account is secure without hassle.*

### 1.5 Profile Enrichment (One-Tap Import)

| Source | Data Imported | Permissions Required |
|--------|--------------|---------------------|
| **Google** | Display Name, Profile Photo, Email | OAuth 2.0 (Google Identity API) |
| **Facebook** | Display Name, Profile Photo | Facebook Login SDK (public_profile) |
| **Manual** | User types name, uploads photo (optional) | None |

**Rules:**
- Email is stored but **never used for login** (phone is primary).
- Photo import is optional; a default avatar (first letter of name) is generated.
- No password is ever created. Auth is 100% OTP-based.

### 1.6 Geo-Location: Auto-Detect & Filter

| Rule | Specification |
|------|--------------|
| **Permission Prompt** | Shown immediately after profile setup |
| **API** | Browser Geolocation API → reverse geocode via Google Maps |
| **Fallback (Denied)** | Manual city/area dropdown (Cairo, Mansoura, Alex, etc.) |
| **Granularity** | Neighborhood-level (e.g., "المنصورة - التوريل") |
| **Storage** | `user.location: { lat, lng, area_name, city }` |
| **Update** | Re-detected on each app launch; user can override manually |

**User Story:**
> *As a user, I want the app to automatically detect my location so that I see only services near me without searching.*

---

## 2. The 'Social Marketplace' Feed (Home Screen)

### 2.1 Design Philosophy

> **Core Concept:** The Home Screen is NOT a boring directory of listings. It is a **living Social Feed** — blending the utility of Uber (instant booking) with the engagement of Facebook (community + discovery + FOMO).

### 2.2 Screen Architecture

```
┌──────────────────────────────────────────────────┐
│  STICKY HEADER                                    │
│  [Logo]  [Search Bar]  [🔔 Notifications]  [👤]   │
├──────────────────────────────────────────────────┤
│                                                    │
│  ── STORIES BAR (Flash Offers) ──                 │
│  (○)(○)(○)(○)(○)(○)  →  Horizontal Scroll         │
│                                                    │
│  ── SECTOR QUICK-ACCESS PILLS ──                  │
│  [ملاعب] [جمال] [خروجات] [بيت] [تعليم] [مناسبات]   │
│                                                    │
│  ── SOCIAL FEED (Vertical Scroll) ──              │
│  ┌────────────────────────────────────┐           │
│  │  ⭐ Ahmed rated [Padel X] 5 stars  │           │
│  │  "ملعب ممتاز والحجز كان سريع"       │           │
│  │  [📸 Photo]                        │           │
│  │              [احجز دلوقتي →]        │           │
│  └────────────────────────────────────┘           │
│  ┌────────────────────────────────────┐           │
│  │  🏪 Merchant Update                │           │
│  │  "سلوت جديد متاح الساعة 5 مساءً"    │           │
│  │              [احجز دلوقتي →]        │           │
│  └────────────────────────────────────┘           │
│                                                    │
├──────────────────────────────────────────────────┤
│  BOTTOM NAV BAR (Post-Login Only)                 │
│  [🏠 الرئيسية]  [📅 حجوزاتي]  [👤 حسابي]          │
└──────────────────────────────────────────────────┘
```

### 2.3 Component 1: Stories (Flash Offers)

> **Concept:** Merchant "Stories" that expire in 24 hours — inspired by Instagram/WhatsApp Stories but for **deals and availability**.

#### Data Model

```json
{
  "story_id": "uuid",
  "merchant_id": "uuid",
  "merchant_name": "ملعب النجوم",
  "merchant_avatar": "url",
  "media_type": "image | video",
  "media_url": "url",
  "offer_text": "خصم 30% على الحجز الصباحي",
  "offer_type": "discount | new_slot | flash_deal",
  "expires_at": "2026-02-13T00:00:00Z",
  "cta_action": "book_now | view_profile",
  "cta_target_service_id": "uuid",
  "is_viewed_by_user": false,
  "created_at": "2026-02-12T12:00:00Z"
}
```

#### Business Rules

| Rule | Specification |
|------|--------------|
| **Max Stories per Merchant** | 3 active at a time |
| **Expiry** | 24 hours from creation (hard delete after 48h) |
| **Story Duration (Viewing)** | 5 seconds per image, 15 seconds per video |
| **FOMO Timer** | Visible countdown badge: "باقي 3 ساعات" |
| **Priority Sort** | (1) Followed merchants, (2) Geo-proximity, (3) Engagement score |
| **Availability** | Free tier: 1 story/day. Premium merchants: 3 stories/day |
| **Analytics** | Views count, tap-through rate, booking conversion rate |

#### User Stories

> *As a user, I want to see time-limited deals from nearby merchants so that I can grab great offers before they expire.*

> *As a user, I want to tap on a story and book the deal directly so that I don't have to search for it separately.*

### 2.4 Component 2: Community Feed

> **Concept:** Real reviews from real people — social proof that drives bookings. Each review acts as a "mini-ad" with a built-in booking CTA.

#### Feed Item Types

| Type | Content | CTA |
|------|---------|-----|
| **User Review** | "Ahmed rated [Service] ⭐⭐⭐⭐⭐" + comment + photo | "احجز دلوقتي" → Merchant profile |
| **Merchant Update** | "[Merchant] posted: New slot at 5 PM" | "احجز دلوقتي" → Direct booking |
| **Booky Highlight** | "🔥 الأكثر حجزاً هذا الأسبوع: [Service]" | "شوف التفاصيل" → Merchant profile |
| **Achievement Card** | "🎉 حسام وصل رتبة 'اللي فاهمها'!" | "اعرف أكتر" → Gamification info |

#### Feed Algorithm (Ranking Logic)

```
Feed Score = (Recency × 0.3) + (Relevance × 0.3) + (Engagement × 0.2) + (Proximity × 0.2)
```

| Factor | Weight | Signal |
|--------|--------|--------|
| **Recency** | 30% | Time since post creation (decay curve) |
| **Relevance** | 30% | User's booking history, followed merchants, preferred sectors |
| **Engagement** | 20% | Likes, comments, booking conversions on the post |
| **Proximity** | 20% | Distance between user and merchant location |

#### Feed Pagination

| Property | Value |
|----------|-------|
| **Initial Load** | 10 items |
| **Infinite Scroll** | Load 5 more on scroll-to-bottom |
| **Pull-to-Refresh** | Full feed refresh |
| **Cache** | 15-minute client-side cache |
| **Empty State** | "اكتشف الخدمات القريبة منك" + sector pills |

### 2.5 Component 3: Merchant Updates

| Rule | Specification |
|------|--------------|
| **Who Can Post** | Verified merchants only |
| **Content Types** | Text, Image, New Availability, Offer |
| **Character Limit** | 280 characters (Twitter-like brevity) |
| **Visibility** | Users who follow the merchant OR are within 5km radius |
| **Frequency Cap** | Max 2 updates per merchant per day (anti-spam) |

**User Story:**
> *As a user, I want to see updates from merchants I follow so that I stay informed about new availability and offers.*

---

## 3. The Discovery & Booking Engine (Core Utility)

### 3.1 Search Logic

#### 3.1.1 Smart Search (NLP-Powered)

> **Goal:** The user types in natural Egyptian Arabic, and the system understands intent, location, price sensitivity, and service type.

| Query Example | Parsed Intent |
|---------------|---------------|
| "ملعب باديل في المعادي" | Service: Padel, Location: Maadi |
| "حلاق رجالي رخيص" | Service: Barber (Male), Price: Low |
| "عيادة أسنان قريبة مني" | Service: Dental Clinic, Location: User's current |
| "كيدز أريا عيد ميلاد" | Service: Kids Area, Context: Birthday party |
| "سباك ضروري دلوقتي" | Service: Plumbing, Urgency: Immediate |

#### 3.1.2 Search Architecture

```
USER INPUT (Arabic text)
        │
        ▼
┌─────────────────────┐
│  NLP Tokenizer       │  → Split query into tokens
│  (Arabic-aware)      │  → Handle dialect variations
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Intent Classifier    │  → Service type, location, price,
│  (ML Model)          │     urgency, occasion
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Elasticsearch       │  → Full-text search with Arabic
│  Query Builder       │     analyzer + geo-spatial filter
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Results Ranker      │  → Relevance + Proximity +
│                      │     Rating + Availability
└────────┬────────────┘
         │
         ▼
   SEARCH RESULTS PAGE
```

#### 3.1.3 Search Filters

| Filter | Type | Options |
|--------|------|---------|
| **Sector** | Single Select | 6 core sectors |
| **Sub-Service** | Multi Select | Dynamic based on sector |
| **Location** | Geo + Dropdown | Auto-detect / Manual area |
| **Distance** | Range Slider | 1km — 25km (default: 5km) |
| **Price Range** | Range Slider | Min — Max (EGP) |
| **Rating** | Min Stars | 3+ / 4+ / 4.5+ |
| **Availability** | Date Picker | Today, Tomorrow, Custom |
| **Sort By** | Single Select | الأقرب / الأعلى تقييماً / الأرخص / الأكثر حجزاً |

### 3.2 Sector Filtering: The 6 Core Verticals

| Sector | Arabic Name | Icon | Sub-Services Count |
|--------|-------------|------|--------------------|
| Sports & Fitness | ملاعب ورياضة | Trophy | 6 |
| Health & Beauty | صحة وجمال | Scissors | 6 |
| Entertainment | خروجات وترفيه | Gamepad | 6 |
| Home Services | خدمات منزلية | Wrench | 6 |
| Education & Work | تعليم ومساحات عمل | GraduationCap | 5 |
| Events & Celebrations | مناسبات وأفراح | Gift | 6 |

### 3.3 Merchant Profile (Mini-Site)

> **Design Principle:** A Merchant Profile should look like a **Social Media Profile** — familiar to the Egyptian user who spends 4+ hours daily on Facebook/Instagram.

#### Profile Layout

```
┌──────────────────────────────────────────────────┐
│  COVER IMAGE (16:9 ratio, merchant's venue)      │
│                                                    │
│      ┌──────┐                                     │
│      │AVATAR│  Merchant Name                      │
│      │      │  ⭐ 4.8 (1,200 تقييم)               │
│      └──────┘  📍 المنصورة - التوريل               │
│                [متابعة]  [💬 استفسار]               │
│                                                    │
│  ── STATS BAR ──                                  │
│  [1.2K متابع]  [850 حجز]  [4.8 تقييم]             │
│                                                    │
├──────────────────────────────────────────────────┤
│  TABS: [الخدمات]  [المواعيد]  [التقييمات]  [صور]    │
├──────────────────────────────────────────────────┤
│                                                    │
│  ── SERVICES MENU (Accordion) ──                  │
│  ▼ قص شعر رجالي                                   │
│    └─ السعر: 80 ج.م  |  المدة: 30 دقيقة           │
│    └─ [احجز دلوقتي]                                │
│  ▼ حلاقة ذقن                                      │
│    └─ السعر: 50 ج.م  |  المدة: 20 دقيقة           │
│    └─ [احجز دلوقتي]                                │
│                                                    │
│  ── REAL-TIME CALENDAR ──                         │
│  ┌─────┬─────┬─────┬─────┬─────┐                 │
│  │ 9AM │10AM │11AM │12PM │ 1PM │                 │
│  │ ⬜  │ ⬜  │ ◻️  │ ⬜  │ ⬜  │                 │
│  └─────┴─────┴─────┴─────┴─────┘                 │
│  ⬜ = Available (White)  ◻️ = Booked (Gray)       │
│                                                    │
│  ── REVIEWS ──                                    │
│  ┌─────────────────────────────────┐              │
│  │ ⭐⭐⭐⭐⭐  Ahmed M.              │              │
│  │ "أحسن حلاق في المنصورة 💯"       │              │
│  │ [📸 Photo]  2 days ago          │              │
│  └─────────────────────────────────┘              │
│                                                    │
└──────────────────────────────────────────────────┘
```

#### Merchant Profile Data Model

```json
{
  "merchant_id": "uuid",
  "business_name": "صالون الأناقة",
  "business_name_en": "Al-Anaka Salon",
  "avatar_url": "url",
  "cover_url": "url",
  "category": "health_beauty",
  "sub_category": "barber_male",
  "location": {
    "lat": 31.0409,
    "lng": 31.3785,
    "area_name": "المنصورة - التوريل",
    "city": "المنصورة",
    "address_text": "شارع الجمهورية، بجوار مسجد النصر"
  },
  "rating": {
    "average": 4.8,
    "count": 1200,
    "distribution": { "5": 890, "4": 210, "3": 70, "2": 20, "1": 10 }
  },
  "followers_count": 1200,
  "total_bookings": 8500,
  "services": [
    {
      "service_id": "uuid",
      "name": "قص شعر رجالي",
      "price": 80,
      "duration_minutes": 30,
      "deposit_required": false,
      "is_available": true
    }
  ],
  "working_hours": {
    "saturday": { "open": "09:00", "close": "22:00" },
    "sunday": { "open": "09:00", "close": "22:00" },
    "friday": { "open": "14:00", "close": "22:00" }
  },
  "subscription_tier": "growth",
  "is_verified": true,
  "created_at": "2026-01-15T10:00:00Z"
}
```

### 3.4 Real-Time Calendar

| Property | Specification |
|----------|--------------|
| **Slot Duration** | Merchant-defined (15min / 30min / 1hr) |
| **View** | Day view (default) + Week view toggle |
| **Colors** | White = Available, Gray = Booked, Light Gray = Break/Closed |
| **Update Frequency** | Real-time via WebSocket (or 30-second polling fallback) |
| **Conflict Prevention** | Optimistic UI: slot grays out on selection; confirmed on backend |
| **Timezone** | Egypt Standard Time (EET, UTC+2) always |

**User Story:**
> *As a user, I want to see available time slots in real-time so that I can pick the most convenient one without calling the merchant.*

### 3.5 Private Inquiry (Context-Aware Chat)

> **Goal:** Allow users to ask specific questions BEFORE booking — without exposing personal phone numbers.

#### Chat Flow

```
USER TAPS "💬 استفسار" ON MERCHANT PROFILE
        │
        ▼
┌───────────────────────────────┐
│  CHAT SESSION CREATED          │
│  Context: "استفسار عن خدمة     │
│  [قص شعر رجالي]"              │
│                                │
│  Auto-message from system:     │
│  "أهلاً! إيه اللي تحب تسأل   │
│   عنه بخصوص [قص شعر رجالي]    │
│   في [صالون الأناقة]؟"         │
│                                │
│  [User types message...]       │
│  [Merchant responds...]        │
│                                │
│  QUICK ACTIONS:                │
│  [احجز دلوقتي] [شوف المواعيد]  │
└───────────────────────────────┘
```

#### Chat Rules

| Rule | Specification |
|------|--------------|
| **Initiation** | Client-side only (clients start chats) |
| **Context** | Auto-attached: Service name, merchant name, user intent |
| **Merchant Response SLA** | Merchants see "متوسط وقت الرد: X دقيقة" as incentive |
| **Media** | Text + Images only (no voice notes in v1) |
| **Persistence** | Chat history saved for 90 days |
| **Abuse Protection** | Report button, spam detection, block option |
| **Conversion CTA** | "احجز دلوقتي" button pinned at bottom of chat |

**User Story:**
> *As a user, I want to ask a merchant a specific question about a service before booking so that I can make an informed decision.*

---

## 4. Gamification & Loyalty (Retention System)

### 4.1 The 'Booky Coins' Economy

> **Philosophy:** Every action in the app should feel rewarding. Booky Coins are a universal micro-currency that makes users feel like they're always "earning" — even when spending.

#### Earning Rules

| Action | Coins Earned | Conditions |
|--------|-------------|------------|
| **Complete a Booking** | 10 coins per 100 EGP spent | Minimum 10 coins per booking |
| **Leave a Text Review** | +10 bonus coins | Must be ≥ 20 characters |
| **Leave a Photo Review** | +50 bonus coins | Must include ≥ 1 photo |
| **Refer a Friend** | +100 coins | Friend completes first booking |
| **Daily Login Streak** | +5 coins/day | Resets if a day is missed |
| **First Booking in New Sector** | +25 bonus coins | One-time per sector |
| **Birthday Bonus** | +200 coins | Auto-credited on user's birthday |

#### Tier Multipliers

| User Tier | Multiplier | Example (100 EGP booking) |
|-----------|-----------|---------------------------|
| مستكشف (Free) | 1x | 10 coins |
| اللي فاهمها (Premium - 12 EGP/mo) | 2x | 20 coins |
| الباشا (VIP - 50 EGP/mo) | 5x | 50 coins |

#### Redemption Rules

| Coins | Discount Value | Rules |
|-------|---------------|-------|
| 100 coins | 10 EGP discount | Min booking value: 50 EGP |
| 500 coins | 50 EGP discount | Min booking value: 200 EGP |
| 1,000 coins | 100 EGP discount | Min booking value: 500 EGP |
| 2,500 coins | Free Service | Select partner merchants only |

| Constraint | Rule |
|-----------|------|
| **Max Discount** | 30% of booking value |
| **Expiry** | Coins expire after 12 months of inactivity |
| **Transfer** | Non-transferable between accounts |
| **Cash Out** | Not redeemable for cash |
| **Cross-Vertical** | ✅ Earn in Sports, redeem in Beauty — full cross-vertical |

### 4.2 User Ranks: The 'Pasha' System

> **Concept:** Inspired by gaming progression. Users feel a sense of status and achievement. Higher ranks unlock real, tangible benefits.

#### Rank Definitions

| Rank | Arabic Name | Badge | Requirements | Benefits |
|------|-------------|-------|-------------|----------|
| **Newbie** | مستكشف | 🔵 | 0-4 completed bookings | Basic app access |
| **Regular** | معتمد | 🟢 | 5-9 bookings + 1 review | Booking priority (skip waitlist) |
| **Pro** | اللي فاهمها | ⚫ | 10-19 bookings + 3 verified reviews | 2x coin multiplier, exclusive deals |
| **Pasha** | الباشا (VIP) | 👑 | 20+ bookings + 5 reviews + photo reviews | 5x multiplier, priority support, hidden offers, early event access |

#### Rank Progression Logic

```json
{
  "rank_calculation": {
    "bookings_completed": "integer (must be fulfilled, not cancelled)",
    "reviews_submitted": "integer (verified, non-spam)",
    "photo_reviews": "integer (reviews with ≥ 1 photo)",
    "account_age_days": "integer (minimum 30 days for 'Pro')",
    "no_show_count": "integer (> 2 no-shows blocks promotion for 90 days)"
  }
}
```

#### Rank Demotion Rules

| Trigger | Action |
|---------|--------|
| 3+ no-shows in 30 days | Demoted by one rank |
| 6 months of inactivity | Demoted to "مستكشف" |
| Abuse/fraud detected | Immediate demotion to "مستكشف" + account review |
| Rank restored | After 5 consecutive clean bookings |

**User Story:**
> *As a loyal user, I want to see my rank and progress so that I feel motivated to keep booking and reviewing.*

> *As a Pasha-rank user, I want to access exclusive deals and priority support so that I feel valued for my loyalty.*

### 4.3 Gamification UI Elements

| Element | Location | Purpose |
|---------|----------|---------|
| **Coin Balance** | Header + Profile | Always visible, feels like a wallet |
| **Rank Badge** | Profile + Reviews | Social status / flex |
| **Progress Bar** | Profile page | "3 حجوزات كمان وتوصل رتبة اللي فاهمها" |
| **Achievement Pop-up** | After booking completion | "🎉 مبروك! كسبت 50 كوين" |
| **Leaderboard** | Optional tab in profile | Top bookers in user's area (monthly) |

---

## 5. Checkout & Notifications (The Closing)

### 5.1 The 3-Step Booking Flow

> **Design Law:** Booking must complete in **3 taps maximum**: Select → Confirm → Pay.

```
STEP 1: SELECT
┌─────────────────────────────────┐
│  Service: قص شعر رجالي           │
│  Price: 80 ج.م                   │
│  Date: الخميس 12 فبراير          │
│  Time: 3:00 PM                   │
│  Merchant: صالون الأناقة          │
│                                   │
│         [أكّد الحجز →]             │
└─────────────────────────────────┘

STEP 2: CONFIRM & PAY
┌─────────────────────────────────┐
│  ملخص الحجز                      │
│  ───────────────                 │
│  الخدمة: قص شعر رجالي            │
│  التاريخ: 12/2/2026              │
│  الوقت: 3:00 PM                  │
│  المكان: شارع الجمهورية           │
│  الإجمالي: 80 ج.م                │
│  العربون: 20 ج.م (25%)           │
│                                   │
│  طريقة الدفع:                     │
│  ○ كاش عند الوصول                │
│  ○ فودافون كاش                   │
│  ○ بطاقة ائتمان                   │
│  ○ إنستا باي                      │
│                                   │
│  □ استخدام 50 كوين (خصم 5 ج.م)   │
│                                   │
│         [ادفع وأكّد →]             │
└─────────────────────────────────┘

STEP 3: CONFIRMATION
┌─────────────────────────────────┐
│                                   │
│        ✓ تم تأكيد الحجز!          │
│                                   │
│  (Green checkmark animation)      │
│                                   │
│  رقم الحجز: #BK-240212-0847     │
│                                   │
│  [إضافة للتقويم]                  │
│  [مشاركة على واتساب]              │
│  [الرجوع للرئيسية]                │
│                                   │
└─────────────────────────────────┘
```

### 5.2 Payment Methods

| Method | Availability | Deposit Support | Processing |
|--------|-------------|-----------------|------------|
| **Cash on Arrival** | All services (unless deposit required) | ❌ No | Instant confirmation |
| **Vodafone Cash** | All services | ✅ Yes | OTP confirmation → instant |
| **InstaPay** | All services | ✅ Yes | Bank-level confirmation |
| **Credit/Debit Card** | All services | ✅ Yes | 3D Secure → instant |
| **Booky Coins** | Partial payment only | ❌ No | Instant deduction |

#### Deposit Logic

| Service Category | Deposit % | When Required |
|------------------|-----------|---------------|
| Sports | 20% | Always for bookings > 200 EGP |
| Health & Beauty | 25% | For premium services |
| Entertainment | 30% | Always (high no-show vertical) |
| Home Services | 15% | For scheduled appointments |
| Professional | 25% | Always |
| Events | 50-100% | Always (high-ticket) |

**User Story:**
> *As a user, I want to pay a small deposit to secure my booking so that I'm guaranteed my time slot.*

> *As a user, I want to pay with Vodafone Cash because it's the most convenient mobile payment in Egypt.*

### 5.3 Notification System

#### Notification Channels

| Channel | Use Case | Priority |
|---------|----------|----------|
| **In-App Push** | All notifications | Primary |
| **WhatsApp Message** | Booking confirmation, reminders | Primary (Egypt's #1 messaging app) |
| **SMS** | OTP, critical alerts | Fallback |
| **Email** | Receipts, monthly summary | Low priority |

#### Notification Timeline

| Trigger | Channel | Message |
|---------|---------|---------|
| **Booking Confirmed** | In-App + WhatsApp | "✅ تم تأكيد حجزك في [Merchant] يوم [Date] الساعة [Time]. رقم الحجز: #BK-XXXXXX" |
| **24h Before** | Push + WhatsApp | "⏰ تذكير: عندك حجز بكرة الساعة [Time] في [Merchant]. [📍 الموقع على الخريطة]" |
| **2h Before** | Push | "🔔 حجزك بعد ساعتين! جاهز؟ [عرض التفاصيل]" |
| **Post-Service (1h After)** | Push | "⭐ إزاي كانت تجربتك في [Merchant]؟ [قيّم دلوقتي]" |
| **Review Reward** | Push | "🎉 مبروك! كسبت [X] كوين على تقييمك" |
| **Rank Up** | Push + In-App Animation | "🏆 مبروك! وصلت رتبة [Rank Name]! شوف المزايا الجديدة" |
| **Story from Followed** | Push | "🔥 [Merchant] عنده عرض جديد! باقي [X] ساعات" |
| **Coins Expiry Warning** | Push (30 days before) | "⚠️ عندك [X] كوين هتنتهي خلال 30 يوم. استخدمهم دلوقتي!" |

#### WhatsApp Confirmation Message Template

```
✅ تأكيد حجز Booky Center

مرحباً [User Name]! 👋

تفاصيل حجزك:
📋 الخدمة: [Service Name]
🏪 المكان: [Merchant Name]
📍 العنوان: [Address]
📅 التاريخ: [Date]
⏰ الوقت: [Time]
💰 الإجمالي: [Price] ج.م
🔑 رقم الحجز: #[Booking ID]

📍 الموقع على الخريطة:
[Google Maps Link]

لتعديل أو إلغاء الحجز:
[Deep Link to App]

شكراً لاستخدامك Booky Center! 🎉
```

### 5.4 Re-Booking (1-Click Repeat)

> **Goal:** A power user who books the same barber every 2 weeks should be able to repeat the exact same booking in 1 tap.

#### Implementation

| Property | Specification |
|----------|--------------|
| **Location** | "حجوزاتي" (My Bookings) tab → History section |
| **Button** | "احجز تاني" (Book Again) — displayed on every past booking card |
| **Action** | Pre-fills: Same merchant, same service, next available slot |
| **User Confirmation** | Only needs to confirm date/time → Pay → Done |
| **Smart Suggestion** | After 3+ identical bookings, system suggests: "عايز تحجز [Service] كل [X] أسبوع؟" → Recurring booking option |

**User Story:**
> *As a returning user, I want to re-book my regular barber appointment in 1 tap so that I don't waste time re-entering details.*

---

## 6. Data Models & API Contract Summary

### 6.1 Core Entities

```
┌──────────┐     ┌────────────┐     ┌──────────────┐
│  USER     │────>│  BOOKING    │<────│  MERCHANT    │
│           │     │             │     │              │
│ user_id   │     │ booking_id  │     │ merchant_id  │
│ phone     │     │ user_id     │     │ business_name│
│ name      │     │ merchant_id │     │ services[]   │
│ rank      │     │ service_id  │     │ calendar     │
│ coins     │     │ slot_time   │     │ location     │
│ location  │     │ status      │     │ rating       │
│ type      │     │ payment     │     │ subscription │
└──────────┘     └────────────┘     └──────────────┘
       │                                     │
       │         ┌────────────┐              │
       └────────>│  REVIEW     │<────────────┘
                 │             │
                 │ review_id   │
                 │ user_id     │
                 │ merchant_id │
                 │ rating      │
                 │ text        │
                 │ photos[]    │
                 └────────────┘
```

### 6.2 Key API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/otp/send` | POST | Send OTP to phone number |
| `/auth/otp/verify` | POST | Verify OTP and create session |
| `/auth/social` | POST | OAuth import (Google/Facebook) |
| `/users/me` | GET | Current user profile |
| `/users/me/location` | PUT | Update user location |
| `/feed` | GET | Social marketplace feed (paginated) |
| `/feed/stories` | GET | Active stories (24h) |
| `/search` | GET | NLP-powered service search |
| `/merchants/:id` | GET | Merchant mini-site profile |
| `/merchants/:id/calendar` | GET | Real-time availability |
| `/merchants/:id/reviews` | GET | Paginated reviews |
| `/merchants/:id/chat` | POST | Start inquiry chat |
| `/bookings` | POST | Create a new booking |
| `/bookings/:id` | GET | Booking details |
| `/bookings/:id/cancel` | POST | Cancel with deposit logic |
| `/bookings/history` | GET | User's past bookings |
| `/bookings/:id/rebook` | POST | Clone booking to new slot |
| `/payments/initiate` | POST | Start payment (VodaCash/Card/InstaPay) |
| `/payments/confirm` | POST | Confirm payment callback |
| `/loyalty/coins` | GET | User's coin balance + history |
| `/loyalty/redeem` | POST | Apply coins to booking |
| `/loyalty/rank` | GET | Current rank + progress |
| `/reviews` | POST | Submit a review |
| `/notifications/preferences` | PUT | Notification channel settings |

### 6.3 Booking Status State Machine

```
                    ┌──────────┐
                    │ PENDING   │ ← Created, awaiting payment
                    └─────┬────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │CONFIRMED │ │ EXPIRED  │ │CANCELLED │
        │(Paid)    │ │(No pay   │ │(By user) │
        └─────┬────┘ │ in 15min)│ └──────────┘
              │       └──────────┘
              │
    ┌─────────┼─────────┐
    ▼                    ▼
┌──────────┐      ┌──────────┐
│COMPLETED │      │ NO-SHOW  │
│(Service  │      │(User     │
│ delivered)│     │ absent)  │
└─────┬────┘      └─────┬────┘
      │                  │
      ▼                  ▼
┌──────────┐      ┌──────────────┐
│ REVIEWED │      │DEPOSIT       │
│(Optional)│      │FORFEITED     │
└──────────┘      └──────────────┘
```

#### Status Definitions

| Status | Description | Trigger |
|--------|-------------|---------|
| `pending` | Booking created, payment not yet received | User confirms booking |
| `confirmed` | Payment received (or cash booking confirmed) | Payment webhook success |
| `expired` | Payment not received within 15 minutes | System auto-expire |
| `cancelled_by_user` | User cancelled within allowed window | User action |
| `cancelled_by_merchant` | Merchant cancelled (full refund) | Merchant action |
| `completed` | Service was delivered | Merchant marks complete / auto after end time |
| `no_show` | User didn't show up | Merchant reports / system auto-detect |
| `reviewed` | User submitted a review | User action (optional) |

---

## 7. Edge Cases & Error Handling

### 7.1 Concurrent Booking Conflict

> **Scenario:** Two users try to book the same slot at the same time.

| Step | Action |
|------|--------|
| 1 | User A selects 3:00 PM slot → UI shows "selected" (optimistic) |
| 2 | User B selects 3:00 PM slot → UI shows "selected" (optimistic) |
| 3 | User A submits payment → Backend locks slot → **SUCCESS** |
| 4 | User B submits payment → Backend rejects → **"الموعد ده اتحجز خلاص. عايز تشوف أقرب وقت تاني؟"** |

**Solution:** Backend uses database-level row locking (`SELECT ... FOR UPDATE`) on the slot record. First payment to confirm wins.

### 7.2 Payment Failure Mid-Booking

| Scenario | Action |
|----------|--------|
| Card declined | Show: "البطاقة مرفوضة. جرب طريقة دفع تانية." + suggest VodaCash |
| VodaCash timeout | Hold slot for 5 minutes → retry prompt → release if no payment |
| Network error | Show: "في مشكلة في الاتصال. حجزك محفوظ لمدة 10 دقائق." |
| Partial payment | Not supported. Full amount or nothing. |

### 7.3 Merchant No-Show (Reverse)

> **Scenario:** The user shows up, but the merchant isn't ready / venue is closed.

| Step | Action |
|------|--------|
| 1 | User reports "المكان مقفول" via in-app button |
| 2 | System immediately offers: Full refund + 50 bonus coins |
| 3 | Merchant receives a strike (3 strikes = profile suspension) |
| 4 | User gets alternative suggestions: "خدمات مشابهة قريبة منك" |

### 7.4 Location Permission Denied

| Fallback | Implementation |
|----------|---------------|
| Level 1 | Show manual city/area dropdown (curated list) |
| Level 2 | Use IP-based approximate geolocation |
| Level 3 | Default to "المنصورة" during Pilot phase |

### 7.5 Offline / Poor Connectivity

| Feature | Offline Behavior |
|---------|-----------------|
| Feed | Show cached content with "آخر تحديث: X دقائق" banner |
| Search | Disabled with message: "محتاج إنترنت عشان تبحث" |
| Booking | Disabled — payments require live connection |
| Profile | Cached profile data viewable |
| Notifications | Queued and delivered when back online |

---

## Appendix: Key Business Metrics (KPIs)

| Metric | Target (Pilot Phase) | Measurement |
|--------|---------------------|-------------|
| **Auth Completion Rate** | ≥ 85% | (Completed signups / Started signups) |
| **Time to First Booking** | ≤ 3 minutes | (First booking time - Signup time) |
| **Feed Engagement Rate** | ≥ 40% | (Users who interact with feed / DAU) |
| **Story View Rate** | ≥ 60% | (Story views / Story impressions) |
| **Search-to-Book Conversion** | ≥ 15% | (Bookings / Search sessions) |
| **Review Submission Rate** | ≥ 25% | (Reviews / Completed bookings) |
| **Photo Review Rate** | ≥ 10% | (Photo reviews / All reviews) |
| **Re-Booking Rate** | ≥ 30% | (Re-bookings / Total bookings) |
| **Coin Redemption Rate** | ≥ 50% | (Coins redeemed / Coins earned) |
| **NPS Score** | ≥ 60 | Monthly survey |
| **No-Show Rate** | ≤ 5% | (No-shows / Confirmed bookings) |
| **Avg. Session Duration** | ≥ 4 minutes | In-app analytics |

---

> **Document Status:** ✅ Ready for Backend Implementation  
> **Next Steps:**
> 1. API team: Build endpoints per Section 6.2.
> 2. Frontend team: Implement Client Dashboard screens per Section 2.2.
> 3. ML team: Train Arabic NLP search model per Section 3.1.
> 4. QA team: Test edge cases per Section 7.
>
> **Related Documents:**
> - `BOOKY_CENTER_BUSINESS_MASTER.md` — Strategic foundation
> - `01_LANDING_PAGE_STRATEGY.md` — Pre-login UX
> - `US_CUSTOMER_BOOKING.md` — Detailed user stories (to be populated from this doc)
> - `DATABASE_SCHEMA_V1.md` — Schema implementation
> - `API_ENDPOINTS_OVERVIEW.md` — API contracts

