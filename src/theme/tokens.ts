export const colors = {
  // Notebook theme colors
  background: '#FFF9E6', // Cream paper
  paper: '#FFFEF7', // White paper
  paperLines: '#E8DCC4', // Ruled lines
  primary: '#2C3E50', // Dark ink blue
  secondary: '#9B59B6', // Purple highlight
  accent: '#E74C3C', // Red pen
  success: '#27AE60', // Green checkmark
  warning: '#F39C12', // Yellow highlight
  white: '#FFFFFF',
  notebook: {
    cover: '#8B4513', // Brown leather
    binding: '#654321', // Dark brown
    margin: '#FFE4B5', // Light margin
    highlight: '#FFEB3B', // Yellow highlighter
    pencil: '#757575', // Pencil gray
  },
  gray: {
    100: '#F8F9FA',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#6C757D',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
  },
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const;

export const borderRadius = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
} as const;

export const shadows = {
  paper: '0 2px 8px rgba(0, 0, 0, 0.08)',
  card: '0 4px 12px rgba(0, 0, 0, 0.1)',
  elevated: '0 8px 24px rgba(0, 0, 0, 0.15)',
  notebook: '2px 2px 8px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(0, 0, 0, 0.05)',
  page: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
} as const;

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '300ms ease-in-out',
  slow: '500ms ease-in-out',
  chart: '1000ms ease-in-out',
} as const;
