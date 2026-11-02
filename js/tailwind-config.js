/**
 * EcoTech Loop - Tailwind CSS Custom Configuration (Bright & Fresh Theme)
 * Harmonizing IT (Cyber Cyan), E-Commerce (Action Orange) & Multimedia (Eco Green)
 */
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        pageBg: '#F8FAFC',       // Clean fresh slate canvas
        pageSurface: '#FFFFFF',  // Crisp white surface
        brandNavy: '#0F172A',    // Deep contrasting navy/slate for text
        brandSlate: '#1E293B',
        brandMuted: '#64748B',
        brandBorder: '#E2E8F0',
        cyberCyan: {
          DEFAULT: '#06B6D4',
          hover: '#0891B2',
          glow: 'rgba(6, 182, 212, 0.25)',
          light: '#ECFEFF',
          dark: '#0E7490'
        },
        ecoGreen: {
          DEFAULT: '#10B981',
          hover: '#059669',
          glow: 'rgba(16, 185, 129, 0.25)',
          light: '#ECFDF5',
          dark: '#047857'
        },
        actionOrange: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
          glow: 'rgba(249, 115, 22, 0.25)',
          light: '#FFF7ED',
          dark: '#C2410C'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-gradient': 'linear-gradient(135deg, #06B6D4 0%, #10B981 100%)',
        'action-gradient': 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
        'fresh-card': 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.04)' },
        },
        laserSweep: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
        laserSweep: 'laserSweep 3s linear infinite',
      }
    }
  }
};
