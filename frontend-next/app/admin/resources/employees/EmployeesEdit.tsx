'use client';

import React, { useRef, useState } from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
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

const departmentChoices = [
  { id: '1C',   name: 'Сотрудник 1С' },
  { id: 'TECH', name: 'Сотрудник технического отдела' },
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Компонент загрузки фото сотрудника
const EmployeePhotoUpload = () => {
  const record = useRecordContext();
  const notify  = useNotify();
  const refresh = useRefresh();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  if (!record) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch(`${apiUrl}/api/employees/${record.id}/photo`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Ошибка загрузки');
      }

      notify('Фото успешно загружено', { type: 'success' });
      refresh();
    } catch (error: any) {
      notify(error.message || 'Ошибка при загрузке фото', { type: 'error' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const photoSrc = record.photoUrl
    ? `${process.env.NEXT_PUBLIC_API_URL || ''}${record.photoUrl}`
    : undefined;

  return (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar
        src={photoSrc}
        alt={`${record.firstName} ${record.lastName}`}
        sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 28 }}
      >
        {!photoSrc && `${record.firstName?.charAt(0) || ''}${record.lastName?.charAt(0) || ''}`}
      </Avatar>
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {record.photoUrl ? 'Фотография загружена' : 'Фотография не загружена'}
        </Typography>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={uploading ? <CircularProgress size={16} /> : <CameraIcon style={{ width: 16, height: 16 }} />}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Загрузка...' : 'Загрузить фото'}
          </Button>
          <Typography variant="caption" color="text.secondary">
            JPG, PNG, WEBP · до 5 МБ
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const EditActions = () => (
  <TopToolbar>
    <ListButton />
  </TopToolbar>
);

const EditToolbar = () => (
  <Toolbar>
    <SaveButton />
  </Toolbar>
);

const EmployeeTitle = () => {
  const record = useRecordContext();
  return record ? `Редактирование: ${record.firstName} ${record.lastName}` : 'Редактирование сотрудника';
};

export const EmployeesEdit: React.FC = () => (
  <Edit title={<EmployeeTitle />} actions={<EditActions />}>
    <Card className="p-6">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Редактирование сотрудника
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Измените информацию о сотруднике. Все поля обязательны для заполнения.
        </Typography>
      </Box>

      <SimpleForm toolbar={<EditToolbar />}>
        <EmployeePhotoUpload />
        <TextInput
          source="id"
          label="ID"
          disabled
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextInput
          source="firstName"
          label="Имя"
          validate={[required()]}
          fullWidth
          helperText="Имя сотрудника"
          sx={{ mb: 2 }}
        />
        <TextInput
          source="lastName"
          label="Фамилия"
          validate={[required()]}
          fullWidth
          helperText="Фамилия сотрудника"
          sx={{ mb: 2 }}
        />
        <SelectInput
          source="department"
          label="Направление"
          choices={departmentChoices}
          fullWidth
          helperText="Направление сотрудника (1С или Технический отдел)"
          sx={{ mb: 2 }}
        />
      </SimpleForm>
    </Card>
  </Edit>
);
