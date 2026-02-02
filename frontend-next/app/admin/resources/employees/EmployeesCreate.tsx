'use client';

import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  required,
  ListButton,
  TopToolbar,
  SaveButton,
  Toolbar
} from 'react-admin';
import { Card, Typography, Box } from '@mui/material';

const CreateActions = () => (
  <TopToolbar>
    <ListButton />
  </TopToolbar>
);

const CreateToolbar = () => (
  <Toolbar>
    <SaveButton />
  </Toolbar>
);

export const EmployeesCreate: React.FC = () => (
  <Create title="Добавление сотрудника" actions={<CreateActions />}>
    <Card className="p-6">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Новый сотрудник
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Добавьте менеджера компании. Все поля обязательны для заполнения.
        </Typography>
      </Box>

      <SimpleForm toolbar={<CreateToolbar />}>
        <TextInput
          source="firstName"
          label="Имя"
          validate={[required()]}
          fullWidth
          helperText="Введите имя сотрудника"
          sx={{ mb: 2 }}
        />
        <TextInput
          source="lastName"
          label="Фамилия"
          validate={[required()]}
          fullWidth
          helperText="Введите фамилию сотрудника"
          sx={{ mb: 2 }}
        />
      </SimpleForm>
    </Card>
  </Create>
);
