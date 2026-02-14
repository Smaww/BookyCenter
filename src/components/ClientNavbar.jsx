import React, { useState, useEffect, useRef } from 'react';

/**
 * ============================================================================
 * CLIENT NAVBAR — Post-Login Navigation (Uber-Minimalist B&W)
 * ============================================================================
 *
 * Two parts:
 *  1. TopNavbar  — Sticky header (Logo, Search, Avatar, Bell)
 *  2. BottomNav  — Mobile-only fixed footer (Home, Search, Bookings, Profile)
 *
 * Strict B&W palette. Cairo font. RTL-aware.
 * ============================================================================
 */

// ============================================================================
// ICONS — Lucide-Style B&W SVG (Dashboard Context)
// ============================================================================
const Icons = {
  Search: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  Bell: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  ),
  Home: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  HomeFilled: ({ className = 'w-6 h-6' }) => (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="currentColor" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path fill="white" d="M9 22V12h6v10" />
    </svg>
  ),
  Compass: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  CompassFilled: ({ className = 'w-6 h-6' }) => (
    <svg className={className} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="white" />
    </svg>
  ),
  Calendar: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  ),
  CalendarFilled: ({ className = 'w-6 h-6' }) => (
    <svg className={className} viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="4" rx="2" fill="currentColor" />
      <line x1="16" x2="16" y1="2" y2="6" stroke="currentColor" strokeWidth="2" />
      <line x1="8" x2="8" y1="2" y2="6" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="10" width="18" height="12" rx="0" fill="currentColor" />
      <line x1="3" x2="21" y1="10" y2="10" stroke="white" strokeWidth="2" />
    </svg>
  ),
  User: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  ),
  UserFilled: ({ className = 'w-6 h-6' }) => (
    <svg className={className} viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="5" fill="currentColor" />
      <path d="M20 21a8 8 0 0 0-16 0" fill="currentColor" />
    </svg>
  ),
};

// ============================================================================
// TOP NAVBAR — Sticky Header
// ============================================================================
const TopNavbar = ({ user, notificationCount = 0, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showUserMenu]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-white'
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">

          {/* ── RIGHT: Logo ── */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/booky_logo.png"
              alt="Booky Center"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
            />
            <span className="text-base sm:text-lg font-black text-black tracking-tight font-cairo hidden sm:inline">
              Booky
            </span>
          </div>

          {/* ── CENTER: Search Bar (Desktop / Tablet) ── */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <div
              className={`
                relative w-full flex items-center
                bg-gray-100 rounded-full transition-all duration-200
                ${searchFocused ? 'bg-white ring-2 ring-black shadow-lg' : 'hover:bg-gray-200/70'}
              `}
            >
              <Icons.Search className="w-5 h-5 text-gray-400 absolute right-4 pointer-events-none" />
              <input
                type="text"
                placeholder="بتدور على إيه؟"
                dir="rtl"
                className="w-full bg-transparent py-2.5 pr-11 pl-4 text-sm font-cairo text-black placeholder:text-gray-400 focus:outline-none"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>

          {/* ── LEFT: Actions (Bell + Avatar) ── */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

            {/* Notification Bell */}
            <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <Icons.Bell className="w-[22px] h-[22px] text-black" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1.5 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {/* User Avatar + Dropdown */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-gray-200 hover:ring-black transition-all flex-shrink-0"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <span className="text-white text-sm font-bold font-cairo">
                      {user?.fullName?.charAt(0) || 'ب'}
                    </span>
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute left-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl ring-1 ring-black/5 z-[100] animate-dropdown overflow-hidden" dir="rtl">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-black font-cairo truncate">{user?.fullName || 'مستخدم'}</p>
                    <p className="text-xs text-gray-400 font-cairo mt-0.5">{user?.phone || ''}</p>
                  </div>
                  {/* Menu Items */}
                  <div className="py-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-cairo text-gray-700 hover:bg-gray-50 transition-colors">
                      <Icons.User className="w-4 h-4 text-gray-400" />
                      <span>الملف الشخصي</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-cairo text-gray-700 hover:bg-gray-50 transition-colors">
                      <Icons.Calendar className="w-4 h-4 text-gray-400" />
                      <span>حجوزاتي</span>
                    </button>
                  </div>
                  {/* Logout */}
                  <div className="border-t border-gray-100 py-1">
                    <button 
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout?.();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-cairo text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                      </svg>
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Search Bar (below header) ── */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative flex items-center bg-gray-100 rounded-full hover:bg-gray-200/70 transition-colors">
          <Icons.Search className="w-5 h-5 text-gray-400 absolute right-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="بتدور على إيه؟"
            dir="rtl"
            className="w-full bg-transparent py-2.5 pr-10 pl-4 text-sm font-cairo text-black placeholder:text-gray-400 focus:outline-none"
          />
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// BOTTOM NAVIGATION BAR — Mobile Only (4 Tabs)
// ============================================================================
const BottomNav = ({ activeTab = 'home', onTabChange }) => {
  const tabs = [
    {
      id: 'home',
      label: 'الرئيسية',
      icon: Icons.Home,
      iconActive: Icons.HomeFilled,
    },
    {
      id: 'discover',
      label: 'اكتشف',
      icon: Icons.Compass,
      iconActive: Icons.CompassFilled,
    },
    {
      id: 'bookings',
      label: 'حجوزاتي',
      icon: Icons.Calendar,
      iconActive: Icons.CalendarFilled,
    },
    {
      id: 'profile',
      label: 'حسابي',
      icon: Icons.User,
      iconActive: Icons.UserFilled,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden safe-area-bottom">
      {/* Top shadow edge */}
      <div className="absolute inset-x-0 -top-3 h-3 bg-gradient-to-t from-black/[0.04] to-transparent pointer-events-none" />

      <div className="bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around h-16 max-w-md mx-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = isActive ? tab.iconActive : tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`
                  relative flex flex-col items-center justify-center flex-1 h-full
                  transition-colors duration-150
                  ${isActive ? 'text-black' : 'text-gray-400'}
                `}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute top-1 w-1 h-1 bg-black rounded-full" />
                )}
                <Icon className="w-[22px] h-[22px]" />
                <span className={`text-[10px] mt-1 font-cairo ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================
export { TopNavbar, BottomNav };

