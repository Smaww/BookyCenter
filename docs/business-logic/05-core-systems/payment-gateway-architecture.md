# 📂 05-Core Systems: Payment Gateway Architecture

## *The Complete Payment & Payout Architecture for the Egyptian Market*

**Parent:** [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md)
**Cross-References:** [wallet-and-payouts.md](mdc:docs/business-logic/03-merchant/wallet-and-payouts.md) (Merchant Wallet & Payouts), [booking-lifecycle.md](mdc:docs/business-logic/02-client/booking-lifecycle.md) (Deposit & Cancellation), [financial-oversight.md](mdc:docs/business-logic/04-admin-platform/financial-oversight.md) (Revenue & Fraud), [loyalty-and-subscription-math.md](mdc:docs/business-logic/05-core-systems/loyalty-and-subscription-math.md) (Booky Coins Interaction)
**Version:** 1.0 | **Date:** February 15, 2026

---

## Table of Contents

1. [The Egyptian Payment Landscape](#1-the-egyptian-payment-landscape)
2. [Payment Methods — Client Side](#2-payment-methods--client-side)
3. [Cash on Arrival — Logic & No-Show Tracking](#3-cash-on-arrival--logic--no-show-tracking)
4. [Online Payments — Card / Meeza Integration](#4-online-payments--card--meeza-integration)
5. [Mobile Wallets — Vodafone Cash & InstaPay](#5-mobile-wallets--vodafone-cash--instapay)
6. [The Deposit (العربون) System — Detailed Logic](#6-the-deposit-العربون-system--detailed-logic)
7. [Online Payment Loyalty Bonus (+5% Booky Coins)](#7-online-payment-loyalty-bonus-5-booky-coins)
8. [Commission Model — Auto-Deduction vs. Invoicing](#8-commission-model--auto-deduction-vs-invoicing)
9. [Refund & Cancellation Logic](#9-refund--cancellation-logic)
10. [Payment Gateway Integration Plan](#10-payment-gateway-integration-plan)
11. [Reconciliation & Financial Controls](#11-reconciliation--financial-controls)
12. [Data Model — Financial Tables](#12-data-model--financial-tables)
13. [Gherkin Scenarios](#13-gherkin-scenarios)
14. [Edge Cases](#14-edge-cases)
15. [Acceptance Criteria](#15-acceptance-criteria)

---

## 1. The Egyptian Payment Landscape

### Reality Check: Cash is Still King

> **72% of Egyptians are unbanked** (no formal bank account). But digital is exploding — mobile wallet users grew from 8M to 28M+ in 3 years. Booky must support BOTH worlds seamlessly.

### Egypt Payment Ecosystem (2026)

| Method | Users | Market Share | Booky Strategy |
|--------|-------|-------------|----------------|
| **Cash** | Universal | ~60% of transactions | Default option. Must support. |
| **Vodafone Cash** | 28M+ | #1 mobile wallet | Primary digital payment. |
| **InstaPay** | 15M+ | Fastest-growing bank transfer | Instant settlement. |
| **Meeza Card** | 45M+ issued | National debit card | Lower fees than Visa/MC. |
| **Credit/Debit Card** | ~12M | International brands | High-value Bookings. |
| **Fawry** | 40M+ users | Bill payment network | Cash-to-digital bridge. |

### Booky's Payment Philosophy

```
┌──────────────────────────────────────────────────────────────┐
│                 PAYMENT DESIGN PRINCIPLES                     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   1. NEVER REJECT A CLIENT FOR PAYMENT METHOD                 │
│      → Cash is always an option (when no Deposit required)    │
│                                                               │
│   2. INCENTIVIZE DIGITAL, DON'T MANDATE IT                    │
│      → +5% bonus Booky Coins for online payment               │
│      → Faster confirmation, better experience                 │
│                                                               │
│   3. DEPOSITS ARE NON-NEGOTIABLE FOR HIGH-VALUE               │
│      → Protects Merchants, reduces no-shows by 85%            │
│      → Deposits MUST be digital (no cash Deposits)            │
│                                                               │
│   4. ALL MONEY IS EGP, ALL AMOUNTS ARE INTEGERS               │
│      → No floats. 150 EGP, not 149.99.                       │
│      → Consistent with Master §4.1                            │
│                                                               │
│   5. MERCHANT GETS PAID — FAST AND TRANSPARENT                │
│      → Settlement within 24-48 hours                          │
│      → Real-time Wallet dashboard                             │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Payment Methods — Client Side

### Supported Methods Matrix

| Method | Arabic Name | Deposit Support | Online Payment | Cash at Arrival | Refund Support |
|--------|-------------|-----------------|---------------|-----------------|---------------|
| **Cash on Arrival** | كاش عند الوصول | ❌ | ❌ | ✅ | N/A (no digital trail) |
| **Vodafone Cash** | فودافون كاش | ✅ | ✅ | ❌ | ✅ (to wallet) |
| **InstaPay** | إنستا باي | ✅ | ✅ | ❌ | ✅ (to bank) |
| **Credit Card** | بطاقة ائتمان | ✅ | ✅ | ❌ | ✅ (to card) |
| **Debit Card** | بطاقة خصم | ✅ | ✅ | ❌ | ✅ (to card) |
| **Meeza Card** | بطاقة ميزة | ✅ | ✅ | ❌ | ✅ (to card) |
| **Fawry** | فوري | ✅ (reference code) | ✅ | ❌ | ✅ (Fawry credit) |
| **Booky Coins** | كوينز بوكي | ❌ (cannot pay Deposits) | Partial (max 30%) | ❌ | ✅ (Booky Coins refunded) |

### Payment Selection Flow (Checkout)

```
CLIENT AT CHECKOUT
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              اختار طريقة الدفع                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─ الأكتر استخداماً ──────────────────────────────────┐    │
│  │                                                      │    │
│  │  ( ● ) 💵 كاش عند الوصول                             │    │
│  │        ← Default if no Deposit required              │    │
│  │                                                      │    │
│  │  ( ○ ) 📱 فودافون كاش  ← "اكسب +٥٪ كوينز إضافية"  │    │
│  │                                                      │    │
│  │  ( ○ ) 🏦 إنستا باي    ← "اكسب +٥٪ كوينز إضافية"  │    │
│  │                                                      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─ طرق أخرى ──────────────────────────────────────────┐    │
│  │                                                      │    │
│  │  ( ○ ) 💳 بطاقة ائتمان/خصم  ← "+٥٪ كوينز إضافية"  │    │
│  │                                                      │    │
│  │  ( ○ ) 🏷️ بطاقة ميزة       ← "+٥٪ كوينز إضافية"   │    │
│  │                                                      │    │
│  │  ( ○ ) 🟡 فوري (كود مرجعي)  ← "+٥٪ كوينز إضافية"  │    │
│  │                                                      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─ خصم كوينز بوكي ────────────────────────────────────┐    │
│  │                                                      │    │
│  │  رصيدك: 🪙 750 Booky Coins                          │    │
│  │  [ ○ استخدم كوينز ] → Max 30% of Booking value      │    │
│  │                                                      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  IF DEPOSIT REQUIRED:                                        │
│  ⚠️ "الخدمة دي بتطلب عربون [X] ج.م. الكاش مش متاح."       │
│  → Cash option hidden. Digital methods only.                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Cash on Arrival — Logic & No-Show Tracking

### When Cash is Available

| Condition | Cash Allowed? |
|-----------|--------------|
| Service does NOT require Deposit | ✅ Yes (default) |
| Service requires Deposit | ❌ No — Deposit must be digital |
| Merchant is in Trial Mode | ✅ Yes (only option — Trial Merchants can't collect Deposits) |
| Client has 3+ no-shows in 30 days | ⚠️ Warning shown, but still allowed |

### Cash Booking Flow

```
CLIENT SELECTS CASH
         │
         ▼
BOOKING CONFIRMED (status: PENDING → CONFIRMED)
         │
         ▼  (No payment collected by platform)
CLIENT ARRIVES AT MERCHANT
         │
         ├─ Client shows up → Merchant marks COMPLETED
         │       → Booky Coins earned (24h delay)
         │       → Merchant collects cash directly
         │       → Platform commission: INVOICED monthly (see §8)
         │
         └─ Client NO-SHOWS → Merchant marks NO_SHOW
                 → Client notified: "⚠️ تم تسجيل عدم حضورك"
                 → No-show counter incremented
                 → Rank demotion check (3+ in 30 days)
                 → NO revenue protection for Merchant (no Deposit)
```

### No-Show Tracking System

| Metric | Value |
|--------|-------|
| No-Show Window | Merchant can mark no-show within **2 hours** after Slot time |
| Client Notification | Instant push + SMS: "⚠️ اتسجل عدم حضورك لحجز [Service] في [Merchant]" |
| No-Show Counter | Rolling 30-day window |
| Rank Impact | 3+ no-shows → demote one Rank (see Master §8) |
| Cash Restriction | After 5+ no-shows in 90 days: Cash option disabled. Must pay Deposit for all future Bookings. |

### No-Show Escalation Ladder

```
NO-SHOW #1:
  → Notification: "حصل ظرف؟ لو مش هتقدر تحضر، إلغي قبلها."
  → No penalty (grace period)

NO-SHOW #2:
  → Notification: "⚠️ دي تاني مرة. لو حصل تالت مرة، رتبتك هتتأثر."
  → Warning badge on profile (visible to Client only)

NO-SHOW #3 (in 30 days):
  → Notification: "❌ اتخفضت رتبتك بسبب عدم الحضور المتكرر."
  → Rank demotion by one Rank
  → "Cash on Arrival" requires Deposit for 60 days (forced digital)

NO-SHOW #5+ (in 90 days):
  → Cash option fully disabled
  → All Bookings require Deposit
  → Support review triggered
  → Possible temporary suspension
```

### Why Cash Must Stay

> **Egyptian Reality:** Removing cash alienates 72% of the population. Instead, we use **behavioral nudges** to shift Clients toward digital:
> - "+5% كوينز إضافية" badge on all digital methods.
> - Cash Clients see: "💡 لو دفعت أونلاين، هتكسب كوينز أكتر!" on every checkout.
> - Post-Booking: "لو دفعت أونلاين المرة الجاية، هتكسب [X] كوينز بدل [Y]."

---

## 4. Online Payments — Card / Meeza Integration

### Integration Partner: Paymob

| Attribute | Value |
|-----------|-------|
| **Provider** | Paymob (Egypt's leading payment gateway) |
| **Supported Methods** | Visa, Mastercard, Meeza, Vodafone Cash, Fawry, ValU |
| **3D Secure** | ✅ Mandatory for all card transactions |
| **PCI DSS** | Paymob handles card data. Booky never touches PAN. |
| **Settlement** | T+1 (next business day) to Booky's merchant account |
| **API** | REST API v2 with webhooks for payment status |
| **Test Environment** | Full sandbox with test cards |

### Card Payment Flow

```
CLIENT SELECTS "بطاقة ائتمان/خصم" OR "بطاقة ميزة"
         │
         ▼
BOOKY BACKEND → Paymob API: Create Payment Intention
  → Amount: Deposit amount (or full if no Deposit)
  → Currency: EGP
  → Merchant ID: Booky's Paymob account
  → Order ID: booking_id
         │
         ▼
PAYMOB RETURNS → iframe URL / redirect URL
         │
         ▼
CLIENT → Paymob Hosted Payment Page (3D Secure)
  → Enters card details (never on Booky's servers)
  → 3D Secure OTP from bank
  → Submits
         │
         ▼
PAYMOB → Webhook to Booky: TRANSACTION_RESULT
  → success: true/false
  → transaction_id
  → amount_cents (EGP × 100)
         │
         ├─ SUCCESS:
         │    → Booking status: CONFIRMED
         │    → Deposit held in Booky Escrow
         │    → Client notification: "✅ تم تأكيد حجزك — العربون [X] ج.م"
         │    → +5% bonus Booky Coins flagged for post-completion
         │
         └─ FAILURE:
              → Booking stays PENDING (3-minute hold on Slot)
              → Client sees: "الدفع مش تم. جرب تاني أو اختار طريقة تانية."
              → 2 retries allowed before Slot released
              → After 3 failures: Slot released, Booking cancelled
```

### Meeza Card — Special Handling

| Rule | Detail |
|------|--------|
| **Why Meeza Matters** | 45M+ cards issued, government push for financial inclusion |
| **Fee Structure** | Lower interchange than Visa/MC (0.5% vs 2.5%) |
| **Promotion** | "ادفع بميزة — ٠٪ رسوم إضافية!" |
| **Integration** | Via Paymob (same API, different `payment_method_type`) |
| **Refund** | Supported, same flow as Visa/MC |

### Transaction Fee Summary (Platform Cost)

| Method | Paymob Fee | Booky Absorbs? | Client Sees |
|--------|-----------|---------------|-------------|
| Visa/MC Credit | 2.75% + 1 EGP | ✅ Yes | No surcharge |
| Visa/MC Debit | 1.5% + 1 EGP | ✅ Yes | No surcharge |
| Meeza | 0.5% + 0.50 EGP | ✅ Yes | No surcharge |
| Vodafone Cash | 1% | ✅ Yes | No surcharge |
| InstaPay | 3 EGP flat | ✅ Yes | No surcharge |
| Fawry | 2% (min 2 EGP) | ✅ Yes | No surcharge |

> **Policy:** Booky **never** charges the Client extra for payment method choice. All gateway fees are absorbed by the platform and factored into the commission model.

---

## 5. Mobile Wallets — Vodafone Cash & InstaPay

### 5.1 Vodafone Cash

> Egypt's #1 mobile wallet. 28M+ users. Critical for the 72% unbanked.

#### Flow

```
CLIENT SELECTS "فودافون كاش"
         │
         ▼
BOOKY BACKEND → Paymob API: Create VF Cash Payment
  → Amount: [Deposit or Full]
  → Phone: Client's registered VF Cash number
         │
         ▼
PAYMOB → Sends STK Push to Client's phone
  (SIM Toolkit push notification on the phone)
         │
         ▼
CLIENT'S PHONE → VF Cash PIN prompt appears
  → Client enters 6-digit VF Cash PIN
  → VF Cash deducts from wallet balance
         │
         ▼
VF CASH → Confirms to Paymob → Webhook to Booky
         │
         ├─ SUCCESS:
         │    → Booking CONFIRMED
         │    → Notification: "✅ تم الدفع عن طريق فودافون كاش"
         │
         └─ FAILURE (insufficient balance / timeout / PIN wrong):
              → "رصيد الفودافون كاش مش كفاية. اشحن أو جرب طريقة تانية."
              → Slot held for 3 minutes
```

#### VF Cash Edge Cases

| Case | Handling |
|------|---------|
| Client's phone is not Vodafone | Show warning: "فودافون كاش متاح لأرقام فودافون بس. جرب إنستا باي." |
| VF Cash service is down | Detect via Paymob health check. Hide option. Show: "فودافون كاش مش متاح حالياً." |
| STK Push timeout (30s) | Retry once. Then offer manual USSD: "اطلب *9*{amount}#" |
| Client under 18 (no VF Cash) | Fallback to Fawry cash code |

### 5.2 InstaPay

> National instant bank transfer. Fastest-growing payment method. Supported by all Egyptian banks.

#### Flow

```
CLIENT SELECTS "إنستا باي"
         │
         ▼
BOOKY BACKEND → Generate InstaPay Payment Request
  → Creates unique payment reference
  → Amount: [Deposit or Full]
         │
         ▼
CLIENT REDIRECTED → InstaPay app / bank app
  → Selects bank account
  → Confirms transfer
  → Instant settlement
         │
         ▼
INSTAPAY → Webhook to Booky: Payment confirmed
         │
         ├─ SUCCESS:
         │    → Booking CONFIRMED
         │    → Notification: "✅ تم الدفع عن طريق إنستا باي"
         │
         └─ FAILURE / TIMEOUT (5 minutes):
              → "مستنيين التحويل. لو خلصته، هنأكد في دقيقة."
              → Background polling for 10 minutes
              → After 10 min: Slot released if no confirmation
```

#### InstaPay Advantages for Booky

| Advantage | Detail |
|-----------|--------|
| **Instant Settlement** | Money in Booky's account immediately (no T+1 delay) |
| **Low Fees** | 3 EGP flat per transaction (cheaper than cards for high-value) |
| **Bank-Agnostic** | Works with all 30+ Egyptian banks |
| **Growing Adoption** | 15M+ users, government-backed |

---

## 6. The Deposit (العربون) System — Detailed Logic

### Why Deposits Exist

```
┌──────────────────────────────────────────────────────────────┐
│                    THE NO-SHOW CRISIS                          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   PROBLEM:                                                    │
│   30% of Bookings in Egypt → No-Show                          │
│   Annual loss to Egyptian businesses: ₤2.5 Billion            │
│                                                               │
│   SOLUTION:                                                   │
│   Require a Deposit (العربون) for high-value Services.        │
│   If Client shows up → Deposit applied to final bill.         │
│   If Client no-shows → Deposit goes to Merchant.              │
│                                                               │
│   RESULT:                                                     │
│   No-Show rate drops from 30% → < 5%                          │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Deposit Rules by Sector

| Sector | Deposit % | Cancellation Window | When Required |
|--------|-----------|---------------------|---------------|
| **Sports & Fitness** | 20% | 4 hours before Slot | Bookings > 200 EGP |
| **Health & Beauty** | 25% | 24 hours before Slot | Premium Services (> 150 EGP) |
| **Entertainment** | 30% | 48 hours before Slot | Always (highest no-show Sector) |
| **Home Services** | 15% | 2 hours before Slot | Scheduled appointments |
| **Education & Work** | 25% | 24 hours before Slot | Always |
| **Events & Celebrations** | 50-100% | 7 days before event | Always (high-ticket) |

### Deposit Calculation

```python
def calculate_deposit(service_price, sector_id, service_flags):
    """
    Calculate Deposit amount for a Booking.
    All amounts in EGP integers.
    """
    deposit_rates = {
        'sports':         {'rate': 0.20, 'min_price': 200, 'cancel_hours': 4},
        'health_beauty':  {'rate': 0.25, 'min_price': 150, 'cancel_hours': 24},
        'entertainment':  {'rate': 0.30, 'min_price': 0,   'cancel_hours': 48},
        'home_services':  {'rate': 0.15, 'min_price': 0,   'cancel_hours': 2},
        'education':      {'rate': 0.25, 'min_price': 0,   'cancel_hours': 24},
        'events':         {'rate': 0.50, 'min_price': 0,   'cancel_hours': 168},  # 7 days
    }

    config = deposit_rates[sector_id]

    # Check if Deposit is required
    if service_price < config['min_price']:
        return {'required': False, 'amount': 0}

    # Calculate
    deposit = int(service_price * config['rate'])

    # Events can be up to 100% for weddings/large events
    if sector_id == 'events' and service_flags.get('is_high_ticket'):
        deposit = service_price  # 100% Deposit

    return {
        'required': True,
        'amount': deposit,
        'cancel_window_hours': config['cancel_hours'],
        'remaining_at_arrival': service_price - deposit,
    }
```

### Deposit Payment Rules

| Rule | Value |
|------|-------|
| **Payment Methods** | Digital ONLY: VF Cash, InstaPay, Card, Meeza, Fawry |
| **Cash for Deposits** | ❌ NEVER. Deposits must create a digital audit trail. |
| **Booky Coins for Deposits** | ❌ NEVER. Deposits must be real money. |
| **Deposit on Discounted Price?** | ❌ Deposit = % of ORIGINAL price (before Booky Coins discounts). |
| **Minimum Deposit** | 10 EGP (even if percentage calculates lower) |
| **Maximum Deposit** | 100% of Service price (Events Sector only) |
| **Deposit Hold** | In Booky Escrow account (not released to Merchant until completion) |

### Deposit Lifecycle

```
DEPOSIT COLLECTED AT BOOKING CONFIRMATION
         │
         ▼
HELD IN BOOKY ESCROW
         │
    ┌────┴────────────┬──────────────┬────────────────┐
    │                 │              │                │
    ▼                 ▼              ▼                ▼
CLIENT SHOWS      CLIENT CANCELS  CLIENT CANCELS   CLIENT
(Normal flow)     (Within window) (Outside window)  NO-SHOWS
    │                 │              │                │
    ▼                 ▼              ▼                ▼
Deposit applied   FULL REFUND     DEPOSIT           DEPOSIT
to final bill     to Client       FORFEITED         FORFEITED
    │                              to Merchant       to Merchant
    ▼                                  │                │
Merchant collects                      ▼                ▼
remaining balance               Merchant              Merchant
at arrival                      receives               receives
    │                           Deposit                Deposit
    ▼                           within 24h             within 24h
BOOKING COMPLETE
```

### High-Value Booking: Wedding Hall Example

```
SERVICE: قاعة أفراح "النخبة" — حفل فرح كامل
PRICE: 25,000 EGP
SECTOR: Events & Celebrations
DEPOSIT: 50% = 12,500 EGP

BOOKING FLOW:
  1. Client selects wedding Service (25,000 EGP)
  2. Deposit required: 12,500 EGP (50%)
  3. Cash NOT available — must pay Deposit digitally
  4. Client pays 12,500 EGP via InstaPay
  5. Booking CONFIRMED
  6. 7-day cancellation window starts

IF CLIENT CANCELS:
  • Within 7 days: Full 12,500 EGP refund
  • After 7 days: Deposit forfeited to Merchant

IF CLIENT SHOWS:
  • 12,500 EGP applied to bill
  • Remaining 12,500 EGP paid at venue (any method)
  • Booky Coins earned on full 25,000 EGP ✅

IF CLIENT NO-SHOWS:
  • 12,500 EGP released to Merchant
  • Client: no-show recorded, Rank impact
  • Merchant can relist the date
```

---

## 7. Online Payment Loyalty Bonus (+5% Booky Coins)

### The Incentive

> **Any Client who pays online (not cash) earns +5% extra Booky Coins on that Booking.**

### How It Works

```
NORMAL EARNING (Cash):
  Booking 200 EGP × 1x (Free tier) = 200 Booky Coins

WITH ONLINE BONUS:
  Booking 200 EGP × 1x (Free tier) = 200 Booky Coins
  +5% online bonus: 200 × 0.05 = +10 Booky Coins
  Total: 210 Booky Coins ✅

WITH VIP MULTIPLIER + ONLINE BONUS:
  Booking 200 EGP × 5x (VIP tier) = 1,000 Booky Coins
  +5% online bonus: 1,000 × 0.05 = +50 Booky Coins
  Total: 1,050 Booky Coins 🔥
```

### Rules

| Rule | Value |
|------|-------|
| **Bonus Rate** | +5% of Booky Coins earned from that Booking |
| **Applied After Multiplier** | Yes — bonus calculated on multiplied amount |
| **Eligible Methods** | All non-cash: VF Cash, InstaPay, Card, Meeza, Fawry |
| **Cash Eligible?** | ❌ No (incentive to go digital) |
| **Booky Coins Partial Pay** | If Client uses Booky Coins + digital method, bonus applies to digital portion |
| **Display** | Green badge on digital methods: "اكسب +٥٪ كوينز إضافية" |
| **Ledger Entry** | `type: 'earn_online_bonus'`, separate from main earning |

### Nudge Messages

| Trigger | Message (Arabic) |
|---------|-------------------|
| Cash selected at checkout | "💡 لو دفعت أونلاين، هتكسب +٥٪ كوينز إضافية!" |
| Post cash Booking | "المرة الجاية ادفع أونلاين واكسب [X] كوينز بدل [Y]!" |
| Client has 3+ consecutive cash Bookings | "جرب الدفع بفودافون كاش — سهل، سريع، وكوينز أكتر!" |

---

## 8. Commission Model — Auto-Deduction vs. Invoicing

### The Two Commission Collection Methods

> **Challenge:** Cash Bookings have no digital payment to deduct commission from. We need two parallel commission models.

```
┌──────────────────────────────────────────────────────────────┐
│              COMMISSION COLLECTION — DUAL MODEL                │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   PATH A: ONLINE PAYMENT (Digital Bookings)                   │
│   ─────────────────────────────────────────                   │
│   Commission auto-deducted BEFORE funds hit Merchant Wallet.  │
│   Merchant sees net amount. Zero friction.                    │
│                                                               │
│   Example:                                                    │
│   Client pays 200 EGP online                                  │
│   Booky deducts 5% = 10 EGP                                  │
│   Merchant Wallet receives: 190 EGP                           │
│                                                               │
│   ─────────────────────────────────────────────────────────   │
│                                                               │
│   PATH B: CASH PAYMENT (Cash Bookings)                        │
│   ─────────────────────────────────────                       │
│   Merchant collects full amount from Client directly.         │
│   Commission invoiced monthly. Due within 15 days.            │
│                                                               │
│   Example:                                                    │
│   Client pays 200 EGP cash at arrival                         │
│   End of month: Booky invoices Merchant for all cash          │
│   commissions: e.g., 50 cash Bookings × avg 8 EGP = 400 EGP │
│   Merchant pays invoice via VF Cash / InstaPay / auto-deduct  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Commission Rates

#### Fixed Fee Model (High-Frequency, Low-Value Services)

| Service Type | Fixed Fee per Booking | Applied When |
|--------------|----------------------|--------------|
| Barber / Haircut | 20 EGP | Service price < 200 EGP |
| Gym Day Pass | 25 EGP | Service price < 200 EGP |
| Nail Booking | 20 EGP | Service price < 200 EGP |
| Small Home Repair | 30 EGP | Service price < 300 EGP |

#### Percentage Model (High-Ticket, Variable-Value Services)

| Service Type | Commission % | Applied When |
|--------------|-------------|--------------|
| Football Pitch | 5% | Service price ≥ 200 EGP |
| Event Venue | 8% | All event Bookings |
| Wedding Service | 10% | All wedding Bookings |
| Corporate Booking | 7% | All corporate Bookings |
| Large Home Project | 5% | Service price ≥ 500 EGP |

#### Subscription Tier Discount on Commission

| Merchant Subscription Tier | Commission Discount | Example (200 EGP, 5% rate) |
|---------------------------|--------------------|-----------------------------|
| Start (البداية) — Free | Standard rate | 10 EGP commission |
| Pro (المحترف) — 120 EGP/mo | -1% discount | 8 EGP commission (4%) |
| Pasha (الباشا) — 450 EGP/mo | -2% discount | 6 EGP commission (3%) |

### Auto-Deduction (Online Payments)

```
BOOKING COMPLETED (Online Payment)
         │
         ▼
SYSTEM CALCULATES COMMISSION:
  Booking value: 200 EGP
  Commission rate: 5% (Sports pitch)
  Tier discount: -1% (Pro tier)
  Net rate: 4%
  Commission: 200 × 0.04 = 8 EGP
         │
         ▼
WALLET CREDIT:
  Gross: 200 EGP
  Commission: -8 EGP
  Net to Merchant Wallet: 192 EGP
         │
         ▼
MERCHANT SEES IN WALLET:
  "+192 ج.م  حجز #BK-260214-0023 (بعد العمولة)"
  → Tap to expand: "إجمالي ٢٠٠ ج.م — عمولة ٨ ج.م (٤٪)"
```

### Monthly Invoice (Cash Payments)

```
END OF MONTH (1st of following month)
         │
         ▼
SYSTEM GENERATES INVOICE:
  Merchant: صالون أحمد
  Period: February 2026
  Cash Bookings: 45
  Total Cash Revenue: 6,750 EGP
  Commission (avg 5%): 337 EGP
  Tier discount (-1%): -67 EGP
  ──────────────────────
  Invoice Total: 270 EGP
  Due Date: February 15, 2026
         │
         ▼
INVOICE SENT:
  → In-app notification
  → WhatsApp message with PDF
  → Email with PDF
         │
         ▼
PAYMENT OPTIONS:
  1. Auto-deduct from Wallet (if balance available) ← Preferred
  2. Pay via VF Cash (reference code)
  3. Pay via InstaPay (bank transfer)
  4. Agent collection (Digital Immigrants only)
         │
         ├─ PAID ON TIME:
         │    → Receipt generated
         │    → "شكراً! فاتورتك اتدفعت ✅"
         │
         └─ OVERDUE (15+ days):
              → Day 15: SMS reminder
              → Day 20: Booking limit reduced to 5/day
              → Day 30: New Bookings frozen until paid
              → Day 45: Account suspended (existing Bookings honored)
```

---

## 9. Refund & Cancellation Logic

### Refund Matrix

| Scenario | Client Action | Timing | Refund | Method |
|----------|-------------|--------|--------|--------|
| Cancel within window | Client cancels Booking | Before cancellation deadline | ✅ Full Deposit refund | Original payment method |
| Cancel outside window | Client cancels Booking | After cancellation deadline | ❌ Deposit forfeited to Merchant | N/A |
| Merchant cancels | Merchant cancels Booking | Any time | ✅ Full Deposit refund + 50 bonus Booky Coins | Original method + Booky Coins credit |
| Service not delivered | Client disputes | Post-Slot time | ✅ Full refund (after review) | Original payment method |
| Double charge | System error | Any time | ✅ Immediate full refund | Original payment method |
| Merchant no-show | Merchant doesn't show | Post-Slot time | ✅ Full refund + 100 bonus Booky Coins | Original method + Booky Coins credit |

### Refund Processing Times

| Payment Method | Refund Time | Notes |
|----------------|-------------|-------|
| Vodafone Cash | Instant – 2 hours | To same VF Cash wallet |
| InstaPay | Instant – 1 hour | To same bank account |
| Credit/Debit Card | 3-7 business days | Bank processing time |
| Meeza Card | 3-5 business days | National debit processing |
| Fawry | 1-3 business days | Fawry credit or cash at agent |
| Booky Coins | Instant | Booky Coins returned to balance |

### Cancellation Window

```
BOOKING CONFIRMED
    │
    ├─ WITHIN CANCELLATION WINDOW:
    │   Client taps "إلغاء الحجز"
    │   → Confirmation: "متأكد؟ هتسترد العربون كامل."
    │   → Refund processed automatically
    │   → Slot released for other Clients
    │   → Merchant notified: "العميل [Name] ألغى حجزه."
    │
    └─ OUTSIDE CANCELLATION WINDOW:
        Client taps "إلغاء الحجز"
        → Warning: "⚠️ فات ميعاد الإلغاء المجاني. العربون [X] ج.م مش هيترجع."
        → Client confirms cancellation
        → Deposit transferred to Merchant
        → Slot released
        → Merchant receives Deposit: "🛡️ اتحول لك عربون [X] ج.م بسبب إلغاء متأخر."
```

### Dispute Resolution

| Step | Action | SLA |
|------|--------|-----|
| 1. Client raises dispute | In-app: "الخدمة مكنتش زي المتفق عليه" | Immediate |
| 2. Booky reviews | Support team contacts both parties | 24 hours |
| 3. Evidence collected | Photos, Inquiry history, Booking details | 48 hours |
| 4. Decision | Refund, partial refund, or rejected | 72 hours |
| 5. Resolution | Funds moved accordingly | Immediate after decision |

---

## 10. Payment Gateway Integration Plan

### Phase 1: Paymob (Primary Gateway)

| Integration | Priority | Timeline |
|-------------|----------|----------|
| Card Payments (Visa/MC/Meeza) | 🔴 P0 | Week 1-2 |
| Vodafone Cash (STK Push) | 🔴 P0 | Week 1-2 |
| Fawry (Reference Code) | 🟡 P1 | Week 3-4 |
| InstaPay | 🟡 P1 | Week 3-4 |
| Webhooks & Reconciliation | 🔴 P0 | Week 2-3 |
| Refund API | 🔴 P0 | Week 2-3 |
| Payout API (to Merchants) | 🔴 P0 | Week 3-4 |

### Phase 2: Fallback & Expansion

| Integration | Priority | Timeline |
|-------------|----------|----------|
| Fawry as fallback gateway | 🟡 P1 | Month 2 |
| ValU (BNPL — Buy Now Pay Later) | 🟢 P2 | Month 3 |
| Apple Pay / Google Pay | 🟢 P2 | Month 4 |

### API Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│              │     │              │     │              │
│   BOOKY      │────→│   PAYMOB     │────→│   BANKS /    │
│   BACKEND    │     │   GATEWAY    │     │   WALLETS    │
│              │←────│              │←────│              │
│              │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │
       │  Webhooks          │  Settlement
       ▼                    ▼
┌──────────────┐     ┌──────────────┐
│  BOOKY DB    │     │  BOOKY       │
│  (Ledger)    │     │  ESCROW      │
│              │     │  ACCOUNT     │
└──────────────┘     └──────────────┘
```

### Paymob Integration Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/auth/tokens` | Authenticate with Paymob |
| `POST /api/ecommerce/orders` | Create order (Booking) |
| `POST /api/acceptance/payment_keys` | Generate payment token |
| `POST /api/acceptance/payments/pay` | Process VF Cash / wallet |
| `GET /api/acceptance/transactions/{id}` | Check transaction status |
| `POST /api/acceptance/void_refund/refund` | Process refund |
| `POST /api/disbursement/disburse` | Merchant payout |

---

## 11. Reconciliation & Financial Controls

### Daily Reconciliation

```
EVERY DAY AT 02:00 AM (Cairo time):
─────────────────────────────────────

1. MATCH: Paymob transactions ↔ Booky ledger entries
   → Flag mismatches for manual review

2. VERIFY: Escrow balance = Sum of all pending Deposits
   → Alert if discrepancy > 0

3. SETTLE: Move completed Booking funds to Merchant Wallets
   → After 24h hold period

4. EXPIRE: Release Slots for unpaid Bookings (3-min payment timeout)

5. REPORT: Generate daily financial summary
   → Total collections, refunds, payouts, commissions, escrow balance
```

### Financial Controls

| Control | Rule |
|---------|------|
| **Dual Approval** | Refunds > 1,000 EGP require 2 support agents |
| **Daily Payout Cap** | Per Merchant: 50,000 EGP/day (raise with KYC) |
| **Platform Float** | Maximum 72h hold on any funds |
| **Audit Trail** | Every financial event logged with actor, timestamp, reason |
| **Segregation** | Merchant funds held in segregated escrow account (not commingled) |
| **14% VAT** | Applied to all commissions and platform fees. Invoice to Merchant. |

### Monthly Financial Report (Internal)

```
FEBRUARY 2026 — FINANCIAL SUMMARY
──────────────────────────────────

COLLECTIONS:
  Online Deposits collected:     125,000 EGP
  Online full payments:           85,000 EGP
  Total digital collections:     210,000 EGP

DISBURSEMENTS:
  Merchant payouts:              185,000 EGP
  Client refunds:                 12,000 EGP
  Total disbursements:           197,000 EGP

PLATFORM REVENUE:
  Online commissions:             10,500 EGP
  Cash commissions invoiced:       4,200 EGP
  Cash commissions collected:      3,800 EGP
  Gateway fees paid:              -2,100 EGP
  ──────────────────────
  Net Platform Revenue:           12,400 EGP

ESCROW STATUS:
  Current escrow balance:         23,000 EGP
  Pending settlements:            18,000 EGP
  Disputed holds:                  5,000 EGP
```

---

## 12. Data Model — Financial Tables

### Payments Table

```sql
CREATE TABLE payments (
    payment_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id          UUID NOT NULL REFERENCES bookings(booking_id),
    client_id           UUID NOT NULL REFERENCES clients(client_id),
    merchant_id         UUID NOT NULL REFERENCES merchants(merchant_id),

    -- Amount
    amount_egp          INTEGER NOT NULL,               -- Gross amount in EGP
    payment_type        VARCHAR(20) NOT NULL,
    -- payment_type: 'deposit' | 'full_payment' | 'remaining_balance'
    payment_method      VARCHAR(20) NOT NULL,
    -- payment_method: 'cash' | 'vodafone_cash' | 'instapay' | 'credit_card' |
    --                 'debit_card' | 'meeza' | 'fawry' | 'booky_coins'
    status              VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'partially_refunded'

    -- Gateway
    gateway_provider    VARCHAR(20),                     -- 'paymob' | 'fawry' | null (cash)
    gateway_txn_id      VARCHAR(100),                    -- External transaction ID
    gateway_response    JSONB,                           -- Raw gateway response

    -- Booky Coins
    coins_redeemed      INTEGER DEFAULT 0,               -- Booky Coins used
    coins_discount_egp  INTEGER DEFAULT 0,               -- EGP value of Booky Coins
    online_bonus_coins  INTEGER DEFAULT 0,               -- +5% bonus Booky Coins earned

    -- Timestamps
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    completed_at        TIMESTAMPTZ,
    refunded_at         TIMESTAMPTZ
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_client ON payments(client_id);
CREATE INDEX idx_payments_merchant ON payments(merchant_id);
CREATE INDEX idx_payments_status ON payments(status);
```

### Merchant Wallet Table

```sql
CREATE TABLE merchant_wallets (
    wallet_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id         UUID NOT NULL UNIQUE REFERENCES merchants(merchant_id),

    available_balance   INTEGER NOT NULL DEFAULT 0,      -- Withdrawable (EGP)
    pending_balance     INTEGER NOT NULL DEFAULT 0,      -- In escrow (EGP)
    total_earned        INTEGER NOT NULL DEFAULT 0,      -- Lifetime gross
    total_commission    INTEGER NOT NULL DEFAULT 0,      -- Lifetime commission paid
    total_withdrawn     INTEGER NOT NULL DEFAULT 0,      -- Lifetime withdrawals

    updated_at          TIMESTAMPTZ DEFAULT NOW()
);
```

### Wallet Transactions (Ledger)

```sql
CREATE TABLE wallet_transactions (
    txn_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id         UUID NOT NULL REFERENCES merchants(merchant_id),
    type                VARCHAR(30) NOT NULL,
    -- type: 'booking_credit' | 'commission_deduct' | 'deposit_release' |
    --       'deposit_forfeit' | 'payout' | 'refund_debit' | 'invoice_debit' |
    --       'adjustment'
    amount              INTEGER NOT NULL,                 -- Positive = credit, Negative = debit
    balance_after       INTEGER NOT NULL,                 -- Running balance
    reference_id        UUID,                             -- FK to payment_id, booking_id, payout_id
    reference_type      VARCHAR(20),                      -- 'payment' | 'booking' | 'payout' | 'invoice'
    description         TEXT,                             -- Human-readable
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Append-only. NEVER update or delete.
CREATE INDEX idx_wallet_txn_merchant ON wallet_transactions(merchant_id);
CREATE INDEX idx_wallet_txn_type ON wallet_transactions(type);
```

### Payout Requests

```sql
CREATE TABLE payout_requests (
    payout_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id         UUID NOT NULL REFERENCES merchants(merchant_id),
    amount_egp          INTEGER NOT NULL,
    fee_egp             INTEGER NOT NULL DEFAULT 0,
    net_amount          INTEGER NOT NULL,                 -- amount - fee
    method              VARCHAR(20) NOT NULL,
    -- method: 'vodafone_cash' | 'instapay' | 'bank_transfer'
    destination         VARCHAR(100) NOT NULL,            -- Phone number or account number
    status              VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- status: 'pending' | 'processing' | 'completed' | 'failed'
    gateway_txn_id      VARCHAR(100),
    requested_at        TIMESTAMPTZ DEFAULT NOW(),
    completed_at        TIMESTAMPTZ,
    failed_reason       TEXT
);

CREATE INDEX idx_payouts_merchant ON payout_requests(merchant_id);
CREATE INDEX idx_payouts_status ON payout_requests(status);
```

### Commission Invoices (Cash Bookings)

```sql
CREATE TABLE commission_invoices (
    invoice_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id         UUID NOT NULL REFERENCES merchants(merchant_id),
    invoice_number      VARCHAR(20) NOT NULL UNIQUE,      -- INV-YYMM-XXXX
    period_start        DATE NOT NULL,
    period_end          DATE NOT NULL,
    cash_bookings_count INTEGER NOT NULL,
    gross_revenue_egp   INTEGER NOT NULL,
    commission_egp      INTEGER NOT NULL,
    tier_discount_egp   INTEGER DEFAULT 0,
    vat_egp             INTEGER NOT NULL,                  -- 14% VAT
    total_due_egp       INTEGER NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'issued',
    -- status: 'issued' | 'sent' | 'paid' | 'overdue' | 'disputed'
    due_date            DATE NOT NULL,
    paid_at             TIMESTAMPTZ,
    payment_method      VARCHAR(20),
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_merchant ON commission_invoices(merchant_id);
CREATE INDEX idx_invoices_status ON commission_invoices(status);
```

---

## 13. Gherkin Scenarios

### Scenario 1: Online Deposit Payment via Vodafone Cash

```gherkin
Feature: Payment Gateway — Online Deposit

  Scenario: Client pays Deposit via Vodafone Cash
    Given a Client is booking a football pitch for 300 EGP
    And the Sector is "sports" with Deposit rate 20%
    And Deposit required: 60 EGP

    When the Client selects "فودافون كاش" as payment method
    Then the system initiates a Paymob VF Cash STK Push for 60 EGP
    And the Client enters their 6-digit VF Cash PIN on their phone
    And the payment is confirmed via Paymob webhook

    Then the Booking status is updated to CONFIRMED
    And 60 EGP is held in Booky Escrow
    And the Client is notified: "✅ تم تأكيد حجزك — العربون 60 ج.م"
    And the Client earns an online payment bonus flag: +5% Booky Coins on completion
```

### Scenario 2: Cash on Arrival with No-Show

```gherkin
  Scenario: Client books with cash and no-shows
    Given a Client has booked a barber Booking for 80 EGP (cash, no Deposit)
    And the Booking is CONFIRMED with status CASH_ON_ARRIVAL

    When the Slot time passes and the Client does not arrive
    And the Merchant marks the Booking as NO_SHOW within 2 hours

    Then the Client's no-show counter is incremented
    And the Client is notified: "⚠️ اتسجل عدم حضورك لحجز حلاقة في [Merchant]"
    And the Merchant receives no Deposit compensation (cash Booking)
    And the system checks if the Client has 3+ no-shows in 30 days for Rank demotion
```

### Scenario 3: Commission Invoice for Cash Bookings

```gherkin
  Scenario: Monthly commission invoice generated for cash Bookings
    Given a Merchant "صالون أحمد" had 45 cash Bookings in February 2026
    And total cash revenue was 6,750 EGP
    And the Merchant is on Pro Subscription Tier (-1% commission discount)

    When March 1st arrives and the monthly invoice job runs
    Then the system generates an invoice:
      | field              | value      |
      | cash_bookings      | 45         |
      | gross_revenue      | 6,750 EGP  |
      | base_commission    | 337 EGP    |
      | tier_discount      | -67 EGP    |
      | invoice_total      | 270 EGP    |
      | due_date           | 2026-03-15 |
    And the invoice is sent via in-app, WhatsApp, and email
    And payment options include: auto-deduct from Wallet, VF Cash, InstaPay, or agent collection
```

---

## 14. Edge Cases

| # | Edge Case | Business Rule |
|---|-----------|---------------|
| 1 | **VF Cash STK Push times out (30s)** | Retry once. Then offer manual USSD: "اطلب *9*{amount}#". After 2 failures, suggest alternative method. |
| 2 | **InstaPay confirmation delayed > 10 min** | Slot released. Booking cancelled. If payment arrives later, auto-refund within 24h. |
| 3 | **Client pays with Meeza but card is expired** | Paymob rejects. Show: "البطاقة منتهية — جدد البطاقة أو استخدم طريقة تانية." |
| 4 | **Client double-taps pay button** | Idempotency key on payment creation. Second request returns same payment_id. Cannot be double-charged. |
| 5 | **Gateway down (Paymob outage)** | Detect via health check every 60s. Hide digital methods. Show cash only (if allowed). Banner: "الدفع الإلكتروني مش متاح حالياً." |
| 6 | **Deposit amount < 10 EGP (minimum)** | Force Deposit = 10 EGP. Example: 50 EGP Service × 15% = 7.5 EGP → 10 EGP Deposit. |
| 7 | **Client uses Booky Coins + Card for a Deposit-required Booking** | Booky Coins discount applied to remaining balance ONLY (not the Deposit). Deposit always = % of ORIGINAL price. |
| 8 | **Refund to expired card** | Paymob attempts refund → bank may issue check or credit to replacement card. Client notified: "الريفاند ممكن ياخد وقت أطول لو البطاقة اتغيرت." |
| 9 | **Commission invoice overdue > 45 days** | Account suspended. Existing Bookings honored (no Client impact). Reactivation requires full payment + 50 EGP late fee. |
| 10 | **Fawry code expires (24h window)** | Booking cancelled. Slot released. Client notified: "كود فوري انتهى — احجز تاني." |

---

## 15. Acceptance Criteria

### Cash on Arrival ✓

- [ ] Cash is the default payment method when no Deposit is required.
- [ ] Cash option is hidden when Deposit is required (digital methods only).
- [ ] No-show tracking: Merchant can mark no-show within 2 hours after Slot time.
- [ ] No-show escalation: Warning at #1, penalty notification at #2, Rank demotion at #3.
- [ ] After 5+ no-shows in 90 days, cash disabled — Deposit required for all Bookings.

### Online Payments ✓

- [ ] Card payments (Visa/MC/Meeza) via Paymob with 3D Secure.
- [ ] Vodafone Cash via STK Push with 30-second timeout and retry.
- [ ] InstaPay with instant settlement and 5-minute confirmation window.
- [ ] Fawry reference code generation with 24-hour payment window.
- [ ] No surcharge to Client for any payment method.
- [ ] +5% bonus Booky Coins for all online payments.

### Deposit System ✓

- [ ] Deposit percentage varies by Sector (20-100%).
- [ ] Deposit calculated on ORIGINAL price (before Booky Coins discounts).
- [ ] Cash and Booky Coins cannot be used for Deposits.
- [ ] Cancellation within window: full Deposit refund.
- [ ] Cancellation outside window: Deposit forfeited to Merchant.
- [ ] No-show: Deposit auto-transferred to Merchant within 24 hours.
- [ ] Deposit held in Escrow until Booking outcome determined.

### Commission Model ✓

- [ ] Online payments: Commission auto-deducted before Merchant Wallet credit.
- [ ] Cash payments: Commission invoiced monthly, due within 15 days.
- [ ] Subscription Tier-based discount: Start=standard, Pro=-1%, Pasha=-2%.
- [ ] 14% VAT applied to all commissions.
- [ ] Overdue invoices: escalation at Day 15, 20, 30, 45.

### Refunds ✓

- [ ] Refund to original payment method within SLA times.
- [ ] Merchant cancellation: full refund + 50 bonus Booky Coins to Client.
- [ ] Merchant no-show: full refund + 100 bonus Booky Coins to Client.
- [ ] Dispute resolution within 72 hours.

---

> **📌 Source of Truth:** This document aligns with [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md) §2 (Dictionary), §4 (Global Rules), §10 (Revenue & Commission), §11 (Deposit System). All terms (Client, Merchant, Service, Sector, Booking, Slot, Deposit, Booky Coins) are used as canonically defined. Financial rules: All amounts in EGP integers, all timestamps in UTC (displayed as EET).
>
> *Booky Center: بضغطة واحدة.. ميعادك في جيبك* ✨

