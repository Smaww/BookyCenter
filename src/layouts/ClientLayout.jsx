import React, { useState } from 'react';
import { TopNavbar, BottomNav } from '../components/ClientNavbar';

/**
 * ============================================================================
 * CLIENT LAYOUT — Post-Login Dashboard Shell
 * ============================================================================
 *
 * The authenticated client wrapper. Provides:
 *  1. Sticky TopNavbar (Logo, Search, Notifications, Avatar)
 *  2. Main content area (light gray bg, centered, responsive)
 *  3. Mobile BottomNav (Home, Discover, Bookings, Profile)
 *
 * Usage:
 *   <ClientLayout user={currentUser}>
 *     <HomePage />
 *   </ClientLayout>
 *
 * Visual DNA: Uber-Minimalist B&W. Cairo font. RTL-native.
 * ============================================================================
 */

/**
 * Mock user for development — replace with real auth context.
 * Matches the UserProfile interface from src/types/schema.ts.
 */
const MOCK_USER = {
  id: 'usr_001',
  fullName: 'أحمد محمد',
  avatarUrl: null, // null triggers the initial-letter fallback avatar
  phone: '+201012345678',
  rank: 'regular',
  coinsBalance: 230,
};

const ClientLayout = ({ children, user = MOCK_USER, onLogout }) => {
  const [activeTab, setActiveTab] = useState('home');

  // Mock notification count — wire to real state / API later
  const notificationCount = 3;

  return (
    <div className="min-h-screen bg-gray-50 font-cairo" dir="rtl">

      {/* ── STICKY TOP NAVBAR ── */}
      <TopNavbar user={user} notificationCount={notificationCount} onLogout={onLogout} />

      {/* ── MAIN CONTENT AREA ── */}
      {/*
        Padding top accounts for:
          - Mobile: h-14 (header) + ~52px (mobile search bar) = ~pt-28
          - Desktop: h-16 (header only) = pt-20
        Padding bottom accounts for:
          - Mobile: h-16 (bottom nav) + safe-area = pb-24
          - Desktop: standard pb-8
      */}
      <main className="pt-28 md:pt-20 pb-24 md:pb-8 min-h-screen">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          {children}
        </div>
      </main>

      {/* ── MOBILE BOTTOM NAVIGATION ── */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default ClientLayout;

