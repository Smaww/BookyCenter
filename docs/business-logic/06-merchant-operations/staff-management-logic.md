# 📂 06-Merchant Operations: Staff Management Logic

## *Rostering, Commission Payouts & Client-Facing Staff Selection*

**Parent:** [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md)
**Cross-Refs:** [pos-and-walk-in-logic.md](mdc:docs/business-logic/06-merchant-operations/pos-and-walk-in-logic.md) (Calendar), [service-catalog-architecture.md](mdc:docs/business-logic/05-core-systems/service-catalog-architecture.md) (Services), [wallet-and-payouts.md](mdc:docs/business-logic/03-merchant/wallet-and-payouts.md) (Merchant Wallet)
**Version:** 1.0 | **Date:** February 15, 2026

---

## Table of Contents

1. [Why Staff Management Matters](#1-why-staff-management-matters)
2. [Staff Data Model](#2-staff-data-model)
3. [Rostering & Shift Management](#3-rostering--shift-management)
4. [Staff Commission Rules](#4-staff-commission-rules)
5. [Client-Facing Staff Selection](#5-client-facing-staff-selection)
6. [Staff Performance & Analytics](#6-staff-performance--analytics)
7. [Staff Access & Permissions](#7-staff-access--permissions)
8. [Merchant Dashboard: Staff Module](#8-merchant-dashboard-staff-module)
9. [Gherkin Scenarios](#9-gherkin-scenarios)
10. [Edge Cases](#10-edge-cases)

---

## 1. Why Staff Management Matters

### The Business Reality

> A barber shop with 4 chairs is not "one Merchant" — it's **4 parallel Service providers**. Without per-Staff calendars, the system can only book 1 Client per Slot across the entire shop. With Staff Management, it can book 4.

### Competitive Comparison

| Feature | Rekaz.io | Fresha | **Booky Center** |
|---------|----------|--------|-------------------|
| Staff Profiles | ❌ | ✅ | ✅ |
| Per-Staff Calendar | ❌ | ✅ | ✅ |
| Commission Tracking | ❌ | ✅ (basic) | ✅ (Advanced: fixed + %) |
| Client Staff Preference | ❌ | ✅ | ✅ |
| Rostering / Shift Management | ❌ | ✅ | ✅ |
| Staff Login (separate access) | ❌ | ✅ | ✅ (Phase 2) |

### Capacity Impact

```
WITHOUT Staff Management:
  1 Merchant = 1 calendar = 1 Client per Slot
  Working hours: 10:00-22:00 (12h), 30-min Slots = 24 Slots/day
  Max Bookings/day: 24

WITH Staff Management (4 Staff):
  1 Merchant = 4 calendars = 4 Clients per Slot
  Max Bookings/day: 24 × 4 = 96  (4× capacity increase!)
```

---

## 2. Staff Data Model

### Staff Entity

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `staff_id` | UUID v4 | Auto | System-generated | Unique identifier |
| `merchant_id` | UUID v4 | Auto | FK → Merchants | Owning Merchant |
| `name` | String | ✅ | Min 2 chars, max 50 chars | Staff member's display name |
| `name_ar` | String | ✅ | Arabic characters | Arabic display name (Client-facing) |
| `phone` | String | ❌ | E.164 format | For internal notifications (not Client-facing) |
| `photo` | URL | ❌ | JPG/PNG, max 2 MB | Profile photo (Client-facing) |
| `title` | String | ❌ | Max 30 chars | Role title (e.g., "Senior Stylist", "مصفف أول") |
| `bio` | String | ❌ | Max 200 chars | Short bio (Client-facing) |
| `services` | Array[UUID] | ✅ | Min 1. FK → Services | Which Services this Staff can perform |
| `commission_model` | Enum | ✅ | `FIXED_SALARY` / `PERCENTAGE` / `HYBRID` / `NONE` | How Staff is compensated |
| `commission_pct` | Integer | Conditional | 0–100. Required if `PERCENTAGE` or `HYBRID`. | % of Service revenue |
| `fixed_salary` | Integer (EGP) | Conditional | Required if `FIXED_SALARY` or `HYBRID`. | Monthly fixed salary |
| `is_active` | Boolean | Auto | Default `true` | Whether the Staff member is operational |
| `is_bookable_online` | Boolean | Auto | Default `true` | Whether Clients can select this Staff for online Bookings |
| `display_order` | Integer | ❌ | Default: creation order | Order shown to Clients |
| `rating` | Float | Auto | 0.0–5.0. Computed. | Average Client rating for this Staff member |
| `total_bookings` | Integer | Auto | Computed | Lifetime Bookings served |
| `created_at` | Timestamp | Auto | ISO 8601 UTC | Creation date |

### Staff Limits by Subscription Tier

| Tier | Max Staff Members |
|------|------------------|
| **Starter** (99 EGP/mo) | 3 |
| **Growth** (249 EGP/mo) | 10 |
| **Pro** (499 EGP/mo) | Unlimited |

---

## 3. Rostering & Shift Management

### 3.1 Working Hours Definition

Each Staff member has a **weekly schedule** defining when they are available.

```
┌──────────────────────────────────────────────────────────────────┐
│  📅 جدول العمل — أحمد (Senior Stylist)                           │
│                                                                   │
│  السبت:    10:00 — 18:00  ✅                                      │
│  الأحد:    10:00 — 18:00  ✅                                      │
│  الاثنين:  10:00 — 18:00  ✅                                      │
│  الثلاثاء: 12:00 — 20:00  ✅ (وردية مسائية)                       │
│  الأربعاء: 12:00 — 20:00  ✅                                      │
│  الخميس:   إجازة ❌                                               │
│  الجمعة:   إجازة ❌                                               │
│                                                                   │
│  استراحة يومية: 14:00 — 14:30 (كل يوم شغل)                       │
│                                                                   │
│  [ حفظ الجدول ✅ ]                                                 │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Schedule Data Model

| Field | Type | Description |
|-------|------|-------------|
| `staff_id` | UUID v4 | Staff member |
| `day_of_week` | Enum (0–6) | 0 = Saturday, 6 = Friday (Egyptian week) |
| `is_working` | Boolean | Whether Staff works this day |
| `start_time` | Time (HH:MM) | Shift start (EET) |
| `end_time` | Time (HH:MM) | Shift end (EET) |
| `breaks` | Array[{start, end}] | Intra-day breaks (auto-blocked on calendar) |

### 3.3 Schedule Rules

| Rule | Detail |
|------|--------|
| **Minimum shift** | 2 hours |
| **Maximum shift** | 16 hours (labor compliance) |
| **Breaks** | Merchant-configured. Common: 30-min lunch. Auto-blocked as ⬛ Gray Slots. |
| **Overrides** | One-off date overrides (e.g., "أحمد هيشتغل الخميس 2026-02-20 بدل يوم الأحد"). |
| **Leave / PTO** | Staff member marked as "إجازة" for specific dates. All Slots blocked. Online Bookings for that Staff auto-reassigned or cancelled with notification. |
| **Slot Generation** | System generates bookable Slots ONLY within the Staff member's working hours. Outside hours = no Slots shown to Clients. |
| **Timezone** | All times in EET (Africa/Cairo, UTC+2). Stored as UTC. Displayed as EET. |

### 3.4 Shift Patterns (Templates)

| Pattern | Description | Example |
|---------|-------------|---------|
| **Fixed** | Same hours every working day | 10:00–18:00, Sat–Wed |
| **Split Shift** | Morning + Evening with a long break | 09:00–13:00, 16:00–21:00 |
| **Rotating** | Alternating days/weeks | Week A: Sat–Tue. Week B: Wed–Fri. |
| **On-Call** (Phase 2) | Available but not scheduled. Booking triggers notification. | Home Services Sector |

---

## 4. Staff Commission Rules

### 4.1 Commission Models

| Model | Description | When to Use |
|-------|-------------|-------------|
| **`FIXED_SALARY`** | Staff receives a fixed monthly amount regardless of Bookings. | Salaried employees (receptionists, assistants). |
| **`PERCENTAGE`** | Staff receives X% of every Service they perform. | Commission-based staff (freelance barbers, stylists). |
| **`HYBRID`** | Fixed base salary + X% per Service. | Standard employment model (base + incentive). |
| **`NONE`** | No commission tracking. Merchant handles externally. | Owner-operated businesses, external payroll. |

### 4.2 Commission Calculation

#### Percentage Model

```
Staff Commission = Service Revenue × commission_pct / 100

Example:
  Service: قص شعر = 100 EGP
  أحمد's commission_pct: 30%
  أحمد earns: 100 × 30% = 30 EGP

  Service: صبغة شعر (variable, final = 800 EGP)
  أحمد earns: 800 × 30% = 240 EGP

  Add-ons included? YES. Commission on total (Service + Add-ons).
  Service: قص شعر (100) + غسيل (30) = 130 EGP
  أحمد earns: 130 × 30% = 39 EGP
```

#### Hybrid Model

```
Staff Monthly Earnings = fixed_salary + sum(Service Revenue × commission_pct)

Example:
  أحمد: fixed_salary = 3,000 EGP/month, commission_pct = 15%
  March Bookings: 120 Services × avg 150 EGP = 18,000 EGP revenue
  Commission: 18,000 × 15% = 2,700 EGP
  Total: 3,000 + 2,700 = 5,700 EGP
```

### 4.3 Commission Source

| Entry Type | Counts for Commission? | Revenue Used |
|-----------|----------------------|-------------|
| **Online Booking** (🟢) | ✅ | Service price - Deposit already tracked (full Service revenue) |
| **Walk-In** (🔵) | ✅ | POS Checkout total |
| **Phone Booking** (🟡) | ✅ | POS Checkout total or manually entered |
| **No-Show** (🔴) | ❌ | Deposit goes to Merchant, not Staff |
| **Cancelled** | ❌ | No revenue generated |

> **Critical Rule:** Staff commission is calculated on the **Client-paid revenue** (Service + Add-ons), NOT on the pre-discount price. If a 20% coupon is applied, Staff commission is on the discounted amount.

### 4.4 Commission vs. Booky Commission

```
Online Booking: قص شعر = 100 EGP
  │
  ├── Booky Commission: 20 EGP (platform fee, deducted at Handshake)
  ├── Merchant Net: 80 EGP
  │     │
  │     ├── Staff Commission (30%): 30 EGP (30% of 100, NOT 30% of 80)
  │     └── Merchant Keeps: 50 EGP
  │
  └── Total: Booky 20 + Staff 30 + Merchant 50 = 100 EGP ✅
```

> **Important:** Staff commission is calculated on the **full Service price** (pre-Booky-commission). The Merchant absorbs both Booky's commission and Staff's commission from the gross revenue.

### 4.5 Staff Payout

| Rule | Detail |
|------|--------|
| **Tracking** | Commission accrues in a per-Staff ledger within the Merchant Dashboard. |
| **Payout** | Merchant pays Staff externally (cash, bank transfer). Booky tracks but does NOT process Staff payouts. |
| **Report** | Merchant can generate a per-Staff commission report (daily/weekly/monthly) for payroll. |
| **Phase 2** | Booky-facilitated Staff payouts: Merchant taps "Pay Staff" → funds from Merchant Wallet → Staff's mobile wallet. |

---

## 5. Client-Facing Staff Selection

### 5.1 How It Works (Client App)

When a Service has `staff_required = true` (or the Merchant has > 1 Staff who can perform the Service), the Client sees a Staff selection step during Booking:

```
┌──────────────────────────────────────────────────────────────┐
│  اختار المتخصص:                                              │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  📷 أحمد      │  │  📷 عمر       │  │  📷 منى       │       │
│  │  ⭐ 4.8 (56)  │  │  ⭐ 4.5 (34)  │  │  ⭐ 4.9 (89)  │       │
│  │  Senior       │  │  Junior      │  │  Senior       │       │
│  │  Stylist      │  │  Stylist     │  │  Colorist     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│  ○ أي حد متاح (أسرع وقت)  ← Default option                  │
│                                                               │
│  [ متابعة ← ]                                                 │
└──────────────────────────────────────────────────────────────┘
```

### 5.2 Selection Options

| Option | Behavior | Slot Availability |
|--------|----------|-------------------|
| **"أي حد متاح" (Any Available)** | System auto-assigns the first Staff with a free Slot. | Shows ALL available Slots across all Staff. Most Slots shown = fastest booking. |
| **Specific Staff** | Client selects a named Staff member. | Shows only that Staff member's available Slots. Fewer options. |

### 5.3 Staff Selection Rules

| Rule | Detail |
|------|--------|
| **Default** | "أي حد متاح" is pre-selected. Optimizes for availability. |
| **No-Preference = Round-Robin** | When "Any Available" is selected and multiple Staff have the same Slot free: assign using round-robin to balance workload. |
| **Staff Rating visible** | Client sees photo, name, title, and average rating (from completed Bookings). |
| **Services filter** | Only Staff who can perform the selected Service appear. If Staff "عمر" doesn't do "صبغة", he's not shown for that Service. |
| **Online-only filter** | Staff with `is_bookable_online = false` don't appear to Clients (Merchant-use only, e.g., trainee). |
| **Slot impact** | Selecting a specific Staff may show fewer available Slots. UI shows: "عمر — أقرب ميعاد: بكره الساعة 10:00." |

### 5.4 Staff Preference Memory

| Feature | Detail |
|---------|--------|
| **Repeat Booking** | If Client previously booked with "أحمد" and rebooks the same Service, "أحمد" is pre-highlighted (not auto-selected). |
| **Rebook Prompt** | After a completed Booking: "حبيت أحمد؟ احجز معاه تاني! 🔄" |
| **Favorites** (Phase 2) | Client can "favorite" a Staff member. Preferred Staff shown first in the list. |

---

## 6. Staff Performance & Analytics

### Per-Staff Dashboard (Merchant View)

```
┌──────────────────────────────────────────────────────────────────┐
│  👤 أحمد — أداء الشهر (فبراير 2026)                              │
│                                                                   │
│  📊 إجمالي الحجوزات:  85 (online: 52, walk-in: 33)              │
│  💰 إجمالي الإيرادات:  12,750 ج.م                                │
│  📈 العمولة المستحقة:  3,825 ج.م (30%)                            │
│  ⭐ التقييم:            4.8 / 5.0 (من 56 تقييم)                  │
│  ⏱️ متوسط مدة الخدمة:  28 دقيقة (المتوقع: 30)                   │
│  🔴 حالات عدم حضور:    2 (no-shows by Client)                    │
│  📋 الطابور (متوسط):   12 دقيقة انتظار                           │
│                                                                   │
│  ── أكتر الخدمات طلبًا ──────────────────────────────────────── │
│  1. قص شعر (45 حجز)                                              │
│  2. ذقن (25 حجز)                                                 │
│  3. كومبو (15 حجز)                                               │
│                                                                   │
│  [ تفاصيل ] [ تقرير PDF ]                                        │
└──────────────────────────────────────────────────────────────────┘
```

### Staff Comparison Report

| Metric | أحمد | عمر | منى |
|--------|------|-----|-----|
| Bookings (Month) | 85 | 62 | 91 |
| Revenue | 12,750 | 8,060 | 18,200 |
| Avg Rating | 4.8 | 4.5 | 4.9 |
| Utilization Rate | 78% | 56% | 85% |
| Walk-In Ratio | 39% | 48% | 22% |

> **Utilization Rate** = (Booked Slots / Available Slots) × 100. Target: > 70%.

---

## 7. Staff Access & Permissions

### Phase 1: Merchant-Controlled

| Access Level | Who | Can Do |
|-------------|-----|--------|
| **Owner** | Merchant account holder | Full dashboard access. Create/edit/delete Staff. View all analytics. |
| **Staff (no login)** | Staff members | No dashboard access. Merchant manages everything on their behalf. |

### Phase 2: Staff Login

| Access Level | Can Do | Cannot Do |
|-------------|--------|-----------|
| **Staff Login** | View own calendar, view assigned Bookings, mark walk-ins on own calendar, view own commission report. | View other Staff data, edit Services, edit pricing, access Wallet, view Merchant analytics. |

### Staff Login Data

| Field | Type | Description |
|-------|------|-------------|
| `staff_pin` | 4-digit PIN | Quick login for shared devices (tablet at front desk) |
| `staff_phone` | E.164 | OTP-based login for personal device |
| `role` | `STAFF` | Limited permissions |

---

## 8. Merchant Dashboard: Staff Module

### Staff List

```
┌──────────────────────────────────────────────────────────────────┐
│  👥 فريق العمل (Staff)                           [ + إضافة ]    │
│                                                                   │
│  ┌─────┬──────────┬────────────┬──────────┬───────┬─────────┐   │
│  │  #  │  الاسم    │  الخدمات   │  النموذج  │ الحالة │ إجراءات │   │
│  ├─────┼──────────┼────────────┼──────────┼───────┼─────────┤   │
│  │  1  │  أحمد     │ قص، ذقن    │ 30% عمولة │  ✅   │ ✏️ 🗑️  │   │
│  │  2  │  عمر      │ قص         │ مرتب ثابت │  ✅   │ ✏️ 🗑️  │   │
│  │  3  │  منى      │ صبغة، قص   │ هجين      │  ✅   │ ✏️ 🗑️  │   │
│  └─────┴──────────┴────────────┴──────────┴───────┴─────────┘   │
│                                                                   │
│  Starter Tier: 3/3 Staff used. [ ⬆️ ترقية للـ Growth ]           │
└──────────────────────────────────────────────────────────────────┘
```

### Staff Creation Wizard

```
Step 1: المعلومات الأساسية (Basic Info)
  • Name (Arabic) — required
  • Photo — optional
  • Title — optional (e.g., "مصفف أول")
  • Bio — optional

Step 2: الخدمات (Services)
  • Select from Merchant's Service catalog
  • Minimum 1 Service

Step 3: جدول العمل (Schedule)
  • Weekly schedule builder
  • Breaks configuration

Step 4: نظام العمولة (Commission)
  • Model: [ مرتب ثابت | نسبة | هجين | بدون ]
  • Values per model
  • Preview: "لو أحمد عمل 80 خدمة × 150 ج.م = عمولته هتكون X ج.م"

Step 5: إعدادات الظهور (Visibility)
  • Show to Clients online? [ نعم / لا ]
  • Display order

[ إنشاء ✅ ]
```

---

## 9. Gherkin Scenarios

### Scenario 1: Staff Roster Affects Available Slots

```gherkin
Feature: Staff Rostering

  Scenario: Staff schedule determines available online Booking Slots
    Given Merchant "صالون جوليا" has Staff:
      | name | works_saturday | saturday_hours |
      | أحمد  | ✅              | 10:00–18:00    |
      | عمر   | ❌ (off)        | —              |
      | منى   | ✅              | 12:00–20:00    |
    And all perform "قص شعر" (30 min)

    When a Client searches for "قص شعر" at صالون جوليا on Saturday
    Then the available Slots are:
      | time   | staff                |
      | 10:00  | أحمد                 |
      | 10:30  | أحمد                 |
      | ...    | أحمد (until 17:30)   |
      | 12:00  | أحمد, منى            |
      | 12:30  | أحمد, منى            |
      | ...    | both (until 17:30)   |
      | 18:00  | منى                  |
      | ...    | منى (until 19:30)    |
    And عمر does NOT appear (day off)
    And selecting "أي حد متاح" at 10:00 auto-assigns أحمد
    And selecting "أي حد متاح" at 12:00 uses round-robin
```

### Scenario 2: Commission Calculation — Hybrid Model

```gherkin
Feature: Staff Commission

  Scenario: Hybrid commission calculated at month end
    Given Staff "أحمد" at Merchant "صالون جوليا" has:
      | commission_model | HYBRID      |
      | fixed_salary     | 3,000 EGP   |
      | commission_pct   | 15%         |

    And أحمد completed the following in February 2026:
      | entry_type      | count | avg_revenue | total_revenue |
      | Online Booking  | 52    | 150 EGP     | 7,800 EGP     |
      | Walk-In         | 33    | 120 EGP     | 3,960 EGP     |
      | No-Show         | 2     | —           | 0 EGP         |
      | Cancelled       | 3     | —           | 0 EGP         |

    When the Merchant generates أحمد's February commission report
    Then the report shows:
      | line                     | amount      |
      | Fixed Salary             | 3,000 EGP   |
      | Commission (15% of 11,760) | 1,764 EGP |
      | Total Earnings           | 4,764 EGP   |
    And No-Show and Cancelled entries are excluded from commission
    And the Merchant can export this as PDF for payroll
```

### Scenario 3: Client Selects Staff During Online Booking

```gherkin
Feature: Client Staff Selection

  Scenario: Client books a specific Staff member
    Given a Client opens Booking for "قص شعر" at "صالون جوليا"
    And 3 Staff members are shown:
      | name | rating | next_available |
      | أحمد  | 4.8    | Today 14:00    |
      | عمر   | 4.5    | Today 14:00    |
      | منى   | 4.9    | Tomorrow 10:00 |

    When the Client selects "منى"
    Then only منى's available Slots are shown
    And the earliest is "Tomorrow 10:00"
    And the Client confirms the Booking with منى

    Then the Booking is assigned to منى's calendar
    And منى's commission will be calculated when the Booking completes
    And the Client's Booking confirmation shows: "الحجز مع منى"
```

### Scenario 4: Staff Leave — Existing Bookings Affected

```gherkin
Feature: Staff Leave Management

  Scenario: Staff takes unexpected leave with existing Bookings
    Given Staff "أحمد" has 3 online Bookings on Thursday:
      | booking_id       | client | time  |
      | BK-260220-0010  | نور     | 10:00 |
      | BK-260220-0012  | سارة    | 11:00 |
      | BK-260220-0015  | خالد    | 14:00 |

    When the Merchant marks أحمد as "إجازة" (leave) for Thursday
    Then the system shows a conflict warning:
      "أحمد عنده 3 حجوزات يوم الخميس — عايز تعمل إيه؟"
      Options:
        a) [ إعادة تعيين لموظف تاني ] (Reassign to another Staff)
        b) [ إلغاء الحجوزات ] (Cancel Bookings — triggers Client refund)

    When the Merchant selects "إعادة تعيين لموظف تاني"
    And assigns all 3 to "عمر"
    Then:
      | booking_id       | old_staff | new_staff | client_notified |
      | BK-260220-0010  | أحمد       | عمر        | ✅ "اتغير المتخصص لـ عمر" |
      | BK-260220-0012  | أحمد       | عمر        | ✅                        |
      | BK-260220-0015  | أحمد       | عمر        | ✅                        |
    And أحمد's Thursday Slots are blocked
    And the Clients can cancel for free if they don't want عمر (Staff change = free cancellation)
```

---

## 10. Edge Cases

| # | Edge Case | Rule |
|---|-----------|------|
| 1 | **Solo Merchant (owner is the only Staff)** | System auto-creates a default Staff record named after the Merchant. No Staff selection shown to Client. All Bookings assigned to this single Staff. |
| 2 | **Staff deleted while having future Bookings** | Cannot delete Staff with future Bookings. Must first reassign or cancel all Bookings. Show: "في حجوزات قادمة — لازم تنقلها أو تلغيها الأول." |
| 3 | **Two Staff have identical schedules and Services** | Both shown to Client. Round-robin on "Any Available." No issue. |
| 4 | **Staff works 18-hour shift (labor concern)** | System warns: "⚠️ الوردية دي أطول من 16 ساعة — هل انت متأكد؟" But allows it (Egyptian labor norms vary). |
| 5 | **Client books "Any Available" → assigned to أحمد → أحمد calls in sick** | Merchant must reassign manually. System suggests: "عمر فاضي في نفس الوقت — تحوّل الحجز؟" Client notified of change. Free cancellation option. |
| 6 | **Staff commission on coupon-discounted Booking** | Commission on discounted price. Example: 100 EGP Service, 20% coupon = Client pays 80 EGP. Staff gets 30% of 80 = 24 EGP (not 30 EGP). |
| 7 | **Merchant changes commission model mid-month** | New model applies to NEW Bookings only. Existing Bookings in the month use the model at time of Booking. Month-end report shows both. |
| 8 | **Staff performs a Service not in their assigned Services list** | For online Bookings: impossible (system enforces). For walk-ins: Merchant can override and assign any Service. Commission still calculated. |
| 9 | **Client-facing profile shows 0 ratings (new Staff)** | Show "جديد ✨" badge instead of stars. Encourage early reviews: "أول تقييم لـ أحمد — شاركنا رأيك!" |
| 10 | **Merchant downgrades from Growth → Starter (10 Staff → 3)** | Excess Staff are deactivated (not deleted). Existing Bookings honored. Merchant must choose which 3 to keep active. Deactivated Staff don't appear in calendar or Client selection. |

---

## Feature Availability by Subscription Tier

| Feature | Starter (99 EGP) | Growth (249 EGP) | Pro (499 EGP) |
|---------|------------------|-------------------|----------------|
| Staff Members | 3 | 10 | Unlimited |
| Per-Staff Calendar | ✅ | ✅ | ✅ |
| Commission Tracking | ✅ (Basic: % only) | ✅ (Full: all models) | ✅ (Full + Reports) |
| Client Staff Selection | ✅ | ✅ | ✅ |
| Staff Performance Analytics | ❌ | ✅ | ✅ (Advanced) |
| Staff Login (Phase 2) | ❌ | ❌ | ✅ |
| Commission PDF Export | ❌ | ✅ | ✅ |

---

> **📌 Source of Truth:** This document extends the Merchant Dashboard defined in [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md) §7 (Merchant Subscription Tiers). Staff calendars are the backbone of [pos-and-walk-in-logic.md](mdc:docs/business-logic/06-merchant-operations/pos-and-walk-in-logic.md) and feed into [service-catalog-architecture.md](mdc:docs/business-logic/05-core-systems/service-catalog-architecture.md) for Service assignment.
>
> *Booky Center: بضغطة واحدة.. ميعادك في جيبك* ✨

