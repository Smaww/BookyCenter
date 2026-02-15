# 📂 03-Merchant: Wallet & Payouts

## *How Money Flows from Escrow to the Merchant's Pocket*

**Parent:** [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md)
**Version:** 1.0 | **Date:** February 15, 2026
**Persona:** The Merchant (التاجر) — managing earnings, withdrawals, and settlement.

---

## Table of Contents

1. [The Merchant Wallet](#1-the-merchant-wallet)
2. [Earnings Lifecycle](#2-earnings-lifecycle)
3. [Commission Deduction (Automatic)](#3-commission-deduction-automatic)
4. [Withdrawal Rules](#4-withdrawal-rules)
5. [Settlement Cycles](#5-settlement-cycles)
6. [Payout Methods](#6-payout-methods)
7. [Wallet Dashboard UI](#7-wallet-dashboard-ui)
8. [Gherkin Scenarios](#8-gherkin-scenarios)
9. [Edge Cases](#9-edge-cases)

---

## 1. The Merchant Wallet

### Definition

> The **Merchant Wallet** (محفظة التاجر) is a digital ledger within the Booky Center platform that tracks the Merchant's available balance, pending earnings, and payout history. It is NOT a bank account — it is a platform-managed balance that the Merchant can withdraw to their external account.

### Wallet Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      MERCHANT WALLET                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌───────────────┐    ┌──────────────┐    ┌──────────────────┐ │
│   │   PENDING     │    │  AVAILABLE   │    │   WITHDRAWN      │ │
│   │   (معلّق)      │ ──►│  (متاح)      │ ──►│   (تم السحب)     │ │
│   └───────────────┘    └──────────────┘    └──────────────────┘ │
│                                                                  │
│   Deposits held in     Funds cleared &      Successfully sent   │
│   escrow or dispute    ready to withdraw    to external account  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│   Also tracked:                                                  │
│   • FROZEN (متجمّد) — Funds held due to active Dispute           │
│   • COMMISSION (عمولة) — Booky's cut (auto-deducted)             │
└─────────────────────────────────────────────────────────────────┘
```

### Balance Types

| Balance Type | Arabic | Description |
|-------------|--------|-------------|
| **Pending** | معلّق | Funds from confirmed Bookings where the Handshake hasn't happened yet. Merchant can see this amount but cannot withdraw it. |
| **Available** | متاح | Funds that have been released via Handshake or No-Show. Ready for withdrawal. |
| **Frozen** | متجمّد | Funds held due to an active Dispute. Cannot be withdrawn until resolved. |
| **Withdrawn** | تم السحب | Historical: funds that have been successfully transferred to the Merchant's external account. |

---

## 2. Earnings Lifecycle

### From Booking → To Merchant's Pocket

```
STEP 1: Booking Confirmed
         └── Deposit (e.g. 60 EGP) → Booky Escrow
         └── Wallet shows: Pending +60 EGP

STEP 2: QR Handshake / No-Show (30 min)
         └── Escrow releases funds
         └── Commission deducted (e.g. 3 EGP)
         └── Wallet shows: Available +57 EGP, Pending -60 EGP

STEP 3: Merchant requests withdrawal (if balance ≥ 500 EGP)
         └── System initiates payout
         └── Wallet shows: Withdrawn +57 EGP, Available -57 EGP

STEP 4: Funds arrive in Merchant's external account
         └── Vodafone Cash: Instant
         └── InstaPay: Within minutes
         └── Bank Transfer: T+1 (next business day)
```

### Earnings Entry Types

| Entry Type | Trigger | Wallet Impact |
|-----------|---------|---------------|
| **Handshake Deposit** | Merchant scans Client QR/OTP | +Available (Deposit minus commission) |
| **No-Show Deposit** | 30-min timer expires, no Handshake | +Available (Deposit minus commission) |
| **Late Cancellation Penalty** | Client cancels within cancellation window | +Available (penalty amount minus commission) |
| **Dispute Freeze** | Client opens Dispute | Available → Frozen |
| **Dispute Resolution (Merchant Wins)** | Admin resolves in Merchant's favor | Frozen → Available |
| **Dispute Resolution (Client Wins)** | Admin resolves in Client's favor | Frozen → Refunded to Client (Merchant loses) |
| **Withdrawal** | Merchant requests payout | Available → Withdrawn |

---

## 3. Commission Deduction (Automatic)

> **Booky's commission is deducted at the moment funds move from Escrow to the Merchant Wallet. The Merchant ALWAYS sees the net amount — never the gross.**

### How It Works

```
Deposit in Escrow:  60 EGP (gross)
Booky Commission:   -3 EGP (5%)
────────────────────────────
Credited to Wallet: 57 EGP (net)

The Merchant's Wallet entry shows:
┌──────────────────────────────────────────────┐
│  ✅ حجز BK-260216-0001                        │
│  إجمالي العربون:  60 ج.م                      │
│  عمولة بوكي:     -3 ج.م (5%)                  │
│  صافي المبلغ:     57 ج.م ← محفظتك             │
└──────────────────────────────────────────────┘
```

### Commission Structures (Reference)

#### Fixed Fee Model (Low-Value, High-Frequency)

| Service Type | Fixed Fee |
|--------------|-----------|
| Barber / Haircut | 20 EGP |
| Gym Day Pass | 25 EGP |
| Nail Booking | 20 EGP |
| Small Home Repair | 30 EGP |

> **Rule:** Fixed fee cannot exceed the Deposit amount. If Deposit < Fixed Fee, the commission equals the Deposit (Merchant receives 0 EGP from that Deposit). This is an edge case — pricing should prevent it.

#### Percentage Model (High-Ticket, Variable-Value)

| Service Type | Commission % |
|--------------|-------------|
| Football Pitch | 5% |
| Event Venue | 8% |
| Wedding Service | 10% |
| Corporate Booking | 7% |
| Large Home Project | 5% |

### Commission Transparency

| Rule | Detail |
|------|--------|
| **Pre-Booking Visibility** | Merchant sees the commission rate when creating a Service in their catalog. |
| **Per-Transaction Breakdown** | Every wallet entry shows: gross Deposit, commission amount, net credited. |
| **Monthly Statement** | Auto-generated PDF at end of each month: all earnings, commissions, withdrawals. |
| **No Hidden Fees** | Commission is the ONLY platform fee. No listing fees, no transaction fees, no hidden charges (beyond the Subscription Tier). |

---

## 4. Withdrawal Rules

### Core Rules

| Rule | Value | Rationale |
|------|-------|-----------|
| **Minimum Withdrawal** | **500 EGP** | Prevents micro-transactions that cost more in processing fees than they're worth. |
| **Maximum Withdrawal** | No limit (balance permitting) | Merchants should have full access to their earnings. |
| **Withdrawal Frequency** | Unlimited (subject to minimum) | No arbitrary cooldown between withdrawals. |
| **Available Balance Only** | Cannot withdraw Pending or Frozen funds | Ensures all funds are verified before payout. |
| **Withdrawal Fee** | **0 EGP** (Booky absorbs transfer costs) | Competitive advantage. Commission is the only fee. |

### Balance Validation Before Withdrawal

```
Available Balance:  1,200 EGP
Frozen (Dispute):     200 EGP
Pending:              350 EGP
────────────────────────────────
Withdrawable:       1,200 EGP ← Only Available balance

Merchant requests:    800 EGP
Result:             ✅ Approved (800 ≤ 1,200 and 800 ≥ 500 minimum)
New Available:        400 EGP
```

### Withdrawal Request Flow

```
Merchant taps "اسحب فلوسك" (Withdraw Your Money)
       │
       ▼
System shows Available balance (e.g. 1,200 EGP)
       │
       ▼
Merchant enters amount (≥ 500 EGP, ≤ Available)
       │
       ▼
Merchant selects payout method:
  • فودافون كاش (Vodafone Cash)
  • إنستا باي (InstaPay)
  • تحويل بنكي (Bank Transfer)
       │
       ▼
Merchant confirms with PIN or biometric
       │
       ▼
System processes payout
       │
       ▼
Wallet updated: Available -800, Withdrawn +800
       │
       ▼
Merchant notified: "✅ تم تحويل 800 ج.م لحسابك"
```

---

## 5. Settlement Cycles

### Standard Settlement

| Payout Method | Settlement Speed | Availability |
|---------------|-----------------|--------------|
| **Vodafone Cash** | **Instant** (≤ 5 minutes) | 24/7 |
| **InstaPay** | **Near-Instant** (≤ 15 minutes) | 24/7 (bank dependent) |
| **Bank Transfer (IBAN)** | **T+1** (next business day) | Business days only (Sun–Thu in Egypt) |

### Why Instant Matters

> In Egypt's micro-service economy, most Merchants operate on thin margins and daily cash flow. A football pitch owner who just had 5 Bookings today needs that money **today**, not next week. Instant settlement via Vodafone Cash is Booky's **#1 Merchant retention feature**.

### Settlement Priority

The system defaults to the fastest available method:

```
1. Vodafone Cash (if registered) → Instant
2. InstaPay (if linked)          → Near-Instant
3. Bank Transfer (IBAN)          → T+1
```

> **Recommendation to Merchants:** "سجل محفظة فودافون كاش عشان فلوسك توصلك في لحظة."

---

## 6. Payout Methods

### 6.1 Vodafone Cash (فودافون كاش)

| Property | Value |
|----------|-------|
| **Setup** | Merchant links Vodafone Cash number during onboarding |
| **Validation** | OTP sent to the Vodafone number for verification |
| **Transfer** | Via Vodafone Cash API (B2C payout) |
| **Speed** | Instant (≤ 5 minutes) |
| **Limit** | Per Vodafone Cash daily/monthly limits (currently 30,000 EGP/day) |
| **Fee to Merchant** | 0 EGP (Booky absorbs) |

### 6.2 InstaPay (إنستا باي)

| Property | Value |
|----------|-------|
| **Setup** | Merchant links bank account or mobile wallet via InstaPay IPN |
| **Validation** | Micro-deposit verification (1 EGP sent, Merchant confirms) |
| **Transfer** | Via InstaPay API (instant payment network) |
| **Speed** | Near-Instant (≤ 15 minutes) |
| **Limit** | Per InstaPay transaction limits (currently 70,000 EGP/transaction) |
| **Fee to Merchant** | 0 EGP (Booky absorbs) |

### 6.3 Bank Transfer (تحويل بنكي)

| Property | Value |
|----------|-------|
| **Setup** | Merchant provides IBAN during onboarding |
| **Validation** | Manual verification by Booky Finance team (one-time) |
| **Transfer** | Via ACH/SWIFT domestic transfer |
| **Speed** | T+1 (next business day, Sun–Thu) |
| **Limit** | No practical limit |
| **Fee to Merchant** | 0 EGP (Booky absorbs) |

### Changing Payout Method

| Rule | Detail |
|------|--------|
| **When** | Anytime via Merchant Dashboard → Settings → Payout |
| **Verification** | New method requires re-verification (OTP or micro-deposit) |
| **Cooldown** | 24-hour cooldown before first withdrawal to new method (fraud prevention) |
| **Active Withdrawals** | Cannot change method while a withdrawal is in-progress |

---

## 7. Wallet Dashboard UI

### Main Wallet Screen

```
┌──────────────────────────────────────────────────────────────┐
│  💰 محفظتك                                                    │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐   │
│  │                                                        │   │
│  │   الرصيد المتاح                                        │   │
│  │   ١٬٢٠٠ ج.م                                           │   │
│  │                                                        │   │
│  │   [ اسحب فلوسك ]                                       │   │
│  │                                                        │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │  معلّق      │  │  متجمّد     │  │  إجمالي    │             │
│  │  350 ج.م   │  │  200 ج.م   │  │  الشهر     │             │
│  │            │  │            │  │  4,500 ج.م │             │
│  └────────────┘  └────────────┘  └────────────┘             │
│                                                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                               │
│  📋 آخر المعاملات                                             │
│                                                               │
│  ✅ BK-260216-0001  |  ملعب كورة  |  +57 ج.م   |  اليوم     │
│  ✅ BK-260215-0089  |  بادل       |  +76 ج.م   |  امبارح    │
│  ⏳ BK-260216-0042  |  كورة       |  +71 ج.م   |  معلّق      │
│  🔒 BK-260214-0033  |  قص شعر    |  200 ج.م   |  متجمّد     │
│  💸 سحب #0012       |  فودافون   |  -800 ج.م  |  12 فبراير │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Transaction Entry Format

| Field | Description |
|-------|-------------|
| **Status Icon** | ✅ Available / ⏳ Pending / 🔒 Frozen / 💸 Withdrawal / ❌ Dispute Lost |
| **Booking ID** | `BK-YYMMDD-XXXX` |
| **Service Name** | Short label |
| **Amount** | Net EGP (after commission) |
| **Date** | Relative (اليوم / امبارح) or absolute |

### Monthly Statement

| Field | Description |
|-------|-------------|
| **Period** | Calendar month (e.g., February 2026) |
| **Total Earnings (Gross)** | Sum of all Deposits received |
| **Total Commission** | Sum of all Booky commissions deducted |
| **Total Net Earnings** | Gross minus Commission |
| **Total Withdrawals** | Sum of all payouts sent |
| **Ending Available Balance** | Carryover to next month |
| **Format** | Auto-generated PDF, downloadable from Dashboard |
| **Delivery** | Email + in-app notification on the 1st of each month |

---

## 8. Gherkin Scenarios

### Scenario 1: Standard Withdrawal via Vodafone Cash

```gherkin
Feature: Merchant Wallet Withdrawal

  Scenario: Merchant withdraws available balance to Vodafone Cash
    Given a Merchant "ملاعب الأهرام" has the following wallet state:
      | available | 1,200 EGP |
      | pending   | 350 EGP   |
      | frozen    | 200 EGP   |
    And the Merchant's payout method is Vodafone Cash "+201234567890"
    And the minimum withdrawal is 500 EGP

    When the Merchant taps "اسحب فلوسك" (Withdraw)
    And enters amount: 800 EGP
    And confirms with their PIN
    Then the system validates:
      | check                    | result |
      | amount ≥ 500 EGP        | ✅     |
      | amount ≤ available (1200)| ✅     |
      | payout method verified   | ✅     |
    And the system initiates a Vodafone Cash B2C payout of 800 EGP
    And the wallet updates:
      | available | 400 EGP   |
      | withdrawn | +800 EGP  |
    And the Merchant receives SMS: "تم تحويل 800 ج.م لمحفظة فودافون كاش."
    And the payout arrives within 5 minutes
```

### Scenario 2: Withdrawal Below Minimum

```gherkin
  Scenario: Merchant tries to withdraw less than minimum
    Given a Merchant has available balance of 1,200 EGP
    When the Merchant enters withdrawal amount: 300 EGP
    Then the system rejects with:
      "الحد الأدنى للسحب 500 ج.م — ضيف كمان حجوزات وارجع تاني 💪"
    And no payout is initiated
    And the wallet balance remains unchanged
```

### Scenario 3: Withdrawal with Insufficient Balance

```gherkin
  Scenario: Merchant tries to withdraw more than available
    Given a Merchant has:
      | available | 400 EGP |
      | pending   | 600 EGP |
    When the Merchant enters withdrawal amount: 800 EGP
    Then the system rejects with:
      "رصيدك المتاح 400 ج.م بس. في 600 ج.م لسه معلّقين — هيتحولوا بعد تأكيد الحضور."
    And no payout is initiated
```

### Scenario 4: Commission Deduction Transparency

```gherkin
Feature: Commission Transparency

  Scenario: Merchant sees commission breakdown for each Booking
    Given a confirmed Booking:
      | booking_id | BK-260216-0001       |
      | service    | ملعب كورة ساعة       |
      | deposit    | 60 EGP              |
      | commission | 5% (percentage model) |
    When the QR Handshake is completed
    Then the wallet entry shows:
      | field          | value       |
      | booking_id     | BK-260216-0001 |
      | gross_deposit  | 60 EGP      |
      | commission     | -3 EGP (5%) |
      | net_credited   | 57 EGP      |
    And the Merchant never sees the 60 EGP as available
    And the 3 EGP is credited to Booky's revenue ledger
```

### Scenario 5: Dispute Freezes Funds

```gherkin
Feature: Dispute Impact on Wallet

  Scenario: Client opens dispute — funds move from Available to Frozen
    Given a Merchant wallet has:
      | available | 1,200 EGP |
      | frozen    | 0 EGP     |
    And Booking "BK-260216-0099" was completed with net 47 EGP credited
    When a Client opens a Dispute for "BK-260216-0099"
    Then the wallet updates:
      | available | 1,153 EGP | # 1200 - 47
      | frozen    | 47 EGP    |
    And the Merchant is notified:
      "في شكوى على حجز BK-260216-0099 — 47 ج.م اتجمّدوا لحد ما نراجع."

  Scenario: Dispute resolved in Merchant's favor — funds unfrozen
    Given a Merchant has 47 EGP in Frozen balance from Dispute
    When Admin resolves the Dispute in the Merchant's favor
    Then the wallet updates:
      | available | +47 EGP (unfrozen)  |
      | frozen    | -47 EGP             |
    And the Merchant is notified:
      "الشكوى اتحلت لصالحك — 47 ج.م رجعوا لرصيدك المتاح ✅"

  Scenario: Dispute resolved in Client's favor — Merchant loses funds
    Given a Merchant has 47 EGP in Frozen balance from Dispute
    When Admin resolves the Dispute in the Client's favor
    Then the wallet updates:
      | frozen    | -47 EGP |
    And the 47 EGP is refunded to the Client
    And the Merchant is notified:
      "الشكوى اتحلت لصالح العميل — 47 ج.م اترجعوا للعميل."
    And the Merchant's dispute-lost counter increments by 1
```

### Scenario 6: Monthly Statement Generation

```gherkin
Feature: Monthly Financial Statement

  Scenario: Auto-generated statement on the 1st of each month
    Given today is "2026-03-01"
    And the Merchant had the following activity in February 2026:
      | total_bookings_completed | 45         |
      | gross_deposits           | 3,200 EGP  |
      | total_commission         | 280 EGP    |
      | net_earnings             | 2,920 EGP  |
      | withdrawals              | 2,500 EGP  |
      | no_shows_received        | 3          |
      | disputes_won             | 1          |
      | disputes_lost            | 0          |

    When the system runs the monthly statement job at midnight
    Then a PDF statement is generated with all the above data
    And the statement is available in the Merchant Dashboard under "كشف حساب"
    And the Merchant receives an email with the PDF attached
    And the Merchant receives a push notification:
      "كشف حساب فبراير جاهز — شوفه دلوقتي 📊"
```

---

## 9. Edge Cases

| # | Edge Case | Business Rule |
|---|-----------|---------------|
| 1 | **Merchant's Vodafone Cash is at daily limit (30,000 EGP)** | System shows: "محفظة فودافون وصلت الحد اليومي — جرب إنستا باي أو سحب بنكي." Retry next day or use alternate method. |
| 2 | **InstaPay is down** | System detects outage → falls back to queued transfer. Merchant notified: "إنستا باي مش شغّال حاليًا — هنحوّل أول ما يرجع." Retry every 15 min. |
| 3 | **Bank transfer on Friday/Saturday (Egypt weekend)** | Queue for Sunday processing. Merchant notified: "التحويل هيتم يوم الأحد (أول يوم عمل)." |
| 4 | **Merchant changes Vodafone Cash number** | 24-hour cooldown on new number. Must re-verify with OTP. Any pending withdrawals continue to old number. |
| 5 | **Merchant account suspended (fraud investigation)** | All Available balance frozen. Withdrawals blocked. Merchant notified: "حسابك متوقف مؤقتًا — تواصل مع الدعم." Pending Bookings: Clients receive full refunds. |
| 6 | **Merchant has Available balance but no payout method configured** | Withdrawal button disabled. Prompt: "عشان تسحب فلوسك، ضيف طريقة دفع من الإعدادات." |
| 7 | **Commission exceeds Deposit (Fixed Fee edge case)** | If Deposit (e.g., 15 EGP) < Fixed Fee (e.g., 20 EGP): commission = Deposit amount. Merchant receives 0 EGP from that Deposit. Alert Merchant: "العمولة أكبر من العربون — راجع تسعير خدماتك." |
| 8 | **Merchant closes their account with Available balance** | 30-day grace period. Remaining balance force-withdrawn to last verified payout method. After 30 days, unclaimed funds → Booky operations reserve (per TOS). |
| 9 | **Currency rounding** | All amounts are integers (EGP). Commission rounding: always round UP in Booky's favor. 5% of 63 EGP = 3.15 → 4 EGP commission, 59 EGP to Merchant. |
| 10 | **Merchant subscription (SaaS fee) unpaid** | Subscription fees are billed separately (credit card / wallet). Wallet balance is NOT auto-debited for subscriptions unless Merchant opts in. |

---

> **📌 Source of Truth:** This document aligns with [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md) §7 (Merchant Subscription), §10 (Revenue & Commission), §11 (Deposit System).
>
> *Booky Center: بضغطة واحدة.. ميعادك في جيبك* ✨

