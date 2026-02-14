# 📘 Booky Center: Business Architecture Master

## *The Single Source of Truth — Project Bible*

### Slogan: بضغطة واحدة.. ميعادك في جيبك | Your Life, One Tap

**Version:** 6.0 | **Date:** February 14, 2026
**Classification:** Master Reference Document — All teams MUST align to this file.
**Author:** Product & Business Architecture Team

---

## Table of Contents

1. [Project Vision (The "Why")](#1-project-vision-the-why)
2. [The Project Dictionary (Unified Terminology)](#2-the-project-dictionary-unified-terminology)
3. [Documentation Index (The Map)](#3-documentation-index-the-map)
4. [Global Rules & Conventions](#4-global-rules--conventions)
5. [The Six Sectors (Product Verticals)](#5-the-six-sectors-product-verticals)
6. [Subscription Model (Client-Side)](#6-subscription-model-client-side)
7. [Subscription Model (Merchant-Side)](#7-subscription-model-merchant-side)
8. [The Rank System (Gamification)](#8-the-rank-system-gamification)
9. [Booky Coins Economy (Loyalty)](#9-booky-coins-economy-loyalty)
10. [Revenue & Commission Model](#10-revenue--commission-model)
11. [No-Show Protection (Deposit System)](#11-no-show-protection-deposit-system)
12. [Egyptian Identity & Localization](#12-egyptian-identity--localization)
13. [Market Intelligence & Competitive Edge](#13-market-intelligence--competitive-edge)
14. [The Mansoura Pilot Strategy](#14-the-mansoura-pilot-strategy)
15. [Key Metrics & Targets](#15-key-metrics--targets)
16. [Glossary of Business Acronyms](#16-glossary-of-business-acronyms)

---

## 1. Project Vision (The "Why")

### Mission

**Empowering Egypt's fragmented micro-service economy with Uber-like technology** — giving every barber, every football pitch, every plumber a digital storefront, and giving every Egyptian a single button to book them all.

### Core Value Equation

| For the Client (العميل) | For the Merchant (التاجر) |
|--------------------------|----------------------------|
| **Simplicity** — Find, book, and pay any service in under 60 seconds. | **Growth** — Get discovered by thousands, protect revenue, and scale with data. |

### The "Magic Button" Concept

Booky Center is **Egypt's first All-in-One Booking Super App**. We consolidate six fragmented service verticals into a single, seamless digital experience.

| The Problem Today | The Booky Center Solution |
|-------------------|---------------------------|
| Search Facebook for 30 minutes | Everything organized in one app |
| Send 10 DMs asking "price?" | All prices displayed upfront |
| Call and no one answers | See available times instantly |
| Show up and it's double-booked | Your slot is guaranteed |
| Cash only, no receipts | Pay by card, wallet, or cash |
| No way to trust reviews | Only verified Clients can review |

### The Transformation

| Traditional Journey | Magic Button Journey |
|---------------------|----------------------|
| 7+ steps to book a single service | 3 taps maximum |
| 15-30 minutes average booking time | Under 60 seconds |
| 4+ apps/platforms needed | 1 unified platform |
| No price transparency | Real-time pricing & availability |
| Zero booking confirmation | Instant digital confirmation |

> **"Booky Center puts Egypt's entire service economy at your fingertips — book anything, anywhere, anytime with one tap."**

---

## 2. The Project Dictionary (Unified Terminology)

> **⚠️ MANDATORY:** Every document, user story, API contract, database column, UI label, and code comment in the Booky Center project **MUST** use the terms defined below. No synonyms. No exceptions.

### 2.1 Core Entities

| # | Official Term (EN) | Official Term (AR) | Definition | ❌ NEVER Use |
|---|--------------------|--------------------|------------|--------------|
| 1 | **Client** | **العميل** | The end-user who searches for and books services on the platform. This is the demand side of the marketplace. | ~~Customer~~, ~~User~~, ~~Consumer~~, ~~Buyer~~ |
| 2 | **Merchant** | **التاجر** | The service provider who lists their business, manages availability, and fulfills bookings. This is the supply side of the marketplace. | ~~Vendor~~, ~~Provider~~, ~~Partner~~, ~~Seller~~, ~~Business Owner~~ |
| 3 | **Service** | **الخدمة** | A specific bookable item offered by a Merchant (e.g., "Haircut", "Football Pitch 1hr", "Plumbing Visit"). Has a price, duration, and optional deposit. | ~~Product~~, ~~Offering~~, ~~Item~~ |
| 4 | **Sector** | **القطاع** | One of the 6 top-level service categories that organize the marketplace (e.g., Sports, Beauty). Every Merchant belongs to exactly one Sector. | ~~Category~~, ~~Vertical~~, ~~Pillar~~, ~~Industry~~ |
| 5 | **Booking** | **الحجز** | The core transactional unit — a confirmed reservation linking a Client to a Merchant's Service at a specific time slot. | ~~Reservation~~, ~~Appointment~~, ~~Order~~ |
| 6 | **Booky Coins** | **عملة بوكي** | The universal loyalty micro-currency. Earned on bookings, redeemable across all Sectors. Non-transferable, non-cashable. | ~~Points~~, ~~Credits~~, ~~Rewards~~, ~~Tokens~~ |

### 2.2 System Entities

| # | Official Term (EN) | Official Term (AR) | Definition | ❌ NEVER Use |
|---|--------------------|--------------------|------------|--------------|
| 7 | **Slot** | **الموعد المتاح** | A specific time window on a Merchant's calendar that can be booked. | ~~Time~~, ~~Appointment~~, ~~Window~~ |
| 8 | **Deposit** | **العربون** | A partial upfront payment required to confirm a Booking (protects Merchants from no-shows). | ~~Prepayment~~, ~~Down Payment~~, ~~Advance~~ |
| 9 | **Subscription Tier** | **باقة الاشتراك** | The Client's paid plan level (Free / Premium / VIP). Controls coin multipliers and feature access. | ~~Plan~~, ~~Package~~, ~~Membership~~ |
| 10 | **Rank** | **الرتبة** | The Client's earned loyalty level (Newbie / Regular / Pro / Pasha). Based on completed Bookings and Reviews. Separate from Subscription. | ~~Level~~, ~~Tier~~ (when referring to Rank), ~~Grade~~ |
| 11 | **Merchant Dashboard** | **لوحة تحكم التاجر** | The SaaS panel Merchants use to manage services, calendar, bookings, analytics, and payouts. | ~~Admin Panel~~, ~~Backend~~, ~~Portal~~ |
| 12 | **Feed** | **المجتمع** | The social marketplace timeline on the Client Home Screen showing reviews, merchant updates, and system highlights. | ~~Timeline~~, ~~Stream~~, ~~Wall~~ |
| 13 | **Story** | **العرض السريع** | A 24-hour expiring flash offer posted by a Merchant, displayed in the circular Stories bar. | ~~Offer~~, ~~Flash~~, ~~Deal~~ (when referring to the UI component) |
| 14 | **Inquiry** | **الاستفسار** | A private, context-aware chat session between a Client and a Merchant before booking. | ~~Chat~~, ~~Message~~, ~~DM~~ |

### 2.3 Naming Conventions in Code

| Context | Convention | Example |
|---------|-----------|---------|
| **Database columns** | `snake_case` | `client_id`, `merchant_id`, `booking_status` |
| **TypeScript interfaces** | `PascalCase` | `ClientProfile`, `MerchantProfile`, `BookingStatus` |
| **API endpoints** | `kebab-case` nouns | `/clients/me`, `/merchants/:id`, `/bookings` |
| **React components** | `PascalCase` | `ClientHome`, `MerchantDashboard`, `FeedCard` |
| **Enum values** | `UPPER_SNAKE_CASE` | `HEALTH_BEAUTY`, `CANCELLED_BY_CLIENT` |

> **Key Migration Note:** The codebase currently uses `user` and `userId` in some places. These MUST be migrated to `client` / `clientId` during the next refactor sprint. API paths like `/users/me` become `/clients/me`.

---

## 3. Documentation Index (The Map)

> All documentation lives under `docs/`. This index provides the reading order and the purpose of every file.

### Phase 1: Strategy & Business Logic

| # | File | Purpose | Status |
|---|------|---------|--------|
| 1.1 | [`business_logic/01_LANDING_PAGE_STRATEGY.md`](business_logic/01_LANDING_PAGE_STRATEGY.md) | Pre-login gateway: visual identity, hero section, Service Galaxy, 5-second conversion rule, pain-killer section, merchant spotlight, social proof, footer. The Visitor → Client / Merchant funnel. | ✅ Complete |
| 1.2 | [`business_logic/02_CLIENT_JOURNEY_LOGIC.md`](business_logic/02_CLIENT_JOURNEY_LOGIC.md) | Post-login Client experience: Smart Auth (OTP), Social Feed (Stories + Community), Discovery & Booking Engine (NLP search, Merchant profiles, real-time calendar), Gamification (Coins + Ranks), Checkout (3-step flow), Notifications, Data Models, Edge Cases. | ✅ Complete |
| 1.3 | [`business_logic/03_MERCHANT_ONBOARDING_FLOW.md`](business_logic/03_MERCHANT_ONBOARDING_FLOW.md) | Merchant registration, identity verification, profile setup wizard, service catalog creation, calendar configuration, and activation rules. Two tracks: Digital Immigrants (offline → online) and Growth Seekers (social → platform). | 🔴 To Be Written |
| 1.4 | [`business_logic/04_SUBSCRIPTION_LOYALTY_MATH.md`](business_logic/04_SUBSCRIPTION_LOYALTY_MATH.md) | Unified mathematical model for Booky Coins: earning rates (per-booking formula), tier multipliers (1x/2x/5x), redemption tiers, expiry rules, Rank progression thresholds, and subscription billing cycles (upgrade/downgrade/cancellation). | 🔴 To Be Written |
| 1.5 | [`business_logic/05_PAYMENT_PAYOUT_GATEWAYS.md`](business_logic/05_PAYMENT_PAYOUT_GATEWAYS.md) | Payment integration rules: Vodafone Cash, InstaPay, Credit/Debit Card flows. Deposit collection, refund processing, cancellation penalties, Merchant payout schedules, platform fee deduction, and reconciliation logic. | 🔴 To Be Written |

### Phase 2: User Stories

| # | File | Purpose | Status |
|---|------|---------|--------|
| 2.1 | [`user_stories/US_VISITOR_LANDING.md`](user_stories/US_VISITOR_LANDING.md) | Stories for first-time Visitors: identity selection (Client vs Merchant), value proposition comprehension, conversion triggers, frictionless browsing (no login until payment). | 🔴 To Be Written |
| 2.2 | [`user_stories/US_CLIENT_BOOKING.md`](user_stories/US_CLIENT_BOOKING.md) | Stories for the Client booking journey: search, filter, view Merchant profile, select Slot, confirm & pay Deposit, receive confirmation, re-book, cancel. | 🔴 To Be Written |
| 2.3 | [`user_stories/US_MERCHANT_DASHBOARD.md`](user_stories/US_MERCHANT_DASHBOARD.md) | Stories for Merchant-side operations: manage Slots, view earnings, update profile, handle Booking requests, respond to Inquiries, view analytics. | 🔴 To Be Written |
| 2.4 | [`user_stories/US_LOYALTY_REDEMPTION.md`](user_stories/US_LOYALTY_REDEMPTION.md) | Stories for the loyalty system: earning Booky Coins, checking balance, redeeming across Sectors, Rank progression, Subscription Tier upgrades. | 🔴 To Be Written |

### Phase 3: Technical Specifications

| # | File | Purpose | Status |
|---|------|---------|--------|
| 3.1 | [`technical_specs/DATABASE_SCHEMA_V1.md`](technical_specs/DATABASE_SCHEMA_V1.md) | Relational database design: table definitions (clients, merchants, services, bookings, payments, reviews, coins_ledger, notifications), relationships, constraints, indexes. | 🔴 To Be Written |
| 3.2 | [`technical_specs/API_ENDPOINTS_OVERVIEW.md`](technical_specs/API_ENDPOINTS_OVERVIEW.md) | Full REST API contract: endpoint paths, HTTP methods, request/response schemas, authentication headers, error codes, pagination, rate limiting. | 🔴 To Be Written |

### Phase 4: Architecture (Future)

| # | File | Purpose | Status |
|---|------|---------|--------|
| 4.1 | `architecture/SYSTEM_ARCHITECTURE.md` | High-level system diagram, technology stack, infrastructure, deployment strategy. | 🔴 Planned |
| 4.2 | `architecture/SECURITY_MODEL.md` | Authentication flows, authorization rules, data encryption, GDPR-equivalent compliance. | 🔴 Planned |

---

## 4. Global Rules & Conventions

> These rules apply to every document, every API, every UI screen, and every line of code.

### 4.1 Core Constants

| Rule | Value | Rationale |
|------|-------|-----------|
| **Currency** | EGP (Egyptian Pound, ج.م) | Egyptian market. All monetary values stored as integers (no floats). |
| **Timezone** | Africa/Cairo (EET, UTC+2) | Egypt Standard Time. No DST since 2014. All timestamps stored as UTC, displayed as EET. |
| **Primary Language (UI)** | Arabic (Egyptian Dialect, عامية مصرية) | Target audience. RTL layout. Cairo font family. |
| **Secondary Language (UI)** | English | For brand elements, technical labels, and bilingual Merchants. |
| **Documentation Language** | English | All internal docs, code comments, commit messages, and PR descriptions in English. |
| **Code Language** | English | All variable names, function names, database columns, and API endpoints in English. |
| **Phone Format** | E.164: `+201XXXXXXXXX` | Egyptian mobile: `+20 1[0125] XXX XXXX`. Primary authentication credential. |
| **ID Format** | UUID v4 | All entity primary keys. |
| **Timestamp Format** | ISO 8601 (UTC) | `"2026-02-14T15:00:00Z"` — converted to EET on display. |
| **Booking ID Format** | `BK-YYMMDD-XXXX` | Human-readable reference. `BK-260214-0847`. |

### 4.2 Authentication Rules

| Rule | Value |
|------|-------|
| **Primary Auth** | Phone number + 4-digit OTP (SMS). No passwords. Ever. |
| **OTP Expiry** | 120 seconds |
| **OTP Resend Cooldown** | 60 seconds |
| **Max OTP Attempts** | 3 per session, then 15-minute cooldown |
| **Max OTPs per Phone/Hour** | 5 |
| **OTP Fallback** | WhatsApp OTP if SMS fails after 30 seconds |
| **Social Login** | Google and Facebook for **profile enrichment only** (name + photo import). NOT for authentication. |
| **Account Types** | `client` or `merchant`. Set once at registration. Cannot be changed without support intervention. |

### 4.3 UI/UX Design Principles

| Principle | Rule |
|-----------|------|
| **Direction** | RTL (Right-to-Left) for all screens. |
| **Font** | Cairo (Google Fonts) — professional Arabic typeface. |
| **Color Palette** | Pure White `#FFFFFF`, Bold Black `#000000`, Signal Red `#E63946`, Slate Grey `#6B7280`. |
| **Spacing** | 8px grid system. |
| **Mobile-First** | Design for mobile, scale up to desktop. Breakpoints: <768 / 768-1023 / 1024-1279 / ≥1280. |
| **Browsing Without Login** | Visitors can browse all Sectors, search, view Merchant profiles, and check availability WITHOUT creating an account. Login is triggered ONLY at "Confirm & Pay". |
| **3-Tap Booking Rule** | Select → Confirm/Pay → Done. Maximum 3 taps from Merchant profile to confirmed Booking. |

---

## 5. The Six Sectors (Product Verticals)

> Every Merchant and every Service belongs to exactly ONE Sector. These are the canonical names used everywhere.

| # | Sector ID | English Name | Arabic Name (Official) | Icon | Strategic Role | Launch Target |
|---|-----------|--------------|------------------------|------|----------------|---------------|
| 1 | `sports` | **Sports & Fitness** | **ملاعب ورياضة** | Trophy | 🪝 **The Hook** — High frequency, viral loops, user acquisition engine | 500+ Merchants |
| 2 | `health_beauty` | **Health & Beauty** | **صحة وجمال** | Scissors | 🔁 **Retention Engine** — Recurring appointments, highest LTV | 2,000+ Merchants |
| 3 | `entertainment` | **Entertainment** | **خروجات وترفيه** | Gamepad | 📣 **Viral Engine** — Group bookings, social sharing, FOMO | 300+ Merchants |
| 4 | `home_services` | **Home Services** | **خدمات منزلية** | Wrench | 🔧 **Problem Solver** — Urgency-driven, trust-critical | 5,000+ Merchants |
| 5 | `education` | **Education & Work** | **تعليم ومساحات عمل** | GraduationCap | ⚙️ **Utility Play** — B2B crossover, professional recurring | 3,000+ Merchants |
| 6 | `events` | **Events & Celebrations** | **مناسبات وأفراح** | Gift | 💎 **High-Ticket Play** — Revenue maximizer, seasonal spikes | 500+ Merchants |

### Sector Sub-Services (Examples)

| Sector | Sub-Services |
|--------|-------------|
| Sports & Fitness | Football Pitches, Padel Courts, Gyms, Swimming, Tennis, Martial Arts |
| Health & Beauty | Barbers, Salons, Spas, Dermatology, Dental, Mental Health |
| Entertainment | Kids Play Areas, Restaurants, Escape Rooms, Bowling, VR, Karting |
| Home Services | Cleaning, Plumbing, Electrical, AC, Painting, Pest Control |
| Education & Work | Tutoring, Coworking, Photography, Legal, IT Support, Translation |
| Events & Celebrations | Venues, Concerts, Photography, Catering, Corporate Events, Camps |

### Strategic Flow

```
ACQUISITION ──────────► RETENTION ──────────► EXPANSION

   Sports                Health & Beauty         Home Services
   (Hook)                (Retention)             (Problem Solver)
     │                       │                       │
     ▼                       ▼                       ▼
 Entertainment           Education & Work          Events
   (Viral)               (Utility)                (High-Ticket)
```

---

## 6. Subscription Model (Client-Side)

> These are the plans a **Client** can subscribe to. Separate from Merchant subscriptions (§7) and Ranks (§8).

| Feature | 🆓 **Free** (مجاناً) | ⭐ **Premium** (12 EGP/mo) | 👑 **VIP** (50 EGP/mo) |
|---------|----------------------|----------------------------|-------------------------|
| Arabic Name | باقة المستكشف | باقة بريميوم | باقة VIP |
| Instant Booking | ✅ | ✅ | ✅ |
| Smart Reminders | ✅ | ✅ | ✅ |
| Booky Coins Multiplier | 1x | 2x | 5x |
| Booking Priority | ❌ | ✅ Skip waitlist | ✅ Skip waitlist + Early access |
| Flexible Cancellation | Standard policy | Extended window | Maximum flexibility |
| AI Concierge | ❌ | ❌ | ✅ Personal booking assistant |
| Exclusive Discounts | ❌ | Selected Merchants | All Merchants (up to 20% off) |
| Early Event Access | ❌ | ❌ | ✅ Book events 48h before public |
| Priority Support | Standard | Faster response | Dedicated line |

### Subscription Value Breakdown

| Tier | Monthly Cost | Avg. Client Savings | Net Value |
|------|-------------|---------------------|-----------|
| Free | 0 EGP | Convenience only | Positive |
| Premium | 12 EGP | ~50 EGP (2x coins + priority) | +38 EGP/month |
| VIP | 50 EGP | ~150 EGP (5x coins + discounts) | +100 EGP/month |

> **⚠️ CRITICAL NAMING NOTE:** The Client Subscription Tier names (Free / Premium / VIP) are **intentionally different** from the Rank names (Newbie / Regular / Pro / Pasha) to avoid confusion. A Client can be a *Free* subscriber with a *Pasha* rank, or a *VIP* subscriber with a *Newbie* rank. These are independent systems.

---

## 7. Subscription Model (Merchant-Side)

> These are the SaaS plans a **Merchant** pays for dashboard access. Completely separate from Client subscriptions.

| Feature | **Starter** (99 EGP/mo) | **Growth** (249 EGP/mo) | **Pro** (499 EGP/mo) |
|---------|--------------------------|--------------------------|----------------------|
| Business Profile | ✅ Basic | ✅ Full | ✅ Full + Featured |
| Calendar Management | ✅ | ✅ | ✅ |
| Monthly Booking Limit | 50 | Unlimited | Unlimited |
| Analytics Dashboard | ❌ | ✅ | ✅ Advanced |
| Marketing Tools | ❌ | ❌ | ✅ |
| Featured Listing | ❌ | ❌ | ✅ (7 days/month) |
| Priority Support | Standard | Faster | Dedicated |
| Stories (Flash Offers) | 1/day | 2/day | 3/day |

### Additional Merchant Services (One-Time)

| Service | Fee |
|---------|-----|
| Professional Profile Creation | 150 EGP |
| Photo Shoot (5-10 photos) | 200 EGP |
| Video Content (30-sec promo) | 350 EGP |
| Featured Listing (extra 7 days) | 100 EGP |

---

## 8. The Rank System (Gamification)

> Ranks are **earned through behavior** (Bookings + Reviews). They are independent of Subscription Tier. A Free-tier Client who books often will outrank a VIP subscriber who doesn't.

| Rank | Arabic Name | Badge | Requirements | Benefits Unlocked |
|------|-------------|-------|-------------|-------------------|
| **Newbie** | مبتدئ | 🔵 | 0-4 completed Bookings | Basic app access |
| **Regular** | معتمد | 🟢 | 5-9 Bookings + 1 review | Booking priority (skip waitlist) |
| **Pro** | محترف | ⚫ | 10-19 Bookings + 3 verified reviews + account age ≥ 30 days | Exclusive Merchant deals |
| **Pasha** | الباشا | 👑 | 20+ Bookings + 5 reviews (including photo reviews) | Priority support, hidden offers, early event access |

### Rank Progression Rules

| Rule | Detail |
|------|--------|
| **Counting** | Only completed Bookings count (not cancelled or no-show). |
| **Reviews** | Must be verified (from completed Bookings) and non-spam (≥ 20 characters). |
| **Demotion: No-Shows** | 3+ no-shows in 30 days → demoted by one Rank. |
| **Demotion: Inactivity** | 6 months of inactivity → demoted to Newbie. |
| **Demotion: Abuse** | Fraud detected → immediate demotion to Newbie + account review. |
| **Rank Restoration** | After 5 consecutive clean Bookings. |

> **⚠️ NAMING NOTE:** The old documents used "مستكشف" and "اللي فاهمها" and "الباشا" for **both** Subscription Tiers and Ranks, which caused confusion. This is now resolved:
> - **Subscription Tiers** use: Free / Premium / VIP (باقة المستكشف / باقة بريميوم / باقة VIP)
> - **Ranks** use: Newbie / Regular / Pro / Pasha (مبتدئ / معتمد / محترف / الباشا)
>
> Only "الباشا" is shared intentionally — it represents the aspirational peak in both systems.

---

## 9. Booky Coins Economy (Loyalty)

> **Single Source of Truth** for all earning rates, multipliers, and redemption rules. If any other document conflicts with this section, **this section wins**.

### 9.1 Earning Rules

| Action | Base Coins Earned | Conditions |
|--------|-------------------|------------|
| **Complete a Booking** | 10 coins per 100 EGP spent (min 10 coins) | Booking must reach `completed` status |
| **Leave a Text Review** | +10 bonus coins | Must be ≥ 20 characters |
| **Leave a Photo Review** | +50 bonus coins | Must include ≥ 1 photo (stacks with text review bonus) |
| **Refer a Friend** | +100 coins | Friend must complete their first Booking |
| **Daily Login Streak** | +5 coins/day | Resets to 0 if a day is missed |
| **First Booking in New Sector** | +25 bonus coins | One-time per Sector (6 possible) |
| **Birthday Bonus** | +200 coins | Auto-credited on Client's birthday |

### 9.2 Subscription Tier Multipliers

| Subscription Tier | Multiplier | Example (100 EGP Booking) |
|-------------------|-----------|---------------------------|
| Free | 1x | 10 coins |
| Premium (12 EGP/mo) | 2x | 20 coins |
| VIP (50 EGP/mo) | 5x | 50 coins |

> **Note:** The multiplier applies ONLY to the base "Complete a Booking" earning. Bonus coins (reviews, referrals, etc.) are **not** multiplied.

### 9.3 Redemption Rules

| Coins | Discount Value | Minimum Booking Value |
|-------|---------------|----------------------|
| 100 coins | 10 EGP discount | 50 EGP |
| 500 coins | 50 EGP discount | 200 EGP |
| 1,000 coins | 100 EGP discount | 500 EGP |
| 2,500 coins | Free Service | Select Merchant partners only |

### 9.4 Constraints

| Rule | Value |
|------|-------|
| **Max Discount per Booking** | 30% of Booking value |
| **Expiry** | Coins expire after 12 months of account inactivity |
| **Transferability** | Non-transferable between accounts |
| **Cash Out** | Not redeemable for cash |
| **Cross-Sector** | ✅ Earn in Sports, redeem in Beauty — full cross-Sector loyalty |

### 9.5 The Cross-Sector Magic

> **Example:** Ahmed books a football pitch (earns 20 coins), gets a haircut (earns 15 coins), and calls a plumber (earns 30 coins). He now has **65 coins** to redeem at ANY Sector — or try a new one for a +25 bonus.

---

## 10. Revenue & Commission Model

### Revenue Streams

```
┌─────────────────────────────────────────────────────────────┐
│                    REVENUE MODEL                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   1. CLIENT SUBSCRIPTIONS (Premium / VIP)                    │
│   2. MERCHANT SUBSCRIPTIONS (Starter / Growth / Pro)         │
│   3. TRANSACTION COMMISSIONS (Per Booking)                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Commission Structure

#### Fixed Fee (High-Frequency, Low-Value Services)

| Service Type | Fixed Fee per Booking |
|--------------|----------------------|
| Barber/Haircut | 20 EGP |
| Gym Day Pass | 25 EGP |
| Nail Appointment | 20 EGP |
| Small Home Repair | 30 EGP |

#### Percentage (High-Ticket, Variable-Value Services)

| Service Type | Commission % |
|--------------|-------------|
| Football Pitch | 5% |
| Event Venue | 8% |
| Wedding Package | 10% |
| Corporate Booking | 7% |
| Large Home Project | 5% |

### Revenue Projection (Year 1)

| Stream | Monthly Target | Annual |
|--------|---------------|--------|
| Client Subscriptions | 740,000 EGP | 8.88M EGP |
| Merchant Subscriptions | 500,000 EGP | 6M EGP |
| Transaction Commissions | 1,500,000 EGP | 18M EGP |
| **Total** | **2,740,000 EGP** | **32.88M EGP** |

---

## 11. No-Show Protection (Deposit System)

> This is Booky Center's **strongest operational moat**. No competitor in Egypt offers digital Deposit-based booking protection.

### How It Works

```
BOOKING FLOW:
Client selects Service → Confirms Slot → Pays Deposit → Booking confirmed

IF CLIENT SHOWS UP:
Deposit applied to final bill → Pay remaining balance → Complete

IF CLIENT NO-SHOWS:
Deposit automatically transferred to Merchant → Client notified → Rank impact
```

### Deposit Structure by Sector

| Sector | Deposit % | Cancellation Window | Deposit Required When |
|--------|-----------|---------------------|----------------------|
| Sports & Fitness | 20% | 4 hours before | Bookings > 200 EGP |
| Health & Beauty | 25% | 24 hours before | Premium Services |
| Entertainment | 30% | 48 hours before | Always (highest no-show Sector) |
| Home Services | 15% | 2 hours before | Scheduled appointments |
| Education & Work | 25% | 24 hours before | Always |
| Events & Celebrations | 50-100% | 7 days before | Always (high-ticket) |

### Payment Methods

| Method | Arabic | Deposit Support | Notes |
|--------|--------|-----------------|-------|
| Cash on Arrival | كاش عند الوصول | ❌ Not for Deposits | Only when no Deposit required |
| Vodafone Cash | فودافون كاش | ✅ | OTP-confirmed. Egypt's #1 mobile wallet (28M+ users) |
| InstaPay | إنستا باي | ✅ | National instant bank transfer |
| Credit/Debit Card | بطاقة ائتمان/خصم | ✅ | 3D Secure verified |
| Booky Coins | عملة بوكي | Partial only | Max 30% of Booking value. Cannot cover Deposit. |

### Impact

| Metric | Before Booky | With Booky |
|--------|-------------|------------|
| No-Show Rate | ~30% | < 5% |
| Annual Loss (Egypt) | ₤2.5 Billion | Recovered |

---

## 12. Egyptian Identity & Localization

### Brand Voice

Professional yet friendly, relatable. Trustworthy like a bank, approachable like a friend. Egyptian Arabic (عامية مصرية) in all client-facing communication.

### Primary Slogan

> **بضغطة واحدة.. ميعادك في جيبك**
> *"One tap... your appointment is in your pocket."*

### Secondary Slogans

| Context | Arabic | English |
|---------|--------|---------|
| Client CTA | احجز ميعادك دلوقتي | Book your appointment now |
| Merchant CTA | كبر شغلك وانضم لينا | Grow your business and join us |
| Value Proposition | احجز أي حاجة، في أي وقت، من أي مكان | Book anything, anytime, anywhere |
| Trust Statement | +15,000 بيزنس موثوق | +15,000 trusted businesses |

### Subscription Tier Names (Client-Facing Arabic)

| Tier | Arabic Display Name | Personality |
|------|---------------------|-------------|
| Free | باقة المستكشف | Curious, trying out |
| Premium | باقة بريميوم | Smart, savvy |
| VIP | باقة VIP | Elite, full experience |

### Rank Names (Client-Facing Arabic)

| Rank | Arabic Display Name | Badge |
|------|---------------------|-------|
| Newbie | مبتدئ | 🔵 |
| Regular | معتمد | 🟢 |
| Pro | محترف | ⚫ |
| Pasha | الباشا | 👑 |

---

## 13. Market Intelligence & Competitive Edge

### Global Market

| Metric | Value |
|--------|-------|
| Market Size (2025) | $101 Billion |
| Projected Size (2034) | $627.4 Billion |
| Growth Rate (CAGR) | 22.5% |

> *Source: 'Global Outlook 2025-2034: Reservation and Online Booking Software Market', Research and Markets, October 2025.*

### Egypt's Digital Readiness (2026)

| Metric | Value |
|--------|-------|
| Internet Users | 98.2 Million (82.7% of population) |
| Mobile Connections | 121 Million (102% — multi-SIM) |
| Smartphone Penetration | 78% |
| Median Age | 24.5 years |
| Prefer All-in-One Apps | 73% |

> *Source: 'Digital 2026: Egypt', DataReportal.*

### Total Addressable Market (Egypt)

| Metric | Value |
|--------|-------|
| TAM | ₤86.8 Billion (~$2.8B USD) |
| SAM (Digitally Addressable) | ₤28.4 Billion (32.7%) |
| SOM Year 1 (3% Target) | ₤850 Million |

### Competitive Advantage (4 "Kill Zones")

| Kill Zone | Description |
|-----------|-------------|
| **1. Cross-Sector LTV** | A Vezeeta client booking a doctor also needs a barber, cleaner, and football pitch. Booky captures ALL. |
| **2. No-Show Protection** | Deposits via Vodafone Cash/InstaPay. No competitor offers this. |
| **3. Unified Loyalty** | Booky Coins work across ALL Sectors. Book a gym, redeem at a spa. |
| **4. Hyper-Localization** | Competitors filter by city. Booky filters by neighborhood. 10x more relevant. |

### Competitive Feature Matrix

| Feature | **Booky** | Vezeeta | Malaeb | Filkhedma | Social Media |
|---------|-----------|---------|--------|-----------|--------------|
| Sectors Covered | 6 (All) | 1 (Health) | 1 (Sports) | 1 (Home) | 0 |
| Real-time Availability | ✅ | Partial | ✅ | ❌ | ❌ |
| Price Transparency | ✅ Mandatory | ✅ | Partial | Quote-based | ❌ |
| No-Show Protection | ✅ Deposit | ❌ | Limited | ❌ | ❌ |
| Cross-Sector Loyalty | ✅ Booky Coins | ❌ | ❌ | ❌ | ❌ |
| Multi-Payment | ✅ Card/Wallet/BNPL | Card/Cash | Limited | Cash only | Cash only |
| Merchant Dashboard | ✅ Full SaaS | Basic | Basic | ❌ | ❌ |
| Hyper-Localization | ✅ Neighborhood | City | City | City | Limited |

---

## 14. The Mansoura Pilot Strategy

### Why Mansoura?

| Factor | Advantage |
|--------|-----------|
| Population | 1.5M+ metropolitan area |
| Digital Literacy | High university population = tech-savvy |
| Competition | Low penetration by existing booking apps |
| Cost Efficiency | Lower CAC than Cairo/Alexandria |
| Scalability | Model replicable to other Delta cities |

### Cluster Approach (3 Neighborhoods)

| Cluster | Profile | Target Sectors |
|---------|---------|----------------|
| University District | Students, young professionals | Sports, Education, Barbers, Cafes |
| Turiel | Families, middle-class | Beauty, Home Services, Kids Activities |
| Al-Mashaya (Downtown) | Commercial hub | Restaurants, Events, Professional Services |

### Merchant Acquisition: Two Tracks

| Track | Profile | Pitch |
|-------|---------|-------|
| **Digital Immigrants** | Traditional, zero digital presence | "We build your digital identity from scratch — free." |
| **Growth Seekers** | Active on social media, want more clients | "Turn your followers into paying customers — guaranteed." |

### Pilot Targets (90 Days)

| Metric | Target |
|--------|--------|
| Merchants Onboarded | 200+ |
| Active Clients | 15,000+ |
| Bookings Completed | 5,000+ |
| No-Show Rate | < 5% |
| Subscription Conversion | 25%+ |
| Merchant Retention | 85%+ |

---

## 15. Key Metrics & Targets

### North Star Metrics (Year 1)

| Metric | Definition | Target |
|--------|------------|--------|
| **GMV** | Gross Merchandise Value | ₤850 Million |
| **MAU** | Monthly Active Clients | 2.5 Million |
| **Active Merchants** | Merchants with ≥1 Booking/month | 15,000 |
| **Bookings/Month** | Total completed Bookings | 500,000 |
| **NPS** | Net Promoter Score | > 50 |

### Sector-Specific KPIs

| Sector | Primary KPI | Target |
|--------|-------------|--------|
| Sports & Fitness | Weekly Active Bookers | 150,000 |
| Health & Beauty | 12-Month Retention | 72% |
| Entertainment | Social Share Rate | 45% |
| Home Services | Repeat Booking Rate | 68% |
| Education & Work | B2B Accounts | 10,000 |
| Events & Celebrations | Avg. Transaction Value | ₤1,500 |

### Acquisition Channels

| Channel | Users (Egypt 2026) | Budget Allocation |
|---------|-------------------|-------------------|
| Facebook | 51.6M | 35% |
| TikTok | 48.8M | 30% |
| Instagram | 21.7M | 20% |
| Google | Intent-based | 10% |
| Referral | Organic | 5% |

---

## 16. Glossary of Business Acronyms

| Acronym | Definition |
|---------|------------|
| **GMV** | Gross Merchandise Value — total value of transactions processed |
| **LTV** | Lifetime Value — total revenue expected from a Client |
| **CAC** | Client Acquisition Cost — cost to acquire one new Client |
| **MAU** | Monthly Active Users — unique Clients engaging monthly |
| **NPS** | Net Promoter Score — satisfaction/loyalty metric |
| **ROAS** | Return on Ad Spend — revenue per advertising pound |
| **SaaS** | Software as a Service — cloud-based software model |
| **BNPL** | Buy Now, Pay Later — deferred payment option |
| **TAM** | Total Addressable Market — entire market demand |
| **SAM** | Serviceable Addressable Market — portion we can reach |
| **SOM** | Serviceable Obtainable Market — realistic capture target |
| **OTP** | One-Time Password — SMS verification code |
| **EET** | Eastern European Time — Egypt's timezone (UTC+2) |
| **RTL** | Right-to-Left — Arabic text/layout direction |

---

## Document Control

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Feb 7, 2026 | Initial detailed business foundation |
| 2.0 | Feb 7, 2026 | Simplified project foundation |
| 3.0 | Feb 7, 2026 | Consolidated Master Document |
| 4.0 | Feb 9, 2026 | Strategic Update: Mansoura Pilot, Subscription Tiers, Revenue Model, Digital Deposits |
| 5.0 | Feb 10, 2026 | Egyptian Identity: Localization strategy, Arabic slogans, tier names |
| **6.0** | **Feb 14, 2026** | **Master Hub Restructure:** Unified Project Dictionary, resolved all terminology conflicts (Client/Merchant/Sector), separated Rank from Subscription naming, established canonical Sector Arabic names, created Documentation Index, set Global Rules & Conventions. This version supersedes all previous versions as the Single Source of Truth. |

---

> **📌 HOW TO USE THIS DOCUMENT:**
>
> 1. **Before writing any doc:** Check §2 (Dictionary) for correct terminology.
> 2. **Before creating a feature:** Check §4 (Global Rules) for conventions.
> 3. **Before quoting a number:** Check §9 (Coins), §10 (Revenue), or §11 (Deposits) — this file is the canonical source.
> 4. **If any other document conflicts with this file:** This file wins. Update the other document.
>
> *Booky Center: بضغطة واحدة.. ميعادك في جيبك* ✨

---

**END OF DOCUMENT**
