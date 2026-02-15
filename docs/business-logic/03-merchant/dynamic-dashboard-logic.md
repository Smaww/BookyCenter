# 📂 03-Merchant: Dynamic Dashboard Logic

## *The Core Innovation — A Dashboard That Adapts to YOUR Business*

**Parent:** [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md)
**Depends On:** [smart-onboarding-flow.md](mdc:docs/business-logic/03-merchant/smart-onboarding-flow.md)
**Version:** 1.0 | **Date:** February 15, 2026
**Persona:** The Merchant (التاجر) — post-onboarding, daily dashboard usage.

---

## Table of Contents

1. [The Modular Dashboard Concept](#1-the-modular-dashboard-concept)
2. [Base Modules (Always Active)](#2-base-modules-always-active)
3. [Variable Modules (Conditional Logic)](#3-variable-modules-conditional-logic)
4. [Module Activation Matrix](#4-module-activation-matrix)
5. [Module Descriptions](#5-module-descriptions)
6. [Dashboard Layout & Navigation](#6-dashboard-layout--navigation)
7. [Subscription Tier Gating](#7-subscription-tier-gating)
8. [Gherkin Scenarios](#8-gherkin-scenarios)
9. [Edge Cases](#9-edge-cases)
10. [Merchant Subscription Tiers — Philosophy & Pricing](#10-merchant-subscription-tiers--philosophy--pricing)
11. [Tier Feature Matrix](#11-tier-feature-matrix)
12. [Billing & Payment Logic](#12-billing--payment-logic)
13. [Upgrade / Downgrade Rules](#13-upgrade--downgrade-rules)
14. [ROI Calculator (Merchant-Facing)](#14-roi-calculator-merchant-facing)
15. [Churn Prevention & Retention](#15-churn-prevention--retention)
16. [Subscription Data Model & API](#16-subscription-data-model--api)

---

## 1. The Modular Dashboard Concept

### The Problem with One-Size-Fits-All

> Traditional SaaS dashboards show every feature to every user. A barber sees "Court Management." A football pitch owner sees "Prescription History." This creates confusion, cognitive overload, and a feeling of paying for features you don't need.

### Booky's Solution: The Adaptive Dashboard

> **The Merchant Dashboard (لوحة تحكم التاجر) dynamically assembles itself based on the Merchant's Business Type selected during [Stage 2 of the Smart Onboarding Wizard](mdc:docs/business-logic/03-merchant/smart-onboarding-flow.md), and the answers to the 4 intelligence questions in Stage 3.**

```
┌──────────────────────────────────────────────────────────────────┐
│                     MODULAR DASHBOARD ENGINE                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Onboarding Data                                                │
│   ┌──────────────────────┐                                       │
│   │ business_type_id     │                                       │
│   │ sector_id            │──────┐                                │
│   │ has_branches         │      │                                │
│   │ has_e_payments       │      ▼                                │
│   │ target_audience      │   MODULE                              │
│   │ has_products         │   RESOLVER                            │
│   └──────────────────────┘   (Server-side)                       │
│                                  │                                │
│                                  ▼                                │
│                          ┌───────────────┐                       │
│                          │  BASE MODULES │ (Always ON)           │
│                          │  + VARIABLE   │ (Conditionally ON)    │
│                          │    MODULES    │                       │
│                          └───────┬───────┘                       │
│                                  │                                │
│                                  ▼                                │
│                          RENDERED DASHBOARD                      │
│                          (Unique per Merchant)                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Key Principle

> **A Merchant ONLY sees the modules relevant to their business.** Nothing more, nothing less. The dashboard feels custom-built — because it is.

---

## 2. Base Modules (Always Active)

These modules are enabled for **every** Merchant, regardless of Business Type, Sector, or onboarding answers.

| # | Module | Arabic Name | Icon | Description |
|---|--------|-------------|------|-------------|
| 1 | **Calendar** | التقويم | 📅 | Manage Slots, view upcoming Bookings, block time. The core scheduling engine. |
| 2 | **Wallet** | المحفظة | 💰 | View earnings (Pending / Available / Frozen / Withdrawn), request payouts, download statements. See [wallet-and-payouts.md](mdc:docs/business-logic/03-merchant/wallet-and-payouts.md). |
| 3 | **CRM (Clients)** | العملاء | 👥 | Client database: Booking history per Client, contact info, notes, VIP tags. See who rebooks and who doesn't. |
| 4 | **Settings** | الإعدادات | ⚙️ | Profile info, working hours, payout method, notification preferences, subscription management. |

### Base Module Details

#### 📅 Calendar

| Feature | Description |
|---------|-------------|
| **Day / Week / Month View** | Toggle between views. Day is default on mobile. |
| **Slot Management** | Create, edit, delete available Slots. Bulk-create recurring Slots. |
| **Booking Overlay** | Confirmed Bookings appear as colored blocks on the calendar. |
| **Block Time** | Mark time as unavailable (e.g., lunch break, maintenance). |
| **Per-Branch** | If multi-branch: calendar switcher at the top to toggle between branches. |
| **Today Widget** | Top card showing: today's Booking count, next upcoming, and total revenue today. |

#### 💰 Wallet

| Feature | Description |
|---------|-------------|
| **Balance Card** | Available / Pending / Frozen. Large, prominent. |
| **Withdraw CTA** | "اسحب فلوسك" button (min 500 EGP). |
| **Transaction History** | Chronological list with status icons (✅ / ⏳ / 🔒 / 💸). |
| **Monthly Statement** | Auto-generated PDF. Downloadable. |

#### 👥 CRM (Clients)

| Feature | Description |
|---------|-------------|
| **Client List** | All Clients who have booked at this Merchant. Sortable by recency, frequency, total spent. |
| **Client Profile** | Tap a Client → see all their Bookings at your business, total spend, last visit, notes. |
| **Tags** | Merchant can tag Clients: "VIP", "مشكلة" (Problem), "عميل دائم" (Regular). |
| **Notes** | Private notes per Client (not visible to the Client). |
| **Export** | Download Client list as CSV. |

#### ⚙️ Settings

| Feature | Description |
|---------|-------------|
| **Profile** | Edit business name, description, photos, address, contact info. |
| **Working Hours** | Per-day schedule (Sat–Fri). Per-branch if multi-location. |
| **Payout Method** | Change Vodafone Cash / InstaPay / Bank. |
| **Notifications** | Toggle push, SMS, email for: new Booking, cancellation, payout, review. |
| **Subscription** | View current Tier, upgrade, billing history. |
| **Danger Zone** | Pause account (temp), delete account (permanent, 30-day grace). |

---

## 3. Variable Modules (Conditional Logic)

These modules are activated based on the Merchant's **Business Type** (from onboarding Stage 2) and **Stage 3 answers**. The resolution logic is deterministic — no AI, no guessing.

### 3.1 Business Type → Module Mapping

#### IF `Business Type ∈ Medical / Clinic / Dental / Derma / Mental Health`

| Module | Arabic Name | Description |
|--------|-------------|-------------|
| **Patient Records** | سجلات المرضى | Structured per-Client medical history: visit dates, diagnoses (free text), treatment notes, allergies. HIPAA-inspired data isolation — encrypted at rest. |
| **Prescription History** | تاريخ الوصفات | Log of prescriptions issued per Client visit. Linked to Booking ID. Printable. |

> **Privacy Rule:** Patient Records are encrypted and accessible ONLY to the Merchant who created them. Booky Admin cannot view medical data. Data deletion on Merchant account closure is immediate and irreversible.

---

#### IF `Business Type ∈ Football Pitch / Padel Court / Tennis / Sports Venue`

| Module | Arabic Name | Description |
|--------|-------------|-------------|
| **Court Management** | إدارة الملاعب | Per-court/pitch availability. Name each court (e.g., "ملعب 1 — نجيلة صناعي", "ملعب 2 — تراب"). Individual pricing per court. Maintenance status toggling. |
| **Team Booking** | حجز فرق | Support for group Bookings: one Client books for a full team (5v5, 7v7, etc.). Shared QR code. Single Deposit for the group. Revenue split logic (per-player optional). |

> **Court Management UX:** Each court has its own calendar row. The Merchant sees a horizontal timeline per court — drag to create Slots, tap to view Bookings.

---

#### IF `Business Type ∈ Barber / Salon / Spa / Beauty`

| Module | Arabic Name | Description |
|--------|-------------|-------------|
| **Staff Selection** | اختيار الموظف | Client picks a specific staff member when booking (e.g., "الحلاق أحمد", "خبيرة التجميل سارة"). Per-staff calendar, pricing, and ratings. |
| **Service Duration** | مدة الخدمة | Precise time management per Service: setup time, execution time, cleanup time. Auto-calculates Slot duration. Prevents back-to-back overlap. |

> **Staff Selection UX:** Merchant adds staff members (name, photo, specialties). Each staff member gets their own Slot calendar. Clients see staff profiles with individual ratings during booking.

---

### 3.2 Onboarding Answer → Module Mapping

#### IF `Q1 (Branches) == Yes`

| Module | Arabic Name | Description |
|--------|-------------|-------------|
| **Branch Management** | إدارة الفروع | Switch between branches. Per-branch calendar, staff, and Services. Consolidated wallet (all branches → one wallet). Consolidated CRM. Branch-level analytics. |

> **Unified Management Principle:** One login, one wallet, one CRM — multiple locations. The Merchant never needs separate accounts.

---

#### IF `Q2 (E-Payments) == Yes`

| Module | Arabic Name | Description |
|--------|-------------|-------------|
| **Payment Gateway** | بوابة الدفع | Accept full digital payments (not just Deposits). Client pays entire Service price online. Transaction log. Refund management. Gateway configuration (Visa / Vodafone Cash / Bank). |

> **Note:** This is separate from the Deposit system. Deposits are ALWAYS handled by Booky Escrow. The Payment Gateway handles the *remaining balance* after the Deposit.

---

#### IF `Q4 (Products) == Yes`

| Module | Arabic Name | Description |
|--------|-------------|-------------|
| **Store / Inventory** | المتجر والمخزون | Product catalog: name, price (EGP integer), stock count, photos, category. Inventory tracking with low-stock alerts. Products attachable as add-ons to Services during Booking checkout. Standalone product purchase support (Phase 2). |

---

## 4. Module Activation Matrix

> **The single lookup table that the Module Resolver uses.** Given onboarding inputs → which modules are ON.

| Module | Trigger Condition | Base? |
|--------|------------------|-------|
| Calendar | Always | ✅ Base |
| Wallet | Always | ✅ Base |
| CRM (Clients) | Always | ✅ Base |
| Settings | Always | ✅ Base |
| Patient Records | `business_type ∈ [clinic, dental, derma, mental_health]` | Variable |
| Prescription History | `business_type ∈ [clinic, dental, derma, mental_health]` | Variable |
| Court Management | `business_type ∈ [football_pitch, padel, tennis, sports_venue]` | Variable |
| Team Booking | `sector_id == sports` | Variable |
| Staff Selection | `business_type ∈ [barber, salon, spa, beauty]` | Variable |
| Service Duration | `business_type ∈ [barber, salon, spa, beauty]` | Variable |
| Branch Management | `has_branches == true` | Variable |
| Payment Gateway | `has_e_payments == true` | Variable |
| Store / Inventory | `has_products == true` | Variable |

### Example Configurations

| Merchant Profile | Active Modules |
|-----------------|----------------|
| **Football Pitch**, 2 branches, sells drinks | Calendar, Wallet, CRM, Settings + **Court Management**, **Team Booking**, **Branch Management**, **Store/Inventory** |
| **Barber Shop**, single location, cash only | Calendar, Wallet, CRM, Settings + **Staff Selection**, **Service Duration** |
| **Dental Clinic**, e-payments enabled | Calendar, Wallet, CRM, Settings + **Patient Records**, **Prescription History**, **Payment Gateway** |
| **Gym**, single location, no products | Calendar, Wallet, CRM, Settings + **Team Booking** |
| **Wedding Venue**, 1 branch, e-payments, sells decor | Calendar, Wallet, CRM, Settings + **Payment Gateway**, **Store/Inventory** |
| **Plumber (Home Services)**, single, cash only | Calendar, Wallet, CRM, Settings *(base only — mobile-first)* |

---

## 5. Module Descriptions

### Detailed Module Specs

#### 🏥 Patient Records (سجلات المرضى)

| Feature | Detail |
|---------|--------|
| **Per-Client Record** | Linked to Client ID from CRM. One record per Client. |
| **Visit Log** | Each Booking adds a visit entry: date, Booking ID, auto-linked. |
| **Fields per Visit** | Diagnosis (free text), treatment notes, medications, follow-up date, attachments (X-rays, photos). |
| **Encryption** | AES-256 at rest. TLS 1.3 in transit. |
| **Access** | Merchant-only. Not visible to Client. Not accessible by Booky Admin. |
| **Export** | PDF per Client. Bulk export for clinic migration. |
| **Retention** | Kept for 5 years after last visit (Egyptian medical records law). |

#### 🏟️ Court Management (إدارة الملاعب)

| Feature | Detail |
|---------|--------|
| **Court Registry** | Add/edit/remove courts. Fields: name, type (grass/synthetic/sand), size, capacity, photo. |
| **Per-Court Calendar** | Individual Slot management per court. |
| **Maintenance Mode** | Toggle court offline with reason. Existing Bookings notified + rescheduled. |
| **Pricing** | Per-court pricing. Peak/off-peak rates. Weekend surcharge. |
| **Visual Timeline** | Horizontal bar chart showing all courts for the day. |

#### ⚽ Team Booking (حجز فرق)

| Feature | Detail |
|---------|--------|
| **Group Size** | Client specifies: 5v5, 7v7, 11v11 (or custom). |
| **Single Booker** | One Client books for the team. One Deposit. One QR code. |
| **Per-Player Split** | Optional: system generates payment links for each team member (Phase 2). |
| **Waitlist** | If a team is short players: "Need 2 more" visible on the Booking (opt-in). |

#### ✂️ Staff Selection (اختيار الموظف)

| Feature | Detail |
|---------|--------|
| **Staff Profiles** | Name, photo, specialties, per-staff rating (from Client reviews). |
| **Staff Calendar** | Each staff member has individual Slot availability. |
| **Client Preference** | Client picks their preferred staff during Booking (optional — can choose "Any"). |
| **Conflict Prevention** | A staff member cannot be double-booked. System validates before confirmation. |
| **Commission Tracking** | Optional: per-staff earning breakdowns (internal report for Merchant). |

#### ⏱️ Service Duration (مدة الخدمة)

| Feature | Detail |
|---------|--------|
| **Time Breakdown** | Setup time + Execution time + Cleanup time = Total Slot duration. |
| **Example** | Haircut: 5 min setup + 25 min execution + 5 min cleanup = 35 min total Slot. |
| **Auto-Slot** | System generates Slot durations based on Service config. No manual calculation needed. |
| **Buffer Time** | Configurable break between Bookings (default: 10 min). Prevents burnout. |
| **Overlap Guard** | System prevents booking a 60-min Service in a 45-min Slot. |

#### 🏢 Branch Management (إدارة الفروع)

| Feature | Detail |
|---------|--------|
| **Branch Switcher** | Dropdown at the top of every Dashboard screen. |
| **Per-Branch** | Calendar, staff, Services, working hours — all configurable per branch. |
| **Unified Wallet** | All branch earnings flow to one Merchant Wallet. Per-branch revenue tracking in analytics. |
| **Unified CRM** | Clients are shared across branches. See which branch a Client visits most. |

#### 💳 Payment Gateway (بوابة الدفع)

| Feature | Detail |
|---------|--------|
| **Scope** | Collect the remaining balance AFTER the Deposit (or the full amount for non-Deposit Services). |
| **Methods** | Visa/Mastercard, Vodafone Cash, InstaPay (as configured in onboarding Q2). |
| **Processing Fee** | 2.5% per transaction (disclosed to Merchant during setup). |
| **Refund** | Merchant can initiate partial or full refunds from this module. |
| **Dashboard** | Transaction list, daily/weekly/monthly totals, failed payment alerts. |

#### 🛒 Store / Inventory (المتجر والمخزون)

| Feature | Detail |
|---------|--------|
| **Product Catalog** | Name, price (EGP integer), stock count, photos (max 5), description. |
| **Low-Stock Alert** | Push notification when stock drops below threshold (configurable, default: 5). |
| **Booking Add-Ons** | Products can be attached as optional add-ons during Client checkout. |
| **Standalone Store** | Phase 2: Clients can browse and buy products without a Service Booking. |
| **Analytics** | Top-selling products, revenue contribution vs. Services. |

---

## 6. Dashboard Layout & Navigation

### Mobile Layout (Primary)

```
┌─────────────────────────────────────┐
│  ☰  ملاعب النصر          🔔  👤    │  ← Header: Merchant name, notifications, profile
├─────────────────────────────────────┤
│                                      │
│  ┌─────────────────────────────┐    │
│  │  📊 ملخص اليوم               │    │  ← Today's summary card
│  │  5 حجوزات | 285 ج.م          │    │
│  │  الحجز القادم: 18:00          │    │
│  └─────────────────────────────┘    │
│                                      │
│  ┌─────────────────────────────┐    │
│  │  Quick Actions                │    │
│  │  [ + أضف موعد ] [ تأكيد حضور ] │    │
│  └─────────────────────────────┘    │
│                                      │
│  Recent Bookings List...            │
│                                      │
├─────────────────────────────────────┤
│  📅    💰    👥    ⚙️   ...         │  ← Bottom tab bar (modules)
│  تقويم  محفظة  عملاء  إعدادات        │
└─────────────────────────────────────┘
```

### Tab Bar Logic

| Rule | Detail |
|------|--------|
| **Max visible tabs** | 5 on mobile (including "More" ⋯ overflow). |
| **Priority order** | Calendar → Wallet → CRM → [Variable modules] → Settings. |
| **Overflow** | If > 5 modules: last tab becomes "⋯ المزيد" (More), opening a full module list. |
| **Desktop** | Side navigation rail instead of bottom tabs. All modules visible. Collapsible. |

### Desktop Layout

```
┌────────┬─────────────────────────────────────────────────────┐
│        │  ← Header: Search, Notifications, Profile           │
│  📅    ├─────────────────────────────────────────────────────┤
│  التقويم │                                                    │
│        │                                                      │
│  💰    │         MAIN CONTENT AREA                            │
│  المحفظة│         (Renders selected module)                   │
│        │                                                      │
│  👥    │                                                      │
│  العملاء│                                                      │
│        │                                                      │
│  🏟️   │                                                      │
│  الملاعب│  ← Variable module (only if sports)                 │
│        │                                                      │
│  🛒    │                                                      │
│  المتجر │  ← Variable module (only if has_products)            │
│        │                                                      │
│  ⚙️    │                                                      │
│  إعدادات│                                                      │
│        │                                                      │
└────────┴─────────────────────────────────────────────────────┘
```

---

## 7. Subscription Tier Gating

Not all modules are available on all Merchant Subscription Tiers. Some variable modules require an upgrade.

| Module | Starter (99 EGP/mo) | Growth (249 EGP/mo) | Pro (499 EGP/mo) |
|--------|---------------------|---------------------|-------------------|
| Calendar | ✅ | ✅ | ✅ |
| Wallet | ✅ | ✅ | ✅ |
| CRM (Clients) | ✅ Basic (list only) | ✅ Full (tags, notes, export) | ✅ Full + Analytics |
| Settings | ✅ | ✅ | ✅ |
| Patient Records | ✅ | ✅ | ✅ |
| Prescription History | ❌ | ✅ | ✅ |
| Court Management | ✅ | ✅ | ✅ |
| Team Booking | ❌ | ✅ | ✅ |
| Staff Selection | ✅ (max 3 staff) | ✅ (max 10 staff) | ✅ Unlimited |
| Service Duration | ✅ | ✅ | ✅ |
| Branch Management | ❌ | ✅ (max 5 branches) | ✅ (max 20 branches) |
| Payment Gateway | ❌ | ✅ | ✅ |
| Store / Inventory | ❌ | ✅ (max 50 products) | ✅ Unlimited |

### Gating UX

When a module is toggled ON by the Module Resolver but the Merchant's Subscription Tier doesn't support it:

```
┌───────────────────────────────────────────────────┐
│  🔒 حجز فرق (Team Booking)                        │
│                                                    │
│  الميزة دي متاحة في باقة Growth وأعلى              │
│                                                    │
│  [ ترقي دلوقتي — 249 ج.م/شهر ]                    │
│                                                    │
│  ℹ️ خلي العملاء يحجزوا لفرقهم كلها من مكان واحد    │
└───────────────────────────────────────────────────┘
```

> **Rule:** Locked modules are **visible but grayed out** with an upgrade prompt. They are NOT hidden. This creates upgrade desire (FOMO) and shows the Merchant what they're missing.

---

## 8. Gherkin Scenarios

### Scenario 1: Module Resolution for a Sports Merchant

```gherkin
Feature: Dynamic Dashboard Module Resolution

  Scenario: Football pitch owner gets sports-specific modules
    Given a Merchant completed onboarding with:
      | field              | value            |
      | business_type_id   | football_pitch   |
      | sector_id          | sports           |
      | has_branches       | true             |
      | has_e_payments     | false            |
      | has_products       | true             |
      | subscription_tier  | growth           |

    When the Module Resolver processes the Merchant's configuration
    Then the Dashboard is assembled with these modules:

      | module              | status            | reason                       |
      | Calendar            | ✅ Active          | Base module                  |
      | Wallet              | ✅ Active          | Base module                  |
      | CRM (Clients)       | ✅ Active (Full)   | Base + Growth tier           |
      | Settings            | ✅ Active          | Base module                  |
      | Court Management    | ✅ Active          | business_type = football     |
      | Team Booking        | ✅ Active          | sector = sports + Growth     |
      | Branch Management   | ✅ Active          | has_branches = true + Growth |
      | Store / Inventory   | ✅ Active          | has_products = true + Growth |
      | Payment Gateway     | ❌ Not shown       | has_e_payments = false       |
      | Patient Records     | ❌ Not shown       | Not medical business type    |
      | Staff Selection     | ❌ Not shown       | Not beauty business type     |

    And the tab bar shows: Calendar, Wallet, Courts, Store, More (⋯)
    And "More" contains: CRM, Branch Mgmt, Settings
```

### Scenario 2: Module Resolution for a Beauty Salon

```gherkin
  Scenario: Beauty salon gets staff and duration modules
    Given a Merchant completed onboarding with:
      | field              | value     |
      | business_type_id   | salon     |
      | sector_id          | health_beauty |
      | has_branches       | false     |
      | has_e_payments     | true      |
      | has_products       | true      |
      | subscription_tier  | starter   |

    When the Module Resolver processes the Merchant's configuration
    Then the Dashboard is assembled with:

      | module              | status             | reason                             |
      | Calendar            | ✅ Active           | Base module                        |
      | Wallet              | ✅ Active           | Base module                        |
      | CRM (Clients)       | ✅ Active (Basic)   | Base + Starter tier (list only)    |
      | Settings            | ✅ Active           | Base module                        |
      | Staff Selection     | ✅ Active (max 3)   | business_type = salon + Starter    |
      | Service Duration    | ✅ Active           | business_type = salon              |
      | Payment Gateway     | 🔒 Locked           | has_e_payments = true BUT Starter  |
      | Store / Inventory   | 🔒 Locked           | has_products = true BUT Starter    |
      | Court Management    | ❌ Not shown        | Not sports business type           |
      | Team Booking        | ❌ Not shown        | Not sports sector                  |
      | Patient Records     | ❌ Not shown        | Not medical business type          |

    And locked modules show upgrade prompts to Growth tier
```

### Scenario 3: Medical Clinic with Full Setup

```gherkin
  Scenario: Dental clinic gets patient records and prescriptions
    Given a Merchant completed onboarding with:
      | field              | value     |
      | business_type_id   | dental    |
      | sector_id          | health_beauty |
      | has_branches       | true      |
      | has_e_payments     | true      |
      | has_products       | false     |
      | subscription_tier  | pro       |

    When the Module Resolver processes the Merchant's configuration
    Then the Dashboard is assembled with:

      | module              | status             | reason                          |
      | Calendar            | ✅ Active           | Base module                     |
      | Wallet              | ✅ Active           | Base module                     |
      | CRM (Clients)       | ✅ Active (Full+)   | Base + Pro tier (with analytics)|
      | Settings            | ✅ Active           | Base module                     |
      | Patient Records     | ✅ Active           | business_type = dental          |
      | Prescription History| ✅ Active           | business_type = dental + Pro    |
      | Branch Management   | ✅ Active (max 20)  | has_branches = true + Pro       |
      | Payment Gateway     | ✅ Active           | has_e_payments = true + Pro     |
      | Staff Selection     | ✅ Active (Unlimited)| dental ∈ health_beauty types   |
      | Service Duration    | ✅ Active           | dental ∈ health_beauty types   |
      | Store / Inventory   | ❌ Not shown        | has_products = false            |
      | Court Management    | ❌ Not shown        | Not sports business type        |
      | Team Booking        | ❌ Not shown        | Not sports sector               |
```

### Scenario 4: Merchant Upgrades Tier — Modules Unlock

```gherkin
  Scenario: Salon owner upgrades from Starter to Growth — locked modules unlock
    Given a Merchant "صالون جوليا" is on Starter tier
    And the Dashboard shows Payment Gateway as 🔒 Locked
    And the Dashboard shows Store / Inventory as 🔒 Locked

    When the Merchant navigates to Settings → Subscription
    And upgrades from Starter (99 EGP/mo) to Growth (249 EGP/mo)
    And the payment for the new tier is confirmed

    Then the Module Resolver re-runs
    And Payment Gateway status changes from 🔒 Locked to ✅ Active
    And Store / Inventory status changes from 🔒 Locked to ✅ Active
    And the Merchant receives notification:
      "🎉 مبروك! باقة Growth اتفعلت — بوابة الدفع والمتجر شغالين دلوقتي!"
    And the tab bar updates to include the new modules
```

---

## 9. Edge Cases

| # | Edge Case | Business Rule |
|---|-----------|---------------|
| 1 | **Merchant changes Business Type after onboarding** | Allowed via Settings → Profile. Module Resolver re-runs. Modules for old type are deactivated. Data for deactivated modules is NOT deleted (preserved for 90 days in case they switch back). |
| 2 | **Merchant's subscription expires (non-payment)** | Downgrade to Starter automatically. Gated modules become 🔒 Locked. Existing data preserved. Read-only access for 30-day grace. |
| 3 | **Module Resolver conflict (e.g., medical + sports)** | Impossible by design: a Merchant has exactly ONE Business Type. Types don't overlap Sectors. |
| 4 | **New module added to the platform after Merchant onboarded** | Module Resolver re-evaluates all Merchants nightly. If a new module matches their type, it appears with a "🆕 جديد!" badge. |
| 5 | **Merchant has 0 Bookings (fresh onboarding)** | Dashboard shows empty states with educational content: "أضف أول خدمة عشان تبدأ تستقبل حجوزات 🚀" |
| 6 | **Patient Records for a deactivated medical Merchant** | Data retained for 5 years (medical records regulation). Merchant can request export before account deletion. |
| 7 | **Court Management with 0 courts configured** | Module visible but shows: "أضف أول ملعب عشان تبدأ تستقبل حجوزات 🏟️" — guided setup. |
| 8 | **Staff Selection with Starter tier (max 3 staff)** | If Merchant tries to add a 4th: "وصلت الحد — ترقي لباقة Growth عشان تضيف لحد 10 موظفين." |
| 9 | **Two modules share data (e.g., CRM + Patient Records)** | Client data flows from CRM to Patient Records. No duplication. Patient Records adds medical fields ON TOP of the CRM Client profile. |
| 10 | **Merchant is offline / poor connection** | Cached dashboard layout. Modules show last-synced data. Mutation operations queued for when connection restores. |

---

## 10. Merchant Subscription Tiers — Philosophy & Pricing

### The Problem

Egyptian Merchants resist recurring software fees. The word "اشتراك شهري" (monthly subscription) triggers immediate objection: "مش هدفع فلوس كل شهر على حاجة مش شايف قيمتها."

### The Booky Center Approach

> **Design Law:** Every Subscription Tier must deliver **measurable ROI within the first month**. If a Merchant cannot see the financial return exceeding the cost, the tier has failed.

### Pricing Ladder

```
┌──────────────────────────────────────────────────────────────┐
│                  MERCHANT PRICING LADDER                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   🆓 Start (البداية) ─── Free forever. No risk.              │
│       │                   "Try it, see results, then decide." │
│       │                                                       │
│       ▼  Merchant sees value, needs more                      │
│                                                               │
│   ⭐ Pro (المحترف) ──── 120 EGP/mo                           │
│       │                  "For serious businesses growing fast."│
│       │                                                       │
│       ▼  Merchant is scaling, needs automation                │
│                                                               │
│   👑 Pasha (الباشا) ─── 450 EGP/mo                           │
│                          "The complete business powerhouse."   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

> **Key Principle:** The free tier is permanent and genuinely useful — not a crippled trial. This builds trust. Upgrades happen because of ambition, not desperation.

---

## 11. Tier Feature Matrix

| Feature | 🆓 **Start** (البداية) | ⭐ **Pro** (المحترف) | 👑 **Pasha** (الباشا) |
|---------|------------------------|----------------------|------------------------|
| **Price** | **Free forever** | **120 EGP/mo** | **450 EGP/mo** |
| | | | |
| **Calendar & Scheduling** | | | |
| Calendar Type | Manual (drag-and-drop) | Smart Calendar (auto-optimize) | AI Calendar (predictive) |
| Slot Management | ✅ Basic | ✅ Recurring + Buffer time | ✅ AI auto-fill + demand prediction |
| Working Hours | ✅ | ✅ | ✅ + Holiday auto-block |
| | | | |
| **Bookings** | | | |
| Monthly Booking Limit | 50 | ♾️ Unlimited | ♾️ Unlimited |
| Deposit Collection | ✅ (after verification) | ✅ | ✅ |
| Waitlist Management | ❌ | ✅ | ✅ + Auto-fill from waitlist |
| Multi-Service Booking | ❌ | ✅ | ✅ |
| | | | |
| **Team Management** | | | |
| Staff Accounts | 1 (owner only) | Up to 5 staff | ♾️ Unlimited staff |
| Role Permissions | ❌ | ✅ (Admin / Staff) | ✅ (Admin / Manager / Staff) |
| Staff Calendar | ❌ | ✅ Individual calendars | ✅ + Shift management |
| | | | |
| **Analytics & Reports** | | | |
| Basic Stats | ✅ (Booking count, views) | ✅ | ✅ |
| Revenue Merchant Dashboard | ❌ | ✅ Weekly/Monthly reports | ✅ Real-time + forecasting |
| Client Insights | ❌ | ✅ (Repeat rate, demographics) | ✅ + Churn prediction |
| Export Reports | ❌ | ✅ CSV | ✅ CSV + PDF + API |
| | | | |
| **Marketing Tools** | | | |
| Stories (Flash Offers) | 1/day | 3/day | 5/day |
| Booky Coins Campaigns | ❌ | ✅ Create coin-back offers | ✅ + Auto-targeting |
| Featured Listing | ❌ | 3 days/month | 7 days/month |
| Push Notifications to Clients | ❌ | ❌ | ✅ (to past Clients) |
| | | | |
| **Communication** | | | |
| Inquiry (Client Inquiry) | ✅ Manual | ✅ Quick Replies | ✅ AI Auto-Reply |
| Booking Confirmations | ✅ SMS | ✅ SMS + WhatsApp | ✅ SMS + WhatsApp + Custom |
| | | | |
| **Support** | | | |
| Support Channel | Community + Help Center | Email (< 24h response) | Dedicated Account Manager |
| Onboarding Assistance | Self-serve | Video walkthrough | Personal setup call |
| | | | |
| **Branding** | | | |
| Profile Badge | — | ⭐ "محترف" (Pro) | 👑 "الباشا" (Pasha) |
| Custom Profile URL | ❌ | ✅ booky.center/your-name | ✅ booky.center/your-name |
| | | | |
| **Platform Commission** | Standard rate | -1% discount | -2% discount |

### Tier Details: Start (البداية)

**Target:** Newly onboarded Merchants (post-Trial Mode), freelancers, sole operators.

> "ابدأ مجاناً، وخليك مجاناً لحد ما تحتاج أكتر."
> *"Start free, stay free — until you need more."*

| Limit | Value | When Hit |
|-------|-------|----------|
| Monthly Bookings | 50 | Banner: "وصلت لحد الحجوزات. رقّي لباقة المحترف عشان حجوزات بلا حدود." |
| Staff Accounts | 1 (owner) | Lock icon with tooltip: "أضف فريقك — باقة المحترف" |
| Stories | 1/day | After posting: "عايز تنشر قصص أكتر؟ رقّي دلوقتي." |

### Tier Details: Pro (المحترف)

**Target:** Growing businesses with 50-200+ Bookings/month, multi-staff operations.

> "شغلك كبر. خلي الأرقام تتكلم وفريقك ينظم نفسه."

| Billing | Price | Savings |
|---------|-------|---------|
| Monthly | 120 EGP/mo | — |
| Annual | 100 EGP/mo (1,200 EGP/year) | Save 240 EGP (17%) |

**Key Unlocks:** Smart Calendar (auto-buffer, recurring Slots, conflict detection), up to 5 Staff accounts (Admin / Staff roles), analytics with revenue reports, CSV export, 3 Stories/day, and -1% commission discount.

### Tier Details: Pasha (الباشا)

**Target:** High-volume businesses (200+ Bookings/month), multi-branch or franchise operations.

> "إنت الباشا. بيزنسك يشتغل لوحده وإنت بتراقب من فوق."

| Billing | Price | Savings |
|---------|-------|---------|
| Monthly | 450 EGP/mo | — |
| Annual | 375 EGP/mo (4,500 EGP/year) | Save 900 EGP (17%) |

**Key Unlocks:** AI Auto-Reply (Inquiry automation), AI Calendar (predictive scheduling), unlimited staff with role hierarchy, 5 Stories/day, push notifications to past Clients, -2% commission discount, and a dedicated Account Manager.

---

## 12. Billing & Payment Logic

### Payment Methods (Merchant Subscription Billing)

| Method | Supported | Notes |
|--------|-----------|-------|
| Vodafone Cash | ✅ | Auto-debit (recurring) or manual |
| InstaPay | ✅ | Manual payment each cycle |
| Credit/Debit Card | ✅ | Auto-recurring (preferred) |
| Cash (via agent) | ✅ | For Digital Immigrants only. Agent collects. |

### Billing Cycle

```
SUBSCRIPTION ACTIVATED (Day 1)
         │
         ▼
CHARGE on Day 1 of each cycle
         │
         ├─ Payment successful → Continue service
         │
         ├─ Payment failed → 3-day grace period
         │       │
         │       ├─ Retried successfully → Continue
         │       │
         │       └─ Still failed after 3 days:
         │               → Downgrade to Start (البداية)
         │               → All data preserved
         │               → Features locked to Start limits
         │               → Notification: "اشتراكك اتوقف. جدد عشان ترجع كل المميزات."
         │
         └─ Annual billing: Charge full year upfront. No mid-cycle refunds.
```

### Invoice Generation

| Field | Value |
|-------|-------|
| Invoice ID | `INV-YYMMDD-XXXX` |
| Currency | EGP (integer) |
| Tax | 14% VAT (Egyptian standard) |
| Invoice Language | Arabic |
| Delivery | In-app + Email (PDF) |

---

## 13. Upgrade / Downgrade Rules

### Upgrade (Immediate)

```
MERCHANT SELECTS HIGHER TIER
         │
         ▼
PRO-RATED CHARGE for remaining days in current cycle
         │
         ▼
IMMEDIATE FEATURE UNLOCK
         │
         ▼
NEXT CYCLE charges at new tier rate
```

**Example:** Merchant on Start upgrades to Pro on Day 15 of a 30-day cycle.
- Charged: 120 × (15/30) = **60 EGP** for remaining days.
- Next month: Full 120 EGP.
- Features unlocked **immediately**.

### Downgrade (End of Cycle)

```
MERCHANT SELECTS LOWER TIER
         │
         ▼
CHANGE SCHEDULED for end of current billing cycle
         │
         ▼
MERCHANT KEEPS CURRENT FEATURES until cycle ends
         │
         ▼
AT CYCLE END:
    → Features adjusted to new tier
    → Data preserved (analytics history, etc.)
    → Staff accounts beyond limit: deactivated (not deleted)
    → Excess Stories: existing ones stay, new limit applies
```

### Cancellation

| Rule | Detail |
|------|--------|
| Monthly Subscription Tier | Cancel anytime. Active until end of current cycle. |
| Annual Subscription Tier | Cancel anytime. Active until end of annual period. No mid-year refund. |
| Data retention | All data preserved for 12 months after cancellation. |
| Reactivation | Merchant can reactivate any tier at any time. Previous data restored. |

---

## 14. ROI Calculator (Merchant-Facing)

> Built into the Upgrade screen. Uses the Merchant's **actual data** to calculate personalized ROI.

### Input Variables (Auto-Populated)

```
Your Business Stats:
─────────────────────
• Current monthly Bookings:         [Auto: 47]
• Average Booking value:            [Auto: 150 EGP]
• Monthly profile views:            [Auto: 320]
• Missed Bookings (over limit):     [Auto: 12]
• Unanswered Inquiries:             [Auto: 8]
```

### Output (Dynamic)

```
If you upgrade to Pro (المحترف):
──────────────────────────────────
✅ 12 extra Bookings × 150 EGP   =  +1,800 EGP revenue
✅ 8 Inquiries answered faster    =  ~4 more conversions = +600 EGP
✅ 3 Stories/day                  =  ~15% more views = +48 views/mo
✅ Commission discount (-1%)      =  ~70 EGP saved
─────────────────────────────────────────────
💰 Estimated extra revenue:        +2,470 EGP/month
💸 Pro tier cost:                  -120 EGP/month
─────────────────────────────────────────────
✅ Net gain:                       +2,350 EGP/month (19.5x ROI)
```

---

## 15. Churn Prevention & Retention

### Early Warning Signals

| Signal | Trigger | Action |
|--------|---------|--------|
| Usage Drop | < 5 Bookings/week for 2 consecutive weeks | Email: "هل كل حاجة تمام؟" + support offer |
| No Login (7 days) | Merchant hasn't opened Merchant Dashboard | Push + WhatsApp: "فاتك X حجوزات!" |
| Downgrade Intent | Merchant visits pricing page frequently | In-app: "قبل ما تغير — شوف نتايجك الشهر ده." |
| Payment Failure | Card declined / wallet empty | SMS: "اشتراكك هيتوقف كمان 3 أيام. جدد دلوقتي." |

### Retention Offers

| Scenario | Offer |
|----------|-------|
| First downgrade attempt (Pro → Start) | "ابقى على المحترف — أول شهر الجاي بنص السعر (60 EGP)." |
| First downgrade attempt (Pasha → Pro) | "ابقى على الباشا — شهرين الجايين بـ 350 EGP بدل 450." |
| Inactive 30+ days | "ارجعلنا! أول شهر مجاناً على أي باقة." |
| Annual renewal approaching | "جدد السنة بخصم 20% — وفر [X] ج.م." |

### Win-Back Flow

```
MERCHANT CANCELS / DOWNGRADES
         │
         ▼
DAY 0:  Confirmation + "We'll miss you" message
DAY 3:  "Here's what you missed this week" (stats email)
DAY 7:  Special offer: "Come back — first month free"
DAY 30: Final attempt: "Your data is still safe. Reactivate anytime."
DAY 90: Archive notification: "Your data will be archived in 90 days."
```

---

## 16. Subscription Data Model & API

### Subscription Table

```sql
CREATE TABLE merchant_subscriptions (
    subscription_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id         UUID NOT NULL REFERENCES merchants(merchant_id),
    tier                VARCHAR(20) NOT NULL DEFAULT 'start',
    -- tier: 'start' | 'pro' | 'pasha'
    billing_cycle       VARCHAR(10) NOT NULL DEFAULT 'monthly',
    -- billing_cycle: 'monthly' | 'annual'
    price_egp           INTEGER NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'active',
    -- status: 'active' | 'grace_period' | 'cancelled' | 'expired'
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end   TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    downgrade_to         VARCHAR(20),                       -- scheduled downgrade tier
    payment_method       VARCHAR(20),
    created_at           TIMESTAMPTZ DEFAULT NOW(),
    updated_at           TIMESTAMPTZ DEFAULT NOW()
);
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/merchants/me/subscription` | Get current Subscription Tier and billing info |
| `POST` | `/merchants/me/subscription/upgrade` | Upgrade to higher Subscription Tier (immediate) |
| `POST` | `/merchants/me/subscription/downgrade` | Schedule downgrade (end of cycle) |
| `POST` | `/merchants/me/subscription/cancel` | Cancel subscription (end of cycle) |
| `POST` | `/merchants/me/subscription/reactivate` | Reactivate after cancellation |
| `GET` | `/merchants/me/subscription/invoices` | List all invoices |
| `GET` | `/merchants/me/subscription/roi-calculator` | Personalized ROI projection |

---

> **📌 Source of Truth:** This document aligns with [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md) §5 (Sectors), §7 (Merchant Subscriptions), §11 (Dashboard definition). Module triggers depend on [smart-onboarding-flow.md](mdc:docs/business-logic/03-merchant/smart-onboarding-flow.md) Stage 2 & Stage 3 outputs.
>
> **📌 TERMINOLOGY NOTE:** This document uses "Subscription Tier" to refer to the Merchant's paid Merchant Dashboard Subscription Tier (Start / Pro / Pasha). This is separate from the Client Subscription Tier (Free / Premium / VIP) and the Client Rank system (Newbie / Regular / Pro / Pasha). See [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md) §2 for the canonical dictionary.
>
> *Booky Center: بضغطة واحدة.. ميعادك في جيبك* ✨

