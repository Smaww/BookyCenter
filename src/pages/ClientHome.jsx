import React from 'react';
import { motion } from 'framer-motion';
import ClientLayout from '../layouts/ClientLayout';
import StoriesBar from '../components/StoriesBar';
import FeedCard from '../components/FeedCard';

/**
 * ============================================================================
 * CLIENT HOME — The Social Marketplace Feed (Post-Login)
 * ============================================================================
 *
 * Assembly: StoriesBar → Sector Pills → Community Feed
 *
 * This is the "living" home screen that blends:
 *   - Uber utility (instant booking)
 *   - Facebook engagement (social proof, reviews, stories)
 *
 * @see 02_CLIENT_JOURNEY_LOGIC.md §2 — The Social Marketplace Feed
 * ============================================================================
 */

// ============================================================================
// ICONS — Sector Quick-Access Pills
// ============================================================================
const SectorIcons = {
  Trophy: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  Scissors: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
      <line x1="20" x2="8.12" y1="4" y2="15.88" /><line x1="14.47" x2="20" y1="14.48" y2="20" />
      <line x1="8.12" x2="12" y1="8.12" y2="12" />
    </svg>
  ),
  Gamepad: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <line x1="6" x2="10" y1="12" y2="12" /><line x1="8" x2="8" y1="10" y2="14" />
      <line x1="15" x2="15.01" y1="13" y2="13" /><line x1="18" x2="18.01" y1="11" y2="11" />
      <rect width="20" height="12" x="2" y="6" rx="2" />
    </svg>
  ),
  Wrench: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  GraduationCap: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  Gift: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  ),
};

// ============================================================================
// SECTOR QUICK-ACCESS PILLS
// ============================================================================
const SECTORS = [
  { id: 'sports', label: 'ملاعب', icon: SectorIcons.Trophy },
  { id: 'beauty', label: 'جمال', icon: SectorIcons.Scissors },
  { id: 'entertainment', label: 'خروجات', icon: SectorIcons.Gamepad },
  { id: 'home', label: 'بيت', icon: SectorIcons.Wrench },
  { id: 'education', label: 'تعليم', icon: SectorIcons.GraduationCap },
  { id: 'events', label: 'مناسبات', icon: SectorIcons.Gift },
];

const SectorPills = ({ activeSector, onSelect }) => (
  <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1" style={{ WebkitOverflowScrolling: 'touch' }}>
    {/* "الكل" pill */}
    <button
      onClick={() => onSelect?.(null)}
      className={`
        flex items-center gap-1.5 flex-shrink-0
        px-4 py-2 rounded-full text-xs font-bold font-cairo
        transition-all duration-150 border
        ${!activeSector
          ? 'bg-black text-white border-black'
          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
        }
      `}
    >
      الكل
    </button>

    {SECTORS.map((sector) => {
      const isActive = activeSector === sector.id;
      const Icon = sector.icon;
      return (
        <button
          key={sector.id}
          onClick={() => onSelect?.(sector.id)}
          className={`
            flex items-center gap-1.5 flex-shrink-0
            px-4 py-2 rounded-full text-xs font-bold font-cairo
            transition-all duration-150 border
            ${isActive
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }
          `}
        >
          <Icon className="w-4 h-4" />
          <span>{sector.label}</span>
        </button>
      );
    })}
  </div>
);

// ============================================================================
// MOCK FEED DATA — Replace with API: GET /feed
// ============================================================================
const MOCK_FEED = [
  {
    id: 'p1',
    authorId: 'u1',
    authorType: 'client',
    authorName: 'أحمد حسن',
    authorAvatarUrl: null,
    type: 'user_review',
    content: 'ملعب ممتاز والحجز كان سريع جداً. المكان نضيف والإضاءة حلوة بالليل. أنصح بيه أي حد بيدور على ملعب خماسي في المنصورة 💯',
    imageUrl: null,
    rating: 5,
    relatedServiceId: 'svc_001',
    relatedMerchantId: 'mer_001',
    merchantName: 'ملعب النجوم',
    serviceName: 'ملعب خماسي',
    likes: 24,
    comments: 5,
    isLikedByUser: false,
    timeAgo: 'من ساعتين',
  },
  {
    id: 'p2',
    authorId: 'mer_002',
    authorType: 'merchant',
    authorName: 'صالون الأناقة',
    authorAvatarUrl: null,
    type: 'merchant_update',
    content: '🔥 سلوت جديد متاح النهاردة الساعة 5 مساءً! احجز قبل ما يخلص.',
    imageUrl: null,
    rating: null,
    relatedServiceId: 'svc_002',
    relatedMerchantId: 'mer_002',
    merchantName: null,
    serviceName: 'قص شعر رجالي',
    likes: 8,
    comments: 1,
    isLikedByUser: false,
    timeAgo: 'من 30 دقيقة',
  },
  {
    id: 'p3',
    authorId: 'u2',
    authorType: 'client',
    authorName: 'سارة علي',
    authorAvatarUrl: null,
    type: 'user_review',
    content: 'أول مرة أحجز أونلاين وكانت التجربة فوق الممتاز. الدكتورة شاطرة جداً والعيادة منظمة. مفيش أي انتظار!',
    imageUrl: null,
    rating: 5,
    relatedServiceId: 'svc_003',
    relatedMerchantId: 'mer_003',
    merchantName: 'عيادة د. منى',
    serviceName: 'كشف أسنان',
    likes: 42,
    comments: 12,
    isLikedByUser: true,
    timeAgo: 'من 5 ساعات',
  },
  {
    id: 'p4',
    authorId: 'u3',
    authorType: 'client',
    authorName: 'محمد خالد',
    authorAvatarUrl: null,
    type: 'user_review',
    content: 'الجيم ده من أحسن الأماكن اللي اشتركت فيها. الأجهزة كلها جديدة والمدربين محترفين. سعر الاشتراك معقول جداً.',
    imageUrl: null,
    rating: 4,
    relatedServiceId: 'svc_004',
    relatedMerchantId: 'mer_004',
    merchantName: 'جيم باور',
    serviceName: 'اشتراك شهري',
    likes: 18,
    comments: 3,
    isLikedByUser: false,
    timeAgo: 'من يوم',
  },
  {
    id: 'p5',
    authorId: 'system',
    authorType: 'system',
    authorName: 'Booky Center',
    authorAvatarUrl: '/booky_logo.png',
    type: 'booky_highlight',
    content: '🏆 الأكثر حجزاً الأسبوع ده: ملعب النجوم! أكتر من 150 حجز خلال 7 أيام.',
    imageUrl: null,
    rating: null,
    relatedServiceId: 'svc_001',
    relatedMerchantId: 'mer_001',
    merchantName: 'ملعب النجوم',
    serviceName: null,
    likes: 67,
    comments: 8,
    isLikedByUser: false,
    timeAgo: 'من 3 ساعات',
  },
  {
    id: 'p6',
    authorId: 'u4',
    authorType: 'client',
    authorName: 'نورهان أمجد',
    authorAvatarUrl: null,
    type: 'user_review',
    content: 'بيوتي سنتر رائع! الماسك كان نتيجته مذهلة والبنات اللي شغالين هناك ذوق. هحجز تاني الأسبوع الجاي إن شاء الله ✨',
    imageUrl: null,
    rating: 5,
    relatedServiceId: 'svc_005',
    relatedMerchantId: 'mer_005',
    merchantName: 'سبا الهدوء',
    serviceName: 'جلسة عناية بالبشرة',
    likes: 35,
    comments: 7,
    isLikedByUser: false,
    timeAgo: 'من 8 ساعات',
  },
];

// ============================================================================
// SECTION HEADER
// ============================================================================
const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-xl font-black text-black font-cairo">{title}</h2>
    {subtitle && (
      <p className="text-sm text-gray-400 font-cairo mt-0.5">{subtitle}</p>
    )}
  </div>
);

// ============================================================================
// COINS BALANCE CARD (Mini Widget)
// ============================================================================
const CoinsWidget = ({ balance = 230, rank = 'معتمد' }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-black rounded-2xl p-4 flex items-center justify-between"
  >
    <div>
      <p className="text-gray-400 text-xs font-cairo">رصيد الكوينز</p>
      <p className="text-white text-2xl font-black font-cairo mt-0.5">
        {balance.toLocaleString('ar-EG')}
        <span className="text-sm font-medium text-gray-400 mr-1">كوين</span>
      </p>
    </div>
    <div className="flex flex-col items-center gap-1">
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
        <span className="text-lg">🏅</span>
      </div>
      <span className="text-[10px] text-gray-400 font-cairo font-bold">{rank}</span>
    </div>
  </motion.div>
);

// ============================================================================
// CLIENT HOME PAGE — Assembly
// ============================================================================
const ClientHome = ({ onLogout }) => {
  const [activeSector, setActiveSector] = React.useState(null);

  const handleBookNow = (post) => {
    // Future: Navigate to booking flow with pre-filled service
    console.log('Book now:', post.relatedServiceId, post.merchantName);
  };

  const handleStoryTap = (story) => {
    // Future: Open story viewer modal
    console.log('Story tapped:', story.merchantName, story.offerText);
  };

  // Filter feed by sector (mock — in production, API handles filtering)
  const filteredFeed = MOCK_FEED; // No filtering on mock data

  return (
    <ClientLayout onLogout={onLogout}>
      <div className="space-y-6">

        {/* ── GREETING ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-lg font-black text-black font-cairo">
            أهلاً أحمد 👋
          </h1>
          <p className="text-sm text-gray-400 font-cairo">
            عايز تحجز إيه النهاردة؟
          </p>
        </motion.div>

        {/* ── COINS WIDGET ── */}
        <CoinsWidget balance={230} rank="معتمد" />

        {/* ── STORIES BAR ── */}
        <StoriesBar onStoryTap={handleStoryTap} />

        {/* ── SECTOR PILLS ── */}
        <SectorPills activeSector={activeSector} onSelect={setActiveSector} />

        {/* ── COMMUNITY FEED ── */}
        <section>
          <SectionHeader
            title="مجتمع بوكي"
            subtitle="تقييمات حقيقية من ناس زيك"
          />

          <div className="space-y-4">
            {filteredFeed.map((post, index) => (
              <FeedCard
                key={post.id}
                post={post}
                index={index}
                onBookNow={handleBookNow}
              />
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center mt-6 pb-4">
            <button className="text-sm font-bold text-gray-400 hover:text-black font-cairo transition-colors px-6 py-2.5 rounded-full border border-gray-200 hover:border-gray-400">
              عرض المزيد
            </button>
          </div>
        </section>
      </div>
    </ClientLayout>
  );
};

export default ClientHome;

