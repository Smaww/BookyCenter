# 📂 02-Client: Profile vs. Dashboard

## *What the Client Sees — Public Profile vs. Private Dashboard*

**Parent:** [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md)
**Version:** 1.0 | **Date:** February 15, 2026
**Persona:** The Client (العميل) — an authenticated end-user managing their Bookings, wallet, and preferences.

---

## Table of Contents

1. [Profile vs. Dashboard — The Distinction](#1-profile-vs-dashboard--the-distinction)
2. [The Public Profile (Minimal)](#2-the-public-profile-minimal)
3. [The Private Dashboard (Full)](#3-the-private-dashboard-full)
4. [My Bookings (حجوزاتي)](#4-my-bookings-حجوزاتي)
5. [My Wallet (محفظتي)](#5-my-wallet-محفظتي)
6. [My Favorites (المفضّلة)](#6-my-favorites-المفضّلة)
7. [One-Click Rebooking (احجز تاني)](#7-one-click-rebooking-احجز-تاني)
8. [Dashboard Navigation](#8-dashboard-navigation)
9. [Gherkin Scenarios](#9-gherkin-scenarios)
10. [Edge Cases](#10-edge-cases)

---

## 1. Profile vs. Dashboard — The Distinction

| Aspect | Public Profile | Private Dashboard |
|--------|---------------|-------------------|
| **Visibility** | Visible to Merchants when a Client makes a Booking or sends an Inquiry | Visible ONLY to the Client |
| **Purpose** | Identification (who is this Client?) | Self-management (manage my Bookings, money, preferences) |
| **Access** | Read-only for others | Full read/write for the Client |
| **Data scope** | Name, photo, Rank badge, review count | Bookings, wallet, favorites, settings, Booky Coins, notifications |

> **Key Principle:** Booky Center is NOT a social network. The Client's public profile is intentionally minimal — no feed, no followers, no public activity. The private dashboard is where the real value lives.

---

## 2. The Public Profile (Minimal)

### What Merchants See About a Client

When a Merchant receives a Booking or an Inquiry, they see the Client's **public card**:

```
┌───────────────────────────────────────────┐
│                                            │
│   [📷]  أحمد محمد                          │
│          🟢 معتمد (Regular)                │
│          ⭐ 12 تقييم                        │
│          📅 عضو من يناير 2026               │
│                                            │
└───────────────────────────────────────────┘
```

### Public Profile Fields

| Field | Source | Visible to Merchants? |
|-------|--------|----------------------|
| **Display Name** | Registration (Stage 1) | ✅ |
| **Profile Photo** | Uploaded or imported via Google/Facebook | ✅ |
| **Rank Badge** | Earned (Newbie 🔵 / Regular 🟢 / Pro ⚫ / Pasha 👑) | ✅ |
| **Review Count** | Aggregated from all completed Bookings | ✅ |
| **Member Since** | Registration date (month + year) | ✅ |
| **Phone Number** | Registration | ❌ Hidden until Booking confirmed |
| **Email** | Registration | ❌ Never visible |
| **Booking History** | System | ❌ Never visible to other Merchants |
| **Wallet Balance** | System | ❌ Never visible |
| **Subscription Tier** | System | ❌ Never visible |

> **Privacy Rule:** A Merchant can ONLY see the Client's phone number for confirmed Bookings at their business. They NEVER see the Client's full Booking history across other Merchants.

---

## 3. The Private Dashboard (Full)

### The Client's Home Screen

After login, the Client lands on their **Private Dashboard** — a personalized hub with everything they need.

```
┌──────────────────────────────────────────────────────────────┐
│  أهلاً أحمد 👋                                  🔔  ⚙️      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  📊 نظرة سريعة                                       │     │
│  │                                                      │     │
│  │  🔵 معتمد          ⭐ 12 تقييم       🪙 450 عملة     │     │
│  │  (Regular)        (Reviews)         (Booky Coins)   │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  ── الحجز القادم ───────────────────────────────────────── │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  ⚽ ملاعب الأهرام                                     │     │
│  │  ملعب كورة ساعة — الثلاثاء 18:00                     │     │
│  │                                                      │     │
│  │  [ عرض QR 📱 ]     [ تفاصيل ]     [ إلغاء ]         │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  ── احجز تاني ──────────────────────────────────────────── │
│  ┌────────┐  ┌────────┐  ┌────────┐                         │
│  │ ✂️ صالون │  │ 🦷 أسنان │  │ ⚽ ملعب │  ← Horizontal scroll │
│  │ جوليا   │  │ د.سمير  │  │ الأهرام │    (recent Merchants) │
│  │ [احجز↩] │  │ [احجز↩] │  │ [احجز↩] │                       │
│  └────────┘  └────────┘  └────────┘                         │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│  🏠    📅     ❤️    💰    👤                                  │
│  اكتشف  حجوزاتي  مفضّلة  محفظتي  حسابي                      │
└──────────────────────────────────────────────────────────────┘
```

### Dashboard Sections

| Section | Description |
|---------|-------------|
| **Quick Stats** | Rank badge, review count, Booky Coins balance — at a glance. |
| **Next Booking** | The nearest upcoming Booking. QR code access, details, cancel option. |
| **Rebook Carousel** | Horizontal scroll of recently visited Merchants with one-tap rebook. |
| **Bottom Navigation** | 5 tabs: Discover, My Bookings, Favorites, Wallet, Account. |

---

## 4. My Bookings (حجوزاتي)

### Tab Structure

```
┌──────────────────────────────────────────────────────────────┐
│  حجوزاتي                                                     │
│                                                               │
│  [ القادمة ]    [ السابقة ]    [ الملغية ]                      │
│  (Upcoming)     (Past)         (Cancelled)                    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### 4.1 Upcoming Bookings (القادمة)

| Field | Display |
|-------|---------|
| **Merchant Name** | With photo thumbnail |
| **Service Name** | e.g., "ملعب كورة ساعة" |
| **Date & Time** | "الثلاثاء 16 فبراير — 18:00" (EET) |
| **Deposit Paid** | "60 ج.م (عربون)" |
| **Remaining Balance** | "240 ج.م (عند الوصول)" |
| **Booking ID** | "BK-260216-0001" |
| **Status Badge** | 🟢 مؤكد (Confirmed) |
| **QR Code Button** | "📱 عرض QR" — opens full-screen QR for Handshake |
| **Cancel Button** | "إلغاء الحجز" — with refund info based on cancellation window |
| **Directions** | "📍 الاتجاهات" — opens Google Maps to Merchant location |

#### QR Code Screen

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│                    ┌─────────────────┐                        │
│                    │                 │                        │
│                    │    [QR CODE]    │                        │
│                    │                 │                        │
│                    └─────────────────┘                        │
│                                                               │
│              BK-260216-0001                                   │
│              ملاعب الأهرام — ملعب كورة ساعة                    │
│              الثلاثاء 18:00                                   │
│                                                               │
│              OTP البديل: 482957                                │
│                                                               │
│  ℹ️ وري الكود ده للتاجر لما توصل                              │
│                                                               │
│  ⏳ الكود بيتجدد كل 30 ثانية                                  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### 4.2 Past Bookings (السابقة)

| Field | Display |
|-------|---------|
| **Merchant Name** | With photo |
| **Service Name** | Service received |
| **Date** | When it happened |
| **Total Paid** | Deposit + remaining |
| **Status** | ✅ مكتمل (Completed) |
| **Coins Earned** | "+30 🪙" |
| **Review Status** | "⭐ قيّمت" (Reviewed) or "📝 قيّم دلوقتي" (Review Now) |
| **Rebook Button** | "↩️ احجز تاني" (One-Click Rebook) |

### 4.3 Cancelled Bookings (الملغية)

| Field | Display |
|-------|---------|
| **Merchant Name** | With photo |
| **Service Name** | What was booked |
| **Cancellation Date** | When it was cancelled |
| **Cancelled By** | "أنت" (You) / "التاجر" (Merchant) |
| **Refund Status** | "✅ تم الرد 60 ج.م" / "❌ العربون محجوز (إلغاء متأخر)" |
| **Refund Method** | "فودافون كاش" / "بطاقة (3-7 أيام)" |

---

## 5. My Wallet (محفظتي)

### Wallet Overview

```
┌──────────────────────────────────────────────────────────────┐
│  محفظتي                                                      │
│                                                               │
│  ┌────────────────────────────────────────────────────┐      │
│  │                                                     │      │
│  │   🪙 عملات بوكي                                     │      │
│  │   ٤٥٠ عملة                                         │      │
│  │                                                     │      │
│  │   = خصم يوصل لـ ٤٥ ج.م على حجزك الجاي             │      │
│  │                                                     │      │
│  │   [ استخدم عملاتك ]                                  │      │
│  │                                                     │      │
│  └────────────────────────────────────────────────────┘      │
│                                                               │
│  ┌────────────────┐  ┌────────────────┐                      │
│  │  باقتك          │  │  رتبتك          │                      │
│  │  🆓 مستكشف     │  │  🟢 معتمد       │                      │
│  │  [ ترقي ⭐ ]    │  │  3 حجوزات للـPro │                      │
│  └────────────────┘  └────────────────┘                      │
│                                                               │
│  ── آخر المعاملات ──────────────────────────────────────── │
│                                                               │
│  💸 عربون — ملاعب الأهرام        -60 ج.م    16 فبراير        │
│  ↩️ رد عربون — صالون جوليا       +50 ج.م    14 فبراير        │
│  🪙 +30 عملة — حجز مكتمل                     13 فبراير        │
│  🎁 +20 عملة — تعويض إلغاء                   12 فبراير        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Wallet Components

| Component | Description |
|-----------|-------------|
| **Booky Coins Balance** | Current balance with real-time EGP equivalent (100 coins = 10 EGP). |
| **Subscription Tier** | Current tier (Free / Premium / VIP) with upgrade CTA. |
| **Rank** | Current Rank (Newbie / Regular / Pro / Pasha) with progress to next. |
| **Transaction History** | Chronological log of all financial activity. |

### Transaction Types

| Type | Icon | Description |
|------|------|-------------|
| **Deposit Paid** | 💸 | Client paid a Deposit for a Booking |
| **Refund Received** | ↩️ | Deposit returned (cancellation or Merchant fault) |
| **Booky Coins Earned** | 🪙+ | Coins from completed Booking, review, referral, etc. |
| **Booky Coins Redeemed** | 🪙- | Coins used for discount on a Booking |
| **Compensation** | 🎁 | Coins awarded after Merchant cancellation or dispute win |

### Refund Tracking

| Refund State | Display |
|-------------|---------|
| **Initiated** | "⏳ جاري رد العربون..." |
| **Completed (instant)** | "✅ تم رد 60 ج.م لمحفظة فودافون كاش" |
| **Completed (bank)** | "✅ تم رد 60 ج.م — هيوصل في 3-7 أيام عمل" |
| **Failed** | "❌ الرد فشل — تواصل مع الدعم" (link to support) |

---

## 6. My Favorites (المفضّلة)

### Concept

> Clients can save Merchants they like for quick access later. Think of it as a personal "speed dial" for Booking.

### How to Favorite

| Method | Action |
|--------|--------|
| **From search results** | Tap ❤️ icon on Merchant card |
| **From Merchant profile** | Tap ❤️ "أضف للمفضّلة" button |
| **From past Bookings** | Tap ❤️ next to a past Booking entry |

### Favorites Screen

```
┌──────────────────────────────────────────────────────────────┐
│  المفضّلة ❤️                                                  │
│                                                               │
│  🔍 ابحث في المفضّلة...                                       │
│                                                               │
│  ── ملاعب ورياضة ─────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  [📷] ملاعب الأهرام         ⭐ 4.8  |  المهندسين     │     │
│  │       ملعب كورة ساعة — من 300 ج.م                   │     │
│  │       [ احجز ↩ ]              [ ❤️ ]                 │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  ── صحة وجمال ────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  [📷] صالون جوليا            ⭐ 4.6  |  الدقي        │     │
│  │       قص + سشوار — من 150 ج.م                       │     │
│  │       [ احجز ↩ ]              [ ❤️ ]                 │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  [📷] عيادة د. سمير           ⭐ 4.9  |  المنصورة    │     │
│  │       كشف أسنان — من 200 ج.م                        │     │
│  │       [ احجز ↩ ]              [ ❤️ ]                 │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Favorites Features

| Feature | Description |
|---------|-------------|
| **Grouped by Sector** | Auto-organized under Sector headers. |
| **Search** | Filter favorites by name. |
| **Quick Rebook** | "احجز ↩" opens Merchant profile directly at the Service catalog. |
| **Remove** | Tap ❤️ again to unfavorite. No confirmation needed. |
| **Max Favorites** | 100 (generous limit, with prompt at 95: "شكلك بتحب خدمات كتير 😄"). |
| **Sync** | Favorites sync across devices (server-side, linked to Client ID). |
| **Notifications** | Optional: get notified when a favorited Merchant posts a Story (flash offer). |

---

## 7. One-Click Rebooking (احجز تاني)

### The Core Experience

> **One-Click Rebooking** is the single most important retention feature on the Client side. A Client who has already booked a Service should be able to re-book the exact same Service in **2 taps maximum**: one tap to initiate, one tap to confirm.

### How It Works

```
Client sees "احجز تاني ↩" on:
  • Dashboard Home (Rebook Carousel)
  • Past Bookings list
  • Favorites list
       │
       ▼
Tap "احجز تاني"
       │
       ▼
System pre-fills:
  ✅ Same Merchant
  ✅ Same Service
  ✅ Same payment method (last used)
       │
       ▼
Show: Available Slots (next 7 days)
       │
       ▼
Client picks a Slot [TAP 1]
       │
       ▼
Confirm & Pay screen (pre-filled) [TAP 2]
       │
       ▼
✅ Booking Confirmed!
```

### Rebook Logic

| Aspect | Rule |
|--------|------|
| **Pre-filled data** | Merchant, Service, and payment method from the original Booking. |
| **Slot selection** | Shows the same day-of-week + time as the original if available. Falls back to next available. |
| **Price changes** | If the Service price changed since the original Booking: show new price clearly with a subtle note: "السعر اتغير من آخر مرة." |
| **Service removed** | If the Merchant removed the Service: show: "الخدمة دي مش متاحة حاليًا — شوف الخدمات التانية." Link to Merchant profile. |
| **Merchant deactivated** | If the Merchant is deactivated: show: "التاجر ده مش متاح دلوقتي — جرب تاجر تاني." Remove from Rebook Carousel. |
| **Different staff** | If the original Booking had a specific staff member: pre-select the same staff. If unavailable: show all available staff with a note. |

### Rebook Surfaces

| Surface | Visibility | Behavior |
|---------|-----------|----------|
| **Dashboard Rebook Carousel** | Top of home screen | Horizontal scroll of last 5 unique Merchants. Each card has "احجز تاني ↩". |
| **Past Bookings** | Each completed Booking entry | "↩️ احجز تاني" button on the right side of each card. |
| **Favorites** | Each favorited Merchant | "احجز ↩" button on the card. |
| **Post-Booking Confirmation** | After a Booking completes | "عجبتك الخدمة؟ احجز تاني الأسبوع الجاي! ↩" |
| **Push Notification** | 7 days after last Booking | "حابب تحجز تاني في [Merchant]؟ 📅" |

---

## 8. Dashboard Navigation

### Bottom Tab Bar (Mobile)

| Tab | Icon | Arabic | Screen |
|-----|------|--------|--------|
| **Discover** | 🏠 | اكتشف | Main feed: Stories bar, Sector cards, nearby Merchants, Feed posts |
| **My Bookings** | 📅 | حجوزاتي | Upcoming / Past / Cancelled tabs |
| **Favorites** | ❤️ | المفضّلة | Saved Merchants, grouped by Sector |
| **Wallet** | 💰 | محفظتي | Booky Coins, transactions, Subscription Tier, Rank |
| **Account** | 👤 | حسابي | Profile settings, notification preferences, help, logout |

### Account Screen (حسابي)

```
┌──────────────────────────────────────────────────────────────┐
│  حسابي                                                       │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  [📷]  أحمد محمد                                     │     │
│  │         +201012345678                                │     │
│  │         🟢 معتمد | 🆓 باقة المستكشف                   │     │
│  │         [ تعديل البروفايل ]                           │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  📋 الإعدادات ─────────────────────────────────────────────  │
│                                                               │
│  👤  بيانات الحساب                                      →    │
│  🔔  الإشعارات                                           →    │
│  ⭐  باقة الاشتراك                                       →    │
│  🎖️  رتبتي ومستواي                                      →    │
│  🌐  اللغة                                               →    │
│                                                               │
│  📞 المساعدة ─────────────────────────────────────────────  │
│                                                               │
│  ❓  أسئلة شائعة                                          →    │
│  💬  تواصل مع الدعم                                      →    │
│  📜  الشروط والأحكام                                      →    │
│  🔒  سياسة الخصوصية                                      →    │
│                                                               │
│  🚪  [ تسجيل الخروج ]                                         │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 9. Gherkin Scenarios

### Scenario 1: Client Views Upcoming Booking & Shows QR

```gherkin
Feature: Client Dashboard — Upcoming Booking Management

  Scenario: Client views their next Booking and opens the QR code
    Given a Client "Ahmed" has a confirmed Booking:
      | booking_id  | BK-260216-0001            |
      | merchant    | ملاعب الأهرام              |
      | service     | ملعب كورة ساعة             |
      | slot        | 2026-02-16T18:00:00Z       |
      | deposit     | 60 EGP                    |
      | remaining   | 240 EGP                   |
    And the current time is "2026-02-16T17:45:00Z" (15 min before Slot)

    When Ahmed opens the app and sees his Dashboard
    Then the "Next Booking" card shows:
      | field      | value                          |
      | merchant   | ⚽ ملاعب الأهرام                 |
      | service    | ملعب كورة ساعة — الثلاثاء 18:00 |
      | buttons    | [عرض QR 📱] [تفاصيل] [إلغاء]   |

    When Ahmed taps "عرض QR 📱"
    Then a full-screen QR code is displayed
    And the QR refreshes every 30 seconds
    And the fallback OTP "482957" is shown below the QR
    And a note says: "وري الكود ده للتاجر لما توصل"
```

### Scenario 2: One-Click Rebooking

```gherkin
Feature: One-Click Rebooking

  Scenario: Client rebooks a previously completed Service in 2 taps
    Given a Client "Sara" has a past completed Booking:
      | merchant    | صالون جوليا               |
      | service     | قص + سشوار                |
      | price       | 150 EGP                  |
      | staff       | سارة (خبيرة تجميل)        |
      | date        | 2026-02-09               |
    And the Merchant "صالون جوليا" is still active
    And the Service "قص + سشوار" is still available at 150 EGP

    When Sara taps "احجز تاني ↩" on the Rebook Carousel
    Then the system pre-fills:
      | field           | value             |
      | merchant        | صالون جوليا        |
      | service         | قص + سشوار         |
      | staff           | سارة              |
      | payment_method  | Vodafone Cash     |
    And shows available Slots for the next 7 days
    And highlights the same day-of-week (Sunday) and time if available

    When Sara selects a Slot (TAP 1)
    And confirms the Booking with pre-filled payment (TAP 2)
    Then the Booking is confirmed with Deposit paid
    And Sara receives confirmation: "حجزك في صالون جوليا اتأكد! 💅"

  Scenario: Rebooking a Service whose price changed
    Given a Client has a past Booking for "قص شعر" at 100 EGP
    And the Merchant has since updated the price to 120 EGP

    When the Client taps "احجز تاني ↩"
    Then the system shows the new price 120 EGP
    And displays a note: "السعر اتغير من آخر مرة (كان 100 ج.م)"
    And the Client can proceed or cancel
```

### Scenario 3: Client Favorites a Merchant

```gherkin
Feature: Favorites Management

  Scenario: Client saves a Merchant to favorites from search results
    Given a Client is browsing search results for "ملاعب" near "المنصورة"
    And sees "ملاعب الأهرام" in the results

    When the Client taps the ❤️ icon on the "ملاعب الأهرام" card
    Then the icon fills to a solid red ❤️
    And "ملاعب الأهرام" appears in the Client's Favorites under "ملاعب ورياضة"
    And a subtle toast shows: "اتضاف للمفضّلة ❤️"

  Scenario: Client removes a Merchant from favorites
    Given "ملاعب الأهرام" is in the Client's Favorites
    When the Client taps the ❤️ icon again (on any screen)
    Then the icon reverts to an outline ♡
    And "ملاعب الأهرام" is removed from Favorites
    And no confirmation dialog is shown (instant, reversible by re-tapping)
```

### Scenario 4: Client Wallet — Booky Coins Redemption

```gherkin
Feature: Client Wallet — Booky Coins

  Scenario: Client checks their Booky Coins balance and redeems during Booking
    Given a Client has 450 Booky Coins
    And is on the checkout screen for a 300 EGP Service (Deposit: 75 EGP)

    When the Client taps "استخدم عملات بوكي"
    Then the system shows:
      | coins_available | 450 عملة                       |
      | max_redeemable  | 90 ج.م (30% of 300 EGP)       |
      | coins_required  | 900 عملة (for 90 EGP discount) |
      | coins_used      | 450 عملة (for 45 EGP discount) |
      | new_price       | 255 EGP                        |
      | new_deposit     | ~64 EGP                        |
    And the discount is applied to the total price
    And the Deposit is recalculated proportionally
    And the Client confirms the Booking at the discounted price
```

---

## 10. Edge Cases

| # | Edge Case | Business Rule |
|---|-----------|---------------|
| 1 | **Client has no upcoming Bookings** | Dashboard shows empty state: "مفيش حجوزات قادمة — ابحث واحجز أول حاجة! 🔍" with CTA to Discover tab. |
| 2 | **Client has 100+ past Bookings** | Paginate: show 20 per page with "Load More" (عرض المزيد). Most recent first. |
| 3 | **Rebook fails because Merchant removed the Service** | Show: "الخدمة دي مش متاحة حاليًا — شوف الخدمات التانية." Redirect to Merchant profile. |
| 4 | **Rebook carousel shows a deactivated Merchant** | Remove from carousel silently on next app open. If tapped before removal: "التاجر ده مش متاح دلوقتي." |
| 5 | **Refund stuck in processing (bank delay)** | Show "⏳ جاري رد العربون — ممكن ياخد لحد 7 أيام عمل." with support link after 7 days. |
| 6 | **Client tries to favorite while not logged in** | Trigger Auth Modal. After login, complete the favorite action automatically. |
| 7 | **Client has 0 Booky Coins and taps "Use Coins"** | Disable the button with: "مفيش عملات كافية — اكمل حجوزات واكسب عملات 🪙" |
| 8 | **Client downgrades from VIP to Free** | Coins earned at 5x multiplier are retained. Future earnings revert to 1x. No clawback. |
| 9 | **Two devices logged in with the same account** | Real-time sync. Booking created on phone A appears on tablet B within seconds. Favorites, wallet — all synced. |
| 10 | **Client account has been inactive for 6 months** | Rank demoted to Newbie (per Rank rules). Booky Coins nearing 12-month expiry. On next login: "وحشتنا! عملاتك هتنتهي في X يوم — احجز عشان تحافظ عليهم." |

---

> **📌 Source of Truth:** This document aligns with [BOOKY_CENTER_BUSINESS_MASTER.md](mdc:docs/BOOKY_CENTER_BUSINESS_MASTER.md) §6 (Client Subscriptions), §8 (Rank System), §9 (Booky Coins), §4.3 (UI/UX Principles).
>
> *Booky Center: بضغطة واحدة.. ميعادك في جيبك* ✨

