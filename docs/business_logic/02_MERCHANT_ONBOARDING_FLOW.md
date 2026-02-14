# 02_MERCHANT_ONBOARDING_FLOW

## Technical Business Logic: Merchant Registration, Verification & Activation

**Document Version:** 1.0
**Last Updated:** February 14, 2026
**Classification:** System Architecture & Business Logic — Merchant-Side Onboarding
**Author:** Product Architecture Team
**Depends On:** [`BOOKY_CENTER_BUSINESS_MASTER.md`](../BOOKY_CENTER_BUSINESS_MASTER.md) (v6.0)
**Cross-References:** [`01_LANDING_PAGE_STRATEGY.md`](01_LANDING_PAGE_STRATEGY.md) (Visitor → Merchant funnel), [`03_USER_ONBOARDING_TIERS.md`](03_USER_ONBOARDING_TIERS.md) (Merchant Dashboard tiers)

---

## Table of Contents

1. [Onboarding Philosophy](#1-onboarding-philosophy)
2. [Phase 1 — Sign Up (Phone + OTP)](#2-phase-1--sign-up-phone--otp)
3. [Phase 2 — Basic Profile (Instant Activation)](#3-phase-2--basic-profile-instant-activation)
4. [Phase 3 — Trial Mode (Deferred Verification)](#4-phase-3--trial-mode-deferred-verification)
5. [Phase 4 — Full Verification](#5-phase-4--full-verification)
6. [Phase 5 — Setup Wizard ("First Service in 3 Clicks")](#6-phase-5--setup-wizard-first-service-in-3-clicks)
7. [Merchant Acquisition: Two Tracks](#7-merchant-acquisition-two-tracks)
8. [Data Model: Merchant Onboarding](#8-data-model-merchant-onboarding)
9. [Edge Cases & Error Handling](#9-edge-cases--error-handling)
10. [Acceptance Criteria Summary](#10-acceptance-criteria-summary)

---

## 1. Onboarding Philosophy

### The Problem

Traditional platforms demand: Register → Upload Documents → Wait for Review → Get Approved → THEN set up services. This takes **3-7 days**. In Egypt, Merchants lose patience after Day 1.

### The Booky Center Solution

> **Design Law:** A Merchant must go from "I clicked Join" to "I have my first Service live" in **under 10 minutes of active input**. Verification happens *after* they've already tasted success.

### The Funnel

```
VISITOR (Landing Page)
    │
    ▼  Clicks "كبر شغلك" (Grow Your Business)
SIGN UP (60 seconds)
    │  Phone + OTP
    ▼
BASIC PROFILE (3 minutes)
    │  Name + Sector + Location
    ▼
TRIAL MODE — LIVE IMMEDIATELY ✅
    │  Max 5 Bookings before verification
    ▼
VERIFICATION (Deferred — within 14 days)
    │  ID + Commercial Register
    ▼
SETUP WIZARD (3 minutes)
    │  First Service + Calendar + Photos
    ▼
FULLY ACTIVE MERCHANT 🟢
```

### Why "Trial Mode" Works

| Approach | Traditional Platform | Booky Center |
|----------|---------------------|--------------|
| Time to first live Service | 3-7 days | **< 10 minutes** |
| Merchant drop-off before activation | ~65% | **< 15%** (target) |
| Psychological state | Frustrated, waiting | Excited, engaged |
| First revenue | After approval | **During trial** |

> **Key Insight:** Once a Merchant receives their first Booking, they are **4x more likely** to complete verification. Let them win first, verify second.

---

## 2. Phase 1 — Sign Up (Phone + OTP)

### Flow

```
MERCHANT TAPS "كبر شغلك" OR "حساب جديد" → selects "🏪 تاجر"
         │
         ▼
   ┌─────────────────────────┐
   │   Phone Number Input     │
   │   "رقم الموبايل"         │
   │                          │
   │   +20  [ 1XX XXXX XXXX ] │
   │                          │
   │   Auto-format: E.164     │
   │   Validate: Egyptian     │
   │   mobile (01X prefix)    │
   └───────────┬──────────────┘
               │
               ▼
   ┌─────────────────────────┐
   │   4-Digit OTP Verify     │
   │   "كود التفعيل"          │
   │                          │
   │   [ _ ] [ _ ] [ _ ] [ _ ]│
   │                          │
   │   Auto-submit on 4th     │
   │   digit entry            │
   └───────────┬──────────────┘
               │  ✅ Verified
               ▼
   ACCOUNT CREATED (type: merchant)
   → Proceed to Basic Profile
```

### OTP Rules

| Rule | Value | Source |
|------|-------|--------|
| OTP Length | 4 digits | Master §4.2 |
| OTP Expiry | 120 seconds | Master §4.2 |
| Resend Cooldown | 60 seconds | Master §4.2 |
| Max Attempts/Session | 3, then 15-min cooldown | Master §4.2 |
| Max OTPs/Phone/Hour | 5 | Master §4.2 |
| Fallback | WhatsApp OTP after 30s SMS failure | Master §4.2 |

### Duplicate Detection

| Scenario | Response |
|----------|----------|
| Phone already registered as Merchant | "الرقم ده مسجل كتاجر. عايز تسجل دخول؟" → Redirect to login |
| Phone registered as Client | "الرقم ده مسجل كعميل. عايز تفتح حساب تاجر؟" → Support escalation (one account type per phone) |
| Phone not registered | Proceed normally |

---

## 3. Phase 2 — Basic Profile (Instant Activation)

> **Goal:** Capture the minimum data to make the Merchant discoverable. Everything else is optional and can be completed later.

### Required Fields (3-Minute Target)

```
┌─────────────────────────────────────────────────────────────┐
│              إنشاء حساب التاجر — الخطوة ١/٣                │
│              "خلينا نتعرف على بيزنسك"                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   📝 اسم البيزنس *                                          │
│   [ ________________________________ ]                       │
│   مثال: "صالون أحمد"، "ملعب النادي"                          │
│                                                              │
│   🏷️ القطاع *                                                │
│   [ ▼ اختار القطاع ]                                         │
│   ┌─────────────────────────┐                                │
│   │  ⚽ ملاعب ورياضة         │                                │
│   │  ✂️  صحة وجمال            │                                │
│   │  🎮 خروجات وترفيه        │                                │
│   │  🔧 خدمات منزلية         │                                │
│   │  🎓 تعليم ومساحات عمل    │                                │
│   │  🎁 مناسبات وأفراح       │                                │
│   └─────────────────────────┘                                │
│                                                              │
│   📍 الموقع *                                                │
│   [ 📌 حدد موقعك على الخريطة ]                               │
│   → Opens map with pin drop                                  │
│   → Auto-fills: Governorate, District, Street                │
│   → Manual override allowed                                  │
│                                                              │
│   📱 رقم واتساب للتواصل (اختياري)                             │
│   [ +20 1XX XXXX XXXX ]                                      │
│   → Pre-filled with signup phone                             │
│                                                              │
│               [ ابدأ فترة التجربة → ]                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Field Validation Rules

| Field | Type | Validation | Required |
|-------|------|------------|----------|
| `business_name` | `string` | 3-100 characters, Arabic + English allowed | ✅ Yes |
| `sector_id` | `enum` | Must be one of the 6 canonical Sector IDs | ✅ Yes |
| `location` | `GeoLocation` | Valid lat/lng within Egypt boundaries | ✅ Yes |
| `governorate` | `string` | Auto-derived from map pin | ✅ Auto |
| `district` | `string` | Auto-derived from map pin | ✅ Auto |
| `whatsapp_phone` | `string` | E.164, Egyptian mobile | ❌ Optional |

### What Happens on Submit

1. Merchant profile created with status: `trial`.
2. Merchant Dashboard access granted (limited — see §4).
3. Merchant appears in search results with a "جديد 🟡" (New) badge.
4. Auto-redirect to Setup Wizard (§6).

---

## 4. Phase 3 — Trial Mode (Deferred Verification)

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

### Trial Mode Dashboard (Limited Features)

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
    │       → Dashboard shows: "وثّق حسابك عشان تكمل شغلك"
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

## 5. Phase 4 — Full Verification

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
| Subscription Upgrades | ❌ | ✅ |
| Advanced Analytics | ❌ | ✅ |
| Payout to Bank/Wallet | ❌ | ✅ |

---

## 6. Phase 5 — Setup Wizard ("First Service in 3 Clicks")

> **Design Law:** "Add your first service in 3 clicks." — The wizard appears immediately after Basic Profile submission and can be skipped/resumed anytime.

### The 3-Click Wizard

```
CLICK 1: Choose Service Type
─────────────────────────────
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
│   ... (sector-specific templates)                            │
│                                                              │
│   📝 OR: "أضف خدمة مخصصة" (Custom Service)                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘

CLICK 2: Set Price & Duration
─────────────────────────────
┌─────────────────────────────────────────────────────────────┐
│              "حدد السعر والمدة"                              │
│                                                              │
│   💰 السعر (ج.م) *                                           │
│   [ _______ ] EGP                                            │
│   → Pre-filled with sector average (editable)                │
│   → Hint: "متوسط السعر في منطقتك: XXX ج.م"                 │
│                                                              │
│   ⏱️ المدة *                                                 │
│   [ ▼ 30 دقيقة | 45 دقيقة | ساعة | ساعتين | مخصص ]         │
│   → Pre-selected based on service template                   │
│                                                              │
│   📸 صورة (اختياري — ممكن بعدين)                              │
│   [ 📷 أضف صورة ]                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘

CLICK 3: Set Availability
─────────────────────────
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

### Post-Wizard Celebration

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

## 7. Merchant Acquisition: Two Tracks

> From [`BOOKY_CENTER_BUSINESS_MASTER.md`](../BOOKY_CENTER_BUSINESS_MASTER.md) §14 — refined into implementation detail.

### Track A: Digital Immigrants (Offline → Online)

| Attribute | Detail |
|-----------|--------|
| **Profile** | Traditional Merchants with zero digital presence. Paper ledger, phone calls only. |
| **Pain** | "Clients call, I'm busy, I lose the booking." |
| **Pitch** | "إحنا بنبني لك هوية رقمية من الصفر — مجاناً." ("We build your digital identity from scratch — free.") |
| **Onboarding Strategy** | Field agent assists with profile creation. Professional photo shoot offered (200 EGP one-time). Simplified dashboard with zero jargon. |
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

## 8. Data Model: Merchant Onboarding

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

## 9. Edge Cases & Error Handling

| Scenario | System Response |
|----------|----------------|
| **Merchant tries to add 6th Service in Trial** | Block. Show: "وثّق حسابك عشان تضيف خدمات أكتر." |
| **Merchant receives 6th Booking in Trial** | New Booking goes to waitlist. Merchant prompted to verify. |
| **Verification rejected** | Merchant notified with reason. Can re-upload. Existing Bookings honored. |
| **Merchant abandons onboarding at Profile step** | Draft saved. WhatsApp reminder at 24h, 48h, 7 days. |
| **Map pin placed outside Egypt** | Error: "بوكي سنتر متاح في مصر بس حالياً." |
| **Business name contains profanity** | AI filter blocks. Manual review queue. |
| **Duplicate business at same address** | Warning (not block): "في بيزنس بنفس العنوان. متأكد من الموقع؟" |
| **Merchant changes Sector after onboarding** | Allowed once (free). Second change requires support ticket. |
| **Photo upload fails** | Retry with exponential backoff. Offline queue. Allow skipping photos. |

---

## 10. Acceptance Criteria Summary

### Phase 1 — Sign Up ✓

- [ ] Merchant can register with phone + OTP in < 60 seconds.
- [ ] Duplicate phone detection works for both Merchant and Client accounts.
- [ ] OTP fallback to WhatsApp triggers after 30-second SMS failure.

### Phase 2 — Basic Profile ✓

- [ ] Merchant can complete profile with name, Sector, and map location in < 3 minutes.
- [ ] Map pin auto-fills governorate and district.
- [ ] Account status is set to `trial` on submission.

### Phase 3 — Trial Mode ✓

- [ ] Merchant can receive up to 5 Bookings before verification.
- [ ] Trial expires after 14 days OR 5 Bookings (whichever first).
- [ ] Locked features (Deposits, Stories, Analytics) are visible but disabled with clear CTAs.
- [ ] Nudge notifications sent at Booking 1, 3, 5 and Day 10, 14.

### Phase 4 — Verification ✓

- [ ] Individual Merchants approved within 24 hours.
- [ ] Rejected Merchants can re-upload with clear rejection reason.
- [ ] Verified badge ("موثّق ✅") appears on profile and search results.

### Phase 5 — Setup Wizard ✓

- [ ] Merchant can publish first Service in 3 clicks.
- [ ] Service templates pre-filled based on Sector.
- [ ] Price hint shows Sector average for the Merchant's area.
- [ ] Celebration screen with share link appears after first Service publish.

---

> **📌 This document follows the Project Dictionary defined in [`BOOKY_CENTER_BUSINESS_MASTER.md`](../BOOKY_CENTER_BUSINESS_MASTER.md) §2. All terms (Client, Merchant, Service, Sector, Booking, Slot, Deposit, Inquiry) are used as canonically defined.**

---

**END OF DOCUMENT**
