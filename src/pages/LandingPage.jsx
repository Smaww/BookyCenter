import React, { useState, useEffect, useRef } from 'react';

/**
 * Booky Center - Uber-Minimalist Edition
 * 
 * Visual Identity:
 * - 100% Pure White backgrounds
 * - Bold Black Header/Footer
 * - Monochrome (Black & White ONLY)
 * 
 * Typography: Cairo (Professional Arabic)
 * Illustrations: Flat, Modern, Friendly
 */

// ============================================================================
// ICONS - Lucide-Style Professional B&W SVG
// ============================================================================
const Icons = {
  Search: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  MapPin: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Grid: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  ),
  Home: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Calendar: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  ),
  User: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  ),
  Store: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M3 9h18M9 21V9m6 12V9M4 9l1-4h14l1 4M5 9v11a1 1 0 001 1h12a1 1 0 001-1V9" />
    </svg>
  ),
  UserPlus: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="16" y1="11" x2="22" y2="11" />
    </svg>
  ),
  LogIn: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
    </svg>
  ),
  Check: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  ChevronDown: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  ArrowLeft: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  X: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  XCircle: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" />
    </svg>
  ),
  CheckCircle: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),

  // Service Icons (Lucide-Style)
  Trophy: ({ className = "w-7 h-7" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  Scissors: ({ className = "w-7 h-7" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" x2="8.12" y1="4" y2="15.88" />
      <line x1="14.47" x2="20" y1="14.48" y2="20" />
      <line x1="8.12" x2="12" y1="8.12" y2="12" />
    </svg>
  ),
  PartyPopper: ({ className = "w-7 h-7" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M5.8 11.3 2 22l10.7-3.79" />
      <path d="M4 3h.01M22 8h.01M15 2h.01M22 20h.01" />
      <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
      <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z" />
    </svg>
  ),
  Wrench: ({ className = "w-7 h-7" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  GraduationCap: ({ className = "w-7 h-7" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  Gift: ({ className = "w-7 h-7" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  ),

  // Dashboard & Value Icons
  LayoutDashboard: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  ),
  Zap: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),

  // Social Icons
  Facebook: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  Twitter: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Instagram: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  LinkedIn: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
};

// ============================================================================
// HERO ILLUSTRATION - Constrained for Zero-Scroll
// ============================================================================
const HeroIllustration = ({ className = "", isLoaded = false }) => (
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
// CUSTOM DROPDOWN COMPONENT - Uber Style (Fixed Z-Index & Styling)
// ============================================================================
const CustomDropdown = ({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  icon: Icon,
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const selectedOption = options.find(opt => opt === value);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-14 flex items-center justify-between gap-2 px-4 bg-transparent hover:bg-gray-50/80 transition-colors border-none outline-none focus:outline-none"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-black flex-shrink-0" />}
          <span className={`font-semibold font-cairo text-sm sm:text-base ${value ? 'text-black' : 'text-gray-400'}`}>
            {selectedOption || placeholder}
          </span>
        </div>
        <Icons.ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu - FIXED: High z-index, proper shadow */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl ring-1 ring-black/5 z-[100] overflow-hidden"
          style={{
            animation: 'dropdownFadeIn 0.2s ease-out forwards'
          }}
        >
          <div className="max-h-60 overflow-y-auto py-1">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full text-right px-4 py-3 font-cairo font-semibold transition-colors border-none outline-none ${
                  value === option 
                    ? 'bg-gray-100 text-black' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {value === option && (
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
// INTERSECTION OBSERVER HOOK
// ============================================================================
const useInView = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, [threshold]);

  return [ref, isInView];
};

// ============================================================================
// HEADER - Black Minimal
// ============================================================================
// ============================================================================
// AUTH SELECTION MODAL - "عايز تسجل كـ إيه؟"
// ============================================================================
const AuthSelectionModal = ({ isOpen, onClose, onSelectType }) => {
  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose();
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-slide-up z-10"
        dir="rtl"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <Icons.X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-black font-cairo mb-2">
            عايز تسجل كـ إيه؟
          </h2>
          <p className="text-sm text-gray-500 font-cairo">
            اختار نوع حسابك وابدأ في ثواني
          </p>
        </div>

        {/* Choice Cards */}
        <div className="space-y-4">
          
          {/* Option A: Customer */}
          <button 
            className="w-full group flex items-center gap-4 p-5 bg-white border-2 border-gray-200 rounded-2xl hover:border-black hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
            onClick={() => {
              onClose();
              onSelectType?.('client');
            }}
          >
            <div className="w-14 h-14 rounded-2xl bg-gray-100 group-hover:bg-black flex items-center justify-center flex-shrink-0 transition-colors">
              <Icons.User className="w-7 h-7 text-gray-600 group-hover:text-white transition-colors" />
            </div>
            <div className="text-right flex-1">
              <h3 className="text-lg font-black text-black font-cairo">عميل</h3>
              <p className="text-sm text-gray-500 font-cairo">عايز أحجز خدمات.</p>
            </div>
            <Icons.ArrowLeft className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
          </button>

          {/* Option B: Merchant */}
          <button 
            className="w-full group flex items-center gap-4 p-5 bg-white border-2 border-gray-200 rounded-2xl hover:border-black hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
            onClick={() => {
              onClose();
              onSelectType?.('merchant');
            }}
          >
            <div className="w-14 h-14 rounded-2xl bg-gray-100 group-hover:bg-black flex items-center justify-center flex-shrink-0 transition-colors">
              <Icons.Store className="w-7 h-7 text-gray-600 group-hover:text-white transition-colors" />
            </div>
            <div className="text-right flex-1">
              <h3 className="text-lg font-black text-black font-cairo">تاجر</h3>
              <p className="text-sm text-gray-500 font-cairo">عايز أدير شغلي.</p>
            </div>
            <Icons.ArrowLeft className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-400 font-cairo mt-6">
          عندك حساب بالفعل؟{' '}
          <button 
            onClick={() => {
              onClose();
              onSelectType?.('client');
            }} 
            className="text-black font-bold hover:underline"
          >
            سجل دخول
          </button>
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// HEADER - Sticky Navbar with Auth Buttons
// ============================================================================
const Header = ({ onOpenAuthModal, onLogin }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm' 
        : 'bg-black'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Right: Brand Logo */}
          <div className="flex items-center gap-2">
            <img 
              src="/booky_logo.png" 
              alt="Booky Center" 
              className="w-10 h-10 object-contain"
            />
            <span className={`text-lg font-black tracking-tight font-cairo transition-colors ${
              isScrolled ? 'text-black' : 'text-white'
            }`}>
              Booky Center
            </span>
          </div>
          
          {/* Left: Auth Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Login Button (Ghost / Text) — Simulates instant login as client */}
            <button 
              onClick={onLogin}
              className={`
              flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-lg
              transition-all duration-200 font-cairo
              ${isScrolled 
                ? 'text-black hover:bg-gray-100' 
                : 'text-white hover:bg-white/10'
              }
            `}>
              <Icons.LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">دخول</span>
            </button>

            {/* Register Button (Primary - Solid Black) */}
            <button 
              onClick={onOpenAuthModal}
              className={`
                flex items-center gap-1.5 px-5 py-2 text-sm font-bold rounded-full
                transition-all duration-200 font-cairo active:scale-[0.97]
                ${isScrolled 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-white text-black hover:bg-gray-100'
                }
              `}
            >
              <span>حساب جديد</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// HERO SECTION - Zero-Scroll Desktop (100vh) + Custom Dropdowns
// ============================================================================
const HeroSection = () => {
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const areas = ['المنصورة', 'القاهرة', 'الإسكندرية', 'الجيزة', 'المعادي', 'مدينة نصر'];
  const services = ['ملاعب وصالات', 'جمال وصحة', 'خروجات وعيلة', 'خدمات بيت', 'تعليم وشغل', 'مناسبات'];

  return (
    <section className="relative bg-black pt-16 min-h-[100svh] lg:h-screen lg:max-h-screen">
      {/* Abstract Pattern Background - z-0 */}
      <div className="absolute inset-0 opacity-5 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                           radial-gradient(circle at 80% 30%, white 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Main Container - Flex to Fill Height & Center Content */}
      <div className="relative h-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col justify-center z-10">
        
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-6 py-6 lg:py-0 items-center">
          
          {/* ========== ILLUSTRATION (Constrained Height for Zero-Scroll) ========== */}
          <div className="order-1 lg:order-2 w-full flex justify-center lg:justify-start">
            <HeroIllustration 
              className="w-40 sm:w-48 lg:w-full lg:max-w-[280px]" 
              isLoaded={isLoaded}
            />
          </div>

          {/* ========== CONTENT ========== */}
          <div className="order-2 lg:order-1 text-center lg:text-right">
            
            {/* Trust Badge - Compact */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full mb-3 lg:mb-4 transition-all duration-700 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <span className="text-xs sm:text-sm text-white/80 font-cairo">+15,000 بيزنس موثوق في مصر</span>
            </div>

            {/* Main Headline - Compact for Zero-Scroll */}
            <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight lg:leading-snug mb-2 lg:mb-3 font-cairo transition-all duration-700 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              بضغطة واحدة..
              <br />
              <span className="text-white">ميعادك في جيبك</span>
            </h1>
            
            {/* Sub-headline - Compact */}
            <p className={`text-sm sm:text-base text-white/60 leading-relaxed mb-4 lg:mb-5 font-cairo max-w-md mx-auto lg:mx-0 lg:mr-0 transition-all duration-700 delay-400 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              أول منصة في مصر تحجزلك أي خدمة وأنت في مكانك..
              <span className="hidden sm:inline"> من ملعب الكورة لحد دكتور الأسنان. وفر وقتك ومجهودك.</span>
            </p>

            {/* ========== SEARCH HUB - FIXED Z-INDEX FOR DROPDOWNS ========== */}
            <div className={`relative z-50 bg-white rounded-2xl shadow-2xl shadow-black/50 transition-all duration-700 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {/* Desktop: Seamless horizontal bar | Mobile: Stacked */}
              <div className="flex flex-col lg:flex-row lg:items-stretch">
                
                {/* Area Dropdown - Custom Component */}
                <div className="relative flex-1 border-b lg:border-b-0 lg:border-l border-gray-100">
                  <CustomDropdown
                    value={selectedArea}
                    onChange={setSelectedArea}
                    options={areas}
                    placeholder="اختر المنطقة"
                    icon={Icons.MapPin}
                  />
                </div>

                {/* Service Dropdown - Custom Component */}
                <div className="relative flex-1 border-b lg:border-b-0">
                  <CustomDropdown
                    value={selectedService}
                    onChange={setSelectedService}
                    options={services}
                    placeholder="نوع الخدمة"
                    icon={Icons.Grid}
                  />
                </div>

                {/* Search Button - FIXED: No borders, seamless connection */}
                <button className="h-14 px-8 bg-black flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-[0.98] transition-all rounded-b-2xl lg:rounded-b-none lg:rounded-l-2xl border-none outline-none ring-0 focus:ring-0 focus:outline-none">
                  <Icons.Search className="w-5 h-5 text-white" />
                  <span className="text-white font-bold font-cairo">ابحث دلوقتي</span>
                </button>
              </div>
            </div>

            {/* ========== STATS - LOWER Z-INDEX ========== */}
            <div className={`relative z-10 flex flex-row items-center justify-center lg:justify-end gap-4 sm:gap-6 mt-4 lg:mt-5 transition-all duration-700 delay-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`} style={{ direction: 'rtl' }}>
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
    </section>
  );
};

// ============================================================================
// DECISION SECTION - Merchant vs. Client (Compact, No-Scroll Design)
// ============================================================================
const DecisionSection = () => {
  const [ref, isInView] = useInView(0.15);

  return (
    <section ref={ref} className="py-10 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header - Compact */}
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-black text-black mb-2 font-cairo">
            أنت مين؟ اختار وابدأ
          </h2>
          <p className="text-gray-500 font-cairo text-sm sm:text-base">كل واحد عنده رحلته</p>
        </div>

        {/* Two-Column Grid */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-10">
          
          {/* ========== CARD 1: MERCHANT (صاحب بيزنس) ========== */}
          <div 
            className={`group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-100 hover:border-black hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Mobile: Side-by-side (60/40) | Desktop: Stacked */}
            <div className="flex flex-row lg:flex-col gap-4 lg:gap-6">
              
              {/* Text Content - 60% on mobile */}
              <div className="flex-1 order-1">
                {/* Badge */}
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full mb-3 font-cairo">
                  لأصحاب البيزنس
                </span>
                
                {/* Headline */}
                <h3 className="text-lg sm:text-xl lg:text-3xl font-black text-black mb-2 lg:mb-3 font-cairo leading-tight">
                  صاحب بيزنس؟
                </h3>
                
                {/* Subtext - Hidden on very small screens for compactness */}
                <p className="hidden sm:block text-gray-500 text-sm lg:text-base mb-4 lg:mb-6 font-cairo leading-relaxed">
                  بطل تستخدم الورقة والقلم. امتلك سيستم كامل يدير حجوزاتك، يمنع التضارب، ويزود أرباحك الضعف.
                </p>
                
                {/* CTA Button */}
                <button className="w-full sm:w-auto px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center sm:justify-start gap-2 font-cairo text-sm sm:text-base">
                  <span>سجل نشاطك مجاناً</span>
                  <Icons.ArrowLeft className="w-4 h-4" />
                </button>
              </div>
              
              {/* Image - 40% on mobile, full width on desktop */}
              <div className="w-[35%] sm:w-[40%] lg:w-full order-2 flex-shrink-0">
                <div className="relative aspect-square lg:aspect-[4/3] rounded-xl lg:rounded-2xl overflow-hidden bg-gray-50">
                  <img 
                    src="/merchant.png" 
                    alt="صاحب بيزنس يستخدم لوحة التحكم"
                    className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========== CARD 2: CLIENT (عميل بيدور على راحة) ========== */}
          <div 
            className={`group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-100 hover:border-black hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            {/* Mobile: Side-by-side (60/40) | Desktop: Stacked */}
            <div className="flex flex-row lg:flex-col gap-4 lg:gap-6">
              
              {/* Text Content - 60% on mobile */}
              <div className="flex-1 order-1">
                {/* Badge */}
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full mb-3 font-cairo">
                  للعملاء
                </span>
                
                {/* Headline */}
                <h3 className="text-lg sm:text-xl lg:text-3xl font-black text-black mb-2 lg:mb-3 font-cairo leading-tight">
                  عميل بتدور على راحة؟
                </h3>
                
                {/* Subtext - Hidden on very small screens for compactness */}
                <p className="hidden sm:block text-gray-500 text-sm lg:text-base mb-4 lg:mb-6 font-cairo leading-relaxed">
                  ليه تتصل وتلاقي الموبايل مشغول؟ احجز ميعادك أونلاين في ثواني واضمن مكانك من غير انتظار.
                </p>
                
                {/* CTA Button - Outline Style */}
                <button className="w-full sm:w-auto px-6 py-3 bg-white text-black font-bold rounded-xl border-2 border-black hover:bg-black hover:text-white transition-all flex items-center justify-center sm:justify-start gap-2 font-cairo text-sm sm:text-base">
                  <span>استكشف الخدمات</span>
                  <Icons.ArrowLeft className="w-4 h-4" />
                </button>
              </div>
              
              {/* Image - 40% on mobile, full width on desktop */}
              <div className="w-[35%] sm:w-[40%] lg:w-full order-2 flex-shrink-0">
                <div className="relative aspect-square lg:aspect-[4/3] rounded-xl lg:rounded-2xl overflow-hidden bg-gray-50">
                  <img 
                    src="/client.png" 
                    alt="عميل يحجز من خلال التطبيق"
                    className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

// Alias for backward compatibility
const ValueCards = DecisionSection;

// ============================================================================
// SERVICES DATA - Egyptian Market Context (6 Sectors + Sub-Services)
// ============================================================================
const SERVICES_DATA = [
  {
    id: 'sports',
    name: 'ملاعب ورياضة',
    shortName: 'ملاعب ورياضة',
    icon: Icons.Trophy,
    subServices: ['ملاعب ', 'باديل', 'جيم', 'سباحة', 'يوجا', 'فروسية'],
  },
  {
    id: 'beauty',
    name: 'صحة وجمال',
    shortName: 'صحة وجمال',
    icon: Icons.Scissors,
    subServices: ['حلاق رجالي', 'بيوتي سنتر', 'عيادات', 'سبا', 'جلدية', 'تغذية'],
  },
  {
    id: 'outings',
    name: 'خروجات وترفيه',
    shortName: 'خروجات وترفيه',
    icon: Icons.PartyPopper,
    subServices: ['كيدز أريا', 'بلايستيشن', 'إيسكيب روم', 'سينما', 'في آر', 'ملاهي'],
  },
  {
    id: 'home',
    name: 'خدمات منزلية',
    shortName: 'خدمات منزلية',
    icon: Icons.Wrench,
    subServices: ['سباكة', 'كهرباء', 'تكييف', 'تنظيف', 'مكافحة حشرات', 'نقل عفش'],
  },
  {
    id: 'education',
    name: 'تعليم ومساحات عمل',
    shortName: 'تعليم وعمل',
    icon: Icons.GraduationCap,
    subServices: ['مساحات عمل', 'قاعات اجتماعات', 'كورسات', 'طباعة', 'ستوديو تصوير', 'ترجمة'],
  },
  {
    id: 'events',
    name: 'مناسبات وأفراح',
    shortName: 'مناسبات وأفراح',
    icon: Icons.Gift,
    subServices: ['قاعات أفراح', 'فوتوجرافر', 'ميكب آرتيست', 'سيارات زفاف', 'تنظيم حفلات', 'كاترينج'],
  },
];

// ============================================================================
// MOBILE BOTTOM SHEET - Native Drawer Component
// ============================================================================
const ServiceBottomSheet = ({ service, isOpen, onClose }) => {
  const sheetRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        style={{ animation: 'fadeIn 0.2s ease-out forwards' }}
      />
      
      {/* Bottom Sheet */}
      <div 
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[70vh] overflow-hidden"
        style={{ animation: 'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards' }}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <service.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-black text-black font-cairo">{service.name}</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Icons.X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Sub-Services Grid */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <p className="text-sm text-gray-500 mb-4 font-cairo">اختر الخدمة اللي محتاجها</p>
          <div className="grid grid-cols-2 gap-3">
            {service.subServices.map((sub, index) => (
              <button
                key={sub}
                className="p-4 bg-gray-50 hover:bg-black hover:text-white rounded-xl text-right font-cairo font-semibold transition-all duration-200 border border-transparent hover:border-black"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SERVICE GALAXY - Interactive Grid with Desktop Hover & Mobile Bottom Sheet
// ============================================================================
const ServiceGalaxy = () => {
  const [ref, isInView] = useInView(0.15);
  const [hoveredService, setHoveredService] = useState(null);
  const [mobileSheet, setMobileSheet] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCardClick = (service) => {
    if (isMobile) {
      setMobileSheet(service);
    }
  };

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-10 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-black mb-2 sm:mb-4 font-cairo">
            كل خدمات يومك في مكان واحد
          </h2>
          <p className="text-gray-500 font-cairo text-sm sm:text-base lg:text-lg">اختر القطاع واكتشف الخدمات المتاحة</p>
        </div>

        {/* Responsive Grid: 2x3 Mobile | 3x2 Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {SERVICES_DATA.map((service, index) => (
            <div
              key={service.id}
              onClick={() => handleCardClick(service)}
              onMouseEnter={() => !isMobile && setHoveredService(service.id)}
              onMouseLeave={() => !isMobile && setHoveredService(null)}
              className={`group relative bg-white rounded-2xl lg:rounded-3xl border transition-all duration-500 cursor-pointer overflow-hidden ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } ${
                hoveredService === service.id 
                  ? 'border-black shadow-2xl scale-[1.02] z-10' 
                  : 'border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200'
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* ========== DEFAULT STATE ========== */}
              <div className={`p-5 sm:p-6 lg:p-8 text-center transition-all duration-300 ${
                hoveredService === service.id ? 'lg:opacity-0 lg:scale-95' : 'opacity-100 scale-100'
              }`}>
                {/* Icon */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gray-100 group-hover:bg-black rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4 transition-all duration-300">
                  <service.icon className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-black group-hover:text-white transition-colors" />
                </div>
                
                {/* Title */}
                <h3 className="text-sm sm:text-base lg:text-xl font-black text-black font-cairo mb-1">
                  {service.shortName}
                </h3>
                
                {/* Sub-count Badge */}
                <span className="text-xs text-gray-400 font-cairo">
                  {service.subServices.length} خدمات
                </span>
                
                {/* Mobile Tap Hint */}
                <div className="lg:hidden mt-3 text-xs text-gray-400 font-cairo flex items-center justify-center gap-1">
                  <span>اضغط للتفاصيل</span>
                </div>
              </div>

              {/* ========== DESKTOP HOVER STATE - Grid Reveal (No Scroll) ========== */}
              <div className={`hidden lg:flex lg:flex-col absolute inset-0 p-5 bg-white transition-all duration-300 ${
                hoveredService === service.id 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105 pointer-events-none'
              }`}>
                {/* Compact Header - Icon + Title at Top */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-black text-black font-cairo leading-tight">{service.shortName}</h3>
                </div>
                
                {/* Sub-Services Grid - Chips (NO overflow/scroll) */}
                <div className="grid grid-cols-2 gap-1.5 flex-1">
                  {service.subServices.map((sub) => (
                    <button
                      key={sub}
                      className="px-2 py-1.5 bg-gray-100 hover:bg-black hover:text-white rounded-full font-cairo text-xs font-semibold text-black transition-all duration-200 truncate"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Highlight Bar */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-black transition-all duration-300 ${
                hoveredService === service.id ? 'opacity-100' : 'opacity-0'
              }`} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      <ServiceBottomSheet 
        service={mobileSheet} 
        isOpen={!!mobileSheet} 
        onClose={() => setMobileSheet(null)} 
      />
    </section>
  );
};

// ============================================================================
// TRANSFORMATION SECTION - Before & After (Problem vs. Solution)
// ============================================================================
const TransformationSection = () => {
  const [ref, isInView] = useInView(0.1);

  // The 4 Key Pains vs. Booky Solutions (Condensed for impact)
  const problems = [
    'بحث و مكالمات كتير ومحدش بيرد.',
    'بتروح المشوار وتستنى بالساعات.',
    'أسعار مش واضحة ومفاجآت.',
    'حجزك ضاع في الزحمة.',
  ];

  const solutions = [
    'حجز مؤكد 100% برسالة على موبايلك.',
    'روح على ميعادك بالدقيقة.',
    'تعرف الأسعار والتقييمات قبل ما تحجز.',
    'ادفع كاش أو أونلاين وأنت مطمن.',
  ];

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-10 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-black mb-2 sm:mb-4 font-cairo">
            ليه تتعب نفسك.. والحل موجود؟
          </h2>
          <p className="text-gray-500 font-cairo text-sm sm:text-base lg:text-lg">شوف الفرق بنفسك</p>
        </div>

        {/* Split Comparison Grid */}
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-0">
          
          {/* ========== COLUMN 1: BEFORE BOOKY (The Chaos) ========== */}
          <div 
            className={`bg-gray-50 rounded-2xl lg:rounded-l-3xl lg:rounded-r-none p-6 sm:p-8 lg:p-10 transition-all duration-700 ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            {/* Header with Image */}
            <div className="text-center mb-6 lg:mb-8">
              <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 rounded-2xl overflow-hidden bg-white p-2">
                <img 
                  src="/problem.png" 
                  alt="المعاناة اليومية" 
                  className="w-full h-full object-contain grayscale"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-600 font-cairo">
                حياتك قبل بوكي
              </h3>
              <p className="text-sm text-gray-400 font-cairo">صداع</p>
            </div>
            
            {/* Problems List */}
            <div className="space-y-3">
              {problems.map((problem, index) => (
                <div 
                  key={index}
                  className={`flex items-start gap-3 p-3 bg-white/60 rounded-xl transition-all duration-500 ${
                    isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="w-6 h-6 flex-shrink-0 mt-0.5">
                    <Icons.XCircle className="w-6 h-6 text-gray-400" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-500 font-cairo leading-relaxed">{problem}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ========== COLUMN 2: AFTER BOOKY (The Solution) ========== */}
          <div 
            className={`relative bg-white rounded-2xl lg:rounded-r-3xl lg:rounded-l-none p-6 sm:p-8 lg:p-10 shadow-2xl z-10 transition-all duration-700 delay-100 ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            {/* Header with Image */}
            <div className="text-center mb-6 lg:mb-8">
              <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 rounded-2xl overflow-hidden bg-gray-50 p-2">
                <img 
                  src="/solution.png" 
                  alt="الحل الجذري" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-black font-cairo">
                حياتك مع بوكي
              </h3>
              <p className="text-sm text-gray-500 font-cairo">راحة</p>
            </div>
            
            {/* Solutions List */}
            <div className="space-y-3">
              {solutions.map((solution, index) => (
                <div 
                  key={index}
                  className={`flex items-start gap-3 p-3 bg-gray-50 hover:bg-black hover:text-white rounded-xl transition-all duration-300 group ${
                    isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
                  style={{ transitionDelay: `${(index * 50) + 200}ms` }}
                >
                  <div className="w-6 h-6 flex-shrink-0 mt-0.5">
                    <Icons.CheckCircle className="w-6 h-6 text-black group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-sm sm:text-base text-black group-hover:text-white font-cairo font-medium leading-relaxed transition-colors">{solution}</span>
                </div>
              ))}
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-black text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold font-cairo shadow-lg">
              ✓ الحل
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// PRICING SECTION - ROBUST CSS GRID ARCHITECTURE (Fail-Safe)
// ============================================================================
const PricingSection = () => {
  const [ref, isInView] = useInView(0.15);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef(null);

  const tiers = [
    {
      id: 0,
      name: 'البداية',
      price: '0',
      period: 'مجاناً',
      description: 'للمشاريع الصغيرة اللي لسه بتبدأ.',
      features: ['حجز فوري', 'تذكيرات ذكية', 'نقاط بوكي', 'دعم فني'],
      popular: false,
      cta: 'ابدأ مجاناً',
    },
    {
      id: 1,
      name: 'المحترف',
      price: '120',
      period: 'جنيه/شهر',
      description: 'للي عايز يكبر ويسيطر على السوق.',
      features: ['كل مميزات البداية', '2x نقاط مضاعفة', 'أولوية حجز', 'إلغاء مرن', 'خصومات حصرية'],
      popular: true,
      cta: 'اشترك الآن',
    },
    {
      id: 2,
      name: 'الباشا',
      price: '450',
      period: 'جنيه/شهر',
      description: 'تحكم كامل وذكاء اصطناعي يشتغل بدالك.',
      features: ['كل مميزات المحترف', '5x نقاط مضاعفة', 'مساعد ذكي', 'خصم 20%', 'دعم VIP'],
      popular: false,
      cta: 'اشترك الآن',
    },
  ];

  // Handle scroll for mobile dot indicators
  const handleScroll = (e) => {
    const container = e.target;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.firstChild?.offsetWidth || 300;
    const gap = 16;
    const newActive = Math.round(scrollLeft / (cardWidth + gap));
    setActiveSlide(Math.min(Math.max(newActive, 0), 2));
  };

  // Scroll to specific card when dot is clicked
  const scrollToCard = (index) => {
    if (scrollRef.current && scrollRef.current.children[index]) {
      scrollRef.current.children[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-10 lg:mb-16 px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-black mb-2 sm:mb-4 font-cairo">
            اختار الباقة اللي تناسب طموحك
          </h2>
          <p className="text-gray-500 font-cairo text-sm sm:text-base lg:text-lg">ابدأ مجاناً وطور في أي وقت</p>
        </div>

        {/* ========== MAIN CONTAINER ========== */}
        {/* Mobile: Horizontal Snap Scroll | Desktop: 3-Column Grid */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="
            flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-8 scrollbar-hide
            lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:px-6 lg:pb-0
          "
        >
          {tiers.map((tier, index) => (
            <div
              key={tier.id}
              className={`
                /* ===== MOBILE: Fixed width, no shrink, snap center ===== */
                w-[90vw] max-w-sm flex-shrink-0 snap-center
                /* ===== DESKTOP: Full width in grid cell ===== */
                lg:w-full lg:max-w-none
                /* ===== CARD STRUCTURE: CSS Grid for perfect alignment ===== */
                h-auto lg:h-full
                bg-white rounded-2xl shadow-sm overflow-hidden
                grid grid-rows-[auto_1fr_auto]
                transition-all duration-500
                ${tier.popular 
                  ? 'border-2 border-black shadow-xl' 
                  : 'border border-gray-200 hover:border-gray-300 hover:shadow-md'
                }
                ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* ========== ROW 1: HEADER (auto height) ========== */}
              <div className="p-6 pb-4 text-center">
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="bg-black text-white text-xs font-bold py-1.5 px-4 rounded-full inline-block mb-4 font-cairo">
                    الأكثر طلباً
                  </div>
                )}
                
                {/* Plan Name */}
                <h3 className="text-xl font-black text-black font-cairo mb-3">
                  {tier.name}
                </h3>
                
                {/* Price */}
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-black text-black font-cairo">
                    {tier.price}
                  </span>
                  {tier.price !== '0' && (
                    <span className="text-base text-gray-500 font-cairo">ج.م</span>
                  )}
                </div>
                
                {/* Period */}
                <p className="text-sm text-gray-500 font-cairo mt-1">{tier.period}</p>
                
                {/* Description */}
                <p className="text-xs text-gray-400 font-cairo mt-3 leading-relaxed">
                  {tier.description}
                </p>
              </div>

              {/* ========== ROW 2: FEATURES (1fr - takes remaining space) ========== */}
              <div className="px-6 py-2">
                <ul className="space-y-3">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className={`
                        w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                        ${tier.popular ? 'bg-black' : 'bg-gray-200'}
                      `}>
                        <Icons.Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700 font-cairo text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ========== ROW 3: CTA BUTTON (auto height - always at bottom) ========== */}
              <div className="p-6 pt-4">
                <button className={`
                  w-full py-3 rounded-xl font-bold font-cairo text-base
                  transition-all duration-200 active:scale-[0.98]
                  ${tier.popular
                    ? 'bg-black text-white hover:bg-gray-900'
                    : 'bg-white text-black border-2 border-black hover:bg-black hover:text-white'
                  }
                `}>
                  {tier.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Dot Indicators (Clickable Navigation) */}
        <div className="lg:hidden flex justify-center gap-3 mt-2">
          {tiers.map((tier, index) => (
            <button
              key={tier.id}
              onClick={() => scrollToCard(index)}
              className={`
                h-2 rounded-full transition-all duration-300 
                ${activeSlide === index 
                  ? 'bg-black w-8' 
                  : 'bg-gray-300 w-2 hover:bg-gray-400'
                }
              `}
              aria-label={`Go to ${tier.name}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// FOOTER - Professional Black
// ============================================================================
const Footer = () => {
  return (
    <footer className="bg-black py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-12 items-center">
          {/* Official Logo */}
          <div className="flex items-center justify-center md:justify-start gap-3">
            <img 
              src="/booky_logo.png" 
              alt="Booky Center" 
              className="w-12 h-12 object-contain"
            />
            <span className="text-xl font-black text-white font-cairo">Booky Center</span>
          </div>

          {/* Links */}
          <div className="flex justify-center gap-8">
            <a href="#" className="text-sm text-gray-400 hover:text-white font-cairo transition-colors">من نحن</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white font-cairo transition-colors">الشروط</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white font-cairo transition-colors">الخصوصية</a>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-end gap-4">
            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <Icons.Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <Icons.Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <Icons.Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <Icons.LinkedIn className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 font-cairo">
            © 2026 Booky Center. جميع الحقوق محفوظة.
          </p>
          <p className="text-sm text-gray-500 font-cairo">
            بوكي سنتر
            <br/>
            ميعادك في جيبك بضغطة واحدة
            <br/>
            رقم التسجيل الضريبي 998-345-455
          </p>
        </div>
      </div>
    </footer>
  );
};

// ============================================================================
// MOBILE BOTTOM NAVIGATION
// ============================================================================
// ============================================================================
// MAIN LANDING PAGE
// ============================================================================
const LandingPage = ({ onSelectType }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-cairo" dir="rtl">
      <Header 
        onOpenAuthModal={() => setIsAuthModalOpen(true)} 
        onLogin={() => onSelectType?.('client')}
      />
      <HeroSection />
      <DecisionSection />
      <ServiceGalaxy />
      <TransformationSection />
      <PricingSection />
      <Footer />

      {/* Auth Selection Modal */}
      <AuthSelectionModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSelectType={onSelectType}
      />
    </div>
  );
};

export default LandingPage;
