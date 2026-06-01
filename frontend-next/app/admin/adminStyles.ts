import type { SxProps, Theme } from '@mui/material/styles';

/** Glass card wrapper for List pages */
export const glassCard: SxProps<Theme> = {
  background: 'rgba(255,255,255,0.8)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
  border: '1px solid rgba(255,255,255,0.6)',
  borderRadius: '16px',
  overflow: 'hidden',
  '& .RaList-main': { padding: 0 },
  '& .RaList-content': { padding: '24px' },
  '& .RaList-actions': { paddingBottom: '16px', paddingTop: '8px' },
  '& .RaFilterForm-form': {
    paddingBottom: '20px',
    paddingLeft: '32px',
    paddingRight: '32px',
    backgroundColor: '#f8fafc',
    marginLeft: '-24px',
    marginRight: '-24px',
    marginTop: '-24px',
    paddingTop: '20px',
  },
  '& .MuiTableContainer-root': { borderRadius: 0, border: 'none', boxShadow: 'none' },
  '& .MuiTable-root': { borderCollapse: 'separate', borderSpacing: 0 },
  '& .MuiTableHead-root': { backgroundColor: '#f8fafc' },
  '& .MuiTableCell-head': {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e5e7eb',
    fontWeight: 600,
    fontSize: '14px',
    color: '#374151',
    padding: '16px',
  },
  '& .MuiTableCell-body': {
    borderBottom: '1px solid #f3f4f6',
    padding: '16px',
    fontSize: '14px',
    color: '#1f2937',
  },
  '& .MuiTableRow-root:hover': { backgroundColor: '#f8fafc' },
};

/** Glass card wrapper for Create/Edit form pages */
export const formCard: SxProps<Theme> = {
  background: 'rgba(255,255,255,0.8)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
  border: '1px solid rgba(255,255,255,0.6)',
  borderRadius: '16px',
  overflow: 'hidden',
};

/** sx for SearchInput / filter inputs */
export const filterInputSx: SxProps<Theme> = {
  marginLeft: '12px',
  '& .MuiInputBase-root': {
    backgroundColor: 'background.paper',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
    '&:hover': { borderColor: '#3b82f6' },
    '&.Mui-focused': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgb(59 130 246 / 0.1)',
    },
  },
  '& .MuiInputBase-input': {
    padding: '12px 16px',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    '&::placeholder': { color: '#6b7280', opacity: 1 },
  },
};

/** Tailwind className for TopToolbar */
export const toolbarClass = '!bg-transparent !shadow-none !border-none !p-0';

/** Tailwind className for Create button */
export const createBtnClass = '!bg-blue-600 hover:!bg-blue-700 !text-white !rounded-lg !px-4 !py-2 !shadow-sm !border-none !min-h-[40px]';

/** Tailwind className for Filter button */
export const filterBtnClass = '!bg-white !text-gray-700 !border !border-gray-300 hover:!bg-gray-50 !rounded-lg !px-4 !py-2 !shadow-sm !min-h-[40px]';

/** Shared page header section className */
export const pageHeaderClass = 'flex items-center justify-between mb-6';

/** Shared page title className */
export const pageTitleClass = 'text-2xl font-bold text-slate-900';

/** Shared page subtitle className */
export const pageSubtitleClass = 'text-slate-500 mt-1 text-sm';
