# 📂 04-Admin Platform: Financial Oversight

## *Revenue Dashboard, Payout Approvals & Fraud Detection*

**Parent:** [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md)
**Cross-Refs:** [wallet-and-payouts.md](mdc:docs/business-logic/03-merchant/wallet-and-payouts.md) (Merchant Wallet), [booking-lifecycle.md](mdc:docs/business-logic/02-client/booking-lifecycle.md) (Escrow Model), [admin-moderation-workflow.md](mdc:docs/business-logic/04-admin-platform/admin-moderation-workflow.md)
**Version:** 1.0 | **Date:** February 15, 2026

---

## Table of Contents

1. [Financial Architecture Overview](#1-financial-architecture-overview)
2. [Revenue Dashboard](#2-revenue-dashboard)
3. [GMV vs. Net Revenue Logic](#3-gmv-vs-net-revenue-logic)
4. [Escrow Pool Management](#4-escrow-pool-management)
5. [Payout Processing & Approvals](#5-payout-processing--approvals)
6. [Fraud Detection & Suspicious Activity Flags](#6-fraud-detection--suspicious-activity-flags)
7. [Financial Reports](#7-financial-reports)
8. [Gherkin Scenarios](#8-gherkin-scenarios)
9. [Edge Cases](#9-edge-cases)

---

## 1. Financial Architecture Overview

### Money Flow Through the Platform

```
┌─────────────────────────────────────────────────────────────────────┐
│                    BOOKY CENTER FINANCIAL FLOW                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  INFLOWS (Money In)                                                 │
│  ═══════════════                                                    │
│  1. Client Deposits        → Booky Escrow Account                   │
│  2. Client Subscriptions   → Booky Revenue (recurring)              │
│  3. Merchant Subscriptions → Booky Revenue (recurring)              │
│                                                                      │
│  INTERNAL MOVEMENTS                                                 │
│  ═════════════════                                                  │
│  4. Escrow → Merchant Wallet   (on Handshake / No-Show)            │
│  5. Escrow → Client Refund     (on Cancellation / Dispute Win)     │
│  6. Commission deducted at #4  (Escrow → Booky Revenue)            │
│                                                                      │
│  OUTFLOWS (Money Out)                                               │
│  ════════════════                                                   │
│  7. Merchant Wallet → Merchant's Bank/Vodafone/InstaPay (Payout)   │
│  8. Escrow → Client's Payment Method (Refund)                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Three Separate Pools

| Pool | Description | Access |
|------|-------------|--------|
| **Booky Escrow** | Holds Client Deposits until trigger event (Handshake, No-Show, Cancellation, Dispute). NOT Booky's money. | System-managed. Finance Admin oversight. |
| **Booky Revenue** | Commission income + subscription income. This IS Booky's money. | Finance Admin + Senior Admin. |
| **Merchant Wallets** | Aggregated per-Merchant Available balances. Technically Booky holds these funds until withdrawal. | Merchant self-service withdrawal. Finance Admin oversight for flagged payouts. |

> **Critical Accounting Rule:** Escrow funds and Merchant Wallet funds are **NOT** Booky's revenue. They are liabilities (money owed to others). Only commissions and subscriptions are revenue. The Revenue Dashboard must reflect this distinction clearly.

---

## 2. Revenue Dashboard

### Dashboard Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  💰 Financial Dashboard          Date Range: [ This Month ▾ ]    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│  │  Total GMV      │  │  Net Revenue   │  │  Escrow Balance │     │
│  │  ₤ 2,850,000   │  │  ₤ 285,000    │  │  ₤ 420,000     │     │
│  │  ▲ +12% MoM    │  │  ▲ +15% MoM   │  │  (Pending)     │     │
│  └────────────────┘  └────────────────┘  └────────────────┘     │
│                                                                   │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│  │  Subscriptions  │  │  Commissions   │  │  Payouts Today │     │
│  │  (Revenue)      │  │  (Revenue)     │  │  (Outflow)     │     │
│  │  ₤ 85,000      │  │  ₤ 200,000    │  │  ₤ 150,000     │     │
│  │  Client: 45K   │  │  Fixed: 80K    │  │  Pending: 12   │     │
│  │  Merchant: 40K │  │  %: 120K       │  │  Flagged: 2    │     │
│  └────────────────┘  └────────────────┘  └────────────────┘     │
│                                                                   │
│  ── Revenue by Sector (Pie Chart) ───────────────────────────── │
│  ── GMV Trend (Line Chart, 30 days) ─────────────────────────── │
│  ── Top Merchants by Revenue ────────────────────────────────── │
│  ── Payout Queue ────────────────────────────────────────────── │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Key Metrics

| Metric | Definition | Source |
|--------|-----------|--------|
| **Total GMV** | Gross Merchandise Value — sum of ALL Booking values (full Service prices, not just Deposits) | Bookings table |
| **Deposit Volume** | Total Deposits collected (held in Escrow) | Escrow ledger |
| **Net Revenue** | Booky's take: Commissions + Subscriptions | Revenue ledger |
| **Commission Revenue** | Sum of all commissions deducted at Handshake/No-Show | Commission ledger |
| **Subscription Revenue** | Client (Premium/VIP) + Merchant (Starter/Growth/Pro) recurring income | Subscription billing |
| **Escrow Balance** | Current total held in Escrow (unreleased Deposits) | Escrow pool |
| **Merchant Wallet Liability** | Total Available balances across all Merchant Wallets (money owed) | Wallet ledger |
| **Payout Volume** | Total disbursed to Merchants in the period | Payout ledger |
| **Refund Volume** | Total refunded to Clients in the period | Refund ledger |

---

## 3. GMV vs. Net Revenue Logic

### The Math

```
GMV = Sum of all Booking Service prices (full value, not just Deposit)

Example for February 2026:
  1,000 Bookings × avg 2,850 EGP Service price = ₤2,850,000 GMV

Deposit Volume = Sum of Deposits collected
  1,000 Bookings × avg 570 EGP Deposit = ₤570,000

Commission Revenue = Sum of commission from all completed/no-show Bookings
  Fixed fee Bookings: 400 × avg 22 EGP = ₤8,800
  Percentage Bookings: 600 × avg 38 EGP = ₤22,800
  Total Commission = ₤31,600

Subscription Revenue:
  Client: 3,000 Premium (12 EGP) + 750 VIP (50 EGP) = ₤73,500
  Merchant: 300 Starter (99) + 80 Growth (249) + 20 Pro (499) = ₤59,600
  Total Subscriptions = ₤133,100

NET REVENUE = Commission + Subscriptions = ₤164,700
TAKE RATE = Net Revenue / GMV = 164,700 / 2,850,000 = ~5.8%
```

### Revenue Breakdown by Stream

| Stream | % of Net Revenue (Target) | Growth Driver |
|--------|--------------------------|---------------|
| Transaction Commissions | ~55% | More Bookings, higher-ticket Services |
| Merchant Subscriptions | ~25% | Tier upgrades, new Merchant acquisition |
| Client Subscriptions | ~20% | Premium/VIP conversion, retention |

---

## 4. Escrow Pool Management

### Escrow Health Metrics

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| **Total Held** | All funds currently in Escrow | > ₤5M → report to Finance Director |
| **Avg Hold Duration** | Average time funds stay in Escrow | > 72 hours → investigate stuck Bookings |
| **Frozen (Disputes)** | Funds locked due to active Disputes | > 10% of Escrow → escalate |
| **Stale Entries** | Escrow entries older than 7 days with no resolution | Any → auto-investigate |

### Escrow Reconciliation

| Frequency | What | Who |
|-----------|------|-----|
| **Daily** | Automated: sum of Escrow entries vs. actual bank balance | System (auto-report) |
| **Weekly** | Manual spot-check: 20 random Escrow entries verified end-to-end | Finance Admin |
| **Monthly** | Full reconciliation: every Escrow entry accounted for (released, refunded, or disputed) | Finance Admin + External Auditor (Phase 2) |

---

## 5. Payout Processing & Approvals

### 5.1 Standard Payout Flow

```
Merchant requests withdrawal (≥ 500 EGP)
       │
       ▼
System checks:
  ✅ Amount ≤ Available balance
  ✅ Payout method verified
  ✅ No active fraud flags
       │
       ├── All clear → AUTO-APPROVE → Process payout
       │
       └── Flag triggered → MANUAL REVIEW QUEUE
                │
                ▼
         Finance Admin reviews
                │
                ├── Approve → Process payout
                └── Reject → Notify Merchant + investigation
```

### 5.2 Auto-Approval Rules

| Condition | Auto-Approve? |
|-----------|--------------|
| Amount < 5,000 EGP | ✅ Yes |
| Merchant is `APPROVED` (KYC) | ✅ Yes |
| No fraud flags on account | ✅ Yes |
| Payout method unchanged in last 24h | ✅ Yes |
| **All of above true** | ✅ **Auto-process** |

### 5.3 Manual Review Triggers (Flagged Payouts)

| # | Trigger | Severity | Action |
|---|---------|----------|--------|
| 1 | **Amount ≥ 5,000 EGP** | 🟡 Medium | Finance Admin reviews before processing |
| 2 | **First-ever withdrawal for Merchant** | 🟡 Medium | Verify Merchant is real, KYC complete |
| 3 | **3+ withdrawals in 24 hours** | 🔴 High | Possible account compromise. Hold all payouts. Notify Merchant. |
| 4 | **Payout method changed in last 24h** | 🔴 High | Possible account takeover. Verify with Merchant via phone call. |
| 5 | **Merchant has active Disputes > 30% of Bookings** | 🔴 High | Possible fraud. Full account review before payout. |
| 6 | **Sudden spike: Merchant earned 10x their monthly average in 1 day** | 🔴 High | Verify Bookings are legitimate (not self-booking). |
| 7 | **Merchant's KYC state is not APPROVED** | 🔴 High | Block payout. Notify Merchant to complete verification. |
| 8 | **Withdrawal amount = exact Available balance (emptying account)** | 🟡 Medium | Flag for review if combined with other signals. |

### 5.4 Flagged Payout Queue

```
┌──────────────────────────────────────────────────────────────────┐
│  🚩 Flagged Payouts                          Pending: 4          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  🔴 #PO-4821 | ملاعب النصر | 8,500 EGP | Vodafone Cash          │
│     Flag: AMOUNT ≥ 5000 + FIRST_WITHDRAWAL                       │
│     KYC: ✅ Approved | Account Age: 3 days                        │
│     [ Approve ] [ Reject ] [ Investigate ]                        │
│                                                                   │
│  🔴 #PO-4819 | باربر شوب الكينج | 2,200 EGP | InstaPay           │
│     Flag: PAYOUT_METHOD_CHANGED (24h ago)                         │
│     KYC: ✅ Approved | Account Age: 45 days                       │
│     [ Approve ] [ Reject ] [ Call Merchant ] [ Investigate ]      │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 5.5 Investigation Actions

| Action | Description |
|--------|-------------|
| **Approve** | Clear flag, process payout. Audit-logged. |
| **Reject** | Block payout. Merchant notified: "تم إيقاف السحب مؤقتًا — تواصل مع الدعم." Funds remain Available. |
| **Call Merchant** | Phone verification. Admin confirms identity and intent. Notes added to case. |
| **Investigate** | Full account review: all Bookings, Client patterns, payment sources. Can take up to 72h. Payout held. |
| **Freeze Account** | All payouts blocked. Available balance frozen. Escalation to Legal if fraud confirmed. |

---

## 6. Fraud Detection & Suspicious Activity Flags

### Common Fraud Patterns

| # | Pattern | Description | Detection Method |
|---|---------|-------------|------------------|
| 1 | **Self-Booking** | Merchant creates a fake Client account and books their own Service to generate fake revenue. | Check: same device fingerprint, same IP, same GPS location for Client and Merchant. |
| 2 | **Deposit Washing** | Client pays Deposit via stolen card → cancels → receives refund to a different method. | Check: refund method ≠ original payment method. Block cross-method refunds. |
| 3 | **Review Manipulation** | Merchant pays people to leave 5-star reviews. | Check: reviewers with 0 Bookings elsewhere, all reviews from same IP, review text similarity > 80%. |
| 4 | **Ghost Merchant** | Merchant signs up, collects Deposits, never provides service. | Check: 0 QR Handshakes + high no-show-by-Merchant rate. Auto-suspend after 5 consecutive Merchant-fault events. |
| 5 | **Collusion** | Client and Merchant agree to split the Deposit via dispute. | Check: same Client + Merchant disputing repeatedly. Same resolution pattern. |

### Automated Alert Thresholds

| Alert | Threshold | Action |
|-------|-----------|--------|
| **High Refund Rate** | > 30% of Bookings refunded in 30 days (per Merchant) | Flag account for review |
| **High Dispute Rate** | > 20% of Bookings disputed in 30 days (per Merchant) | Auto-suspend new Bookings |
| **Rapid Withdrawals** | > 3 withdrawals in 24 hours | Hold all payouts pending review |
| **Large Single Payout** | > 20,000 EGP in one withdrawal | Require Senior Admin approval |
| **New Account + Large Earnings** | Account < 7 days old + earnings > 5,000 EGP | Flag for KYC + Booking verification |
| **Same Device Multiple Accounts** | 2+ accounts (Client + Merchant) on same device | Flag for self-booking investigation |

---

## 7. Financial Reports

### Available Reports

| Report | Frequency | Audience | Contents |
|--------|-----------|----------|----------|
| **Daily Flash** | Daily (auto, 06:00 EET) | Finance Admin, CEO | Yesterday's GMV, revenue, payouts, escrow balance, flagged items. |
| **Weekly Revenue** | Weekly (Sunday) | Finance Team | Revenue by stream, by Sector, MoM trend, top Merchants, commission breakdown. |
| **Monthly P&L** | Monthly (1st of month) | Finance Director, Board | Full profit & loss: revenue streams, COGS (payout processing fees), gross margin, operating expenses. |
| **Merchant Statement** | Monthly (auto per Merchant) | Merchant (self-serve) | Per-Merchant: earnings, commissions, payouts, pending. PDF download. |
| **Escrow Reconciliation** | Monthly | Finance Admin + Auditor | Full Escrow accounting: opening balance, inflows, releases, refunds, closing balance. |
| **Tax Report** | Quarterly | Finance + Legal | Revenue subject to VAT, commission income by category, subscription income. |

### Report Format

| Rule | Detail |
|------|--------|
| **Currency** | EGP (integers, no floats). All reports in EGP. |
| **Timezone** | All timestamps displayed in EET (Africa/Cairo). Stored as UTC. |
| **Export** | PDF + CSV + API endpoint (for BI tools). |
| **Access** | Role-gated. Support Agents cannot access financial reports. |

---

## 8. Gherkin Scenarios

### Scenario 1: Flagged Payout — High Amount

```gherkin
Feature: Payout Fraud Detection

  Scenario: Large withdrawal triggers manual review
    Given a Merchant "ملاعب النصر" has Available balance: 12,000 EGP
    And the Merchant's KYC state is "APPROVED"
    And this is the Merchant's first withdrawal

    When the Merchant requests a withdrawal of 8,500 EGP to Vodafone Cash
    Then the system flags the payout:
      | flag                | reason                        |
      | AMOUNT_THRESHOLD    | ≥ 5,000 EGP                  |
      | FIRST_WITHDRAWAL    | First-ever payout for account |
    And the payout enters the "Flagged Payouts" queue
    And the Merchant sees: "طلب السحب قيد المراجعة — هيتحول في أقرب وقت ⏳"
    And a Finance Admin is notified

    When the Finance Admin reviews the case:
      | check                    | result                |
      | KYC approved             | ✅                    |
      | Bookings are legitimate  | ✅ (12 unique Clients)|
      | No dispute history       | ✅                    |
    And clicks "Approve"

    Then the payout of 8,500 EGP is processed to Vodafone Cash
    And the Merchant receives: "✅ تم تحويل 8,500 ج.م لمحفظة فودافون كاش"
    And the audit log records the approval
```

### Scenario 2: Self-Booking Fraud Detection

```gherkin
  Scenario: System detects self-booking pattern
    Given a Merchant "باربر شوب X" registered 3 days ago
    And a Client "أحمد Y" registered 2 days ago
    And both accounts share:
      | signal           | value                   |
      | device_id        | same (fingerprint match)|
      | ip_address       | same (192.168.1.15)     |
      | gps_location     | within 10 meters        |
    And "أحمد Y" has made 5 Bookings at "باربر شوب X" (and nowhere else)

    When the system's hourly fraud scan runs
    Then it flags both accounts:
      | alert               | severity |
      | SELF_BOOKING_SUSPECT | 🔴 High  |
    And the Merchant's payouts are automatically held
    And a Finance Admin + Dispute Resolver are notified
    And the investigation case is auto-created with all evidence
```

### Scenario 3: Revenue Dashboard Query

```gherkin
Feature: Financial Revenue Dashboard

  Scenario: Finance Admin views monthly revenue breakdown
    Given the current month is February 2026
    And the following data exists:
      | metric                     | value         |
      | total_bookings_completed   | 8,500         |
      | total_gmv                  | 2,850,000 EGP |
      | total_deposits_collected   | 570,000 EGP   |
      | commission_fixed_fee       | 52,000 EGP    |
      | commission_percentage      | 78,000 EGP    |
      | client_subscriptions       | 73,500 EGP    |
      | merchant_subscriptions     | 59,600 EGP    |
      | total_refunds              | 45,000 EGP    |
      | total_payouts_to_merchants | 480,000 EGP   |

    When the Finance Admin opens the Revenue Dashboard for February 2026
    Then the dashboard displays:
      | card               | value           |
      | Total GMV          | ₤ 2,850,000    |
      | Net Revenue        | ₤ 263,100      | # 52K + 78K + 73.5K + 59.6K
      | Escrow Balance     | ₤ 45,000       | # 570K - 480K - 45K
      | Take Rate          | 9.2%           | # 263,100 / 2,850,000
    And shows a Sector breakdown pie chart
    And shows a 30-day GMV trend line
```

---

## 9. Edge Cases

| # | Edge Case | Rule |
|---|-----------|------|
| 1 | **Escrow balance and bank balance don't match (reconciliation gap)** | Auto-alert Finance Director. Investigate within 4 hours. Possible causes: delayed bank settlement, processing error, or unauthorized withdrawal. |
| 2 | **Merchant Wallet balance is negative** | Should be impossible (system validates before deducting). If detected: freeze account, investigate, escalate to engineering. |
| 3 | **Currency conversion needed** | Not applicable — EGP only. If a foreign card pays a Deposit, the payment gateway handles conversion. Booky only sees EGP integers. |
| 4 | **Merchant requests payout while Booky's operational account has insufficient funds** | Queue the payout. Alert Finance Director immediately. Payout within 24 hours once funds are available. |
| 5 | **Tax authority requests financial data** | Provide via Tax Report. All data available in compliant format. Requires Legal team approval before sharing. |
| 6 | **Merchant earned exactly 500 EGP (minimum) and requests withdrawal** | Allow. 500 EGP is the minimum. No special treatment. |
| 7 | **Two Finance Admins approve the same flagged payout simultaneously** | System uses optimistic locking. Second approval is rejected: "الطلب ده اتراجع بالفعل." |
| 8 | **Daily flash report fails to generate** | Retry 3 times. If still fails: alert engineering. Manually generate from backup data. |

---

> **📌 Source of Truth:** This document aligns with [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md) §10 (Revenue & Commission), §11 (Deposit System), §15 (Key Metrics). Payout rules depend on [wallet-and-payouts.md](mdc:docs/business-logic/03-merchant/wallet-and-payouts.md).
>
> *Booky Center: بضغطة واحدة.. ميعادك في جيبك* ✨


