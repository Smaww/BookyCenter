# 📂 05-Core Systems: Service Catalog Architecture

## *Fixed, Variable, Time-Based Pricing & Add-Ons*

**Parent:** [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md)
**Cross-Refs:** [booking-lifecycle.md](mdc:docs/business-logic/02-client/booking-lifecycle.md) (Checkout), [dynamic-dashboard-logic.md](mdc:docs/business-logic/03-merchant/dynamic-dashboard-logic.md) (Dashboard modules), [financial-oversight.md](mdc:docs/business-logic/04-admin-platform/financial-oversight.md) (Commission)
**Version:** 1.0 | **Date:** February 15, 2026

---

## Table of Contents

1. [Service Catalog Principles](#1-service-catalog-principles)
2. [Service Data Model](#2-service-data-model)
3. [Pricing Models](#3-pricing-models)
4. [Add-Ons Logic](#4-add-ons-logic)
5. [Service Variants](#5-service-variants)
6. [Deposit Calculation](#6-deposit-calculation)
7. [Client-Facing Display](#7-client-facing-display)
8. [Merchant Catalog Management](#8-merchant-catalog-management)
9. [Gherkin Scenarios](#9-gherkin-scenarios)
10. [Edge Cases](#10-edge-cases)

---

## 1. Service Catalog Principles

### Core Rules

| Rule | Detail |
|------|--------|
| **Currency** | All prices in EGP, stored as **integers** (no floats, no decimals). |
| **Per-Merchant** | Every Merchant manages their own catalog. No shared global catalog. |
| **Minimum 1 Service** | A Merchant must have at least 1 active Service to be listed in search results. |
| **Maximum** | 100 Services per Merchant (contact support for more). |
| **Visibility** | Services are public by default. Merchant can toggle individual Services as "Hidden" (not bookable but not deleted). |
| **Price Transparency** | Price MUST be displayed upfront to the Client. No "Call for price" or "Price on request" (this is a core platform value). |

---

## 2. Service Data Model

### Service Entity

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `service_id` | UUID v4 | Auto | System-generated | Unique identifier |
| `merchant_id` | UUID v4 | Auto | FK → merchants | Owning Merchant |
| `name` | String | ✅ | Min 3 chars, max 80 chars | Service name (Arabic or English) |
| `description` | String | ❌ | Max 500 chars | Short description |
| `pricing_model` | Enum | ✅ | `FIXED` / `VARIABLE` / `TIME_BASED` | See §3 |
| `base_price` | Integer (EGP) | ✅ | ≥ 1 | Base price in EGP |
| `max_price` | Integer (EGP) | Conditional | Required if `VARIABLE`. Must be > `base_price`. | Upper bound for variable pricing |
| `time_unit_minutes` | Integer | Conditional | Required if `TIME_BASED`. Min 15, max 480. | Duration of one bookable unit |
| `duration_minutes` | Integer | ✅ | Min 15, max 480 | Total Service duration |
| `setup_minutes` | Integer | ❌ | Default 0. Max 30. | Prep time before Service |
| `cleanup_minutes` | Integer | ❌ | Default 0. Max 30. | Cleanup time after Service |
| `deposit_pct` | Integer | ✅ | 0–100 | Deposit percentage (per Sector defaults, overridable) |
| `sector_id` | Enum | Auto | Inherited from Merchant | Parent Sector |
| `photos` | Array[URL] | ❌ | Max 10 photos, max 5 MB each | Service images |
| `is_active` | Boolean | Auto | Default `true` | Whether the Service is bookable |
| `add_ons` | Array[AddOn] | ❌ | Max 20 add-ons per Service | Optional extras |
| `staff_required` | Boolean | ❌ | Default `false` | If true, Client must select a staff member |
| `max_capacity` | Integer | ❌ | Default 1. For group Services. | Max Clients per Slot |
| `created_at` | Timestamp | Auto | ISO 8601 UTC | Creation date |
| `updated_at` | Timestamp | Auto | ISO 8601 UTC | Last modification |

---

## 3. Pricing Models

### 3.1 Fixed Price (سعر ثابت)

> The price is a single, non-negotiable number. Most common model.

| Field | Value |
|-------|-------|
| **`pricing_model`** | `FIXED` |
| **`base_price`** | The exact price. e.g., `100` (EGP) |
| **`max_price`** | Not used (`null`) |
| **Client sees** | "قص شعر — 100 ج.م" |
| **Deposit calc** | `deposit_pct` × `base_price` |

**Examples:**

| Service | Sector | base_price | Deposit (25%) |
|---------|--------|------------|---------------|
| قص شعر (Haircut) | Health & Beauty | 100 EGP | 25 EGP |
| تنظيف شقة (Apartment Cleaning) | Home Services | 400 EGP | 60 EGP (15%) |
| كشف أسنان (Dental Checkup) | Health & Beauty | 200 EGP | 50 EGP |

```
┌─────────────────────────────────────────┐
│  ✂️ قص شعر                              │
│                                          │
│  💰 100 ج.م                              │
│  ⏱️ 30 دقيقة                             │
│  📍 عربون: 25 ج.م                        │
│                                          │
│  [ احجز دلوقتي ]                         │
└─────────────────────────────────────────┘
```

---

### 3.2 Variable Price (سعر متغير — يبدأ من)

> The price has a minimum (base) and a maximum. The final price depends on specifics (e.g., hair length, room size, project scope). The Merchant confirms the exact price before or during the Service.

| Field | Value |
|-------|-------|
| **`pricing_model`** | `VARIABLE` |
| **`base_price`** | Starting price. e.g., `500` (EGP) |
| **`max_price`** | Maximum price. e.g., `1500` (EGP) |
| **Client sees** | "صبغة شعر — يبدأ من 500 ج.م" |
| **Deposit calc** | `deposit_pct` × `base_price` (calculated on the MINIMUM) |

**Examples:**

| Service | base_price | max_price | Client Sees |
|---------|------------|-----------|-------------|
| صبغة شعر (Hair Coloring) | 500 EGP | 1,500 EGP | "يبدأ من 500 ج.م" |
| دهان غرفة (Room Painting) | 800 EGP | 3,000 EGP | "يبدأ من 800 ج.م" |
| تنسيق حفلة (Event Planning) | 5,000 EGP | 50,000 EGP | "يبدأ من 5,000 ج.م" |

```
┌─────────────────────────────────────────┐
│  🎨 صبغة شعر                            │
│                                          │
│  💰 يبدأ من 500 ج.م                      │
│     (حسب طول الشعر ونوع الصبغة)          │
│  ⏱️ 60-120 دقيقة                         │
│  📍 عربون: 125 ج.م (على أساس السعر الأدنى) │
│                                          │
│  [ احجز دلوقتي ]                         │
└─────────────────────────────────────────┘
```

#### Variable Price — Business Rules

| Rule | Detail |
|------|--------|
| **Deposit is on base_price** | The Client pays Deposit on the minimum price. This protects the Merchant from no-shows while being fair to the Client. |
| **Final price confirmation** | Merchant confirms the actual price either: (a) via Inquiry before the Slot, or (b) at the time of Service. |
| **Final price limits** | Must be between `base_price` and `max_price`. System rejects any amount outside this range. |
| **Remaining balance** | Final price - Deposit already paid = remaining (settled directly with Merchant). |

---

### 3.3 Time-Based Price (سعر بالساعة)

> The price is per unit of time. The Client selects how many units they want. Common for pitches, coworking, studios.

| Field | Value |
|-------|-------|
| **`pricing_model`** | `TIME_BASED` |
| **`base_price`** | Price per time unit. e.g., `200` (EGP/hour) |
| **`time_unit_minutes`** | Duration of one unit. e.g., `60` (minutes) |
| **Client sees** | "ملعب بادل — 200 ج.م / ساعة" |
| **Total price** | `base_price` × number of units selected |
| **Deposit calc** | `deposit_pct` × total price |

**Examples:**

| Service | base_price | time_unit | Client Books 2 hrs | Total | Deposit (20%) |
|---------|------------|-----------|---------------------|-------|---------------|
| ملعب بادل (Padel Court) | 200 EGP/hr | 60 min | 2 units | 400 EGP | 80 EGP |
| كوورك سبيس (Coworking) | 50 EGP/hr | 60 min | 4 units | 200 EGP | 50 EGP (25%) |
| استوديو تصوير (Photo Studio) | 300 EGP/hr | 60 min | 3 units | 900 EGP | 270 EGP (30%) |

```
┌─────────────────────────────────────────┐
│  🏸 ملعب بادل                            │
│                                          │
│  💰 200 ج.م / ساعة                       │
│                                          │
│  كام ساعة؟                               │
│  [ 1 ]  [ 2 ]  [ 3 ]  [ + مخصص ]        │
│                                          │
│  الإجمالي: 400 ج.م (ساعتين)              │
│  📍 عربون: 80 ج.م                        │
│                                          │
│  [ احجز دلوقتي ]                         │
└─────────────────────────────────────────┘
```

#### Time-Based — Business Rules

| Rule | Detail |
|------|--------|
| **Minimum booking** | 1 time unit (no half-hours unless `time_unit_minutes` = 30). |
| **Maximum booking** | Configurable per Service (default: 4 units). |
| **Slot generation** | System auto-generates Slots based on `time_unit_minutes`. A 60-min unit between 10:00–22:00 = 12 Slots. |
| **Back-to-back** | Client can book consecutive units (e.g., 2 hours = 1 Booking, not 2 separate Bookings). |
| **Peak pricing** | Phase 2: Merchant can set different `base_price` for peak hours (e.g., Friday evening = 300 EGP/hr vs. weekday morning = 150 EGP/hr). |

---

## 4. Add-Ons Logic

### Definition

> **Add-Ons** are optional extras that a Client can attach to a Service during the Booking checkout. They increase the total price but are NOT standalone bookable items.

### Add-On Data Model

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `addon_id` | UUID v4 | Auto | Unique ID |
| `service_id` | UUID v4 | Auto | Parent Service |
| `name` | String | ✅ | Add-on name (e.g., "غسيل شعر") |
| `price` | Integer (EGP) | ✅ | Additional cost. Can be 0 (free add-on). |
| `is_active` | Boolean | Auto | Default `true` |

### Add-On Rules

| Rule | Detail |
|------|--------|
| **Max per Service** | 20 add-ons |
| **Multi-select** | Client can select 0, 1, or multiple add-ons per Booking. |
| **Price impact** | Total = Service price + sum of selected add-on prices. |
| **Deposit impact** | Deposit is calculated on (Service price + add-ons). |
| **Mandatory add-ons** | Not supported. All add-ons are optional. If something is required, it should be part of the base Service price. |
| **Stock tracking** | Add-ons don't have inventory (that's for Products in the Store module). |

### Add-On Examples by Sector

| Sector | Service | Add-On | Add-On Price |
|--------|---------|--------|-------------|
| Health & Beauty | قص شعر (Haircut) | غسيل شعر (Hair Wash) | 30 EGP |
| Health & Beauty | قص شعر (Haircut) | ترطيب (Conditioning) | 50 EGP |
| Sports & Fitness | ملعب كورة (Football Pitch) | إضاءة ليلية (Night Lighting) | 50 EGP |
| Sports & Fitness | ملعب كورة (Football Pitch) | كرة (Ball Rental) | 20 EGP |
| Home Services | تنظيف شقة (Cleaning) | كوي ملابس (Ironing) | 100 EGP |
| Entertainment | إسكيب روم (Escape Room) | تصوير فيديو (Video Recording) | 75 EGP |

### Client Checkout with Add-Ons

```
┌──────────────────────────────────────────────────────────────┐
│  ملخص الحجز                                                   │
│                                                               │
│  ✂️ قص شعر                                        100 ج.م    │
│                                                               │
│  إضافات:                                                     │
│  ☑️ غسيل شعر                                      +30 ج.م    │
│  ☑️ ترطيب                                         +50 ج.م    │
│  ☐  تصفيف                                          40 ج.م    │
│                                                               │
│  ─────────────────────────────────────────────────────────── │
│  الإجمالي:                                        180 ج.م    │
│  العربون (25%):                                    45 ج.م    │
│  الباقي عند الوصول:                               135 ج.م    │
│                                                               │
│  [ ادفع العربون واحجز ]                                       │
└──────────────────────────────────────────────────────────────┘
```

---

## 5. Service Variants

### When to Use Variants vs. Separate Services

| Use Case | Approach | Example |
|----------|----------|---------|
| Same Service, different durations | **Time-Based pricing** | Padel: 1hr, 2hr, 3hr |
| Same Service, different tiers | **Separate Services** | "قص شعر عادي" (100 EGP) vs. "قص VIP" (200 EGP) |
| Same Service, different staff | **Staff Selection module** | Haircut by Ahmed vs. by Omar |
| Same Service, different equipment | **Separate Services** | "ملعب نجيلة صناعي" vs. "ملعب تراب" |
| Same Service, optional extras | **Add-Ons** | Haircut + optional wash + optional conditioning |

### Variant Grouping (Phase 2)

> Phase 2 will introduce `service_group_id` to visually group related Services under one card with a variant selector (like "Size: S / M / L").

---

## 6. Deposit Calculation

### Universal Formula

```
total_price = base_price (for FIXED)
            | base_price (minimum, for VARIABLE)
            | base_price × units (for TIME_BASED)
            + sum(selected_addon_prices)

deposit_amount = CEIL(total_price × deposit_pct / 100)

remaining_balance = actual_final_price - deposit_amount
```

> **CEIL** rounding: always round UP in Booky's favor. `25% of 103 EGP = 25.75 → 26 EGP`.

### Deposit Percentage Defaults by Sector

| Sector | Default `deposit_pct` | Merchant Can Override? |
|--------|----------------------|----------------------|
| Sports & Fitness | 20% | ✅ (range: 10–50%) |
| Health & Beauty | 25% | ✅ (range: 10–50%) |
| Entertainment | 30% | ✅ (range: 20–100%) |
| Home Services | 15% | ✅ (range: 10–50%) |
| Education & Work | 25% | ✅ (range: 10–50%) |
| Events & Celebrations | 50% | ✅ (range: 30–100%) |

> **Override Rule:** Merchant can set a custom `deposit_pct` per Service within the allowed range for their Sector. Cannot go below the Sector minimum.

---

## 7. Client-Facing Display

### Search Result Card

```
┌─────────────────────────────────────────┐
│  [📷 Cover Photo]                        │
│                                          │
│  ✂️ صالون جوليا          ⭐ 4.7 (89)     │
│  📍 الدقي — 1.2 كم                       │
│                                          │
│  قص شعر          من 100 ج.م             │
│  صبغة            يبدأ من 500 ج.م         │
│  +3 خدمات تانية                          │
│                                          │
│  [ عرض البروفايل ]                        │
└─────────────────────────────────────────┘
```

### Price Display Rules

| Pricing Model | Display Format |
|---------------|---------------|
| `FIXED` | "100 ج.م" |
| `VARIABLE` | "يبدأ من 500 ج.م" |
| `TIME_BASED` | "200 ج.م / ساعة" |

---

## 8. Merchant Catalog Management

### Service Creation Wizard (Merchant Dashboard)

```
Step 1: الأساسيات (Basics)
  • Service Name (اسم الخدمة)
  • Description (وصف الخدمة) — optional
  • Photos (صور) — optional, max 10

Step 2: التسعير (Pricing)
  • Pricing Model: [ ثابت | متغير | بالساعة ]
  • Price fields (dynamic based on model)
  • Duration
  • Setup / Cleanup time (optional)

Step 3: العربون (Deposit)
  • Deposit %: slider with Sector default
  • Shows calculated example: "لو الخدمة بـ 300 ج.م → العربون هيكون 60 ج.م"

Step 4: إضافات (Add-Ons) — optional
  • [ + أضف إضافة ]
  • Name + Price per add-on

Step 5: مراجعة (Review)
  • Preview card as Client would see it
  • [ نشر الخدمة ✅ ]
```

### Catalog Actions

| Action | Effect | Impact on Existing Bookings |
|--------|--------|---------------------------|
| **Edit price** | New price for future Bookings | Existing confirmed Bookings: unchanged |
| **Edit duration** | New duration for future Slots | Existing Slots: unchanged |
| **Hide Service** | Not visible in search, not bookable | Existing Bookings: still honored |
| **Delete Service** | Permanently removed | Existing Bookings: still honored. No new Bookings. After last Booking completes: Service data archived. |
| **Add add-on** | Available for future Bookings | Existing Bookings: not affected |
| **Remove add-on** | Not available for new Bookings | Existing Bookings with this add-on: still honored |

---

## 9. Gherkin Scenarios

### Scenario 1: Fixed Price Booking

```gherkin
Feature: Service Catalog — Pricing Models

  Scenario: Client books a fixed-price haircut with add-ons
    Given a Merchant "صالون جوليا" has a Service:
      | name           | قص شعر                |
      | pricing_model  | FIXED                 |
      | base_price     | 100                   |
      | duration       | 30 min                |
      | deposit_pct    | 25                    |
      | add_ons        | غسيل شعر (30), ترطيب (50) |

    When a Client selects "قص شعر" and adds "غسيل شعر" and "ترطيب"
    Then the checkout shows:
      | line               | amount   |
      | قص شعر (Service)    | 100 EGP |
      | غسيل شعر (Add-on)   | 30 EGP  |
      | ترطيب (Add-on)      | 50 EGP  |
      | Total              | 180 EGP  |
      | Deposit (25%)      | 45 EGP   |
      | Remaining          | 135 EGP  |

    When the Client pays the 45 EGP Deposit
    Then the Booking is confirmed
    And the Deposit moves to Booky Escrow
```

### Scenario 2: Variable Price Booking

```gherkin
  Scenario: Client books a variable-price hair coloring
    Given a Merchant has a Service:
      | name           | صبغة شعر              |
      | pricing_model  | VARIABLE              |
      | base_price     | 500                   |
      | max_price      | 1500                  |
      | deposit_pct    | 25                    |

    When a Client selects "صبغة شعر"
    Then the checkout shows:
      | line               | value              |
      | Price              | يبدأ من 500 ج.م     |
      | Deposit (25% of min) | 125 EGP          |
      | Note               | السعر النهائي بيتحدد بعد التقييم مع التاجر |

    When the Client pays the 125 EGP Deposit
    Then the Booking is confirmed

    When the Merchant confirms the final price as 800 EGP at the time of Service
    And the system validates: 500 ≤ 800 ≤ 1500 ✅
    Then the remaining balance = 800 - 125 = 675 EGP
    And the Client pays 675 EGP directly to the Merchant
```

### Scenario 3: Time-Based Booking (Multi-Hour)

```gherkin
  Scenario: Client books a padel court for 2 hours
    Given a Merchant "ملاعب النصر" has a Service:
      | name              | ملعب بادل             |
      | pricing_model     | TIME_BASED            |
      | base_price        | 200                   |
      | time_unit_minutes | 60                    |
      | deposit_pct       | 20                    |
      | max_units         | 4                     |

    When a Client selects "ملعب بادل" and chooses 2 hours
    Then the checkout shows:
      | line               | amount   |
      | ملعب بادل × 2 ساعة  | 400 EGP  |
      | Deposit (20%)      | 80 EGP   |
      | Remaining          | 320 EGP  |

    When the Client pays the 80 EGP Deposit
    Then the Booking is confirmed for a 2-hour Slot
    And the calendar blocks 2 consecutive hours
```

### Scenario 4: Merchant Creates a Service with All Pricing Models

```gherkin
  Scenario: Merchant adds three Services with different pricing models
    Given a Merchant is on the Service Creation wizard

    When the Merchant creates:
      | name         | model      | base_price | max_price | time_unit | add_ons         |
      | قص شعر       | FIXED      | 100        | null      | null      | غسيل (30)       |
      | صبغة شعر     | VARIABLE   | 500        | 1500      | null      | none            |
      | استوديو      | TIME_BASED | 300        | null      | 60        | تصوير فيديو (75)|

    Then the Merchant's catalog shows 3 Services
    And each has the correct pricing display:
      | name         | display              |
      | قص شعر       | 100 ج.م              |
      | صبغة شعر     | يبدأ من 500 ج.م       |
      | استوديو      | 300 ج.م / ساعة       |
```

---

## 10. Edge Cases

| # | Edge Case | Rule |
|---|-----------|------|
| 1 | **Service price = 0 EGP** | Not allowed. Minimum `base_price` = 1 EGP. Free services are not supported (they break the Deposit model). |
| 2 | **Variable price: Merchant sets final price below base_price** | System rejects. Display: "السعر لازم يكون 500 ج.م على الأقل (السعر الأدنى المعلن)." |
| 3 | **Variable price: Merchant sets final price above max_price** | System rejects. Display: "السعر تعدى الحد الأقصى المعلن (1,500 ج.م) — عدّل السعر." |
| 4 | **Time-based: Client tries to book 0 units** | Block. Minimum is 1 unit. |
| 5 | **Time-based: Client tries to book 5 hours (max is 4)** | Block. Display: "أقصى مدة حجز هي X ساعات — تقدر تحجز كذا حجز منفصل." |
| 6 | **Add-on price > Service price** | Allowed (e.g., basic Service = 50 EGP, premium add-on = 200 EGP). No restriction. |
| 7 | **Merchant edits price of a Service with active Bookings** | New price applies to FUTURE Bookings only. Active Bookings retain original price. |
| 8 | **Deposit percentage set to 0%** | Allowed only if Sector minimum is 0% (none currently). If Merchant tries to set below Sector minimum: "الحد الأدنى للعربون في القطاع ده هو X%." |
| 9 | **Service with 20 add-ons all selected** | Total = Service + 20 add-ons. Deposit calculated on grand total. No limit on total price. |
| 10 | **Merchant deletes a Service while a Client is on the checkout screen** | Client sees: "الخدمة دي مش متاحة حاليًا — اختار خدمة تانية." Checkout aborted. No charge. |
| 11 | **Time-based Service spanning midnight** | Allowed if Merchant's working hours allow it. Single Booking. e.g., 23:00–01:00 = 2 hours. |

---

> **📌 Source of Truth:** This document aligns with [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md) §4.1 (Currency: EGP integers), §5 (Sectors), §10 (Commission), §11 (Deposit System).
>
> *Booky Center: بضغطة واحدة.. ميعادك في جيبك* ✨


