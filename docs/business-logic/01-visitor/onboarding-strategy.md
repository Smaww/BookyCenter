# 📂 01-Visitor: Onboarding Strategy

## *From Landing Page Entry → Decision to Join*

**Parent:** [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md)
**Version:** 1.0 | **Date:** February 15, 2026
**Persona:** The Visitor (زائر) — an unauthenticated person who has just arrived at the platform.

---

## Table of Contents

1. [Visitor Classification](#1-visitor-classification)
2. [Value Proposition by Persona](#2-value-proposition-by-persona)
3. [The Browsing-Without-Login Rule](#3-the-browsing-without-login-rule)
4. [Registration Rules & Validation](#4-registration-rules--validation)
5. [Conversion Funnel (Gherkin Scenarios)](#5-conversion-funnel-gherkin-scenarios)
6. [Edge Cases](#6-edge-cases)

---

## 1. Visitor Classification

Every visitor to Booky Center falls into exactly one of two intent tracks. The platform must identify the track **within the first 5 seconds** of the landing page experience.

| Track | Persona | Arabic Label | Intent | Entry Point |
|-------|---------|-------------|--------|-------------|
| **B2C** | Prospective Client (العميل) | عايز أحجز | "I need to book a service for myself." | Hero search bar, Sector cards, "Browse Services" CTA |
| **B2B** | Prospective Merchant (التاجر) | عايز أسجل بيزنسي | "I want to list my business and get clients." | "Grow Your Business" CTA, Merchant Spotlight section, Footer "Join as Merchant" link |

### Classification Signals

| Signal | Likely Client | Likely Merchant |
|--------|--------------|-----------------|
| Clicks Sector card | ✅ | ❌ |
| Uses search bar (location + Sector) | ✅ | ❌ |
| Scrolls to pricing section | ❌ | ✅ |
| Clicks "كبر شغلك" (Grow Your Business) | ❌ | ✅ |
| Hovers on Merchant Dashboard screenshots | ❌ | ✅ |

> **Rule:** The platform NEVER asks "Are you a Client or Merchant?" upfront. The interface naturally guides both personas through separate visual lanes on the same landing page.

---

## 2. Value Proposition by Persona

### 2.1 For the Prospective Client

| # | Value Proposition | Supporting Copy (Egyptian Arabic) |
|---|-------------------|-----------------------------------|
| 1 | **Instant Discovery** — Find any service near you | "لاقي أي حاجة جنبك في ثانية" |
| 2 | **Real-Time Availability** — See open Slots now | "شوف المواعيد المتاحة لحظيًا" |
| 3 | **Price Transparency** — No hidden fees, no haggling | "الأسعار واضحة، مفيش مفاجآت" |
| 4 | **Guaranteed Slot** — Your Booking is protected | "ميعادك محجوز ومحمي بالعربون" |
| 5 | **One App, 6 Sectors** — Sports to Home Services | "من الملعب لحد البيت — كل حاجة في مكان واحد" |
| 6 | **Earn Everywhere** — Booky Coins across all Sectors | "اكسب عملات بوكي من أي حجز واستخدمها في أي قطاع" |

### 2.2 For the Prospective Merchant

| # | Value Proposition | Supporting Copy (Egyptian Arabic) |
|---|-------------------|-----------------------------------|
| 1 | **Digital Storefront** — Professional profile in minutes | "بروفايل احترافي لشغلك في دقايق" |
| 2 | **Zero No-Shows** — Deposit protection system | "خلاص مفيش حد بيحجز ومبيجيش" |
| 3 | **Smart Calendar** — Auto-manage availability | "كالندر ذكي يدير مواعيدك تلقائيًا" |
| 4 | **Instant Payouts** — Money to your wallet fast | "فلوسك في محفظتك فورًا" |
| 5 | **Growth Analytics** — See what's working | "تحليلات ذكية تورّيك إيه اللي شغّال" |
| 6 | **Thousands of Clients** — Ready to book you | "آلاف العملاء مستنيين يحجزوا عندك" |

---

## 3. The Browsing-Without-Login Rule

> **CRITICAL DESIGN PRINCIPLE:** Visitors can browse ALL Sectors, search by location, view Merchant profiles, and check Slot availability **WITHOUT creating an account**. Login is triggered ONLY at the "Confirm & Pay" step.

### What a Visitor Can Do (No Auth Required)

| Action | Allowed? |
|--------|----------|
| View landing page | ✅ |
| Search by location + Sector | ✅ |
| View search results (Merchant cards) | ✅ |
| View full Merchant profile (photos, reviews, Services, pricing) | ✅ |
| Check available Slots on Merchant calendar | ✅ |
| Read reviews and ratings | ✅ |
| View Stories (flash offers) | ✅ |
| Add Service to "wishlist" | ❌ Requires auth |
| Confirm a Booking | ❌ Requires auth |
| Pay a Deposit | ❌ Requires auth |
| Send an Inquiry to a Merchant | ❌ Requires auth |
| Leave a review | ❌ Requires auth + completed Booking |

### The Auth Trigger Point

```
Visitor browses freely → Selects a Slot → Taps "Confirm & Pay"
                                            ↓
                              ┌──────────────────────────┐
                              │   Auth Modal Appears      │
                              │   "Enter your phone"      │
                              │   +201XXXXXXXXX            │
                              │   [Send OTP]               │
                              └──────────────────────────┘
                                            ↓
                              OTP Verified → Account created (or login)
                                            ↓
                              Resume Booking from exact point
```

---

## 4. Registration Rules & Validation

### 4.1 Client Registration

| Field | Required? | Validation Rule | Format |
|-------|-----------|-----------------|--------|
| **Phone Number** | ✅ Mandatory | Egyptian mobile, E.164 | `+201[0125]XXXXXXX` |
| **OTP Verification** | ✅ Mandatory | 4-digit code, expires in 120s | Numeric |
| **Full Name** | ✅ Mandatory | Min 3 characters, Arabic or English | String |
| **Email** | ❌ Optional | Valid email format | `user@domain.com` |
| **Profile Photo** | ❌ Optional | Max 5 MB, JPG/PNG | Image |
| **City / Area** | ❌ Optional (auto-detected) | GPS or manual selection | Coordinates or string |
| **Gender** | ❌ Optional | Male / Female | Enum |
| **Date of Birth** | ❌ Optional | Must be ≥ 16 years old | ISO 8601 date |
| **Subscription Tier** | Auto-set | Default: Free (المستكشف) | Enum |
| **Rank** | Auto-set | Default: Newbie (مبتدئ) | Enum |

> **Rule:** Social login (Google / Facebook) is for **profile enrichment only** (imports name + photo). It does NOT replace phone-based OTP authentication.

### 4.2 Merchant Registration

| Field | Required? | Validation Rule | Format |
|-------|-----------|-----------------|--------|
| **Phone Number** | ✅ Mandatory | Egyptian mobile, E.164 | `+201[0125]XXXXXXX` |
| **OTP Verification** | ✅ Mandatory | 4-digit code, expires in 120s | Numeric |
| **Business Name** | ✅ Mandatory | Min 3 characters, unique per Sector + area | String |
| **Sector** | ✅ Mandatory | Exactly 1 of the 6 canonical Sectors | Enum |
| **Business Address** | ✅ Mandatory | Full address + Google Maps pin | Coordinates + string |
| **Contact Person Name** | ✅ Mandatory | Min 3 characters | String |
| **National ID / Tax ID** | ✅ Mandatory (Phase 2) | Valid Egyptian national ID (14 digits) | String |
| **Business License** | ❌ Optional (Phase 1), ✅ Phase 2 | Upload scan (PDF/JPG) | File |
| **Cover Photo** | ✅ Mandatory | Min 1 photo, max 10 | Image(s) |
| **Service Catalog** | ✅ Mandatory (min 1 Service) | Name, price (EGP integer), duration, Deposit % | Structured data |
| **Working Hours** | ✅ Mandatory | Per-day schedule (Sat–Fri) | Time ranges |
| **Bank / Wallet Info** | ✅ Mandatory | For payout settlement | Vodafone Cash / InstaPay / Bank IBAN |
| **Subscription Tier** | Auto-set | Default: Starter (99 EGP/mo, 14-day free trial) | Enum |

### 4.3 Account Type Lock

| Rule | Detail |
|------|--------|
| **One Phone = One Account Type** | A phone number is either Client OR Merchant. Cannot be both. |
| **Type Set at Registration** | `account_type` is set to `client` or `merchant` at signup. |
| **Cannot Self-Change** | Changing account type requires support intervention. |
| **Dual Persona Workaround** | Use a different phone number to register the other type. |

---

## 5. Conversion Funnel (Gherkin Scenarios)

### Scenario 1: Client Registration via Booking

```gherkin
Feature: Client Onboarding via Booking Flow

  Scenario: Visitor discovers a service and registers to book it
    Given a Visitor is on the landing page without any account
    And the Visitor searches for "ملاعب" in "المهندسين"
    And the Visitor views search results and selects a Merchant
    And the Visitor selects an available Slot on the Merchant's calendar
    When the Visitor taps "احجز دلوقتي" (Book Now)
    Then the system displays the Auth Modal requesting a phone number
    And the Visitor enters "+201012345678"
    And the system sends a 4-digit OTP via SMS
    And the Visitor enters the correct OTP within 120 seconds
    Then the system creates a Client account with:
      | field             | value              |
      | phone             | +201012345678      |
      | account_type      | client             |
      | subscription_tier | free               |
      | rank              | newbie             |
    And the system resumes the Booking flow at the "Confirm & Pay" step
    And the selected Slot remains held for 5 minutes during payment

  Scenario: OTP expires before Visitor enters it
    Given a Visitor has entered their phone number in the Auth Modal
    And the system has sent a 4-digit OTP
    When 120 seconds elapse without OTP entry
    Then the system invalidates the OTP
    And displays: "الكود انتهى — اطلب واحد جديد"
    And enables the "Resend OTP" button (after 60-second cooldown)
    And the selected Slot is NOT released yet (5-minute hold continues)

  Scenario: Visitor attempts 4 OTP entries (brute-force protection)
    Given a Visitor has received an OTP
    And has entered the wrong code 3 times
    When the Visitor attempts a 4th OTP entry
    Then the system blocks OTP attempts for 15 minutes
    And displays: "حاولت كتير — جرب تاني بعد 15 دقيقة"
    And the selected Slot is released back to the Merchant's calendar
```

### Scenario 2: Merchant Registration via CTA

```gherkin
Feature: Merchant Onboarding via Landing Page CTA

  Scenario: Business owner registers as a Merchant
    Given a Visitor is on the landing page
    When the Visitor clicks "سجل بيزنسك دلوقتي" (Register Your Business)
    Then the system displays the Merchant Registration wizard with these steps:
      | step | title                | required_fields                         |
      | 1    | رقم الموبايل         | phone, OTP                              |
      | 2    | بيانات البيزنس       | business_name, sector, address          |
      | 3    | الخدمات والمواعيد    | services (min 1), working_hours         |
      | 4    | طريقة الدفع          | payout_method (wallet or bank)          |
    And each step must be completed before proceeding to the next
    And progress is saved — Merchant can resume if they leave midway

  Scenario: Merchant tries to register with a phone already linked to a Client account
    Given a phone number "+201098765432" is already registered as a Client
    When a Visitor enters this phone number in the Merchant registration flow
    Then the system displays:
      "الرقم ده مسجل عندنا كعميل. عايز تسجل بيزنسك؟ استخدم رقم تاني أو تواصل مع الدعم."
    And blocks the registration attempt
    And provides a link to customer support
```

---

## 6. Edge Cases

| # | Edge Case | Rule |
|---|-----------|------|
| 1 | **Visitor with VPN/Non-Egypt IP** | Allow browsing. Block registration if phone number is not `+20`. Display: "بوكي سنتر متاح في مصر بس حاليًا." |
| 2 | **Visitor disables JavaScript** | Display a static fallback page with: "شغّل JavaScript عشان تقدر تستخدم بوكي سنتر." |
| 3 | **Visitor on slow connection (<2G)** | Serve a lightweight version: no hero illustration, text-only Sector list, smaller images. |
| 4 | **Visitor refreshes during OTP entry** | OTP remains valid for its 120-second window. Pre-fill the phone number field. |
| 5 | **Visitor bookmarks a Merchant profile before registering** | Allow. When they return and click "Book", resume the auth flow normally. |
| 6 | **Visitor tries to register with a non-Egyptian phone** | Reject with: "بوكي سنتر متاح لأرقام مصرية بس حاليًا (+20)." |
| 7 | **Merchant starts registration but abandons at step 2** | Save progress. Send a WhatsApp reminder after 24 hours: "كملت تسجيل بيزنسك؟ باقي خطوتين بس!" |
| 8 | **Two Merchants register the same business name in the same Sector + area** | Reject the second registration. Display: "الاسم ده مسجل قبل كده في نفس المنطقة. جرب اسم تاني." |

---

> **📌 Source of Truth:** This document aligns with [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md) §2 (Dictionary), §4 (Global Rules), §4.2 (Authentication Rules), §4.3 (UI/UX Principles).
>
> *Booky Center: بضغطة واحدة.. ميعادك في جيبك* ✨

