# 📂 03-Merchant: Smart Onboarding Flow

## *The 3-Stage Conversational Wizard — "بنتعرف عليك"*

**Parent:** [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md)
**Version:** 1.0 | **Date:** February 15, 2026
**Persona:** The Merchant (التاجر) — from identity selection on the landing page to a fully configured Merchant Dashboard.

---

## Table of Contents

1. [The Wizard Philosophy](#1-the-wizard-philosophy)
2. [Entry Point & Trigger](#2-entry-point--trigger)
3. [Stage 1 — Personal Identity (هويتك الشخصية)](#3-stage-1--personal-identity-هويتك-الشخصية)
4. [Stage 2 — Business Identity (هوية البيزنس)](#4-stage-2--business-identity-هوية-البيزنس)
5. [Stage 3 — Market Intelligence & Configuration (ذكاء السوق)](#5-stage-3--market-intelligence--configuration-ذكاء-السوق)
6. [Post-Wizard: Dashboard Handoff](#6-post-wizard-dashboard-handoff)
7. [Progress Persistence & Resume](#7-progress-persistence--resume)
8. [Gherkin Scenarios](#8-gherkin-scenarios)
9. [Edge Cases](#9-edge-cases)
10. [Trial Mode (Deferred Verification)](#10-trial-mode-deferred-verification)
11. [Full Verification](#11-full-verification)
12. [First Service Setup Wizard ("3 Clicks")](#12-first-service-setup-wizard-3-clicks)
13. [Merchant Acquisition: Two Tracks](#13-merchant-acquisition-two-tracks)
14. [Data Model: Merchant Onboarding](#14-data-model-merchant-onboarding)
15. [Acceptance Criteria Summary](#15-acceptance-criteria-summary)

---

## 1. The Wizard Philosophy

### The Core UX Copy (Must Be Displayed)

> **النموذج التالي مكون من 3 مراحل هيساعدنا نتعرف عليك اكتر عشان نسلمك لوحة تحكم معمولة مخصوص عشان البزنس بتاعك**

*Translation: "The following form has 3 stages that will help us get to know you better, so we can deliver a dashboard custom-built for YOUR business."*

This copy appears at the top of the wizard and sets the tone: **conversational, helpful, zero corporate jargon.**

### Design Principles

| Principle | Implementation |
|-----------|---------------|
| **Conversational** | Each stage reads like a friendly question, not a bureaucratic form. |
| **Progressive Disclosure** | Only show what's needed at each stage — no overwhelming walls of fields. |
| **Save-As-You-Go** | Every field auto-saves. The Merchant can leave and resume at any time. |
| **3-Stage Maximum** | No matter how complex the business, onboarding never exceeds 3 screens. |
| **Mobile-First** | Designed for one-thumb completion. Bottom-aligned CTAs. Swipeable stages. |
| **Arabic-First** | All labels, placeholders, and microcopy in Egyptian Arabic. RTL layout. |

### Visual Progress Indicator

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   ● ─────────── ○ ─────────── ○                             │
│   هويتك          البيزنس       السوق                         │
│   الشخصية        بتاعك         والإعدادات                    │
│                                                              │
│   Stage 1        Stage 2       Stage 3                       │
│   (current)      (locked)      (locked)                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Entry Point & Trigger

### How a Visitor Reaches the Wizard

```
Landing Page
    │
    ├── Visitor clicks "سجل بيزنسك دلوقتي" (Register Your Business)
    │       │
    │       ▼
    │   Account Type = "merchant" locked
    │       │
    │       ▼
    │   ┌──────────────────────────────────────────────┐
    │   │  SMART ONBOARDING WIZARD — STAGE 1           │
    │   │                                               │
    │   │  "النموذج التالي مكون من 3 مراحل..."          │
    │   │                                               │
    │   └──────────────────────────────────────────────┘
    │
    └── Visitor clicks "كبر شغلك وانضم لينا" (Grow Your Business)
            │
            ▼
        Same wizard entry
```

### Pre-Wizard Checks

| Check | Rule |
|-------|------|
| **Phone already registered as Client** | Block. Display: "الرقم ده مسجل كعميل — استخدم رقم تاني أو تواصل مع الدعم." |
| **Phone already registered as Merchant** | Redirect to login. Display: "عندك حساب بالفعل — سجل دخول." |
| **Phone not registered** | Proceed to Stage 1. |

---

## 3. Stage 1 — Personal Identity (هويتك الشخصية)

### Stage Header

> **"أهلاً بيك! خلينا نتعرف عليك الأول 👋"**

### Fields

| # | Field | Arabic Label | Type | Required | Validation |
|---|-------|-------------|------|----------|------------|
| 1 | **Full Name** | الاسم بالكامل | Text input | ✅ | Min 3 chars, Arabic or English |
| 2 | **Email Address** | الإيميل | Email input | ✅ | Valid email format. Unique per account. |
| 3 | **Phone Number** | رقم الموبايل | Phone input | ✅ | E.164 format `+201XXXXXXXXX`. Pre-filled if entered at landing. |
| 4 | **OTP Verification** | كود التأكيد | 4-digit input | ✅ | 120s expiry. 3 attempts max. |

### UX Details

| Element | Behavior |
|---------|----------|
| **Phone pre-fill** | If the Merchant entered their phone on the landing page CTA, it's pre-filled here. |
| **OTP trigger** | Sent automatically when phone field loses focus (on blur). |
| **Email purpose** | For monthly statements, receipts, and account recovery. Not for authentication. |
| **CTA Button** | "التالي ←" (Next) — disabled until all fields valid. |
| **Back** | No back button on Stage 1 (first stage). |

### Microcopy

| State | Arabic Microcopy |
|-------|-----------------|
| Phone placeholder | `01X XXXX XXXX` |
| Email placeholder | `example@email.com` |
| OTP sent | "بعتنالك كود على الرقم ده — هيوصلك خلال ثواني 📱" |
| OTP expired | "الكود انتهى — اضغط عشان نبعت واحد جديد" |
| OTP wrong | "الكود ده غلط — جرب تاني (باقي X محاولات)" |
| All valid | ✅ (Green check animation on each field) |

---

## 4. Stage 2 — Business Identity (هوية البيزنس)

### Stage Header

> **"دلوقتي خلينا نتعرف على البيزنس بتاعك 🏪"**

### Fields

| # | Field | Arabic Label | Type | Required | Validation |
|---|-------|-------------|------|----------|------------|
| 1 | **Business Name** | اسم البيزنس | Text input | ✅ | Min 3 chars. Unique per Sector + area. |
| 2 | **Business Address** | عنوان البيزنس | Address input + Map pin | ✅ | Google Places autocomplete (Egypt). Lat/Lng stored. |
| 3 | **Contact Phone** | رقم تواصل البيزنس | Phone input | ✅ | Can differ from personal phone. E.164. |
| 4 | **Business Type** | نوع البيزنس | **Bottom Sheet selector** | ✅ | See below. |
| 5 | **Business Description** | وصف البيزنس | Textarea | ✅ | Min 30 chars. Max 500 chars. |

### 4.1 Business Type — Bottom Sheet Selector (NOT a Dropdown)

> **Critical UX Decision:** The "Business Type" selector uses a **full-screen Bottom Sheet** (slide-up modal) instead of a standard dropdown. This is because:
> 1. The list includes sub-types that need visual context (icons + Arabic labels).
> 2. On mobile, dropdowns are hard to scroll and easy to mis-tap.
> 3. The Bottom Sheet allows grouping by Sector with section headers.

#### Bottom Sheet Structure

```
┌──────────────────────────────────────────────────────────────┐
│  ─── (drag handle) ───                                        │
│                                                               │
│  اختار نوع البيزنس بتاعك                                      │
│  Choose your business type                                    │
│                                                               │
│  🔍 ابحث... (Search filter)                                   │
│                                                               │
│  ── ملاعب ورياضة (Sports & Fitness) ──────────────────────── │
│  ⚽ ملعب كورة        🏸 ملعب بادل       🏋️ جيم               │
│  🏊 حمام سباحة       🥊 فنون قتالية     🎾 تنس               │
│                                                               │
│  ── صحة وجمال (Health & Beauty) ──────────────────────────── │
│  💈 باربر شوب        💅 صالون تجميل     🧖 سبا                │
│  🦷 عيادة أسنان       🧴 ديرما          🧠 صحة نفسية          │
│                                                               │
│  ── خروجات وترفيه (Entertainment) ────────────────────────── │
│  🎮 بلاي ستيشن       🎳 بولينج          🎢 ملاهي أطفال        │
│  🍽️ مطعم             🏎️ كارتينج         🕹️ VR                │
│                                                               │
│  ── خدمات منزلية (Home Services) ─────────────────────────── │
│  🔧 سباك             ⚡ كهربائي          ❄️ تكييف              │
│  🧹 تنظيف            🎨 دهانات          🪲 مكافحة حشرات       │
│                                                               │
│  ── تعليم ومساحات عمل (Education & Work) ────────────────── │
│  📚 مدرس خصوصي       🏢 كوورك           📸 تصوير              │
│  ⚖️ خدمات قانونية     💻 دعم فني         🌐 ترجمة             │
│                                                               │
│  ── مناسبات وأفراح (Events & Celebrations) ──────────────── │
│  🏛️ قاعة أفراح       🎤 حفلات           📷 تصوير مناسبات      │
│  🍕 كاترينج          🏕️ كامبات           🏢 فعاليات شركات      │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### Selection Behavior

| Behavior | Detail |
|----------|--------|
| **Single Selection** | Merchant picks exactly ONE Business Type. |
| **Sector Auto-Mapped** | The selected type auto-maps to its parent Sector (e.g., "ملعب بادل" → `sports`). |
| **Search** | Real-time filter as Merchant types in the search bar. |
| **Visual Feedback** | Selected type gets a bold border + checkmark. |
| **Dismiss** | Tap outside or swipe down to dismiss (selection preserved). |
| **Stored As** | `business_type_id` (sub-type) + `sector_id` (parent Sector). |

### 4.2 AI Description Generator (✨ Feature)

> **Button Label:** "✨ اكتب وصف بالذكاء الاصطناعي" (Write description with AI)

#### How It Works

```
Merchant fills:
  Business Name = "ملاعب النصر"
  Business Type = "ملعب كورة"
  Address = "شارع الجلاء، المنصورة"
       │
       ▼
Merchant taps "✨ اكتب وصف بالذكاء الاصطناعي"
       │
       ▼
System generates (via LLM API):
  "ملاعب النصر — ملعب كورة في قلب المنصورة.
   عندنا ملاعب نجيلة صناعي بأحدث المواصفات،
   إضاءة ليلية، ومرافق كاملة. احجز ميعادك
   دلوقتي واستمتع بأحلى ماتش مع صحابك! ⚽"
       │
       ▼
Auto-fills the Description textarea
Merchant can edit freely before proceeding
```

#### AI Generator Rules

| Rule | Detail |
|------|--------|
| **Input** | Business Name + Type + Address (all from Stage 2 fields) |
| **Output Language** | Egyptian Arabic (عامية مصرية) |
| **Tone** | Friendly, professional, inviting |
| **Length** | 80–200 characters |
| **Editable** | Always. The Merchant can rewrite completely after generation. |
| **Rate Limit** | 3 regenerations per session (prevent API abuse) |
| **Fallback** | If AI fails: "مقدرناش نكتب وصف — جرب تاني أو اكتب واحد بنفسك." |

### Stage 2 Microcopy

| State | Arabic Microcopy |
|-------|-----------------|
| Business Name placeholder | "مثلاً: ملاعب الأهرام، صالون جوليا" |
| Address placeholder | "اكتب العنوان أو حدد مكانك على الخريطة 📍" |
| Business Type CTA | "اختار نوع البيزنس ▾" (opens Bottom Sheet) |
| Description placeholder | "اكتب وصف قصير عن البيزنس بتاعك — أو خلي الذكاء الاصطناعي يساعدك ✨" |
| Duplicate name detected | "الاسم ده موجود في نفس المنطقة — جرب اسم تاني." |
| CTA Button | "التالي ←" |
| Back | "→ السابق" |

---

## 5. Stage 3 — Market Intelligence & Configuration (ذكاء السوق)

### Stage Header

> **"آخر خطوة! كام سؤال بسيط عشان نظبطلك كل حاجة ⚙️"**

This stage collects strategic intelligence that directly affects the Merchant Dashboard configuration. Each answer toggles specific modules ON or OFF.

### The 4 Questions

#### Q1: Branches (الفروع)

> **"عندك أكتر من فرع؟"**

| Answer | UI Behavior | System Impact |
|--------|------------|---------------|
| **لا (No)** | Proceed. Single-location mode. | Dashboard shows one location. |
| **أيوه (Yes)** | Expand: dynamic list of address inputs. Each branch gets Name + Address + Map Pin. | **Unified Management** enabled: Merchant manages all branches from one Merchant Dashboard. Shared calendar, per-branch Slots, consolidated wallet. |

```
┌──────────────────────────────────────────────────────────────┐
│  عندك أكتر من فرع؟                                           │
│                                                               │
│  ○ لا — فرع واحد بس                                          │
│  ● أيوه — عندي فروع تانية                                     │
│                                                               │
│  ── الفروع: ──────────────────────────────────────────────── │
│                                                               │
│  فرع 1: ملاعب النصر — شارع الجلاء, المنصورة  [📍]  [✕]     │
│  فرع 2: ملاعب النصر — ميت غمر, الدقهلية      [📍]  [✕]     │
│                                                               │
│  [ + أضف فرع ]                                                │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Branch Rules:**

| Rule | Detail |
|------|--------|
| **Min branches (if Yes)** | 2 (the primary from Stage 2 + at least 1 additional) |
| **Max branches** | 20 (contact sales for more) |
| **Per-branch data** | Branch Name, Address (Google Places), Contact Phone (optional — defaults to main) |
| **Primary branch** | Auto-set to the address entered in Stage 2 |
| **Subscription impact** | Multi-branch requires Growth or Pro Merchant Subscription Tier |

---

#### Q2: E-Payments (الدفع الإلكتروني)

> **"عايز تقبل دفع إلكتروني من العملاء؟"**

| Answer | UI Behavior | System Impact |
|--------|------------|---------------|
| **لا (No)** | Proceed. Cash-only mode. Deposit collection handled by Booky. | Merchant cannot charge remaining balance digitally. Client pays remainder in cash. |
| **أيوه (Yes)** | Expand: checkboxes for supported gateways. | **Payment Gateway** module enabled in Merchant Dashboard. Merchant can accept full digital payments (not just Deposits). |

```
┌──────────────────────────────────────────────────────────────┐
│  عايز تقبل دفع إلكتروني من العملاء؟                          │
│                                                               │
│  ○ لا — كاش بس                                               │
│  ● أيوه — عايز أقبل دفع أونلاين                               │
│                                                               │
│  ── اختار الطرق: ────────────────────────────────────────── │
│                                                               │
│  ☑️ فيزا / ماستر كارد (بطاقات ائتمان)                        │
│  ☑️ فودافون كاش / محافظ إلكترونية                             │
│  ☐  تحويل بنكي                                               │
│                                                               │
│  ℹ️ ده بيخلي العميل يدفع كل المبلغ أونلاين — مش العربون بس   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**E-Payment Rules:**

| Rule | Detail |
|------|--------|
| **Deposit vs Full Payment** | Deposits are ALWAYS collected by Booky regardless of this setting. This setting controls whether the Merchant can accept the *remaining balance* digitally. |
| **Gateway Setup** | KYC documents required (National ID, Tax Card). Collected post-wizard in a separate "Verification" flow. |
| **Processing Fee** | 2.5% per digital transaction (separate from Booky commission). Disclosed upfront. |
| **Payout** | Funds from direct e-payments settle via the same Merchant Wallet system. |

---

#### Q3: Target Audience (الجمهور المستهدف)

> **"مين الجمهور اللي بتخدمه؟"**

| Answer | UI Behavior | System Impact |
|--------|------------|---------------|
| **رجال (Men)** | Tag selected | **Ad Targeting** module: Merchant's listing prioritized for male Clients in discovery. |
| **سيدات (Women)** | Tag selected | Listing prioritized for female Clients. "Ladies Only" badge on profile. |
| **أطفال (Kids)** | Tag selected | Listing appears in "Kids & Family" filters. Age-appropriate badges. |
| **مخصص (Custom)** | Opens text input | Free-text audience descriptor (e.g., "رياضيين محترفين", "طلبة جامعة"). |

```
┌──────────────────────────────────────────────────────────────┐
│  مين الجمهور اللي بتخدمه؟ (ممكن تختار أكتر من واحد)          │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ 🧔 رجال  │  │ 👩 سيدات │  │ 🧒 أطفال │  │ ✏️ مخصص  │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                               │
│  ℹ️ ده بيساعدنا نوصلك للعملاء الصح                           │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Audience Rules:**

| Rule | Detail |
|------|--------|
| **Multi-select** | Merchant can select multiple tags (e.g., Men + Kids for a football pitch). |
| **Minimum** | At least 1 selection required. |
| **Custom text** | Max 100 chars. Reviewed by system (no profanity). |
| **Affects** | Discovery ranking, ad campaigns, Feed promotion targeting. Does NOT restrict who can book. |

---

#### Q4: Physical Products (منتجات مادية)

> **"بتبيع منتجات (مش خدمات) جنب الشغل بتاعك؟"**

| Answer | UI Behavior | System Impact |
|--------|------------|---------------|
| **لا (No)** | Proceed. Service-only mode. | Standard Merchant Dashboard. |
| **أيوه (Yes)** | Show confirmation + product examples. | **E-Commerce Module** enabled: "Store/Inventory Management" tab added to Merchant Dashboard. |

```
┌──────────────────────────────────────────────────────────────┐
│  بتبيع منتجات جنب الشغل بتاعك؟                               │
│                                                               │
│  ○ لا — خدمات بس                                             │
│  ● أيوه — عندي منتجات كمان                                    │
│                                                               │
│  ── أمثلة: ──────────────────────────────────────────────── │
│  "منتجات شعر في صالون"                                       │
│  "مشروبات في ملعب"                                           │
│  "مستلزمات رياضية في جيم"                                    │
│                                                               │
│  ℹ️ هنفعلك تاب "المتجر" في لوحة التحكم عشان تدير المنتجات    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Product Rules:**

| Rule | Detail |
|------|--------|
| **Products ≠ Services** | Products are physical items with inventory. Services are bookable time-based offerings. Both can co-exist. |
| **Catalog** | Product catalog is separate from the Service catalog. Has: Name, Price (EGP integer), Stock Count, Photos. |
| **Booking Integration** | Products can be added as "add-ons" during the Booking checkout (e.g., "Add a sports drink for 25 EGP"). |
| **Subscription Impact** | E-Commerce module requires Growth or Pro Merchant Subscription Tier. |

### Stage 3 CTA

> **"خلصنا! 🎉 — جهّز لوحة التحكم بتاعتي"**

---

## 6. Post-Wizard: Dashboard Handoff

### What Happens After Stage 3

```
Stage 3 completed
       │
       ▼
Loading screen (2-3 seconds):
  "بنجهز لوحة التحكم بتاعتك... ⚙️"
  (Building your dashboard...)
       │
       ▼
System processes:
  1. Create Merchant account (DB record)
  2. Map business_type → sector_id
  3. Evaluate Q1-Q4 answers → toggle dashboard modules
  4. Set Subscription Tier = Starter (14-day free trial)
  5. Generate unique Merchant ID (UUID v4)
       │
       ▼
Welcome screen:
  ┌──────────────────────────────────────────────┐
  │  🎉 مبروك! لوحة التحكم بتاعتك جاهزة         │
  │                                               │
  │  اسم البيزنس: ملاعب النصر                     │
  │  القطاع: ملاعب ورياضة                         │
  │  الباقة: Starter (تجربة مجانية 14 يوم)        │
  │                                               │
  │  [ ابدأ دلوقتي → ]                            │
  │                                               │
  └──────────────────────────────────────────────┘
       │
       ▼
Redirect → Merchant Dashboard (with guided tour overlay)
```

### Guided Tour (First-Time)

| Step | Highlight | Tooltip (Arabic) |
|------|-----------|-----------------|
| 1 | Calendar tab | "هنا بتدير المواعيد والحجوزات بتاعتك 📅" |
| 2 | Services tab | "أضف الخدمات بتاعتك — أسعار، مدة، وصور 🏷️" |
| 3 | Wallet tab | "هنا بتشوف أرباحك وتسحب فلوسك 💰" |
| 4 | Settings | "عدّل بياناتك وإعدادات الحساب ⚙️" |

---

## 7. Progress Persistence & Resume

### Auto-Save Rules

| Rule | Detail |
|------|--------|
| **Save trigger** | Every field saves on blur (lose focus) or after 3 seconds of inactivity. |
| **Storage** | Server-side (linked to phone number). Not localStorage (survives device changes). |
| **Resume** | If Merchant returns (same phone, OTP), they land on the last incomplete stage. |
| **Expiry** | Incomplete wizard data persists for 30 days. After that, deleted with notification. |
| **Reminder** | If Merchant abandons at Stage 2 or 3: WhatsApp reminder after 24 hours, 72 hours, and 7 days. |

### Reminder Microcopy

| Timing | Message |
|--------|---------|
| 24 hours | "كملت تسجيل بيزنسك؟ باقي خطوة واحدة بس! 🚀" |
| 72 hours | "لسه مستنيينك! بيزنسك على بعد دقيقة من لوحة تحكم احترافية 💼" |
| 7 days | "آخر تذكير: بياناتك محفوظة — ادخل كمّل في أي وقت 🔒" |

---

## 8. Gherkin Scenarios

### Scenario 1: Happy Path — Full Wizard Completion

```gherkin
Feature: Smart Merchant Onboarding Wizard

  Scenario: New Merchant completes all 3 stages successfully
    Given a Visitor has clicked "سجل بيزنسك دلوقتي" on the landing page
    And the phone number "+201055551234" is not registered

    # ── Stage 1: Personal Identity ──
    When the Visitor enters:
      | field  | value                  |
      | name   | محمد أحمد              |
      | email  | mohamed@example.com    |
      | phone  | +201055551234          |
    And the system sends an OTP to "+201055551234"
    And the Visitor enters the correct OTP
    Then Stage 1 is marked complete ✅
    And the wizard advances to Stage 2

    # ── Stage 2: Business Identity ──
    When the Merchant enters:
      | field             | value                           |
      | business_name     | ملاعب النصر                     |
      | address           | شارع الجلاء، المنصورة           |
      | contact_phone     | +201055551234                   |
    And the Merchant taps "اختار نوع البيزنس"
    And the Bottom Sheet opens showing all Business Types
    And the Merchant selects "⚽ ملعب كورة" under "ملاعب ورياضة"
    Then the system auto-maps: sector_id = "sports"
    And the Merchant taps "✨ اكتب وصف بالذكاء الاصطناعي"
    And the system generates a description
    And the Merchant reviews and accepts the description
    Then Stage 2 is marked complete ✅
    And the wizard advances to Stage 3

    # ── Stage 3: Market Intelligence ──
    When the Merchant answers:
      | question          | answer      | detail                          |
      | Q1: Branches      | أيوه (Yes)  | Adds: "ملاعب النصر — ميت غمر"   |
      | Q2: E-Payments    | أيوه (Yes)  | Selects: Visa, Vodafone Cash    |
      | Q3: Audience       | رجال, أطفال | Multi-select                    |
      | Q4: Products       | أيوه (Yes)  | (sells drinks and jerseys)      |
    And the Merchant taps "جهّز لوحة التحكم بتاعتي"
    Then the system creates the Merchant account with:
      | field              | value                           |
      | merchant_id        | (UUID v4)                       |
      | sector_id          | sports                          |
      | business_type_id   | football_pitch                  |
      | subscription_tier  | starter (14-day trial)          |
      | branches           | 2                               |
      | e_payments         | true                            |
      | target_audience    | ["men", "kids"]                 |
      | has_products       | true                            |
    And the Merchant Dashboard is configured with modules:
      | module                  | enabled |
      | Calendar                | ✅      |
      | Wallet                  | ✅      |
      | CRM (Clients)           | ✅      |
      | Settings                | ✅      |
      | Court Management        | ✅      | # Because business_type = football/padel
      | Team Booking            | ✅      | # Because sector = sports
      | Branch Management       | ✅      | # Because Q1 = Yes
      | Payment Gateway         | ✅      | # Because Q2 = Yes
      | Store/Inventory         | ✅      | # Because Q4 = Yes
    And the Merchant is redirected to the Dashboard with a guided tour
```

### Scenario 2: Wizard Abandonment & Resume

```gherkin
  Scenario: Merchant abandons at Stage 2 and resumes the next day
    Given a Merchant completed Stage 1 with phone "+201055551234"
    And the Merchant partially completed Stage 2 (business_name filled)
    And the Merchant closed the browser

    When 24 hours pass
    Then the system sends a WhatsApp message to "+201055551234":
      "كملت تسجيل بيزنسك؟ باقي خطوة واحدة بس! 🚀"

    When the Merchant returns to the app and enters "+201055551234"
    And verifies with OTP
    Then the wizard loads at Stage 2
    And the business_name field shows "ملاعب النصر" (auto-saved)
    And the Merchant continues from where they left off
```

### Scenario 3: AI Description Generation

```gherkin
  Scenario: Merchant uses AI to generate a business description
    Given a Merchant is on Stage 2
    And has entered:
      | business_name  | صالون جوليا            |
      | business_type  | صالون تجميل            |
      | address        | شارع التحرير، الدقي    |

    When the Merchant taps "✨ اكتب وصف بالذكاء الاصطناعي"
    Then the system calls the LLM API with the above context
    And generates: "صالون جوليا — صالون تجميل في قلب الدقي. خبرة سنين في العناية بجمالك..."
    And auto-fills the description textarea
    And the Merchant can edit the text before proceeding

  Scenario: AI generation fails
    Given the LLM API is unavailable
    When the Merchant taps "✨ اكتب وصف بالذكاء الاصطناعي"
    Then the button shows a spinner for 5 seconds
    Then displays: "مقدرناش نكتب وصف — جرب تاني أو اكتب واحد بنفسك."
    And the description textarea remains empty (Merchant writes manually)
```

---

## 9. Edge Cases

| # | Edge Case | Business Rule |
|---|-----------|---------------|
| 1 | **Merchant enters a business name that already exists in the same Sector + area** | Reject at Stage 2. Display: "الاسم ده موجود في نفس المنطقة — جرب اسم تاني." |
| 2 | **Merchant selects "Branches = Yes" but only adds 1 branch** | Validate: "لازم تضيف فرع واحد على الأقل غير الفرع الرئيسي." Block "Next" until ≥ 2 total. |
| 3 | **Merchant's browser crashes during OTP entry** | OTP remains valid for 120 seconds. Merchant can reopen and enter the same OTP. |
| 4 | **Merchant has no Google Maps coverage for their area** | Allow manual address entry (text only). Map pin is optional but recommended. |
| 5 | **Merchant selects a Business Type that requires a license (Medical)** | Post-wizard: prompt for license upload. Dashboard is provisioned in "Pending Verification" state until license approved. |
| 6 | **Merchant tries to go back from Stage 3 to Stage 1** | Allowed. All data preserved. Back navigation is free. |
| 7 | **AI generates an inappropriate/inaccurate description** | Merchant edits manually. System logs the generation for quality review. No auto-publish without Merchant approval. |
| 8 | **30-day wizard expiry** | Data deleted. Merchant starts fresh. Notification: "بيانات التسجيل القديمة اتمسحت — ابدأ من جديد." |
| 9 | **Merchant selects "E-Payments = Yes" but on Starter subscription** | Allow selection. Post-wizard: prompt to upgrade to Growth tier. Module visible but locked with "ترقي عشان تفعّل الدفع الإلكتروني." |
| 10 | **Same email used by a Client account** | Allow. Email is for communication, not authentication. Phone is the unique identifier. |

---

## 10. Trial Mode (Deferred Verification)

> **The Big Idea:** Let Merchants start earning BEFORE bureaucracy. Trust first, verify when it matters.

### Trial Mode Rules

| Rule | Value |
|------|-------|
| **Max Bookings in Trial** | 5 completed Bookings |
| **Trial Duration** | 14 calendar days (whichever limit hit first) |
| **Deposit Collection** | ❌ Disabled in Trial (Bookings are cash-only) |
| **Payment Methods for Clients** | Cash on Arrival only |
| **Search Visibility** | ✅ Visible, but ranked lower than verified Merchants |
| **Stories** | ❌ Cannot post Stories |
| **Analytics** | ✅ Basic (Booking count, profile views) |
| **Badge Displayed** | "جديد 🟡" (New — Pending Verification) |

### Trial Mode Merchant Dashboard (Limited Features)

```
┌─────────────────────────────────────────────────────────────┐
│           لوحة تحكم التاجر — وضع التجربة                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ✅ Available:                                              │
│   • إضافة خدمات (Add Services — up to 5)                    │
│   • إدارة التقويم (Calendar Management — manual)             │
│   • عرض الحجوزات (View Bookings — max 5 active)             │
│   • الملف الشخصي (Edit Profile)                              │
│   • إحصائيات بسيطة (Basic Stats)                             │
│                                                              │
│   🔒 Locked (Requires Verification):                         │
│   • تحصيل العربون (Deposit Collection)                       │
│   • الدفع الإلكتروني (Digital Payments)                      │
│   • القصص والعروض (Stories / Flash Offers)                   │
│   • تحليلات متقدمة (Advanced Analytics)                      │
│   • ترقية الباقة (Subscription Tier Upgrade)                  │
│                                                              │
│   ⚠️ Banner: "فاضلك X حجوزات أو X أيام. وثّق حسابك الآن!"  │
│   ("You have X bookings or X days left. Verify now!")        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Trial Expiry Logic

```
IF trial_bookings >= 5 OR days_since_signup >= 14:
    │
    ├─ IF verification_submitted == true:
    │       → Continue operating (grace period until review complete)
    │       → Badge: "قيد المراجعة 🟠" (Under Review)
    │
    ├─ IF verification_submitted == false:
    │       → FREEZE new Bookings
    │       → Existing Bookings honored
    │       → Merchant Dashboard shows: "وثّق حسابك عشان تكمل شغلك"
    │       → Push notification + SMS + WhatsApp reminder
    │       → 3-day grace period, then profile hidden from search
    │
    └─ IF 30 days pass without verification:
            → Account deactivated (data preserved)
            → Reactivation requires verification
```

### Nudge Strategy (Push to Verify)

| Trigger | Channel | Message (Arabic) |
|---------|---------|-------------------|
| First Booking received | In-App | "🎉 مبروك أول حجز! وثّق حسابك عشان تقبل حجوزات أكتر." |
| 3rd Booking received | In-App + SMS | "بيزنسك بيكبر! فاضلك حجزتين بس في وضع التجربة." |
| 5th Booking (limit hit) | In-App + WhatsApp + SMS | "⚠️ وصلت لحد التجربة. وثّق حسابك دلوقتي عشان تفتح كل المميزات." |
| Day 10 (4 days left) | In-App + SMS | "فاضل 4 أيام على نهاية فترة التجربة. وثّق حسابك في دقيقتين." |
| Day 14 (trial expired) | All channels | "انتهت فترة التجربة. وثّق حسابك عشان ترجع تظهر للعملاء." |

---

## 11. Full Verification

### Verification Tiers

> Not all Merchants need a Commercial Register. A freelance barber is not a corporate venue. Booky adapts.

| Merchant Type | Documents Required | Review Time |
|---------------|-------------------|-------------|
| **Individual** (فرد) | National ID (front + back) | < 24 hours |
| **Small Business** (نشاط صغير) | National ID + Tax Card OR Commercial Register | < 48 hours |
| **Established Business** (شركة) | Commercial Register + Tax Card + National ID | < 72 hours |

### Verification Upload Flow

```
┌─────────────────────────────────────────────────────────────┐
│                 توثيق الحساب — خطوة واحدة                    │
│                 "عشان العملاء يثقوا فيك أكتر"               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   📸 نوع النشاط *                                            │
│   ( ○ فرد  ○ نشاط صغير  ○ شركة )                            │
│                                                              │
│   ── Based on selection: ──                                  │
│                                                              │
│   🪪 البطاقة الشخصية (الوجه الأمامي) *                       │
│   [ 📷 التقط صورة ]  أو  [ 📁 اختار من الملفات ]            │
│   → OCR auto-extracts: Name, National ID Number              │
│                                                              │
│   🪪 البطاقة الشخصية (الوجه الخلفي) *                        │
│   [ 📷 التقط صورة ]  أو  [ 📁 اختار من الملفات ]            │
│                                                              │
│   📄 السجل التجاري (إن وجد)                                  │
│   [ 📷 التقط صورة ]  أو  [ 📁 اختار من الملفات ]            │
│   → Required for "نشاط صغير" and "شركة"                      │
│                                                              │
│   ℹ️  بياناتك محمية ومشفرة بالكامل                           │
│                                                              │
│               [ أرسل للمراجعة ✓ ]                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Verification Status Machine

```
                    ┌──────────┐
     Upload docs →  │ PENDING  │
                    └────┬─────┘
                         │
              ┌──────────┼──────────┐
              ▼                     ▼
       ┌──────────┐          ┌──────────┐
       │ APPROVED │          │ REJECTED │
       │    ✅    │          │    ❌    │
       └──────────┘          └────┬─────┘
                                  │
                         Merchant re-uploads
                                  │
                                  ▼
                           ┌──────────┐
                           │ PENDING  │
                           └──────────┘
```

### Post-Verification Unlocks

| Feature | Trial Mode | Verified |
|---------|------------|----------|
| Booking Limit | 5 | ♾️ Unlimited |
| Deposit Collection | ❌ | ✅ |
| Digital Payments | ❌ | ✅ |
| Stories / Flash Offers | ❌ | ✅ |
| Search Ranking | Deprioritized | Normal |
| Badge | "جديد 🟡" | "موثّق ✅" (Verified) |
| Subscription Tier Upgrades | ❌ | ✅ |
| Advanced Analytics | ❌ | ✅ |
| Payout to Bank/Wallet | ❌ | ✅ |

---

## 12. First Service Setup Wizard ("3 Clicks")

> **Design Law:** "Add your first Service in 3 clicks." — The wizard appears immediately after the onboarding wizard and can be skipped/resumed anytime.

### Click 1: Choose Service Type

```
┌─────────────────────────────────────────────────────────────┐
│              "أضف أول خدمة — اختار النوع"                    │
│                                                              │
│   Based on selected Sector, show relevant templates:         │
│                                                              │
│   [Sports & Fitness]:                                        │
│   ⚽ حجز ملعب    🏋️ اشتراك جيم    🏊 حصة سباحة              │
│                                                              │
│   [Health & Beauty]:                                         │
│   ✂️ حلاقة رجالي   💅 مانيكير/بديكير   💆 مساج               │
│                                                              │
│   ... (Sector-specific templates)                            │
│                                                              │
│   📝 OR: "أضف خدمة مخصصة" (Custom Service)                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Click 2: Set Price & Duration

```
┌─────────────────────────────────────────────────────────────┐
│              "حدد السعر والمدة"                              │
│                                                              │
│   💰 السعر (ج.م) *                                           │
│   [ _______ ] EGP                                            │
│   → Pre-filled with Sector average (editable)                │
│   → Hint: "متوسط السعر في منطقتك: XXX ج.م"                 │
│                                                              │
│   ⏱️ المدة *                                                 │
│   [ ▼ 30 دقيقة | 45 دقيقة | ساعة | ساعتين | مخصص ]         │
│   → Pre-selected based on Service template                   │
│                                                              │
│   📸 صورة (اختياري — ممكن بعدين)                              │
│   [ 📷 أضف صورة ]                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Click 3: Set Availability

```
┌─────────────────────────────────────────────────────────────┐
│              "امتى متاح؟"                                    │
│                                                              │
│   Quick Preset:                                              │
│   [ ✅ كل يوم 9ص - 9م ]  (Default: Daily 9am-9pm)          │
│   [ ○  أيام محددة ]        (Select specific days)            │
│   [ ○  مخصص ]             (Full custom calendar)             │
│                                                              │
│   Preview Calendar:                                          │
│   ┌──────────────────────────────┐                           │
│   │  السبت  ║ 09:00 ────── 21:00 │                          │
│   │  الأحد  ║ 09:00 ────── 21:00 │                          │
│   │  الإثنين ║ 09:00 ────── 21:00 │                          │
│   │  ...                          │                          │
│   └──────────────────────────────┘                           │
│                                                              │
│            [ 🚀 أنشر الخدمة الأولى ]                         │
│            ("Publish Your First Service!")                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Service Data Model

| Field | Type | Validation | Required |
|-------|------|------------|----------|
| `service_id` | UUID v4 | Auto-generated | System |
| `merchant_id` | UUID v4 | FK → merchants table | System |
| `name` | `string` | 3-100 characters | ✅ |
| `sector_id` | `enum` | Inherited from Merchant's Sector | System |
| `price_egp` | `integer` | > 0, stored as integer (no floats) | ✅ |
| `duration_minutes` | `integer` | 15-480 (15 min to 8 hours) | ✅ |
| `description` | `string` | Max 500 characters | ❌ |
| `photo_urls` | `string[]` | Max 10 photos, JPG/PNG, max 5MB each | ❌ |
| `deposit_percentage` | `integer` | 0-100, defaults per Sector (Master §11) | System |
| `is_active` | `boolean` | Default: `true` | System |
| `created_at` | ISO 8601 | UTC timestamp | System |

### Post-Service-Creation Celebration

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                     🎉 مبروك!                                │
│                                                              │
│        "خدمتك الأولى بقت لايف ومتاحة للعملاء"               │
│        ("Your first Service is live for Clients!")           │
│                                                              │
│   ┌───────────────────┐   ┌───────────────────┐             │
│   │ 📊 لوحة التحكم    │   │ ➕ أضف خدمة تانية │             │
│   │  (Go to Dashboard) │   │  (Add Another)    │             │
│   └───────────────────┘   └───────────────────┘             │
│                                                              │
│   💡 Tip: "شارك صفحتك مع عملاءك — [ 📋 انسخ الرابط ]"      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 13. Merchant Acquisition: Two Tracks

> From [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md) §14 — refined into implementation detail.

### Track A: Digital Immigrants (Offline → Online)

| Attribute | Detail |
|-----------|--------|
| **Profile** | Traditional Merchants with zero digital presence. Paper ledger, phone calls only. |
| **Pain** | "Clients call, I'm busy, I lose the Booking." |
| **Pitch** | "إحنا بنبني لك هوية رقمية من الصفر — مجاناً." ("We build your digital identity from scratch — free.") |
| **Onboarding Strategy** | Field agent assists with profile creation. Professional photo shoot offered (200 EGP one-time). Simplified Merchant Dashboard with zero jargon. |
| **Success Metric** | First Booking within 72 hours of onboarding. |

### Track B: Growth Seekers (Social Media → Platform)

| Attribute | Detail |
|-----------|--------|
| **Profile** | Active on Facebook/Instagram. Has followers but struggles to convert them to paying Clients. |
| **Pain** | "I get 100 DMs a day asking 'price?' and 'available?' — I can't answer them all." |
| **Pitch** | "حوّل المتابعين بتوعك لعملاء بيدفعوا — مضمون." ("Turn your followers into paying Clients — guaranteed.") |
| **Onboarding Strategy** | Self-serve onboarding. Import data from social media. "Share your Booky link" feature for immediate distribution. |
| **Success Metric** | 10+ Bookings in first week via shared link. |

---

## 14. Data Model: Merchant Onboarding

### Merchant Profile (Database)

```sql
CREATE TABLE merchants (
    merchant_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone               VARCHAR(15) NOT NULL UNIQUE,       -- E.164 format
    business_name       VARCHAR(100) NOT NULL,
    sector_id           VARCHAR(20) NOT NULL,               -- FK → sectors
    status              VARCHAR(20) NOT NULL DEFAULT 'trial',
    -- status: 'trial' | 'pending_verification' | 'verified' | 'suspended' | 'deactivated'

    -- Location
    latitude            DECIMAL(10, 7),
    longitude           DECIMAL(10, 7),
    governorate         VARCHAR(50),
    district            VARCHAR(50),
    address_text        VARCHAR(200),

    -- Verification
    verification_status VARCHAR(20) DEFAULT 'unverified',
    -- verification_status: 'unverified' | 'pending' | 'approved' | 'rejected'
    merchant_type       VARCHAR(20),
    -- merchant_type: 'individual' | 'small_business' | 'established'
    national_id_front   VARCHAR(255),                       -- S3 URL
    national_id_back    VARCHAR(255),                       -- S3 URL
    commercial_register VARCHAR(255),                       -- S3 URL
    verified_at         TIMESTAMPTZ,

    -- Trial Tracking
    trial_bookings_used INTEGER DEFAULT 0,
    trial_started_at    TIMESTAMPTZ DEFAULT NOW(),
    trial_expires_at    TIMESTAMPTZ,                        -- trial_started_at + 14 days

    -- Profile
    whatsapp_phone      VARCHAR(15),
    description         TEXT,
    logo_url            VARCHAR(255),
    cover_photo_url     VARCHAR(255),
    rating_avg          DECIMAL(2, 1) DEFAULT 0.0,
    rating_count        INTEGER DEFAULT 0,

    -- Subscription
    subscription_tier   VARCHAR(20) DEFAULT 'start',
    -- subscription_tier: 'start' | 'pro' | 'pasha'

    -- Timestamps
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_merchants_sector ON merchants(sector_id);
CREATE INDEX idx_merchants_location ON merchants USING GIST (
    ST_MakePoint(longitude, latitude)
);
CREATE INDEX idx_merchants_status ON merchants(status);
```

### Onboarding Events (Audit Log)

```sql
CREATE TABLE merchant_onboarding_events (
    event_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id     UUID NOT NULL REFERENCES merchants(merchant_id),
    event_type      VARCHAR(50) NOT NULL,
    -- event_type: 'signup' | 'profile_created' | 'trial_started' |
    --             'booking_received' | 'verification_submitted' |
    --             'verification_approved' | 'verification_rejected' |
    --             'trial_expired' | 'account_activated' | 'account_deactivated'
    metadata        JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 15. Acceptance Criteria Summary

### Onboarding Wizard ✓

- [ ] Merchant can complete 3-stage wizard in < 10 minutes.
- [ ] All fields auto-save on blur or after 3 seconds of inactivity.
- [ ] Abandoned wizards trigger WhatsApp reminders at 24h, 72h, and 7 days.
- [ ] AI description generator works with 3-regeneration limit per session.
- [ ] Bottom Sheet Business Type selector supports search and Sector grouping.

### Trial Mode ✓

- [ ] Merchant can receive up to 5 Bookings before verification.
- [ ] Trial expires after 14 days OR 5 Bookings (whichever first).
- [ ] Locked features (Deposits, Stories, Analytics) are visible but disabled with clear CTAs.
- [ ] Nudge notifications sent at Booking 1, 3, 5 and Day 10, 14.

### Verification ✓

- [ ] Individual Merchants approved within 24 hours.
- [ ] Rejected Merchants can re-upload with clear rejection reason.
- [ ] Verified badge ("موثّق ✅") appears on profile and search results.

### First Service Setup ✓

- [ ] Merchant can publish first Service in 3 clicks.
- [ ] Service templates pre-filled based on Sector.
- [ ] Price hint shows Sector average for the Merchant's area.
- [ ] Celebration screen with share link appears after first Service publish.

---

> **📌 Source of Truth:** This document aligns with [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md) §2 (Dictionary), §4 (Global Rules), §5 (Six Sectors), §7 (Merchant Subscriptions), §14 (Mansoura Pilot — Two Tracks).
>
> *Booky Center: بضغطة واحدة.. ميعادك في جيبك* ✨

