# US_LOYALTY_REDEMPTION — User Stories

## User Stories: Booky Coins Earning, Redemption & Rank Progression

**Document Version:** 1.0
**Last Updated:** February 14, 2026
**Classification:** User Stories — Loyalty & Gamification System
**Author:** Product Architecture Team
**Depends On:** [`BOOKY_CENTER_BUSINESS_MASTER.md`](../BOOKY_CENTER_BUSINESS_MASTER.md) (v6.0)
**Cross-References:** [`04_SUBSCRIPTION_LOYALTY_MATH.md`](../business_logic/04_SUBSCRIPTION_LOYALTY_MATH.md) (Economy formulas & rules)

---

## Table of Contents

1. [Epic Overview](#1-epic-overview)
2. [US-L01: Earning Coins on Completed Booking](#2-us-l01-earning-coins-on-completed-booking)
3. [US-L02: Redeeming Coins for a Discount](#3-us-l02-redeeming-coins-for-a-discount)
4. [US-L03: Viewing Coin Balance & History](#4-us-l03-viewing-coin-balance--history)
5. [US-L04: Earning Bonus Coins from a Photo Review](#5-us-l04-earning-bonus-coins-from-a-photo-review)
6. [US-L05: Rank Progression (Newbie → Regular)](#6-us-l05-rank-progression-newbie--regular)
7. [US-L06: Rank Demotion (No-Show Penalty)](#7-us-l06-rank-demotion-no-show-penalty)
8. [US-L07: Upgrading Subscription Tier for Higher Multiplier](#8-us-l07-upgrading-subscription-tier-for-higher-multiplier)
9. [US-L08: Cross-Sector Redemption](#9-us-l08-cross-sector-redemption)
10. [US-L09: Merchant Configures Coin Acceptance](#10-us-l09-merchant-configures-coin-acceptance)
11. [US-L10: Daily Login Streak](#11-us-l10-daily-login-streak)
12. [US-L11: Referral Coin Bonus](#12-us-l11-referral-coin-bonus)

---

## 1. Epic Overview

**Epic:** As a Client, I want a rewarding loyalty experience that makes me feel valued, encourages me to book more, and gives me tangible financial benefits — so that Booky Center becomes my default booking platform.

**Epic:** As a Merchant, I want to leverage the Booky Coins system to attract and retain high-value Clients — so that I increase Bookings and build a loyal Client base.

### Story Map

```
CLIENT JOURNEY (EARNING)                    CLIENT JOURNEY (BURNING)
─────────────────────────                   ─────────────────────────
Complete a Booking (US-L01)                 View Balance (US-L03)
         │                                           │
Leave a Photo Review (US-L04)               Redeem at Checkout (US-L02)
         │                                           │
Daily Login Streak (US-L10)                 Cross-Sector Use (US-L08)
         │
Refer a Friend (US-L11)

PROGRESSION                                 MERCHANT SIDE
─────────────                               ──────────────
Rank Up (US-L05)                            Configure Coins (US-L09)
         │
Rank Demotion (US-L06)
         │
Upgrade Tier (US-L07)
```

---

## 2. US-L01: Earning Coins on Completed Booking

### Story

> **As a** Client,
> **I want to** automatically earn Booky Coins after completing a Booking,
> **So that** I accumulate rewards for future discounts.

### Scenario

**Given** Ahmed is a Client with a Free Subscription Tier (1x multiplier)
**And** he completes a Padel court Booking worth 300 EGP
**When** 24 hours pass after the Booking is marked as `COMPLETED`
**Then** 300 Booky Coins are credited to Ahmed's account
**And** a push notification is sent: "🪙 كسبت ٣٠٠ كوينز من حجزك في ملعب الأبطال!"
**And** the Coins appear in his balance with a ledger entry referencing the Booking.

### Acceptance Criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Coins = `booking_value_egp × tier_multiplier` (1 EGP = 1 Coin at 1x). | ☐ |
| 2 | Coins credited exactly 24 hours after `COMPLETED` status. | ☐ |
| 3 | If Booking is cancelled/disputed within 24h window, Coins are NOT credited. | ☐ |
| 4 | Minimum earning: 10 Coins per Booking (even if value < 10 EGP). | ☐ |
| 5 | Push notification sent on credit. | ☐ |
| 6 | Ledger entry created with `type: 'earn_booking'`, `reference_id: booking_id`. | ☐ |
| 7 | `balance_after` field in ledger is accurate. | ☐ |

### Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| Booking value is 0 EGP (free Service) | 10 Coins credited (minimum). |
| Client upgrades Subscription Tier between booking and completion | Multiplier at time of completion applies. |
| Booking completed but Merchant disputes | Coins held until dispute resolved. |

---

## 3. US-L02: Redeeming Coins for a Discount

### Story

> **As a** Client,
> **I want to** use my 500 Booky Coins to get a 50 EGP discount on my Padel Booking,
> **So that** I save money and feel rewarded for my loyalty.

### Scenario

**Given** Sara has 750 Booky Coins in her balance
**And** she is booking a Padel court at "ملعب الأبطال" for 200 EGP
**And** the Merchant accepts Booky Coins (up to 30% discount)
**When** Sara reaches the checkout screen
**Then** she sees a Coin redemption slider showing her balance (750 Coins)
**And** she selects 500 Coins to redeem

**Then** the system validates:
- ✅ Balance sufficient: 750 ≥ 500
- ✅ Discount value: 500 ÷ 10 = 50 EGP
- ✅ Max discount check: 50 EGP ≤ 30% of 200 EGP (= 60 EGP) → Passes
- ✅ Minimum Booking check: 200 EGP ≥ 200 EGP for 500 Coins → Passes

**And** the invoice updates in real-time:

```
المبلغ الأصلي:      200 ج.م
خصم كوينز بوكي:    -50 ج.م  (500 Coins)
─────────────────────────────
المجموع بعد الخصم:  150 ج.م

العربون (25% من ٢٠٠ ج.م):    50 ج.م  ← Original price!
الباقي عند الوصول:             100 ج.م
```

**And** 500 Coins are deducted from Sara's balance (750 → 250)
**And** a ledger entry is created: `type: 'redeem'`, `amount: -500`, `balance_after: 250`
**And** Sara receives confirmation: "✅ تم خصم ٥٠٠ كوينز — وفرتي ٥٠ ج.م!"

### Acceptance Criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | 100 Coins = 10 EGP discount (fixed rate). | ☐ |
| 2 | System validates: balance ≥ requested, discount ≤ 30% of Booking value, Booking value ≥ minimum. | ☐ |
| 3 | Coins deducted atomically at Booking confirmation (not at checkout view). | ☐ |
| 4 | If Booking is later cancelled, Coins are refunded to Client's balance. | ☐ |
| 5 | Deposit is calculated on the **original price** (before Coin discount). | ☐ |
| 6 | Coins **cannot** be used to pay the Deposit — Deposit must be real money. | ☐ |
| 7 | Invoice displays both original and discounted amounts clearly. | ☐ |
| 8 | Ledger entry created with `type: 'redeem'`, negative `amount`, and correct `balance_after`. | ☐ |
| 9 | Merchant receives the discounted amount (200 - 50 = 150 EGP) and gets visibility boost. | ☐ |
| 10 | If payment fails after Coin deduction, Coins are automatically refunded within 5 minutes. | ☐ |

### Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| Client tries to redeem more Coins than balance | Error: "رصيدك مش كفاية. عندك [X] كوينز." |
| Discount exceeds 30% of Booking value | Auto-cap to 30%. Slider stops at max. |
| Merchant disabled Coin acceptance | Coin slider hidden. Info: "المكان ده مش بيقبل كوينز حالياً." |
| Merchant excluded this specific Service | Coin slider hidden for this Service only. |
| Booking cancelled after Coins redeemed | Coins refunded. Ledger: `type: 'clawback'`, positive `amount`. |
| Concurrent redemption (two checkouts same time) | Optimistic locking on Coin balance. Second checkout fails gracefully. |

---

## 4. US-L03: Viewing Coin Balance & History

### Story

> **As a** Client,
> **I want to** view my current Booky Coins balance and transaction history,
> **So that** I can track my earnings and plan my redemptions.

### Scenario

**Given** Ahmed taps the Coins widget on his Home Screen
**When** the Coins dashboard loads
**Then** he sees:

```
┌──────────────────────────────────────┐
│         رصيد كوينز بوكي 🪙           │
│                                      │
│            1,250                      │
│           كوينز                       │
│                                      │
│   = 125 ج.م خصم متاح                │
│                                      │
│   الرتبة: 🟢 معتمد (Regular)          │
│   الباقة: باقة بريميوم (2x)           │
│                                      │
│   ── آخر الحركات ──                   │
│                                      │
│   +300 🪙  حجز ملعب الأبطال          │
│   ١٣ فبراير ٢٠٢٦                    │
│                                      │
│   +50 🪙   تقييم بالصور              │
│   ١٢ فبراير ٢٠٢٦                    │
│                                      │
│   -500 🪙  خصم — صالون أحمد          │
│   ١٠ فبراير ٢٠٢٦                    │
│                                      │
│   +5 🪙    تسجيل دخول يومي (٧ أيام) │
│   ١٠ فبراير ٢٠٢٦                    │
│                                      │
│   [ عرض كل الحركات → ]               │
│                                      │
│   ── كيف تكسب أكتر؟ ──               │
│   💡 رقّي لباقة VIP واكسب 5x كوينز  │
│   [ اعرف أكتر → ]                    │
│                                      │
└──────────────────────────────────────┘
```

### Acceptance Criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Current balance displayed prominently with EGP equivalent (`balance ÷ 10`). | ☐ |
| 2 | Current Rank and Subscription Tier shown. | ☐ |
| 3 | Transaction history: paginated, most recent first, 20 per page. | ☐ |
| 4 | Each entry shows: amount (+/-), type (icon), reference name, date. | ☐ |
| 5 | Upsell prompt for next Subscription Tier with multiplier benefit. | ☐ |
| 6 | Pull-to-refresh updates balance in real-time. | ☐ |

---

## 5. US-L04: Earning Bonus Coins from a Photo Review

### Story

> **As a** Client,
> **I want to** earn 50 bonus Booky Coins by leaving a review with a photo,
> **So that** I'm incentivized to share quality feedback that helps other Clients.

### Scenario

**Given** Ahmed completed a Booking at "صالون أحمد" (200 EGP)
**And** the Booking status is `COMPLETED`
**When** Ahmed taps "قيّم التجربة" (Rate Experience)
**And** writes a review: "حلاقة ممتازة والمكان نضيف جداً. أحسن صالون في المنصورة!" (55 characters ✅)
**And** attaches 2 photos of the haircut result
**And** submits the review

**Then** Ahmed earns:
- +10 Coins (text review bonus, ≥ 20 characters)
- +50 Coins (photo review bonus, ≥ 1 photo)
- Total bonus: **+60 Coins**

**And** notification: "🪙 كسبت ٦٠ كوينز إضافية من تقييمك!"
**And** the review appears on the Merchant's profile with Ahmed's Rank badge.

### Acceptance Criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Text review bonus: +10 Coins if ≥ 20 characters. | ☐ |
| 2 | Photo review bonus: +50 Coins if ≥ 1 photo attached. Stacks with text bonus. | ☐ |
| 3 | Bonus Coins are NOT multiplied by Subscription Tier (flat amount). | ☐ |
| 4 | Review must be from a `COMPLETED` Booking (verified review). | ☐ |
| 5 | Max 1 review per Booking. | ☐ |
| 6 | Photos validated: JPEG/PNG, max 5MB, EXIF data checked for authenticity. | ☐ |
| 7 | NLP spam filter: reviews under 20 chars, gibberish, or duplicate text are rejected. | ☐ |

---

## 6. US-L05: Rank Progression (Newbie → Regular)

### Story

> **As a** Client with the Newbie Rank,
> **I want to** see my progress toward the Regular Rank and get promoted when I meet the criteria,
> **So that** I feel a sense of achievement and unlock new benefits.

### Scenario

**Given** Ahmed is Newbie Rank with 4 completed Bookings and 0 reviews
**When** he completes his 5th Booking and leaves his first review
**Then** the system recalculates his Rank:
- Completed Bookings: 5 ✅ (≥ 5)
- Verified Reviews: 1 ✅ (≥ 1)

**And** Ahmed is promoted to **Regular** (🟢 معتمد)
**And** a celebration animation plays
**And** notification: "🎉 مبروك! اتررقيت لرتبة معتمد! 🟢 دلوقتي تقدر تتخطى قائمة الانتظار."
**And** the new badge appears on his profile and reviews.

### Acceptance Criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Rank recalculated after every Booking completion and review submission. | ☐ |
| 2 | Progress bar shown on Client profile: "3/5 حجوزات لرتبة معتمد". | ☐ |
| 3 | Promotion triggers celebration animation (confetti, badge reveal). | ☐ |
| 4 | Push notification on promotion with new benefits explained. | ☐ |
| 5 | New benefits (e.g., skip waitlist for Regular) active immediately. | ☐ |
| 6 | Rank badge visible on profile, reviews, and Feed posts. | ☐ |

### Rank Progress UI

```
┌──────────────────────────────────────┐
│   الرتبة الحالية: 🔵 مبتدئ (Newbie)  │
│                                      │
│   التالي: 🟢 معتمد (Regular)          │
│   ├── حجوزات: ████░░░░░░  4/5        │
│   └── تقييمات: ░░░░░░░░░░  0/1       │
│                                      │
│   💡 كمّل حجز واحد واكتب تقييم       │
│      عشان تترقى!                     │
└──────────────────────────────────────┘
```

---

## 7. US-L06: Rank Demotion (No-Show Penalty)

### Story

> **As a** Client who has accumulated 3 no-shows in 30 days,
> **I want to** be clearly notified about my Rank demotion and how to recover,
> **So that** I understand the consequences and can take corrective action.

### Scenario

**Given** Sara is Pro Rank (⚫ محترف) with 15 completed Bookings
**And** she has 3 no-shows in the last 30 days
**When** the system runs the daily Rank check
**Then** Sara is demoted from Pro → Regular (🟢 معتمد)
**And** notification: "⚠️ اتخفضت رتبتك لـ معتمد بسبب ٣ حالات عدم حضور. كمّل ٥ حجوزات متتالية عشان ترجع."
**And** her profile badge updates to 🟢

### Acceptance Criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | 3+ no-shows in 30 days triggers demotion by one Rank. | ☐ |
| 2 | Notification explains the reason and recovery path (5 clean Bookings). | ☐ |
| 3 | 6 months inactivity triggers demotion to Newbie. | ☐ |
| 4 | Recovery: 5 consecutive `COMPLETED` Bookings restores previous Rank. | ☐ |
| 5 | Demotion is logged in audit trail. | ☐ |
| 6 | Fraud demotion (admin-triggered) bypasses normal rules → immediate Newbie. | ☐ |

---

## 8. US-L07: Upgrading Subscription Tier for Higher Multiplier

### Story

> **As a** Client on the Free Subscription Tier,
> **I want to** upgrade to Premium so I earn 2x Booky Coins on every Booking,
> **So that** I accumulate Coins faster and get more discounts.

### Scenario

**Given** Ahmed is on the Free tier and sees the upsell in the Coins dashboard
**When** he taps "اعرف أكتر" and views the tier comparison
**Then** he sees a personalized projection:

```
باقتك الحالية: مجاناً (1x كوينز)
باقة بريميوم: ١٢ ج.م/شهر (2x كوينز)

بناءً على حجوزاتك الشهر اللي فات:
  حجوزات: 4 × متوسط 150 ج.م = 600 ج.م
  كوينز بالباقة الحالية: 600 كوينز (= 60 ج.م خصم)
  كوينز مع بريميوم:     1,200 كوينز (= 120 ج.م خصم)
  ─────────────────────
  فرق الخصم: +60 ج.م/شهر
  تكلفة الباقة: -12 ج.م/شهر
  ✅ صافي الربح: +48 ج.م/شهر
```

**And** Ahmed taps "رقّي دلوقتي"
**And** pays 12 EGP (pro-rated for remaining days)
**And** his multiplier changes to 2x **immediately**

### Acceptance Criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Personalized ROI shown based on Client's actual Booking history. | ☐ |
| 2 | Upgrade is immediate; pro-rated billing for remaining cycle days. | ☐ |
| 3 | 2x multiplier applies to all Bookings from moment of upgrade. | ☐ |
| 4 | Coins already earned at 1x are NOT retroactively adjusted. | ☐ |
| 5 | Confirmation notification: "🎉 رقّيت لباقة بريميوم! كل حجز = كوينز مضاعفة." | ☐ |

---

## 9. US-L08: Cross-Sector Redemption

### Story

> **As a** Client who earned Booky Coins from Sports Bookings,
> **I want to** redeem those Coins for a discount on a Beauty Sector Booking,
> **So that** I benefit from a unified loyalty system across all Sectors.

### Scenario

**Given** Ahmed earned 600 Coins from 3 football Bookings (Sports Sector)
**And** he is now booking a haircut at "صالون أحمد" (Health & Beauty Sector) for 100 EGP
**When** he reaches checkout
**Then** the Coin redemption slider shows his full 600 Coin balance
**And** he can use up to 300 Coins (= 30 EGP = 30% max of 100 EGP Booking)

**And** the system does NOT differentiate between "Sports Coins" and "Beauty Coins" — all Coins are universal.

### Acceptance Criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Coins are Sector-agnostic. Earn in any Sector, redeem in any Sector. | ☐ |
| 2 | No "Sector wallets" or "Sector-locked Coins" — single unified balance. | ☐ |
| 3 | Coin history shows which Sector each earning came from (for analytics). | ☐ |
| 4 | First Booking in a new Sector earns +25 bonus Coins (one-time/Sector). | ☐ |

---

## 10. US-L09: Merchant Configures Coin Acceptance

### Story

> **As a** Merchant,
> **I want to** control whether I accept Booky Coins on my Services and set my maximum discount,
> **So that** I can manage my margins while benefiting from boosted visibility.

### Scenario

**Given** Merchant "صالون أحمد" opens the Coin settings in the Merchant Dashboard
**When** he enables Coin acceptance and sets max discount to 20%
**And** excludes the "صبغة شعر" Service (low margin)
**Then** all his other Services show the "يقبل كوينز بوكي 🪙" badge
**And** his search ranking receives a +20% boost
**And** the excluded Service does NOT show the Coin redemption slider at checkout

### Acceptance Criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Merchant can enable/disable Coin acceptance globally. | ☐ |
| 2 | Merchant can set max discount per Booking (10% / 20% / 30%). | ☐ |
| 3 | Merchant can exclude specific Services from Coin redemption. | ☐ |
| 4 | "يقبل كوينز بوكي" badge shown on accepting Merchants/Services. | ☐ |
| 5 | +20% search visibility boost active within 1 hour of enabling. | ☐ |
| 6 | Merchant receives discounted amount (original - Coin discount). | ☐ |
| 7 | Dashboard shows: total Coin redemptions, discount cost, and estimated visibility impact. | ☐ |

---

## 11. US-L10: Daily Login Streak

### Story

> **As a** Client,
> **I want to** earn 5 Booky Coins each day I open the app,
> **So that** I'm incentivized to engage daily and build a habit.

### Scenario

**Given** Ahmed has a 7-day login streak
**When** he opens the app on Day 8
**Then** he sees: "🔥 ٨ أيام متتالية! +٥ كوينز"
**And** 5 Coins are credited to his balance
**And** the streak counter increments

**But if** Ahmed misses Day 9
**Then** his streak resets to 0
**And** on his next login: "رجعت! ابدأ سلسلة جديدة — +٥ كوينز"

### Acceptance Criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | +5 Coins per day, credited on first app open of the day. | ☐ |
| 2 | "Day" = midnight to midnight in Africa/Cairo timezone (EET). | ☐ |
| 3 | Streak resets to 0 if a calendar day is missed. | ☐ |
| 4 | Max monthly earning from login: 150 Coins (30 × 5). | ☐ |
| 5 | Streak counter and animation displayed on home screen. | ☐ |
| 6 | Login Coins are NOT multiplied by Subscription Tier (flat +5). | ☐ |

---

## 12. US-L11: Referral Coin Bonus

### Story

> **As a** Client,
> **I want to** earn 100 Booky Coins when I refer a friend who completes their first Booking,
> **So that** I'm incentivized to spread the word about Booky Center.

### Scenario

**Given** Ahmed taps "ادعو صاحبك" (Invite a Friend) and shares his referral link
**And** his friend Khaled registers via the link
**When** Khaled completes his first Booking
**Then** Ahmed earns +100 Coins (referral bonus)
**And** Khaled earns +100 Coins (welcome bonus, first Booking ever)
**And** Ahmed receives: "🎉 صاحبك خالد حجز أول حجز! كسبت ١٠٠ كوينز."

### Acceptance Criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Referral Coins credited only when referee completes first `COMPLETED` Booking. | ☐ |
| 2 | Max 10 referral bonuses per month (1,000 Coins cap). | ☐ |
| 3 | Referral Coins are NOT multiplied by Subscription Tier (flat +100). | ☐ |
| 4 | Referral link trackable (unique per Client). | ☐ |
| 5 | Anti-fraud: same device/IP for referrer and referee → flagged for review. | ☐ |
| 6 | Both referrer and referee receive notifications and Coin credits. | ☐ |

---

## Story Priority Matrix

| Story | Priority | Sprint | Dependencies |
|-------|----------|--------|-------------|
| US-L01: Earn on Booking | 🔴 P0 (Critical) | Sprint 1 | Booking flow, Coins ledger |
| US-L02: Redeem at Checkout | 🔴 P0 (Critical) | Sprint 1 | Checkout flow, Coins ledger |
| US-L03: View Balance | 🔴 P0 (Critical) | Sprint 1 | Coins ledger, Client Home |
| US-L04: Photo Review Bonus | 🟡 P1 (High) | Sprint 2 | Review system, Coins ledger |
| US-L05: Rank Progression | 🟡 P1 (High) | Sprint 2 | Rank engine |
| US-L06: Rank Demotion | 🟡 P1 (High) | Sprint 2 | Rank engine, No-show tracking |
| US-L07: Tier Upgrade | 🟡 P1 (High) | Sprint 2 | Subscription billing |
| US-L08: Cross-Sector Redeem | 🔴 P0 (Critical) | Sprint 1 | Coins are already cross-sector by design |
| US-L09: Merchant Coin Config | 🟡 P1 (High) | Sprint 2 | Merchant Dashboard |
| US-L10: Login Streak | 🟢 P2 (Medium) | Sprint 3 | Basic — standalone |
| US-L11: Referral Bonus | 🟢 P2 (Medium) | Sprint 3 | Referral tracking system |

---

> **📌 All stories in this document use canonical terminology from [`BOOKY_CENTER_BUSINESS_MASTER.md`](../BOOKY_CENTER_BUSINESS_MASTER.md) §2 and mathematical rules from [`04_SUBSCRIPTION_LOYALTY_MATH.md`](../business_logic/04_SUBSCRIPTION_LOYALTY_MATH.md). If any numbers conflict, the MATH document is authoritative for formulas and the MASTER is authoritative for terminology.**

---

**END OF DOCUMENT**
