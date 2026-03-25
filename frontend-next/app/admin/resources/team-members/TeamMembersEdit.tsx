'use client';

import React, { useRef, useState } from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  NumberInput,
  required,
  ListButton,
  TopToolbar,
  SaveButton,
  Toolbar,
  useRecordContext,
  useNotify,
  useRefresh,
} from 'react-admin';
import { Card, Typography, Box, Button, Avatar, CircularProgress } from '@mui/material';
import { CameraIcon } from '@heroicons/react/24/outline';

const sectionChoices = [
  { id: 'MANAGERS',       name: 'Менеджеры' },
  { id: 'CONSULTATION',   name: 'Сектор Линия консультаций' },
  { id: 'ITS',            name: 'Сектор ИТС' },
  { id: 'IMPLEMENTATION', name: 'Сектор Внедрения' },
  { id: 'TECH',           name: 'Технический отдел' },
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const TeamMemberPhotoUpload = () => {
  const record     = useRecordContext();
  const notify     = useNotify();
  const refresh    = useRefresh();
  const fileRef    = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  if (!record) return null;

  const photoSrc = record.photoUrl
    ? `${process.env.NEXT_PUBLIC_API_URL || ''}${record.photoUrl}`
    : undefined;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append('photo', file);
      const res = await fetch(`${apiUrl}/api/team-members/${record.id}/photo`, {
        method: 'POST',
        body: form,
        credentials: 'include',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Ошибка загрузки');
      }
      notify('Фото успешно загружено', { type: 'success' });
      refresh();
    } catch (err: any) {
      notify(err.message || 'Ошибка при загрузке фото', { type: 'error' });
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar src={photoSrc} sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 28 }}>
        {!photoSrc && `${record.firstName?.charAt(0) || ''}${record.lastName?.charAt(0) || ''}`}
      </Avatar>
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {record.photoUrl ? 'Фотография загружена' : 'Фотография не загружена'}
        </Typography>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleChange} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={loading ? <CircularProgress size={16} /> : <CameraIcon style={{ width: 16, height: 16 }} />}
            onClick={() => fileRef.current?.click()}
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Загрузить фото'}
          </Button>
          <Typography variant="caption" color="text.secondary">JPG, PNG, WEBP · до 5 МБ</Typography>
        </Box>
      </Box>
    </Box>
  );
};

const EditActions = () => <TopToolbar><ListButton /></TopToolbar>;
const EditToolbar = () => <Toolbar><SaveButton /></Toolbar>;

const EditTitle = () => {
  const record = useRecordContext();
  return record ? `${record.firstName} ${record.lastName}` : 'Редактирование';
};

export const TeamMembersEdit: React.FC = () => (
  <Edit title={<EditTitle />} actions={<EditActions />}>
    <Card className="p-6">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Редактирование сотрудника</Typography>
      </Box>
      <SimpleForm toolbar={<EditToolbar />}>
        <TeamMemberPhotoUpload />
        <TextInput source="id" label="ID" disabled fullWidth sx={{ mb: 2 }} />
        <TextInput source="firstName" label="Имя"     validate={[required()]} fullWidth sx={{ mb: 2 }} />
        <TextInput source="lastName"  label="Фамилия" validate={[required()]} fullWidth sx={{ mb: 2 }} />
        <TextInput
          source="position"
          label="Должность"
          validate={[required()]}
          fullWidth
          helperText='Например: "Менеджер", "Специалист ИТС"'
          sx={{ mb: 2 }}
        />
        <SelectInput
          source="section"
          label="Раздел на странице /team"
          choices={sectionChoices}
          validate={[required()]}
          fullWidth
          sx={{ mb: 2 }}
        />
        <NumberInput
          source="sortOrder"
          label="Порядок в разделе"
          min={0}
          fullWidth
          helperText="0 = первый. Меньше число — выше позиция."
          sx={{ mb: 2 }}
        />
      </SimpleForm>
    </Card>
  </Edit>
);
