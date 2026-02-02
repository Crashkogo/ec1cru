'use client';

import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  required,
  ListButton,
  TopToolbar,
  SaveButton,
  Toolbar,
  useRecordContext
} from 'react-admin';
import { Card, Typography, Box } from '@mui/material';

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
      </SimpleForm>
    </Card>
  </Edit>
);
