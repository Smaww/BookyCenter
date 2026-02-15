# 📂 05-Core Systems: Loyalty & Subscription Math

## *Booky Coins Economy, Rank Progression, Client Subscription Tiers & Break-Even Analysis*

**Parent:** [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md)
**Cross-Refs:** [booking-lifecycle.md](mdc:docs/business-logic/02-client/booking-lifecycle.md) (Deposit interaction), [growth-and-promo-logic.md](mdc:docs/business-logic/05-core-systems/growth-and-promo-logic.md) (Campaigns & Referrals), [wallet-and-payouts.md](mdc:docs/business-logic/03-merchant/wallet-and-payouts.md) (Commission model), [dynamic-dashboard-logic.md](mdc:docs/business-logic/03-merchant/dynamic-dashboard-logic.md) (Merchant Subscription Tiers)
**Version:** 1.0 | **Date:** February 15, 2026

---

## Table of Contents

1. [Economy Design Philosophy](#1-economy-design-philosophy)
2. [Earning Model (How Clients Get Coins)](#2-earning-model-how-clients-get-coins)
3. [Client Subscription Tier Multipliers](#3-client-subscription-tier-multipliers)
4. [Burning Model (How Clients Spend Coins)](#4-burning-model-how-clients-spend-coins)
5. [Merchant Incentive: The Visibility Exchange](#5-merchant-incentive-the-visibility-exchange)
6. [The Rank System — Progression Math](#6-the-rank-system--progression-math)
7. [Client Subscription Billing Logic](#7-client-subscription-billing-logic)
8. [Online Payment Loyalty Bonus (+5% Coins)](#8-online-payment-loyalty-bonus-5-coins)
9. [Economy Simulations & Scenarios](#9-economy-simulations--scenarios)
10. [Anti-Abuse & Fraud Prevention](#10-anti-abuse--fraud-prevention)
11. [Data Model & Ledger Design](#11-data-model--ledger-design)
12. [Gherkin Scenarios](#12-gherkin-scenarios)
13. [Edge Cases](#13-edge-cases)

---

## 1. Economy Design Philosophy

### The Core Equation

```
┌──────────────────────────────────────────────────────────────┐
│                 BOOKY COINS ECONOMY                           │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   EARNING (الكسب)                                             │
│   1 EGP spent on a Booking  =  1 Booky Coin                  │
│   (Base rate, before multipliers)                             │
│                                                               │
│   BURNING (الاستخدام)                                         │
│   100 Booky Coins  =  10 EGP Discount                        │
│   (1 Coin = 0.10 EGP redemption value)                       │
│                                                               │
│   NET EFFECT:                                                 │
│   Client spends 1,000 EGP → earns 1,000 Coins → redeems     │
│   for 100 EGP discount = 10% effective cashback               │
│                                                               │
│   WITH MULTIPLIERS:                                           │
│   VIP Client spends 1,000 EGP → earns 5,000 Coins →          │
│   redeems for 500 EGP = 50% effective cashback                │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Design Principles

| Principle | Rule |
|-----------|------|
| **Simplicity** | 1 EGP = 1 Coin. No complex formulas. Anyone can calculate in their head. |
| **Cross-Sector** | Earn in Sports, burn in Beauty. Full cross-Sector loyalty. |
| **Non-Monetary** | Coins cannot be cashed out or transferred. They are platform-locked. |
| **Dual Benefit** | Clients get discounts. Merchants who fund discounts get boosted visibility. Win-win. |
| **Inflation Control** | Expiry rules, max discount caps, and earning limits prevent runaway inflation. |

> **⚠️ CRITICAL DISTINCTION:** Rank (earned through behavior) and Subscription Tier (paid monthly) are **SEPARATE** systems. A Pasha-ranked Client on the Free tier earns 1x Coins. A Newbie Client on VIP earns 5x Coins. They are fully independent.

---

## 2. Earning Model (How Clients Get Coins)

### 2.1 Primary Earning: Completed Bookings

> **The Formula:** `coins_earned = booking_value_egp × tier_multiplier`

| Variable | Definition |
|----------|------------|
| `booking_value_egp` | The total amount the Client paid for the Booking (in EGP, integer) |
| `tier_multiplier` | Based on Client's Subscription Tier (see §3) |

**Base Rate:** 1 EGP spent = 1 Coin (at 1x multiplier)

| Booking Value | Free (1x) | Premium (2x) | VIP (5x) |
|---------------|-----------|---------------|-----------|
| 50 EGP | 50 Coins | 100 Coins | 250 Coins |
| 100 EGP | 100 Coins | 200 Coins | 500 Coins |
| 200 EGP | 200 Coins | 400 Coins | 1,000 Coins |
| 500 EGP | 500 Coins | 1,000 Coins | 2,500 Coins |
| 1,000 EGP | 1,000 Coins | 2,000 Coins | 5,000 Coins |

**Conditions:**
- Booking MUST reach `COMPLETED` status (not cancelled, no-show, or pending).
- Coins credited **24 hours** after Booking completion (dispute window).
- Minimum earning: 10 Coins per Booking (even if value < 10 EGP).

### 2.2 Bonus Earning: Engagement Actions

> **Bonus Coins are NOT multiplied** by subscription tier. They are flat rewards.

| Action | Coins Earned | Conditions | Frequency |
|--------|-------------|------------|-----------|
| **Text Review** | +10 Coins | ≥ 20 characters, from completed Booking | Per Booking |
| **Photo Review** | +50 Coins | ≥ 1 photo attached (stacks with text bonus) | Per Booking |
| **Referral** | +100 Coins | Referred friend completes their first Booking | Per referral |
| **Daily Login** | +5 Coins/day | Open the app (streak resets if day missed) | Daily |
| **First Booking in New Sector** | +25 Coins | One-time per Sector (6 possible = 150 max) | Once/Sector |
| **Birthday Bonus** | +200 Coins | Auto-credited on Client's birthday | Annual |
| **Profile Completion** | +50 Coins | Fill name, photo, and preferences | One-time |
| **First Booking Ever** | +100 Coins | Welcome bonus on very first Booking | One-time |

### 2.3 Maximum Earning Caps

| Cap | Value | Rationale |
|-----|-------|-----------|
| Max Coins from Bookings/day | 10,000 Coins | Prevent bulk-booking abuse |
| Max Login Streak Bonus/month | 150 Coins (30 days × 5) | Bounded |
| Max Referral Coins/month | 1,000 Coins (10 referrals) | Anti-fraud |
| Max Bonus Coins/month | 2,000 Coins (all non-booking sources) | Inflation control |

---

## 3. Client Subscription Tier Multipliers

> These are the **Client-side** Subscription Tiers. Separate from Merchant Subscription Tiers (Starter/Growth/Pro in [dynamic-dashboard-logic.md](mdc:docs/business-logic/03-merchant/dynamic-dashboard-logic.md)).

| Tier | Arabic Name | Monthly Price | Multiplier | Effective Cashback |
|------|-------------|---------------|------------|-------------------|
| **Free** | باقة المستكشف | 0 EGP | 1x | ~10% |
| **Premium** | باقة بريميوم | 12 EGP | 2x | ~20% |
| **VIP** | باقة VIP | 50 EGP | 5x | ~50% |

### Multiplier Application Rules

```
coins_from_booking = booking_value_egp × tier_multiplier
coins_from_bonus   = flat_bonus_amount  (NO multiplier)
total_coins        = coins_from_booking + coins_from_bonus
```

### Break-Even Analysis

> "How much does a Client need to spend for the subscription to pay for itself?"

| Tier | Cost | Extra Coins vs Free | Extra Discount Value | Break-Even Spending |
|------|------|--------------------|--------------------|---------------------|
| Premium (12 EGP/mo) | 12 EGP | 1x more per EGP | 0.10 EGP per extra coin | **120 EGP/month** |
| VIP (50 EGP/mo) | 50 EGP | 4x more per EGP | 0.10 EGP per extra coin | **125 EGP/month** |

> **Insight:** A Client who spends just 125 EGP/month on Bookings (one barber visit + one gym day) already makes VIP profitable. The math is designed to be a no-brainer.

---

## 4. Burning Model (How Clients Spend Coins)

### 4.1 Redemption Rate

> **The Formula:** `discount_egp = coins_redeemed ÷ 10`

| Coins Redeemed | Discount Applied | Minimum Booking Value |
|----------------|------------------|-----------------------|
| 100 Coins | 10 EGP | 50 EGP |
| 200 Coins | 20 EGP | 100 EGP |
| 500 Coins | 50 EGP | 200 EGP |
| 1,000 Coins | 100 EGP | 500 EGP |
| 2,500 Coins | 250 EGP | 800 EGP |
| 5,000 Coins | 500 EGP | 1,500 EGP |

### 4.2 Redemption Constraints

| Rule | Value | Rationale |
|------|-------|-----------|
| **Max Discount per Booking** | 30% of Booking value | Protect Merchant margins |
| **Minimum Redemption** | 100 Coins (10 EGP) | Prevent micro-transactions |
| **Coins on Deposit** | Cannot use Coins to pay Deposits | Deposits must be real money |
| **Coins + Payment Mix** | Allowed | e.g., 500 Coins (50 EGP) + 150 EGP cash = 200 EGP Booking |
| **Partial Redemption** | Allowed | Redeem 200 of 500 Coins, keep 300 |
| **Coin Expiry** | 12 months of account inactivity | Active accounts never expire |
| **Non-Transferable** | Cannot send Coins to another Client | Anti-abuse |
| **Non-Cashable** | Cannot convert to EGP cash | Platform-locked |

### 4.3 Redemption Flow (Client-Side)

```
┌─────────────────────────────────────────────────────────────┐
│              ملخص الحجز — الدفع                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ✂️  حلاقة رجالي — صالون أحمد                               │
│   📅  الجمعة ١٤ فبراير ٢٠٢٦ — ٣:٠٠ م                       │
│   💰  السعر: 200 ج.م                                         │
│                                                              │
│   ── استخدم كوينز بوكي ──                                    │
│                                                              │
│   رصيدك: 🪙 750 Coins                                       │
│                                                              │
│   [ ─────●───────── ]  500 Coins                             │
│   خصم: -50 ج.م                                               │
│                                                              │
│   ── أو اختار كمية ──                                        │
│   [ 100 ] [ 200 ] [ 500 ] [ MAX ]                            │
│                                                              │
│   ─────────────────────────────────────                      │
│   المبلغ الأصلي:      200 ج.م                                │
│   خصم الكوينز:       -50 ج.م  (500 Coins)                   │
│   العربون المطلوب:     50 ج.م  (25% of 200)                  │
│   الباقي عند الوصول:  100 ج.م                                │
│   ─────────────────────────────────────                      │
│   المجموع بعد الخصم:  150 ج.م                                │
│                                                              │
│   ⚠️ العربون يتحسب من السعر الأصلي مش بعد الخصم              │
│                                                              │
│               [ ادفع العربون — 50 ج.م ]                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4.4 Deposit vs. Discount Interaction

> **CRITICAL RULE:** Deposits are calculated on the **original price**, not the discounted price.

```
Example:
  Service price:          200 EGP
  Coins discount:         -50 EGP  (500 Coins redeemed)
  Discounted price:       150 EGP
  Deposit (25%):          50 EGP   ← 25% of 200 EGP (ORIGINAL)
  Remaining at arrival:   100 EGP  (150 - 50 deposit)
```

---

## 5. Merchant Incentive: The Visibility Exchange

### The Problem

If the platform funds all discounts, it bleeds money. If Merchants fund discounts without benefit, they refuse.

### The Booky Center Solution: "Pay for Discount, Get Boosted"

> Merchants who accept Coin redemptions on their Services get automatic Boosted Visibility in search results and the Feed.

### How It Works

```
┌──────────────────────────────────────────────────────────────┐
│                THE VISIBILITY EXCHANGE                         │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   CLIENT REDEEMS 500 Coins (= 50 EGP discount)               │
│        │                                                      │
│        ▼                                                      │
│   WHO PAYS THE 50 EGP?                                        │
│        │                                                      │
│        ├─ MERCHANT absorbs the discount cost                  │
│        │  (receives 150 EGP instead of 200 EGP)              │
│        │                                                      │
│        ▼                                                      │
│   WHAT DOES THE MERCHANT GET IN RETURN?                       │
│        │                                                      │
│        ├─ 🚀 BOOSTED search ranking (+20% visibility)         │
│        ├─ 📌 "يقبل كوينز بوكي" badge on profile              │
│        ├─ 📊 Priority in Feed recommendations                 │
│        ├─ 👥 Access to high-value, loyal Clients               │
│        └─ 🔄 Higher rebooking rate (coin users rebook 2.3x)  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Merchant Coin Acceptance Settings

```
┌──────────────────────────────────────────────────────────────┐
│           لوحة التحكم — إعدادات كوينز بوكي                   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   قبول كوينز بوكي:  [ ✅ مفعّل ]                             │
│                                                               │
│   الحد الأقصى للخصم لكل حجز:                                 │
│   ( ○ 10%  ● 20%  ○ 30% )                                    │
│                                                               │
│   خدمات مستثناة:                                              │
│   [ ] ✂️ حلاقة رجالي                                         │
│   [✓] 💈 صبغة شعر  ← (low margin, excluded)                 │
│   [ ] 🧔 تنظيف بشرة                                         │
│                                                               │
│   ── المكافآت اللي بتاخدها ──                                │
│   🚀 ترتيب أعلى في نتائج البحث                               │
│   📌 شارة "يقبل كوينز بوكي" على صفحتك                       │
│   📊 أولوية في التوصيات                                      │
│                                                               │
│               [ حفظ الإعدادات ✓ ]                              │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Visibility Boost Mechanics

| Merchant Action | Visibility Boost | Duration |
|----------------|------------------|----------|
| Accepts Coin redemption | +20% search ranking | 7 days after each redemption |
| 10+ Coin redemptions/month | "شائع عند أعضاء بوكي" (Popular with Members) badge | Ongoing while active |
| Creates Coin-back Campaign (Growth/Pro tier) | +30% search ranking + Feed feature | Campaign duration |
| Rejects Coin redemption (disables) | No penalty, but no boost | — |

### Financial Flow

```
Client pays 200 EGP for Service
Client redeems 500 Coins (= 50 EGP discount)

MONEY FLOW:
─────────────
Client pays:           150 EGP (200 - 50 discount)
  ├─ Deposit (paid):    50 EGP (25% of 200, original price)
  └─ At arrival:       100 EGP

Merchant receives:     150 EGP
  ├─ Deposit:           50 EGP (from escrow)
  ├─ At arrival:       100 EGP (from Client)
  └─ Commission:       -XX EGP (per tier & service type)

Booky Platform:        Commission only
  (Coins are NOT funded by Booky — the Merchant absorbs the discount
   in exchange for boosted visibility)
```

### Merchant Coin-Back Campaigns (Growth & Pro Tiers)

> Merchants can create promotional campaigns where they offer **extra Coins** on Bookings.

```
CAMPAIGN EXAMPLE:
─────────────────
Merchant: صالون أحمد
Campaign: "احجز هذا الأسبوع واكسب كوينز مضاعفة!"
Offer: +100% extra Coins on all Bookings (Mon-Wed)

Client books 200 EGP haircut on Tuesday:
  Normal earning:    200 Coins (1x, Free tier)
  Campaign bonus:   +200 Coins (funded by Merchant)
  Total earned:      400 Coins

Merchant pays for the bonus Coins:
  200 bonus Coins × 0.10 EGP = 20 EGP cost to Merchant
  In exchange: Campaign badge + Feed feature + search boost
```

---

## 6. The Rank System — Progression Math

> Ranks are **earned through behavior**, independent of Subscription Tier. Full rules in Master §8.

### 6.1 Rank Thresholds

| Rank | Badge | Completed Bookings | Verified Reviews | Account Age | Special |
|------|-------|--------------------|-----------------|-------------|---------|
| **Newbie** (مبتدئ) | 🔵 | 0-4 | — | — | — |
| **Regular** (معتمد) | 🟢 | 5-9 | ≥ 1 | — | — |
| **Pro** (محترف) | ⚫ | 10-19 | ≥ 3 (verified) | ≥ 30 days | — |
| **Pasha** (الباشا) | 👑 | 20+ | ≥ 5 (incl. photo reviews) | ≥ 60 days | — |

### 6.2 Progression Formula

```python
def calculate_rank(client):
    bookings = client.completed_bookings_count
    reviews  = client.verified_reviews_count
    photo_reviews = client.photo_reviews_count
    age_days = (now() - client.created_at).days
    no_shows_30d = client.no_shows_last_30_days

    # Demotion check first
    if no_shows_30d >= 3:
        return demote_one_rank(client.current_rank)

    # Promotion check
    if (bookings >= 20 and reviews >= 5
        and photo_reviews >= 1 and age_days >= 60):
        return PASHA

    if (bookings >= 10 and reviews >= 3
        and age_days >= 30):
        return PRO

    if bookings >= 5 and reviews >= 1:
        return REGULAR

    return NEWBIE
```

### 6.3 Demotion Rules

| Trigger | Effect | Recovery |
|---------|--------|----------|
| 3+ no-shows in 30 days | Demote by one Rank | 5 consecutive clean Bookings |
| 6 months inactivity | Demote to Newbie | Any new completed Booking recalculates |
| Fraud detected | Immediate Newbie + account review | Support intervention required |

### 6.4 Rank Benefits (Non-Financial)

| Benefit | Newbie | Regular | Pro | Pasha |
|---------|--------|---------|-----|-------|
| Basic app access | ✅ | ✅ | ✅ | ✅ |
| Skip waitlist | ❌ | ✅ | ✅ | ✅ |
| Exclusive Merchant deals | ❌ | ❌ | ✅ | ✅ |
| Priority support | ❌ | ❌ | ❌ | ✅ |
| Hidden offers | ❌ | ❌ | ❌ | ✅ |
| Early event access | ❌ | ❌ | ❌ | ✅ |
| Profile badge | 🔵 | 🟢 | ⚫ | 👑 |

> **⚠️ REMINDER:** Rank benefits are **non-financial**. Financial benefits (coin multipliers, discounts) come from **Subscription Tier** (Free/Premium/VIP). These systems are independent.

---

## 7. Client Subscription Billing Logic

### 7.1 Billing Cycles

| Tier | Monthly | Annual | Savings |
|------|---------|--------|---------|
| Free | 0 EGP | 0 EGP | — |
| Premium | 12 EGP/mo | 10 EGP/mo (120 EGP/year) | 24 EGP (17%) |
| VIP | 50 EGP/mo | 42 EGP/mo (500 EGP/year) | 100 EGP (17%) |

### 7.2 Upgrade (Immediate)

```
Client upgrades Free → Premium on Day 15 of month:
  Charge: 12 × (15/30) = 6 EGP (pro-rated)
  Multiplier: 2x effective IMMEDIATELY
  Next month: Full 12 EGP
```

### 7.3 Downgrade (End of Cycle)

```
Client downgrades VIP → Free:
  Current cycle: VIP features remain until cycle end
  Next cycle: Multiplier drops to 1x
  Coins already earned: KEPT (no clawback)
  Coins from future Bookings: 1x rate
```

### 7.4 Payment Failure

```
DAY 0:  Payment fails → retry in 24h
DAY 1:  Second attempt → retry in 24h
DAY 3:  Third attempt → Downgrade to Free
        Notification: "اشتراكك اتوقف. كوينزك في أمان."
        Coins: Preserved. Multiplier: 1x.
```

---

## 8. Online Payment Loyalty Bonus (+5% Coins)

### The Incentive

> **Any Client who pays online (not cash) earns +5% extra Booky Coins on that Booking.**

### How It Works

```
NORMAL EARNING (Cash):
  Booking 200 EGP × 1x (Free tier) = 200 Coins

WITH ONLINE BONUS:
  Booking 200 EGP × 1x (Free tier) = 200 Coins
  +5% online bonus: 200 × 0.05 = +10 Coins
  Total: 210 Coins

WITH VIP MULTIPLIER + ONLINE BONUS:
  Booking 200 EGP × 5x (VIP tier) = 1,000 Coins
  +5% online bonus: 1,000 × 0.05 = +50 Coins
  Total: 1,050 Coins
```

### Rules

| Rule | Value |
|------|-------|
| **Bonus Rate** | +5% of Coins earned from that Booking |
| **Applied After Multiplier** | Yes — bonus calculated on multiplied amount |
| **Eligible Methods** | All non-cash: VF Cash, InstaPay, Card, Meeza, Fawry |
| **Cash Eligible?** | No (incentive to go digital) |
| **Booky Coins Partial Pay** | If Client uses Coins + digital method, bonus applies to digital portion |
| **Display** | Green badge on digital methods: "اكسب +٥٪ كوينز إضافية" |
| **Ledger Entry** | `type: 'earn_online_bonus'`, separate from main earning |

### Nudge Messages

| Trigger | Message (Arabic) |
|---------|-------------------|
| Cash selected at checkout | "لو دفعت أونلاين، هتكسب +٥٪ كوينز إضافية!" |
| Post cash Booking | "المرة الجاية ادفع أونلاين واكسب [X] كوينز بدل [Y]!" |
| Client has 3+ consecutive cash Bookings | "جرب الدفع بفودافون كاش — سهل، سريع، وكوينز أكتر!" |

---

## 9. Economy Simulations & Scenarios

### Scenario A: Casual Client (Free Tier)

```
Ahmed — Free tier, Newbie rank
─────────────────────────────
Month 1:
  2 Bookings × 150 EGP avg = 300 EGP spent
  Coins earned: 300 (1x) + 10 (review) + 100 (first booking) = 410 Coins
  Login streak: 15 days × 5 = 75 Coins
  Total: 485 Coins

Month 2:
  3 Bookings × 120 EGP avg = 360 EGP spent
  Coins earned: 360 + 50 (photo review) + 25 (new Sector) = 435 Coins
  Cumulative: 920 Coins

Month 3:
  Uses 500 Coins → 50 EGP discount on 200 EGP Booking
  Remaining: 420 Coins + new earnings

RESULT: 50 EGP saved in 3 months. Rank: Regular (5 Bookings + 1 review).
```

### Scenario B: Power Client (VIP Tier)

```
Sara — VIP tier (50 EGP/mo), Regular rank
──────────────────────────────────────────
Month 1:
  8 Bookings × 200 EGP avg = 1,600 EGP spent
  Coins earned: 1,600 × 5 = 8,000 Coins (VIP 5x!)
  Bonuses: 10 (review) + 50 (photo) + 25 (new Sector) × 2 = 135
  Total: 8,135 Coins

  Redeems 2,500 Coins → 250 EGP discount (on 800 EGP event Booking)
  Remaining: 5,635 Coins

Month 2:
  6 Bookings × 180 EGP avg = 1,080 EGP
  Coins earned: 1,080 × 5 = 5,400
  Cumulative: 11,035 Coins

RESULT: 250+ EGP saved in Month 1 alone.
Net after VIP cost: 250 - 50 = +200 EGP. Rank: Pro (14 Bookings + 3 reviews).
```

### Scenario C: Merchant Coin-Back Campaign

```
Merchant: ملعب الأبطال (Sports)
Campaign: "كوينز مضاعفة — أيام الأسبوع فقط"
Duration: Monday-Wednesday, 2 weeks
Bonus: +100% extra Coins on all Bookings

Results after 2 weeks:
  32 Bookings during campaign (vs 18 normal = +78%)
  Merchant cost: 32 × avg 50 bonus Coins × 0.10 EGP = 160 EGP
  Merchant revenue from extra Bookings: 14 × 200 EGP avg = 2,800 EGP
  ROI: 2,800 / 160 = 17.5x

  Side effect: 12 new Clients discovered the venue via boosted visibility
```

---

## 10. Anti-Abuse & Fraud Prevention

### 10.1 Earning Abuse Prevention

| Attack Vector | Detection | Response |
|---------------|-----------|----------|
| **Fake Bookings** (book & cancel to farm Coins) | Coins only credited on `COMPLETED` status, 24h after completion | No Coins for cancelled/no-show |
| **Self-Booking** (Client books own Merchant account) | Phone number cross-check, IP/device fingerprinting | Block + account review |
| **Review Farming** (fake reviews for bonus Coins) | NLP spam detection, min 20 chars, photo EXIF validation | Review rejected, Coins clawed back |
| **Referral Fraud** (fake accounts for referral Coins) | Phone verification, device fingerprinting, behavioral analysis | Referral Coins frozen pending review |
| **Bulk Bot Signups** | Rate limiting, CAPTCHA after 3 OTP requests, device trust scoring | OTP blocked, account flagged |

### 10.2 Redemption Abuse Prevention

| Attack Vector | Detection | Response |
|---------------|-----------|----------|
| **Coin Dump** (redeem all Coins at once on max-discount Bookings) | 30% max discount cap per Booking | Enforced at checkout |
| **Merchant Collusion** (Merchant inflates price, Client uses Coins) | Price monitoring vs. Sector averages, anomaly detection | Price flagged for review |
| **Account Sharing** (share login for Coin pooling) | Device fingerprinting, unusual location patterns | Account locked, verification required |

### 10.3 Coin Clawback Rules

| Scenario | Action |
|----------|--------|
| Booking cancelled after Coins credited | Coins deducted from balance |
| Booking disputed & refunded | Coins deducted |
| Fraud confirmed | Full Coin balance frozen, account reviewed |
| Review removed (spam/abuse) | Bonus Coins deducted |

---

## 11. Data Model & Ledger Design

### Coins Ledger (Immutable Append-Only)

```sql
CREATE TABLE coins_ledger (
    entry_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id       UUID NOT NULL REFERENCES clients(client_id),
    type            VARCHAR(20) NOT NULL,
    -- type: 'earn_booking' | 'earn_review' | 'earn_photo_review' |
    --       'earn_referral' | 'earn_login' | 'earn_sector_first' |
    --       'earn_birthday' | 'earn_profile' | 'earn_first_booking' |
    --       'earn_campaign' | 'earn_online_bonus' |
    --       'redeem' | 'clawback' | 'expire' | 'admin_adjust'
    amount          INTEGER NOT NULL,
    -- Positive for earning, negative for burning/clawback
    balance_after   INTEGER NOT NULL,
    -- Running balance after this entry
    reference_id    UUID,
    -- FK to booking_id, review_id, referral_id, campaign_id, etc.
    reference_type  VARCHAR(30),
    -- 'booking' | 'review' | 'referral' | 'campaign' | 'admin'
    metadata        JSONB,
    -- { "booking_value": 200, "multiplier": 5, "tier": "vip" }
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- NEVER UPDATE or DELETE rows. This is an audit-grade ledger.

CREATE INDEX idx_coins_client ON coins_ledger(client_id);
CREATE INDEX idx_coins_type ON coins_ledger(type);
CREATE INDEX idx_coins_created ON coins_ledger(created_at);
```

### Client Coins Summary (Materialized View)

```sql
CREATE MATERIALIZED VIEW client_coins_summary AS
SELECT
    client_id,
    SUM(amount) AS current_balance,
    SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) AS total_earned,
    SUM(CASE WHEN type = 'redeem' THEN ABS(amount) ELSE 0 END) AS total_redeemed,
    SUM(CASE WHEN type = 'clawback' THEN ABS(amount) ELSE 0 END) AS total_clawed_back,
    SUM(CASE WHEN type = 'expire' THEN ABS(amount) ELSE 0 END) AS total_expired,
    MAX(created_at) AS last_activity
FROM coins_ledger
GROUP BY client_id;

-- Refresh every 5 minutes or on significant events
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/clients/me/coins` | Current balance + summary stats |
| `GET` | `/clients/me/coins/history` | Paginated ledger entries |
| `POST` | `/clients/me/coins/redeem` | Redeem Coins at checkout |
| `GET` | `/clients/me/coins/estimate?booking_value=200` | Preview Coins earned for a Booking |
| `GET` | `/clients/me/rank` | Current Rank + progress to next |
| `GET` | `/merchants/me/coins/settings` | Merchant's Coin acceptance config |
| `PUT` | `/merchants/me/coins/settings` | Update acceptance/limits |
| `POST` | `/merchants/me/coins/campaign` | Create Coin-back campaign |

---

## 12. Gherkin Scenarios

### Scenario 1: Client Earns Coins from a Completed Booking

```gherkin
Feature: Booky Coins Earning

  Scenario: Free tier Client earns base Coins from a completed Booking
    Given a Client "Ahmed" is on the Free Subscription Tier (1x multiplier)
    And Ahmed has a completed Booking:
      | booking_id | BK-260216-0023 |
      | value      | 200 EGP        |
      | state      | COMPLETED      |
    When 24 hours pass after Booking completion
    Then Ahmed's Coins balance increases by 200 Coins
    And the coins_ledger records:
      | type         | earn_booking |
      | amount       | 200          |
      | metadata     | {"booking_value": 200, "multiplier": 1, "tier": "free"} |

  Scenario: VIP tier Client earns 5x Coins
    Given a Client "Sara" is on the VIP Subscription Tier (5x multiplier)
    And Sara has a completed Booking of 300 EGP
    When 24 hours pass after Booking completion
    Then Sara's Coins balance increases by 1,500 Coins (300 × 5)
    And the ledger metadata shows: {"multiplier": 5, "tier": "vip"}
```

### Scenario 2: Client Redeems Coins at Checkout

```gherkin
  Scenario: Client redeems Coins for a discount on a Booking
    Given a Client "Nour" has a Coins balance of 750 Coins
    And Nour is at checkout for a 200 EGP Service (Health & Beauty)
    And the max discount is 30% of Booking value = 60 EGP = 600 Coins

    When Nour chooses to redeem 500 Coins (= 50 EGP discount)
    Then the checkout summary shows:
      | original_price | 200 EGP |
      | coins_discount | -50 EGP |
      | deposit        | 50 EGP  | # 25% of 200 (ORIGINAL price)
      | remaining      | 100 EGP |
    And Nour's Coins balance is reduced by 500
    And the Merchant receives 150 EGP total (absorbs the 50 EGP discount)

  Scenario: Client tries to redeem more than 30% cap
    Given a Client has 2,000 Coins
    And the Booking value is 200 EGP (max 30% = 60 EGP = 600 Coins)
    When the Client tries to redeem 1,000 Coins
    Then the system caps redemption at 600 Coins (60 EGP discount)
    And shows: "أقصى خصم: ٣٠٪ من قيمة الحجز"
```

### Scenario 3: Rank Demotion from No-Shows

```gherkin
Feature: Rank System

  Scenario: Client loses Rank due to repeated no-shows
    Given a Client "Omar" has Rank "Regular" (معتمد)
    And Omar has 2 no-shows in the last 30 days
    When Omar triggers a 3rd no-show
    Then Omar's Rank is demoted from "Regular" to "Newbie" (مبتدئ)
    And Omar receives a push notification:
      "رتبتك نزلت بسبب عدم الحضور المتكرر. 5 حجوزات كاملة هترجعك"
    And Omar needs 5 consecutive completed Bookings to restore "Regular" Rank
```

### Scenario 4: Client Subscription Upgrade

```gherkin
Feature: Client Subscription Billing

  Scenario: Client upgrades from Free to Premium mid-cycle
    Given a Client "Laila" is on the Free tier
    And the current day is Day 15 of the billing month
    When Laila upgrades to Premium (12 EGP/mo)
    Then the system charges a pro-rated amount: 12 × (15/30) = 6 EGP
    And Laila's multiplier becomes 2x IMMEDIATELY
    And her next Booking earns Coins at 2x rate
    And next month she is charged the full 12 EGP
```

---

## 13. Edge Cases

| # | Edge Case | Business Rule |
|---|-----------|---------------|
| 1 | **Client earns Coins, then Booking is disputed and refunded** | Coins clawed back from balance. If balance insufficient, balance goes negative (blocked from redeeming). |
| 2 | **Client redeems Coins, then cancels Booking within cancellation window** | Coins refunded to Client's balance. Deposit refunded to payment method. |
| 3 | **Client redeems Coins, then cancels OUTSIDE cancellation window** | Coins are NOT refunded (they were spent). Deposit forfeited to Merchant per cancellation rules. |
| 4 | **Merchant disables Coin acceptance mid-Booking** | Existing Bookings with Coin redemptions are honored. New Bookings follow new settings. |
| 5 | **Client's Coins expire (12 months inactivity)** | All Coins set to 0. Ledger entry: `type: 'expire'`. Client notified 30 days before expiry. |
| 6 | **VIP Client downgrades during a Booking's 24h Coin credit window** | Coins earned at the tier that was active when the Booking was COMPLETED (VIP 5x). |
| 7 | **Client tries to redeem Coins for a Deposit payment** | Blocked at checkout. Display: "الكوينز مش متاحة لدفع العربون — العربون لازم يكون فلوس حقيقية." |
| 8 | **Merchant Coin-back campaign ends while Client is at checkout** | Campaign rate honored for any checkout started before expiry. |
| 9 | **Subscription payment fails and Client has a pending Booking** | Multiplier drops to 1x for future Bookings. Pending Booking Coins are not affected (already calculated at old rate if completed before downgrade). |

---

> **📌 This document is the mathematical source of truth for the Booky Coins economy, Client Subscription Tiers, and the Rank system. If any other document's numbers conflict with these, update the other document. Source: [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md) §8 (Rank System), §9 (Booky Coins), §4 (Global Rules).**
>
> *Booky Center: بضغطة واحدة.. ميعادك في جيبك*

