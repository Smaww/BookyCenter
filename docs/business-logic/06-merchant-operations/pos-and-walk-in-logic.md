# 📂 06-Merchant Operations: POS & Walk-In Logic

## *The Hybrid Calendar — Merging Online Bookings with Offline Walk-Ins*

**Parent:** [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md)
**Cross-Refs:** [fulfillment-protocol.md](mdc:docs/business-logic/03-merchant/fulfillment-protocol.md) (Handshake), [service-catalog-architecture.md](mdc:docs/business-logic/05-core-systems/service-catalog-architecture.md) (Pricing), [staff-management-logic.md](mdc:docs/business-logic/06-merchant-operations/staff-management-logic.md) (Staff Assignment)
**Version:** 1.0 | **Date:** February 15, 2026

---

## Table of Contents

1. [The Hybrid Problem](#1-the-hybrid-problem)
2. [Calendar Architecture](#2-calendar-architecture)
3. [Walk-In Quick-Add (< 10 Seconds)](#3-walk-in-quick-add--10-seconds)
4. [Queue & Waiting List Management](#4-queue--waiting-list-management)
5. [POS Checkout (Offline Payments)](#5-pos-checkout-offline-payments)
6. [Online vs. Offline Priority Rules](#6-online-vs-offline-priority-rules)
7. [Merchant Dashboard: Calendar View](#7-merchant-dashboard-calendar-view)
8. [Analytics & Reporting](#8-analytics--reporting)
9. [Gherkin Scenarios](#9-gherkin-scenarios)
10. [Edge Cases](#10-edge-cases)

---

## 1. The Hybrid Problem

### Why This Module Exists

> 90% of Egyptian micro-businesses (barbers, salons, pitches) operate in a **dual reality**: some Clients book online via Booky, while others walk in off the street. If the Merchant Dashboard only shows online Bookings, the calendar becomes unreliable — a Client books online for 14:00, but the chair is already occupied by a walk-in.

### The Competitive Gap

| Competitor | Online | Offline | Hybrid |
|-----------|--------|---------|--------|
| Rekaz.io | ✅ | ❌ | ❌ |
| Fresha | ✅ | ✅ (basic) | ⚠️ Limited |
| **Booky Center** | ✅ | ✅ | ✅ **Full Hybrid** |

### The Vision

```
┌───────────────────────────────────────────────────────────────────┐
│                    BOOKY HYBRID CALENDAR                           │
│                                                                    │
│  One calendar to rule them all:                                   │
│  ✅ Online Bookings (from Client App — with Deposit)              │
│  ✅ Walk-Ins (added by Merchant — no Deposit)                     │
│  ✅ Phone Bookings (added by Merchant — optional Deposit)         │
│  ✅ Blocked Slots (breaks, maintenance, prayer time)              │
│                                                                    │
│  Every entry blocks the same underlying Slot grid,                │
│  preventing double-booking across all channels.                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 2. Calendar Architecture

### 2.1 Unified Slot Grid

The calendar is based on a **Slot Grid** — a time-divided grid per Staff member (or per Resource, like a pitch).

| Concept | Definition |
|---------|-----------|
| **Slot** | A bookable time window. Minimum granularity: 15 minutes. |
| **Grid Resolution** | Configurable per Merchant: 15 / 30 / 60 min intervals (default: 30 min). |
| **Grid Scope** | Per Staff member. If Merchant has 3 barbers, there are 3 parallel grids. |
| **Grid Window** | Merchant's working hours (e.g., 09:00–23:00 EET). Set in Merchant Dashboard. |

### 2.2 Entry Types

| Entry Type | Source | Deposit | Color (Dashboard) | Booking ID | Counts in Analytics |
|-----------|--------|---------|-------------------|------------|---------------------|
| **Online Booking** | Client App | ✅ Required | 🟢 Green | `BK-YYMMDD-XXXX` | ✅ GMV + Commission |
| **Walk-In** | Merchant Quick-Add | ❌ None | 🔵 Blue | `WK-YYMMDD-XXXX` | ✅ GMV (no commission) |
| **Phone Booking** | Merchant manual entry | ⚠️ Optional | 🟡 Yellow | `PH-YYMMDD-XXXX` | ✅ GMV (no commission) |
| **Blocked Slot** | Merchant manual | N/A | ⬛ Gray | `BL-YYMMDD-XXXX` | ❌ Not a Booking |

### 2.3 How Entries Block Slots

```
Timeline: 14:00 ─── 14:30 ─── 15:00 ─── 15:30 ─── 16:00

Staff: Ahmed
  🟢 BK-260215-0012 (Online Booking: Haircut 30 min)
  [████████████████]
                    🔵 WK-260215-0005 (Walk-In: Beard Trim 30 min)
                    [████████████████]
                                      ── Available ──
                                      [░░░░░░░░░░░░░░░]

Staff: Omar
  ⬛ BL-260215-0001 (Break)
  [████████████████]
                    🟡 PH-260215-0002 (Phone Booking: Coloring 60 min)
                    [████████████████████████████████████]

→ A Client trying to book Ahmed at 14:00 online → BLOCKED (occupied)
→ A Client trying to book Ahmed at 15:00 online → AVAILABLE ✅
→ A walk-in requesting Omar at 14:30 → AVAILABLE (phone booking starts 14:30) → Wait, BLOCKED
```

> **Critical Rule:** ALL entry types consume the same Slot grid. An online Booking at 14:00 blocks the same Slot as a walk-in at 14:00. There is **no** separate "online calendar" and "offline calendar."

---

## 3. Walk-In Quick-Add (< 10 Seconds)

### 3.1 The 10-Second Design Challenge

> A walk-in Client is standing in front of the Merchant. The Merchant has maximum 10 seconds to capture this before it disrupts operations. The Quick-Add flow must be **brutally simple**.

### 3.2 Quick-Add Flow

```
┌──────────────────────────────────────────────────────────────┐
│  ➕ إضافة سريعة (Quick-Add)                                  │
│                                                               │
│  Step 1: Select Service              [2 seconds]             │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐                  │
│  │ ✂️ قص شعر  │ │ 🧔 ذقن    │ │ ✂️+🧔 كومبو │                  │
│  └───────────┘ └───────────┘ └───────────┘                  │
│  (Top 6 Services shown as quick-tap cards,                   │
│   ordered by frequency. "More..." for full list.)            │
│                                                               │
│  Step 2: Assign Staff (Auto)          [0 seconds]            │
│  → Auto-assigns to "Next Available" staff member.            │
│  → Tap to override: [ أحمد ] [ عمر ] [ منى ]                 │
│                                                               │
│  Step 3: Client Name (Optional)       [3 seconds]            │
│  [ اسم العميل (اختياري) ] or [ Existing Client Lookup 🔍 ]  │
│                                                               │
│  Step 4: Confirm                      [1 second]             │
│  [ ✅ أضف دلوقتي ]                                           │
│                                                               │
│  Total: < 10 seconds ⚡                                       │
└──────────────────────────────────────────────────────────────┘
```

### 3.3 Quick-Add Data Model

| Field | Required | Default | Notes |
|-------|----------|---------|-------|
| `service_id` | ✅ | — | Selected from quick-tap cards |
| `staff_id` | ❌ | Next available | Auto-assigned or manually overridden |
| `client_name` | ❌ | "عميل بدون اسم" (Anonymous) | Free text or lookup from CRM |
| `client_phone` | ❌ | `null` | If provided, links to Client profile (creates one if new) |
| `start_time` | Auto | `NOW()` | Starts immediately. Can be adjusted for "arrived 10 min ago." |
| `duration` | Auto | Service default | From Service catalog |
| `add_ons` | ❌ | None | Quick-add skips add-ons. Can be edited later. |
| `notes` | ❌ | `null` | Internal note (e.g., "VIP client — free tea") |
| `payment_method` | ❌ | `CASH` | Default is cash for walk-ins. Options: `CASH` / `CARD` / `WALLET` |

### 3.4 Quick-Add Business Rules

| Rule | Detail |
|------|--------|
| **No Deposit** | Walk-ins do NOT pay a Deposit through Booky. They pay directly at the Merchant's POS. |
| **No Commission** | Booky does NOT take commission on walk-in entries. This is a free value-add to encourage Merchant Dashboard adoption. |
| **Slot Blocking** | Walk-in entry IMMEDIATELY blocks the Slot. Online Clients see it as unavailable within 2 seconds. |
| **Anonymous Allowed** | Merchant can add a walk-in without any Client info. Useful for quick captures. |
| **CRM Linkage** | If a phone number is entered and matches an existing Booky Client profile → link the walk-in to that Client. Merchant sees Client history. |
| **Auto-Timer** | Walk-in Slot starts at `NOW()` and runs for the Service's `duration_minutes`. |
| **Undo** | Merchant can delete a walk-in entry within 5 minutes (accidental tap). After 5 min: requires "Cancel" flow. |

---

## 4. Queue & Waiting List Management

### 4.1 When Does the Queue Activate?

The Queue becomes relevant when:
1. ALL Slots for the requested Service are occupied (all Staff busy).
2. A walk-in arrives but there's no immediate availability.
3. An online Client wants to book "ASAP" but the next Slot is > 30 minutes away.

### 4.2 Queue Data Model

| Field | Type | Description |
|-------|------|-------------|
| `queue_id` | UUID v4 | Unique ID |
| `merchant_id` | UUID v4 | FK → Merchants |
| `client_name` | String | Walk-in name or Booky Client name |
| `client_phone` | String | For SMS/WhatsApp notification |
| `service_id` | UUID v4 | Requested Service |
| `staff_preference` | UUID v4 | Optional: preferred Staff |
| `position` | Integer | Queue position (1 = next) |
| `status` | Enum | `WAITING` / `CALLED` / `SEATED` / `LEFT` / `EXPIRED` |
| `estimated_wait` | Integer (min) | System-calculated wait time |
| `joined_at` | Timestamp | When Client joined queue |
| `called_at` | Timestamp | When Merchant called the Client |
| `expires_at` | Timestamp | Auto-expire after configurable duration |

### 4.3 Queue Flow

```
Walk-in arrives → All chairs occupied
         │
         ▼
  Merchant adds to Queue
    → Assigns queue position (#3)
    → System calculates ETA: ~25 min
    → Client gets physical ticket or WhatsApp message
         │
         ▼
  Chair frees up → System notifies Merchant: "الدور على [اسم]"
         │
         ▼
  Merchant taps "Call" → Client notified (WhatsApp/SMS)
         │
         ├── Client arrives within 5 min → "Seated" → Walk-In created
         │
         └── Client doesn't respond in 5 min → Status: "LEFT"
             → Next in queue is called
```

### 4.4 Queue Rules

| Rule | Detail |
|------|--------|
| **Position is FIFO** | First-come, first-served. No queue-jumping (except VIP Subscription Tier Clients). |
| **VIP Priority** | Clients with VIP Subscription Tier can skip to position 2 (but never position 1 — fairness). |
| **Estimated Wait Time** | Calculated as: `sum(remaining_duration of current Bookings/Walk-ins on all Staff) / number_of_staff`. Updated in real-time. |
| **Notification** | When it's the Client's turn: WhatsApp message + App Push: "دورك وصل في [Merchant]! تعال خلال 5 دقايق 🏃" |
| **Expiry** | If Client doesn't respond within 5 minutes of being called: auto-skipped. Moved to queue end or removed. |
| **Max Queue Size** | Configurable per Merchant. Default: 10. When full: "الطابور مليان حاليًا — حاول بعد شوية." |
| **Online Queue** (Phase 2) | Client can join the queue from the app (remote queuing). Same logic, but Client gets real-time position updates. |
| **Queue + Booking Conflict** | If a queued walk-in and an online Booking compete for the same freed Slot: **online Booking wins** (paid Deposit = commitment). Walk-in waits for next Slot. |

### 4.5 Queue Dashboard Widget

```
┌──────────────────────────────────────────────────────────────┐
│  📋 الطابور الحالي (Current Queue)          3 / 10 في الانتظار │
│                                                               │
│  #1  أحمد محمد   | قص شعر    | ⏱️ ~5 دقايق  | [ نادي 📢 ]    │
│  #2  عميل بدون اسم | ذقن      | ⏱️ ~20 دقيقة  | [ نادي 📢 ]    │
│  #3  سارة        | صبغة     | ⏱️ ~35 دقيقة  | [ نادي 📢 ]    │
│                                                               │
│  [ ➕ أضف للطابور ]                                            │
└──────────────────────────────────────────────────────────────┘
```

---

## 5. POS Checkout (Offline Payments)

### 5.1 Why POS in a Booking App?

> The Merchant already uses Booky's Dashboard as their calendar and CRM. If they also use it as a lightweight POS, they never need to leave the app. This increases stickiness and gives Booky complete visibility into GMV (online + offline).

### 5.2 POS Checkout Flow (Walk-In / Phone Booking Completion)

```
Walk-In or Phone Booking completed
         │
         ▼
  Merchant taps "Checkout" on the entry
         │
         ▼
  ┌──────────────────────────────────────────────────────────┐
  │  💵 تسوية الحساب                                         │
  │                                                          │
  │  الخدمة: قص شعر                              100 ج.م   │
  │  إضافات: غسيل شعر                            +30 ج.م   │
  │  ──────────────────────────────────────────────────────  │
  │  الإجمالي:                                    130 ج.م   │
  │                                                          │
  │  طريقة الدفع:                                            │
  │  [ 💵 كاش ] [ 💳 فيزا ] [ 📱 محفظة ]                     │
  │                                                          │
  │  خصم / كوبون: [ اختياري ]                                │
  │                                                          │
  │  [ ✅ تم الدفع ]                                          │
  └──────────────────────────────────────────────────────────┘
```

### 5.3 POS Rules

| Rule | Detail |
|------|--------|
| **No Booky Commission** | Walk-in/phone Booking checkouts do NOT incur Booky commission. Revenue is 100% Merchant's. |
| **Payment Methods** | Cash (default), Card (if Merchant has a terminal), Wallet (Vodafone Cash, etc. — recorded manually). |
| **Tip Tracking** (Phase 2) | Optional "Tip" field. Tips go 100% to the assigned Staff member (not the Merchant). |
| **Receipt** | Digital receipt generated (optional print via Bluetooth thermal printer, Phase 2). |
| **GMV Attribution** | Walk-in revenue is tracked separately in analytics: "Online Revenue" vs. "Offline Revenue." |
| **Staff Commission** | If Staff commission is configured (see [staff-management-logic.md](mdc:docs/business-logic/06-merchant-operations/staff-management-logic.md)), it's calculated at POS checkout. |

---

## 6. Online vs. Offline Priority Rules

| Scenario | Winner | Rationale |
|----------|--------|-----------|
| Online Booking and Walk-in compete for the same Slot | **Online Booking** | Paid Deposit = binding commitment. |
| Walk-in already seated vs. online Booking for that Slot | **Walk-in** (already in progress) | Can't remove a seated Client. Online Booking auto-shifted to next available Slot with notification. |
| Queue Client and online Booking for the freed Slot | **Online Booking** | Paid Deposit takes priority over unpaid queue. |
| Two walk-ins arrive simultaneously | **FIFO** (who Merchant enters first) | Merchant's discretion. |
| Online Client arrives late (>15 min) and a walk-in took their Slot | **Online Client** | Walk-in must yield. Merchant should reserve online Bookings. Walk-in moved to queue. |

### Buffer Time

| Rule | Detail |
|------|--------|
| **Auto-buffer** | System adds `setup_minutes` + `cleanup_minutes` (from Service catalog) around every entry. |
| **Walk-in buffer** | Walk-ins get 5-minute auto-buffer after the Service duration ends (cleanup time). |
| **Override** | Merchant can disable buffer via settings: "تقليل الفراغات بين الحجوزات." |

---

## 7. Merchant Dashboard: Calendar View

### View Modes

| View | Description | Best For |
|------|------------|---------|
| **Day View** | Hour-by-hour grid, columns per Staff member | Daily operations (barbers, salons) |
| **Week View** | 7-day overview, summarized per Staff | Pitches, studios, coworking |
| **List View** | Chronological list of all entries | Quick scanning on mobile |
| **Month View** (Phase 2) | Monthly overview with Booking density heatmap | Trend spotting |

### Color Legend

| Color | Meaning | Entry Type |
|-------|---------|-----------|
| 🟢 Green | Online Booking (Deposit paid) | `BK-*` |
| 🔵 Blue | Walk-In (no Deposit) | `WK-*` |
| 🟡 Yellow | Phone Booking (optional Deposit) | `PH-*` |
| ⬛ Gray | Blocked (break, maintenance) | `BL-*` |
| 🔴 Red | No-Show or Cancelled | All types |
| 🟣 Purple | Currently in Queue | Queue entries |

---

## 8. Analytics & Reporting

### Walk-In Analytics

| Metric | Definition | Business Value |
|--------|-----------|---------------|
| **Walk-In Ratio** | Walk-ins / Total entries | Measures online adoption. Target: < 30% walk-ins as Merchant matures. |
| **Walk-In Conversion** | Walk-ins with Client phone / Total walk-ins | CRM capture rate. Higher = better retargeting. |
| **Peak Walk-In Hours** | Heatmap of walk-in times | Helps Merchant optimize staffing. |
| **Queue Wait Time Avg** | Average time from queue join to seated | Service quality indicator. |
| **Queue Dropout Rate** | % of queue Clients who left before being seated | If > 20%: Merchant may need more Staff. |
| **Online vs. Offline Revenue** | Revenue split by source | Tracks digital transformation of the Merchant. |

### Merchant Health Score Impact

| Factor | Weight | Logic |
|--------|--------|-------|
| Walk-In Ratio decreasing MoM | +5 points | Merchant is shifting to online → better data → better service. |
| Queue Wait Time < 15 min | +3 points | Good operational efficiency. |
| Queue Dropout Rate < 10% | +3 points | Clients don't leave. |
| > 80% of walk-ins have phone captured | +4 points | Strong CRM discipline. |

---

## 9. Gherkin Scenarios

### Scenario 1: Walk-In Quick-Add — Happy Path

```gherkin
Feature: Walk-In Quick-Add

  Scenario: Merchant adds a walk-in Client in under 10 seconds
    Given Merchant "صالون جوليا" has 3 Staff members:
      | name   | status      |
      | أحمد    | Available   |
      | عمر     | Busy (until 14:30) |
      | منى     | Available   |
    And the current time is 14:15 EET

    When the Merchant taps "➕ إضافة سريعة"
    And selects "✂️ قص شعر" (30 min, 100 EGP)
    And the system auto-assigns Staff "أحمد" (next available)
    And the Merchant enters Client name "محمد" (optional)
    And taps "✅ أضف دلوقتي"

    Then a Walk-In entry is created:
      | id             | WK-260215-0005    |
      | service        | قص شعر             |
      | staff          | أحمد               |
      | start_time     | 14:15             |
      | end_time       | 14:45             |
      | client_name    | محمد              |
      | payment_status | PENDING           |
    And أحمد's calendar is blocked from 14:15 to 14:45
    And an online Client trying to book أحمد at 14:30 sees the Slot as unavailable
    And the total time from tap to confirm was < 10 seconds
```

### Scenario 2: Walk-In Blocks an Online Booking Attempt

```gherkin
  Scenario: Walk-in prevents online double-booking
    Given Staff "أحمد" has a walk-in entry from 14:00 to 14:30
    When an online Client opens the booking page for أحمد
    Then the 14:00 Slot shows as "مش متاح" (unavailable)
    And the next available Slot shows as 14:30

  Scenario: Online Booking prevents walk-in on the same Slot
    Given Staff "أحمد" has an online Booking from 15:00 to 15:30
    When a walk-in arrives at 15:00 requesting أحمد
    Then the Merchant sees أحمد's 15:00 Slot is blocked (🟢 Online Booking)
    And the Merchant either:
      - Assigns the walk-in to a different Staff (عمر / منى)
      - Adds the walk-in to the Queue
```

### Scenario 3: Queue Management — Full Lifecycle

```gherkin
Feature: Queue Management

  Scenario: Walk-in joins queue and gets seated when chair frees up
    Given all 3 Staff members are busy at "صالون جوليا"
    And the estimated wait time is 20 minutes
    When a walk-in "خالد" arrives requesting "قص شعر"
    And the Merchant taps "➕ أضف للطابور"
    And enters Client name "خالد" and phone "+201055551234"

    Then a Queue entry is created at position #1
    And خالد receives a WhatsApp message:
      "أهلاً خالد! انت رقم #1 في الطابور — الوقت المتوقع ~20 دقيقة. هنكلمك لما دورك يجي! 🪑"

    When أحمد finishes his current Client at 14:30
    Then the system notifies the Merchant: "الدور على خالد — الكرسي بتاع أحمد فاضي"
    And the Merchant taps "نادي 📢" on خالد's queue entry

    Then خالد receives: "دورك وصل في صالون جوليا! تعال خلال 5 دقايق 🏃"
    And the queue timer starts (5-minute response window)

    When خالد arrives within 3 minutes
    And the Merchant taps "Seated" on خالد's queue entry
    Then a Walk-In entry is auto-created for خالد assigned to أحمد
    And خالد's queue entry status changes to "SEATED"
```

### Scenario 4: POS Checkout for Walk-In

```gherkin
Feature: POS Checkout

  Scenario: Merchant checks out a walk-in Client
    Given a Walk-In entry "WK-260215-0005" exists:
      | service        | قص شعر  |
      | client         | محمد    |
      | staff          | أحمد    |
      | base_price     | 100 EGP |

    When the service is complete and the Merchant taps "Checkout"
    And adds an add-on "غسيل شعر" (30 EGP) at checkout
    And selects payment method "💵 كاش"
    And taps "✅ تم الدفع"

    Then the checkout records:
      | total          | 130 EGP             |
      | payment_method | CASH                |
      | commission     | 0 EGP (no Booky %)  |
      | staff_cut      | Per staff commission rules |
    And the Walk-In entry status changes to "COMPLETED"
    And the Merchant's offline revenue increases by 130 EGP
    And if أحمد has a 10% staff commission: 13 EGP logged to أحمد's payout
```

---

## 10. Edge Cases

| # | Edge Case | Rule |
|---|-----------|------|
| 1 | **Merchant adds a walk-in for a past time (e.g., "Client arrived 30 min ago")** | Allowed. Merchant can adjust `start_time` up to 2 hours in the past. Calendar retroactively blocks the Slot. If an online Booking was confirmed for that time: conflict alert shown. Merchant must resolve manually. |
| 2 | **Walk-in takes longer than expected (overtime)** | Merchant can extend the walk-in entry by tapping "⏱️ مد الوقت". This blocks the next Slot. If the next Slot has an online Booking: alert the Merchant — they must manage. |
| 3 | **Internet goes down during walk-in entry** | Walk-in saved to local storage (offline mode). Synced when internet returns. Slot blocked locally to prevent the Merchant from double-adding. |
| 4 | **Client is already in Booky's system (matched by phone)** | Walk-in is linked to the Client's Booky profile. The Merchant sees: "العميل ده عنده حساب على بوكي — هيكسب عملات بوكي!" Incentivizes the Client to book online next time. |
| 5 | **Walk-in Client wants to create a Booky account** | Phase 2: Merchant can send an "invite link" via SMS from the walk-in checkout. Client signs up, walk-in is retroactively linked. |
| 6 | **Queue Client leaves and comes back** | If status = `LEFT` and Client returns within 30 min: Merchant can "Re-activate" and restore original position. After 30 min: must rejoin at end of queue. |
| 7 | **Online Booking cancelled while a queue Client is waiting** | System auto-offers the freed Slot to the next queue Client immediately. Merchant is notified: "حجز أونلاين اتلغى — الدور على [اسم] من الطابور." |
| 8 | **Merchant has only 1 Staff (solo operator)** | Queue is essential. Single-resource calendar. Quick-Add still works identically — just no Staff selection step. |
| 9 | **Walk-in revenue counted as GMV but Merchant wants to hide it** | Walk-in revenue is visible only to the Merchant and Booky Admin. It is NOT shown to Clients or in public profiles. Merchant cannot "hide" it from their own analytics (data integrity). |
| 10 | **Peak hour: 5 walk-ins arrive simultaneously** | Merchant Quick-Adds the first, adds others to Queue. System auto-calculates cascading ETAs. If all within same Service type: batch-add option (Phase 2). |

---

## Feature Availability by Subscription Tier

| Feature | Starter (99 EGP) | Growth (249 EGP) | Pro (499 EGP) |
|---------|------------------|-------------------|----------------|
| Online Bookings Calendar | ✅ | ✅ | ✅ |
| Walk-In Quick-Add | ✅ (5/day) | ✅ (Unlimited) | ✅ (Unlimited) |
| Phone Booking Add | ✅ (5/day) | ✅ (Unlimited) | ✅ (Unlimited) |
| Queue Management | ❌ | ✅ | ✅ |
| POS Checkout | ❌ | ✅ | ✅ |
| Offline Revenue Analytics | ❌ | ✅ | ✅ (Advanced) |
| Offline Mode (no internet) | ❌ | ❌ | ✅ |

---

> **📌 Source of Truth:** This document extends the Merchant Dashboard capabilities defined in [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md) §7 (Merchant Subscription) and integrates with [service-catalog-architecture.md](mdc:docs/business-logic/05-core-systems/service-catalog-architecture.md) for pricing and [fulfillment-protocol.md](mdc:docs/business-logic/03-merchant/fulfillment-protocol.md) for the online Handshake flow.
>
> *Booky Center: بضغطة واحدة.. ميعادك في جيبك* ✨

