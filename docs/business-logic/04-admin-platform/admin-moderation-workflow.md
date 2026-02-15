# 📂 04-Admin Platform: Moderation & Verification Workflow

## *"God Mode" — KYC, Content Moderation, and Dispute Arbitration*

**Parent:** [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md)
**Cross-Refs:** [service-execution.md](mdc:docs/business-logic/02-client/service-execution.md) (Dispute rules), [fulfillment-protocol.md](mdc:docs/business-logic/03-merchant/fulfillment-protocol.md) (Handshake), [smart-onboarding-flow.md](mdc:docs/business-logic/03-merchant/smart-onboarding-flow.md) (Onboarding)
**Version:** 1.0 | **Date:** February 15, 2026

---

## Table of Contents

1. [Admin Platform Overview](#1-admin-platform-overview)
2. [Merchant Verification (KYC)](#2-merchant-verification-kyc)
3. [Content Moderation](#3-content-moderation)
4. [Dispute Resolution Workflow](#4-dispute-resolution-workflow)
5. [Admin Roles & Permissions](#5-admin-roles--permissions)
6. [Gherkin Scenarios](#6-gherkin-scenarios)
7. [Edge Cases](#7-edge-cases)

---

## 1. Admin Platform Overview

The Admin Platform is Booky Center's internal operations hub. It is **never visible** to Clients or Merchants. Only Booky staff with authenticated admin accounts can access it.

### Core Responsibilities

| Domain | What Admins Do |
|--------|---------------|
| **Merchant Verification (KYC)** | Review submitted documents, approve or reject Merchant applications. |
| **Dispute Arbitration** | Investigate Client–Merchant disputes, freeze/release escrow funds, issue verdicts. |
| **Content Moderation** | Review flagged reviews, photos, descriptions, and Stories for policy violations. |
| **Financial Oversight** | Monitor transactions, flag suspicious activity, approve high-value payouts (see [financial-oversight.md](mdc:docs/business-logic/04-admin-platform/financial-oversight.md)). |
| **Platform Health** | Track KPIs, no-show rates, cancellation trends, support queue depth. |

---

## 2. Merchant Verification (KYC)

### 2.1 The Verification Philosophy

> **Phase 1 (Mansoura Pilot):** Light verification. Merchant can go live immediately after onboarding. KYC documents collected in background, reviewed within 72 hours. This prioritizes speed-to-market.
>
> **Phase 2 (Scale):** Strict verification. Merchant Dashboard is provisioned in `PENDING_VERIFICATION` state. Full access granted only after KYC approval.

### 2.2 Required Documents

| # | Document | Arabic Name | Required By | Format | Validation Rule |
|---|----------|-------------|-------------|--------|-----------------|
| 1 | **National ID (Front)** | البطاقة الشخصية (وجه) | Phase 1 | JPG/PNG, max 5 MB | Must be legible. Name must match registration. Not expired. |
| 2 | **National ID (Back)** | البطاقة الشخصية (ظهر) | Phase 1 | JPG/PNG, max 5 MB | Must be legible. National number visible. |
| 3 | **Tax Registration Card** | البطاقة الضريبية | Phase 2 | JPG/PNG/PDF, max 10 MB | Valid Tax ID. Business name match. |
| 4 | **Commercial Register** | السجل التجاري | Phase 2 | JPG/PNG/PDF, max 10 MB | Active registration. Business activity matches declared Sector. |
| 5 | **Professional License** | رخصة مزاولة المهنة | Medical/Legal only | JPG/PNG/PDF, max 10 MB | Valid license. Practitioner name match. Required for: clinics, dental, derma, legal services. |
| 6 | **Premises Photo** | صورة المكان | Phase 1 | JPG/PNG, max 5 MB, min 1 photo | Real photo of the business location (not stock). |

### 2.3 Verification States

```
                      ┌────────────────────┐
 Onboarding complete  │  PENDING_REVIEW    │  Documents submitted
 ────────────────────►│  (في انتظار المراجعة) │
                      └─────────┬──────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
          ┌─────────────────┐     ┌─────────────────────┐
          │  APPROVED        │     │  REJECTED            │
          │  (تم التأكيد ✅)  │     │  (مرفوض ❌)           │
          └─────────────────┘     └──────────┬──────────┘
                                             │
                                             ▼
                                   ┌─────────────────────┐
                                   │  RESUBMISSION        │
                                   │  (إعادة التقديم 🔄)   │
                                   │  → Returns to         │
                                   │    PENDING_REVIEW     │
                                   └─────────────────────┘
```

### 2.4 Verification Flow

| Step | Actor | Action | SLA |
|------|-------|--------|-----|
| 1 | **Merchant** | Completes onboarding wizard → uploads documents | — |
| 2 | **System** | Auto-validates file format, size, resolution. Rejects blurry/corrupt files instantly. | < 5 sec |
| 3 | **System** | OCR scan: extracts National ID number, name, expiry date (Phase 2 automation). | < 30 sec |
| 4 | **Admin** (Verifier) | Manual review: compare document data to registration data. | **72 hours** |
| 5a | **Admin** | Approve → Merchant state = `APPROVED`. Full dashboard access. | Immediate |
| 5b | **Admin** | Reject → Merchant state = `REJECTED`. Reason provided (see below). | Immediate |
| 6 | **Merchant** | If rejected: re-upload corrected documents → returns to `PENDING_REVIEW`. | Unlimited attempts |

### 2.5 Rejection Reasons (Standardized)

| Code | Reason (EN) | Reason (AR) | Auto-Generated Message |
|------|------------|-------------|------------------------|
| `DOC_BLURRY` | Document is blurry or unreadable | المستند مش واضح | "الصورة مش واضحة — ارفع صورة أوضح من فضلك 📸" |
| `DOC_EXPIRED` | Document has expired | المستند منتهي الصلاحية | "المستند ده منتهي — ارفع نسخة سارية." |
| `NAME_MISMATCH` | Name doesn't match registration | الاسم مش مطابق | "الاسم في المستند مختلف عن بيانات التسجيل — راجع البيانات." |
| `DOC_MISSING` | Required document not uploaded | مستند ناقص | "في مستند مطلوب مش موجود — ارفعه من الإعدادات." |
| `FAKE_SUSPECTED` | Document appears altered or fraudulent | يُشتبه في تزوير المستند | "مقدرناش نأكد المستند — تواصل مع الدعم." |
| `WRONG_DOC` | Wrong document type uploaded | نوع مستند غلط | "المستند ده مش المطلوب — تأكد من نوع المستند." |
| `LICENSE_INVALID` | Professional license doesn't match Service | الرخصة مش مطابقة للخدمة | "الرخصة مش متوافقة مع نوع الخدمة المسجل — ارفع الرخصة الصح." |

### 2.6 Impact of Verification State on Merchant

| State | Dashboard Access | Bookings | Wallet | Visibility in Search |
|-------|-----------------|----------|--------|---------------------|
| `PENDING_REVIEW` | ✅ Full (Phase 1) / 🔒 Limited (Phase 2) | ✅ Phase 1 / ❌ Phase 2 | ✅ | ✅ Phase 1 / ❌ Phase 2 |
| `APPROVED` | ✅ Full | ✅ | ✅ | ✅ + "✅ موثّق" badge |
| `REJECTED` | ✅ Read-only (can fix docs) | ❌ Suspended | 💰 Available balance withdrawable | ❌ Temporarily delisted |

---

## 3. Content Moderation

### 3.1 What Gets Moderated

| Content Type | Posted By | Moderation Trigger |
|-------------|-----------|-------------------|
| **Client Reviews** | Client | Auto-flag: profanity, threats, <20 chars, suspicious patterns (10 reviews in 1 min). Manual flag by Merchant. |
| **Merchant Photos** | Merchant | Auto-flag: nudity detection (AI), stock photo detection (reverse image search Phase 2). Manual flag by Client. |
| **Merchant Description** | Merchant | Auto-flag: phone numbers (bypassing platform), competitor names, prohibited content. |
| **Stories (Flash Offers)** | Merchant | Auto-flag: misleading pricing, expired content, prohibited items. |
| **Inquiry Messages** | Both | Auto-flag: sharing phone/email (bypassing platform). |

### 3.2 Moderation Queue

```
┌──────────────────────────────────────────────────────────────┐
│  📋 Content Moderation Queue                                  │
│                                                               │
│  Filters: [ All ] [ Reviews ] [ Photos ] [ Descriptions ]    │
│  Priority: [ 🔴 High ] [ 🟡 Medium ] [ 🟢 Low ]              │
│                                                               │
│  ── High Priority ──────────────────────────────────────── │
│  🔴 Review #4821 — Flagged: Profanity                        │
│     Client: أحمد | Merchant: صالون جوليا | 2 min ago          │
│     [ View ] [ Remove ] [ Warn Client ] [ Dismiss ]          │
│                                                               │
│  🔴 Photo #1029 — Flagged: Nudity Detection                  │
│     Merchant: سبا الياسمين | 15 min ago                       │
│     [ View ] [ Remove ] [ Warn Merchant ] [ Dismiss ]        │
│                                                               │
│  ── Medium Priority ────────────────────────────────────── │
│  🟡 Description — Flagged: Phone Number Detected              │
│     Merchant: ملاعب النصر | "اتصل 01012345678"              │
│     [ View ] [ Censor ] [ Warn ] [ Dismiss ]                 │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### 3.3 Moderation Actions

| Action | Effect | Notification |
|--------|--------|-------------|
| **Remove** | Content deleted. Author cannot see it. | Author notified: "تم حذف [المحتوى] لمخالفته سياسة الاستخدام." |
| **Censor** | Offensive portions redacted, rest visible. | Author notified: "تم تعديل [المحتوى] — راجع سياسة الاستخدام." |
| **Warn** | Warning recorded on account. 3 warnings in 90 days = temporary suspension. | "تحذير: [المحتوى] ده مخالف لسياستنا. التكرار ممكن يوقف حسابك." |
| **Dismiss** | Flag cleared. Content stays. No penalty. | No notification. |
| **Suspend Account** | Account frozen for 7/30/permanent days. | "حسابك متوقف لمدة [X] يوم بسبب مخالفات متكررة." |

---

## 4. Dispute Resolution Workflow

### 4.1 Recap: How Disputes Arrive

> A Client opens a Dispute Ticket within 24 hours of a Booking's Slot time. The Deposit is immediately **frozen in Escrow**. Full dispute rules are in [service-execution.md](mdc:docs/business-logic/02-client/service-execution.md) §3.

### 4.2 The Admin Dispute Dashboard

```
┌──────────────────────────────────────────────────────────────┐
│  ⚖️ Dispute Resolution Center                                │
│                                                               │
│  Open: 12  |  Under Review: 5  |  Resolved Today: 8         │
│                                                               │
│  Filters: [ All ] [ Open ] [ Under Review ] [ Resolved ]     │
│  Sort: [ Oldest First ] [ Highest Value ] [ SLA Breach ]     │
│                                                               │
│  ── SLA Breach Risk 🔴 ────────────────────────────────── │
│  #D-0421 | BK-260214-0033 | 50 EGP | Opened 68h ago         │
│  Client: نور | Merchant: باربر الكينج                         │
│  Status: AWAITING_MERCHANT_RESPONSE (4h to auto-resolve)     │
│  [ Open Case ]                                                │
│                                                               │
│  ── Under Review 🟡 ───────────────────────────────────── │
│  #D-0419 | BK-260213-0089 | 200 EGP | Opened 40h ago        │
│  Client: سارة | Merchant: سبا الياسمين                        │
│  Status: UNDER_REVIEW (Admin: محمد)                           │
│  [ Open Case ]                                                │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### 4.3 Dispute Case View

When an Admin opens a specific dispute case, they see:

| Section | Contents |
|---------|----------|
| **Booking Summary** | Booking ID, Service, Slot time, Deposit amount, Merchant, Client. |
| **Client's Evidence** | Text description (min 50 chars), photos/videos, timestamp of submission. |
| **Merchant's Response** | Text response (if submitted within 48h), photos/evidence, timestamp. |
| **Booking Timeline** | Chronological: Booking confirmed → QR scanned (or not) → Dispute opened. |
| **History** | Client's past disputes (won/lost), Merchant's past disputes (won/lost). |
| **Escrow Status** | Amount frozen, original payment method, current hold duration. |

### 4.4 Admin Resolution Powers

| Power | Action | Financial Effect |
|-------|--------|-----------------|
| **Resolve: Client Wins** | Full refund to Client + 20 Booky Coins compensation | Escrow → Client. Merchant loses Deposit. |
| **Resolve: Merchant Wins** | Release funds to Merchant (minus commission) | Escrow → Merchant Wallet. Client loses Deposit. |
| **Resolve: Partial Split** | Admin sets % split (e.g., 60% Client / 40% Merchant) | Escrow split per Admin's decision. |
| **Force Refund** | Override any state and refund Client immediately | Emergency power. Requires Senior Admin approval. Logged. |
| **Force Release** | Override any state and release to Merchant immediately | Emergency power. Requires Senior Admin approval. Logged. |
| **Escalate** | Push to Senior Admin / Legal team | No financial action. Case transferred. |
| **Request More Evidence** | Ask either party for additional information | SLA timer paused (max 48h pause). |

### 4.5 Resolution SLA

| Stage | SLA | If Breached |
|-------|-----|-------------|
| **Merchant Response** | 48 hours from dispute opening | Auto-resolve in Client's favor. |
| **Admin Review** | 72 hours from dispute opening | Escalated to Senior Admin. |
| **Total Resolution** | 96 hours maximum | Mandatory escalation to Head of Operations. |

### 4.6 Post-Resolution Effects

| Outcome | Client Impact | Merchant Impact |
|---------|--------------|-----------------|
| **Client Wins** | +Full refund, +20 Booky Coins | Warning recorded. 3+ losses in 90 days → account review for delisting. |
| **Merchant Wins** | Deposit lost. "Frivolous dispute" mark. 3+ frivolous → dispute privilege suspended 30 days. | Funds released. No negative impact. |
| **Partial** | Partial refund per Admin split. | Partial credit per Admin split. |

---

## 5. Admin Roles & Permissions

| Role | Permissions | Scope |
|------|------------|-------|
| **Support Agent** | View Bookings, view Merchant/Client profiles, respond to Inquiries, escalate issues. | Read-only on financial data. |
| **Verifier** | Review KYC documents, approve/reject Merchants, request re-uploads. | No financial powers. |
| **Moderator** | Review flagged content, remove/censor/warn, suspend accounts (up to 7 days). | No financial powers. |
| **Dispute Resolver** | Full dispute case access, resolve disputes (Client/Merchant/Partial wins). | Can freeze/release escrow. |
| **Finance Admin** | View all financial data, approve flagged payouts, generate reports. | See [financial-oversight.md](mdc:docs/business-logic/04-admin-platform/financial-oversight.md). |
| **Senior Admin** | All powers + approve force-refunds, force-releases, permanent suspensions, and policy overrides. | Full platform access. |
| **Super Admin** | Admin role management, platform configuration, feature flags, database access. | Technical + business. |

### Audit Trail

| Rule | Detail |
|------|--------|
| **Every action is logged** | Who, what, when, IP address, before/after state. |
| **Immutable logs** | Audit trail cannot be edited or deleted (append-only). |
| **Retention** | 7 years (financial regulatory compliance). |
| **Access** | Super Admin + external auditors only. |

---

## 6. Gherkin Scenarios

### Scenario 1: KYC Approval — Happy Path

```gherkin
Feature: Merchant KYC Verification

  Scenario: Admin approves a Merchant's documents
    Given a Merchant "ملاعب النصر" completed onboarding
    And uploaded the following documents:
      | document         | file           | status        |
      | National ID (F)  | id_front.jpg   | PENDING_REVIEW |
      | National ID (B)  | id_back.jpg    | PENDING_REVIEW |
      | Premises Photo   | shop.jpg       | PENDING_REVIEW |
    And the Merchant's verification state is "PENDING_REVIEW"

    When an Admin (Verifier role) opens the Merchant's KYC case
    And reviews all documents:
      | check              | result |
      | ID legible         | ✅     |
      | ID not expired     | ✅     |
      | Name matches reg   | ✅     |
      | Premises is real   | ✅     |
    And clicks "Approve"

    Then the Merchant's state becomes "APPROVED"
    And the Merchant's profile shows a "✅ موثّق" (Verified) badge
    And the Merchant receives push notification:
      "🎉 مبروك! حسابك اتوثّق — بروفايلك هيظهر في البحث بعلامة موثّق."
    And an audit log entry is created:
      | admin    | action   | merchant         | timestamp            |
      | admin_42 | APPROVED | ملاعب النصر       | 2026-02-15T14:30:00Z |
```

### Scenario 2: KYC Rejection & Resubmission

```gherkin
  Scenario: Admin rejects a blurry ID and Merchant resubmits
    Given a Merchant "صالون جوليا" uploaded a blurry National ID
    When an Admin reviews the document and selects rejection reason "DOC_BLURRY"
    And clicks "Reject"
    Then the Merchant's state becomes "REJECTED"
    And the Merchant receives notification:
      "الصورة مش واضحة — ارفع صورة أوضح من فضلك 📸"
    And the Merchant's Dashboard shows a banner:
      "⚠️ حسابك محتاج تعديل — ارفع المستندات المطلوبة."

    When the Merchant uploads a new, clear National ID photo
    Then the state returns to "PENDING_REVIEW"
    And the Admin is notified of the resubmission
    And the KYC review SLA (72h) restarts
```

### Scenario 3: Dispute Resolution — Full Lifecycle

```gherkin
Feature: Admin Dispute Resolution

  Scenario: Admin resolves a dispute in Client's favor
    Given a Dispute #D-0421 exists:
      | booking_id  | BK-260214-0033          |
      | client      | نور                      |
      | merchant    | باربر الكينج              |
      | deposit     | 50 EGP                  |
      | escrow      | 50 EGP (frozen)         |
      | client_desc | "القصة مش زي ما اتفقنا"  |
      | client_photos | 2 photos               |
      | merchant_response | "العميل مش صح"      |
      | status      | UNDER_REVIEW            |

    When a Dispute Resolver Admin opens the case
    And reviews evidence from both sides
    And determines the Client's photos clearly show a different result than what was promised
    And selects "Resolve: Client Wins"
    And adds resolution notes: "الصور بتأكد إن الخدمة مختلفة عن الوصف."

    Then the system executes:
      | action                          | detail              |
      | Refund 50 EGP to Client         | Original method     |
      | Award 20 Booky Coins to Client  | Compensation        |
      | Record warning on Merchant      | dispute_lost_count++ |
      | Unfreeze escrow                 | Balance → 0         |
    And the Client receives: "الشكوى اتحلت لصالحك — فلوسك رجعت + 20 عملة بوكي 🎉"
    And the Merchant receives: "الشكوى اتحلت لصالح العميل — 3 شكاوى في 90 يوم = مراجعة الحساب."
    And an audit log entry is created with Admin ID, decision, and rationale

  Scenario: Merchant doesn't respond — auto-resolve in Client's favor
    Given a Dispute #D-0422 has been open for 48 hours
    And the Merchant has NOT submitted a response
    When the 48-hour timer fires
    Then the system auto-resolves in the Client's favor
    And the Merchant receives:
      "مردتش على الشكوى في الوقت المحدد — الشكوى اتحلت لصالح العميل تلقائيًا."
    And the Merchant's profile shows: "⚠️ مش بيرد على الشكاوى"
```

### Scenario 4: Admin Force-Refund (Emergency)

```gherkin
  Scenario: Senior Admin force-refunds a stuck Booking
    Given a Booking "BK-260210-0055" is in an inconsistent state
    And the Deposit (100 EGP) is stuck in escrow (system error)
    And a Support Agent has escalated the case

    When a Senior Admin opens the case
    And selects "Force Refund" with reason: "System error — escrow stuck"
    And confirms with their admin PIN
    Then the system refunds 100 EGP to the Client immediately
    And logs: "FORCE_REFUND by senior_admin_01 | Reason: System error | Amount: 100 EGP"
    And the Client is notified: "آسفين على التأخير — فلوسك رجعتلك 🙏"
```

---

## 7. Edge Cases

| # | Edge Case | Rule |
|---|-----------|------|
| 1 | **Merchant uploads someone else's National ID** | If name mismatch detected → `NAME_MISMATCH` rejection. If detected post-approval (fraud report) → immediate suspension + investigation. |
| 2 | **Admin accidentally approves a fraudulent document** | Audit trail records the approver. Senior Admin can revoke approval. Merchant suspended pending re-review. |
| 3 | **Dispute opened after funds already released** | If QR Handshake completed and funds sent to Merchant Wallet: Admin can still freeze the equivalent amount from the Merchant's Available balance to cover the dispute. |
| 4 | **Both Client and Merchant are unreachable during dispute** | After 96-hour total SLA: auto-resolve in Client's favor (default: protect the payer). |
| 5 | **Merchant submits KYC in a non-Arabic/non-English language** | Reject with: "المستندات لازم تكون بالعربي أو الإنجليزي." |
| 6 | **Admin is related to the Merchant (conflict of interest)** | System flags if Admin and Merchant share phone prefix or location. Auto-reassign to a different Admin. |
| 7 | **100+ disputes opened against the same Merchant in a week** | Auto-suspend Merchant. Escalate to Head of Operations for mass review. Affected Clients auto-refunded. |
| 8 | **Client opens dispute and then cancels it** | Client can withdraw a dispute within 4 hours of opening. Funds unfrozen. After 4 hours: only Admin can close it. |

---

> **📌 Source of Truth:** This document aligns with [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md) §4.2 (Auth Rules), §11 (Deposit System). Dispute rules depend on [service-execution.md](mdc:docs/business-logic/02-client/service-execution.md).
>
> *Booky Center: بضغطة واحدة.. ميعادك في جيبك* ✨


