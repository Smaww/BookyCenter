# 📂 06-Merchant Operations: Marketing Automation Rules

## *Lifecycle Triggers, Re-Engagement & Automated Feedback Loops*

**Parent:** [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md)
**Cross-Refs:** [notification-matrix.md](mdc:docs/business-logic/05-core-systems/notification-matrix.md) (Channels), [growth-and-promo-logic.md](mdc:docs/business-logic/05-core-systems/growth-and-promo-logic.md) (Coupons), [booking-lifecycle.md](mdc:docs/business-logic/02-client/booking-lifecycle.md) (Booking flow), [staff-management-logic.md](mdc:docs/business-logic/06-merchant-operations/staff-management-logic.md) (Staff)
**Version:** 1.0 | **Date:** February 15, 2026

---

## Table of Contents

1. [Marketing Automation Philosophy](#1-marketing-automation-philosophy)
2. [Lifecycle Trigger Engine](#2-lifecycle-trigger-engine)
3. ["We Miss You" — Win-Back Campaign](#3-we-miss-you--win-back-campaign)
4. ["Happy Birthday" — Personalized Offers](#4-happy-birthday--personalized-offers)
5. [Booking Reminders (Enhanced)](#5-booking-reminders-enhanced)
6. [Automated Feedback & Review Loop](#6-automated-feedback--review-loop)
7. ["Thank You" & Loyalty Nudges](#7-thank-you--loyalty-nudges)
8. [Merchant-Configurable Automations](#8-merchant-configurable-automations)
9. [Campaign Analytics](#9-campaign-analytics)
10. [Gherkin Scenarios](#10-gherkin-scenarios)
11. [Edge Cases](#11-edge-cases)

---

## 1. Marketing Automation Philosophy

### Core Principles

| Principle | Detail |
|-----------|--------|
| **Automated, not manual** | Merchants should NOT need to send messages manually. The system handles lifecycle communications based on triggers. |
| **Personalized** | Every message includes the Client's name, last Service, last Merchant, and specific call-to-action. No generic blasts. |
| **Arabic (Egyptian)** | All automated messages in friendly Egyptian Arabic (عامية مصرية). |
| **Channel-smart** | Use the right channel for the right moment (see [notification-matrix.md](mdc:docs/business-logic/05-core-systems/notification-matrix.md)). |
| **Respectful** | No spam. Every automation has frequency caps. Clients can opt-out. |
| **Merchant-branded** | Messages feel like they come from the Merchant, not from Booky. "أهلاً أحمد! صالون جوليا مشتاقلك 💈" |

### Two Layers of Automation

| Layer | Owner | Scope | Example |
|-------|-------|-------|---------|
| **Platform Automations** | Booky | Applied to ALL Clients across all Merchants. Non-configurable by Merchant. | OTP, Booking reminders, payment receipts, system alerts. |
| **Merchant Automations** | Merchant (configurable) | Per-Merchant. Merchant can enable/disable and customize. | "We miss you", birthday offers, review requests, rebook nudges. |

---

## 2. Lifecycle Trigger Engine

### Client Lifecycle Stages

```
┌─────────────────────────────────────────────────────────────────────┐
│                       CLIENT LIFECYCLE STAGES                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  VISITOR ──► REGISTERED ──► FIRST BOOKING ──► ACTIVE ──► LOYAL      │
│     │            │              │               │           │        │
│     │            │              │               │           │        │
│     │            ▼              ▼               ▼           ▼        │
│     │       Onboarding     Activation       Retention   Advocacy    │
│     │       Triggers       Triggers         Triggers    Triggers    │
│     │                                           │                    │
│     │                                           ▼                    │
│     │                                       DORMANT                  │
│     │                                           │                    │
│     │                                           ▼                    │
│     │                                       Win-Back                 │
│     │                                       Triggers                 │
│     │                                           │                    │
│     │                                           ▼                    │
│     └───────────────────────────────────── CHURNED                  │
│                                             (final)                  │
└─────────────────────────────────────────────────────────────────────┘
```

### Master Trigger Table

| # | Trigger Name | When | Delay | Channel | Layer |
|---|-------------|------|-------|---------|-------|
| T1 | **Booking Confirmed** | Deposit paid | Immediate | Push + WhatsApp + Email | Platform |
| T2 | **Booking Reminder (24h)** | 24 hours before Slot | -24h | Push + WhatsApp | Platform |
| T3 | **Booking Reminder (1h)** | 1 hour before Slot | -1h | Push + WhatsApp | Platform |
| T4 | **Booking Reminder (15min)** | 15 min before Slot | -15min | Push | Platform |
| T5 | **Post-Service Review Request** | Booking completed | +2 hours | Push + In-App | Merchant |
| T6 | **Thank You + Rebook Nudge** | Booking completed | +24 hours | WhatsApp | Merchant |
| T7 | **We Miss You (Soft)** | No Booking for 14 days | +14 days | Push + In-App | Merchant |
| T8 | **We Miss You (Medium)** | No Booking for 30 days | +30 days | WhatsApp | Merchant |
| T9 | **We Miss You (Strong)** | No Booking for 60 days | +60 days | WhatsApp + Coupon | Merchant |
| T10 | **Happy Birthday** | Client's DOB | On DOB (09:00 EET) | WhatsApp + Push | Merchant |
| T11 | **Booky Coins Expiring** | 30 days before Coin expiry | -30 days | Push + WhatsApp | Platform |
| T12 | **Subscription Renewal** | 3 days before billing | -3 days | Push + Email | Platform |
| T13 | **First Booking Nudge** | Registered but no Booking | +3 days | Push | Platform |
| T14 | **Abandoned Booking** | Started checkout but didn't pay | +1 hour | Push | Platform |
| T15 | **Rebook Same Service** | Recurring Service pattern detected | Predicted next date -3 days | Push | Merchant |

---

## 3. "We Miss You" — Win-Back Campaign

### 3.1 Trigger Logic

```
FOR EACH Client C:
  FOR EACH Merchant M where C has completed at least 1 Booking:
    last_booking_date = MAX(completed_at) WHERE client = C AND merchant = M
    days_since = NOW() - last_booking_date

    IF days_since = 14:
      → Send T7 (Soft: "وحشتنا!")
    IF days_since = 30:
      → Send T8 (Medium: "فاتك حجوزات حلوة!")
    IF days_since = 60:
      → Send T9 (Strong: "هديتك مستنياك!" + auto-generated coupon)
    IF days_since > 90:
      → Mark as CHURNED for this Merchant. Stop sending.
```

### 3.2 Message Templates

| Stage | Delay | Channel | Template |
|-------|-------|---------|----------|
| **T7: Soft** | 14 days | Push + In-App | "وحشتنا يا [Name]! 💈 آخر مرة كنت في [Merchant] يوم [Date]. تعال نجدد اللوك! 🔥" |
| **T8: Medium** | 30 days | WhatsApp | "أهلاً [Name]! [Merchant] مشتاقلك — فات شهر من آخر زيارة. الكرسي بتاعك مستنيك! 😊 [رابط الحجز]" |
| **T9: Strong** | 60 days | WhatsApp + Coupon | "يا [Name]! عشان وحشتنا خالص — [Merchant] بيقدملك [X] ج.م خصم على حجزك الجاي. الكود: [CODE] 🎁 [رابط الحجز]" |

### 3.3 Coupon Auto-Generation (T9)

| Field | Value |
|-------|-------|
| `code` | Auto: `MISSYOU-{merchant_shortcode}-{random4}` (e.g., `MISSYOU-JLIA-4821`) |
| `type` | FIXED |
| `value` | Configurable by Merchant. Default: 30 EGP. |
| `funded_by` | MERCHANT (Merchant bears the cost) |
| `max_uses_per_client` | 1 |
| `valid_for` | 14 days from generation |
| `min_order_value` | 100 EGP |

> **Merchant Control:** The Merchant can set the coupon value (20 / 30 / 50 EGP) or disable T9 entirely. Default: 30 EGP.

---

## 4. "Happy Birthday" — Personalized Offers

### 4.1 Trigger Logic

```
Daily at 09:00 EET:
  FOR EACH Client C where C.date_of_birth.month = today.month AND C.date_of_birth.day = today.day:
    FOR EACH Merchant M where C has completed at least 1 Booking AND M.birthday_automation = enabled:
      → Send T10 birthday message from M to C
      → Attach birthday coupon (auto-generated)
```

### 4.2 Birthday Message Template

| Channel | Template |
|---------|----------|
| **WhatsApp** | "🎂 كل سنة وانت طيب يا [Name]! [Merchant] بيقدملك هدية عيد ميلادك — خصم [X] ج.م على أي خدمة! الكود: [CODE] 🎁 صلاحيته 7 أيام. [رابط الحجز]" |
| **Push** | "🎂 عيد ميلاد سعيد! [Merchant] بعتلك هدية — افتح وشوف! 🎁" |

### 4.3 Birthday Coupon

| Field | Value |
|-------|-------|
| `code` | Auto: `BDAY-{merchant_shortcode}-{random4}` |
| `type` | FIXED |
| `value` | Configurable: 20 / 30 / 50 / 100 EGP. Default: 50 EGP. |
| `funded_by` | MERCHANT |
| `valid_for` | 7 days from birthday |
| `max_uses_per_client` | 1 |

### 4.4 Birthday Rules

| Rule | Detail |
|------|--------|
| **DOB Required** | Birthday automation only works if Client has `date_of_birth` on file. If missing: not triggered. |
| **One per Merchant per year** | Each Merchant sends max 1 birthday message per Client per year. |
| **Opt-out** | Client can disable birthday messages globally. |
| **Multi-Merchant** | If Client uses 3 Merchants who all have birthday automation: Client receives 3 birthday messages (one from each). This is acceptable — each is from a different Merchant they frequent. |
| **Age sensitivity** | Do NOT include age calculation. Just "كل سنة وانت طيب", never "كل سنة وانت X سنة." |

---

## 5. Booking Reminders (Enhanced)

### 5.1 Standard Reminders (Platform — Non-Configurable)

| Trigger | Timing | Channel | Content |
|---------|--------|---------|---------|
| **T2: 24h Reminder** | -24 hours | Push + WhatsApp | "فاكرك إن عندك حجز بكره في [Merchant] الساعة [Time]. لو محتاج تلغي — الوقت لسه ينفع! ⏰ [رابط الحجز]" |
| **T3: 1h Reminder** | -1 hour | Push + WhatsApp | "حجزك بعد ساعة في [Merchant]! 🏃 خلي الـ QR جاهز. [رابط الحجز]" |
| **T4: 15min Reminder** | -15 minutes | Push only | "حجزك بعد 15 دقيقة! وري الـ QR لـ [Staff] لما توصل. 📱" |

### 5.2 Enhanced Reminders (Merchant-Configurable)

| Feature | Description | Config |
|---------|-------------|--------|
| **Prep Instructions** | Merchant can add custom text to the 24h reminder. | Free text, max 200 chars. |
| **Location Share** | Auto-include Google Maps link to Merchant's address. | Toggle: on/off. Default: on. |
| **What to Bring** | Custom note: "متنساش تجيب الفوطة الخاصة بيك" | Per-Service custom text. |
| **Weather Alert** (Phase 2) | "الجو حر بكره — خد مياه معاك!" (for outdoor Services like pitches). | Auto-trigger based on weather API + Sector = `sports`. |

### 5.3 Reminder Escalation

```
T2 (24h) sent → Client opens it? 
  └── YES → Normal flow. T3 (1h) sent as scheduled.
  └── NO (unopened after 2 hours) → Resend via SMS fallback.
      └── Still no open → T3 (1h) sent. If T3 also unopened → risk of no-show.
           → System flags for Merchant: "العميل [Name] مفتحش التذكيرات — ممكن ميجيش."
```

---

## 6. Automated Feedback & Review Loop

### 6.1 Post-Service Review Request (T5)

| Timing | +2 hours after Booking completion |
|--------|----------------------------------|
| **Channel** | Push + In-App |
| **Template** | "إزي كانت تجربتك في [Merchant] مع [Staff]? قيّم وساعد الناس تختار! ⭐ [رابط التقييم]" |
| **Deep Link** | Opens review form pre-filled with Booking details |

### 6.2 Review Form

```
┌──────────────────────────────────────────────────────────────────┐
│  ⭐ قيّم تجربتك                                                  │
│                                                                   │
│  [Merchant Logo] صالون جوليا — قص شعر مع أحمد                    │
│  📅 15 فبراير 2026 الساعة 14:00                                   │
│                                                                   │
│  التقييم العام:                                                   │
│  ☆ ☆ ☆ ☆ ☆  (tap to rate)                                       │
│                                                                   │
│  اكتب تعليقك (اختياري):                                          │
│  [ __________________________________ ]                           │
│                                                                   │
│  أضف صورة (اختياري):                                              │
│  [ 📷 اختار صورة ]                                                │
│                                                                   │
│  [ ارسل التقييم ✅ ]                                               │
│                                                                   │
│  💰 هتكسب 5 عملات بوكي على كل تقييم!                              │
└──────────────────────────────────────────────────────────────────┘
```

### 6.3 Review Request Rules

| Rule | Detail |
|------|--------|
| **One request per Booking** | System sends review request once. No nagging. |
| **Follow-up** (Phase 2) | If no review after 48 hours: one soft reminder. After that: no more. |
| **Booky Coins incentive** | 5 Booky Coins per review. Max 3 Coins-earning reviews per day (anti-spam). |
| **Photo review bonus** | +5 extra Coins for reviews with photos. |
| **Minimum length** | Review text must be ≥ 20 characters to be published. Star-only reviews are accepted but not featured. |
| **Staff-specific** | Review is linked to the specific Staff member who performed the Service. Affects Staff rating. |

### 6.4 Negative Review Handling

```
Client submits review with ≤ 2 stars
         │
         ▼
System sends additional prompt:
  "نأسف إن التجربة مكانتش كويسة 😔
   عايز توصل ملاحظتك للتاجر مباشرة?"
  [ نعم — ابعت ملاحظة خاصة ]  [ لا — كفاية كده ]
         │
         ├── YES → Private message to Merchant (not public review)
         │         Merchant receives: "عميلك [Name] مش مبسوط — شوف الملاحظة."
         │
         └── NO → Review published normally. Merchant sees it in reviews tab.
```

---

## 7. "Thank You" & Loyalty Nudges

### 7.1 Post-Service Thank You (T6)

| Timing | +24 hours after Booking completion |
|--------|-----------------------------------|
| **Channel** | WhatsApp (Merchant-branded) |
| **Template** | "شكرًا يا [Name] إنك زرت [Merchant]! 🙏 نتمنى التجربة عجبتك. لو عايز تحجز تاني — [رابط الحجز] 🔄" |

### 7.2 Smart Rebook Nudge (T15)

| Trigger | System detects a recurring pattern |
|---------|-----------------------------------|
| **Logic** | If Client booked the same Service at the same Merchant ≥ 3 times with a consistent interval (e.g., every 3 weeks ± 3 days): predict next Booking date. |
| **Timing** | 3 days before the predicted date |
| **Channel** | Push |
| **Template** | "وقت [Service] تاني قرّب! آخر مرة كانت [Date]. تحجز عند [Merchant] زي العادة؟ 💈 [رابط الحجز]" |

### 7.3 Rebook Pattern Detection

```
Client "Ahmed" Booking history at "صالون جوليا" (قص شعر):
  - Jan 5
  - Jan 26  (21 days gap)
  - Feb 15  (20 days gap)
  - ???     (predicted: ~Mar 7, ±3 days)

System calculates:
  avg_interval = (21 + 20) / 2 = 20.5 days
  stddev ≤ 3 days → CONSISTENT pattern detected ✅
  predicted_next = Feb 15 + 21 = Mar 8
  send_nudge_at = Mar 5 (3 days before)
```

### 7.4 Loyalty Milestone Nudges

| Milestone | Trigger | Message |
|-----------|---------|---------|
| **5th Booking** (at same Merchant) | Booking #5 completed | "مبروك! دي زيارتك الخامسة لـ [Merchant]! 🏆 انت بقيت من عملائنا المميزين." |
| **10th Booking** | Booking #10 completed | "10 زيارات في [Merchant]! 🔥 كده انت أسطورة — خصم 10% على حجزك الجاي! [CODE]" |
| **Rank Promotion** | Client reaches new Rank | "ترقيت! 🎉 دلوقتي انت [New Rank] — اكتشف المزايا الجديدة. [رابط]" |

---

## 8. Merchant-Configurable Automations

### 8.1 Automation Settings (Merchant Dashboard)

```
┌──────────────────────────────────────────────────────────────────┐
│  🤖 التسويق التلقائي (Marketing Automation)                      │
│                                                                   │
│  ── رسائل مفعلة ──────────────────────────────────────────────── │
│                                                                   │
│  ✅ وحشتنا (We Miss You)                                         │
│     بعد: [ 14 ] يوم | كوبون: [ 30 ج.م ] | [ تعديل الرسالة ✏️ ]  │
│                                                                   │
│  ✅ عيد ميلاد سعيد (Happy Birthday)                               │
│     كوبون: [ 50 ج.م ] صلاحية: 7 أيام | [ تعديل الرسالة ✏️ ]    │
│                                                                   │
│  ✅ طلب تقييم (Review Request)                                    │
│     بعد: [ 2 ساعة ] من الخدمة | [ تعديل الرسالة ✏️ ]            │
│                                                                   │
│  ✅ شكرًا + احجز تاني (Thank You)                                 │
│     بعد: [ 24 ساعة ] | [ تعديل الرسالة ✏️ ]                     │
│                                                                   │
│  ❌ تذكير إعادة الحجز (Smart Rebook)                              │
│     [ تفعيل ]                                                     │
│                                                                   │
│  ── إحصائيات ─────────────────────────────────────────────────── │
│  رسائل مُرسلة هذا الشهر: 340                                     │
│  عملاء رجعوا بسبب "وحشتنا": 23 (6.7% conversion)               │
│  تقييمات جديدة: 45                                                │
│                                                                   │
│  Tier: Growth (249 EGP) — جميع الأدوات متاحة ✅                   │
└──────────────────────────────────────────────────────────────────┘
```

### 8.2 Merchant Customization Options

| Automation | What Merchant Can Configure | What They Can't Change |
|------------|---------------------------|----------------------|
| **We Miss You** | Timing (14/21/30 days), coupon value, enable/disable | Channel selection, message structure |
| **Birthday** | Coupon value, enable/disable | Timing (always on DOB) |
| **Review Request** | Delay (1h / 2h / 4h), enable/disable | Booky Coins incentive (platform-controlled) |
| **Thank You** | Message text (within template), enable/disable | Channel (always WhatsApp) |
| **Smart Rebook** | Enable/disable | Pattern detection logic (system-managed) |

### 8.3 Availability by Subscription Tier

| Feature | Starter (99 EGP) | Growth (249 EGP) | Pro (499 EGP) |
|---------|------------------|-------------------|----------------|
| Post-Service Review Request | ✅ | ✅ | ✅ |
| Thank You Message | ✅ | ✅ | ✅ |
| We Miss You (Soft — Push) | ✅ | ✅ | ✅ |
| We Miss You (WhatsApp + Coupon) | ❌ | ✅ | ✅ |
| Happy Birthday | ❌ | ✅ | ✅ |
| Smart Rebook Nudge | ❌ | ❌ | ✅ |
| Custom Message Editing | ❌ | ✅ (limited) | ✅ (full) |
| Automation Analytics | ❌ | ✅ | ✅ (Advanced) |
| Loyalty Milestone Messages | ❌ | ❌ | ✅ |

---

## 9. Campaign Analytics

### 9.1 Automation Performance Dashboard

| Metric | Definition | Target |
|--------|-----------|--------|
| **Send Rate** | Messages successfully delivered / triggered | > 95% |
| **Open Rate** | Messages opened / delivered | Push: > 40%, WhatsApp: > 70% |
| **Click Rate** | CTA clicked (deep link to Booking) / opened | > 15% |
| **Conversion Rate** | Bookings made within 7 days of message / sent | "We Miss You": > 5%, "Birthday": > 10% |
| **Revenue Attributed** | Revenue from Bookings linked to an automation trigger | Tracked per automation type |
| **Opt-Out Rate** | Clients who disabled this automation / total recipients | < 2% (if higher: message is annoying) |
| **Coupon Redemption Rate** | Coupons used / coupons generated | > 8% |

### 9.2 A/B Testing (Phase 2)

| Capability | Detail |
|-----------|--------|
| **Message variants** | System sends variant A to 50% and variant B to 50%. Measures open rate and conversion. Winner auto-promoted. |
| **Timing variants** | Test "We Miss You" at 14 days vs. 21 days. Measure which wins back more Clients. |
| **Coupon value variants** | Test 30 EGP vs. 50 EGP discount. Measure conversion vs. cost. |

---

## 10. Gherkin Scenarios

### Scenario 1: "We Miss You" — Full Lifecycle

```gherkin
Feature: Marketing Automation — We Miss You

  Scenario: Client receives escalating win-back messages
    Given Client "أحمد" last booked at Merchant "صالون جوليا" on 2026-01-15
    And Merchant "صالون جوليا" has "We Miss You" automation enabled:
      | soft_days   | 14         |
      | medium_days | 30         |
      | strong_days | 60         |
      | coupon_value| 30 EGP     |

    When the date is 2026-01-29 (14 days since last Booking)
    Then the system sends T7 (Soft):
      | channel | App Push + In-App                                         |
      | message | "وحشتنا يا أحمد! 💈 آخر مرة كنت في صالون جوليا يوم 15 يناير." |
    And no coupon is attached

    When the date is 2026-02-14 (30 days) and أحمد has NOT rebooked
    Then the system sends T8 (Medium):
      | channel | WhatsApp                                                   |
      | message | "أهلاً أحمد! صالون جوليا مشتاقلك — فات شهر من آخر زيارة." |
    And no coupon is attached

    When the date is 2026-03-16 (60 days) and أحمد has NOT rebooked
    Then the system sends T9 (Strong):
      | channel | WhatsApp                                                    |
      | message | "يا أحمد! عشان وحشتنا — صالون جوليا بيقدملك 30 ج.م خصم!" |
      | coupon  | MISSYOU-JLIA-4821 (30 EGP, valid 14 days, Merchant-funded) |

    When the date is 2026-04-15 (90+ days) and أحمد has NOT rebooked
    Then the system marks أحمد as CHURNED for صالون جوليا
    And NO more messages are sent from صالون جوليا
```

### Scenario 2: Happy Birthday with Coupon

```gherkin
Feature: Marketing Automation — Birthday

  Scenario: Client receives birthday offer from frequented Merchant
    Given Client "سارة" has date_of_birth = 1998-03-10
    And سارة has completed Bookings at:
      | merchant       | birthday_automation |
      | صالون جوليا     | ✅ enabled (50 EGP) |
      | سبا الياسمين    | ✅ enabled (30 EGP) |
      | ملاعب النصر     | ❌ disabled         |

    When the date is 2026-03-10 at 09:00 EET
    Then the system sends 2 birthday messages:
      | merchant       | channel   | coupon                    |
      | صالون جوليا     | WhatsApp  | BDAY-JLIA-9012 (50 EGP)  |
      | سبا الياسمين    | WhatsApp  | BDAY-YSMN-3456 (30 EGP)  |
    And ملاعب النصر does NOT send (automation disabled)
    And each coupon is valid for 7 days
    And each is Merchant-funded
```

### Scenario 3: Smart Rebook Nudge — Pattern Detection

```gherkin
Feature: Marketing Automation — Smart Rebook

  Scenario: System detects consistent Booking pattern and nudges
    Given Client "خالد" has the following Booking history at "باربر الكينج":
      | service  | completed_at    |
      | قص شعر   | 2026-01-05      |
      | قص شعر   | 2026-01-26      |  # 21 days
      | قص شعر   | 2026-02-15      |  # 20 days

    When the system's pattern detection job runs
    Then it calculates:
      | avg_interval | 20.5 days                    |
      | stddev       | 0.5 days (consistent ✅)     |
      | predicted_next | ~2026-03-07                |
      | nudge_date   | 2026-03-04 (3 days before)   |

    When the date is 2026-03-04
    Then the system sends T15 (Smart Rebook):
      | channel | Push                                                       |
      | message | "وقت قص شعر تاني قرّب! آخر مرة كانت 15 فبراير. تحجز عند باربر الكينج?" |
      | deep_link | Booking page for قص شعر at باربر الكينج               |
```

### Scenario 4: Post-Service Review → Negative Review → Private Feedback

```gherkin
Feature: Automated Feedback Loop

  Scenario: Client gives low review and sends private feedback
    Given Client "نور" completed Booking at "سبا الياسمين" at 14:00
    And the Merchant has review request automation enabled (2h delay)

    When the time is 16:00 (+2 hours)
    Then the system sends review request:
      | channel | Push + In-App                                              |
      | message | "إزي كانت تجربتك في سبا الياسمين? قيّم وساعد الناس تختار!" |

    When نور opens the review form and gives 2 stars ⭐⭐
    And writes: "الخدمة كانت بطيئة والمكان مش نضيف"
    Then the system shows additional prompt:
      "نأسف إن التجربة مكانتش كويسة 😔 عايز توصل ملاحظتك للتاجر مباشرة?"

    When نور taps "نعم — ابعت ملاحظة خاصة"
    Then a private message is sent to the Merchant:
      "عميلك نور مش مبسوط: الخدمة كانت بطيئة والمكان مش نضيف."
    And the 2-star review is STILL published publicly
    And نور earns 5 Booky Coins for the review
```

---

## 11. Edge Cases

| # | Edge Case | Rule |
|---|-----------|------|
| 1 | **Client books at Merchant A, but gets "We Miss You" from Merchant B** | Correct behavior. "We Miss You" is per-Merchant. Client may be active on Booky (booking at A) but dormant at B. Each Merchant's automation runs independently. |
| 2 | **Client disables "We Miss You" globally** | Respected. No win-back messages from ANY Merchant. Preference stored in Client account settings. |
| 3 | **Merchant has no budget for birthday coupons** | Merchant can disable birthday automation or set coupon to 0 (message only, no discount). Message: "كل سنة وانت طيب! 🎂" without coupon. |
| 4 | **Client's DOB is Feb 29 (leap year)** | Send birthday message on Feb 28 in non-leap years. |
| 5 | **Client books at Merchant during "We Miss You" campaign (between T7 and T8)** | Booking resets the timer. No more "We Miss You" messages. Client is now ACTIVE again. |
| 6 | **Merchant sends 500 "We Miss You" messages in one day (high volume)** | System processes in batches. WhatsApp Business API rate limits respected (max 1,000/day per number). If limit hit: queue remaining for next day. |
| 7 | **Review request sent but Client already reviewed** | System checks: does a review exist for this Booking? If yes: do NOT send review request. |
| 8 | **Client completes 3 Bookings in one day (same Merchant)** | 3 review requests sent (one per Booking, 2h after each). NOT batched. Each Booking deserves its own review. |
| 9 | **Smart Rebook detects pattern but Client already booked** | If Client has an active future Booking at the same Merchant for the same Service: suppress the nudge. |
| 10 | **Merchant changes automation settings (e.g., disables birthday) while messages are queued** | Queued messages are cancelled. Already-sent messages are not recalled. |
| 11 | **Two Merchants send "We Miss You" on the same day** | Allowed. Rate limiting per-Merchant, not per-Client for Merchant automations. But if 3+ Merchant messages in one day: bundle into a digest Push. |

---

> **📌 Source of Truth:** This document extends the notification framework in [notification-matrix.md](mdc:docs/business-logic/05-core-systems/notification-matrix.md) with Merchant-specific automated campaigns. Coupon logic follows [growth-and-promo-logic.md](mdc:docs/business-logic/05-core-systems/growth-and-promo-logic.md). Booking lifecycle triggers depend on [booking-lifecycle.md](mdc:docs/business-logic/02-client/booking-lifecycle.md).
>
> *Booky Center: بضغطة واحدة.. ميعادك في جيبك* ✨

