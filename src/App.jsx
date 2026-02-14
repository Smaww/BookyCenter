import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ClientHome from './pages/ClientHome';
import MerchantLayout from './layouts/MerchantLayout';
import SearchResults from './pages/SearchResults';

/**
 * ============================================================================
 * BOOKY CENTER — App Root (The Journey Switcher)
 * ============================================================================
 *
 * Routing (react-router-dom v6):
 *   /         → Landing Page (Visitor) -or- Client / Merchant view
 *   /search   → SearchResults Page (accepts ?lat=&lng=&category=)
 *
 * State Machine (for / route):
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

  // ── Home view based on userType state machine ──
  const HomeView = () => (
    <>
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
    </>
  );

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </div>
  );
}

export default App;
