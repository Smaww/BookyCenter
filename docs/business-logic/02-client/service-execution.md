# 📂 02-Client: Service Execution & Edge Cases

## *The "What Ifs" — No-Shows, Disputes, and Real-World Chaos*

**Parent:** [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md)
**Version:** 1.0 | **Date:** February 15, 2026
**Persona:** The Client (العميل) — post-Booking, during and after Service execution.

---

## Table of Contents

1. [Service Execution Flow](#1-service-execution-flow)
2. [Edge Case: "The Ghost" (No-Show)](#2-edge-case-the-ghost-no-show)
3. [Edge Case: "The Dispute" (Service Disagreement)](#3-edge-case-the-dispute-service-disagreement)
4. [Edge Case: "The Late Arrival"](#4-edge-case-the-late-arrival)
5. [Edge Case: "The Wrong Service"](#5-edge-case-the-wrong-service)
6. [Edge Case: "The Merchant Isn't Ready"](#6-edge-case-the-merchant-isnt-ready)
7. [Post-Service: Review & Coins](#7-post-service-review--coins)
8. [Gherkin Scenarios (All Edge Cases)](#8-gherkin-scenarios-all-edge-cases)

---

## 1. Service Execution Flow

Once a Booking reaches `CONFIRMED` state, this is the real-world execution timeline:

```
CONFIRMED Booking
       │
       │  ─── 1hr before Slot ───  Reminder push notification
       │
       │  ─── Slot Start Time ───
       │
       ├── Client arrives → Shows QR/OTP
       │       │
       │       ▼
       │   Merchant scans QR → HANDSHAKE confirmed
       │       │
       │       ▼
       │   Service delivered
       │       │
       │       ▼
       │   Client pays remaining balance (cash/digital)
       │       │
       │       ▼
       │   Booking state → COMPLETED
       │       │
       │       ▼
       │   Client earns Booky Coins + prompted to Review
       │
       ├── Client doesn't arrive ─── (30 min grace) ─── NO_SHOW
       │
       └── Client arrives but there's a problem ─── DISPUTE
```

### The QR/OTP Handshake (Confirmation of Attendance)

| Step | Actor | Action |
|------|-------|--------|
| 1 | Client | Opens Booking details in the app |
| 2 | Client | Shows QR code (or reads 6-digit OTP aloud) |
| 3 | Merchant | Scans QR via Merchant Dashboard app / enters OTP |
| 4 | System | Validates QR/OTP → Confirms attendance |
| 5 | System | Releases Deposit from Escrow to Merchant Wallet (minus commission) |
| 6 | System | Booking state → `COMPLETED` |

> **Note:** The QR/OTP is **single-use** and tied to the specific Booking ID. It becomes invalid once scanned or after the Slot expires.

---

## 2. Edge Case: "The Ghost" (No-Show)

### Definition

> A **No-Show** occurs when a Client has a confirmed Booking but fails to arrive at the Merchant's location within 30 minutes of the Slot start time.

### Business Rules

| Rule | Detail |
|------|--------|
| **Grace Period** | 30 minutes after Slot start time |
| **Trigger** | Merchant taps "العميل مجاش" (Client didn't show up) in the Dashboard after 30 min |
| **OR** | System auto-triggers No-Show if no QR Handshake occurs within 30 min |
| **Deposit Handling** | 100% of Deposit transferred to Merchant (minus Booky commission) |
| **Client Notification** | Push: "مجيتش على ميعادك في [Merchant Name] — العربون اتحول للتاجر. حاول تلغي بدري المرة الجاية 🙏" |
| **Rank Impact** | +1 no-show strike on Client's record |
| **Demotion Rule** | 3+ no-shows in 30 days → Client demoted by one Rank |
| **Rank Restoration** | 5 consecutive clean (completed) Bookings to restore previous Rank |

### No-Show Financial Flow

```
┌─────────────────────┐
│   BOOKY ESCROW      │
│   (Holding 60 EGP)  │
└─────────┬───────────┘
          │ 30 minutes after Slot, no QR Handshake
          ▼
┌─────────────────────────────────┐
│  Merchant Wallet: +57 EGP      │  (Deposit minus 5% commission)
│  Booky Revenue:   +3 EGP       │  (Commission)
│  Client:          0 EGP refund  │
└─────────────────────────────────┘
```

### Prevention Mechanisms

| Mechanism | Description |
|-----------|-------------|
| **1-hour Reminder** | Push notification 1hr before Slot |
| **15-minute Reminder** | Push notification 15 min before Slot |
| **Easy Cancel** | Prominent "Cancel" button (with clear refund info) available until Slot start |
| **No-Show History** | Clients with 2+ no-shows see a warning banner: "عندك سجل عدم حضور — ده بيأثر على رتبتك." |

---

## 3. Edge Case: "The Dispute" (Service Disagreement)

### Definition

> A **Dispute** occurs when a Client arrives, the Service begins (or is attempted), but the Client is dissatisfied and wants to contest the charge. The Client formally opens a Dispute Ticket via the app.

### Dispute Scenarios

| # | Scenario | Example |
|---|----------|---------|
| 1 | Service quality was unacceptable | Haircut doesn't match what was agreed |
| 2 | Merchant provided a different Service | Booked a private pitch, got shared |
| 3 | Service was incomplete | Cleaning crew left after half the job |
| 4 | Merchant was rude or unprofessional | Hostile behavior, unsafe environment |
| 5 | Client left midway (without Merchant fault) | Client changed their mind — NOT a valid dispute |

### Business Rules

| Rule | Detail |
|------|--------|
| **Who Can Open** | Only the Client, only for `CONFIRMED` or `COMPLETED` Bookings |
| **Time Window** | Within 24 hours of the Slot start time |
| **Deposit Handling** | Immediately **frozen** in Escrow. Neither Client nor Merchant receives funds until resolution. |
| **Evidence Required** | Client must provide: text description (min 50 chars) + optional photos/video |
| **Merchant Response** | Merchant notified immediately. Has 48 hours to respond with their side. |
| **Resolution Authority** | Booky Admin team (human review) |
| **Resolution SLA** | 72 hours from dispute opening |
| **Client Notification** | "فتحنا تذكرة بخصوص حجزك — الفلوس متجمّدة لحد ما نراجع الموقف." |

### Resolution Outcomes

| Outcome | Deposit Action | Impact |
|---------|---------------|--------|
| **Client Wins** (Merchant at fault) | 100% refund to Client + 20 Booky Coins compensation | Merchant gets warning. 3+ lost disputes in 90 days → review for delisting. |
| **Merchant Wins** (Client at fault) | Deposit released to Merchant (minus commission) | Client gets a "frivolous dispute" mark. 3+ → dispute privilege suspended for 30 days. |
| **Partial Resolution** (Both at fault) | Deposit split: 50% to Client, 50% to Merchant | Both notified of the split decision. |
| **Insufficient Evidence** | Default: funds released to Merchant | Client advised to provide more evidence next time. |

### Dispute States

```
DISPUTE_OPENED
     │
     ├── Merchant responds (within 48h)
     │       │
     │       ▼
     │   UNDER_REVIEW (Admin investigating)
     │       │
     │       ├── RESOLVED_CLIENT_WINS → Refund
     │       ├── RESOLVED_MERCHANT_WINS → Release to Merchant
     │       └── RESOLVED_PARTIAL → Split
     │
     └── Merchant doesn't respond (48h expires)
             │
             ▼
         RESOLVED_CLIENT_WINS (Default: Client wins by Merchant silence)
```

---

## 4. Edge Case: "The Late Arrival"

### Definition

> The Client arrives **after** the Slot start time but **within** the 30-minute grace period.

### Business Rules

| Timing | Rule |
|--------|------|
| **1–15 min late** | Merchant may still serve the Client. Service duration may be shortened. No penalty. QR Handshake proceeds normally. |
| **16–30 min late** | Merchant has the right to refuse service. If refused → treated as Client No-Show. If accepted → proceed normally. |
| **> 30 min late** | Automatic No-Show. No QR Handshake possible. |

```gherkin
Feature: Late Arrival Handling

  Scenario: Client arrives 10 minutes late and Merchant accepts
    Given a Client has a confirmed Booking at "2026-02-16T18:00:00Z"
    And the Client arrives at 18:10 (10 minutes late)
    When the Merchant accepts the late arrival
    And the Client shows their QR code
    And the Merchant scans it
    Then the Booking proceeds normally
    And the Deposit is released per standard rules
    And the Booking state becomes "COMPLETED"

  Scenario: Client arrives 25 minutes late and Merchant refuses
    Given a Client has a confirmed Booking at "2026-02-16T18:00:00Z"
    And the Client arrives at 18:25 (25 minutes late)
    When the Merchant taps "رفض — العميل متأخر" (Refuse — Client is late)
    Then the Booking is treated as a No-Show
    And the Deposit is transferred to the Merchant (minus commission)
    And the Client is notified: "وصلت متأخر والتاجر رفض — العربون اتحول ليه."
```

---

## 5. Edge Case: "The Wrong Service"

### Definition

> The Client arrives and discovers the Service is materially different from what was described on the platform (e.g., different pitch size, different stylist, broken equipment).

### Business Rules

| Rule | Detail |
|------|--------|
| **Client's Right** | Client may refuse the Service before it starts |
| **QR Handshake** | Client does NOT scan QR. No Handshake = Deposit stays in Escrow. |
| **Client Action** | Open Dispute Ticket immediately from the app |
| **Evidence** | Photos of the misrepresented Service (strongly recommended) |
| **Deposit** | Frozen in Escrow pending Admin review |
| **Typical Resolution** | Full refund to Client + Merchant warning for misrepresentation |

---

## 6. Edge Case: "The Merchant Isn't Ready"

### Definition

> The Client arrives on time, but the Merchant is not available (closed, previous client overtime, equipment broken, etc.).

### Business Rules

| Timing | Rule |
|--------|------|
| **Client waits ≤ 15 min** | Merchant should offer apology. Booking proceeds. No penalty. |
| **Client waits > 15 min** | Client may choose to leave. If they leave → Merchant-fault cancellation. |
| **Merchant-Fault Cancellation** | 100% Deposit refund to Client + 20 Booky Coins compensation. Merchant cancellation counter +1. |

```gherkin
Feature: Merchant Not Ready

  Scenario: Client arrives but Merchant location is closed
    Given a Client has a confirmed Booking at "2026-02-16T18:00:00Z"
    And the Client arrives at the location at 18:00
    And the Merchant's location is closed / unavailable
    When the Client waits 15 minutes and the Merchant is still unavailable
    And the Client taps "المكان مقفول — عايز فلوسي" (Place is closed — I want my money back)
    Then the system opens an auto-dispute in Client's favor
    And the system refunds 100% of the Deposit to the Client
    And the Client is awarded +20 Booky Coins
    And the Merchant's cancellation counter increments by 1
    And the Merchant is notified: "العميل جه ولقى المكان مقفول — تم رد العربون."
```

---

## 7. Post-Service: Review & Coins

### After a `COMPLETED` Booking

| Action | Trigger | Reward |
|--------|---------|--------|
| **Review Prompt** | Push notification 2 hours after Slot end | — |
| **Text Review** | Client writes ≥ 20 characters | +10 Booky Coins |
| **Photo Review** | Client attaches ≥ 1 photo | +50 Booky Coins (stacks with text) |
| **Rating** | 1–5 stars (mandatory with review) | Affects Merchant's overall rating |
| **Re-book Prompt** | Push notification 7 days later | "حابب تحجز تاني في [Merchant Name]?" |

### Review Integrity Rules

| Rule | Detail |
|------|--------|
| **Verified Only** | Only Clients with a `COMPLETED` Booking can review that Merchant |
| **One Review per Booking** | Cannot submit multiple reviews for the same Booking |
| **Minimum Length** | 20 characters (prevents spam like "good" or "👍") |
| **Edit Window** | 24 hours after submission. After that, it's permanent. |
| **Merchant Response** | Merchant can publicly reply to any review (no edit/delete of Client's review) |
| **Flagging** | Either party can flag a review for Admin review (spam, abuse, threats) |

---

## 8. Gherkin Scenarios (All Edge Cases)

### The Ghost (No-Show) — Full Scenario

```gherkin
Feature: No-Show Protection

  Scenario: Client doesn't show up within 30 minutes of the Slot
    Given a Client "Sara" has a confirmed Booking:
      | booking_id   | BK-260216-0042      |
      | merchant     | صالون جوليا          |
      | service      | مانيكير وبديكير     |
      | slot         | 2026-02-16T14:00:00Z |
      | deposit      | 75 EGP              |
      | state        | CONFIRMED            |
    And the current time reaches "2026-02-16T14:30:00Z" (30 min past Slot)
    And no QR Handshake has occurred

    When the system triggers the No-Show protocol
    Then the Booking state becomes "NO_SHOW"
    And the system transfers from Escrow:
      | destination     | amount  |
      | merchant_wallet | 71 EGP  | # 75 EGP minus ~5% commission
      | booky_revenue   | 4 EGP   |
    And Sara receives a push notification:
      "مجيتيش على ميعادك في صالون جوليا — العربون اتحول للتاجر."
    And Sara's no-show counter becomes 1
    And Sara earns 0 Booky Coins

  Scenario: Client accumulates 3 no-shows in 30 days (Rank Demotion)
    Given a Client "Omar" has Rank "Regular" (معتمد)
    And Omar's no-show count in the last 30 days is 2
    When Omar triggers a 3rd no-show
    Then Omar's Rank is demoted from "Regular" to "Newbie" (مبتدئ)
    And Omar receives a push notification:
      "رتبتك نزلت بسبب عدم الحضور المتكرر. 5 حجوزات كاملة هترجعك 💪"
    And Omar needs 5 consecutive completed Bookings to restore "Regular" Rank
```

### The Dispute — Full Scenario

```gherkin
Feature: Dispute Resolution

  Scenario: Client opens a dispute for poor service quality
    Given a Client "Nour" has a completed Booking:
      | booking_id | BK-260216-0099             |
      | merchant   | باربر شوب الكينج           |
      | service    | قص شعر + لحية               |
      | deposit    | 50 EGP                     |
      | state      | COMPLETED                  |
    And the current time is within 24 hours of the Slot

    When Nour opens a Dispute Ticket with:
      | description | "القصة مش زي ما اتفقنا عليها خالص — المكنة بايظة والحلاق مكانش عارف يشتغل" |
      | photos      | 2 photos attached           |
    Then the Booking state becomes "DISPUTED"
    And the Deposit (50 EGP) is frozen in Escrow
    And the Merchant receives notification:
      "في شكوى على حجز BK-260216-0099 — عندك 48 ساعة ترد."
    And the dispute SLA timer starts (72 hours)

  Scenario: Admin resolves dispute in Client's favor
    Given a Dispute for Booking "BK-260216-0099" is "UNDER_REVIEW"
    And the Admin has reviewed evidence from both sides
    When the Admin rules in favor of the Client
    Then the system refunds 50 EGP to Nour (original payment method)
    And Nour is awarded +20 Booky Coins as compensation
    And the Merchant receives a warning notification:
      "الشكوى اتحلت لصالح العميل. 3 شكاوى في 90 يوم = مراجعة الحساب."
    And the Merchant's dispute-lost counter increments by 1

  Scenario: Merchant doesn't respond within 48 hours
    Given a Dispute for Booking "BK-260216-0099" is "DISPUTE_OPENED"
    And 48 hours have elapsed since the Merchant was notified
    And the Merchant has not responded
    Then the system auto-resolves in the Client's favor
    And the Deposit is refunded to the Client
    And the Merchant's profile shows: "⚠️ مش بيرد على الشكاوى"
```

### Overlap Scenario: Ghost + Dispute Attempt

```gherkin
  Scenario: Client tries to open a dispute after being marked as No-Show
    Given a Client has been marked as "NO_SHOW" for Booking "BK-260216-0042"
    And the Deposit has already been transferred to the Merchant
    When the Client attempts to open a Dispute Ticket
    Then the system rejects the dispute with:
      "مينفعش تفتح شكوى على حجز مجيتش فيه. لو في مشكلة، تواصل مع الدعم."
    And provides a link to customer support
    But does NOT freeze or reverse the Deposit transfer
```

---

> **📌 Source of Truth:** This document aligns with [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md) §8 (Rank System — demotion rules), §11 (Deposit System), §10 (Commission).
>
> *Booky Center: بضغطة واحدة.. ميعادك في جيبك* ✨

