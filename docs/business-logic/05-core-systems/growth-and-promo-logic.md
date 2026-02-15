# 📂 05-Core Systems: Growth & Promo Logic

## *Coupons, Referrals, Campaigns & Booky Coins Promotions*

**Parent:** [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md)
**Cross-Refs:** [booking-lifecycle.md](mdc:docs/business-logic/02-client/booking-lifecycle.md), [wallet-and-payouts.md](mdc:docs/business-logic/03-merchant/wallet-and-payouts.md), [financial-oversight.md](mdc:docs/business-logic/04-admin-platform/financial-oversight.md), [notification-matrix.md](mdc:docs/business-logic/05-core-systems/notification-matrix.md)
**Version:** 1.0 | **Date:** February 15, 2026

---

## Table of Contents

1. [Growth Strategy Overview](#1-growth-strategy-overview)
2. [Coupon System](#2-coupon-system)
3. [Referral Program](#3-referral-program)
4. [Booky Coins Promotions](#4-booky-coins-promotions)
5. [Merchant-Funded Promotions](#5-merchant-funded-promotions)
6. [Platform Campaigns](#6-platform-campaigns)
7. [Abuse Prevention](#7-abuse-prevention)
8. [Gherkin Scenarios](#8-gherkin-scenarios)
9. [Edge Cases](#9-edge-cases)

---

## 1. Growth Strategy Overview

### Growth Levers

```
┌───────────────────────────────────────────────────────────────┐
│                     BOOKY CENTER GROWTH ENGINE                 │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  ACQUISITION (Get new users)                                  │
│  ═══════════════════════════                                  │
│  1. Referral Program (Client → Client)                        │
│  2. Referral Program (Client → Merchant)                      │
│  3. Platform Coupons (First Booking discount)                 │
│                                                                │
│  ACTIVATION (First valuable action)                           │
│  ═══════════════════════════════════                           │
│  4. First Booking Coupon ("خصم أول حجز")                      │
│  5. Merchant Onboarding Bonus (First Service = featured)      │
│                                                                │
│  RETENTION (Keep them coming back)                            │
│  ══════════════════════════════════                            │
│  6. Booky Coins Economy (earn → redeem cycle)                 │
│  7. Merchant Coupons / Stories                                │
│  8. Rebook Suggestions + Notifications                        │
│                                                                │
│  REVENUE (Monetize)                                           │
│  ═════════════════                                            │
│  9. Subscription Tier upsells (Premium / VIP)                 │
│  10. Merchant Subscription Tier upgrades                      │
│  11. Commission on Bookings                                   │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

---

## 2. Coupon System

### 2.1 Coupon Types

| Type | Mechanic | Example | Who Pays? |
|------|----------|---------|-----------|
| **Fixed Amount** | Flat EGP discount off the total | "خصم 50 ج.م" | See §2.3 |
| **Percentage** | % discount off the total (with cap) | "خصم 20% (بحد أقصى 100 ج.م)" | See §2.3 |
| **Free Add-On** | Specific add-on at 0 EGP | "غسيل شعر مجاني مع أي حجز" | Merchant always |
| **Free Deposit** | Booky covers the deposit | "احجز من غير عربون!" | Booky always |

### 2.2 Coupon Data Model

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `coupon_id` | UUID v4 | Auto | System-generated | Unique identifier |
| `code` | String | ✅ | 4–20 chars, alphanumeric, uppercase | User-entered code (e.g., `WELCOME50`) |
| `type` | Enum | ✅ | `FIXED` / `PERCENTAGE` / `FREE_ADDON` / `FREE_DEPOSIT` | Discount mechanic |
| `value` | Integer | ✅ | > 0 | Amount (EGP) or percentage (1–100) |
| `max_discount` | Integer | Conditional | Required if `PERCENTAGE`. Max cap in EGP. | Prevents runaway discounts |
| `min_order_value` | Integer | ❌ | Default 0 | Minimum Service total to apply coupon |
| `funded_by` | Enum | ✅ | `BOOKY` / `MERCHANT` / `SPLIT` | Who bears the cost |
| `split_pct_booky` | Integer | Conditional | Required if `SPLIT`. 0–100. | Booky's share of the discount cost |
| `max_uses_total` | Integer | ❌ | Default unlimited | Total redemptions allowed |
| `max_uses_per_client` | Integer | ❌ | Default 1 | Per-Client redemption limit |
| `valid_from` | Timestamp | ✅ | ISO 8601 UTC | Start of validity |
| `valid_to` | Timestamp | ✅ | ISO 8601 UTC | End of validity |
| `sector_filter` | Enum[] | ❌ | Valid sector IDs | Restrict to specific Sectors |
| `merchant_filter` | UUID[] | ❌ | Valid merchant IDs | Restrict to specific Merchants |
| `new_clients_only` | Boolean | ❌ | Default `false` | Only for Clients with 0 previous Bookings |
| `is_active` | Boolean | Auto | Default `true` | Toggleable |
| `created_by` | Enum | Auto | `ADMIN` / `MERCHANT` | Creator type |

### 2.3 Who Pays the Discount? (Critical Business Rule)

| Coupon Creator | Who Pays? | How? |
|---------------|-----------|------|
| **Booky (Platform Coupon)** | **Booky** | Booky deducts from its own revenue. Merchant receives full commission-deducted amount as if no coupon was used. |
| **Merchant (Merchant Coupon)** | **Merchant** | Discount deducted from Merchant's earnings. Booky still takes commission on the ORIGINAL price. |
| **Split** | **Both** | Cost split per `split_pct_booky`. Example: 70% Booky / 30% Merchant. |

### 2.4 Coupon Application to Financial Flow

#### Example: Platform Coupon (Booky Pays)

```
Service Price:        200 EGP
Coupon:              WELCOME50 (Fixed, 50 EGP, funded by Booky)
──────────────────────────────────────
Client pays:          150 EGP total
  Deposit (25%):      37 EGP (25% of 150)
  Remaining:          113 EGP

Merchant receives:    200 EGP - commission (as if full price)
Booky bears:          50 EGP cost (deducted from Booky revenue)
Booky commission:     20 EGP (fixed fee on 200 EGP original)
Booky net:           -30 EGP (commission - coupon cost)
```

#### Example: Merchant Coupon (Merchant Pays)

```
Service Price:        200 EGP
Coupon:              BARBER20 (Percentage, 20%, max 100, funded by Merchant)
Discount:            20% of 200 = 40 EGP
──────────────────────────────────────
Client pays:          160 EGP total
  Deposit (25%):      40 EGP (25% of 160)
  Remaining:          120 EGP

Booky commission:     20 EGP (fixed fee on ORIGINAL 200 EGP)
Merchant receives:    160 EGP - 20 EGP commission = 140 EGP
Merchant effective:   140 EGP (bore the 40 EGP discount + paid commission on original)
```

> **Critical Rule:** Booky's commission is ALWAYS calculated on the **original (pre-discount) Service price**. This ensures Merchant coupons don't reduce Booky's revenue.

### 2.5 Coupon Stacking

| Rule | Detail |
|------|--------|
| **No stacking** | Only 1 coupon per Booking. Cannot combine platform + merchant coupons. |
| **Priority** | If a Client has both: show both, let them choose the better deal. |
| **Auto-apply** | Phase 2: System auto-suggests the best available coupon at checkout. |

---

## 3. Referral Program

### 3.1 Client → Client Referral

| Aspect | Detail |
|--------|--------|
| **Mechanic** | Referrer gets 50 Booky Coins when the referee completes their **first Booking**. Referee gets a coupon for their first Booking. |
| **Referrer Reward** | **50 Booky Coins** (credited after referee's first Booking is completed, not just registered) |
| **Referee Reward** | **Coupon: `FRIEND` — 30 EGP off first Booking** (funded by Booky, min order 100 EGP) |
| **Referral Code** | Auto-generated per Client: `REF-{first_name_4chars}-{random_4digits}` (e.g., `REF-AHME-4821`) |
| **Sharing** | Client can share via WhatsApp, link, or QR code from the app |

### 3.2 Referral Rules

| Rule | Detail |
|------|--------|
| **Max referrals per Client** | Unlimited referrals, but max **500 Booky Coins per month** from referrals |
| **Self-referral prevention** | Referee must register with a DIFFERENT phone number AND different device fingerprint |
| **Referee must complete Booking** | Referrer reward is only credited after referee's first Booking is COMPLETED (QR Handshake scanned or No-Show triggered). Cancelled Bookings don't count. |
| **Retroactive** | If referee registers without a code, they CANNOT add one later. Must use code at registration. |
| **Expiry** | Referee's `FRIEND` coupon expires 30 days after registration. |

### 3.3 Client → Merchant Referral (Phase 2)

| Aspect | Detail |
|--------|--------|
| **Mechanic** | Client refers a Merchant (their favorite barber, gym, etc.). If the Merchant signs up and receives their first Booking, the Client earns 100 Booky Coins. |
| **Referrer Reward** | 100 Booky Coins |
| **Merchant Incentive** | First month of Starter Subscription free |
| **Tracking** | Referral link includes Client's referral code. Merchant onboarding wizard captures the referral source. |

---

## 4. Booky Coins Promotions

> Full Booky Coins economy rules are in [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md) §9. This section covers promotional uses.

### 4.1 Earning Events (Promotional)

| Event | Coins Earned | Condition |
|-------|-------------|-----------|
| **First Booking ever** | 50 | One-time bonus |
| **Referral success** | 50 | Per successful referral (monthly cap: 500) |
| **Dispute win (compensation)** | 20 | Auto-awarded by system |
| **Birthday Bonus** | 30 | If DOB is on file. Annual. |
| **5-Star Review** | 5 | Per review (max 3 reviews per day earn Coins) |
| **Rank Promotion** | 100 | When Client moves to a higher Rank |

### 4.2 Redemption Rules

| Rule | Detail |
|------|--------|
| **Conversion Rate** | 10 Booky Coins = 1 EGP discount |
| **Max discount per Booking** | 50% of Service price (prevents 100% free Bookings) |
| **Min Coins to redeem** | 100 Booky Coins (= 10 EGP) |
| **Cannot combine with coupon** | Booky Coins OR coupon. Not both. |
| **No cash-out** | Booky Coins cannot be converted to cash or transferred to Wallet. |
| **Expiry** | 12 months from earn date. FIFO (oldest Coins used first). |

### 4.3 Promotional Campaigns Using Coins

| Campaign | Mechanic | Duration |
|----------|----------|----------|
| **"Double Coins Week"** | All earning events give 2× Coins | 1 week |
| **"Redeem Boost"** | 10 Coins = 2 EGP (instead of 1 EGP) for Bookings in a specific Sector | 3 days |
| **"Zero-Deposit"** | Use Coins to cover the Deposit entirely | Weekend flash sale |

---

## 5. Merchant-Funded Promotions

### 5.1 Merchant Coupons

> Merchants can create their own coupons from the Merchant Dashboard.

| Ability | Free Tier | Starter | Growth | Pro |
|---------|-----------|---------|--------|-----|
| **Create coupons** | ❌ | ✅ (2/month) | ✅ (10/month) | ✅ (Unlimited) |
| **Coupon types** | — | Fixed only | Fixed + Percentage | All types |
| **Max discount** | — | 50 EGP | 200 EGP | No limit |
| **Sector targeting** | — | Own Services only | Own Services only | Own Services only |

### 5.2 Merchant Coupon Creation (Dashboard)

```
┌──────────────────────────────────────────────────────────────────┐
│  🎟️ إنشاء كوبون جديد                                            │
│                                                                   │
│  كود الكوبون:  [ SUMMER20 ]  (أو اضغط "توليد تلقائي")            │
│                                                                   │
│  نوع الخصم:                                                      │
│  ○ مبلغ ثابت   ● نسبة مئوية                                      │
│                                                                   │
│  قيمة الخصم:   [ 20 ] %                                          │
│  الحد الأقصى:  [ 100 ] ج.م                                       │
│                                                                   │
│  الحد الأدنى للحجز:  [ 200 ] ج.م                                  │
│                                                                   │
│  الخدمات المشمولة:                                                │
│  ☑️ قص شعر    ☑️ صبغة شعر    ☐ ترطيب                             │
│                                                                   │
│  عدد مرات الاستخدام:  [ 50 ] (إجمالي)  [ 1 ] (لكل عميل)         │
│  صالح من:   [ 2026-02-15 ] إلى [ 2026-03-15 ]                    │
│                                                                   │
│  ⚠️ ملحوظة: تكلفة الخصم بتتحمل من إيراداتك.                       │
│     عمولة بوكي بتتحسب على السعر الأصلي.                           │
│                                                                   │
│  [ إنشاء الكوبون ✅ ]                                              │
└──────────────────────────────────────────────────────────────────┘
```

### 5.3 Stories as Promotions

> Merchants can post time-limited "Stories" (العرض السريع) visible to nearby Clients.

| Rule | Detail |
|------|--------|
| **Duration** | Stories auto-expire after 24 hours |
| **Content** | Photo/video + short text + optional coupon code |
| **Visibility** | Clients within X km (default 10km, configurable) + Clients who favorited the Merchant |
| **Notification** | Clients who opted-in to Story Alerts receive a push notification |
| **Limit** | Free: 1/week. Starter: 3/week. Growth: 7/week. Pro: Unlimited. |

---

## 6. Platform Campaigns

### 6.1 Campaign Types

| Campaign | Target | Objective | Funded By |
|----------|--------|-----------|-----------|
| **First Booking Discount** | New Clients (0 Bookings) | Activation | Booky |
| **Sector Push** | All Clients | Boost specific Sector GMV | Booky (or Split) |
| **Seasonal** | All Clients | Ramadan / Summer / Back-to-School | Booky |
| **Merchant Re-activation** | Dormant Merchants (30+ days no Bookings) | Retention | Booky |
| **Client Win-Back** | Churned Clients (60+ days no Booking) | Retention | Booky |

### 6.2 Campaign Creation (Admin Dashboard)

| Field | Description |
|-------|-------------|
| **Name** | Internal campaign name |
| **Target Audience** | Rules-based (e.g., "Clients with 0 Bookings in `sports`") |
| **Coupon** | Linked coupon (auto-generated or manual code) |
| **Channels** | Notification channels: Push, WhatsApp, Email, In-App |
| **Schedule** | Start/end dates. Notification send time. |
| **Budget** | Max total discount cost Booky will bear |
| **Success Metric** | What counts as conversion (e.g., "First Booking completed") |

### 6.3 Budget Control

| Rule | Detail |
|------|--------|
| **Campaign budget** | Admin sets max total EGP Booky will spend on discount costs |
| **Auto-pause** | When budget is 80% consumed: alert Finance Admin. At 100%: campaign auto-pauses. |
| **Coupon usage vs. budget** | Each redemption deducts `coupon_value` from campaign budget |
| **Daily cap** | Optional: max redemptions per day to spread budget |
| **Real-time tracking** | Dashboard shows: budget used, budget remaining, redemptions, cost per acquisition (CPA) |

---

## 7. Abuse Prevention

### 7.1 Common Abuse Patterns

| # | Pattern | Description | Prevention |
|---|---------|-------------|------------|
| 1 | **Multi-accounting** | Client creates multiple accounts to use "new Client" coupons repeatedly | Detect: same device fingerprint, same phone prefix, same payment method. Block: 2nd account auto-flagged. |
| 2 | **Coupon sharing** | Client shares a "personal" coupon code on social media | Codes tied to Client ID. Even if code is shared, it's validated against `max_uses_per_client`. |
| 3 | **Referral farming** | Client creates fake accounts to earn referral Coins | Referee must COMPLETE a Booking (not just register). Different phone + different device required. Monthly cap: 500 Coins from referrals. |
| 4 | **Merchant self-coupon** | Merchant uses their own coupon on a self-Booking | Self-booking detection (see [financial-oversight.md](mdc:docs/business-logic/04-admin-platform/financial-oversight.md) §6). Coupons invalid if Client = Merchant (same phone/device). |
| 5 | **Coupon + Cancel Loop** | Client books with coupon, cancels, rebooks with same coupon | Coupon is "consumed" at Booking confirmation. Refund does NOT restore coupon usage. |
| 6 | **Price inflation + discount** | Merchant inflates Service price, creates coupon to bring it to "real" price, misleading Clients | Admin audit: flag Merchants who raise prices by >20% and create a coupon within 48 hours. |

### 7.2 Automated Safeguards

| Safeguard | Logic |
|-----------|-------|
| **Coupon consumption is atomic** | Coupon use count incremented at Booking confirmation, not at checkout display. |
| **Device fingerprinting** | Referral and "new Client" coupons validate unique device. |
| **Velocity checks** | >5 coupon redemptions from the same IP in 1 hour → flag for review. |
| **Budget depletion alerts** | Finance Admin alerted when campaign budget hits 80%. |
| **Monthly referral cap** | Hard limit of 500 Booky Coins per Client from referrals. System enforced. |

---

## 8. Gherkin Scenarios

### Scenario 1: Platform Coupon — First Booking

```gherkin
Feature: Coupon System

  Scenario: New Client uses first-booking coupon (Booky-funded)
    Given a new Client "Sara" with 0 previous Bookings
    And a platform coupon exists:
      | code              | WELCOME50          |
      | type              | FIXED              |
      | value             | 50                 |
      | funded_by         | BOOKY              |
      | new_clients_only  | true               |
      | min_order_value   | 100                |
      | max_uses_per_client | 1                |
      | valid_to          | 2026-03-31         |

    When Sara books a Service:
      | service     | قص شعر       |
      | base_price  | 200 EGP     |
      | add_ons     | غسيل (30)   |
      | total       | 230 EGP     |
    And enters coupon code "WELCOME50"

    Then the system validates:
      | check                     | result |
      | Client has 0 Bookings     | ✅     |
      | Total (230) ≥ min (100)  | ✅     |
      | Coupon not expired        | ✅     |
      | Usage per Client < max    | ✅     |
    And the checkout shows:
      | line              | amount    |
      | Service + Add-on  | 230 EGP  |
      | Coupon (WELCOME50)| -50 EGP  |
      | Client pays       | 180 EGP  |
      | Deposit (25%)     | 45 EGP   |
      | Remaining         | 135 EGP  |
    And Merchant receives 230 - 20 (commission) = 210 EGP equivalent
    And Booky bears 50 EGP discount cost
    And Booky earns 20 EGP commission (on original 230 EGP)
    And Booky net for this Booking = 20 - 50 = -30 EGP (acquisition cost)
```

### Scenario 2: Merchant Coupon — Percentage with Cap

```gherkin
  Scenario: Client uses a Merchant-funded percentage coupon
    Given Merchant "صالون جوليا" created a coupon:
      | code              | SUMMER20           |
      | type              | PERCENTAGE         |
      | value             | 20                 |
      | max_discount      | 100                |
      | funded_by         | MERCHANT           |
      | min_order_value   | 200                |

    When a Client books "صبغة شعر" (variable, min 500 EGP)
    And enters coupon "SUMMER20"
    Then:
      | calculation       | value              |
      | base_price (min)  | 500 EGP            |
      | 20% of 500        | 100 EGP            |
      | cap               | 100 EGP            |
      | discount applied  | 100 EGP            |
      | Client pays       | 400 EGP            |
      | Deposit (25% of min - discount) | 100 EGP |
      | Booky commission  | On ORIGINAL 500 EGP |

    And the Merchant bears the 100 EGP discount
    And Booky's commission is calculated on the pre-discount amount
```

### Scenario 3: Referral — Full Lifecycle

```gherkin
Feature: Referral Program

  Scenario: Client refers a friend who completes a Booking
    Given Client "Ahmed" has referral code "REF-AHME-4821"
    And Ahmed shares the referral link via WhatsApp

    When "Nour" clicks the referral link
    And registers with phone "+201198765432"
    And the system validates:
      | check                     | result |
      | Phone ≠ Ahmed's phone    | ✅     |
      | Device ≠ Ahmed's device  | ✅     |
    Then Nour receives:
      | reward              | detail                            |
      | Coupon: FRIEND       | 30 EGP off first Booking (Booky) |
      | Expiry              | 30 days from registration         |
    And Ahmed does NOT receive any reward yet

    When Nour books "ملعب بادل" using coupon "FRIEND"
    And the Booking is completed (QR Handshake scanned)
    Then Ahmed receives 50 Booky Coins
    And Ahmed is notified: "صاحبك نور حجز أول حجز — كسبت 50 عملة بوكي! 🎉"
    And the referral is recorded in the referral ledger
```

### Scenario 4: Coupon + Cancel Abuse Prevention

```gherkin
Feature: Coupon Abuse Prevention

  Scenario: Client cancels after using coupon — coupon is NOT restored
    Given Client "Omar" used coupon "WELCOME50" for Booking BK-260216-0010
    And the Booking was confirmed (Deposit paid)

    When Omar cancels the Booking (> 24 hours before Slot)
    Then the Deposit is refunded (per cancellation policy)
    But the coupon "WELCOME50" is NOT restored to Omar's account
    And if Omar tries to apply "WELCOME50" on a new Booking:
      Then the system rejects: "الكوبون ده اتستخدم قبل كده."
```

### Scenario 5: Referral Farming Detection

```gherkin
Feature: Referral Abuse Detection

  Scenario: System detects referral farming
    Given Client "Ahmed" has earned 480 Booky Coins from referrals this month
    And a new referral "Fake Account" completes a Booking

    When the system processes the referral reward:
      480 + 50 = 530 > 500 (monthly cap)
    Then Ahmed earns only 20 Booky Coins (capped at 500 total)
    And Ahmed is notified: "وصلت للحد الأقصى من عملات الإحالة الشهر ده (500) — استنى الشهر الجاي! 🏆"

  Scenario: System blocks same-device referral
    Given Client "Ahmed" shares referral code "REF-AHME-4821"
    When someone registers with a different phone but the SAME device fingerprint
    Then the referral is flagged
    And NO referral reward is given to Ahmed
    And the new account is created normally (not blocked) but flagged for monitoring
```

---

## 9. Edge Cases

| # | Edge Case | Rule |
|---|-----------|------|
| 1 | **Coupon expires during checkout** | If Client entered the coupon before expiry but pays after: honor it (5-minute grace period from code entry). After 5 min: reject. |
| 2 | **Coupon valid for Sector X but Client books Sector Y** | Reject coupon: "الكوبون ده صالح لقطاع [X] بس — اختار خدمة من القطاع ده." |
| 3 | **Merchant deletes coupon while Client is in checkout** | Honor the coupon for the current checkout session (already validated). New Bookings won't see it. |
| 4 | **Client has 600 Booky Coins, tries to redeem 600 on a 50 EGP Service** | Max discount = 50% of Service price = 25 EGP = 250 Coins. Only 250 Coins redeemed. |
| 5 | **Platform coupon budget runs out mid-day** | Campaign auto-pauses. Clients who already started checkout with the coupon: honored. New attempts: "الكوبون ده مش متاح حاليًا." |
| 6 | **Referrer deletes their account** | Pending referral rewards are forfeited. Already-earned Coins are not affected (they're in the Coins ledger). |
| 7 | **Coupon and Booky Coins selected simultaneously** | Not allowed. UI shows: "اختار يا كوبون يا عملات بوكي — مش الاتنين." Prompt Client to choose. |
| 8 | **Merchant creates a coupon with value > Service price** | System caps discount at 100% of Service price. Client pays 0 for the Service. Deposit = 0. Merchant bears the full cost. |
| 9 | **Referral link opened on desktop (no app installed)** | Redirect to web landing page with deep link. If Client installs app from there: referral code auto-applied on first launch. Uses deferred deep linking (Branch / Firebase Dynamic Links). |
| 10 | **Two platform coupons apply to the same Booking** | Only 1 coupon per Booking (no stacking). Client chooses the better one. System suggests the higher-value coupon. |
| 11 | **Merchant raises price 30% then immediately creates a 30% coupon** | Auto-flagged by admin audit: "Price increase + coupon creation within 48h." Admin reviews. Possible content moderation warning. |
| 12 | **"Free Deposit" coupon on a high-value Booking** | Allowed. Booky covers the entire Deposit. If Client no-shows: Booky loses the deposit amount (borne as acquisition cost). Use sparingly. |

---

> **📌 Source of Truth:** This document aligns with [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md) §9 (Booky Coins Economy), §10 (Revenue & Commission), §6 (Subscription Models). Referral and Coupon logic connects to [booking-lifecycle.md](mdc:docs/business-logic/02-client/booking-lifecycle.md) (Checkout) and [wallet-and-payouts.md](mdc:docs/business-logic/03-merchant/wallet-and-payouts.md) (Merchant earnings).
>
> *Booky Center: بضغطة واحدة.. ميعادك في جيبك* ✨


