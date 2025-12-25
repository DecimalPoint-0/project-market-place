/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f1f3f',
        secondary: '#D3AC2B',
        tertiary: '#CBD0D8',
        light: '#F4F3EA',
        accent: '#FF6B6B',
        success: '#51CF66',
        warning: '#FFD93D',
        danger: '#FF6B6B',
        info: '#4ECDC4',
      },
      fontFamily: {
        'noto-sans': ['NotoSans', 'sans-serif'],
        'robot': ['Roboto', 'Sans-serif'],
        sans: ['Roboto', 'sans-serif'],
        serif: ['"Roboto Slab"', 'serif'],
        body: ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 15px rgba(0, 0, 0, 0.08)',
        'medium': '0 8px 25px rgba(0, 0, 0, 0.12)',
        'elevated': '0 12px 40px rgba(0, 0, 0, 0.15)',
        'card': '0 2px 12px rgba(15, 31, 63, 0.1)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.6s ease-in-out',
        'slideUp': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0f1f3f 0%, #1a2d5a 100%)',
        'gradient-warm': 'linear-gradient(135deg, #D3AC2B 0%, #ff9800 100%)',
        'gradient-cool': 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
      },
    },
  },
  plugins: [],
}

