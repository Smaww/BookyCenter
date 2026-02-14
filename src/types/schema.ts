/**
 * ============================================================================
 * BOOKY CENTER — Core Data Schema & TypeScript Interfaces
 * ============================================================================
 *
 * Source of Truth for all client-side and API data structures.
 * Based on: docs/02_CLIENT_JOURNEY_LOGIC.md (v1.0)
 *           docs/BOOKY_CENTER_BUSINESS_MASTER.md (v5.0)
 *
 * @version  1.0.0
 * @date     2026-02-12
 * @author   Product Architecture & Backend Engineering Team
 *
 * CONVENTIONS:
 *  - All monetary values are in Egyptian Pounds (EGP) as integers (no floats).
 *  - All timestamps are ISO 8601 strings (UTC): "2026-02-12T15:00:00Z".
 *  - All IDs are UUID v4 strings.
 *  - Phone numbers follow E.164 format: "+201012345678".
 * ============================================================================
 */

// ============================================================================
// ENUMS — Centralized Business Constants
// ============================================================================

/**
 * The 6 Core Service Verticals.
 *
 * These are the foundational pillars of the Booky Center marketplace.
 * Every merchant and service MUST belong to exactly one sector.
 * Cross-vertical loyalty (Booky Coins) is a key competitive moat.
 *
 * @see BOOKY_CENTER_BUSINESS_MASTER.md §6 — Product Verticals
 */
export enum Sector {
  /** ملاعب ورياضة — Hook vertical for user acquisition (highest frequency) */
  SPORTS = 'sports',

  /** صحة وجمال — Retention vertical (recurring appointments) */
  HEALTH_BEAUTY = 'health_beauty',

  /** خروجات وترفيه — Viral engine (group bookings, social sharing) */
  ENTERTAINMENT = 'entertainment',

  /** خدمات منزلية — Problem-solver (urgency-driven, trust-critical) */
  HOME_SERVICES = 'home_services',

  /** تعليم ومساحات عمل — B2B crossover (professional/recurring) */
  EDUCATION = 'education',

  /** مناسبات وأفراح — High-ticket play (highest transaction values) */
  EVENTS = 'events',
}

/**
 * User Rank — The "Pasha" Loyalty Progression System.
 *
 * Ranks are earned through completed bookings + verified reviews.
 * Higher ranks unlock tangible benefits (priority booking, coin multipliers,
 * hidden offers). Demotion occurs on inactivity (6 months) or abuse (3+ no-shows).
 *
 * @see 02_CLIENT_JOURNEY_LOGIC.md §4.2 — User Ranks
 */
export enum UserRank {
  /**
   * مستكشف (Newbie) — 0-4 completed bookings.
   * Basic app access, 1x coin multiplier.
   */
  NEWBIE = 'newbie',

  /**
   * معتمد (Regular) — 5-9 bookings + at least 1 review.
   * Unlocks: Booking priority (skip waitlist).
   */
  REGULAR = 'regular',

  /**
   * اللي فاهمها (Pro) — 10-19 bookings + 3 verified reviews.
   * Account must be ≥ 30 days old.
   * Unlocks: 2x coin multiplier, exclusive partner deals.
   */
  PRO = 'pro',

  /**
   * الباشا (Pasha / VIP) — 20+ bookings + 5 reviews including photo reviews.
   * Unlocks: 5x coin multiplier, priority support, hidden offers,
   * early event access (48h before public).
   */
  PASHA = 'pasha',
}

/**
 * Account Type — Set once during registration via the AuthSelectionModal.
 * Cannot be changed without contacting support.
 *
 * @see 02_CLIENT_JOURNEY_LOGIC.md §1.3 — The Fork
 */
export enum AccountType {
  CLIENT = 'client',
  MERCHANT = 'merchant',
}

/**
 * Booking Lifecycle Status — Finite State Machine.
 *
 * Flow: PENDING → CONFIRMED → COMPLETED → REVIEWED
 *                           → NO_SHOW → DEPOSIT_FORFEITED
 *       PENDING → EXPIRED (payment timeout, 15 min)
 *       PENDING / CONFIRMED → CANCELLED_BY_USER
 *       CONFIRMED → CANCELLED_BY_MERCHANT (full refund)
 *
 * @see 02_CLIENT_JOURNEY_LOGIC.md §6.3 — Booking Status State Machine
 */
export enum BookingStatus {
  /** Created but payment not yet received. Auto-expires in 15 minutes. */
  PENDING = 'pending',

  /** Payment received or cash booking confirmed. Slot is locked. */
  CONFIRMED = 'confirmed',

  /** Payment not received within 15-minute window. Slot released. */
  EXPIRED = 'expired',

  /** User cancelled within the allowed cancellation window. */
  CANCELLED_BY_USER = 'cancelled_by_user',

  /** Merchant cancelled — triggers automatic full refund to user. */
  CANCELLED_BY_MERCHANT = 'cancelled_by_merchant',

  /** Service was delivered. Merchant marks complete or auto-set after end time. */
  COMPLETED = 'completed',

  /** User did not show up. Reported by merchant or auto-detected. */
  NO_SHOW = 'no_show',

  /** User submitted a review after completion (optional terminal state). */
  REVIEWED = 'reviewed',
}

/**
 * Supported Payment Methods — Tailored for the Egyptian market.
 *
 * Vodafone Cash is the dominant mobile wallet (28M+ users in Egypt).
 * InstaPay is the national instant bank transfer network.
 * Cash remains critical for market penetration (32% of users prefer cash).
 *
 * @see 02_CLIENT_JOURNEY_LOGIC.md §5.2 — Payment Methods
 */
export enum PaymentMethod {
  /** الدفع عند الوصول — Available unless deposit is required. */
  CASH = 'cash',

  /** فودافون كاش — OTP-confirmed mobile wallet. Supports deposits. */
  VODAFONE_CASH = 'vodafone_cash',

  /** إنستا باي — National instant bank transfer. Supports deposits. */
  INSTAPAY = 'instapay',

  /** بطاقة ائتمان/خصم — 3D Secure verified. Supports deposits. */
  CREDIT_CARD = 'credit_card',
}

/**
 * Feed Post Types — Determines rendering logic and CTA behavior.
 *
 * @see 02_CLIENT_JOURNEY_LOGIC.md §2.4 — Feed Item Types
 */
export enum SocialPostType {
  /** Client review with star rating, text, and optional photos. CTA: "احجز دلوقتي" */
  USER_REVIEW = 'user_review',

  /** Merchant announcement (new slot, offer, update). CTA: "احجز دلوقتي" */
  MERCHANT_UPDATE = 'merchant_update',

  /** System-generated highlight (e.g., "الأكثر حجزاً هذا الأسبوع"). CTA: "شوف التفاصيل" */
  BOOKY_HIGHLIGHT = 'booky_highlight',

  /** Gamification event (e.g., "حسام وصل رتبة اللي فاهمها"). CTA: "اعرف أكتر" */
  ACHIEVEMENT = 'achievement',
}

/**
 * Story Offer Types — For the 24h Flash Offers bar.
 *
 * @see 02_CLIENT_JOURNEY_LOGIC.md §2.3 — Stories (Flash Offers)
 */
export enum StoryOfferType {
  /** Percentage or fixed-amount discount on a service. */
  DISCOUNT = 'discount',

  /** New time slot that just became available. */
  NEW_SLOT = 'new_slot',

  /** Time-sensitive deal with deep discount. */
  FLASH_DEAL = 'flash_deal',
}

// ============================================================================
// CORE INTERFACES — User & Auth
// ============================================================================

/**
 * GeoLocation — Neighborhood-level precision for hyper-local discovery.
 *
 * Booky's competitive moat is neighborhood-level filtering (e.g., "المنصورة - التوريل"),
 * unlike competitors who only filter by city. Auto-detected on login via
 * Browser Geolocation API → Google Maps reverse geocode.
 *
 * @see 02_CLIENT_JOURNEY_LOGIC.md §1.6 — Geo-Location
 */
export interface GeoLocation {
  /** GPS latitude coordinate. */
  lat: number;

  /** GPS longitude coordinate. */
  lng: number;

  /**
   * Human-readable neighborhood name in Arabic.
   * @example "المنصورة - التوريل"
   */
  areaName: string;

  /**
   * City-level name for broader filtering.
   * @example "المنصورة"
   */
  city: string;
}

/**
 * UserProfile — The Client entity (post-login).
 *
 * Phone number is the SOLE authentication credential (OTP-based, no passwords).
 * Profile enrichment is optional via Google/Facebook OAuth (name + photo only).
 * The rank system drives retention through tangible benefits.
 *
 * @see 02_CLIENT_JOURNEY_LOGIC.md §1 — Smart Auth Gateway
 * @see 02_CLIENT_JOURNEY_LOGIC.md §4.2 — User Ranks
 */
export interface UserProfile {
  /** UUID v4. Immutable primary key. */
  id: string;

  /**
   * E.164 phone number — the ONLY login credential.
   * Unique across the entire platform. Verified via 4-digit OTP.
   * Egyptian format: +20 1[0125] XXX XXXX.
   *
   * @example "+201012345678"
   */
  phone: string;

  /**
   * Display name. Imported from Google/Facebook or entered manually.
   * Required — cannot be empty.
   *
   * @example "أحمد محمد"
   */
  fullName: string;

  /**
   * Profile photo URL. Imported from OAuth or uploaded.
   * Falls back to a system-generated avatar (first letter of name)
   * if null.
   */
  avatarUrl: string | null;

  /**
   * Account type set during the "Fork" modal at registration.
   * Immutable — cannot be changed without contacting support.
   */
  accountType: AccountType;

  /**
   * Current loyalty rank in the "Pasha" progression system.
   * Determines coin multiplier and feature access.
   *
   * Progression: NEWBIE → REGULAR → PRO → PASHA
   * Demotion: 3+ no-shows in 30 days, or 6 months inactivity.
   */
  rank: UserRank;

  /**
   * Booky Coins balance — universal micro-currency.
   * Earned on every booking (1 EGP = 1 coin × rank multiplier).
   * Redeemable across ALL verticals (cross-vertical loyalty moat).
   * Coins expire after 12 months of account inactivity.
   *
   * @minimum 0
   */
  coinsBalance: number;

  /**
   * User's preferred service sectors (self-selected or ML-inferred).
   * Used to personalize the Social Feed ranking algorithm
   * (Relevance factor = 30% of feed score).
   *
   * @example [Sector.SPORTS, Sector.HEALTH_BEAUTY]
   */
  preferences: Sector[];

  /**
   * Auto-detected or manually set user location.
   * Re-detected on each app launch. User can override.
   * Null if geo-permission was denied AND no manual selection.
   */
  location: GeoLocation | null;

  /**
   * Email address — stored but NEVER used for login.
   * Imported from Google/Facebook OAuth. Used only for receipts
   * and optional monthly summary emails.
   */
  email: string | null;

  /**
   * Total completed bookings (excludes cancelled/no-show).
   * Primary metric for rank progression.
   */
  totalBookings: number;

  /**
   * Number of no-shows on the user's record.
   * 3+ in 30 days triggers rank demotion.
   * Resets after 5 consecutive clean bookings.
   */
  noShowCount: number;

  /** ISO 8601 timestamp — when the account was created. */
  createdAt: string;

  /** ISO 8601 timestamp — last activity (login, booking, review). */
  lastActiveAt: string;
}

// ============================================================================
// CORE INTERFACES — Merchant
// ============================================================================

/**
 * Working Hours — Single day schedule.
 * Null means the merchant is closed on that day.
 */
export interface WorkingHoursSlot {
  /** Opening time in 24h format. @example "09:00" */
  open: string;

  /** Closing time in 24h format. @example "22:00" */
  close: string;
}

/**
 * Rating Breakdown — Star distribution for credibility display.
 */
export interface RatingDistribution {
  /** Count of 5-star reviews. */
  five: number;
  /** Count of 4-star reviews. */
  four: number;
  /** Count of 3-star reviews. */
  three: number;
  /** Count of 2-star reviews. */
  two: number;
  /** Count of 1-star reviews. */
  one: number;
}

/**
 * MerchantProfile — The vendor entity (Mini-Site / Social Profile).
 *
 * Designed to look and feel like a social media profile (Cover, Avatar,
 * Followers, Stats) — familiar to the Egyptian user who spends 4+ hours
 * daily on Facebook/Instagram.
 *
 * @see 02_CLIENT_JOURNEY_LOGIC.md §3.3 — Merchant Profile (Mini-Site)
 */
export interface MerchantProfile {
  /** UUID v4. Immutable primary key. */
  id: string;

  /**
   * Business display name in Arabic.
   * @example "صالون الأناقة"
   */
  businessName: string;

  /**
   * Optional English transliteration for SEO and bilingual contexts.
   * @example "Al-Anaka Salon"
   */
  businessNameEn: string | null;

  /**
   * Cover image URL (16:9 ratio). Displayed at the top of the Mini-Site.
   * Professional photo (may be provided free during onboarding for
   * "Digital Immigrant" merchants).
   */
  coverImage: string | null;

  /**
   * Business logo / avatar URL. Used in feed posts, search results, stories.
   */
  avatarUrl: string | null;

  /**
   * The single primary sector this merchant operates in.
   * Determines search categorization and sector filter placement.
   */
  sector: Sector;

  /**
   * Sub-category within the sector for granular filtering.
   * @example "barber_male" within HEALTH_BEAUTY sector
   */
  subCategory: string;

  /**
   * Average star rating (0.0 — 5.0, one decimal precision).
   * Calculated from verified reviews only (only users who completed
   * a booking can review — Booky's trust moat).
   *
   * @minimum 0
   * @maximum 5
   */
  rating: number;

  /** Total number of verified reviews. */
  reviewCount: number;

  /** Detailed star distribution for the profile page. */
  ratingDistribution: RatingDistribution;

  /** Number of users following this merchant (see updates in feed). */
  followersCount: number;

  /** Total bookings completed through the platform. Social proof metric. */
  totalBookings: number;

  /**
   * Verified badge — awarded after identity + venue verification.
   * Verified merchants rank higher in search results.
   */
  isVerified: boolean;

  /**
   * Precise business location — enables neighborhood-level discovery.
   * Includes human-readable address for display.
   */
  location: GeoLocation & {
    /**
     * Full street address for display on the profile.
     * @example "شارع الجمهورية، بجوار مسجد النصر"
     */
    addressText: string;
  };

  /**
   * Weekly schedule. Null value = closed on that day.
   * Used to calculate real-time availability calendar.
   */
  workingHours: {
    saturday: WorkingHoursSlot | null;
    sunday: WorkingHoursSlot | null;
    monday: WorkingHoursSlot | null;
    tuesday: WorkingHoursSlot | null;
    wednesday: WorkingHoursSlot | null;
    thursday: WorkingHoursSlot | null;
    friday: WorkingHoursSlot | null;
  };

  /**
   * Merchant SaaS subscription tier. Determines feature access:
   * - starter: Basic profile, calendar, 50 bookings/month
   * - growth: Full dashboard, unlimited bookings, analytics
   * - pro: Priority support, marketing tools, featured listing
   *
   * @see BOOKY_CENTER_BUSINESS_MASTER.md §11 — Merchant Subscriptions
   */
  subscriptionTier: 'starter' | 'growth' | 'pro';

  /** ISO 8601 — when the merchant joined the platform. */
  createdAt: string;
}

// ============================================================================
// CORE INTERFACES — Service & Booking
// ============================================================================

/**
 * ServiceItem — A single bookable service offered by a merchant.
 *
 * Each merchant can list multiple services with individual pricing,
 * duration, and deposit requirements. Services are displayed in an
 * accordion menu on the Merchant Profile Mini-Site.
 *
 * @see 02_CLIENT_JOURNEY_LOGIC.md §3.3 — Services Menu
 */
export interface ServiceItem {
  /** UUID v4. Immutable primary key. */
  id: string;

  /** Foreign key → MerchantProfile.id */
  merchantId: string;

  /**
   * Service display name in Arabic.
   * @example "قص شعر رجالي"
   */
  name: string;

  /**
   * Service price in EGP (integer, no decimals).
   * Mandatory price display is a core trust differentiator —
   * eliminating the "Price in DM" culture.
   *
   * @minimum 1
   * @example 80
   */
  price: number;

  /**
   * Service duration in minutes. Used to calculate calendar slot sizing
   * and prevent overbooking.
   *
   * @minimum 5
   * @example 30
   */
  durationMin: number;

  /**
   * Whether a deposit is required to confirm the booking.
   *
   * Business Rule:
   *  - Sports (>200 EGP): 20% deposit
   *  - Health & Beauty (premium): 25% deposit
   *  - Entertainment: 30% deposit (highest no-show vertical)
   *  - Home Services: 15% deposit
   *  - Professional: 25% deposit
   *  - Events: 50-100% deposit (high-ticket)
   *
   * When true, cash-on-arrival is NOT available as a payment method.
   *
   * @see 02_CLIENT_JOURNEY_LOGIC.md §5.2 — Deposit Logic
   */
  depositRequired: boolean;

  /**
   * Deposit percentage (0-100). Only meaningful when depositRequired is true.
   * @example 25
   */
  depositPercent: number;

  /** Whether this service is currently active and bookable. */
  isAvailable: boolean;

  /**
   * Sector inherited from the parent merchant.
   * Denormalized here for efficient search filtering.
   */
  sector: Sector;
}

/**
 * CalendarSlot — A single time slot on a merchant's real-time calendar.
 *
 * The real-time calendar is a critical differentiator:
 * White = Available, Gray = Booked. Updated via WebSocket
 * (30-second polling fallback). Concurrent booking conflicts
 * are resolved via database-level row locking (first-pay wins).
 *
 * @see 02_CLIENT_JOURNEY_LOGIC.md §3.4 — Real-Time Calendar
 */
export interface CalendarSlot {
  /** UUID v4. */
  id: string;

  /** Foreign key → MerchantProfile.id */
  merchantId: string;

  /** Foreign key → ServiceItem.id (optional — slot may be service-agnostic). */
  serviceId: string | null;

  /**
   * ISO 8601 start time of the slot.
   * @example "2026-02-12T15:00:00+02:00"
   */
  startTime: string;

  /**
   * ISO 8601 end time of the slot.
   * @example "2026-02-12T15:30:00+02:00"
   */
  endTime: string;

  /**
   * Slot availability state.
   * - 'available': White — can be booked.
   * - 'booked': Gray — already reserved.
   * - 'break': Light Gray — merchant break / closed.
   * - 'held': Yellow — temporarily held during payment (5-min lock).
   */
  status: 'available' | 'booked' | 'break' | 'held';

  /**
   * Foreign key → Booking.id. Populated when status is 'booked' or 'held'.
   * Null when available or on break.
   */
  bookingId: string | null;
}

/**
 * Booking — The core transaction entity.
 *
 * Represents a confirmed (or pending) reservation between a client
 * and a merchant for a specific service at a specific time.
 * The 3-tap booking flow: Select → Confirm/Pay → Done.
 *
 * @see 02_CLIENT_JOURNEY_LOGIC.md §5.1 — The 3-Step Booking Flow
 * @see 02_CLIENT_JOURNEY_LOGIC.md §6.3 — Booking Status State Machine
 */
export interface Booking {
  /**
   * Human-friendly booking reference.
   * Format: "BK-YYMMDD-XXXX" (e.g., "BK-260212-0847").
   * Sent via WhatsApp confirmation message.
   */
  id: string;

  /** Foreign key → UserProfile.id (the client who booked). */
  clientId: string;

  /** Foreign key → MerchantProfile.id (the service provider). */
  merchantId: string;

  /** Foreign key → ServiceItem.id (the specific service booked). */
  serviceId: string;

  /**
   * Current booking lifecycle state.
   * Transitions are enforced server-side; invalid transitions are rejected.
   *
   * @see BookingStatus enum for the complete state machine.
   */
  status: BookingStatus;

  /**
   * Booked slot start time (ISO 8601).
   * @example "2026-02-12T15:00:00+02:00"
   */
  slotStart: string;

  /**
   * Booked slot end time (ISO 8601).
   * @example "2026-02-12T15:30:00+02:00"
   */
  slotEnd: string;

  /**
   * Total price in EGP at time of booking.
   * Snapshot — not affected by subsequent merchant price changes.
   */
  totalPrice: number;

  /**
   * Deposit amount paid upfront in EGP.
   * 0 if no deposit was required (e.g., cash bookings).
   */
  depositAmount: number;

  /**
   * Payment method selected by the user.
   * Cash is only available when no deposit is required.
   */
  paymentMethod: PaymentMethod;

  /**
   * Booky Coins redeemed on this booking.
   * Max redemption: 30% of booking value.
   * 0 if no coins were applied.
   */
  coinsRedeemed: number;

  /**
   * Booky Coins earned from this booking (post-completion).
   * Calculated: (totalPrice / 100) × 10 × rankMultiplier.
   * 0 if booking was cancelled or no-show.
   */
  coinsEarned: number;

  /** ISO 8601 — when the booking was created. */
  createdAt: string;

  /** ISO 8601 — last status change. */
  updatedAt: string;

  /**
   * ISO 8601 — deadline for payment before auto-expiry.
   * Set to createdAt + 15 minutes for non-cash bookings.
   * Null for cash bookings (confirmed immediately).
   */
  paymentDeadline: string | null;

  /**
   * Cancellation window end time (ISO 8601).
   * After this point, deposit is non-refundable.
   * Varies by sector (Sports: 4h, Beauty: 24h, Events: 7 days).
   */
  cancellationDeadline: string | null;
}

// ============================================================================
// CORE INTERFACES — Social Feed & Stories
// ============================================================================

/**
 * SocialPost — A single item in the Community Feed.
 *
 * The feed transforms a boring service directory into a living social
 * marketplace. Each post acts as a "mini-ad" with a built-in booking CTA.
 * Feed ranking: (Recency × 0.3) + (Relevance × 0.3) +
 *               (Engagement × 0.2) + (Proximity × 0.2).
 *
 * @see 02_CLIENT_JOURNEY_LOGIC.md §2.4 — Community Feed
 */
export interface SocialPost {
  /** UUID v4. */
  id: string;

  /**
   * The entity that created this post.
   * Can be a client (review), merchant (update), or system (highlight).
   * For system posts, authorId is "system".
   */
  authorId: string;

  /**
   * Author type — determines avatar rendering and post styling.
   */
  authorType: 'client' | 'merchant' | 'system';

  /** Author display name (denormalized for feed performance). */
  authorName: string;

  /** Author avatar URL (denormalized for feed performance). */
  authorAvatarUrl: string | null;

  /** Post type — determines CTA button text and action. */
  type: SocialPostType;

  /**
   * Post text content.
   * Reviews: The user's written review.
   * Merchant updates: The announcement text (max 280 chars).
   * Highlights: System-generated copy.
   */
  content: string;

  /**
   * Optional attached image URL.
   * Reviews with photos earn +50 Booky Coins (incentivized).
   */
  imageUrl: string | null;

  /**
   * Star rating (1-5). Only present on USER_REVIEW posts.
   * Null for all other post types.
   */
  rating: number | null;

  /**
   * Optional link to the related service — powers the "احجز دلوقتي" CTA.
   * When present, a booking button is rendered directly on the post.
   * Null for achievement and some highlight posts.
   */
  relatedServiceId: string | null;

  /**
   * Optional link to the related merchant profile.
   * Powers navigation to the merchant Mini-Site.
   */
  relatedMerchantId: string | null;

  /** Total likes count (social proof metric). */
  likes: number;

  /** Total comments count. */
  comments: number;

  /** Whether the current authenticated user has liked this post. */
  isLikedByUser: boolean;

  /** ISO 8601 — when the post was created. Used for recency scoring. */
  createdAt: string;
}

/**
 * Story — 24-Hour Flash Offer from a Merchant.
 *
 * Displayed in the circular Stories bar at the top of the Home Screen.
 * Inspired by Instagram/WhatsApp Stories but for deals and availability.
 * Max 3 active stories per merchant. FOMO countdown badge shown.
 *
 * @see 02_CLIENT_JOURNEY_LOGIC.md §2.3 — Stories (Flash Offers)
 */
export interface Story {
  /** UUID v4. */
  id: string;

  /** Foreign key → MerchantProfile.id */
  merchantId: string;

  /** Merchant name (denormalized for rendering). */
  merchantName: string;

  /** Merchant avatar (denormalized for the circular story ring). */
  merchantAvatarUrl: string | null;

  /** Media type — determines viewer behavior (5s image, 15s video). */
  mediaType: 'image' | 'video';

  /** CDN URL for the story media asset. */
  mediaUrl: string;

  /**
   * Short offer description overlaid on the media.
   * @example "خصم 30% على الحجز الصباحي"
   */
  offerText: string;

  /** Categorizes the offer for filtering and analytics. */
  offerType: StoryOfferType;

  /**
   * ISO 8601 — hard expiry. Stories disappear after 24h.
   * Hard-deleted from storage after 48h.
   */
  expiresAt: string;

  /**
   * CTA action type:
   * - 'book_now': Deep-link to the specific service booking.
   * - 'view_profile': Navigate to the merchant Mini-Site.
   */
  ctaAction: 'book_now' | 'view_profile';

  /**
   * Foreign key → ServiceItem.id.
   * Only set when ctaAction is 'book_now'.
   */
  ctaTargetServiceId: string | null;

  /** Whether the current user has already viewed this story. */
  isViewedByUser: boolean;

  /** ISO 8601 — creation timestamp. */
  createdAt: string;
}

// ============================================================================
// CORE INTERFACES — Chat & Inquiry
// ============================================================================

/**
 * ChatSession — Context-Aware Private Inquiry.
 *
 * Allows clients to ask merchants specific questions BEFORE booking
 * without exposing personal phone numbers. Auto-attached context
 * (service name, merchant name) reduces friction.
 *
 * @see 02_CLIENT_JOURNEY_LOGIC.md §3.5 — Private Inquiry
 */
export interface ChatSession {
  /** UUID v4. */
  id: string;

  /** Foreign key → UserProfile.id (the client who initiated). */
  clientId: string;

  /** Foreign key → MerchantProfile.id. */
  merchantId: string;

  /**
   * The service being inquired about (auto-attached on session creation).
   * @example "قص شعر رجالي"
   */
  contextServiceName: string;

  /** Foreign key → ServiceItem.id (optional). */
  contextServiceId: string | null;

  /**
   * System-generated opening message.
   * @example "أهلاً! إيه اللي تحب تسأل عنه بخصوص [قص شعر رجالي] في [صالون الأناقة]؟"
   */
  autoGreeting: string;

  /** Ordered array of messages in the conversation. */
  messages: ChatMessage[];

  /** ISO 8601 — session creation time. */
  createdAt: string;

  /** ISO 8601 — last message timestamp. */
  lastMessageAt: string;
}

/**
 * ChatMessage — A single message within a ChatSession.
 */
export interface ChatMessage {
  /** UUID v4. */
  id: string;

  /** Who sent this message. */
  senderType: 'client' | 'merchant' | 'system';

  /** Message text content. */
  text: string;

  /** Optional image attachment URL (text + images only, no voice in v1). */
  imageUrl: string | null;

  /** ISO 8601 — when the message was sent. */
  sentAt: string;

  /** Whether the recipient has read this message. */
  isRead: boolean;
}

// ============================================================================
// CORE INTERFACES — Notifications
// ============================================================================

/**
 * Notification — Push/WhatsApp/SMS notification entity.
 *
 * Egypt's #1 messaging app is WhatsApp — booking confirmations
 * and reminders are sent there alongside in-app push.
 *
 * @see 02_CLIENT_JOURNEY_LOGIC.md §5.3 — Notification System
 */
export interface Notification {
  /** UUID v4. */
  id: string;

  /** Foreign key → UserProfile.id (the recipient). */
  userId: string;

  /**
   * Notification category — determines icon, styling, and action.
   */
  type:
    | 'booking_confirmed'
    | 'booking_reminder_24h'
    | 'booking_reminder_2h'
    | 'review_prompt'
    | 'coins_earned'
    | 'rank_up'
    | 'story_from_followed'
    | 'coins_expiry_warning'
    | 'booking_cancelled'
    | 'merchant_message';

  /** Notification title (bold text). */
  title: string;

  /** Notification body text. */
  body: string;

  /**
   * Delivery channels used for this notification.
   */
  channels: Array<'push' | 'whatsapp' | 'sms' | 'email'>;

  /** Deep-link URL within the app. @example "/bookings/BK-260212-0847" */
  actionUrl: string | null;

  /** Whether the user has seen/opened this notification. */
  isRead: boolean;

  /** ISO 8601. */
  createdAt: string;
}

// ============================================================================
// CORE INTERFACES — Loyalty & Coins
// ============================================================================

/**
 * CoinTransaction — Ledger entry for Booky Coins earn/spend.
 *
 * Every coin movement is recorded for transparency and auditability.
 * Coins are cross-vertical: earn in Sports, redeem in Beauty.
 *
 * @see 02_CLIENT_JOURNEY_LOGIC.md §4.1 — Booky Coins Economy
 */
export interface CoinTransaction {
  /** UUID v4. */
  id: string;

  /** Foreign key → UserProfile.id. */
  userId: string;

  /** Positive = earned, Negative = redeemed/expired. */
  amount: number;

  /**
   * Why this transaction occurred.
   */
  reason:
    | 'booking_reward'
    | 'text_review_bonus'
    | 'photo_review_bonus'
    | 'referral_bonus'
    | 'daily_login'
    | 'new_sector_bonus'
    | 'birthday_bonus'
    | 'redemption'
    | 'expiry';

  /** Foreign key → Booking.id (when reason is booking-related). */
  relatedBookingId: string | null;

  /** Running balance after this transaction. */
  balanceAfter: number;

  /** ISO 8601. */
  createdAt: string;
}

/**
 * RankProgress — User's progress toward the next loyalty rank.
 *
 * Displayed as a progress bar on the Profile page with motivational
 * text like "3 حجوزات كمان وتوصل رتبة اللي فاهمها".
 *
 * @see 02_CLIENT_JOURNEY_LOGIC.md §4.2 — Rank Progression Logic
 */
export interface RankProgress {
  /** Current rank. */
  currentRank: UserRank;

  /** Next rank to achieve (null if already PASHA). */
  nextRank: UserRank | null;

  /** Bookings completed so far. */
  bookingsCompleted: number;

  /** Bookings required for next rank. */
  bookingsRequired: number;

  /** Reviews submitted so far. */
  reviewsSubmitted: number;

  /** Reviews required for next rank. */
  reviewsRequired: number;

  /** Photo reviews submitted so far. */
  photoReviewsSubmitted: number;

  /** Photo reviews required for next rank (only for PASHA). */
  photoReviewsRequired: number;

  /**
   * Percentage progress toward next rank (0-100).
   * Calculated as weighted average of all requirements.
   */
  progressPercent: number;

  /**
   * Motivational message in Egyptian Arabic.
   * @example "3 حجوزات كمان وتوصل رتبة اللي فاهمها! 💪"
   */
  motivationText: string;
}

// ============================================================================
// API RESPONSE WRAPPERS
// ============================================================================

/**
 * Paginated API response wrapper.
 * Used for feed, search results, reviews, booking history.
 */
export interface PaginatedResponse<T> {
  /** Array of items for the current page. */
  data: T[];

  /** Pagination metadata. */
  pagination: {
    /** Current page number (1-based). */
    page: number;

    /** Items per page. */
    perPage: number;

    /** Total items across all pages. */
    totalItems: number;

    /** Total pages available. */
    totalPages: number;

    /** Whether more pages exist. */
    hasNextPage: boolean;
  };
}

/**
 * Standard API error response.
 */
export interface ApiError {
  /** Machine-readable error code. @example "SLOT_ALREADY_BOOKED" */
  code: string;

  /**
   * Human-readable error message in Egyptian Arabic.
   * @example "الموعد ده اتحجز خلاص. عايز تشوف أقرب وقت تاني؟"
   */
  message: string;

  /** HTTP status code. */
  statusCode: number;

  /** Optional field-level validation errors. */
  errors?: Record<string, string>;
}

