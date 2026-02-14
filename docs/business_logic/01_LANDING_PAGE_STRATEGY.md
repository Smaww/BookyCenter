# 01_LANDING_PAGE_STRATEGY

## Conversion Rate Optimization (CRO) Blueprint for the Booky Center Gateway

**Document Version:** 2.0
**Last Updated:** February 14, 2026
**Classification:** CRO Strategy, UI/UX Architecture & Funnel Logic
**Author:** Product Architecture & Growth Team
**Depends On:** [`BOOKY_CENTER_BUSINESS_MASTER.md`](../BOOKY_CENTER_BUSINESS_MASTER.md) (v6.0)
**Cross-References:** [`02_MERCHANT_ONBOARDING_FLOW.md`](02_MERCHANT_ONBOARDING_FLOW.md) (Merchant funnel exit), [`02_CLIENT_JOURNEY_LOGIC.md`](../02_CLIENT_JOURNEY_LOGIC.md) (Client funnel exit)

---

## Table of Contents

1. [CRO Philosophy & North Star](#1-cro-philosophy--north-star)
2. [Visual Identity & Design System](#2-visual-identity--design-system)
3. [The Hook (Hero Section) — Search Bar & One-Click Promise](#3-the-hook-hero-section--search-bar--one-click-promise)
4. [The Conversion Funnel (Top → Middle → Bottom)](#4-the-conversion-funnel-top--middle--bottom)
5. [The Service Galaxy (6 Sectors Showcase)](#5-the-service-galaxy-6-sectors-showcase)
6. [The Pain-Killer Section (Objection Crusher)](#6-the-pain-killer-section-objection-crusher)
7. [The Merchant Spotlight (B2B Conversion)](#7-the-merchant-spotlight-b2b-conversion)
8. [Trust Signals & Social Proof (Bottom of Funnel)](#8-trust-signals--social-proof-bottom-of-funnel)
9. [Frictionless Browsing & Delayed Auth](#9-frictionless-browsing--delayed-auth)
10. [Full Page Architecture (Scroll Sequence)](#10-full-page-architecture-scroll-sequence)
11. [A/B Testing Roadmap](#11-ab-testing-roadmap)
12. [Analytics & Event Tracking](#12-analytics--event-tracking)
13. [Technical Implementation Notes](#13-technical-implementation-notes)

---

## 1. CRO Philosophy & North Star

### The Single Metric That Matters

> **Landing Page North Star: Visitor → Sign-Up Conversion Rate ≥ 12%**
>
> Every section, every word, every pixel on this page exists to move an anonymous Visitor toward one of two outcomes:
> 1. **Client sign-up** (book a Service)
> 2. **Merchant sign-up** (list a business)

### The 5-Second Conversion Rule

```
┌──────────────────────────────────────────────────────────────┐
│                 THE 5-SECOND CONTRACT                         │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   SECOND 0-2:  "What is this?"                                │
│   → Headline answers: "Book anything in Egypt — one tap."     │
│                                                               │
│   SECOND 2-4:  "What can I do?"                               │
│   → Search bar invites: Type, tap, book.                      │
│                                                               │
│   SECOND 4-5:  "Am I a Client or a Merchant?"                 │
│   → Dual-path cards demand a choice.                          │
│                                                               │
│   AFTER 5 SECONDS WITHOUT ACTION:                             │
│   → Page auto-scrolls gently to Service Galaxy.               │
│   → 68% of visitors who scroll past the fold will convert.    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Conversion Targets (By Source)

| Traffic Source | Expected CVR | Primary CTA | Secondary CTA |
|---------------|-------------|-------------|---------------|
| Facebook Ads (Client) | 8-12% | Search bar → Booking | "احجز دلوقتي" (Book Now) |
| Facebook Ads (Merchant) | 5-8% | "كبر شغلك" → Onboarding | Merchant Spotlight scroll |
| TikTok Ads | 6-10% | Search bar → Booking | Service Galaxy tap |
| Google Search (Intent) | 15-22% | Search bar (pre-filled) | Direct Sector link |
| Organic / Referral | 10-15% | Dual-path hero | Browse → Convert |
| Instagram Stories | 5-9% | Deep-link to Sector | "احجز دلوقتي" |

---

## 2. Visual Identity & Design System

### The Power Palette

Booky Center's visual language is built on **psychological color theory** — each color serves a strategic conversion purpose.

| Color | Hex Code | Role | Psychological Impact |
|-------|----------|------|---------------------|
| **Pure White** | `#FFFFFF` | Backgrounds, Breathing space | Clarity, Trust, Openness |
| **Bold Black** | `#000000` | Typography, Authority elements | Power, Sophistication, Decisiveness |
| **Signal Red** | `#E63946` | CTAs, Action points, Urgency | Energy, Action, Conversion trigger |
| **Slate Grey** | `#6B7280` | Borders, Secondary text, Icons | Balance, Professionalism, Support |

### Design Language Principles

```
┌─────────────────────────────────────────────────────────────────────┐
│                     BOOKY CENTER DESIGN DNA                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   MINIMALIST     →   Every element earns its place                 │
│   BOLD           →   Typography commands attention                  │
│   HIGH-CONTRAST  →   White/Black/Red creates visual hierarchy      │
│   DECISIVE       →   Every pixel drives a decision                  │
│   RTL-FIRST      →   Arabic is primary; layout flows right-to-left │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Typography Hierarchy

| Level | Font | Weight | Size (Desktop) | Size (Mobile) | Color |
|-------|------|--------|----------------|---------------|-------|
| H1 (Hero) | Cairo | 900 Black | 72px | 40px | Bold Black |
| H2 (Section) | Cairo | 700 Bold | 48px | 32px | Bold Black |
| H3 (Card Title) | Cairo | 600 Semi-Bold | 24px | 20px | Bold Black |
| Body | Cairo | 400 Regular | 18px | 16px | Slate Grey |
| CTA Button | Cairo | 700 Bold | 18px | 16px | White on Red / Black |
| Caption | Cairo | 400 Regular | 14px | 12px | Slate Grey |

### Spacing System (8px Grid)

| Name | Value | Usage |
|------|-------|-------|
| `space-xs` | 8px | Icon padding, tight gaps |
| `space-sm` | 16px | Card padding, element gaps |
| `space-md` | 24px | Section padding (mobile) |
| `space-lg` | 48px | Section padding (desktop) |
| `space-xl` | 80px | Hero section breathing room |
| `space-xxl` | 120px | Major section separators |

### Dark Mode Color Mapping

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | White `#FFFFFF` | Near Black `#121212` |
| Primary Text | Bold Black `#000000` | White `#FFFFFF` |
| Secondary Text | Slate Grey `#6B7280` | Light Grey `#9CA3AF` |
| CTA (Signal Red) | `#E63946` | `#E63946` (unchanged) |
| Cards | White `#FFFFFF` | Dark Grey `#1E1E1E` |
| Borders | Slate Grey `#E5E7EB` | Dark Grey `#374151` |

---

## 3. The Hook (Hero Section) — Search Bar & One-Click Promise

### The Hero's Job

The Hero Section is **not a brochure** — it is a **Decision Engine**. It has exactly 3 jobs:

1. **Promise:** "Book anything in Egypt — one tap." (headline)
2. **Prove it:** A live search bar that instantly works. (action)
3. **Split:** Client path vs. Merchant path. (identity)

### Hero Layout — Desktop

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [LOGO: Booky Center]                          [دخول]  [حساب جديد]        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                                                                             │
│                      بضغطة واحدة.. ميعادك في جيبك                           │
│                                                                             │
│               احجز أي حاجة، في أي وقت، من أي مكان                          │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────┐       │
│   │  🔍  ابحث عن خدمة...  │  📍 المنصورة ▼  │  [ 🔴 ابحث دلوقتي ] │       │
│   └─────────────────────────────────────────────────────────────────┘       │
│                                                                             │
│               +١٥,٠٠٠ بيزنس موثوق  ·  +٥٠٠,٠٠٠ حجز/شهر                  │
│                                                                             │
│   ┌──────────────────────────┐    ┌──────────────────────────┐              │
│   │  👤 عميل بتدور على راحة؟ │    │  🏪 صاحب بيزنس؟          │              │
│   │                          │    │                          │              │
│   │  احجز أي خدمة            │    │  كبر شغلك وانضم لينا      │              │
│   │  في ٦٠ ثانية             │    │  مع +١٥ ألف تاجر         │              │
│   │                          │    │                          │              │
│   │  [ 🔴 احجز ميعادك ]      │    │  [ ⬛ سجل بيزنسك ]        │              │
│   └──────────────────────────┘    └──────────────────────────┘              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Hero Layout — Mobile

```
┌───────────────────────────┐
│  [☰]  [LOGO]    [دخول]   │
├───────────────────────────┤
│                           │
│  بضغطة واحدة..             │
│  ميعادك في جيبك            │
│                           │
│  احجز أي حاجة، في أي     │
│  وقت، من أي مكان           │
│                           │
│  ┌───────────────────┐    │
│  │ 🔍 ابحث عن خدمة.. │    │
│  └───────────────────┘    │
│  ┌───────────────────┐    │
│  │ 📍 المنصورة    ▼  │    │
│  └───────────────────┘    │
│  ┌───────────────────┐    │
│  │  🔴 ابحث دلوقتي   │    │
│  └───────────────────┘    │
│                           │
│  +١٥ ألف بيزنس موثوق     │
│                           │
│  ┌───────────────────┐    │
│  │ 👤 عميل؟           │    │
│  │ [ 🔴 احجز ميعادك ] │    │
│  └───────────────────┘    │
│  ┌───────────────────┐    │
│  │ 🏪 صاحب بيزنس؟    │    │
│  │ [ ⬛ سجل بيزنسك ]  │    │
│  └───────────────────┘    │
│                           │
└───────────────────────────┘
```

### 3.1 The Search Bar — "One-Click Promise" Engine

> **Design Law:** The search bar is the #1 conversion element on the page. It must be impossible to miss and effortless to use.

#### Search Bar Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                 THE SEARCH BAR (3 Components)                 │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   COMPONENT 1: Service Input                                  │
│   ┌──────────────────────────────────┐                        │
│   │  🔍  "ابحث عن خدمة..."           │                        │
│   │                                  │                        │
│   │  Auto-suggest after 2 characters │                        │
│   │  Shows: Service name + Sector    │                        │
│   │  icon + Merchant count           │                        │
│   │                                  │                        │
│   │  Example suggestions:            │                        │
│   │  ⚽ "ملعب" → ملاعب كرة (٢٣٤)    │                        │
│   │  ✂️ "حلا" → حلاقة رجالي (١٨٩)    │                        │
│   │  🔧 "سبا" → سباك (٤٥)           │                        │
│   └──────────────────────────────────┘                        │
│                                                               │
│   COMPONENT 2: Location Selector                              │
│   ┌──────────────────────────────────┐                        │
│   │  📍  "المنصورة"              ▼   │                        │
│   │                                  │                        │
│   │  Auto-detect via GPS             │                        │
│   │  Dropdown: Neighborhood-level    │                        │
│   │  Fallback: Governorate list      │                        │
│   │                                  │                        │
│   │  Values:                         │                        │
│   │  • Auto-detected neighborhood    │                        │
│   │  • Manual override dropdown      │                        │
│   │  • "كل المناطق" (All Areas)     │                        │
│   └──────────────────────────────────┘                        │
│                                                               │
│   COMPONENT 3: CTA Button                                     │
│   ┌──────────────────────────────────┐                        │
│   │  🔴  "ابحث دلوقتي"              │                        │
│   │                                  │                        │
│   │  Signal Red background           │                        │
│   │  White bold text                 │                        │
│   │  Hover: Darken 10%              │                        │
│   │  Click: Navigate to results      │                        │
│   └──────────────────────────────────┘                        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### Search Bar Behavior Rules

| Rule | Detail |
|------|--------|
| **Auto-focus** | On desktop, search input auto-focuses 1.5s after page load (after headline is read). |
| **Auto-suggest** | Triggers after 2 characters. Shows top 5 matches with Sector icons. |
| **Location Auto-detect** | GPS prompt on first visit. Falls back to IP-based city detection. |
| **No Login Required** | Search works fully for anonymous Visitors. |
| **Empty Search** | Submitting empty search shows Service Galaxy (browse all Sectors). |
| **UTM Pre-fill** | If Visitor arrives from ad with `?sector=sports`, search bar pre-fills "ملاعب ورياضة". |
| **Keyboard Submit** | Enter key triggers search. |
| **Voice Search** | Microphone icon (mobile). Arabic speech-to-text via Web Speech API. |

#### Search Bar → Results Flow

```
VISITOR TYPES "ملعب" IN SEARCH BAR
         │
         ▼
AUTO-SUGGEST DROPDOWN:
  ⚽ ملاعب كرة قدم (234 مكان)
  🏸 ملاعب بادل (67 مكان)
  🎾 ملاعب تنس (12 مكان)
         │
         ▼  Visitor selects "ملاعب كرة قدم"
RESULTS PAGE (No login required):
  → Filtered by location (المنصورة — حي الجامعة)
  → Sorted by: Nearest → Highest Rated → Available Now
  → Each result card: Photo, Name, Rating, Price, Next Slot
         │
         ▼  Visitor taps a Merchant card
MERCHANT PROFILE (No login required):
  → Full profile, photos, reviews, calendar, pricing
         │
         ▼  Visitor taps "احجز دلوقتي"
SLOT SELECTION (No login required):
  → Real-time calendar, available Slots
         │
         ▼  Visitor selects Slot → taps "أكد و ادفع"
🔐 AUTH MODAL TRIGGERS (Login required NOW):
  → Phone + OTP → Account created → Payment → Booking confirmed
```

#### Search Bar Conversion Logic

| Scenario | System Response |
|----------|----------------|
| Visitor searches, finds results | Direct to results page (highest intent path) |
| Visitor searches, no results found | Show: "مش لاقيين نتايج. جرب: [popular suggestions]" + Service Galaxy link |
| Visitor clicks search button without typing | Scroll to Service Galaxy (browse mode) |
| Visitor from Google ad for "padel mansoura" | Pre-fill: Service="بادل", Location="المنصورة" → auto-search on load |
| Visitor denies GPS | Show governorate dropdown. Default to "كل مصر" (All Egypt). |

### 3.2 Trust Badge (Below Search Bar)

```
+١٥,٠٠٠ بيزنس موثوق  ·  +٥٠٠,٠٠٠ حجز/شهر  ·  ⭐ ٤.٨ تقييم
```

| Element | Purpose | Format |
|---------|---------|--------|
| "+١٥,٠٠٠ بيزنس موثوق" | Scale proof | Animated counter on scroll-in |
| "+٥٠٠,٠٠٠ حجز/شهر" | Activity proof | Animated counter |
| "⭐ ٤.٨ تقييم" | Quality proof | Static with star icon |

> **A/B Test Opportunity:** Test badge placement — below search bar vs. above search bar vs. inside search bar area. See §11.

### 3.3 The "Client vs. Merchant" Split Cards

```
┌──────────────────────────────────────────────────────────────┐
│              IDENTITY DECISION CARDS                          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   CARD A: CLIENT (العميل)                                     │
│   ┌─────────────────────────────┐                             │
│   │  👤 عميل بتدور على راحة؟    │                             │
│   │                             │                             │
│   │  احجز أي خدمة في ٦٠ ثانية  │                             │
│   │                             │                             │
│   │  ✅ بدون مكالمات            │                             │
│   │  ✅ أسعار واضحة              │                             │
│   │  ✅ ميعادك مضمون             │                             │
│   │                             │                             │
│   │  [ 🔴 احجز ميعادك دلوقتي ] │  ← Signal Red, primary     │
│   └─────────────────────────────┘                             │
│                                                               │
│   CARD B: MERCHANT (التاجر)                                   │
│   ┌─────────────────────────────┐                             │
│   │  🏪 صاحب بيزنس؟             │                             │
│   │                             │                             │
│   │  كبر شغلك مع +١٥ ألف تاجر  │                             │
│   │                             │                             │
│   │  ✅ عملاء جداد كل يوم        │                             │
│   │  ✅ حماية من عدم الحضور       │                             │
│   │  ✅ لوحة تحكم ذكية           │                             │
│   │                             │                             │
│   │  [ ⬛ سجل بيزنسك مجاناً ]   │  ← Black outline, secondary│
│   └─────────────────────────────┘                             │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### Card Click Logic

| Card Clicked | Action | Destination |
|-------------|--------|-------------|
| **Client Card** ("احجز ميعادك") | Smooth scroll + highlight | Service Galaxy section (explore & book) |
| **Merchant Card** ("سجل بيزنسك") | Smooth scroll + highlight | Merchant Spotlight section (value prop → onboarding) |
| **Neither** (5s timeout) | Gentle nudge animation | Cards pulse once with subtle glow |

#### Button Specifications

| Button | Background | Text | Border | Hover State | Tap Area |
|--------|------------|------|--------|-------------|----------|
| Client CTA | Signal Red `#E63946` | White, Bold | None | Darken 10% | Min 48×48px |
| Merchant CTA | White `#FFFFFF` | Black, Bold | 2px Black | Fill Black, Text White | Min 48×48px |

---

## 4. The Conversion Funnel (Top → Middle → Bottom)

### Full Funnel Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   THE BOOKY CENTER FUNNEL                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   ╔══════════════════════════════════════════════════════╗    │
│   ║                TOP OF FUNNEL (TOFU)                  ║    │
│   ║              "Awareness → Interest"                  ║    │
│   ║                                                      ║    │
│   ║   Traffic Sources:                                   ║    │
│   ║   • Facebook/Instagram Ads (51.6M / 21.7M users)    ║    │
│   ║   • TikTok Ads (48.8M users)                        ║    │
│   ║   • Google Search (intent-based)                     ║    │
│   ║   • Referrals (Booky Coins incentive)                ║    │
│   ║   • Organic/SEO (blog, Merchant profiles)            ║    │
│   ║                                                      ║    │
│   ║   Landing Point: HERO SECTION                        ║    │
│   ║   Goal: Comprehend value + Use search bar            ║    │
│   ║   Drop-off target: < 40%                             ║    │
│   ╚══════════════════════════════════════════════════════╝    │
│                         │                                     │
│                         ▼                                     │
│   ╔══════════════════════════════════════════════════════╗    │
│   ║              MIDDLE OF FUNNEL (MOFU)                 ║    │
│   ║            "Consideration → Decision"                ║    │
│   ║                                                      ║    │
│   ║   Decision Point: CLIENT vs. MERCHANT                ║    │
│   ║                                                      ║    │
│   ║   CLIENT PATH:                                       ║    │
│   ║   Hero → Service Galaxy → Merchant Profile →         ║    │
│   ║   Slot Selection → Checkout (Auth trigger)           ║    │
│   ║                                                      ║    │
│   ║   MERCHANT PATH:                                     ║    │
│   ║   Hero → Merchant Spotlight → No-Show Stats →        ║    │
│   ║   ROI Calculator → "Start Free" (Onboarding)        ║    │
│   ║                                                      ║    │
│   ║   TRUST ACCELERATORS (both paths):                   ║    │
│   ║   • Service Galaxy (see what's available)            ║    │
│   ║   • Pain-Killer (problems we solve)                  ║    │
│   ║   • Social Proof (stats + testimonials)              ║    │
│   ║                                                      ║    │
│   ║   Drop-off target: < 25%                             ║    │
│   ╚══════════════════════════════════════════════════════╝    │
│                         │                                     │
│                         ▼                                     │
│   ╔══════════════════════════════════════════════════════╗    │
│   ║              BOTTOM OF FUNNEL (BOFU)                 ║    │
│   ║              "Action → Conversion"                   ║    │
│   ║                                                      ║    │
│   ║   CLIENT CONVERSION:                                 ║    │
│   ║   Auth Modal → Phone + OTP → Pay Deposit → Booked   ║    │
│   ║                                                      ║    │
│   ║   MERCHANT CONVERSION:                               ║    │
│   ║   Onboarding → Profile → Trial Mode → First Booking ║    │
│   ║                                                      ║    │
│   ║   TRUST SIGNALS AT CONVERSION POINT:                 ║    │
│   ║   • "١٥,٠٠٠+ بيزنس موثوق"                          ║    │
│   ║   • "٥٠٠,٠٠٠+ حجز اتعمل"                           ║    │
│   ║   • Client testimonial near CTA                      ║    │
│   ║   • "بياناتك محمية ومشفرة"                           ║    │
│   ║   • Payment method logos (VF Cash, InstaPay, Visa)   ║    │
│   ║                                                      ║    │
│   ║   Conversion target: ≥ 12% of page visitors          ║    │
│   ╚══════════════════════════════════════════════════════╝    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### 4.1 Top of Funnel — Traffic Source Strategy

#### Paid Traffic Playbook

| Channel | Budget % | Targeting | Ad Format | Landing Behavior |
|---------|----------|-----------|-----------|-----------------|
| **Facebook** | 35% | 18-35, Egyptian cities, interests: sports/beauty/events | Carousel (6 Sectors) + Video | UTM → Hero with Sector pre-fill |
| **TikTok** | 30% | 18-28, Egyptian, trending sounds | 15s vertical video | Deep-link → Service Galaxy |
| **Instagram** | 20% | 22-40, lifestyle interests | Stories + Reels | Swipe-up → Hero + search focus |
| **Google** | 10% | "حجز ملعب المنصورة", "أفضل صالون" | Search + Display | UTM → Results page (bypass Hero) |
| **Referral** | 5% | Existing Clients (100 Coins incentive) | Shareable link | Referral code auto-applied |

#### SEO Strategy

| Content Type | Target Keywords | Page |
|-------------|----------------|------|
| Merchant Profiles | "{service} في {city}" (e.g., "صالون حلاقة في المنصورة") | Merchant public profile |
| Sector Landing Pages | "احجز {sector}" (e.g., "احجز ملعب كورة") | Sector browse page |
| Blog / Guides | "أفضل {service} في مصر" | Content hub |
| FAQ Schema | "إزاي احجز في بوكي سنتر" | Landing page structured data |

#### UTM-Driven Personalization

```
VISITOR ARRIVES WITH:
  ?utm_source=facebook
  &utm_campaign=sports_mansoura
  &utm_content=padel_ad
  &sector=sports

LANDING PAGE ADAPTS:
  → Search bar pre-fills: "بادل" + "المنصورة"
  → Service Galaxy highlights Sports Sector
  → Trust badge shows: "+٢٣٤ ملعب في المنصورة"
  → Testimonial swaps to Sports Client review
```

### 4.2 Middle of Funnel — The "Client vs. Merchant" Split

#### Decision Logic (How the Page Helps Visitors Choose)

```
VISITOR IDENTITY SIGNALS:
─────────────────────────

Signal 1: UTM source
  • utm_campaign contains "merchant" or "business" → Highlight Merchant card
  • utm_campaign contains "booking" or sector name → Highlight Client card

Signal 2: Search behavior
  • Types a service name → Client path (search results)
  • Scrolls past hero to Merchant Spotlight → Merchant path

Signal 3: Referral source
  • Shared by existing Client → Client card pre-selected
  • Shared by existing Merchant → Merchant card highlighted

Signal 4: Return visitor
  • Cookie detected from previous Client browse → Skip hero, show Galaxy
  • Cookie detected from previous Merchant browse → Skip hero, show Spotlight

DEFAULT (no signal): Show both cards equally weighted.
```

#### Client Mid-Funnel Journey

```
CLIENT CLICKS "احجز ميعادك" OR uses Search Bar
         │
         ▼
SERVICE GALAXY (Browse 6 Sectors)
  → Visual grid, tappable, no login needed
  → Dynamic tags: "شائع دلوقتي", "جديد", "عرض موسمي"
         │
         ▼
SECTOR BROWSE PAGE (e.g., Sports)
  → Filtered Merchants, sorted by relevance
  → Each card: Photo, Name, Rating, Price range, Distance
         │
         ▼
MERCHANT PROFILE (Full mini-site)
  → Gallery, Services, Calendar, Reviews, Location map
  → CTA: "احجز دلوقتي" (Book Now)
         │
         ▼
SLOT SELECTION
  → Real-time calendar, available times
  → Price + Deposit shown clearly
         │
         ▼
BOOKING SUMMARY
  → "أكد و ادفع العربون" (Confirm & Pay Deposit)
  → 🔐 AUTH MODAL TRIGGERS HERE (first time login required)
```

#### Merchant Mid-Funnel Journey

```
MERCHANT CLICKS "سجل بيزنسك" OR scrolls to Spotlight
         │
         ▼
MERCHANT SPOTLIGHT SECTION
  → Market size: ₤86.8 Billion TAM
  → No-show problem: ₤2.5B annual loss → Booky solution: < 5%
  → "كل ما تحتاجه في لوحة تحكم واحدة"
         │
         ▼
ROI CALCULATOR (Interactive)
  → "كام حجز بتاخد في الشهر؟" [slider: 10-500]
  → "متوسط سعر الخدمة؟" [slider: 50-5000 EGP]
  → Output: "ممكن تكسب +X EGP/شهر مع بوكي"
         │
         ▼
PRICING PREVIEW
  → 3 Merchant tiers: Start (Free) / Pro (120 EGP) / Pasha (450 EGP)
  → "ابدأ مجاناً — بدون بطاقة ائتمان"
         │
         ▼
"ابدأ فترة التجربة" CTA
  → Navigates to Merchant Onboarding Flow (02_MERCHANT_ONBOARDING_FLOW.md)
```

### 4.3 Bottom of Funnel — Trust Signals at Conversion Point

> **Rule:** Every CTA that asks for money or personal data MUST be surrounded by trust signals.

#### Trust Signal Placement Matrix

| CTA | Trust Signals Shown | Position |
|-----|---------------------|----------|
| Auth Modal (Phone input) | "بياناتك محمية ومشفرة بالكامل 🔒" | Below phone field |
| Payment Screen (Deposit) | VF Cash + InstaPay + Visa logos + "SSL Secured" | Above payment buttons |
| Booking Confirmation | "+500,000 حجز ناجح" + "ضمان الميعاد" | In success screen |
| Merchant "Start Free" | "بدون بطاقة ائتمان" + "التسجيل في دقيقتين" | Below CTA button |

#### Social Proof Micro-Triggers

| Trigger | Display | Frequency |
|---------|---------|-----------|
| Recent Booking | "🟢 أحمد من المنصورة حجز ملعب — من ٣ دقائق" | Every 30s, bottom-left toast |
| New Merchant | "🟢 صالون الأمير انضم لبوكي — من ساعة" | Every 60s, alternating |
| Live Stats | "👥 ١٢٣ شخص بيتصفحوا دلوقتي" | Persistent on busy hours |

> **A/B Test:** Test social proof toasts ON vs. OFF. Some audiences find them pushy. See §11.

---

## 5. The Service Galaxy (6 Sectors Showcase)

### Purpose

The Service Galaxy transforms abstract Sectors into **visual, tappable destinations** — creating desire through organized simplicity. It is the primary exploration entry point for the Client path.

### Galaxy Layout (Desktop: 3×2 Grid)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    اكتشف خدمات بوكي سنتر                                   │
│              ─────────────────────────────────────                          │
│                   بتدور على إيه النهارده؟                                   │
│                                                                             │
│     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                      │
│     │   ⚽ RED    │  │   ✂️ RED     │  │   🎮 RED    │                      │
│     │             │  │             │  │             │                      │
│     │  ملاعب      │  │  صحة وجمال   │  │  خروجات     │                      │
│     │  ورياضة     │  │             │  │  وترفيه     │                      │
│     │             │  │             │  │             │                      │
│     │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │                      │
│     │ │شائع دلوقتي│ │  │ │شائع دلوقتي│ │  │ │شائع دلوقتي│ │                      │
│     │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │                      │
│     │             │  │             │  │             │                      │
│     │  كرة قدم    │  │  حلاقة      │  │  كيدز اريا  │                      │
│     │  بادل      │  │  صالونات    │  │  مطاعم      │                      │
│     │  جيم       │  │  سبا        │  │  إسكيب روم  │                      │
│     │             │  │             │  │             │                      │
│     └─────────────┘  └─────────────┘  └─────────────┘                      │
│                                                                             │
│     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                      │
│     │   🔧 RED    │  │   🎓 RED    │  │   🎁 RED    │                      │
│     │             │  │             │  │             │                      │
│     │  خدمات      │  │  تعليم      │  │  مناسبات    │                      │
│     │  منزلية     │  │  ومساحات عمل │  │  وأفراح     │                      │
│     │             │  │             │  │             │                      │
│     │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │                      │
│     │ │ رائج    │ │  │ │  جديد!  │ │  │ │ موسمي   │ │                      │
│     │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │                      │
│     │             │  │             │  │             │                      │
│     │  سباك      │  │  دروس       │  │  قاعات      │                      │
│     │  كهربائي   │  │  كوورك      │  │  أفراح      │                      │
│     │  تنظيف     │  │  تصوير      │  │  كاترينج    │                      │
│     │             │  │             │  │             │                      │
│     └─────────────┘  └─────────────┘  └─────────────┘                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Sector Card Specifications

| Element | Specification |
|---------|---------------|
| Card Size | 320×400px (Desktop) / 100% width (Mobile) |
| Icon | 48px, Signal Red color |
| Sector Name (Arabic) | Cairo Bold Black, 24px, centered |
| Tag | Signal Red pill, White text, 12px |
| Sub-Service List | Slate Grey, 16px, 3 items max |
| Hover State | Subtle lift (4px shadow), Border turns Signal Red |
| Click Action | Navigate to Sector browse page (no login) |

### Dynamic Tags — Data-Driven

| Data Signal | Tag Displayed (Arabic) | Logic |
|-------------|------------------------|-------|
| High Bookings in last 24h | "شائع دلوقتي" (Popular Now) | Volume-based |
| Growing week-over-week | "رائج" (Trending) | Growth-based |
| Recently added Services | "جديد!" (New!) | Freshness-based |
| Calendar-relevant (Eid, Summer) | "موسمي" (Seasonal) | Time-based |
| High demand in Visitor's area | "ساخن في [المنطقة]" (Hot in Area) | Geo-based |

---

## 6. The Pain-Killer Section (Objection Crusher)

### Purpose

Visually demonstrate how Booky Center eliminates the 9 problems Egyptian Clients and Merchants face daily. This section converts skeptics who think "I can just use Facebook."

### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    حياتك قبل بوكي  ←→  حياتك مع بوكي                       │
│              ─────────────────────────────────────                          │
│                                                                             │
│   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐│
│   │  🔍 RED   │  │  📞 RED   │  │  💰 RED   │  │  ⭐ RED   │  │  📍 RED   ││
│   │           │  │           │  │           │  │           │  │           ││
│   │  بتدور    │  │  بتتصل    │  │  السعر     │  │  مش      │  │  مش       ││
│   │  ساعة     │  │  ومحدش    │  │  مش       │  │  واثق    │  │  لاقي     ││
│   │  على حاجة │  │  بيرد     │  │  واضح     │  │  في      │  │  حد       ││
│   │           │  │           │  │           │  │  التقييم  │  │  قريب     ││
│   │  ───────  │  │  ───────  │  │  ───────  │  │  ───────  │  │  ───────  ││
│   │           │  │           │  │           │  │           │  │           ││
│   │  بحث واحد │  │  حجز فوري │  │  أسعار    │  │  تقييمات │  │  نتايج   ││
│   │  بيوصلك   │  │  بدون     │  │  واضحة    │  │  موثقة   │  │  حسب     ││
│   │           │  │  مكالمات  │  │  للكل     │  │  من عملاء │  │  موقعك   ││
│   └───────────┘  └───────────┘  └───────────┘  └───────────┘  └───────────┘│
│                                                                             │
│   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐              │
│   │  ❌ RED   │  │  📅 RED   │  │  🎁 RED   │  │  💳 RED   │              │
│   │           │  │           │  │           │  │           │              │
│   │  رحت     │  │  الميعاد  │  │  مفيش     │  │  كاش     │              │
│   │  ولقيته   │  │  بقى      │  │  مكافآت   │  │  بس      │              │
│   │  مقفول   │  │  محجوز    │  │  على      │  │  ومفيش   │              │
│   │           │  │  لغيرك    │  │  الولاء   │  │  فيزا    │              │
│   │  ───────  │  │  ───────  │  │  ───────  │  │  ───────  │              │
│   │           │  │           │  │           │  │           │              │
│   │  عربون    │  │  تقويم    │  │  كوينز    │  │  ادفع    │              │
│   │  يحميك   │  │  ذكي     │  │  بوكي     │  │  بأي     │              │
│   │  ويحميه   │  │  بلا      │  │  على كل   │  │  طريقة   │              │
│   │           │  │  تعارض    │  │  حجز      │  │          │              │
│   └───────────┘  └───────────┘  └───────────┘  └───────────┘              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Pain-Killer Card Data

| # | Problem (Arabic) | Solution (Arabic) | Icon | Conversion Role |
|---|------------------|-------------------|------|-----------------|
| 1 | بتدور ساعة على حاجة | بحث واحد بيوصلك | 🔍 | Validates search bar |
| 2 | بتتصل ومحدش بيرد | حجز فوري بدون مكالمات | 📞 | Validates booking flow |
| 3 | السعر مش واضح | أسعار واضحة للكل | 💰 | Builds price trust |
| 4 | مش واثق في التقييم | تقييمات موثقة من عملاء | ⭐ | Validates review system |
| 5 | مش لاقي حد قريب | نتايج حسب موقعك | 📍 | Validates hyper-local |
| 6 | رحت ولقيته مقفول | عربون يحميك ويحميه | ❌ | Introduces Deposit system |
| 7 | الميعاد بقى محجوز لغيرك | تقويم ذكي بلا تعارض | 📅 | Validates real-time calendar |
| 8 | مفيش مكافآت على الولاء | كوينز بوكي على كل حجز | 🎁 | Introduces Booky Coins |
| 9 | كاش بس ومفيش فيزا | ادفع بأي طريقة | 💳 | Validates payment flexibility |

---

## 7. The Merchant Spotlight (B2B Conversion)

### Purpose

Convert business owners by showing the **market opportunity**, the **No-Show protection**, and a **personalized ROI calculator**.

### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    كبر شغلك مع بوكي سنتر                                   │
│              ─────────────────────────────────────                          │
│                  انضم لـ +١٥,٠٠٠ تاجر في مصر                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   📊 السوق بيكبر بسرعة — وإنت لازم تكون فيه                        │   │
│  │                                                                     │   │
│  │   ₤86.8 مليار ────→ حجم السوق في مصر                                │   │
│  │   22.5% ──────────→ معدل نمو سنوي                                    │   │
│  │   78% ────────────→ المصريين عندهم سمارت فون                         │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌───────────────────────────┐    ┌───────────────────────────┐            │
│  │                           │    │                           │            │
│  │   ❌ المشكلة               │    │   ✅ الحل مع بوكي         │            │
│  │                           │    │                           │            │
│  │   ٣٠٪ من العملاء مش      │    │   عربون رقمي عن طريق      │            │
│  │   بيحضروا.               │    │   فودافون كاش / إنستا باي  │            │
│  │                           │    │                           │            │
│  │   ده بيكلف الشغل في      │    │   لو العميل محضرش،         │            │
│  │   مصر ₤2.5 مليار         │    │   العربون من حقك.          │            │
│  │   كل سنة.                │    │                           │            │
│  │                           │    │   نسبة عدم الحضور: < ٥٪   │            │
│  └───────────────────────────┘    └───────────────────────────┘            │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │   🧮 حاسبة الأرباح — "كام ممكن تكسب مع بوكي؟"                      │   │
│  │                                                                     │   │
│  │   كام حجز بتاخد في الشهر؟     [ ─────●───── ]  80 حجز              │   │
│  │   متوسط سعر الخدمة؟            [ ─────●───── ]  150 ج.م             │   │
│  │                                                                     │   │
│  │   💰 إيرادك الشهري المتوقع: ١٢,٠٠٠ ج.م                             │   │
│  │   🚀 +٣٠٪ عملاء جداد من بوكي: +٣,٦٠٠ ج.م                          │   │
│  │   🛡️ حماية من عدم الحضور: وفّر ~٣,٠٠٠ ج.م/شهر                     │   │
│  │   ─────────────────────                                             │   │
│  │   ✅ إجمالي القيمة المضافة: +٦,٦٠٠ ج.م/شهر                         │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                      ┌─────────────────────────────┐                        │
│                      │                             │                        │
│                      │  🔴 ابدأ فترة التجربة       │                        │
│                      │     مجاناً — بدون بطاقة     │                        │
│                      │                             │                        │
│                      └─────────────────────────────┘                        │
│                                                                             │
│               📚 المصدر: Research and Markets, October 2025                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### ROI Calculator Logic

```python
def calculate_merchant_roi(monthly_bookings, avg_price):
    """
    Shown on landing page — Merchant Spotlight section.
    Uses conservative estimates to build trust (not over-promise).
    """
    current_revenue = monthly_bookings * avg_price
    new_clients_pct = 0.30  # Conservative: 30% new Clients from Booky
    new_revenue = current_revenue * new_clients_pct
    no_show_savings = current_revenue * 0.25  # 25% of revenue protected
    total_added_value = new_revenue + no_show_savings

    return {
        "current_revenue": current_revenue,
        "new_clients_revenue": new_revenue,
        "no_show_savings": no_show_savings,
        "total_value_added": total_added_value,
        "monthly_cost": 0,  # Start tier is free
    }
```

---

## 8. Trust Signals & Social Proof (Bottom of Funnel)

### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    الأرقام بتتكلم                                           │
│              ─────────────────────                                          │
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │             │    │             │    │             │    │             │  │
│  │   98.2M     │    │   15,000+   │    │   500K+     │    │   4.8 ⭐    │  │
│  │             │    │             │    │             │    │             │  │
│  │  مستخدم     │    │   تاجر      │    │   حجز       │    │   تقييم     │  │
│  │  إنترنت     │    │   شريك      │    │   شهرياً    │    │   متوسط     │  │
│  │  في مصر     │    │             │    │             │    │             │  │
│  │             │    │             │    │             │    │             │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│                                                                             │
│  ── آراء العملاء والتجار ──                                                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   "أخيراً بقدر أحجز ملعب من غير ما أعمل ٢٠ مكالمة.                │   │
│  │    بوكي سنتر غيّر اللعبة."                                        │   │
│  │                                                                     │   │
│  │    — أحمد م.، المنصورة (عميل — ملاعب ورياضة) ⭐⭐⭐⭐⭐             │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   "نسبة عدم الحضور نزلت من ٣٥٪ لـ ٣٪. نظام العربون                │   │
│  │    أنقذ شغلي."                                                     │   │
│  │                                                                     │   │
│  │    — سارة ك.، صاحبة صالون (تاجر — صحة وجمال) ⭐⭐⭐⭐⭐              │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   "كنت بقضي نص اليوم بارد على رسايل الفيسبوك. دلوقتي              │   │
│  │    الحجوزات بتيجي أوتوماتيك."                                     │   │
│  │                                                                     │   │
│  │    — محمد ع.، صاحب ملعب (تاجر — ملاعب ورياضة) ⭐⭐⭐⭐⭐             │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ── شركاء الدفع الموثوقين ──                                              │
│                                                                             │
│  [ Vodafone Cash ]  [ InstaPay ]  [ Visa ]  [ Mastercard ]  [ Meeza ]     │
│                                                                             │
│            🔒 بياناتك محمية ومشفرة بالكامل — SSL Encrypted                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Stats Counter Animation

| Stat | Final Value | Animation | Trigger |
|------|------------|-----------|---------|
| Internet Users | 98.2M | Count from 0 → 98.2M (1.5s) | Viewport entry |
| Merchants | 15,000+ | Count from 0 → 15,000 (1.2s) | Viewport entry |
| Monthly Bookings | 500,000+ | Count from 0 → 500,000 (1.8s) | Viewport entry |
| Rating | 4.8 ⭐ | Fade-in with star fill animation | Viewport entry |

### Testimonial Rotation Logic

| Source | Display Rule | Matching |
|--------|-------------|----------|
| Ad UTM = sports | Show Sports Client testimonial first | Sector-matched |
| Ad UTM = merchant | Show Merchant testimonial first | Role-matched |
| Geo = Mansoura | Show Mansoura testimonials | Location-matched |
| Default | Rotate every 5 seconds | Random order |

### Payment Trust Badges

Display recognizable payment logos at the bottom of the Social Proof section. These are critical for Egyptian users who are skeptical about online payments.

| Badge | Logo | Purpose |
|-------|------|---------|
| Vodafone Cash | Official VF Cash logo | Egypt's #1 mobile wallet (28M+ users) |
| InstaPay | Official InstaPay logo | National instant bank transfer |
| Visa / Mastercard | Card network logos | International card trust |
| Meeza | Official Meeza logo | Egypt's national debit card |
| SSL Encrypted | Lock icon + text | Data security assurance |

---

## 9. Frictionless Browsing & Delayed Auth

### The Core Rule

> **Visitors can browse ALL Sectors, search, view Merchant profiles, and check availability WITHOUT creating an account. Login is triggered ONLY at "Confirm & Pay".**

| Action | Login Required? | Rationale |
|--------|-----------------|-----------|
| View landing page | ❌ No | Reduce friction |
| Use search bar | ❌ No | Let them discover value |
| Browse Service Galaxy | ❌ No | Encourage exploration |
| View Sector results | ❌ No | Build intent |
| View Merchant profile | ❌ No | Build trust |
| Check Slot availability | ❌ No | Create commitment |
| Read reviews | ❌ No | Build confidence |
| Add to favorites | ⚠️ Soft prompt | Engagement signal |
| **Confirm Booking + Pay Deposit** | ✅ **Required** | Transaction needs identity |

### Auth Modal (Triggered at Conversion Point)

```
┌─────────────────────────────────────────┐
│                                         │
│     عشان تحجز، سجل في ثانية             │
│                                         │
│   📱  رقم الموبايل                       │
│   [ +20  │  1XX XXXX XXXX            ]  │
│                                         │
│   [ 🔴 ابعت كود التفعيل ]               │
│                                         │
│   ─── أو ───                            │
│                                         │
│   [ 🔵 متابعة بـ Facebook ]             │
│   [ 🟢 متابعة بـ Google ]               │
│                                         │
│   عندك حساب؟ [ سجل دخول ]              │
│                                         │
│   🔒 بياناتك محمية ومشفرة بالكامل       │
│                                         │
└─────────────────────────────────────────┘
```

> **Key:** Social login (Facebook/Google) is for **profile enrichment only** (import name + photo). Phone + OTP remains the primary authentication method. See Master §4.2.

---

## 10. Full Page Architecture (Scroll Sequence)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SECTION 1: HERO (100vh — full viewport)                                    │
│  ─────────────────                                                          │
│  • Headline: "بضغطة واحدة.. ميعادك في جيبك"                                │
│  • Search Bar (Service + Location + CTA)                                    │
│  • Trust Badge (stats)                                                      │
│  • Dual Cards: Client vs. Merchant                                          │
│  • Conversion: Search → Results OR Card click → Scroll                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  SECTION 2: SERVICE GALAXY (auto height)                                    │
│  ────────────────────────────────                                           │
│  • 6 Sector cards in 3×2 grid (desktop) / 1-column (mobile)                │
│  • Dynamic tags from real-time data                                         │
│  • Each card → Sector browse page (no login)                                │
│  • Conversion: Sector tap → Browse → Merchant → Book                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  SECTION 3: PAIN-KILLER (auto height)                                       │
│  ─────────────────────────                                                  │
│  • 9 problem/solution cards (5+4 layout)                                    │
│  • Objection handling for skeptics                                          │
│  • Conversion: Builds confidence → Scroll to book                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  SECTION 4: MERCHANT SPOTLIGHT (auto height)                                │
│  ────────────────────────────────────                                       │
│  • Market size + No-Show stats                                              │
│  • Interactive ROI Calculator                                               │
│  • "ابدأ فترة التجربة مجاناً" CTA                                          │
│  • Conversion: Calculator → Onboarding                                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  SECTION 5: TRUST & SOCIAL PROOF (auto height)                              │
│  ────────────────────────────────────────                                   │
│  • Animated stats counters                                                  │
│  • Rotating testimonials (Client + Merchant)                                │
│  • Payment trust badges                                                     │
│  • Conversion: Trust confirmation → Return to Hero / Search                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  SECTION 6: PRICING PREVIEW (auto height)                                   │
│  ─────────────────────────────                                              │
│  • Client tiers: Free / Premium (12 EGP) / VIP (50 EGP)                    │
│  • OR Merchant tiers: Start (Free) / Pro (120 EGP) / Pasha (450 EGP)       │
│  • Contextual: Shows Client tiers by default, Merchant if from B2B path     │
│  • Conversion: Tier selection → Sign up                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  SECTION 7: FOOTER                                                          │
│  ─────────────────                                                          │
│  • Navigation: للعملاء / للتجار / عن بوكي / الدعم                           │
│  • Social links: Facebook / Instagram / TikTok                              │
│  • Legal: شروط الاستخدام · سياسة الخصوصية                                   │
│  • 🌙 Dark Mode toggle                                                      │
│  • © 2026 Booky Center                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Sticky Elements

| Element | Behavior | Platform |
|---------|----------|----------|
| **Header (Navbar)** | Sticky on scroll, shrinks from 80px → 56px | Desktop + Mobile |
| **Search Bar** | Collapses into header on scroll (compact mode) | Desktop |
| **Mobile CTA** | Floating "احجز دلوقتي" button, bottom-right | Mobile only |
| **Back to Top** | Arrow appears after 50% scroll | Both |

---

## 11. A/B Testing Roadmap

### Priority 1 — High-Impact Tests (Launch Sprint)

| Test ID | Element | Variant A (Control) | Variant B | Hypothesis | KPI |
|---------|---------|---------------------|-----------|------------|-----|
| **AB-01** | **Hero Headline** | "بضغطة واحدة.. ميعادك في جيبك" | "احجز أي حاجة في مصر — ثانية واحدة" | Direct benefit > poetic slogan | Click-through on search bar |
| **AB-02** | **CTA Button Color** | Signal Red `#E63946` | Bold Green `#22C55E` | Green = "go" in Egyptian culture | CTA click rate |
| **AB-03** | **Hero Image** | No image (text-only hero) | Background: happy Egyptian using phone | Emotional connection increases CVR | Time on hero section |
| **AB-04** | **Search Bar Position** | Below headline (current) | Inside the headline area (overlapping) | Closer to eye-scan = more usage | Search initiation rate |
| **AB-05** | **Trust Badge Position** | Below search bar | Above search bar | Authority before action | Search submission rate |

### Priority 2 — Funnel Optimization Tests

| Test ID | Element | Variant A | Variant B | KPI |
|---------|---------|-----------|-----------|-----|
| **AB-06** | **Social Proof Toasts** | ON (real-time "أحمد حجز من ٣ دقائق") | OFF | Conversion rate + bounce rate |
| **AB-07** | **Service Galaxy Order** | Fixed (Sports first) | Personalized (based on UTM/geo) | Sector click-through |
| **AB-08** | **Pain-Killer Section** | 9 cards (all problems) | Top 5 only (less scroll) | Scroll depth + conversion |
| **AB-09** | **Merchant ROI Calculator** | Interactive (sliders) | Static (pre-calculated example) | Merchant sign-up rate |
| **AB-10** | **Auth Trigger Point** | At "Confirm & Pay" (current) | At "Select Slot" (earlier) | Conversion rate vs. drop-off |

### Priority 3 — Micro-Optimizations

| Test ID | Element | Variant A | Variant B | KPI |
|---------|---------|-----------|-----------|-----|
| **AB-11** | **Dual Cards Layout** | Side-by-side (current) | Client card only (A/B by traffic source) | Client CVR |
| **AB-12** | **Testimonial Format** | Text only | Text + Client photo + video | Trust score (survey) |
| **AB-13** | **Dark Mode Default** | Light (current) | Auto-detect system preference | Engagement time |
| **AB-14** | **Mobile CTA Text** | "احجز دلوقتي" | "ابحث دلوقتي" (search-focused) | CTA tap rate |
| **AB-15** | **Number Format** | Arabic numerals (١٥,٠٠٠) | Western numerals (15,000) | Readability score |

### Testing Framework

```
TEST LIFECYCLE:
─────────────────
1. HYPOTHESIS → Define clear expected outcome
2. SEGMENT   → Split: 50/50 or 80/20 (for risky changes)
3. DURATION  → Minimum 14 days OR 1,000 conversions per variant
4. MEASURE   → Primary KPI + secondary metrics
5. DECIDE    → Statistical significance ≥ 95% → ship winner
6. DOCUMENT  → Log results in test registry for future reference
```

### Testing Tools

| Tool | Purpose | Integration |
|------|---------|-------------|
| **PostHog** | A/B testing + analytics | Self-hosted, privacy-first |
| **Google Optimize** (sunset alternative: VWO) | Visual A/B editor | Tag Manager |
| **Hotjar** | Heatmaps, session recordings, surveys | Script injection |
| **Mixpanel** | Funnel analysis, retention | Event-based |

---

## 12. Analytics & Event Tracking

### Event Schema

| Event Name | Trigger | Properties | Funnel Stage |
|------------|---------|------------|-------------|
| `page_view` | Page load | `source`, `utm_*`, `device`, `geo` | TOFU |
| `hero_view` | Hero section enters viewport | `time_on_page` | TOFU |
| `search_focus` | Client clicks/taps search bar | `is_autofocused` | TOFU |
| `search_submit` | Search executed | `query`, `location`, `results_count` | TOFU → MOFU |
| `search_suggest_click` | Auto-suggest item tapped | `suggestion_text`, `position` | TOFU → MOFU |
| `identity_click_client` | Client card clicked | `source` | MOFU |
| `identity_click_merchant` | Merchant card clicked | `source` | MOFU |
| `galaxy_sector_click` | Sector card tapped | `sector_id`, `tag_shown` | MOFU |
| `merchant_profile_view` | Merchant profile opened | `merchant_id`, `sector_id` | MOFU |
| `slot_selected` | Slot chosen on calendar | `merchant_id`, `slot_time`, `price` | MOFU → BOFU |
| `auth_modal_trigger` | Auth modal appears | `trigger_point` | BOFU |
| `auth_otp_sent` | OTP requested | `method` (SMS/WhatsApp) | BOFU |
| `auth_complete` | Account created | `account_type`, `auth_method` | BOFU |
| `payment_initiated` | Payment method selected | `method`, `amount` | BOFU |
| `booking_confirmed` | Booking successful | `booking_id`, `sector_id`, `value` | CONVERSION |
| `merchant_signup_start` | Merchant onboarding begins | `source`, `utm_*` | BOFU (B2B) |
| `merchant_trial_activated` | Trial mode active | `merchant_id`, `sector_id` | CONVERSION (B2B) |
| `roi_calculator_used` | Merchant uses ROI tool | `bookings_input`, `price_input` | MOFU (B2B) |
| `scroll_depth` | Scroll milestones | `depth_pct` (25/50/75/100) | All |
| `dark_mode_toggle` | Theme switched | `new_theme` | UX |
| `social_proof_toast_view` | Toast notification seen | `toast_type`, `content` | MOFU |

### Funnel Dashboard (Key Views)

```
MACRO FUNNEL:
─────────────
Page Views → Search Initiated → Results Viewed → Merchant Viewed →
Slot Selected → Auth Triggered → Auth Completed → Payment → Booking ✅

Target: 100% → 65% → 50% → 35% → 25% → 20% → 18% → 15% → 12%

MERCHANT FUNNEL:
────────────────
Page Views → Spotlight Scrolled → ROI Calculator Used →
"Start Free" Clicked → Onboarding Started → Trial Activated ✅

Target: 100% → 40% → 20% → 12% → 10% → 8%
```

---

## 13. Technical Implementation Notes

### Performance Requirements

| Metric | Target | Rationale |
|--------|--------|-----------|
| First Contentful Paint (FCP) | < 1.5s | Hero must load instantly |
| Largest Contentful Paint (LCP) | < 2.5s | Search bar must be interactive fast |
| Cumulative Layout Shift (CLS) | < 0.1 | No jarring element shifts |
| Time to Interactive (TTI) | < 3.5s | Search bar + CTAs must work fast |
| First Input Delay (FID) | < 100ms | Instant response to search typing |

### Responsive Breakpoints

| Breakpoint | Width | Layout Adjustments |
|------------|-------|-------------------|
| Desktop XL | ≥1280px | 2-column hero cards, 3×2 Galaxy grid, side-by-side pain-killers |
| Desktop | 1024-1279px | 2-column hero cards, 3×2 Galaxy grid |
| Tablet | 768-1023px | Stacked hero cards, 2×3 Galaxy grid |
| Mobile | <768px | Full-width stacked, 1-column Galaxy, floating CTA |

### Accessibility Requirements (WCAG AA)

| Requirement | Implementation |
|-------------|----------------|
| Color Contrast | All text meets 4.5:1 ratio minimum |
| Keyboard Navigation | All interactive elements focusable via Tab |
| Screen Reader | ARIA labels on buttons, search bar, cards |
| Touch Targets | Minimum 48×48px on mobile |
| Alt Text | All images have descriptive Arabic alt text |
| RTL Support | Full `dir="rtl"` with `lang="ar"` |
| Focus Indicators | Visible focus ring on all interactive elements |

### SEO — Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Booky Center",
  "alternateName": "بوكي سنتر",
  "description": "احجز أي خدمة في مصر بضغطة واحدة",
  "url": "https://booky.center",
  "applicationCategory": "BookingApplication",
  "operatingSystem": "Web",
  "availableLanguage": ["ar", "en"],
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EGP"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "50000"
  }
}
```

---

## Quick Reference: Landing Page Conversion Checklist

| Section | Must Have | CRO Purpose | Status |
|---------|-----------|-------------|--------|
| **Hero** | Headline + Search Bar + Trust Badge + Dual Cards | Comprehension + Action in 5s | ⬜ |
| **Search Bar** | Service input + Location selector + Submit CTA | "One-Click Promise" — primary conversion element | ⬜ |
| **Service Galaxy** | 6 Sector cards, dynamic tags, no-login browse | Intent building + Sector discovery | ⬜ |
| **Pain-Killer** | 9 problem/solution cards | Objection handling | ⬜ |
| **Merchant Spotlight** | Market stats + No-Show solution + ROI Calculator + CTA | B2B conversion | ⬜ |
| **Social Proof** | Stats counters + Testimonials + Payment badges | Trust at conversion point | ⬜ |
| **Pricing Preview** | Client tiers OR Merchant tiers (contextual) | Value anchoring before sign-up | ⬜ |
| **Footer** | Navigation + Social + Legal + Dark Mode | Completeness | ⬜ |

---

> **📌 This document follows the Project Dictionary defined in [`BOOKY_CENTER_BUSINESS_MASTER.md`](../BOOKY_CENTER_BUSINESS_MASTER.md) §2. All terms (Client, Merchant, Service, Sector, Booking, Slot, Deposit, Inquiry, Booky Coins) are used as canonically defined. Terminology: "Client" (not Customer), "Merchant" (not Provider), "Sector" (not Category).**

---

**END OF DOCUMENT**
