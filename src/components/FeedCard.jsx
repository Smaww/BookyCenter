import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * ============================================================================
 * FEED CARD — Social Post in the Community Feed
 * ============================================================================
 *
 * The core conversion component. Every card is a "mini-ad":
 *   Header  → Avatar + Name + Star Rating + Time
 *   Body    → Review image (rounded) + Review text
 *   Footer  → Like/Comment on the left, "احجز نفس الخدمة" CTA on the right
 *
 * Maps to the SocialPost interface in src/types/schema.ts.
 * @see 02_CLIENT_JOURNEY_LOGIC.md §2.4 — Community Feed
 * ============================================================================
 */

// ============================================================================
// ICONS — Inline Lucide-style SVGs
// ============================================================================
const Icons = {
  Heart: ({ className = 'w-5 h-5', filled = false }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2}>
      {filled ? (
        <path
          fill="currentColor"
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        />
      ) : (
        <path
          fill="none"
          stroke="currentColor"
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        />
      )}
    </svg>
  ),
  MessageCircle: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  Star: ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      />
    </svg>
  ),
  ArrowLeft: ({ className = 'w-4 h-4' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  Clock: ({ className = 'w-3.5 h-3.5' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

// ============================================================================
// STAR RATING (Compact Row)
// ============================================================================
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Icons.Star
        key={star}
        className={`w-3.5 h-3.5 ${
          star <= rating ? 'text-black' : 'text-gray-200'
        }`}
      />
    ))}
  </div>
);

// ============================================================================
// FEED CARD COMPONENT
// ============================================================================
const FeedCard = ({ post, index = 0, onBookNow }) => {
  const [isLiked, setIsLiked] = useState(post.isLikedByUser || false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* ── HEADER: Avatar + Name + Rating + Time ── */}
      <div className="flex items-center gap-3 p-4 pb-3">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
          {post.authorAvatarUrl ? (
            <img
              src={post.authorAvatarUrl}
              alt={post.authorName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-base font-black text-black font-cairo">
              {post.authorName?.charAt(0) || '؟'}
            </span>
          )}
        </div>

        {/* Name + Rating */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-black font-cairo truncate">
              {post.authorName}
            </h4>
            {post.type === 'user_review' && post.rating && (
              <StarRating rating={post.rating} />
            )}
          </div>

          {/* Merchant name + time */}
          <div className="flex items-center gap-1.5 mt-0.5">
            {post.merchantName && (
              <span className="text-xs text-gray-500 font-cairo truncate">
                {post.merchantName}
              </span>
            )}
            <span className="text-gray-300">·</span>
            <div className="flex items-center gap-1 text-gray-400">
              <Icons.Clock className="w-3 h-3" />
              <span className="text-[11px] font-cairo">{post.timeAgo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY: Image + Text ── */}
      <div className="px-4">
        {/* Review text */}
        {post.content && (
          <p className="text-sm text-gray-800 font-cairo leading-relaxed mb-3">
            {post.content}
          </p>
        )}

        {/* Attached image */}
        {post.imageUrl && (
          <div className="rounded-xl overflow-hidden bg-gray-100 mb-3">
            <img
              src={post.imageUrl}
              alt="مراجعة"
              className="w-full h-48 sm:h-56 object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Service tag chip */}
        {post.serviceName && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-bold font-cairo px-3 py-1.5 rounded-full">
              {post.serviceName}
            </span>
          </div>
        )}
      </div>

      {/* ── FOOTER: Like/Comment + Book CTA ── */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
        {/* Social Actions */}
        <div className="flex items-center gap-4">
          {/* Like */}
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 group"
          >
            <Icons.Heart
              filled={isLiked}
              className={`w-[20px] h-[20px] transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-600'
              }`}
            />
            {likesCount > 0 && (
              <span className={`text-xs font-bold font-cairo ${
                isLiked ? 'text-red-500' : 'text-gray-400'
              }`}>
                {likesCount}
              </span>
            )}
          </button>

          {/* Comment */}
          <button className="flex items-center gap-1.5 group">
            <Icons.MessageCircle className="w-[20px] h-[20px] text-gray-400 group-hover:text-gray-600 transition-colors" />
            {post.comments > 0 && (
              <span className="text-xs font-bold text-gray-400 font-cairo">
                {post.comments}
              </span>
            )}
          </button>
        </div>

        {/* Booking CTA — The Conversion Driver */}
        {post.relatedServiceId && (
          <button
            onClick={() => onBookNow?.(post)}
            className="
              flex items-center gap-1.5
              bg-black text-white text-xs font-bold font-cairo
              px-4 py-2 rounded-full
              hover:bg-gray-800 active:scale-[0.97]
              transition-all duration-150
            "
          >
            <span>احجز نفس الخدمة</span>
            <Icons.ArrowLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.article>
  );
};

export default FeedCard;

