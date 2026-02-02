'use client';

import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  required,
  SaveButton,
  Toolbar,
  ListButton,
  TopToolbar,
} from 'react-admin';
import { Card, Typography, Box } from '@mui/material';

const UserCreateToolbar = () => (
  <Toolbar>
    <SaveButton />
  </Toolbar>
);

const UserCreateActions = () => (
  <TopToolbar>
    <ListButton />
  </TopToolbar>
);

export const UserCreate = () => (
  <Create
    title="Создание пользователя"
    actions={<UserCreateActions />}
  >
    <Card className="p-6">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Добавление нового пользователя
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Заполните информацию о пользователе. Все поля обязательны для заполнения.
        </Typography>
      </Box>

      <SimpleForm toolbar={<UserCreateToolbar />}>
        <TextInput
          source="name"
          label="Имя пользователя"
          validate={required()}
          fullWidth
          helperText="Введите полное имя пользователя"
          sx={{ mb: 2 }}
        />

        <TextInput
          source="password"
          type="password"
          label="Пароль"
          validate={required()}
          fullWidth
          helperText="Введите надежный пароль"
          sx={{ mb: 2 }}
        />

        <SelectInput
          source="role"
          label="Роль пользователя"
          validate={required()}
          fullWidth
          choices={[
            { id: 'ADMIN', name: 'Администратор' },
            { id: 'MODERATOR', name: 'Модератор' },
            { id: 'EVENTORG', name: 'Организатор событий' },
            { id: 'CLINE', name: 'Клиент' },
            { id: 'ITS', name: 'ИТ-специалист' },
            { id: 'DEVDEP', name: 'Разработчик' },
          ]}
          helperText="Выберите роль пользователя в системе"
          sx={{ mb: 2 }}
        />
      </SimpleForm>
    </Card>
  </Create>
);
