# 📂 03-Merchant: Fulfillment Protocol

## *The "Handshake" — How the Merchant Gets Paid*

**Parent:** [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md)
**Version:** 1.0 | **Date:** February 15, 2026
**Persona:** The Merchant (التاجر) — the service provider who fulfills Bookings and receives payouts.

---

## Table of Contents

1. [The Fulfillment Principle](#1-the-fulfillment-principle)
2. [The QR Code Handshake (Core Mechanism)](#2-the-qr-code-handshake-core-mechanism)
3. [OTP Fallback Mechanism](#3-otp-fallback-mechanism)
4. [The Unlock Flow (Step by Step)](#4-the-unlock-flow-step-by-step)
5. [Commission Deduction at Handshake](#5-commission-deduction-at-handshake)
6. [Handshake Edge Cases](#6-handshake-edge-cases)
7. [Gherkin Scenarios](#7-gherkin-scenarios)
8. [Merchant Dashboard: Booking Management](#8-merchant-dashboard-booking-management)

---

## 1. The Fulfillment Principle

> **The Merchant NEVER receives funds at the time of Booking. The Deposit sits in Booky Escrow until the Merchant PROVES the Client arrived.**

This is the foundation of Booky Center's trust engine. The Merchant's action of scanning the Client's QR code (or entering their OTP) serves as **cryptographic proof of attendance** — and the trigger for instant fund release.

```
┌──────────────────────────────────────────────────────────────────┐
│                     THE HANDSHAKE PRINCIPLE                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Booking confirmed → Deposit held in Escrow                     │
│                              │                                    │
│                              ▼                                    │
│                    Client arrives at location                     │
│                              │                                    │
│                              ▼                                    │
│                    Client shows QR / says OTP                     │
│                              │                                    │
│                              ▼                                    │
│                    Merchant scans QR / enters OTP                 │
│                              │                                    │
│                              ▼                                    │
│              ┌───────────────────────────────┐                    │
│              │     ✅ HANDSHAKE CONFIRMED     │                    │
│              │  Deposit released INSTANTLY    │                    │
│              │  to Merchant Wallet            │                    │
│              │  (minus Booky commission)      │                    │
│              └───────────────────────────────┘                    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Why This Matters for the Merchant

| Benefit | Explanation |
|---------|-------------|
| **No More No-Shows** | If the Client doesn't show, the Deposit still comes to you (after 30-min timer). |
| **Instant Payment** | The moment you scan the QR, money is in your wallet. No waiting. |
| **Trust Signal** | Clients trust the platform because they know the money is safe until they arrive. More trust = more Bookings for you. |
| **Dispute Protection** | The QR scan is timestamped proof that the Client was there. Protects you in disputes. |

---

## 2. The QR Code Handshake (Core Mechanism)

### QR Code Specifications

| Property | Value |
|----------|-------|
| **Format** | QR Code (ISO/IEC 18004) |
| **Content** | Signed JWT containing: `booking_id`, `client_id`, `slot_time`, `expiry`, `signature` |
| **Displayed By** | Client app — Booking details screen |
| **Scanned By** | Merchant Dashboard app — Camera or built-in scanner |
| **Validity Window** | From 15 minutes before Slot start → 30 minutes after Slot start |
| **Single Use** | QR becomes invalid after one successful scan |
| **Offline Mode** | QR contains enough data for offline validation (signed JWT). Server sync happens when connection restores. |
| **Size** | Minimum 200×200px on Client's screen for reliable scanning |

### QR Security

| Threat | Mitigation |
|--------|------------|
| **Screenshot sharing** | QR refreshes every 30 seconds (new timestamp in JWT payload) |
| **Reuse attempt** | Single-use flag. Second scan returns: "الكود ده اتستخدم قبل كده." |
| **Expired QR** | Rejected with: "الكود انتهى — اطلب من العميل يفتح الحجز من جديد." |
| **Forged QR** | JWT signature verification against Booky's signing key. Invalid signature → rejected. |
| **Different Booking** | Merchant Dashboard validates that the scanned `booking_id` matches a Booking at their location. Mismatch → rejected. |

---

## 3. OTP Fallback Mechanism

> If the QR scan fails (poor camera, broken screen, technical issue), the system provides an OTP fallback.

### OTP Specifications

| Property | Value |
|----------|-------|
| **Format** | 6-digit numeric code |
| **Displayed By** | Client app — same screen as QR, below the code |
| **Entered By** | Merchant — types into Merchant Dashboard |
| **Validity** | Same window as QR (15 min before → 30 min after Slot) |
| **Single Use** | One successful entry invalidates the code |
| **Attempts** | Max 3 wrong entries → OTP locked for that Booking → must use QR or contact support |

### When to Use OTP

| Situation | Recommended Method |
|-----------|--------------------|
| Normal conditions | QR Code (faster, no typing) |
| Poor lighting / camera issues | OTP |
| Client's screen broken / cracked | OTP (Client reads code aloud) |
| Both fail | Contact Booky support for manual verification |

---

## 4. The Unlock Flow (Step by Step)

### From the Merchant's Perspective

```
Step 1: Merchant sees upcoming Bookings in Dashboard
        ┌─────────────────────────────────────────┐
        │  📅 اليوم — الحجوزات القادمة              │
        │                                          │
        │  🔵 18:00 — أحمد محمد — ملعب كورة ساعة   │
        │     عربون: 60 ج.م | حالة: مؤكد           │
        │     [ تأكيد الحضور ]                      │
        │                                          │
        │  🔵 19:30 — سارة أحمد — ملعب بادل        │
        │     عربون: 80 ج.م | حالة: مؤكد           │
        │     [ تأكيد الحضور ]                      │
        └─────────────────────────────────────────┘

Step 2: Client arrives → Merchant taps "تأكيد الحضور" (Confirm Attendance)
        → Camera opens for QR scan (or OTP input field)

Step 3: Merchant scans Client's QR code
        → System validates: ✅ Valid Booking, ✅ Correct Merchant, ✅ Within time window

Step 4: SUCCESS screen:
        ┌─────────────────────────────────────────┐
        │  ✅ تم تأكيد حضور العميل                  │
        │                                          │
        │  العربون: 60 ج.م → محفظتك                │
        │  عمولة بوكي: 3 ج.م                       │
        │  صافي المبلغ: 57 ج.م                     │
        │                                          │
        │  الباقي من العميل: 240 ج.م (كاش/محفظة)   │
        │                                          │
        │  [ تم ✓ ]                                 │
        └─────────────────────────────────────────┘

Step 5: Remaining balance (240 EGP) is settled directly between
        Client and Merchant (cash, card, Vodafone Cash).
        Booky does NOT process the remaining balance — only the Deposit.
```

### From the System's Perspective

| Step | System Action | Timing |
|------|--------------|--------|
| 1 | Receive QR/OTP scan request from Merchant Dashboard | Instant |
| 2 | Validate JWT signature (or OTP against DB) | < 500ms |
| 3 | Verify `booking_id` belongs to this Merchant | < 100ms |
| 4 | Verify current time is within validity window | < 100ms |
| 5 | Mark Booking as `COMPLETED` | Instant |
| 6 | Calculate commission (fixed fee or %) | Instant |
| 7 | Transfer (Deposit - commission) from Escrow → Merchant Wallet | < 2 seconds |
| 8 | Credit commission to Booky Revenue ledger | Instant |
| 9 | Send push notification to Client ("Booking completed") | < 5 seconds |
| 10 | Award Booky Coins to Client | Instant |
| 11 | Schedule review prompt (2 hours later) | Queued |

---

## 5. Commission Deduction at Handshake

> **Booky's commission is deducted automatically at the moment of Handshake.** The Merchant never sees the gross amount — only the net.

### Commission Models

#### Model A: Fixed Fee (High-Frequency, Low-Value Services)

| Service Type | Fixed Fee per Booking |
|--------------|-----------------------|
| Barber / Haircut | 20 EGP |
| Gym Day Pass | 25 EGP |
| Nail Booking | 20 EGP |
| Small Home Repair | 30 EGP |

#### Model B: Percentage (High-Ticket, Variable-Value Services)

| Service Type | Commission % |
|--------------|-------------|
| Football Pitch | 5% |
| Event Venue | 8% |
| Wedding Service | 10% |
| Corporate Booking | 7% |
| Large Home Project | 5% |

### Commission Calculation Examples

| Scenario | Deposit | Commission Type | Commission | Net to Merchant |
|----------|---------|----------------|------------|-----------------|
| Haircut (200 EGP service, 25% deposit) | 50 EGP | Fixed: 20 EGP | 20 EGP | 30 EGP |
| Football Pitch (300 EGP service, 20% deposit) | 60 EGP | 5% of Deposit | 3 EGP | 57 EGP |
| Wedding Venue (10,000 EGP, 50% deposit) | 5,000 EGP | 10% of Deposit | 500 EGP | 4,500 EGP |
| Plumbing (500 EGP, 15% deposit) | 75 EGP | Fixed: 30 EGP | 30 EGP | 45 EGP |

> **Note:** Commission is calculated on the **Deposit amount only**, not the full Service price. This keeps the platform fee proportional to the risk Booky is managing (the escrow).

---

## 6. Handshake Edge Cases

| # | Edge Case | Rule |
|---|-----------|------|
| 1 | **Merchant scans QR 20 minutes before Slot** | ✅ Allowed. QR is valid starting 15 min before Slot. Early check-in is fine. |
| 2 | **Merchant scans QR 35 minutes after Slot** | ❌ Rejected. Past the 30-min window. System shows: "الوقت خلص — الحجز اتسجل كعدم حضور." |
| 3 | **Internet is down during scan** | QR contains signed JWT — offline validation possible. Fund transfer queues and syncs when online. |
| 4 | **Merchant accidentally scans wrong Client's QR** | System checks `booking_id` against Merchant's active Bookings. Mismatch → "الكود ده مش لحجز عندك." |
| 5 | **Client loses phone after arriving** | Merchant enters OTP manually (Client can recall it from memory). Or: support hotline provides manual confirmation. |
| 6 | **Merchant's app crashes during scan** | Retry. QR remains valid (single-use = after successful scan only). |
| 7 | **Multiple Bookings at same Slot** | Each Booking has its own unique QR/OTP. Merchant scans each one individually. |
| 8 | **Merchant tries to scan after already marking No-Show** | ❌ Blocked. Once No-Show is confirmed, Handshake is disabled. Dispute is the only recourse. |

---

## 7. Gherkin Scenarios

### Scenario 1: Successful QR Handshake

```gherkin
Feature: QR Code Handshake — Fund Release

  Scenario: Merchant scans Client's QR and receives payment
    Given a confirmed Booking exists:
      | booking_id  | BK-260216-0001              |
      | client      | أحمد محمد                    |
      | merchant    | ملاعب الأهرام                 |
      | service     | ملعب كورة ساعة               |
      | slot        | 2026-02-16T18:00:00Z         |
      | deposit     | 60 EGP                       |
      | state       | CONFIRMED                    |
      | escrow      | 60 EGP held                  |
    And the current time is "2026-02-16T18:02:00Z" (2 min after Slot)
    And Ahmed has opened his Booking details showing the QR code

    When the Merchant opens the Dashboard and taps "تأكيد الحضور"
    And the Merchant scans Ahmed's QR code
    Then the system validates the JWT signature
    And confirms the booking_id matches this Merchant
    And confirms the time is within the validity window

    Then the Booking state becomes "COMPLETED"
    And the system calculates commission: 5% of 60 EGP = 3 EGP
    And the system transfers from Escrow:
      | destination     | amount |
      | merchant_wallet | 57 EGP |
      | booky_revenue   | 3 EGP  |
    And the Merchant sees: "✅ تم — 57 ج.م اتضافوا لمحفظتك"
    And Ahmed receives push: "حجزك في ملاعب الأهرام اتأكد — استمتع! ⚽"
    And Ahmed earns 30 Booky Coins (300 EGP × 10 coins/100 EGP × 1x Free)
```

### Scenario 2: OTP Fallback

```gherkin
  Scenario: QR scan fails, Merchant uses OTP instead
    Given a confirmed Booking "BK-260216-0001"
    And the Client's phone screen is cracked (QR unreadable)
    And the Client's OTP is "482957"

    When the Merchant taps "تأكيد الحضور"
    And the camera cannot read the QR code
    And the Merchant switches to "إدخال كود" (Enter Code) mode
    And the Merchant types "482957"
    Then the system validates the OTP
    And the Handshake proceeds identically to a QR scan
    And the Merchant receives funds in their wallet
```

### Scenario 3: No-Show → Auto-Transfer to Merchant

```gherkin
  Scenario: Client doesn't show up — Deposit auto-transfers after 30 min
    Given a confirmed Booking:
      | booking_id | BK-260216-0042      |
      | slot       | 2026-02-16T14:00:00Z |
      | deposit    | 75 EGP              |
    And the current time reaches "2026-02-16T14:30:00Z"
    And no QR Handshake or OTP entry has occurred

    When the system's No-Show timer fires
    Then the Booking state becomes "NO_SHOW"
    And the system transfers from Escrow:
      | destination     | amount |
      | merchant_wallet | 71 EGP |
      | booky_revenue   | 4 EGP  |
    And the Merchant is notified: "العميل مجاش — العربون اتحول لمحفظتك."
    And the Client is notified: "مجيتش على ميعادك — العربون اتحول للتاجر."
```

### Scenario 4: Merchant Tries to Fake a Handshake

```gherkin
  Scenario: Merchant attempts to scan an expired or invalid QR
    Given a Booking "BK-260216-0001" with Slot at "2026-02-16T18:00:00Z"
    And the current time is "2026-02-16T19:00:00Z" (1 hour past Slot)

    When the Merchant tries to scan a QR code for this Booking
    Then the system rejects the scan with:
      "الكود انتهى — الوقت المسموح خلص."
    And the Booking state is already "NO_SHOW"
    And no additional fund transfer occurs

  Scenario: Merchant enters random OTP hoping to unlock funds
    Given a Booking "BK-260216-0042"
    When the Merchant enters OTP "000000" (incorrect)
    Then the system rejects: "الكود غلط — جرب تاني."
    When the Merchant enters wrong OTP 2 more times (total 3)
    Then OTP entry is locked for this Booking
    And the system displays: "الكود اتقفل — استخدم QR أو تواصل مع الدعم."
```

---

## 8. Merchant Dashboard: Booking Management

### Today's Bookings View

| Column | Description |
|--------|-------------|
| **Time** | Slot start time (EET display) |
| **Client** | Client's name + profile photo |
| **Service** | Service name |
| **Deposit** | Amount in EGP |
| **Status** | `مؤكد` / `تم الحضور` / `لم يحضر` / `ملغي` |
| **Action** | [تأكيد الحضور] button (active only within validity window) |

### Booking History Filters

| Filter | Options |
|--------|---------|
| **Date Range** | Today / This Week / This Month / Custom |
| **Status** | All / Confirmed / Completed / No-Show / Cancelled / Disputed |
| **Service** | Dropdown of Merchant's Service catalog |
| **Payout Status** | Pending / Transferred / Frozen (Dispute) |

---

> **📌 Source of Truth:** This document aligns with [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md) §10 (Commission Model), §11 (Deposit System).
>
> *Booky Center: بضغطة واحدة.. ميعادك في جيبك* ✨

