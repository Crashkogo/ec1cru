'use client';
import { useState, useEffect } from 'react';
import { useNotify, Title } from 'react-admin';
import axios from 'axios';
import {
  Card, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Chip, IconButton, CircularProgress
} from '@mui/material';
import { pageHeaderClass, pageTitleClass, pageSubtitleClass, formCard } from '@/app/admin/adminStyles';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface SuppressionEntry {
  id: number;
  email: string;
  reason: string;
  createdAt: string;
}

const reasonLabel: Record<string, { label: string; color: 'error' | 'warning' | 'default' }> = {
  UNSUBSCRIBED: { label: 'Отписался', color: 'default' },
  BOUNCED: { label: 'Bounce', color: 'error' },
  COMPLAINED: { label: 'Жалоба', color: 'warning' },
};

export const SuppressionListPage = () => {
  const notify = useNotify();
  const [list, setList] = useState<SuppressionEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    axios
      .get(`${API_URL}/api/posts/admin/suppression-list?_start=0&_end=200`, { withCredentials: true })
      .then((r) => setList(r.data))
      .catch(() => notify('Ошибка загрузки', { type: 'error' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleRemove = async (email: string) => {
    try {
      await axios.delete(
        `${API_URL}/api/posts/admin/suppression-list/${encodeURIComponent(email)}`,
        { withCredentials: true }
      );
      notify('Удалено из списка подавлений', { type: 'success' });
      setList((prev) => prev.filter((e) => e.email !== email));
    } catch {
      notify('Ошибка удаления', { type: 'error' });
    }
  };

  return (
    <>
      <Title title="Список подавлений" />
      <Box>
        <div className={pageHeaderClass}>
          <div>
            <h1 className={pageTitleClass}>Список подавлений</h1>
            <p className={pageSubtitleClass}>Адреса, которым рассылки не отправляются</p>
          </div>
        </div>
        <Card sx={{ ...formCard }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : list.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', color: '#64748b' }}>
              <Typography>Список подавлений пуст</Typography>
            </Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Причина</TableCell>
                  <TableCell>Дата</TableCell>
                  <TableCell align="right">Действие</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((entry) => {
                  const r = reasonLabel[entry.reason] || { label: entry.reason, color: 'default' as const };
                  return (
                    <TableRow key={entry.id}>
                      <TableCell sx={{ fontSize: '13px' }}>{entry.email}</TableCell>
                      <TableCell>
                        <Chip label={r.label} color={r.color} size="small" />
                      </TableCell>
                      <TableCell sx={{ fontSize: '13px', color: '#6b7280' }}>
                        {new Date(entry.createdAt).toLocaleDateString('ru-RU')}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          title="Удалить из списка подавлений"
                          onClick={() => handleRemove(entry.email)}
                          sx={{ color: '#ef4444', '&:hover': { background: 'rgba(239,68,68,0.08)' } }}
                        >
                          X
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      </Box>
    </>
  );
};

export default SuppressionListPage;
