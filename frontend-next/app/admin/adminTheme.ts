import { createTheme } from '@mui/material/styles';

// Design tokens — referenced in styleOverrides to avoid string duplication
const colors = {
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  textMuted: '#374151',
  bgSubtle: '#f8fafc',
  borderLight: '#e5e7eb',
  borderLighter: '#f3f4f6',
} as const;

export const adminTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    background: {
      default: '#f1f5f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontSize: '2.25rem', fontWeight: 700 },
    h2: { fontSize: '1.875rem', fontWeight: 600 },
    h3: { fontSize: '1.5rem', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(20px)',
          color: colors.textPrimary,
          boxShadow: '0 1px 0 0 rgba(0,0,0,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.6)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
          border: '1px solid rgba(255,255,255,0.6)',
          borderRadius: '16px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: '10px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: colors.bgSubtle,
          borderBottom: `1px solid ${colors.borderLight}`,
          fontWeight: 600,
          fontSize: '13px',
          color: colors.textMuted,
          padding: '14px 16px',
        },
        body: {
          borderBottom: `1px solid ${colors.borderLighter}`,
          padding: '14px 16px',
          fontSize: '14px',
          color: colors.textPrimary,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: colors.bgSubtle },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: '10px',
          },
          borderRadius: '10px',
        },
      },
    },
  },
});
