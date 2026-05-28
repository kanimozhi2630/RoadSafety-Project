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
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          800: '#1F2937',
          900: '#111827',
        },
        lifelink: {
          green: '#16A34A',
          greenLight: '#E8F5E9',
          amber: '#F59E0B',
          amberLight: '#FEF3C7',
          red: '#DC2626',
          redLight: '#FEE2E2',
          road: '#374151',
          roadBorder: '#E5E7EB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-safe': 'pulseSafe 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-warning': 'pulseWarning 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-critical': 'pulseCritical 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 6s linear infinite',
        'lane-move': 'laneMove 1s linear infinite',
        'lane-move-fast': 'laneMove 0.4s linear infinite',
        'float': 'floatEffect 3s ease-in-out infinite',
      },
      keyframes: {
        pulseSafe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1', boxShadow: '0 0 10px rgba(22, 163, 74, 0.4)' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8', boxShadow: '0 0 4px rgba(22, 163, 74, 0.1)' },
        },
        pulseWarning: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1', boxShadow: '0 0 12px rgba(245, 158, 11, 0.5)' },
          '50%': { transform: 'scale(1.05)', opacity: '0.7', boxShadow: '0 0 5px rgba(245, 158, 11, 0.2)' },
        },
        pulseCritical: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1', boxShadow: '0 0 20px rgba(220, 38, 38, 0.7)' },
          '50%': { transform: 'scale(1.08)', opacity: '0.6', boxShadow: '0 0 6px rgba(220, 38, 38, 0.3)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        laneMove: {
          '0%': { backgroundPositionY: '0px' },
          '100%': { backgroundPositionY: '40px' },
        },
        floatEffect: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      boxShadow: {
        premium: '0 4px 20px rgba(0, 0, 0, 0.03), 0 2px 6px rgba(0, 0, 0, 0.02)',
        premiumHover: '0 10px 30px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.03)',
        cardGreen: '0 4px 20px rgba(22, 163, 74, 0.08)',
        cardAmber: '0 4px 20px rgba(245, 158, 11, 0.08)',
        cardRed: '0 4px 25px rgba(220, 38, 38, 0.12)',
      }
    },
  },
  plugins: [],
}
