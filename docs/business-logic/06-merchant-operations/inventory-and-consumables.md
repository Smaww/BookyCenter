# 📂 06-Merchant Operations: Inventory & Consumables

## *Stock Tracking, Auto-Deduction & Low-Stock Alerts*

**Parent:** [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md)
**Cross-Refs:** [service-catalog-architecture.md](mdc:docs/business-logic/05-core-systems/service-catalog-architecture.md) (Service ↔ Product linkage), [pos-and-walk-in-logic.md](mdc:docs/business-logic/06-merchant-operations/pos-and-walk-in-logic.md) (POS Checkout), [notification-matrix.md](mdc:docs/business-logic/05-core-systems/notification-matrix.md) (Alerts)
**Version:** 1.0 | **Date:** February 15, 2026

---

## Table of Contents

1. [Why Inventory Matters for a Booking App](#1-why-inventory-matters-for-a-booking-app)
2. [Inventory Data Model](#2-inventory-data-model)
3. [Stock Tracking & Auto-Deduction](#3-stock-tracking--auto-deduction)
4. [Service–Product Linkage](#4-serviceproduct-linkage)
5. [Low-Stock Alerts & Notifications](#5-low-stock-alerts--notifications)
6. [Manual Stock Adjustments](#6-manual-stock-adjustments)
7. [Inventory Reports & Analytics](#7-inventory-reports--analytics)
8. [Merchant Dashboard: Inventory Module](#8-merchant-dashboard-inventory-module)
9. [Gherkin Scenarios](#9-gherkin-scenarios)
10. [Edge Cases](#10-edge-cases)

---

## 1. Why Inventory Matters for a Booking App

### The Problem

> A salon Merchant offers "Keratin Treatment" on Booky. 10 Clients book it this week. But the Merchant only has enough Keratin for 7 treatments. Clients #8, #9, #10 arrive — no product. Trust destroyed.

### The Solution

Booky's Inventory module connects **Products (consumables)** to **Services**. When a Booking completes, the system auto-deducts the required product quantities. When stock runs low, the Merchant is alerted. If stock hits zero, the Service can be auto-paused.

### Who Needs This?

| Sector | Inventory Need | Example Products |
|--------|---------------|-----------------|
| **Health & Beauty** | 🔴 Critical | Keratin bottles, hair dye, wax strips, nail polish, facial masks |
| **Sports & Fitness** | 🟡 Moderate | Shuttle cocks, grip tape, towels, water bottles |
| **Home Services** | 🟡 Moderate | Cleaning supplies, spare parts, paint cans |
| **Entertainment** | 🟢 Low | Game tokens, food/drink (if applicable) |
| **Education** | 🟢 Low | Stationery, printed materials |
| **Events** | 🟡 Moderate | Decorations, catering supplies, rental items |

---

## 2. Inventory Data Model

### Product (Consumable) Entity

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `product_id` | UUID v4 | Auto | System-generated | Unique identifier |
| `merchant_id` | UUID v4 | Auto | FK → Merchants | Owning Merchant |
| `name` | String | ✅ | Min 2 chars, max 80 chars | Product name |
| `name_ar` | String | ✅ | Arabic | Arabic display name |
| `sku` | String | ❌ | Unique per Merchant | Stock Keeping Unit (Merchant's internal code) |
| `unit` | Enum | ✅ | `PIECE` / `ML` / `GRAM` / `LITER` / `KG` / `CM` / `METER` / `SHEET` | Measurement unit |
| `current_stock` | Decimal | ✅ | ≥ 0 | Current quantity in stock |
| `low_stock_threshold` | Decimal | ✅ | ≥ 0 | Alert triggers when stock falls to this level |
| `critical_stock_threshold` | Decimal | ❌ | Default: 0. Must be ≤ `low_stock_threshold`. | Auto-pause Service when stock hits this level |
| `cost_per_unit` | Integer (EGP) | ❌ | ≥ 0 | Purchase cost (for profit margin analytics) |
| `supplier_name` | String | ❌ | Max 100 chars | Supplier reference |
| `supplier_phone` | String | ❌ | E.164 | Quick re-order |
| `photo` | URL | ❌ | JPG/PNG, max 2 MB | Product photo |
| `is_active` | Boolean | Auto | Default `true` | Whether the product is tracked |
| `created_at` | Timestamp | Auto | ISO 8601 UTC | Creation date |
| `updated_at` | Timestamp | Auto | ISO 8601 UTC | Last modification |

### Stock Ledger (Movement History)

| Field | Type | Description |
|-------|------|-------------|
| `ledger_id` | UUID v4 | Unique entry ID |
| `product_id` | UUID v4 | FK → Products |
| `movement_type` | Enum | `SERVICE_DEDUCTION` / `MANUAL_ADD` / `MANUAL_REMOVE` / `ADJUSTMENT` / `RETURN` |
| `quantity` | Decimal | Amount moved (negative for deductions, positive for additions) |
| `reference_id` | UUID v4 | FK → Booking ID or Adjustment ID |
| `reference_type` | Enum | `BOOKING` / `WALK_IN` / `MANUAL` |
| `staff_id` | UUID v4 | Who performed the Service (for deductions) |
| `notes` | String | Optional note (e.g., "Expired product discarded") |
| `balance_after` | Decimal | Stock level after this movement |
| `created_at` | Timestamp | When this movement occurred |
| `created_by` | UUID v4 | Admin/Staff who triggered the action |

---

## 3. Stock Tracking & Auto-Deduction

### 3.1 How Auto-Deduction Works

```
Booking Completed (QR Handshake / Walk-In Checkout)
         │
         ▼
System looks up: Service → linked Products (see §4)
         │
         ▼
For each linked Product:
  ├── Deduct: quantity_per_service × 1
  ├── Create ledger entry (SERVICE_DEDUCTION)
  ├── Update current_stock
  │
  └── Check thresholds:
       ├── current_stock ≤ low_stock_threshold?
       │    └── YES → Trigger Low-Stock Alert
       │
       └── current_stock ≤ critical_stock_threshold?
            └── YES → Auto-pause the linked Service(s)
                      + Critical Stock Alert
```

### 3.2 When Does Deduction Happen?

| Event | Deduction Triggered? | Reason |
|-------|---------------------|--------|
| **Online Booking — QR Handshake** | ✅ | Service confirmed as delivered |
| **Walk-In — POS Checkout** | ✅ | Service confirmed as completed |
| **Phone Booking — POS Checkout** | ✅ | Service confirmed as completed |
| **Online Booking — Confirmed (pre-arrival)** | ❌ | Product not used yet. Client may cancel. |
| **Cancelled Booking** | ❌ | No product consumed. |
| **No-Show** | ❌ | No product consumed. (But see edge case #6.) |

> **Critical Rule:** Stock is deducted ONLY at **Service completion** (Handshake or Checkout), NOT at Booking confirmation. This prevents phantom deductions from cancelled/no-show Bookings.

### 3.3 Deduction Accuracy

| Accuracy Level | Description | Example |
|---------------|-------------|---------|
| **Exact** | Fixed quantity per Service. Always the same. | "قص شعر" uses 1× blade + 1× cape (disposable) |
| **Estimated** | Average quantity. May vary. Merchant adjusts manually if needed. | "صبغة شعر" uses ~100ml dye (may be 80ml for short hair, 150ml for long) |
| **None** | Service has no linked products. | "ملعب كورة" — no consumables. |

---

## 4. Service–Product Linkage

### 4.1 The Linkage Model

A many-to-many relationship between Services and Products. One Service may consume multiple Products. One Product may be used by multiple Services.

| Field | Type | Description |
|-------|------|-------------|
| `link_id` | UUID v4 | Unique ID |
| `service_id` | UUID v4 | FK → Services |
| `product_id` | UUID v4 | FK → Products |
| `quantity_per_service` | Decimal | Amount consumed per Service execution |
| `is_mandatory` | Boolean | If `true`: Service is auto-paused when this Product hits critical stock |

### 4.2 Linkage Examples

| Service | Linked Product | Qty/Service | Unit | Mandatory? |
|---------|---------------|-------------|------|-----------|
| قص شعر (Haircut) | شفرات حلاقة (Razor Blades) | 1 | PIECE | ✅ |
| قص شعر (Haircut) | مناديل (Tissue Paper) | 5 | SHEET | ❌ |
| صبغة شعر (Hair Coloring) | صبغة (Hair Dye) | 100 | ML | ✅ |
| صبغة شعر (Hair Coloring) | أوكسجين (Developer) | 100 | ML | ✅ |
| صبغة شعر (Hair Coloring) | قفازات (Gloves) | 1 | PIECE | ❌ |
| كيراتين (Keratin Treatment) | كيراتين (Keratin Liquid) | 50 | ML | ✅ |
| كيراتين (Keratin Treatment) | مشط حراري (Heat Comb) | 0 | — | ❌ (reusable) |
| تنظيف شقة (Apartment Cleaning) | مطهر (Disinfectant) | 200 | ML | ✅ |
| تنظيف شقة (Apartment Cleaning) | قفازات (Gloves) | 2 | PIECE | ❌ |

### 4.3 Configuration (Merchant Dashboard)

```
┌──────────────────────────────────────────────────────────────────┐
│  🔗 ربط المنتجات بالخدمة — صبغة شعر                             │
│                                                                   │
│  المنتجات المرتبطة:                                              │
│                                                                   │
│  ┌────────────────────┬──────────┬───────┬──────────────┐        │
│  │  المنتج             │  الكمية   │ الوحدة │  إلزامي؟     │        │
│  ├────────────────────┼──────────┼───────┼──────────────┤        │
│  │  صبغة (Hair Dye)    │  100     │  مل   │  ✅ نعم      │        │
│  │  أوكسجين (Developer) │  100     │  مل   │  ✅ نعم      │        │
│  │  قفازات (Gloves)     │  1       │  قطعة │  ❌ لا       │        │
│  └────────────────────┴──────────┴───────┴──────────────┘        │
│                                                                   │
│  [ + أضف منتج ]                                                   │
│                                                                   │
│  💡 لما العميل يحجز صبغة شعر ويتم الخدمة، هيتخصم تلقائيًا:      │
│     100 مل صبغة + 100 مل أوكسجين + 1 قفاز                       │
│                                                                   │
│  [ حفظ ✅ ]                                                        │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Low-Stock Alerts & Notifications

### 5.1 Alert Levels

| Level | Trigger | Visual | Notification |
|-------|---------|--------|-------------|
| **🟢 Normal** | `current_stock > low_stock_threshold` | Green badge | None |
| **🟡 Low Stock** | `current_stock ≤ low_stock_threshold` AND `> critical_stock_threshold` | Yellow badge + banner | App Push + In-App to Merchant |
| **🔴 Critical Stock** | `current_stock ≤ critical_stock_threshold` | Red badge + banner | App Push + WhatsApp + In-App to Merchant |
| **⬛ Out of Stock** | `current_stock = 0` | Black badge + Service auto-paused | App Push + WhatsApp + SMS to Merchant |

### 5.2 Alert Notification Content

| Alert | Push Title | Push Body |
|-------|-----------|-----------|
| 🟡 Low Stock | "المخزون بيقل ⚠️" | "[Product] وصل لـ [X] [unit] — اطلب كمية جديدة." |
| 🔴 Critical | "المخزون حرج 🔴" | "[Product] فاضل [X] [unit] بس — الخدمات المرتبطة هتتوقف قريب!" |
| ⬛ Out of Stock | "منتج خلص — خدمة متوقفة ⛔" | "[Product] خلص! الخدمة [Service] اتوقفت تلقائيًا لحد ما تضيف مخزون." |
| 🟢 Restocked | "المخزون رجع ✅" | "[Product] اتملا تاني — الخدمة [Service] رجعت متاحة." |

### 5.3 Auto-Pause Logic

```
IF product.current_stock ≤ product.critical_stock_threshold
AND link.is_mandatory = true
THEN:
  1. Find all Services linked to this Product (where is_mandatory = true)
  2. Set service.is_active = false (for online Bookings only)
  3. Show banner on Service: "الخدمة دي متوقفة م؟قتًا — المخزون المطلوب مش كافي."
  4. Existing confirmed Bookings: NOT cancelled. Merchant must fulfill or cancel manually.
  5. When stock is replenished above critical threshold:
     → Auto-reactivate Service
     → Notify Merchant: "الخدمة [X] رجعت متاحة تلقائيًا ✅"
```

### 5.4 Smart Reorder Suggestions (Phase 2)

| Feature | Logic |
|---------|-------|
| **Predicted Stockout Date** | Based on avg deduction rate over last 30 days. "الصبغة هتخلص في ~5 أيام." |
| **Reorder Reminder** | Auto-trigger: "اطلب [Product] من [Supplier] — آخر طلب كان [Date]." |
| **Quick Reorder** | One-tap supplier call/WhatsApp with pre-filled message: "محتاج [X] عبوة [Product]." |

---

## 6. Manual Stock Adjustments

### 6.1 When Manual Adjustment is Needed

| Scenario | Adjustment Type | Example |
|----------|----------------|---------|
| **New shipment arrived** | `MANUAL_ADD` | +500ml Keratin received from supplier |
| **Product expired/damaged** | `MANUAL_REMOVE` | -200ml Dye expired, discarded |
| **Physical count mismatch** | `ADJUSTMENT` | System says 300ml, actual is 250ml → adjust -50ml |
| **Client return** (rare) | `RETURN` | Unused product returned → +1 piece |
| **Staff used product outside Booky** | `MANUAL_REMOVE` | Staff used Dye for personal use → -50ml (tracked) |

### 6.2 Adjustment Flow

```
┌──────────────────────────────────────────────────────────────────┐
│  📦 تعديل المخزون — صبغة (Hair Dye)                             │
│                                                                   │
│  الرصيد الحالي:  300 مل                                          │
│                                                                   │
│  نوع التعديل:                                                    │
│  ○ إضافة (وصول بضاعة جديدة)                                      │
│  ● خصم (تالف / مستخدم / فاقد)                                    │
│  ○ جرد (تعديل للرصيد الفعلي)                                     │
│                                                                   │
│  الكمية:  [ 50 ] مل                                              │
│                                                                   │
│  السبب:  [ تاريخ صلاحية انتهى ]                                   │
│                                                                   │
│  الرصيد بعد التعديل:  250 مل                                     │
│                                                                   │
│  [ تأكيد التعديل ✅ ]                                              │
└──────────────────────────────────────────────────────────────────┘
```

### 6.3 Adjustment Rules

| Rule | Detail |
|------|--------|
| **Reason required** | Every manual adjustment must have a reason (free text, min 5 chars). |
| **Audit trail** | All adjustments logged in the Stock Ledger with `created_by` (Merchant or Staff). |
| **Cannot go negative** | `current_stock` can never be < 0. If adjustment would make it negative: "الكمية أكتر من الرصيد المتاح." |
| **Undo window** | Merchant can undo a manual adjustment within 5 minutes. After that: create a reverse entry. |

---

## 7. Inventory Reports & Analytics

### Available Reports

| Report | Frequency | Contents |
|--------|-----------|----------|
| **Stock Status** | Real-time | Current stock per product, alert level, linked Services. |
| **Movement History** | On-demand | Full ledger for a product over a date range. |
| **Consumption Report** | Weekly/Monthly | Deductions per product per Service. Top consumers. |
| **Cost of Goods Sold (COGS)** | Monthly | Total product cost consumed (if `cost_per_unit` is set). |
| **Wastage Report** | Monthly | Manual removals (expired, damaged). Helps optimize purchasing. |
| **Stockout History** | Monthly | Dates and durations when products hit zero. Impact: Services paused, Bookings potentially lost. |

### Analytics Dashboard Widget

```
┌──────────────────────────────────────────────────────────────────┐
│  📦 ملخص المخزون                                                 │
│                                                                   │
│  إجمالي المنتجات:  12                                            │
│  🟢 طبيعي: 8  |  🟡 منخفض: 3  |  🔴 حرج: 1                      │
│                                                                   │
│  ── المنتجات اللي محتاجة انتباه ──────────────────────────────── │
│  🔴 كيراتين        | 40 مل / 200 مل (حرج!)    | [ أضف مخزون ]    │
│  🟡 صبغة بني       | 150 مل / 500 مل          | [ أضف مخزون ]    │
│  🟡 قفازات         | 8 قطع / 20 قطعة           | [ أضف مخزون ]    │
│                                                                   │
│  ── أكتر المنتجات استهلاكًا (الشهر) ─────────────────────────── │
│  1. صبغة (Hair Dye) — 2,400 مل                                  │
│  2. أوكسجين (Developer) — 2,400 مل                               │
│  3. شفرات (Razor Blades) — 180 قطعة                              │
│                                                                   │
│  [ تقرير مفصل 📊 ]                                                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 8. Merchant Dashboard: Inventory Module

### Product List

```
┌──────────────────────────────────────────────────────────────────┐
│  📦 المخزون (Inventory)                           [ + إضافة ]    │
│                                                                   │
│  🔍 [ بحث عن منتج... ]                                           │
│                                                                   │
│  ┌──────────┬──────────┬──────────┬──────────┬──────┬─────────┐ │
│  │  المنتج   │  الرصيد   │ الحد الأدنى│  الحالة   │ خدمات│ إجراء  │ │
│  ├──────────┼──────────┼──────────┼──────────┼──────┼─────────┤ │
│  │  صبغة بني │ 150 مل   │  200 مل  │  🟡 منخفض │  2  │ ✏️ 📦  │ │
│  │  كيراتين  │ 40 مل    │  100 مل  │  🔴 حرج   │  1  │ ✏️ 📦  │ │
│  │  شفرات    │ 45 قطعة  │  20 قطعة │  🟢 طبيعي │  1  │ ✏️ 📦  │ │
│  │  قفازات   │ 8 قطع    │  20 قطعة │  🟡 منخفض │  3  │ ✏️ 📦  │ │
│  └──────────┴──────────┴──────────┴──────────┴──────┴─────────┘ │
│                                                                   │
│  ✏️ = Edit  📦 = Quick Stock Adjustment                           │
└──────────────────────────────────────────────────────────────────┘
```

### Product Creation Wizard

```
Step 1: معلومات المنتج (Product Info)
  • Name (Arabic + English)
  • Unit: [ قطعة | مل | جرام | لتر | كجم | سم | متر | ورقة ]
  • Photo (optional)
  • SKU (optional)

Step 2: المخزون (Stock Levels)
  • Current Stock: [ 500 ] مل
  • Low Stock Alert at: [ 200 ] مل
  • Critical (Auto-Pause) at: [ 50 ] مل
  • Cost per Unit: [ 2 ] ج.م (optional, for COGS)

Step 3: المورد (Supplier) — optional
  • Supplier Name
  • Supplier Phone (Quick Re-order)

Step 4: ربط بخدمات (Link to Services)
  • Select Services that consume this product
  • Set quantity per Service execution

[ إنشاء ✅ ]
```

---

## 9. Gherkin Scenarios

### Scenario 1: Auto-Deduction on Booking Completion

```gherkin
Feature: Inventory Auto-Deduction

  Scenario: Product stock decreases when a Booking completes
    Given Merchant "صالون جوليا" has Product:
      | name         | صبغة بني (Brown Dye) |
      | unit         | ML                   |
      | current_stock | 500                 |
      | low_stock     | 200                 |
      | critical      | 50                  |
    And Service "صبغة شعر" is linked to:
      | product       | quantity_per_service | mandatory |
      | صبغة بني       | 100 ML              | ✅        |
      | أوكسجين        | 100 ML              | ✅        |
      | قفازات         | 1 PIECE             | ❌        |

    When a Client completes Booking BK-260215-0030 (صبغة شعر)
    And the QR Handshake is scanned successfully
    Then the system auto-deducts:
      | product   | before | deducted | after |
      | صبغة بني   | 500    | -100     | 400   |
      | أوكسجين    | 800    | -100     | 700   |
      | قفازات     | 25     | -1       | 24    |
    And a Stock Ledger entry is created for each deduction:
      | movement_type      | SERVICE_DEDUCTION    |
      | reference_id       | BK-260215-0030       |
      | reference_type     | BOOKING              |
    And stock levels are 🟢 Normal (all above low_stock_threshold)
```

### Scenario 2: Low-Stock Alert Triggered

```gherkin
  Scenario: Stock falls below low threshold — alert sent
    Given Product "صبغة بني" has current_stock: 250 ML
    And low_stock_threshold: 200 ML

    When a Booking completes and deducts 100 ML
    Then current_stock becomes 150 ML
    And 150 ≤ 200 (low_stock_threshold) → 🟡 Low Stock

    Then the Merchant receives:
      | channel   | message                                      |
      | App Push  | "المخزون بيقل ⚠️ — صبغة بني وصل لـ 150 مل"  |
      | In-App    | Yellow banner on Inventory module             |
    And the product's badge changes to 🟡
```

### Scenario 3: Critical Stock — Service Auto-Paused

```gherkin
  Scenario: Critical stock triggers Service auto-pause
    Given Product "كيراتين" has:
      | current_stock          | 60 ML  |
      | critical_stock_threshold | 50 ML |
    And "كيراتين" is linked to Service "علاج كيراتين" as mandatory (50 ML per Service)

    When a Booking completes and deducts 50 ML of كيراتين
    Then current_stock becomes 10 ML
    And 10 ≤ 50 (critical_stock_threshold) → 🔴 Critical

    Then the system:
      1. Sets Service "علاج كيراتين" → is_active = false
      2. Sends Merchant notification:
         "منتج خلص — خدمة متوقفة ⛔ — كيراتين خلص! الخدمة علاج كيراتين اتوقفت."
      3. Online Clients no longer see "علاج كيراتين" as bookable
      4. Existing confirmed Bookings are NOT auto-cancelled

    When the Merchant adds 200 ML of كيراتين (MANUAL_ADD)
    Then current_stock becomes 210 ML
    And 210 > 50 → Service auto-reactivated
    And Merchant receives: "المخزون رجع ✅ — الخدمة علاج كيراتين رجعت متاحة."
```

### Scenario 4: Walk-In Deduction via POS

```gherkin
  Scenario: Walk-in checkout triggers inventory deduction
    Given a Walk-In entry "WK-260215-0012" for Service "قص شعر"
    And "قص شعر" consumes: 1× شفرة (Razor Blade)
    And شفرة current_stock: 45

    When the Merchant completes POS Checkout for WK-260215-0012
    Then شفرة stock is deducted by 1
    And current_stock becomes 44
    And a ledger entry is created:
      | movement_type  | SERVICE_DEDUCTION |
      | reference_id   | WK-260215-0012    |
      | reference_type | WALK_IN           |
```

### Scenario 5: Cancelled Booking — No Deduction

```gherkin
  Scenario: Cancelled Booking does NOT deduct inventory
    Given a Client has Booking BK-260216-0040 for "صبغة شعر"
    And Product "صبغة بني" current_stock: 400 ML

    When the Client cancels the Booking (> 24 hours before Slot)
    Then NO stock deduction occurs
    And "صبغة بني" remains at 400 ML
    And no ledger entry is created for this Booking
```

---

## 10. Edge Cases

| # | Edge Case | Rule |
|---|-----------|------|
| 1 | **Service uses a product not yet in inventory** | Service linkage UI only shows products already created. Merchant must create the product first, then link it. |
| 2 | **Auto-deduction would make stock negative** | Deduct to 0 (not below). Log a discrepancy alert: "المخزون الفعلي أقل من المتوقع — تأكد بالجرد." Merchant must reconcile manually. |
| 3 | **Staff uses more product than the linked quantity** | Default deduction is the configured `quantity_per_service`. Merchant can manually adjust post-Service if more was used. Phase 2: Staff can report actual usage at checkout. |
| 4 | **Product used across multiple Merchants (franchise)** | Not supported in Phase 1. Each Merchant has isolated inventory. Phase 2: franchise/multi-location shared stock pool. |
| 5 | **Merchant doesn't want to track inventory** | Inventory module is entirely optional. If no products are created, no deductions occur. Service is never auto-paused for stock reasons. |
| 6 | **No-Show: should we deduct if Merchant prepped the product?** | Default: NO deduction on no-show. Exception: Merchant can manually deduct ("العميل مجاش بس أنا جهزت الصبغة خلاص"). Manual adjustment with reason: "Client no-show — product prepped." |
| 7 | **Product expires but still has stock** | Merchant manually removes expired stock (`MANUAL_REMOVE` with reason: "انتهت الصلاحية"). Phase 2: expiry date tracking with auto-alert. |
| 8 | **Multiple Services linked to the same product deplete it simultaneously** | Deductions are sequential (race condition handled via DB transactions). If two concurrent checkouts would deplete: first one succeeds, second may trigger critical alert. |
| 9 | **Merchant wants to sell products (retail) not just use as consumables** | Phase 2: "Product Sales" module — separate from consumables. POS allows selling a product directly (not linked to a Service). |
| 10 | **Variable-price Service: does product quantity vary too?** | Default: `quantity_per_service` is fixed regardless of final price. Merchant can manually adjust. Phase 2: quantity tiers (short hair = 80ml, long hair = 150ml). |

---

## Feature Availability by Subscription Tier

| Feature | Starter (99 EGP) | Growth (249 EGP) | Pro (499 EGP) |
|---------|------------------|-------------------|----------------|
| Product Creation | ✅ (10 max) | ✅ (50 max) | ✅ (Unlimited) |
| Service–Product Linkage | ✅ | ✅ | ✅ |
| Auto-Deduction | ✅ | ✅ | ✅ |
| Low-Stock Alerts | ✅ (In-App only) | ✅ (Push + In-App) | ✅ (Push + WhatsApp + In-App) |
| Auto-Pause on Critical | ❌ | ✅ | ✅ |
| COGS / Consumption Reports | ❌ | ✅ | ✅ (Advanced) |
| Supplier Quick Reorder | ❌ | ❌ | ✅ |
| Stock Movement Audit Trail | ❌ | ✅ (30 days) | ✅ (Unlimited) |

---

> **📌 Source of Truth:** This module extends the Service Catalog defined in [service-catalog-architecture.md](mdc:docs/business-logic/05-core-systems/service-catalog-architecture.md) by adding a consumables layer. Deductions integrate with the POS flow in [pos-and-walk-in-logic.md](mdc:docs/business-logic/06-merchant-operations/pos-and-walk-in-logic.md) and alerts follow [notification-matrix.md](mdc:docs/business-logic/05-core-systems/notification-matrix.md) patterns.
>
> *Booky Center: بضغطة واحدة.. ميعادك في جيبك* ✨

