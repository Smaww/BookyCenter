import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoadScript } from '@react-google-maps/api';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import BrandedPattern from './BrandedPattern';

/**
 * ============================================================================
 * BOOKY CENTER — HeroSection (Geo-Smart Search Bar & UI Polish)
 * ============================================================================
 *
 * Build Tool: Create React App (react-scripts)
 * Env Prefix: REACT_APP_   →  process.env.REACT_APP_GOOGLE_MAPS_KEY
 *
 * CRITICAL: The `libraries` array is defined OUTSIDE the component
 *           as a static constant. If defined inside, React sees a new
 *           array reference every render → useLoadScript re-fires →
 *           infinite re-render loop that crashes the browser.
 *
 * Terminology: Follows BOOKY_CENTER_BUSINESS_MASTER.md
 *   - Client (العميل)   — the end-user
 *   - Merchant (التاجر)  — the service provider
 *   - Service (الخدمة)   — the bookable item
 *   - Sector (القطاع)    — the category
 *   - Booking (الحجز)    — the transaction
 *
 * ============================================================================
 */

// ============================================================================
// CONSTANTS — MUST live outside any component to prevent re-render loops
// ============================================================================

/** @type {('places')[]} — stable ref, never re-created */
const GOOGLE_MAPS_LIBRARIES = ['places'];

/**
 * Read the API key from CRA's process.env (REACT_APP_ prefix required).
 * Hard fallback for debugging only — remove in production.
 */
const GOOGLE_MAPS_KEY =
  process.env.REACT_APP_GOOGLE_MAPS_KEY ||
  'AIzaSyCPCOs5dglHqme2EfDKyQcq4W-MDiaUDj4'; // ← DEBUG FALLBACK — remove for prod

// Dev-time guard — warns in console if the .env key is missing
if (!process.env.REACT_APP_GOOGLE_MAPS_KEY) {
  console.warn(
    '[Booky Center] ⚠️  REACT_APP_GOOGLE_MAPS_KEY is missing from your .env file.\n' +
      'Using hardcoded fallback key (DEBUG ONLY).\n' +
      'Add the following line to your project root .env:\n\n' +
      '  REACT_APP_GOOGLE_MAPS_KEY=YOUR_ACTUAL_KEY_HERE\n\n' +
      'Then RESTART the dev server (npm start).\n' +
      '(CRA does NOT hot-reload .env changes — a restart is required.)'
  );
}

// ── Verification log (requested for debugging) ──
console.log('API Key Status:', GOOGLE_MAPS_KEY ? '✅ Loaded' : '❌ Missing');

const SECTOR_OPTIONS = [
  { label: 'ملاعب وصالات', value: 'sports' },
  { label: 'جمال وصحة', value: 'health_beauty' },
  { label: 'خروجات وعيلة', value: 'entertainment' },
  { label: 'خدمات بيت', value: 'home_services' },
  { label: 'تعليم وشغل', value: 'education' },
  { label: 'مناسبات', value: 'events' },
];

// ============================================================================
// ICONS — Only what HeroSection needs (Lucide-Style B&W SVG)
// ============================================================================
const Icons = {
  Search: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  MapPin: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Grid: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  ),
  ChevronDown: ({ className = 'w-4 h-4' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  Check: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  Loader: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  AlertCircle: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  ),
  WifiOff: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <line x1="2" x2="22" y1="2" y2="22" />
      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
      <path d="M2 8.82a15 15 0 0 1 4.17-2.65" />
      <path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76" />
      <path d="M16.85 11.25a10 10 0 0 1 2.22 1.68" />
      <path d="M5 12.86a10 10 0 0 1 5.17-2.89" />
      <line x1="12" x2="12.01" y1="20" y2="20" />
    </svg>
  ),
};

// ============================================================================
// HERO ILLUSTRATION — Constrained for Zero-Scroll
// ============================================================================
const HeroIllustration = ({ className = '', isLoaded = false }) => (
  <div className={`relative bg-transparent flex items-center justify-center ${className}`}>
    <img
      src="/hero-illustration.png"
      alt="شخص يستخدم تطبيق بوكي سنتر"
      className={`w-auto h-full max-h-[35vh] lg:max-h-[40vh] object-contain transition-all duration-700 drop-shadow-2xl grayscale ${
        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    />
  </div>
);

// ============================================================================
// BOOKY TOAST — Branded, Friendly, Pill-Shaped Notification
// ============================================================================
//
//  ┌─────────────────────────────────────────────┐
//  │  [B logo]   عشان نجيلك لحد عندك …   [✕]   │
//  └─────────────────────────────────────────────┘
//
// Position : Fixed bottom-10 (mob) / bottom-8 (lg), centered, z-[100]
// Shape    : rounded-full (pill)
// Colour   : Pure white, shadow-2xl shadow-black/20, border-gray-100
// Animation: Slide-up + fade-in via CSS @keyframes (defined inline)
// Auto-dismiss after 3 s  (timer lives in the parent HeroSection)
// ============================================================================

const BookyToast = ({ message, onDismiss }) => (
  <div
    className="fixed bottom-10 sm:bottom-8 left-1/2 z-[100] pointer-events-none"
    style={{
      transform: 'translateX(-50%)',
      animation: 'bookyToastIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    }}
    role="alert"
    dir="rtl"
  >
    {/* Inline keyframes — injected once, scoped to this component */}
    <style>{`
      @keyframes bookyToastIn {
        0%   { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.95); }
        100% { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1);    }
      }
    `}</style>

    <div
      className="
        pointer-events-auto
        flex items-center gap-3
        px-5 sm:px-6 py-3 sm:py-3.5
        bg-white
        rounded-full
        shadow-2xl shadow-black/20
        border border-gray-100
        font-cairo font-semibold text-sm sm:text-base
        min-w-[260px] sm:min-w-[320px] max-w-[92vw]
      "
    >
      {/* ── Brand Logo (right side in RTL) ── */}
      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-black leading-none select-none">B</span>
      </div>

      {/* ── Message ── */}
      <span className="flex-1 text-black leading-snug">{message}</span>

      {/* ── Dismiss ── */}
      <button
        onClick={onDismiss}
        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center flex-shrink-0 transition-colors"
        aria-label="إغلاق"
      >
        <Icons.X className="w-3.5 h-3.5 text-gray-400" />
      </button>
    </div>
  </div>
);

// ============================================================================
// PLACES AUTOCOMPLETE INPUT — Google-powered, Egypt-restricted
// ============================================================================
//
// Uses `initOnMount: false` so the hook does NOT try to access
// google.maps.places before the script has finished loading.
// We manually call `init()` once `isScriptLoaded` flips to true.
// ============================================================================
const PlacesAutocompleteInput = ({ onSelect, isScriptLoaded }) => {
  const {
    ready,
    value,
    suggestions: { status, data, loading },
    setValue,
    clearSuggestions,
    init,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'eg' },
    },
    debounce: 300,
    initOnMount: false, // ← critical: wait for script
  });

  // Manually init when Google script finishes loading
  useEffect(() => {
    if (isScriptLoaded) {
      init();
    }
  }, [isScriptLoaded, init]);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        clearSuggestions();
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearSuggestions]);

  // Handle selecting a suggestion
  const handleSelect = useCallback(
    async (description) => {
      setValue(description, false);
      clearSuggestions();
      setIsFocused(false);

      try {
        const results = await getGeocode({ address: description });
        const { lat, lng } = getLatLng(results[0]);
        onSelect({ address: description, lat, lng });
      } catch (error) {
        console.error('[Booky] Geocode error:', error);
        onSelect({ address: description, lat: null, lng: null });
      }
    },
    [setValue, clearSuggestions, onSelect]
  );

  // Handle clearing the input
  const handleClear = useCallback(() => {
    setValue('', false);
    clearSuggestions();
    onSelect({ address: '', lat: null, lng: null });
    inputRef.current?.focus();
  }, [setValue, clearSuggestions, onSelect]);

  // Keyboard: Escape closes, Enter picks first result
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        clearSuggestions();
        setIsFocused(false);
        inputRef.current?.blur();
      }
      if (e.key === 'Enter' && status === 'OK' && data.length > 0) {
        e.preventDefault();
        handleSelect(data[0].description);
      }
    },
    [clearSuggestions, status, data, handleSelect]
  );

  const showDropdown = isFocused && (status === 'OK' || loading);

  // Decide placeholder based on loading state
  const placeholder = !isScriptLoaded
    ? 'جاري تحميل الخريطة...'
    : ready
      ? 'اكتب اسم المنطقة...'
      : 'جاري التهيئة...';

  return (
    <div ref={wrapperRef} className="relative">
      {/* Input Row — taller on lg to match ticket luxury spacing */}
      <div className="flex items-center gap-3 px-5 sm:px-6 h-11 sm:h-12">
        <Icons.MapPin className={`w-5 h-5 flex-shrink-0 ${ready ? 'text-black' : 'text-gray-300'}`} />

        {/* Skeleton pulse while script loads, real input once available */}
        {!isScriptLoaded ? (
          <div className="flex items-center gap-2 flex-1">
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            disabled={!ready}
            placeholder={placeholder}
            className="w-full h-full bg-transparent font-semibold font-cairo text-sm sm:text-base text-black placeholder:text-gray-400 border-none outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50"
            dir="rtl"
            autoComplete="off"
            aria-label="ابحث عن منطقتك"
            role="combobox"
            aria-expanded={showDropdown}
            aria-autocomplete="list"
          />
        )}

        {/* Loading spinner while script or autocomplete service initializes */}
        {(!isScriptLoaded || (isScriptLoaded && !ready)) && (
          <Icons.Loader className="w-4 h-4 text-gray-400 animate-spin flex-shrink-0" />
        )}

        {/* Clear button when input has a value */}
        {value && ready && (
          <button
            type="button"
            onClick={handleClear}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center flex-shrink-0 transition-colors"
            aria-label="مسح"
          >
            <Icons.X className="w-3.5 h-3.5 text-gray-500" />
          </button>
        )}
      </div>

      {/* ========== SUGGESTIONS DROPDOWN ========== */}
      {/* z-50, absolute, bg-white, shadow-xl, rounded-lg — floats, never pushes */}
      {showDropdown && (
        <ul
          className="absolute top-full left-0 w-full z-50 bg-white rounded-lg shadow-xl ring-1 ring-black/5 mt-2 py-2 max-h-64 overflow-y-auto"
          role="listbox"
          style={{ animation: 'dropdownFadeIn 0.2s ease-out forwards' }}
        >
          {/* Loading State */}
          {loading && (
            <li className="flex items-center justify-center gap-2 px-4 py-4">
              <Icons.Loader className="w-4 h-4 text-gray-400 animate-spin" />
              <span className="text-sm text-gray-400 font-cairo">جاري البحث...</span>
            </li>
          )}

          {/* Suggestion Items */}
          {status === 'OK' &&
            data.map(({ place_id, description, structured_formatting }) => (
              <li
                key={place_id}
                onClick={() => handleSelect(description)}
                className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                role="option"
                dir="rtl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Icons.MapPin className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-cairo font-bold text-sm text-black truncate">
                      {structured_formatting?.main_text || description}
                    </p>
                    {structured_formatting?.secondary_text && (
                      <p className="font-cairo text-xs text-gray-400 truncate">
                        {structured_formatting.secondary_text}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

// ============================================================================
// ERROR STATE — Shown when Google Maps script fails to load
// ============================================================================
const MapsLoadError = () => (
  <div className="relative">
    <div className="flex items-center gap-3 px-5 sm:px-6 h-11 sm:h-12">
      <Icons.WifiOff className="w-5 h-5 text-red-400 flex-shrink-0" />
      <span className="font-cairo text-sm text-red-400">
        تعذر تحميل الخريطة — جرب تاني
      </span>
    </div>
  </div>
);

// ============================================================================
// SECTOR DROPDOWN — Uber-Style Custom Dropdown for Service Categories
// ============================================================================
const SectorDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const selectedOption = SECTOR_OPTIONS.find((opt) => opt.value === value);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 sm:h-12 flex items-center justify-between gap-2 px-5 sm:px-6 bg-transparent hover:bg-gray-50/80 transition-colors border-none outline-none focus:outline-none"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="اختر نوع الخدمة"
      >
        <div className="flex items-center gap-3">
          <Icons.Grid className="w-5 h-5 text-black flex-shrink-0" />
          <span
            className={`font-semibold font-cairo text-sm sm:text-base ${
              value ? 'text-black' : 'text-gray-400'
            }`}
          >
            {selectedOption?.label || 'نوع الخدمة'}
          </span>
        </div>
        <Icons.ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown — z-50, absolute, bg-white, shadow-xl, rounded-lg */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl ring-1 ring-black/5 z-50 overflow-hidden"
          role="listbox"
          style={{ animation: 'dropdownFadeIn 0.2s ease-out forwards' }}
        >
          <div className="max-h-64 overflow-y-auto py-2">
            {SECTOR_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-right px-4 py-3.5 font-cairo font-semibold transition-colors border-none outline-none ${
                  value === option.value
                    ? 'bg-gray-100 text-black'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                role="option"
                aria-selected={value === option.value}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{option.label}</span>
                  {value === option.value && (
                    <Icons.Check className="w-4 h-4 text-black" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// HERO SECTION — Main Component
// ============================================================================
const HeroSection = () => {
  const navigate = useNavigate();

  // ── State ──
  const [selectedLocation, setSelectedLocation] = useState({
    address: '',
    lat: null,
    lng: null,
  });
  const [selectedService, setSelectedService] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [toast, setToast] = useState(null);

  // ── Load Google Maps Script ──
  // CRITICAL: `GOOGLE_MAPS_LIBRARIES` is a static const defined OUTSIDE
  //           this component. Inlining `['places']` here causes an
  //           infinite re-render loop.
  const { isLoaded: isGoogleLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  // Log script load error (graceful — page keeps working)
  useEffect(() => {
    if (loadError) {
      console.error(
        '[Booky Center] Google Maps script failed to load:',
        loadError.message
      );
    }
  }, [loadError]);

  // ── Entrance animation timer ──
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // ── Toast handler ──
  const showToast = useCallback((message) => {
    setToast(message);
  }, []);

  // Auto-dismiss toast after 3 s
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // ── Handle place selection from autocomplete ──
  const handlePlaceSelect = useCallback(({ address, lat, lng }) => {
    setSelectedLocation({ address, lat, lng });
  }, []);

  // ── Search button handler (validation + redirect) ──
  const handleSearch = useCallback(() => {
    if (!selectedLocation.lat || !selectedLocation.lng) {
      showToast('عشان نجيبلك لحد عندك، اختار منطقتك الأول 📍');
      return;
    }
    if (!selectedService) {
      showToast('نسيت تختار الخدمة اللي محتاجها 😉');
      return;
    }

    const params = new URLSearchParams({
      lat: selectedLocation.lat.toFixed(6),
      lng: selectedLocation.lng.toFixed(6),
      category: selectedService,
    });

    navigate(`/search?${params.toString()}`);
  }, [selectedLocation, selectedService, showToast, navigate]);

  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <section className="relative bg-black pt-16 min-h-[100svh] lg:h-screen lg:max-h-screen">
      {/* ── Branded SVG Pattern + Vignette (WhatsApp-chat-style) ── */}
      {/*
          BrandedPattern renders two internal layers at z-0:
            1. Tiling SVG doodle icons (ticket, ball, controller, scissors, tooth)
            2. Radial vignette mask — clear center, dimmed edges
          Main content sits above at z-10.
      */}
      <BrandedPattern opacity={0.2} />

      {/* ── Main Container ── */}
      <div className="relative h-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col justify-center z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-6 py-6 lg:py-0 items-center">

          {/* ========== ILLUSTRATION ========== */}
          <div className="order-1 lg:order-2 w-full flex justify-center lg:justify-start">
            <HeroIllustration
              className="w-40 sm:w-48 lg:w-full lg:max-w-[280px]"
              isLoaded={isLoaded}
            />
          </div>

          {/* ========== CONTENT ========== */}
          <div className="order-2 lg:order-1 text-center lg:text-right">

            {/* Trust Badge */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full mb-3 lg:mb-4 transition-all duration-700 delay-200 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="text-xs sm:text-sm text-white/80 font-cairo">
                +15,000 بيزنس موثوق في مصر
              </span>
            </div>

            {/* Main Headline */}
            <h1
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight lg:leading-snug mb-2 lg:mb-3 font-cairo transition-all duration-700 delay-300 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              بضغطة واحدة..
              <br />
              <span className="text-white">ميعادك في جيبك</span>
            </h1>

            {/* Sub-headline */}
            <p
              className={`text-sm sm:text-base text-white/60 leading-relaxed mb-4 lg:mb-5 font-cairo max-w-md mx-auto lg:mx-0 lg:mr-0 transition-all duration-700 delay-400 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              أول منصة في مصر تحجزلك أي خدمة وأنت في مكانك..
              <span className="hidden sm:inline">
                {' '}
                من ملعب الكورة لحد دكتور الأسنان. وفر وقتك ومجهودك.
              </span>
            </p>

            {/* ========== SEARCH HUB — "Booking Ticket" ========== */}
            {/*
                Design: Physical reservation-ticket metaphor.
                - Rounded-3xl with heavy float shadow
                - Field labels above each input (luxury = space)
                - Dashed "tear-off" divider with ticket notch circles
                - Desktop: horizontal strip  |  Mobile: stacked card
            */}
            <div
              className={`relative z-50 bg-white rounded-3xl shadow-2xl shadow-black/50 overflow-visible transition-all duration-700 delay-500 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-stretch">

                {/* ═══════════ TICKET FIELD 1: Location ═══════════ */}
                <div className="flex-1 relative">
                  {/* Field Label */}
                  <p
                    className="text-[10px] sm:text-[11px] font-bold text-gray-400/80 uppercase tracking-wider font-cairo px-5 sm:px-6 pt-4 lg:pt-3.5"
                    dir="rtl"
                  >
                     المنطقة
                  </p>
                  {/*
                      Three states:
                      A) loadError       → MapsLoadError  (graceful failure)
                      B) !isGoogleLoaded → PlacesAutocompleteInput skeleton
                      C) isGoogleLoaded  → PlacesAutocompleteInput fully active
                  */}
                  {loadError ? (
                    <MapsLoadError />
                  ) : (
                    <PlacesAutocompleteInput
                      onSelect={handlePlaceSelect}
                      isScriptLoaded={isGoogleLoaded}
                    />
                  )}
                  {/* Bottom breathing room on mobile before divider */}
                  <div className="h-1 lg:hidden" />
                </div>

                {/* ═══════════ DASHED TEAR-OFF DIVIDER (Mobile) ═══════════ */}
                {/*
                    Classic ticket "perforation" line.
                    Two half-circle notches punched at the edges create the
                    illusion of a real tear-off stub. The notch bg matches
                    the section background (black hero) so they look like
                    holes through the ticket.
                */}
                <div className="relative lg:hidden" aria-hidden="true">
                  {/* Left notch */}
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-black rounded-full z-10" />
                  {/* Right notch */}
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-black rounded-full z-10" />
                  {/* Dashed perforation line — branded red */}
                  <div className="border-t-2 border-dashed border-red-500/40 mx-6" />
                </div>

                {/* ═══════════ DASHED DIVIDER (Desktop — vertical) ═══════════ */}
                <div className="hidden lg:flex items-stretch py-3.5" aria-hidden="true">
                  <div className="border-l-2 border-dashed border-red-500/40" />
                </div>

                {/* ═══════════ TICKET FIELD 2: Service Category ═══════════ */}
                <div className="flex-1 relative">
                  {/* Field Label */}
                  <p
                    className="text-[10px] sm:text-[11px] font-bold text-gray-400/80 uppercase tracking-wider font-cairo px-5 sm:px-6 pt-3 lg:pt-3.5"
                    dir="rtl"
                  >
                     الخدمة
                  </p>
                  <SectorDropdown
                    value={selectedService}
                    onChange={setSelectedService}
                  />
                </div>

                {/* ═══════════ SEARCH BUTTON (inside the ticket) ═══════════ */}
                <div className="px-3 pb-3 pt-1 lg:p-2 lg:pl-2">
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="
                      w-full lg:w-auto
                      h-12 lg:h-full
                      px-8
                      bg-black text-white
                      flex items-center justify-center gap-2
                      font-bold font-cairo
                      shadow-lg shadow-black/20
                      hover:shadow-xl hover:-translate-y-0.5
                      active:translate-y-0 active:shadow-lg active:scale-[0.98]
                      transition-all duration-200 ease-out
                      rounded-xl lg:rounded-2xl
                      border-none outline-none ring-0 focus:ring-0 focus:outline-none
                      relative overflow-hidden
                      group
                    "
                  >
                    {/* Subtle hover shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-l from-white/0 via-white/5 to-white/0 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-700" />
                    <Icons.Search className="w-5 h-5 text-white relative z-10" />
                    <span className="relative z-10">ابحث دلوقتي</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ========== STATS ========== */}
            <div
              className={`relative z-10 flex flex-row items-center justify-center lg:justify-end gap-4 sm:gap-6 mt-4 lg:mt-5 transition-all duration-700 delay-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ direction: 'rtl' }}
            >
              <div className="text-center">
                <p className="text-sm sm:text-lg font-black text-white font-cairo">+500K</p>
                <p className="text-[10px] text-gray-400 font-cairo">حجز</p>
              </div>
              <div className="w-px h-6 sm:h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-sm sm:text-lg font-black text-white font-cairo">4.8</p>
                <p className="text-[10px] text-gray-400 font-cairo">تقييم</p>
              </div>
              <div className="w-px h-6 sm:h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-sm sm:text-lg font-black text-white font-cairo">6</p>
                <p className="text-[10px] text-gray-400 font-cairo">خدمات</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Branded Toast Notification ── */}
      {toast && <BookyToast message={toast} onDismiss={() => setToast(null)} />}
    </section>
  );
};

export default HeroSection;
