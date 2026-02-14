import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * ============================================================================
 * STORIES BAR — 24h Flash Offers (Instagram/WhatsApp-Style)
 * ============================================================================
 *
 * Horizontal scroll of circular merchant avatars.
 * Red ring = active (unseen) offer. Gray ring = already viewed.
 * FOMO countdown badge on each story.
 *
 * @see 02_CLIENT_JOURNEY_LOGIC.md §2.3 — Stories (Flash Offers)
 * ============================================================================
 */

// ============================================================================
// MOCK DATA — Replace with API: GET /feed/stories
// ============================================================================
const MOCK_STORIES = [
  {
    id: 's1',
    merchantName: 'ملعب النجوم',
    merchantAvatarUrl: null,
    initial: 'ن',
    offerText: 'خصم 30% الصبح',
    offerType: 'discount',
    isViewedByUser: false,
    expiresIn: '3 ساعات',
  },
  {
    id: 's2',
    merchantName: 'صالون الأناقة',
    merchantAvatarUrl: null,
    initial: 'أ',
    offerText: 'سلوت جديد الساعة 5',
    offerType: 'new_slot',
    isViewedByUser: false,
    expiresIn: '5 ساعات',
  },
  {
    id: 's3',
    merchantName: 'كيدز لاند',
    merchantAvatarUrl: null,
    initial: 'ك',
    offerText: 'عرض عيد ميلاد 🎉',
    offerType: 'flash_deal',
    isViewedByUser: true,
    expiresIn: '8 ساعات',
  },
  {
    id: 's4',
    merchantName: 'دكتور أحمد',
    merchantAvatarUrl: null,
    initial: 'د',
    offerText: 'كشف مجاني أول مرة',
    offerType: 'discount',
    isViewedByUser: false,
    expiresIn: '12 ساعة',
  },
  {
    id: 's5',
    merchantName: 'جيم باور',
    merchantAvatarUrl: null,
    initial: 'ج',
    offerText: 'اشتراك شهر بنص السعر',
    offerType: 'flash_deal',
    isViewedByUser: false,
    expiresIn: '2 ساعة',
  },
  {
    id: 's6',
    merchantName: 'سبا الهدوء',
    merchantAvatarUrl: null,
    initial: 'س',
    offerText: 'جلسة مساج 199 ج.م',
    offerType: 'discount',
    isViewedByUser: true,
    expiresIn: '6 ساعات',
  },
];

// ============================================================================
// SINGLE STORY BUBBLE
// ============================================================================
const StoryBubble = ({ story, index, onTap }) => {
  const isUnseen = !story.isViewedByUser;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: 'easeOut' }}
      onClick={() => onTap?.(story)}
      className="flex flex-col items-center gap-1.5 flex-shrink-0 w-[72px] group"
    >
      {/* Avatar Ring */}
      <div
        className={`
          relative w-16 h-16 rounded-full p-[2.5px]
          transition-transform duration-200 group-active:scale-95
          ${isUnseen
            ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-500'
            : 'bg-gray-300'
          }
        `}
      >
        {/* Inner white ring */}
        <div className="w-full h-full rounded-full bg-white p-[2px]">
          {/* Avatar */}
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {story.merchantAvatarUrl ? (
              <img
                src={story.merchantAvatarUrl}
                alt={story.merchantName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-black text-black font-cairo">
                {story.initial}
              </span>
            )}
          </div>
        </div>

        {/* FOMO badge */}
        {isUnseen && (
          <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-bold font-cairo px-1.5 py-0.5 rounded-full whitespace-nowrap leading-none">
            {story.expiresIn}
          </span>
        )}
      </div>

      {/* Merchant name */}
      <span className={`text-[10px] font-cairo leading-tight text-center line-clamp-1 ${
        isUnseen ? 'font-bold text-black' : 'font-medium text-gray-400'
      }`}>
        {story.merchantName}
      </span>
    </motion.button>
  );
};

// ============================================================================
// STORIES BAR — Horizontal Scroll Container
// ============================================================================
const StoriesBar = ({ stories = MOCK_STORIES, onStoryTap }) => {
  const scrollRef = useRef(null);

  if (!stories || stories.length === 0) return null;

  return (
    <section className="w-full">
      {/* Section label */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-bold text-black font-cairo">عروض النهاردة 🔥</h3>
        <span className="text-xs text-gray-400 font-cairo">تنتهي خلال 24 ساعة</span>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {stories.map((story, i) => (
          <StoryBubble
            key={story.id}
            story={story}
            index={i}
            onTap={onStoryTap}
          />
        ))}
      </div>
    </section>
  );
};

export default StoriesBar;

