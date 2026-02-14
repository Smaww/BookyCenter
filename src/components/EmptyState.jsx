import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * ============================================================================
 * BOOKY CENTER — EmptyState
 * ============================================================================
 *
 * Shown when search returns zero merchants for the requested
 * sector + location combination.
 *
 * Terminology (BOOKY_CENTER_BUSINESS_MASTER.md):
 *   - Service  (الخدمة)  — the bookable item
 *   - Sector   (القطاع)  — the category
 *   - Merchant (التاجر)  — the provider
 *
 * ============================================================================
 */

// ── Illustration: "Nothing Here" (Lucide-style SVG) ──
const EmptyIllustration = () => (
  <svg
    className="w-48 h-48 sm:w-56 sm:h-56 text-gray-300"
    fill="none"
    stroke="currentColor"
    strokeWidth={1}
    viewBox="0 0 120 120"
  >
    {/* Map pin with question mark */}
    <circle cx="60" cy="44" r="24" strokeDasharray="4 3" />
    <path d="M60 68 C60 68 40 50 40 38 a20 20 0 1 1 40 0 c0 12-20 30-20 30Z" />
    <circle cx="60" cy="38" r="6" fill="none" />
    <text
      x="60"
      y="42"
      textAnchor="middle"
      fontSize="14"
      fontWeight="bold"
      fill="currentColor"
      stroke="none"
    >
      ?
    </text>
    {/* Ground line */}
    <path d="M25 90 h70" strokeLinecap="round" />
    <path d="M35 96 h50" strokeLinecap="round" opacity="0.5" />
    <path d="M45 102 h30" strokeLinecap="round" opacity="0.3" />
  </svg>
);

const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center text-center px-6 py-16 sm:py-24"
      dir="rtl"
    >
      {/* Illustration */}
      <div className="mb-8">
        <EmptyIllustration />
      </div>

      {/* Main Message */}
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-black font-cairo mb-3">
        لسه مفيش خدمات في المنطقة دي!
      </h2>

      {/* Sub-message */}
      <p className="text-sm sm:text-base text-gray-500 font-cairo max-w-md mb-8 leading-relaxed">
        مفيش تجّار متاحين دلوقتي في المكان ده — لكن ده بيتغير كل يوم.
        <br />
        سجّل عشان نبلّغك أول ما خدمة تتوفر قُرُبك.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm sm:max-w-none sm:w-auto">
        {/* Primary CTA — Notify Me */}
        <button
          className="
            w-full sm:w-auto
            px-8 py-3.5
            bg-black text-white
            font-bold font-cairo text-sm sm:text-base
            rounded-xl
            shadow-lg shadow-black/20
            hover:shadow-xl hover:-translate-y-0.5
            active:translate-y-0 active:scale-[0.98]
            transition-all duration-200
          "
        >
          بلغنا لما الخدمة تتوفر
        </button>

        {/* Secondary CTA — Search Again */}
        <button
          onClick={() => navigate('/')}
          className="
            w-full sm:w-auto
            px-8 py-3.5
            bg-white text-black
            font-bold font-cairo text-sm sm:text-base
            rounded-xl
            border-2 border-black
            hover:bg-black hover:text-white
            active:scale-[0.98]
            transition-all duration-200
          "
        >
          ابحث في منطقة تانية
        </button>
      </div>
    </div>
  );
};

export default EmptyState;


