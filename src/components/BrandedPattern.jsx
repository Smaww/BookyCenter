import React from 'react';

/**
 * ============================================================================
 * BOOKY CENTER — BrandedPattern (WhatsApp-Chat-Style SVG Doodle Wallpaper)
 * ============================================================================
 *
 * Lightweight, zero-network-request SVG pattern that tiles seamlessly over
 * the hero section's black background.
 *
 * Icons (thin white stroke, no fill) represent Booky's core sectors:
 *
 *   🎟️  Ticket           → Bookings / Events
 *   ⚽  Soccer Ball       → Sports
 *   🎮  PlayStation Pad   → Entertainment
 *   ✂️  Barber Scissors   → Health & Beauty
 *   🦷  Tooth (Molar)     → Medical / Health
 *
 * Each icon is slightly rotated so the repeat feels organic, not mechanical.
 *
 * A built-in radial-gradient vignette mask dims the center (where headline
 * + search box live) while letting the pattern peek through on the edges.
 *
 * Props:
 *   opacity  — controls the icon layer intensity (default 0.12)
 *
 * Usage:
 *   <BrandedPattern opacity={0.12} />
 *   Place inside a position:relative parent. Component renders at z-0.
 *
 * ============================================================================
 */

const BrandedPattern = ({ opacity = 0.12 }) => (
  <div className="absolute inset-0 z-0" aria-hidden="true">
    {/* ── Layer 1: Tiling SVG icon pattern ── */}
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      style={{ opacity }}
    >
      <defs>
        {/*
          Pattern tile: 260×260 px
          Icons are ~30-40px each, scattered & rotated across the tile.
          The tile is large enough to avoid obvious repetition.
        */}
        <pattern
          id="booky-branded-pattern"
          x="0"
          y="0"
          width="260"
          height="260"
          patternUnits="userSpaceOnUse"
        >
          {/* ─────────────────────────────────────────────
              🎟️  TICKET  (top-left)
              Rectangle with side notches + stub lines
          ───────────────────────────────────────────── */}
          <g
            transform="translate(18, 22) rotate(-10, 18, 12)"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            {/* Body */}
            <path d="M0,4 Q0,0 4,0 L14,0 L14,4 A3,3 0 0,0 14,10 L14,24 Q14,28 10,28 L4,28 Q0,28 0,24 L0,18 A3,3 0 0,0 0,12 Z" />
            {/* Right half */}
            <path d="M22,4 Q22,0 26,0 L32,0 Q36,0 36,4 L36,12 A3,3 0 0,0 36,18 L36,24 Q36,28 32,28 L26,28 Q22,28 22,24 L22,10 A3,3 0 0,0 22,4 Z" />
            {/* Dashed perforation between halves */}
            <line x1="18" y1="1" x2="18" y2="27" strokeDasharray="2 3" />
            {/* Stub detail lines */}
            <line x1="4" y1="8" x2="12" y2="8" />
            <line x1="4" y1="14" x2="10" y2="14" />
            <line x1="4" y1="20" x2="12" y2="20" />
          </g>

          {/* ─────────────────────────────────────────────
              ⚽  SOCCER BALL  (top-right)
              Circle with hexagonal panel lines
          ───────────────────────────────────────────── */}
          <g
            transform="translate(170, 18) rotate(8, 16, 16)"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            <circle cx="16" cy="16" r="15" />
            {/* Central pentagon */}
            <polygon points="16,6 21,11 19,18 13,18 11,11" />
            {/* Panel lines radiating outward */}
            <line x1="16" y1="6" x2="16" y2="1" />
            <line x1="21" y1="11" x2="29" y2="6" />
            <line x1="19" y1="18" x2="26" y2="26" />
            <line x1="13" y1="18" x2="6" y2="26" />
            <line x1="11" y1="11" x2="3" y2="6" />
          </g>

          {/* ─────────────────────────────────────────────
              🎮  PLAYSTATION CONTROLLER  (bottom-left)
              Classic gamepad silhouette with D-pad & buttons
          ───────────────────────────────────────────── */}
          <g
            transform="translate(15, 160) rotate(5, 20, 14)"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            {/* Body shell */}
            <path d="M10,8 Q10,2 18,2 L26,2 Q34,2 34,8 L36,18 Q37,24 32,24 L30,16 L14,16 L12,24 Q7,24 8,18 Z" />
            {/* D-pad (left side) */}
            <line x1="15" y1="7" x2="15" y2="13" />
            <line x1="12" y1="10" x2="18" y2="10" />
            {/* Action buttons (right side) */}
            <circle cx="28" cy="7" r="1.5" />
            <circle cx="31" cy="10" r="1.5" />
            <circle cx="28" cy="13" r="1.5" />
            <circle cx="25" cy="10" r="1.5" />
            {/* Analog sticks */}
            <circle cx="19" cy="18" r="2" />
            <circle cx="25" cy="18" r="2" />
          </g>

          {/* ─────────────────────────────────────────────
              ✂️  BARBER SCISSORS  (center area)
              X-shaped open blades with finger loops
          ───────────────────────────────────────────── */}
          <g
            transform="translate(105, 80) rotate(-15, 16, 18)"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            {/* Left blade */}
            <line x1="6" y1="2" x2="22" y2="24" />
            {/* Right blade */}
            <line x1="26" y1="2" x2="10" y2="24" />
            {/* Pivot bolt */}
            <circle cx="16" cy="13" r="2.5" />
            {/* Finger loops */}
            <ellipse cx="4" cy="0" rx="4" ry="5" transform="rotate(15, 4, 0)" />
            <ellipse cx="28" cy="0" rx="4" ry="5" transform="rotate(-15, 28, 0)" />
          </g>

          {/* ─────────────────────────────────────────────
              🦷  TOOTH / MOLAR  (bottom-right)
              Classic molar shape for medical / health
          ───────────────────────────────────────────── */}
          <g
            transform="translate(170, 155) rotate(12, 16, 18)"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            {/* Crown */}
            <path d="M6,14 Q2,6 6,2 Q10,-1 16,4 Q22,-1 26,2 Q30,6 26,14" />
            {/* Roots */}
            <path d="M6,14 Q6,24 10,30 Q12,34 14,28 L16,20" />
            <path d="M26,14 Q26,24 22,30 Q20,34 18,28 L16,20" />
          </g>

          {/* ─────────────────────────────────────────────
              Extra scatter: 🎟️ small ticket (center-bottom)
              — keeps the tile dense without empty zones
          ───────────────────────────────────────────── */}
          <g
            transform="translate(80, 195) rotate(20, 14, 10)"
            stroke="white"
            strokeWidth="0.8"
            strokeLinecap="round"
            fill="none"
          >
            <rect x="0" y="0" width="28" height="18" rx="3" />
            <line x1="10" y1="0" x2="10" y2="18" strokeDasharray="2 2" />
            <circle cx="5" cy="9" r="2" />
          </g>

          {/* ─────────────────────────────────────────────
              Extra scatter: ⚽ small ball (left-center)
          ───────────────────────────────────────────── */}
          <g
            transform="translate(55, 110) rotate(-22, 10, 10)"
            stroke="white"
            strokeWidth="0.8"
            fill="none"
          >
            <circle cx="10" cy="10" r="9" />
            <polygon points="10,3 13,7 12,11 8,11 7,7" />
          </g>

          {/* ── Scattered micro-dots (organic filler) ── */}
          <circle cx="95"  cy="35"  r="1" fill="white" opacity="0.5" />
          <circle cx="140" cy="120" r="1" fill="white" opacity="0.4" />
          <circle cx="45"  cy="90"  r="1" fill="white" opacity="0.5" />
          <circle cx="220" cy="100" r="1" fill="white" opacity="0.4" />
          <circle cx="200" cy="220" r="1" fill="white" opacity="0.5" />
          <circle cx="60"  cy="240" r="1" fill="white" opacity="0.4" />
          <circle cx="240" cy="50"  r="1" fill="white" opacity="0.4" />
        </pattern>
      </defs>

      {/* Fill entire viewport with the repeating tile */}
      <rect width="100%" height="100%" fill="url(#booky-branded-pattern)" />
    </svg>

    {/* ── Layer 2: Vignette "Text Safe Zone" ── */}
    {/*
        Radial gradient that is fully transparent in the center (where
        headline + search box live) and fades to solid black at the
        edges, dimming the icons around the periphery.
    */}
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.85) 100%)',
      }}
    />
  </div>
);

export default BrandedPattern;

