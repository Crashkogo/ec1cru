'use client';

import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  required,
  minLength,
  maxLength,
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

export const ClientsCreate: React.FC = () => (
  <Create title="Добавление клиента" actions={<CreateActions />}>
    <Card className="p-6">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Новый клиент
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Создайте личный кабинет для клиента. Все поля обязательны для заполнения.
        </Typography>
      </Box>

      <SimpleForm toolbar={<CreateToolbar />}>
        <TextInput
          source="inn"
          label="ИНН"
          validate={[required(), minLength(10), maxLength(12)]}
          fullWidth
          helperText="ИНН используется для входа в личный кабинет (10 или 12 цифр)"
          sx={{ mb: 2 }}
        />
        <TextInput
          source="name"
          label="Наименование организации"
          validate={[required()]}
          fullWidth
          helperText="Полное наименование организации клиента"
          sx={{ mb: 2 }}
        />
        <TextInput
          source="password"
          label="Пароль"
          type="password"
          validate={[required(), minLength(6)]}
          fullWidth
          helperText="Пароль для входа в личный кабинет (минимум 6 символов)"
          sx={{ mb: 2 }}
        />
        <ReferenceInput source="managerId" reference="employees" label="Менеджер">
          <SelectInput
            optionText={(record: any) => `${record.firstName} ${record.lastName}`}
            validate={[required()]}
            fullWidth
            helperText="Выберите закрепленного менеджера"
            sx={{ mb: 2 }}
          />
        </ReferenceInput>
      </SimpleForm>
    </Card>
  </Create>
);
