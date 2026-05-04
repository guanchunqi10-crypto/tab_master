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
          DEFAULT: '#4285F4',
          light: '#E8F0FE'
        },
        surface: {
          DEFAULT: '#FFFFFF',
          bg: '#F8F9FA'
        },
        text: {
          primary: '#202124',
          secondary: '#5F6368',
          placeholder: '#9AA0A6'
        },
        border: '#DADCE0',
        success: '#34A853',
        warning: '#FBBC04',
        error: '#EA4335'
      },
      fontFamily: {
        sans: ['"Google Sans"', 'Roboto', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif']
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px'
      },
      boxShadow: {
        'card': '0 2px 8px rgba(60, 64, 67, 0.15)',
        'card-hover': '0 4px 16px rgba(60, 64, 67, 0.25)',
        'menu': '0 4px 16px rgba(60, 64, 67, 0.25)'
      },
      borderRadius: {
        'card': '8px',
        'button': '8px',
        'input': '8px',
        'search': '24px',
        'modal': '12px',
        'tag': '4px',
        'badge': '12px'
      },
      transitionDuration: {
        'micro': '150ms',
        'normal': '200ms',
        'toast': '300ms'
      }
    },
  },
  plugins: [],
}
