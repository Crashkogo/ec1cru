'use client';

import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  required,
  ListButton,
  TopToolbar,
  SaveButton,
  Toolbar
} from 'react-admin';

const departmentChoices = [
  { id: '1C',   name: 'Сотрудник 1С' },
  { id: 'TECH', name: 'Сотрудник технического отдела' },
];
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
        <SelectInput
          source="department"
          label="Направление"
          choices={departmentChoices}
          fullWidth
          helperText="Выберите направление сотрудника"
          sx={{ mb: 2 }}
        />
      </SimpleForm>
    </Card>
  </Create>
);
