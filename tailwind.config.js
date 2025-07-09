/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#4F46E5',
          600: '#4338ca',
          700: '#3730a3',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          500: '#7C3AED',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        accent: {
          50: '#fdf2f8',
          100: '#fce7f3',
          500: '#EC4899',
          600: '#db2777',
          700: '#be185d',
        },
        surface: '#F8FAFC',
success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        border: '#E5E7EB',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 8px rgba(0, 0, 0, 0.15)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
      animation: {
        'pulse-success': 'pulse 0.5s ease-in-out',
        'bounce-subtle': 'bounce 1s infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}