# 03_MERCHANT_DASHBOARD_SUBSCRIPTION_TIERS

## Business Logic: The 3-Tier Merchant Subscription Model

**Document Version:** 1.0
**Last Updated:** February 14, 2026
**Classification:** Business Logic — Merchant-Side Monetization
**Author:** Product Architecture & Revenue Team
**Depends On:** [`BOOKY_CENTER_BUSINESS_MASTER.md`](../BOOKY_CENTER_BUSINESS_MASTER.md) (v6.0)
**Cross-References:** [`02_MERCHANT_ONBOARDING_FLOW.md`](02_MERCHANT_ONBOARDING_FLOW.md) (Trial Mode → Tier selection), [`05_PAYMENT_PAYOUT_GATEWAYS.md`](05_PAYMENT_PAYOUT_GATEWAYS.md) (Billing cycles)

---

## Table of Contents

1. [Subscription Philosophy](#1-subscription-philosophy)
2. [The 3 Tiers — Feature Matrix](#2-the-3-tiers--feature-matrix)
3. [Tier Details: Start (البداية)](#3-tier-details-start-البداية)
4. [Tier Details: Pro (المحترف)](#4-tier-details-pro-المحترف)
5. [Tier Details: Pasha (الباشا)](#5-tier-details-pasha-الباشا)
6. [Billing & Payment Logic](#6-billing--payment-logic)
7. [Upgrade / Downgrade Rules](#7-upgrade--downgrade-rules)
8. [ROI Calculator (Merchant-Facing)](#8-roi-calculator-merchant-facing)
9. [Churn Prevention & Retention](#9-churn-prevention--retention)
10. [Data Model & API Contract](#10-data-model--api-contract)
11. [Acceptance Criteria](#11-acceptance-criteria)

---

## 1. Subscription Philosophy

### The Problem

Egyptian Merchants resist recurring software fees. The word "اشتراك شهري" (monthly subscription) triggers immediate objection: "مش هدفع فلوس كل شهر على حاجة مش شايف قيمتها."

### The Booky Center Approach

> **Design Law:** Every tier must deliver **measurable ROI within the first month**. If a Merchant cannot see the financial return exceeding the cost, the tier has failed.

### Pricing Psychology

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

## 2. The 3 Tiers — Feature Matrix

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
| Revenue Dashboard | ❌ | ✅ Weekly/Monthly reports | ✅ Real-time + forecasting |
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
| Inquiry (Client Chat) | ✅ Manual | ✅ Quick Replies | ✅ AI Auto-Reply |
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

---

## 3. Tier Details: Start (البداية)

### Target Merchant

- Newly onboarded Merchants (post-Trial Mode).
- Freelancers and sole operators with low booking volume.
- Merchants testing the platform before committing.

### Value Proposition

> "ابدأ مجاناً، وخليك مجاناً لحد ما تحتاج أكتر."
> *"Start free, stay free — until you need more."*

### What "Start" Includes

```
┌──────────────────────────────────────────────────────────────┐
│              لوحة تحكم — باقة البداية 🆓                     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   ✅ Business Profile (full)                                  │
│   ✅ Manual Calendar (drag-and-drop Slots)                    │
│   ✅ Up to 50 Bookings/month                                  │
│   ✅ Deposit Collection (post-verification)                   │
│   ✅ Basic Stats (Bookings count, profile views)              │
│   ✅ 1 Story/day (Flash Offer)                                │
│   ✅ Inquiry Chat (manual replies)                            │
│   ✅ SMS Booking Confirmations                                │
│   ✅ Community support + Help Center                          │
│                                                               │
│   🔒 What you're missing:                                     │
│   • Staff accounts & team management                          │
│   • Revenue analytics & reports                               │
│   • Smart/AI calendar optimization                            │
│   • Featured listing & boosted visibility                     │
│   • Quick replies & AI auto-reply                             │
│                                                               │
│   💡 "بتكبر؟ الباقة المحترف بتديك تحليلات وفريق عمل."       │
│      [ ⭐ جرب المحترف — أول شهر بنص السعر ]                  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Limitations & Guardrails

| Limit | Value | When Hit |
|-------|-------|----------|
| Monthly Bookings | 50 | Banner: "وصلت لحد الحجوزات. رقّي لباقة المحترف عشان حجوزات بلا حدود." |
| Staff Accounts | 1 (owner) | Lock icon with tooltip: "أضف فريقك — باقة المحترف" |
| Stories | 1/day | After posting: "عايز تنشر قصص أكتر؟ رقّي دلوقتي." |

---

## 4. Tier Details: Pro (المحترف)

### Target Merchant

- Growing businesses with 50-200+ Bookings/month.
- Multi-staff operations (salons, clinics, venues).
- Merchants who want data-driven decisions.

### Value Proposition

> "شغلك كبر. خلي الأرقام تتكلم وفريقك ينظم نفسه."
> *"Your business grew. Let data talk and your team organize itself."*

### Pricing

| Billing | Price | Savings |
|---------|-------|---------|
| Monthly | 120 EGP/mo | — |
| Annual | 100 EGP/mo (1,200 EGP/year) | Save 240 EGP (17%) |

### ROI Justification

```
┌──────────────────────────────────────────────────────────────┐
│              حاسبة العائد — باقة المحترف                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   Cost: 120 EGP/month                                         │
│                                                               │
│   Value you get:                                              │
│   + Unlimited Bookings (was 50)        → ~500 EGP extra/mo   │
│   + 5 Staff accounts                   → Save ~300 EGP/mo    │
│   + Revenue analytics                  → Better decisions     │
│   + 3 Stories/day                      → 3x visibility        │
│   + Featured listing (3 days)          → ~200 EGP value       │
│   + -1% commission discount            → ~100 EGP saved/mo   │
│   ──────────────────────────────────────────────              │
│   Estimated monthly value:           > 1,100 EGP              │
│   Net ROI:                          +980 EGP/month            │
│                                                               │
│   ✅ "الباقة بتدفع نفسها في أول 3 أيام."                     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Key Features Breakdown

#### Smart Calendar

- Auto-calculates buffer time between Bookings (e.g., 15-min cleaning break for salon).
- Recurring Slots (e.g., "Every Saturday 2pm-4pm" auto-generated for 4 weeks).
- Conflict detection and resolution.

#### Staff Accounts

- Up to 5 team members.
- Roles: **Admin** (full access) / **Staff** (view & manage own Bookings only).
- Individual calendars per staff member.
- Clients can choose specific staff member when booking.

#### Analytics Dashboard

- Weekly and monthly revenue reports.
- Top Services by booking volume and revenue.
- Client demographics (new vs. returning, location).
- Repeat booking rate.
- CSV export for accounting.

---

## 5. Tier Details: Pasha (الباشا)

### Target Merchant

- High-volume businesses (200+ Bookings/month).
- Multi-branch or franchise operations.
- Merchants who want full automation and premium positioning.

### Value Proposition

> "إنت الباشا. بيزنسك يشتغل لوحده وإنت بتراقب من فوق."
> *"You're the Pasha. Your business runs itself while you oversee from above."*

### Pricing

| Billing | Price | Savings |
|---------|-------|---------|
| Monthly | 450 EGP/mo | — |
| Annual | 375 EGP/mo (4,500 EGP/year) | Save 900 EGP (17%) |

### ROI Justification

```
┌──────────────────────────────────────────────────────────────┐
│              حاسبة العائد — باقة الباشا                       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   Cost: 450 EGP/month                                         │
│                                                               │
│   Value you get:                                              │
│   + Everything in Pro                  → 1,100 EGP base       │
│   + AI Auto-Reply (saves 2h/day)       → ~900 EGP labor/mo   │
│   + AI Calendar (predictive)           → +15% slot fill rate  │
│   + Unlimited staff                    → Scale freely         │
│   + 5 Stories/day                      → 5x visibility        │
│   + Featured listing (7 days)          → ~500 EGP value       │
│   + Push to past Clients               → +20% rebooking      │
│   + -2% commission discount            → ~300 EGP saved/mo   │
│   + Dedicated Account Manager          → Strategic support    │
│   ──────────────────────────────────────────────              │
│   Estimated monthly value:           > 2,800 EGP              │
│   Net ROI:                          +2,350 EGP/month          │
│                                                               │
│   ✅ "الباقة بترجعلك 6x اللي بتدفعه."                       │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Key Features Breakdown

#### AI Auto-Reply (Inquiry Automation)

```
CLIENT SENDS INQUIRY:
"السعر كام؟ ومتاحين يوم الجمعة؟"

AI AUTO-REPLY (instant):
"أهلاً بيك! 🙏
سعر [Service Name] هو [Price] ج.م.
متاح يوم الجمعة الساعة: 10:00ص، 2:00م، 5:00م.
عايز تحجز؟ [ احجز دلوقتي → ]"

→ Merchant reviews AI replies in dashboard
→ Can edit/override any reply
→ AI learns from Merchant corrections
```

#### AI Calendar (Predictive Scheduling)

- Analyzes historical Booking patterns.
- Suggests optimal Slot distribution (e.g., "Add more slots on Thursday evenings — demand is 3x higher").
- Auto-blocks Slots around prayer times (configurable).
- Demand prediction: "Next week is a holiday — expect 40% more Bookings. Open more Slots?"

#### Push Notifications to Past Clients

- Merchant can send targeted offers to Clients who previously booked.
- Limits: 2 push notifications per Client per week (anti-spam).
- Targeting: By Service type, recency, or booking frequency.
- Example: "مشتاقين ليك! احجز حلاقة الأسبوع ده واحصل على ١٠٪ خصم."

---

## 6. Billing & Payment Logic

### Payment Methods (Merchant Billing)

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

## 7. Upgrade / Downgrade Rules

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
| Monthly plan | Cancel anytime. Active until end of current cycle. |
| Annual plan | Cancel anytime. Active until end of annual period. No mid-year refund. |
| Data retention | All data preserved for 12 months after cancellation. |
| Reactivation | Merchant can reactivate any tier at any time. Previous data restored. |

---

## 8. ROI Calculator (Merchant-Facing)

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

## 9. Churn Prevention & Retention

### Early Warning Signals

| Signal | Trigger | Action |
|--------|---------|--------|
| Usage Drop | < 5 Bookings/week for 2 consecutive weeks | Email: "هل كل حاجة تمام؟" + support offer |
| No Login (7 days) | Merchant hasn't opened dashboard | Push + WhatsApp: "فاتك X حجوزات!" |
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

## 10. Data Model & API Contract

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
| `GET` | `/merchants/me/subscription` | Get current tier and billing info |
| `POST` | `/merchants/me/subscription/upgrade` | Upgrade to higher tier (immediate) |
| `POST` | `/merchants/me/subscription/downgrade` | Schedule downgrade (end of cycle) |
| `POST` | `/merchants/me/subscription/cancel` | Cancel subscription (end of cycle) |
| `POST` | `/merchants/me/subscription/reactivate` | Reactivate after cancellation |
| `GET` | `/merchants/me/subscription/invoices` | List all invoices |
| `GET` | `/merchants/me/subscription/roi-calculator` | Personalized ROI projection |

---

## 11. Acceptance Criteria

### Tier Access ✓

- [ ] Start (البداية) is free forever with 50 Bookings/month limit.
- [ ] Pro (المحترف) unlocks unlimited Bookings, 5 staff accounts, and analytics at 120 EGP/mo.
- [ ] Pasha (الباشا) unlocks AI Auto-Reply, unlimited staff, and push notifications at 450 EGP/mo.
- [ ] Each tier's locked features are visible but disabled with clear upgrade CTAs.

### Billing ✓

- [ ] Monthly and annual billing cycles supported.
- [ ] Annual discount: 17% off monthly price.
- [ ] 14% VAT added to all invoices.
- [ ] 3-day grace period on payment failure before downgrade.

### Upgrade / Downgrade ✓

- [ ] Upgrades are immediate with pro-rated billing.
- [ ] Downgrades are scheduled for end of cycle.
- [ ] Cancellation preserves data for 12 months.
- [ ] Retention offers triggered on first downgrade attempt.

### ROI Calculator ✓

- [ ] Calculator uses Merchant's actual Booking and revenue data.
- [ ] Shows personalized ROI for each higher tier.
- [ ] Updates in real-time as Merchant's data changes.

---

> **📌 TERMINOLOGY NOTE:** This document uses "Subscription Tier" to refer to the Merchant's paid Merchant Dashboard plan (Start / Pro / Pasha). This is separate from the Client Subscription Tier (Free / Premium / VIP) and the Client Rank system (Newbie / Regular / Pro / Pasha). See [`BOOKY_CENTER_BUSINESS_MASTER.md`](../BOOKY_CENTER_BUSINESS_MASTER.md) §2 for the canonical dictionary.

---

**END OF DOCUMENT**
