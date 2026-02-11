import React from 'react';
import LandingPage from './pages/LandingPage';

/**
 * Booky Center - Main Application
 * 
 * بوكي سنتر - التطبيق الرئيسي
 * 
 * الهدف: أي مستخدم مصري لازم يفهم القيمة ويبدأ أول بحث في 5 ثواني
 * 
 * Visual Identity:
 * - Pure White (#FFFFFF)
 * - Bold Black (#000000)  
 * - Signal Red (#FF0000)
 * 
 * Typography: Cairo (Arabic)
 * Direction: RTL
 */

function App() {
  return (
    <div className="App">
      <LandingPage />
    </div>
  );
}

export default App;
