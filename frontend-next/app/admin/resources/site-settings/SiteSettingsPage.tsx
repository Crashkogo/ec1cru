'use client';

import { useState, useEffect } from 'react';
import { useNotify, Title } from 'react-admin';
import axios from 'axios';
import { Card, Box, Typography, Switch, TextField, Button, Divider, CircularProgress, FormControlLabel } from '@mui/material';
import { formCard, pageHeaderClass, pageTitleClass, pageSubtitleClass } from '@/app/admin/adminStyles';
import {
  WrenchScrewdriverIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface Settings {
  maintenance_mode: string;
  maintenance_phone: string;
  client_cabinet_enabled: string;
  indexing_enabled: string;
  // Email
  email_provider: string;
  smtp_host: string;
  smtp_port: string;
  smtp_secure: string;
  smtp_user: string;
  smtp_pass: string;
  email_from_name: string;
  email_from_address: string;
}

const DEFAULT: Settings = {
  maintenance_mode: 'false',
  maintenance_phone: '',
  client_cabinet_enabled: 'true',
  indexing_enabled: 'false',
  email_provider: 'smtp',
  smtp_host: 'smtp.timeweb.ru',
  smtp_port: '465',
  smtp_secure: 'true',
  smtp_user: '',
  smtp_pass: '',
  email_from_name: 'Инженер-центр',
  email_from_address: '',
};

const b = (v: string) => v === 'true';

export const SiteSettingsPage = () => {
  const notify = useNotify();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingSend, setTestingSend] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/admin/site-settings`, { withCredentials: true })
      .then((r) => setSettings({ ...DEFAULT, ...r.data }))
      .catch(() => notify('Не удалось загрузить настройки', { type: 'error' }))
      .finally(() => setLoading(false));
  }, []);

  const set = (key: keyof Settings, value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const handleTestEmail = async () => {
    setTestingSend(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/admin/site-settings/test-email`,
        { to: settings.email_from_address },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
      notify(response.data.message || 'Тестовое письмо отправлено', { type: 'success' });
    } catch (err: any) {
      notify(err?.response?.data?.message || 'Ошибка отправки тестового письма', { type: 'error' });
    } finally {
      setTestingSend(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_URL}/api/admin/site-settings`, settings, { withCredentials: true });
      notify('Настройки сохранены', { type: 'success' });
    } catch {
      notify('Ошибка при сохранении', { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const SettingRow = ({
    icon: Icon,
    title,
    description,
    checked,
    onChange,
    danger = false,
  }: {
    icon: React.ElementType;
    title: string;
    description: string;
    checked: boolean;
    onChange: (v: boolean) => void;
    danger?: boolean;
  }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2.5 }}>
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: danger
            ? checked ? 'rgba(239,68,68,0.12)' : 'rgba(241,245,249,1)'
            : 'rgba(241,245,249,1)',
        }}
      >
        <Icon
          style={{
            width: 20,
            height: 20,
            color: danger && checked ? '#ef4444' : '#64748b',
          }}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px', mt: 0.25 }}>
          {description}
        </Typography>
      </Box>
      <Switch
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        color={danger ? 'error' : 'primary'}
      />
    </Box>
  );

  return (
    <>
      <Title title="Настройки сайта" />
      <Box>
        <div className={pageHeaderClass}>
          <div>
            <h1 className={pageTitleClass}>Настройки сайта</h1>
            <p className={pageSubtitleClass}>Управление режимами работы сайта</p>
          </div>
        </div>

        <Card sx={{ ...formCard, p: 3 }}>
          {/* Режим технических работ */}
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '15px', color: '#0f172a', mb: 0.5 }}>
            Доступность сайта
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px', mb: 2 }}>
            При включении режима техработ все страницы сайта заменяются заглушкой.
          </Typography>

          <SettingRow
            icon={WrenchScrewdriverIcon}
            title="Режим технических работ"
            description="Сайт будет показывать страницу-заглушку с телефоном для связи"
            checked={b(settings.maintenance_mode)}
            onChange={(v) => set('maintenance_mode', String(v))}
            danger
          />

          {b(settings.maintenance_mode) && (
            <Box sx={{ ml: 7, mb: 1 }}>
              <TextField
                label="Телефон для связи"
                size="small"
                value={settings.maintenance_phone}
                onChange={(e) => set('maintenance_phone', e.target.value)}
                placeholder="+7 (844) 300-801"
                InputProps={{
                  startAdornment: (
                    <PhoneIcon style={{ width: 16, height: 16, color: '#94a3b8', marginRight: 8 }} />
                  ),
                }}
                sx={{ width: 280 }}
              />
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Личный кабинет */}
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '15px', color: '#0f172a', mb: 0.5 }}>
            Функции сайта
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px', mb: 2 }}>
            Включение и отключение отдельных разделов сайта.
          </Typography>

          <SettingRow
            icon={UserCircleIcon}
            title="Личный кабинет клиента"
            description="Раздел /client — вход для клиентов, просмотр договоров и заявок"
            checked={b(settings.client_cabinet_enabled)}
            onChange={(v) => set('client_cabinet_enabled', String(v))}
          />

          <Divider sx={{ my: 2 }} />

          {/* SEO / Индексация */}
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '15px', color: '#0f172a', mb: 0.5 }}>
            Поисковая индексация
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px', mb: 2 }}>
            Управляет содержимым файла robots.txt. Отключено — все поисковики заблокированы
            (Disallow: /). Включено — разрешена полная индексация.
          </Typography>

          <SettingRow
            icon={MagnifyingGlassIcon}
            title="Разрешить индексацию"
            description="robots.txt будет содержать Allow: / для всех поисковиков"
            checked={b(settings.indexing_enabled)}
            onChange={(v) => set('indexing_enabled', String(v))}
          />

          <Divider sx={{ my: 2 }} />

          {/* Email / SMTP */}
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '15px', color: '#0f172a', mb: 0.5 }}>
            Email-рассылка (SMTP)
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px', mb: 2 }}>
            Настройки сервера исходящей почты. После изменения нажмите «Тест отправки» для проверки.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Имя отправителя"
                size="small"
                value={settings.email_from_name}
                onChange={(e) => set('email_from_name', e.target.value)}
                sx={{ flex: 1, minWidth: 200 }}
              />
              <TextField
                label="Email отправителя"
                size="small"
                value={settings.email_from_address}
                onChange={(e) => set('email_from_address', e.target.value)}
                sx={{ flex: 1, minWidth: 200 }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                label="SMTP хост"
                size="small"
                value={settings.smtp_host}
                onChange={(e) => set('smtp_host', e.target.value)}
                sx={{ flex: 2, minWidth: 200 }}
              />
              <TextField
                label="Порт"
                size="small"
                value={settings.smtp_port}
                onChange={(e) => set('smtp_port', e.target.value)}
                sx={{ width: 90 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.smtp_secure === 'true'}
                    onChange={(e) => set('smtp_secure', String(e.target.checked))}
                    size="small"
                  />
                }
                label={<Typography sx={{ fontSize: '13px', color: '#374151' }}>SSL/TLS</Typography>}
                sx={{ ml: 0 }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Логин SMTP"
                size="small"
                value={settings.smtp_user}
                onChange={(e) => set('smtp_user', e.target.value)}
                sx={{ flex: 1, minWidth: 200 }}
              />
              <TextField
                label="Пароль SMTP"
                size="small"
                type="password"
                value={settings.smtp_pass}
                onChange={(e) => set('smtp_pass', e.target.value)}
                sx={{ flex: 1, minWidth: 200 }}
              />
            </Box>
            <Box>
              <Button
                variant="outlined"
                size="small"
                onClick={handleTestEmail}
                disabled={testingSend || saving}
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  borderColor: '#3b82f6',
                  color: '#3b82f6',
                  fontSize: '13px',
                  '&:hover': { borderColor: '#2563eb', color: '#2563eb', background: 'rgba(59,130,246,0.04)' },
                }}
              >
                {testingSend ? 'Отправляю...' : 'Тест отправки на мой email'}
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Статус */}
          <Box sx={{ p: 2, borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <ShieldCheckIcon style={{ width: 16, height: 16, color: '#64748b' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#374151' }}>
                Текущий статус
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {[
                {
                  label: 'Техработы',
                  active: b(settings.maintenance_mode),
                  activeColor: '#ef4444',
                  activeText: 'ВКЛ',
                  inactiveText: 'ВЫКЛ',
                },
                {
                  label: 'Личный кабинет',
                  active: b(settings.client_cabinet_enabled),
                  activeColor: '#22c55e',
                  activeText: 'ВКЛ',
                  inactiveText: 'ВЫКЛ',
                },
                {
                  label: 'Индексация',
                  active: b(settings.indexing_enabled),
                  activeColor: '#22c55e',
                  activeText: 'ВКЛ',
                  inactiveText: 'ВЫКЛ',
                },
              ].map(({ label, active, activeColor, activeText, inactiveText }) => (
                <Box
                  key={label}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.75,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '8px',
                    background: active ? `${activeColor}18` : '#f1f5f9',
                    border: `1px solid ${active ? `${activeColor}40` : '#e2e8f0'}`,
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: active ? activeColor : '#94a3b8',
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, fontSize: '12px', color: active ? activeColor : '#64748b' }}
                  >
                    {label}: {active ? activeText : inactiveText}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#fff',
                borderRadius: '10px',
                px: 3,
                py: 1,
                fontWeight: 600,
                fontSize: '14px',
                textTransform: 'none',
                boxShadow: '0 4px 6px -1px rgb(59 130 246 / 0.3)',
                '&:hover': { background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' },
              }}
            >
              {saving ? 'Сохраняю...' : 'Сохранить настройки'}
            </Button>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default SiteSettingsPage;
