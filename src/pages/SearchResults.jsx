import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import EmptyState from '../components/EmptyState';

/**
 * ============================================================================
 * BOOKY CENTER — SearchResults Page
 * ============================================================================
 *
 * Route: /search?lat=...&lng=...&category=...
 *
 * Terminology (BOOKY_CENTER_BUSINESS_MASTER.md):
 *   - Merchant  (التاجر)     — the service provider
 *   - Service   (الخدمة)     — the bookable item
 *   - Sector    (القطاع)     — sports | health_beauty | entertainment | …
 *   - Booking   (الحجز)      — the transaction
 *   - Client    (العميل)     — the end-user
 *   - Slot      (الموعد المتاح) — available time
 *
 * Currency: EGP (integers only)
 *
 * ============================================================================
 */

// ============================================================================
// ICONS — Lucide-Style B&W SVG (only what this page needs)
// ============================================================================
const Icons = {
  ArrowRight: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  Star: ({ className = 'w-4 h-4' }) => (
    <svg className={className} fill="currentColor" stroke="none" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  MapPin: ({ className = 'w-4 h-4' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Filter: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  ChevronDown: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  Calendar: ({ className = 'w-4 h-4' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  ),
  Loader: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
};

// ============================================================================
// SECTOR LABELS — Arabic names for the 6 sectors
// ============================================================================
const SECTOR_LABELS = {
  sports: 'ملاعب ورياضة',
  health_beauty: 'صحة وجمال',
  entertainment: 'خروجات وترفيه',
  home_services: 'خدمات منزلية',
  education: 'تعليم ومساحات عمل',
  events: 'مناسبات وأفراح',
};

// ============================================================================
// MOCK DATA — 5 diverse merchants near Cairo
// ============================================================================
const MOCK_MERCHANTS = [
  {
    id: 'merch-001',
    name: 'ملاعب الأهرام',
    sector: 'sports',
    image: '/merchant-placeholder.png',
    rating: 4.8,
    reviewCount: 234,
    priceRange: { min: 200, max: 500 },
    address: 'المهندسين، الجيزة',
    lat: 30.0561,
    lng: 31.2001,
    services: ['ملعب كورة', 'باديل', 'سباحة'],
    nextSlot: 'النهاردة ٦:٠٠ م',
  },
  {
    id: 'merch-002',
    name: 'Flex Gym & Fitness',
    sector: 'sports',
    image: '/merchant-placeholder.png',
    rating: 4.5,
    reviewCount: 187,
    priceRange: { min: 150, max: 350 },
    address: 'مدينة نصر، القاهرة',
    lat: 30.0511,
    lng: 31.3456,
    services: ['جيم', 'يوجا', 'كروس فيت'],
    nextSlot: 'بكرة ٨:٠٠ ص',
  },
  {
    id: 'merch-003',
    name: 'بيوتي لاونج',
    sector: 'health_beauty',
    image: '/merchant-placeholder.png',
    rating: 4.9,
    reviewCount: 412,
    priceRange: { min: 100, max: 800 },
    address: 'الزمالك، القاهرة',
    lat: 30.0655,
    lng: 31.2199,
    services: ['بيوتي سنتر', 'سبا', 'جلدية'],
    nextSlot: 'النهاردة ٣:٠٠ م',
  },
  {
    id: 'merch-004',
    name: 'د. أحمد خليل — عيادات تجميل',
    sector: 'health_beauty',
    image: '/merchant-placeholder.png',
    rating: 4.7,
    reviewCount: 98,
    priceRange: { min: 300, max: 1500 },
    address: 'التجمع الخامس، القاهرة',
    lat: 30.0074,
    lng: 31.4913,
    services: ['جلدية', 'تغذية', 'ليزر'],
    nextSlot: 'بعد بكرة ١١:٠٠ ص',
  },
  {
    id: 'merch-005',
    name: 'Cairo Stars Padel',
    sector: 'sports',
    image: '/merchant-placeholder.png',
    rating: 4.6,
    reviewCount: 156,
    priceRange: { min: 250, max: 600 },
    address: 'الشيخ زايد، الجيزة',
    lat: 30.0176,
    lng: 30.9783,
    services: ['باديل', 'ملعب كورة'],
    nextSlot: 'النهاردة ٩:٠٠ م',
  },
];

// ============================================================================
// MERCHANT CARD — Shared between Desktop Grid & Mobile Bottom Sheet
// ============================================================================
const MerchantCard = ({ merchant }) => (
  <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-black hover:shadow-xl transition-all duration-300 cursor-pointer">
    {/* Image Cover */}
    <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
      <img
        src={merchant.image}
        alt={merchant.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        onError={(e) => {
          e.target.onerror = null;
          e.target.style.display = 'none';
        }}
      />
      {/* Next Available Slot Badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm">
        <Icons.Calendar className="w-3.5 h-3.5 text-black" />
        <span className="text-xs font-bold font-cairo text-black">{merchant.nextSlot}</span>
      </div>
    </div>

    {/* Card Body */}
    <div className="p-4 sm:p-5" dir="rtl">
      {/* Row 1: Name + Rating */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-base sm:text-lg font-black text-black font-cairo leading-tight line-clamp-1">
          {merchant.name}
        </h3>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Icons.Star className="w-4 h-4 text-black" />
          <span className="text-sm font-bold text-black font-cairo">{merchant.rating}</span>
          <span className="text-xs text-gray-400 font-cairo">({merchant.reviewCount})</span>
        </div>
      </div>

      {/* Row 2: Address */}
      <div className="flex items-center gap-1.5 mb-3">
        <Icons.MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-500 font-cairo truncate">{merchant.address}</span>
      </div>

      {/* Row 3: Services Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {merchant.services.map((service) => (
          <span
            key={service}
            className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold font-cairo rounded-full"
          >
            {service}
          </span>
        ))}
      </div>

      {/* Row 4: Price + CTA */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg font-black text-black font-cairo">
            {merchant.priceRange.min}
          </span>
          <span className="text-xs text-gray-400 font-cairo mr-1">
            — {merchant.priceRange.max} ج.م
          </span>
        </div>
        <button className="px-5 py-2.5 bg-black text-white text-sm font-bold font-cairo rounded-xl hover:bg-gray-800 active:scale-[0.97] transition-all duration-200">
          احجز دلوقتي
        </button>
      </div>
    </div>
  </div>
);

// ============================================================================
// DESKTOP RESULTS LIST — Airbnb-Style Grid (lg and above)
// ============================================================================
const DesktopResultsList = ({ merchants, sectorLabel }) => (
  <div className="hidden lg:block" dir="rtl">
    {/* Results count */}
    <div className="flex items-center justify-between mb-6">
      <p className="text-sm text-gray-500 font-cairo">
        <span className="font-black text-black text-lg">{merchants.length}</span>{' '}
        تاجر متاح في{' '}
        <span className="font-bold text-black">{sectorLabel}</span>
      </p>
      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
        <Icons.Filter className="w-4 h-4 text-black" />
        <span className="text-sm font-bold font-cairo text-black">فلتر</span>
      </button>
    </div>

    {/* Grid */}
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
      {merchants.map((merchant) => (
        <MerchantCard key={merchant.id} merchant={merchant} />
      ))}
    </div>
  </div>
);

// ============================================================================
// MOBILE BOTTOM SHEET — framer-motion powered draggable sheet
// ============================================================================
const SHEET_SNAP = {
  collapsed: 'calc(100vh - 160px)',   // show ~160px from bottom
  half: '50vh',
  full: '64px',                        // almost full screen (header visible)
};

const MobileBottomSheet = ({ merchants, sectorLabel }) => {
  const [sheetPosition, setSheetPosition] = useState('collapsed');
  const dragControls = useDragControls();
  const sheetRef = useRef(null);

  // Map snap names → pixel y-values
  const getSnapY = useCallback(() => {
    const vh = window.innerHeight;
    return {
      collapsed: vh - 160,
      half: vh * 0.5,
      full: 64,
    };
  }, []);

  const handleDragEnd = useCallback(
    (_, info) => {
      const snaps = getSnapY();
      const currentY = info.point.y;

      // Determine closest snap point
      const distances = {
        collapsed: Math.abs(currentY - snaps.collapsed),
        half: Math.abs(currentY - snaps.half),
        full: Math.abs(currentY - snaps.full),
      };

      const closest = Object.entries(distances).reduce((a, b) =>
        a[1] < b[1] ? a : b
      )[0];

      setSheetPosition(closest);
    },
    [getSnapY]
  );

  return (
    <div className="lg:hidden fixed inset-0 z-40 pointer-events-none">
      {/* Map Placeholder Background */}
      <div className="absolute inset-0 bg-gray-200 pointer-events-auto">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Icons.MapPin className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400 font-cairo">الخريطة هتكون هنا</p>
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <motion.div
        ref={sheetRef}
        className="absolute left-0 right-0 bottom-0 pointer-events-auto"
        style={{ top: 0 }}
        initial={{ y: getSnapY().collapsed }}
        animate={{ y: getSnapY()[sheetPosition] }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        drag="y"
        dragControls={dragControls}
        dragConstraints={{ top: getSnapY().full, bottom: getSnapY().collapsed }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        <div className="bg-white rounded-t-3xl shadow-2xl shadow-black/30 min-h-screen">
          {/* Drag Handle */}
          <div
            className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Sheet Header */}
          <div className="px-5 pb-4 border-b border-gray-100" dir="rtl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-black font-cairo">
                  {sectorLabel}
                </h3>
                <p className="text-xs text-gray-500 font-cairo">
                  {merchants.length} تاجر متاح
                </p>
              </div>
              <button
                onClick={() =>
                  setSheetPosition(sheetPosition === 'full' ? 'half' : 'full')
                }
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <Icons.ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                    sheetPosition === 'full' ? 'rotate-0' : 'rotate-180'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Scrollable Merchant List */}
          <div
            className="overflow-y-auto px-4 py-4 space-y-4"
            style={{ maxHeight: 'calc(100vh - 180px)' }}
            dir="rtl"
          >
            {merchants.map((merchant) => (
              <MerchantCard key={merchant.id} merchant={merchant} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// SEARCH RESULTS PAGE — Main Component
// ============================================================================
const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const category = searchParams.get('category');

  const sectorLabel = SECTOR_LABELS[category] || category || 'الكل';

  // ── State ──
  const [merchants, setMerchants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── Simulate fetching data ──
  useEffect(() => {
    setIsLoading(true);

    // Simulate network delay (500ms)
    const timer = setTimeout(() => {
      let results = [...MOCK_MERCHANTS];

      // Filter by sector (category param)
      if (category) {
        results = results.filter((m) => m.sector === category);
      }

      setMerchants(results);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [category, lat, lng]);

  // ========================================================================
  // LOADING STATE
  // ========================================================================
  if (isLoading) {
    return (
      <div
        className="min-h-screen w-full max-w-full overflow-x-hidden bg-white font-cairo flex flex-col"
        dir="rtl"
      >
        {/* Top Bar */}
        <SearchHeader sectorLabel={sectorLabel} onBack={() => navigate('/')} />

        {/* Skeleton Grid */}
        <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/10] bg-gray-200 rounded-2xl mb-4" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-100 rounded-full w-16" />
                  <div className="h-6 bg-gray-100 rounded-full w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ========================================================================
  // EMPTY STATE
  // ========================================================================
  if (merchants.length === 0) {
    return (
      <div
        className="min-h-screen w-full max-w-full overflow-x-hidden bg-white font-cairo flex flex-col"
        dir="rtl"
      >
        <SearchHeader sectorLabel={sectorLabel} onBack={() => navigate('/')} />
        <div className="flex-1 flex items-center justify-center">
          <EmptyState />
        </div>
      </div>
    );
  }

  // ========================================================================
  // RESULTS STATE
  // ========================================================================
  return (
    <div
      className="min-h-screen w-full max-w-full overflow-x-hidden bg-white font-cairo flex flex-col"
      dir="rtl"
    >
      <SearchHeader sectorLabel={sectorLabel} onBack={() => navigate('/')} />

      {/* ── Desktop: Airbnb-Style Card Grid ── */}
      <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
        <DesktopResultsList merchants={merchants} sectorLabel={sectorLabel} />
      </div>

      {/* ── Mobile: Bottom Sheet over Map Placeholder ── */}
      <MobileBottomSheet merchants={merchants} sectorLabel={sectorLabel} />
    </div>
  );
};

// ============================================================================
// SEARCH HEADER — Sticky top bar with back button & sector label
// ============================================================================
const SearchHeader = ({ sectorLabel, onBack }) => (
  <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-14 sm:h-16">
        {/* Right: Back + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            aria-label="رجوع"
          >
            <Icons.ArrowRight className="w-5 h-5 text-black" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-black text-black font-cairo leading-tight">
              {sectorLabel}
            </h1>
            <p className="text-xs text-gray-400 font-cairo hidden sm:block">نتائج البحث</p>
          </div>
        </div>

        {/* Left: Brand */}
        <span className="text-sm font-black text-black font-cairo tracking-tight">
          Booky Center
        </span>
      </div>
    </div>
  </header>
);

export default SearchResults;


