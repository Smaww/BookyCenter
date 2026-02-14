import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import ClientHome from './pages/ClientHome';
import MerchantLayout from './layouts/MerchantLayout';

/**
 * ============================================================================
 * BOOKY CENTER — App Root (The Journey Switcher)
 * ============================================================================
 *
 * State Machine:
 *   userType === null       → Landing Page (Visitor)
 *   userType === 'client'   → Client Dashboard (Social Feed)
 *   userType === 'merchant' → Merchant Dashboard (Placeholder)
 *
 * The "دخول" button   → Instant login as client (simulation)
 * The "حساب جديد" btn → Opens AuthSelectionModal → picks type
 * The "تسجيل الخروج"   → Sets userType back to null
 *
 * ============================================================================
 */

function App() {
  // null = Visitor (Landing Page) | 'client' | 'merchant'
  const [userType, setUserType] = useState(null);

  // Logout — return to Landing Page
  const handleLogout = () => {
    setUserType(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="App">
      {/* ── VISITOR: Landing Page ── */}
      {userType === null && (
        <LandingPage onSelectType={(type) => setUserType(type)} />
      )}

      {/* ── CLIENT: Social Feed Dashboard ── */}
      {userType === 'client' && (
        <ClientHome onLogout={handleLogout} />
      )}

      {/* ── MERCHANT: Dashboard Placeholder ── */}
      {userType === 'merchant' && (
        <MerchantLayout onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
