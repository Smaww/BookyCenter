/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Booky Center Power Palette
        'booky-red': '#FF0000',
        'signal-red': '#FF0000',
        'booky-black': '#000000',
        'booky-white': '#FFFFFF',
        'booky-grey': '#6B7280',
      },
      fontFamily: {
        // Cairo for Arabic, Inter for English fallback
        'cairo': ['Cairo', 'sans-serif'],
        'sans': ['Cairo', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-red': 'pulseRed 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(230, 57, 70, 0.4)' },
          '50%': { boxShadow: '0 0 0 15px rgba(230, 57, 70, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'red': '0 10px 40px -10px rgba(230, 57, 70, 0.3)',
        'red-lg': '0 20px 60px -15px rgba(230, 57, 70, 0.4)',
      },
    },
  },
  plugins: [],
}

