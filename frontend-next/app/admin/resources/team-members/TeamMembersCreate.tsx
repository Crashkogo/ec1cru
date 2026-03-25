'use client';

import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  NumberInput,
  required,
  ListButton,
  TopToolbar,
  SaveButton,
  Toolbar,
} from 'react-admin';
import { Card, Typography, Box } from '@mui/material';

const sectionChoices = [
  { id: 'MANAGERS',       name: 'Менеджеры' },
  { id: 'CONSULTATION',   name: 'Сектор Линия консультаций' },
  { id: 'ITS',            name: 'Сектор ИТС' },
  { id: 'IMPLEMENTATION', name: 'Сектор Внедрения' },
  { id: 'TECH',           name: 'Технический отдел' },
];

const CreateActions = () => (
  <TopToolbar><ListButton /></TopToolbar>
);

const CreateToolbar = () => (
  <Toolbar><SaveButton /></Toolbar>
);

export const TeamMembersCreate: React.FC = () => (
  <Create title="Добавление сотрудника" actions={<CreateActions />}>
    <Card className="p-6">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Новый сотрудник</Typography>
        <Typography variant="body2" color="text.secondary">
          После сохранения перейдите в редактирование для загрузки фотографии.
        </Typography>
      </Box>
      <SimpleForm toolbar={<CreateToolbar />}>
        <TextInput source="firstName" label="Имя"     validate={[required()]} fullWidth sx={{ mb: 2 }} />
        <TextInput source="lastName"  label="Фамилия" validate={[required()]} fullWidth sx={{ mb: 2 }} />
        <TextInput
          source="position"
          label="Должность (свободный текст)"
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
          defaultValue={0}
          min={0}
          fullWidth
          helperText="0 = первый. Меньше число — выше позиция."
          sx={{ mb: 2 }}
        />
      </SimpleForm>
    </Card>
  </Create>
);
