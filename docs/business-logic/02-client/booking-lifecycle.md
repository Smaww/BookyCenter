# 📂 02-Client: Booking Lifecycle

## *Search → Select Service → Choose Slot → Pay Deposit (Escrow) → Confirmation*

**Parent:** [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md)
**Version:** 1.0 | **Date:** February 15, 2026
**Persona:** The Client (العميل) — an authenticated end-user who searches for and books Services.

---

## Table of Contents

1. [The Booking Flow (End-to-End)](#1-the-booking-flow-end-to-end)
2. [The Escrow Model (Critical)](#2-the-escrow-model-critical)
3. [Cancellation Policy](#3-cancellation-policy)
4. [Booking States](#4-booking-states)
5. [Gherkin Scenarios](#5-gherkin-scenarios)
6. [Edge Cases](#6-edge-cases)

---

## 1. The Booking Flow (End-to-End)

### The 3-Tap Rule

> **Design Constraint:** A Client must go from viewing a Merchant profile to a confirmed Booking in **3 taps maximum**: Select → Confirm/Pay → Done.

### Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                         BOOKING LIFECYCLE                             │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   1. SEARCH                                                           │
│      Client enters location + Sector on Hero Search Bar               │
│      → System returns ranked Merchant cards                           │
│                                                                       │
│   2. SELECT MERCHANT                                                  │
│      Client taps a Merchant card                                      │
│      → Full profile: photos, reviews, Services, pricing, distance     │
│                                                                       │
│   3. SELECT SERVICE                                                   │
│      Client picks a specific Service from the Merchant's catalog      │
│      → Price (EGP), duration, Deposit % displayed                     │
│                                                                       │
│   4. CHOOSE SLOT         [TAP 1]                                      │
│      Client picks an available Slot from the real-time calendar       │
│      → Slot is soft-held for 5 minutes during checkout                │
│                                                                       │
│   5. CONFIRM & PAY       [TAP 2]                                      │
│      (Auth required — Visitor → Client at this point)                 │
│      Client reviews: Service, Slot, Merchant, Deposit amount          │
│      Client selects payment method & pays Deposit                     │
│      → Deposit goes to BOOKY ESCROW (NOT to Merchant)                 │
│                                                                       │
│   6. CONFIRMATION        [TAP 3 = Done]                               │
│      System confirms Booking                                          │
│      → Booking ID: BK-YYMMDD-XXXX                                    │
│      → Push notification to Client + Merchant                         │
│      → Calendar event created (both sides)                            │
│      → Reminder scheduled (1hr before Slot)                           │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Step Details

| Step | Client Action | System Action | State |
|------|--------------|---------------|-------|
| Search | Enters location + Sector | Geo-query → returns Merchants sorted by relevance + distance | — |
| Select Merchant | Taps card | Loads full profile (lazy) | — |
| Select Service | Taps Service from catalog | Displays price, duration, Deposit % | — |
| Choose Slot | Taps available Slot | Soft-hold Slot for 5 min. Start checkout timer. | `SLOT_HELD` |
| Confirm & Pay | Reviews summary → Pays Deposit | Process payment → Move funds to Booky Escrow | `PENDING_PAYMENT` → `CONFIRMED` |
| Confirmation | Views confirmation screen | Send notifications, create reminders | `CONFIRMED` |

---

## 2. The Escrow Model (Critical)

> **⚠️ THIS IS THE MOST IMPORTANT BUSINESS RULE IN THE ENTIRE PLATFORM.**

### The Core Principle

**When a Client pays a Deposit, the money is held by Booky Center in escrow. The Deposit is NOT transferred to the Merchant at the time of booking.**

```
┌─────────┐     Deposit (EGP)     ┌──────────────┐     After Handshake     ┌────────────┐
│  Client  │ ──────────────────► │  BOOKY ESCROW │ ──────────────────────► │  Merchant  │
│  (العميل) │                     │  (حساب بوكي)  │                         │  (التاجر)  │
└─────────┘                      └──────────────┘                          └────────────┘
                                       │
                                       │ Funds held until:
                                       │ A) Merchant confirms attendance (QR Handshake)
                                       │ B) Client cancels (refund rules apply)
                                       │ C) No-show timer expires (30 min)
                                       │ D) Dispute is resolved (Admin decision)
                                       │
```

### Why Escrow?

| Reason | Explanation |
|--------|-------------|
| **Client Trust** | "My money is safe until I actually get the service." |
| **Merchant Trust** | "I'm protected from no-shows — the Deposit is guaranteed." |
| **Platform Control** | Booky can enforce cancellation policies, deduct commissions, and handle disputes without chasing either party. |
| **Regulatory Safety** | Escrow model separates platform revenue from client funds — cleaner from a financial compliance perspective. |

### Escrow Release Triggers

| Trigger | Action | Funds Destination |
|---------|--------|-------------------|
| **QR Handshake** — Merchant scans Client's QR/OTP | Release Deposit (minus Booky commission) | Merchant Wallet |
| **Client Cancel > cancellation window** | Full refund | Client's original payment method |
| **Client Cancel < cancellation window** | Penalty applied (partial or full forfeiture) | Merchant Wallet (minus Booky commission) |
| **Merchant Cancel** | 100% refund + apology notification | Client's original payment method |
| **No-Show (30 min after Slot)** | Deposit transferred to Merchant | Merchant Wallet (minus Booky commission) |
| **Dispute Opened** | Funds frozen until Admin resolves | Winner of dispute |

### Deposit Amounts by Sector

| Sector | Deposit % of Service Price | Minimum Deposit | Required When |
|--------|---------------------------|-----------------|---------------|
| Sports & Fitness | 20% | 40 EGP | Bookings > 200 EGP |
| Health & Beauty | 25% | 25 EGP | Premium Services |
| Entertainment | 30% | 50 EGP | Always (highest no-show Sector) |
| Home Services | 15% | 30 EGP | Scheduled appointments |
| Education & Work | 25% | 30 EGP | Always |
| Events & Celebrations | 50–100% | 200 EGP | Always (high-ticket) |

### Accepted Payment Methods for Deposits

| Method | Supported? | Notes |
|--------|-----------|-------|
| Vodafone Cash (فودافون كاش) | ✅ | OTP-confirmed. Egypt's #1 mobile wallet. |
| InstaPay (إنستا باي) | ✅ | National instant bank transfer. |
| Credit/Debit Card (بطاقة ائتمان/خصم) | ✅ | 3D Secure verified. |
| Cash on Arrival (كاش عند الوصول) | ❌ | NOT allowed for Deposits. Only for non-Deposit services. |
| Booky Coins (عملة بوكي) | ⚠️ Partial only | Max 30% of Booking value. Cannot fully cover a Deposit. |

---

## 3. Cancellation Policy

### 3.1 Client-Initiated Cancellation

| Timing | Rule | Refund | Booky Coins Impact |
|--------|------|--------|-------------------|
| **> Cancellation Window** (early) | Full refund | 100% of Deposit returned | No impact |
| **< Cancellation Window** (late) | Penalty applied | Deposit forfeited (partial or full) | No coins earned |
| **After Slot Start Time** | No refund (treated as no-show) | 0% returned | -3 no-show strikes |

### Cancellation Windows by Sector

| Sector | Cancellation Window | Penalty if Late |
|--------|--------------------|--------------------|
| Sports & Fitness | 4 hours before Slot | 100% of Deposit lost |
| Health & Beauty | 24 hours before Slot | 100% of Deposit lost |
| Entertainment | 48 hours before Slot | 100% of Deposit lost |
| Home Services | 2 hours before Slot | 100% of Deposit lost |
| Education & Work | 24 hours before Slot | 100% of Deposit lost |
| Events & Celebrations | 7 days before Slot | 50% of Deposit lost (7–3 days); 100% (< 3 days) |

### 3.2 Merchant-Initiated Cancellation

| Rule | Detail |
|------|--------|
| **Refund** | 100% of Deposit returned to Client immediately |
| **Apology** | System sends push notification: "التاجر ألغى الحجز — فلوسك رجعتلك كاملة. آسفين!" |
| **Merchant Penalty** | 3+ cancellations in 30 days → profile warning badge. 5+ → temporary delisting. |
| **Booky Coins** | Client receives +20 Booky Coins as compensation |
| **Slot Release** | Cancelled Slot immediately becomes available for other Clients |

### 3.3 Refund Processing Timeline

| Payment Method | Refund Speed |
|----------------|-------------|
| Vodafone Cash | Instant (≤ 5 minutes) |
| InstaPay | Instant (≤ 5 minutes) |
| Credit/Debit Card | 3–7 business days (bank dependent) |
| Booky Coins (partial) | Instant (coins returned to balance) |

---

## 4. Booking States

```
                    ┌─────────────┐
                    │  SLOT_HELD  │  (5 min countdown)
                    └──────┬──────┘
                           │ Payment initiated
                           ▼
                ┌──────────────────┐
                │ PENDING_PAYMENT  │  (Payment processing)
                └────────┬─────────┘
                         │
              ┌──────────┴──────────┐
              │ Payment success      │ Payment failed
              ▼                      ▼
     ┌─────────────┐        ┌──────────────┐
     │  CONFIRMED  │        │   EXPIRED    │  (Slot released)
     └──────┬──────┘        └──────────────┘
            │
     ┌──────┴──────────────────────────┐
     │              │                   │
     ▼              ▼                   ▼
┌──────────┐  ┌──────────────┐  ┌───────────────────┐
│ COMPLETED│  │ CANCELLED_BY │  │ CANCELLED_BY      │
│          │  │ _CLIENT      │  │ _MERCHANT         │
└──────────┘  └──────────────┘  └───────────────────┘
     │
     ├──────────────┐
     ▼              ▼
┌──────────┐  ┌──────────┐
│ REVIEWED │  │ DISPUTED │
└──────────┘  └──────────┘
```

| State | Description | Deposit Location |
|-------|-------------|-----------------|
| `SLOT_HELD` | Client selected a Slot, 5-min hold active | Not yet collected |
| `PENDING_PAYMENT` | Payment initiated, awaiting confirmation | Processing |
| `CONFIRMED` | Deposit paid, Booking is live | Booky Escrow |
| `COMPLETED` | Merchant confirmed attendance via QR Handshake | Released to Merchant (minus commission) |
| `CANCELLED_BY_CLIENT` | Client cancelled the Booking | Refund rules apply (§3.1) |
| `CANCELLED_BY_MERCHANT` | Merchant cancelled the Booking | 100% refund to Client |
| `NO_SHOW` | Client did not arrive within 30 min of Slot | Transferred to Merchant (minus commission) |
| `EXPIRED` | Payment not completed within 5-min hold | Slot released, no charge |
| `REVIEWED` | Client left a review after completion | Already released |
| `DISPUTED` | Client opened a dispute | Frozen in Escrow → Admin review |

---

## 5. Gherkin Scenarios

### Scenario 1: Happy Path — Full Booking Lifecycle

```gherkin
Feature: Complete Booking Lifecycle

  Scenario: Client books a football pitch and shows up
    Given a Client "Ahmed" is authenticated with phone "+201012345678"
    And a Merchant "ملاعب الأهرام" in Sector "sports" has:
      | service       | price   | deposit_pct | duration |
      | ملعب كورة ساعة | 300 EGP | 20%         | 60 min   |
    And the Service has an available Slot at "2026-02-16T18:00:00Z"

    When Ahmed selects the Slot "2026-02-16T18:00:00Z"
    Then the system soft-holds the Slot for 5 minutes
    And displays the checkout summary:
      | field          | value       |
      | service        | ملعب كورة ساعة |
      | price          | 300 EGP     |
      | deposit        | 60 EGP      |
      | remaining      | 240 EGP     |

    When Ahmed pays the Deposit of 60 EGP via Vodafone Cash
    Then the system moves 60 EGP to Booky Escrow
    And the Booking state becomes "CONFIRMED"
    And the system generates Booking ID "BK-260216-0001"
    And sends push notifications to Ahmed and the Merchant
    And schedules a reminder 1 hour before the Slot

    When Ahmed arrives and shows his QR code at "2026-02-16T18:00:00Z"
    And the Merchant scans the QR code
    Then the system releases the Deposit from Escrow:
      | destination      | amount |
      | merchant_wallet  | 57 EGP | # 60 EGP minus 5% Booky commission (3 EGP)
      | booky_revenue    | 3 EGP  |
    And the Booking state becomes "COMPLETED"
    And Ahmed earns 30 Booky Coins (10 coins per 100 EGP × 1x Free tier)
```

### Scenario 2: Client Cancels Early (Full Refund)

```gherkin
  Scenario: Client cancels a sports Booking more than 4 hours before the Slot
    Given a Client has a confirmed Booking for Sector "sports"
    And the Slot is at "2026-02-16T18:00:00Z"
    And the cancellation window for Sports is 4 hours
    And the current time is "2026-02-16T10:00:00Z" (8 hours before)

    When the Client taps "إلغاء الحجز" (Cancel Booking)
    Then the system displays: "هترجعلك الـ 60 ج.م كاملين."
    And the Client confirms the cancellation

    Then the Booking state becomes "CANCELLED_BY_CLIENT"
    And the system refunds 60 EGP to the Client's Vodafone Cash (instant)
    And the Slot is released back to the Merchant's calendar
    And no Booky Coins are earned or deducted
```

### Scenario 3: Client Cancels Late (Deposit Lost)

```gherkin
  Scenario: Client cancels a sports Booking less than 4 hours before the Slot
    Given a Client has a confirmed Booking for Sector "sports"
    And the Slot is at "2026-02-16T18:00:00Z"
    And the cancellation window for Sports is 4 hours
    And the current time is "2026-02-16T15:30:00Z" (2.5 hours before)

    When the Client taps "إلغاء الحجز" (Cancel Booking)
    Then the system displays a warning:
      "الحجز ده مش هيترد فلوسه لأنك بتلغي قبل الميعاد بأقل من 4 ساعات."
    And asks for confirmation: "متأكد؟"

    When the Client confirms
    Then the Booking state becomes "CANCELLED_BY_CLIENT"
    And the 60 EGP Deposit is forfeited
    And the system transfers from Escrow:
      | destination     | amount |
      | merchant_wallet | 57 EGP | # minus commission
      | booky_revenue   | 3 EGP  |
    And the Slot is released
    And the Client receives 0 Booky Coins
```

### Scenario 4: Merchant Cancels

```gherkin
  Scenario: Merchant cancels a confirmed Booking
    Given a Client has a confirmed Booking with Deposit of 60 EGP
    When the Merchant cancels the Booking from their Dashboard

    Then the Booking state becomes "CANCELLED_BY_MERCHANT"
    And the system refunds 100% (60 EGP) to the Client instantly
    And the Client receives a push notification:
      "التاجر ألغى الحجز — فلوسك رجعتلك كاملة. آسفين! 🙏"
    And the Client is awarded +20 Booky Coins as compensation
    And the Merchant's cancellation counter increments by 1
    And if cancellation count ≥ 3 in 30 days:
      Then the Merchant's profile shows a "⚠️ بيلغي كتير" warning badge
    And if cancellation count ≥ 5 in 30 days:
      Then the Merchant is temporarily delisted for 7 days
```

---

## 6. Edge Cases

| # | Edge Case | Business Rule |
|---|-----------|---------------|
| 1 | **Payment timeout** — Client doesn't complete payment within 5 minutes | Slot released. Booking state → `EXPIRED`. No charge. |
| 2 | **Double-booking** — Two Clients try to book the same Slot simultaneously | First confirmed payment wins. Second Client sees "الموعد اتحجز — اختار موعد تاني." |
| 3 | **Insufficient Booky Coins** — Client tries to redeem more coins than they have | Block. Display balance. Max redemption = 30% of Booking value. |
| 4 | **Vodafone Cash fails mid-payment** | Retry once automatically. If still fails, show "الدفع مش شغّال — جرب طريقة تانية." Slot hold continues. |
| 5 | **Client's phone dies during checkout** | Slot hold remains for 5 minutes. Client can resume on any device by logging in. |
| 6 | **Merchant changes Service price after Booking is confirmed** | Price change does NOT affect existing confirmed Bookings. Only applies to future Bookings. |
| 7 | **Client tries to book with a blacklisted account** | Block. Display: "حسابك موقوف مؤقتًا — تواصل مع الدعم." |
| 8 | **Deposit = 0 EGP (non-Deposit Service)** | Skip payment step. Booking confirmed immediately. No escrow. |

---

> **📌 Source of Truth:** This document aligns with [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md) §11 (Deposit System), §10 (Commission), §9 (Booky Coins), §4 (Global Rules).
>
> *Booky Center: بضغطة واحدة.. ميعادك في جيبك* ✨

