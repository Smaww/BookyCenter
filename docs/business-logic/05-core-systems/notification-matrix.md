# 📂 05-Core Systems: Notification Matrix

## *What Gets Sent, When, How, and to Whom*

**Parent:** [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md)
**Cross-Refs:** [booking-lifecycle.md](mdc:docs/business-logic/02-client/booking-lifecycle.md), [service-execution.md](mdc:docs/business-logic/02-client/service-execution.md), [wallet-and-payouts.md](mdc:docs/business-logic/03-merchant/wallet-and-payouts.md), [smart-onboarding-flow.md](mdc:docs/business-logic/03-merchant/smart-onboarding-flow.md)
**Version:** 1.0 | **Date:** February 15, 2026

---

## Table of Contents

1. [Notification Philosophy](#1-notification-philosophy)
2. [Channel Definitions](#2-channel-definitions)
3. [Client Notification Matrix](#3-client-notification-matrix)
4. [Merchant Notification Matrix](#4-merchant-notification-matrix)
5. [Admin / System Notifications](#5-admin--system-notifications)
6. [Channel Selection Logic](#6-channel-selection-logic)
7. [Notification Content Rules](#7-notification-content-rules)
8. [Quiet Hours & Rate Limiting](#8-quiet-hours--rate-limiting)
9. [Client Preferences](#9-client-preferences)
10. [Gherkin Scenarios](#10-gherkin-scenarios)
11. [Edge Cases](#11-edge-cases)

---

## 1. Notification Philosophy

### Core Principles

| Principle | Rule |
|-----------|------|
| **Helpful, not annoying** | Every notification must have clear value. No vanity metrics, no "We miss you" spam. |
| **Time-sensitive first** | Booking reminders, OTPs, and payment confirmations take priority over everything. |
| **Arabic first** | All Client-facing notifications in Egyptian Arabic (عامية مصرية). |
| **Actionable** | Every notification should have a clear next step (deep link, CTA button). |
| **Respect opt-out** | Clients can disable non-critical notifications. Critical ones (OTP, payment) cannot be disabled. |

---

## 2. Channel Definitions

| Channel | Arabic Name | Tech | Use For | Cost |
|---------|-------------|------|---------|------|
| **App Push** | إشعار التطبيق | Firebase Cloud Messaging (FCM) / APNs | Primary channel for everything. Real-time. Free delivery. | Free |
| **WhatsApp** | واتساب | WhatsApp Business API | High-importance messages, rich content (images, buttons). Egypt's #1 messaging app. | ~0.15 EGP per message |
| **SMS** | رسالة نصية | Twilio / local gateway | Fallback for OTP, critical alerts when app is uninstalled. | ~0.10 EGP per SMS |
| **Email** | إيميل | SendGrid / SES | Formal communications: receipts, statements, legal notices. | ~0.005 EGP per email |
| **In-App** | إشعار داخلي | Local notification center | Non-urgent updates, promotions, system messages. Stored in notification tray. | Free |

### Channel Priority (Fallback Chain)

```
App Push (primary)
    │ If undelivered after 30 sec
    ▼
WhatsApp (secondary)
    │ If undelivered after 60 sec
    ▼
SMS (fallback)
    │ (Email is separate — not a fallback, used for specific types only)
```

---

## 3. Client Notification Matrix

### 3.1 Booking Lifecycle

| # | Event | Trigger | App Push | WhatsApp | SMS | Email | In-App | Priority |
|---|-------|---------|----------|----------|-----|-------|--------|----------|
| C1 | **Booking Confirmed** | Deposit paid successfully | ✅ | ✅ | ❌ | ✅ (receipt) | ✅ | 🔴 Critical |
| C2 | **Booking Reminder (1hr)** | 1 hour before Slot | ✅ | ✅ | ❌ | ❌ | ✅ | 🔴 Critical |
| C3 | **Booking Reminder (15min)** | 15 min before Slot | ✅ | ❌ | ❌ | ❌ | ✅ | 🟡 Important |
| C4 | **Booking Completed** | QR Handshake scanned | ✅ | ❌ | ❌ | ❌ | ✅ | 🟢 Normal |
| C5 | **Cancelled by Client** | Client cancels | ✅ | ✅ | ❌ | ✅ (receipt) | ✅ | 🔴 Critical |
| C6 | **Cancelled by Merchant** | Merchant cancels | ✅ | ✅ | ❌ | ✅ (receipt) | ✅ | 🔴 Critical |
| C7 | **No-Show Recorded** | 30 min after Slot, no Handshake | ✅ | ✅ | ❌ | ❌ | ✅ | 🔴 Critical |
| C8 | **Review Prompt** | 2 hours after Slot end | ✅ | ❌ | ❌ | ❌ | ✅ | 🟢 Normal |
| C9 | **Rebook Suggestion** | 7 days after last Booking | ✅ | ❌ | ❌ | ❌ | ✅ | 🟢 Normal |

### 3.2 Payments & Wallet

| # | Event | Trigger | App Push | WhatsApp | SMS | Email | In-App | Priority |
|---|-------|---------|----------|----------|-----|-------|--------|----------|
| C10 | **Deposit Payment Success** | Payment gateway confirms | ✅ | ✅ | ❌ | ✅ | ✅ | 🔴 Critical |
| C11 | **Refund Initiated** | Cancellation or dispute win | ✅ | ✅ | ❌ | ✅ | ✅ | 🔴 Critical |
| C12 | **Refund Completed** | Funds returned | ✅ | ❌ | ❌ | ✅ | ✅ | 🟡 Important |
| C13 | **Booky Coins Earned** | Booking completed, review, referral | ✅ | ❌ | ❌ | ❌ | ✅ | 🟢 Normal |
| C14 | **Booky Coins Expiring** | 30 days before 12-month expiry | ✅ | ✅ | ❌ | ✅ | ✅ | 🟡 Important |
| C15 | **Subscription Renewal** | 3 days before billing | ✅ | ❌ | ❌ | ✅ | ✅ | 🟡 Important |

### 3.3 Authentication & Security

| # | Event | Trigger | App Push | WhatsApp | SMS | Email | In-App | Priority |
|---|-------|---------|----------|----------|-----|-------|--------|----------|
| C16 | **OTP Code** | Login / registration | ❌ | ❌ (fallback) | ✅ | ❌ | ❌ | 🔴 Critical |
| C17 | **OTP Fallback (WhatsApp)** | SMS undelivered after 30s | ❌ | ✅ | ❌ | ❌ | ❌ | 🔴 Critical |
| C18 | **New Device Login** | Login from unrecognized device | ✅ | ✅ | ❌ | ✅ | ✅ | 🔴 Critical |
| C19 | **Account Suspended** | Admin action | ✅ | ✅ | ✅ | ✅ | ✅ | 🔴 Critical |

### 3.4 Disputes

| # | Event | Trigger | App Push | WhatsApp | SMS | Email | In-App | Priority |
|---|-------|---------|----------|----------|-----|-------|--------|----------|
| C20 | **Dispute Opened** | Client submits dispute | ✅ | ❌ | ❌ | ✅ | ✅ | 🟡 Important |
| C21 | **Dispute Resolved** | Admin issues verdict | ✅ | ✅ | ❌ | ✅ | ✅ | 🔴 Critical |
| C22 | **Dispute: Need More Info** | Admin requests evidence | ✅ | ✅ | ❌ | ❌ | ✅ | 🟡 Important |

---

## 4. Merchant Notification Matrix

### 4.1 Booking Operations

| # | Event | Trigger | App Push | WhatsApp | SMS | Email | In-App | Priority |
|---|-------|---------|----------|----------|-----|-------|--------|----------|
| M1 | **New Booking Received** | Client confirms Booking | ✅ | ✅ | ❌ | ❌ | ✅ | 🔴 Critical |
| M2 | **Booking Cancelled (by Client)** | Client cancels | ✅ | ✅ | ❌ | ❌ | ✅ | 🔴 Critical |
| M3 | **Upcoming Booking (1hr)** | 1 hour before Slot | ✅ | ❌ | ❌ | ❌ | ✅ | 🟡 Important |
| M4 | **No-Show Confirmed** | 30 min timer expires | ✅ | ❌ | ❌ | ❌ | ✅ | 🟡 Important |
| M5 | **Today's Schedule (Morning)** | 08:00 EET daily | ✅ | ✅ | ❌ | ❌ | ✅ | 🟢 Normal |

### 4.2 Financial

| # | Event | Trigger | App Push | WhatsApp | SMS | Email | In-App | Priority |
|---|-------|---------|----------|----------|-----|-------|--------|----------|
| M6 | **Deposit Released to Wallet** | QR Handshake / No-Show | ✅ | ❌ | ❌ | ❌ | ✅ | 🟡 Important |
| M7 | **Payout Processed** | Withdrawal completed | ✅ | ✅ | ❌ | ✅ | ✅ | 🔴 Critical |
| M8 | **Payout Flagged** | Manual review required | ✅ | ✅ | ❌ | ✅ | ✅ | 🔴 Critical |
| M9 | **Monthly Statement Ready** | 1st of each month | ✅ | ❌ | ❌ | ✅ (PDF) | ✅ | 🟢 Normal |
| M10 | **Subscription Renewal** | 3 days before billing | ✅ | ❌ | ❌ | ✅ | ✅ | 🟡 Important |

### 4.3 Reputation & Content

| # | Event | Trigger | App Push | WhatsApp | SMS | Email | In-App | Priority |
|---|-------|---------|----------|----------|-----|-------|--------|----------|
| M11 | **New Review Received** | Client posts review | ✅ | ❌ | ❌ | ❌ | ✅ | 🟢 Normal |
| M12 | **Content Removed (Moderation)** | Admin removes content | ✅ | ❌ | ❌ | ✅ | ✅ | 🟡 Important |
| M13 | **Content Warning** | Admin issues warning | ✅ | ✅ | ❌ | ✅ | ✅ | 🔴 Critical |

### 4.4 Disputes & Verification

| # | Event | Trigger | App Push | WhatsApp | SMS | Email | In-App | Priority |
|---|-------|---------|----------|----------|-----|-------|--------|----------|
| M14 | **Dispute Opened Against You** | Client opens dispute | ✅ | ✅ | ❌ | ✅ | ✅ | 🔴 Critical |
| M15 | **Dispute: Respond Now (48h)** | Reminder at 24h | ✅ | ✅ | ✅ | ❌ | ✅ | 🔴 Critical |
| M16 | **Dispute Resolved** | Admin issues verdict | ✅ | ✅ | ❌ | ✅ | ✅ | 🔴 Critical |
| M17 | **KYC Approved** | Admin approves docs | ✅ | ✅ | ❌ | ✅ | ✅ | 🟡 Important |
| M18 | **KYC Rejected** | Admin rejects docs | ✅ | ✅ | ❌ | ✅ | ✅ | 🔴 Critical |

### 4.5 Onboarding Reminders

| # | Event | Trigger | App Push | WhatsApp | SMS | Email | In-App | Priority |
|---|-------|---------|----------|----------|-----|-------|--------|----------|
| M19 | **Wizard Abandoned (24h)** | 24h since last wizard activity | ❌ | ✅ | ❌ | ❌ | ❌ | 🟢 Normal |
| M20 | **Wizard Abandoned (72h)** | 72h since last wizard activity | ❌ | ✅ | ❌ | ✅ | ❌ | 🟢 Normal |
| M21 | **Wizard Abandoned (7d)** | 7 days since last activity | ❌ | ✅ | ✅ | ✅ | ❌ | 🟡 Important |

---

## 5. Admin / System Notifications

| # | Event | Recipient | Channel | Priority |
|---|-------|-----------|---------|----------|
| A1 | **Flagged Payout** | Finance Admin | Admin Dashboard + Slack/Email | 🔴 Critical |
| A2 | **Dispute SLA Breach Risk** | Dispute Resolver | Admin Dashboard + Slack | 🔴 Critical |
| A3 | **Fraud Alert** | Finance Admin + Senior Admin | Admin Dashboard + Slack + SMS | 🔴 Critical |
| A4 | **KYC Queue > 50 pending** | Verifier Team Lead | Slack | 🟡 Important |
| A5 | **Escrow Reconciliation Mismatch** | Finance Director | Email + SMS | 🔴 Critical |
| A6 | **System Health Alert** | Engineering | PagerDuty / Slack | 🔴 Critical |
| A7 | **Daily Flash Report** | Finance Admin, CEO | Email (auto 06:00 EET) | 🟢 Normal |

---

## 6. Channel Selection Logic

### Decision Tree

```
Is this an OTP?
  └── YES → SMS only (WhatsApp fallback after 30s)
  └── NO ↓

Is this a payment/financial event?
  └── YES → App Push + WhatsApp + Email (receipt)
  └── NO ↓

Is this time-sensitive (< 1hr to action)?
  └── YES → App Push + WhatsApp
  └── NO ↓

Is this a Booking lifecycle event?
  └── YES → App Push + In-App (WhatsApp for major events)
  └── NO ↓

Is this promotional/engagement?
  └── YES → App Push + In-App only (respect opt-out)
  └── NO → In-App only
```

### Cost Optimization

| Strategy | Detail |
|----------|--------|
| **Push first** | Free. Always attempt App Push before paid channels. |
| **WhatsApp for high-value** | Only for Booking confirmation, cancellations, payment events, dispute alerts. |
| **SMS as last resort** | Only for OTPs and critical alerts when the app is uninstalled. |
| **Email for records** | Receipts, statements, legal. Low cost. Always sent regardless of other channels. |
| **Batch non-urgent** | "Booky Coins earned" and "Review prompt" can be batched into a daily digest if the Client has 3+ in a day. |

---

## 7. Notification Content Rules

### Template Structure

| Component | Rule |
|-----------|------|
| **Title** | Max 50 chars. Arabic. Clear action verb. |
| **Body** | Max 200 chars. Arabic. Includes specific details (Merchant name, amount, time). |
| **CTA** | Deep link to relevant screen (Booking details, Wallet, etc.). |
| **Emoji** | 1–2 per notification. Relevant to context. Not excessive. |

### Example Templates

| Event | Title | Body |
|-------|-------|------|
| C1: Booking Confirmed | "تم تأكيد حجزك ✅" | "حجزك في [Merchant] يوم [Date] الساعة [Time] اتأكد. العربون: [Amount] ج.م." |
| C2: Reminder (1hr) | "حجزك بعد ساعة ⏰" | "فاكرك إن عندك حجز في [Merchant] الساعة [Time]. وري الـ QR لما توصل!" |
| C6: Merchant Cancelled | "التاجر ألغى الحجز 😔" | "للأسف [Merchant] ألغى حجزك. فلوسك ([Amount] ج.م) رجعتلك كاملة + 20 عملة بوكي تعويض. 🙏" |
| C7: No-Show | "مجيتش على ميعادك 📍" | "مجيتش في [Merchant] — العربون ([Amount] ج.م) اتحول للتاجر. حاول تلغي بدري المرة الجاية." |
| M1: New Booking | "حجز جديد! 🎉" | "[Client] حجز [Service] يوم [Date] الساعة [Time]. العربون: [Amount] ج.م." |
| M7: Payout Processed | "فلوسك وصلت ✅" | "تم تحويل [Amount] ج.م لـ [Method]. رصيدك المتاح: [Balance] ج.م." |

---

## 8. Quiet Hours & Rate Limiting

### Quiet Hours

| Rule | Detail |
|------|--------|
| **Window** | 23:00 – 07:00 EET (Africa/Cairo) |
| **Suppressed** | All non-critical notifications (🟢 Normal, 🟡 Important if not time-sensitive). |
| **Exempt** | 🔴 Critical: OTPs, payment confirmations, Booking reminders within window, security alerts. |
| **Queued** | Suppressed notifications are queued and delivered at 07:01 EET. |

### Rate Limiting

| Limit | Scope | Value |
|-------|-------|-------|
| **Max push per hour** | Per Client | 5 |
| **Max WhatsApp per day** | Per Client | 3 (non-OTP) |
| **Max SMS per hour** | Per phone number | 5 (including OTP) |
| **Max email per day** | Per Client | 5 |
| **Digest threshold** | If 3+ non-critical notifications queued | Bundle into 1 digest notification |

---

## 9. Client Preferences

### Configurable Settings (Account → Notifications)

| Category | Default | Client Can Disable? |
|----------|---------|---------------------|
| **Booking Reminders** | ✅ On | ❌ No (critical) |
| **Payment Notifications** | ✅ On | ❌ No (critical) |
| **OTP / Security** | ✅ On | ❌ No (critical) |
| **Review Prompts** | ✅ On | ✅ Yes |
| **Rebook Suggestions** | ✅ On | ✅ Yes |
| **Booky Coins Updates** | ✅ On | ✅ Yes |
| **Subscription Reminders** | ✅ On | ❌ No (billing) |
| **Story Alerts (Favorited Merchants)** | ❌ Off | ✅ Yes (opt-in) |
| **Promotional Offers** | ❌ Off | ✅ Yes (opt-in) |

> **Rule:** If a Client disables a category, NO notifications of that type are sent via ANY channel (push, WhatsApp, SMS, email). The preference applies globally.

---

## 10. Gherkin Scenarios

### Scenario 1: Booking Confirmation — Multi-Channel Delivery

```gherkin
Feature: Notification Matrix — Booking Confirmation

  Scenario: Client receives Booking confirmation across channels
    Given a Client "Ahmed" has just paid a Deposit for a Booking:
      | merchant  | ملاعب الأهرام       |
      | service   | ملعب كورة ساعة      |
      | slot      | 2026-02-16T18:00    |
      | deposit   | 60 EGP             |
      | booking_id| BK-260216-0001     |

    When the system processes the Booking confirmation
    Then the system sends:
      | channel    | delivered | content_includes                             |
      | App Push   | ✅        | "تم تأكيد حجزك ✅" + deep link to Booking   |
      | WhatsApp   | ✅        | Booking details + QR code image              |
      | Email      | ✅        | Formal receipt: Booking ID, amount, Merchant |
      | In-App     | ✅        | Stored in notification tray                  |
      | SMS        | ❌        | Not sent (not required for this event)       |
```

### Scenario 2: OTP Delivery with Fallback

```gherkin
Feature: OTP Notification — SMS First, WhatsApp Fallback

  Scenario: OTP via SMS succeeds
    Given a Visitor enters phone "+201012345678"
    When the system triggers OTP delivery
    Then an SMS is sent with the 4-digit OTP
    And the SMS is delivered within 10 seconds

  Scenario: SMS fails, fallback to WhatsApp
    Given a Visitor enters phone "+201012345678"
    When the system triggers OTP delivery
    And the SMS gateway reports undelivered after 30 seconds
    Then the system sends the OTP via WhatsApp Business API
    And the Visitor receives the OTP on WhatsApp within 10 seconds
    And the original SMS is cancelled
```

### Scenario 3: Quiet Hours Suppression

```gherkin
Feature: Quiet Hours — Non-Critical Suppressed

  Scenario: Review prompt during quiet hours is queued
    Given the current time is "2026-02-16T23:30:00" EET (quiet hours)
    And a Client's Booking was completed at 21:30 (review prompt triggers at 23:30)
    When the system attempts to send review prompt notification
    Then the notification is queued (not sent)
    And the notification is delivered at 07:01 EET the next morning

  Scenario: Booking reminder during quiet hours is NOT suppressed
    Given the current time is "2026-02-17T06:30:00" EET (quiet hours)
    And a Client has a Booking at 07:30 (1hr reminder triggers at 06:30)
    When the system attempts to send the 1-hour Booking reminder
    Then the notification is sent immediately (🔴 Critical, exempt from quiet hours)
```

### Scenario 4: Merchant Dispute Alert — Urgent Multi-Channel

```gherkin
Feature: Merchant Dispute Notification — Urgency

  Scenario: Merchant receives urgent dispute notification
    Given a Client opens a Dispute against Merchant "باربر الكينج"
    When the system processes the dispute notification (M14)
    Then the Merchant receives:
      | channel    | delivered | content                                     |
      | App Push   | ✅        | "في شكوى على حجز BK-260214-0033 ⚠️"        |
      | WhatsApp   | ✅        | Full dispute details + "عندك 48 ساعة ترد"   |
      | Email      | ✅        | Formal dispute notice with case reference    |
      | In-App     | ✅        | Stored with 🔴 badge                         |

    When 24 hours pass without Merchant response
    Then a follow-up reminder is sent:
      | channel    | delivered | content                                     |
      | App Push   | ✅        | "فاضلك 24 ساعة ترد على الشكوى ⏰"           |
      | WhatsApp   | ✅        | "لو مردتش، الشكوى هتتحل لصالح العميل تلقائيًا" |
      | SMS        | ✅        | "بوكي: رد على الشكوى قبل ما الوقت يخلص."     |
```

---

## 11. Edge Cases

| # | Edge Case | Rule |
|---|-----------|------|
| 1 | **Client has no app installed (web-only Visitor)** | Push not available. WhatsApp + SMS + Email only. |
| 2 | **Client's WhatsApp number differs from registered phone** | WhatsApp is sent to the registered phone number. If undelivered: fall back to SMS. |
| 3 | **Merchant's phone is off for 3 days** | Push queued (FCM stores up to 4 weeks). WhatsApp delivered when phone comes online. Critical alerts (dispute) also sent via SMS + Email. |
| 4 | **SMS gateway is down nationwide** | Automatic failover to WhatsApp for OTPs. Log incident. Alert engineering. |
| 5 | **Client receives 10 "Booky Coins Earned" in 1 hour** | Rate limiter kicks in at 5/hour. Bundle remaining into a digest: "كسبت 150 عملة بوكي النهاردة! 🪙" |
| 6 | **Email bounces (invalid address)** | Mark email as invalid. Do NOT retry. Prompt Client to update email on next login. Non-critical notifications continue on other channels. |
| 7 | **Notification language mismatch** | All Client-facing notifications are in Arabic (Egyptian dialect). No per-Client language setting in Phase 1. Phase 2: bilingual support. |
| 8 | **Two Bookings at the same time — two 1hr reminders** | Send ONE combined notification: "عندك حجزين الساعة 18:00 — [Merchant 1] و [Merchant 2]." |

---

> **📌 Source of Truth:** This document aligns with [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md) §4.2 (OTP rules), §4.3 (UI/UX principles), §12 (Egyptian Identity & Localization).
>
> *Booky Center: بضغطة واحدة.. ميعادك في جيبك* ✨


