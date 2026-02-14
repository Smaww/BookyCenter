import React from 'react';

/**
 * ============================================================================
 * MERCHANT LAYOUT — Placeholder Dashboard (Coming Soon)
 * ============================================================================
 *
 * Temporary layout to test the auth flow routing.
 * Will be replaced with the full Merchant Dashboard later.
 * ============================================================================
 */

// ============================================================================
// ICONS
// ============================================================================
const Icons = {
  Store: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M3 9h18M9 21V9m6 12V9M4 9l1-4h14l1 4M5 9v11a1 1 0 001 1h12a1 1 0 001-1V9" />
    </svg>
  ),
  BarChart: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
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
  Users: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  LogOut: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  ),
};

// ============================================================================
// PLACEHOLDER STAT CARD
// ============================================================================
const StatCard = ({ icon: Icon, label, value, sub }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
      <Icon className="w-6 h-6 text-gray-500" />
    </div>
    <div>
      <p className="text-2xl font-black text-black font-cairo">{value}</p>
      <p className="text-xs text-gray-400 font-cairo">{label}</p>
      {sub && <p className="text-[10px] text-gray-300 font-cairo mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ============================================================================
// MERCHANT LAYOUT
// ============================================================================
const MerchantLayout = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-cairo" dir="rtl">

      {/* ── STICKY HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img
                src="/booky_logo.png"
                alt="Booky Center"
                className="w-8 h-8 object-contain"
              />
              <span className="text-base font-black text-black tracking-tight font-cairo">
                Booky
              </span>
              <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-cairo">
                تاجر
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-cairo"
            >
              <Icons.LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-screen-xl mx-auto">

          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-2xl font-black text-black font-cairo">
              أهلاً بيك في لوحة التحكم 👋
            </h1>
            <p className="text-sm text-gray-400 font-cairo mt-1">
              إدارة نشاطك وحجوزاتك من مكان واحد
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <StatCard icon={Icons.Calendar} label="حجوزات اليوم" value="12" sub="3 جديدة" />
            <StatCard icon={Icons.Users} label="العملاء" value="348" sub="+24 هذا الشهر" />
            <StatCard icon={Icons.BarChart} label="الإيرادات" value="8,450" sub="ج.م هذا الشهر" />
            <StatCard icon={Icons.Store} label="الخدمات" value="6" sub="نشطة" />
          </div>

          {/* Coming Soon Section */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icons.Store className="w-10 h-10 text-gray-400" />
            </div>

            <h2 className="text-xl font-black text-black font-cairo mb-3">
              لوحة تحكم التاجر
            </h2>
            <p className="text-sm text-gray-400 font-cairo max-w-md mx-auto leading-relaxed mb-8">
              هنا هتقدر تدير حجوزاتك، تتابع عملاءك، تعدل خدماتك وأسعارك، 
              وتشوف تقارير أرباحك — كله من مكان واحد.
            </p>

            {/* Feature Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-8">
              {[
                'إدارة الحجوزات',
                'تقويم ذكي',
                'إحصائيات متقدمة',
                'إدارة العملاء',
                'الإشعارات',
                'الدعم الفني',
              ].map((feature) => (
                <div
                  key={feature}
                  className="bg-gray-50 rounded-xl py-3 px-4 text-xs font-bold text-gray-500 font-cairo"
                >
                  {feature}
                </div>
              ))}
            </div>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 bg-black text-white text-sm font-bold font-cairo px-6 py-3 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              قريباً — تحت التطوير
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MerchantLayout;

