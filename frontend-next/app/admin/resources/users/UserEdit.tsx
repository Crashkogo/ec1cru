'use client';

import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  required,
  SaveButton,
  Toolbar,
  ListButton,
  TopToolbar,
  useRecordContext,
} from 'react-admin';
import { Card, Typography, Box } from '@mui/material';

const UserEditToolbar = () => (
  <Toolbar>
    <SaveButton />
  </Toolbar>
);

const UserEditActions = () => (
  <TopToolbar>
    <ListButton />
  </TopToolbar>
);

const UserTitle = () => {
  const record = useRecordContext();
  return record ? `Редактирование: ${record.name}` : 'Редактирование пользователя';
};

export const UserEdit = () => (
  <Edit
    title={<UserTitle />}
    actions={<UserEditActions />}
  >
    <Card className="p-6">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Редактирование пользователя
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Измените информацию о пользователе. Оставьте поле пароля пустым, если не хотите его менять.
        </Typography>
      </Box>

      <SimpleForm toolbar={<UserEditToolbar />}>
        <TextInput
          source="name"
          label="Имя пользователя"
          validate={required()}
          fullWidth
          helperText="Полное имя пользователя"
          sx={{ mb: 2 }}
        />

        <TextInput
          source="password"
          type="password"
          label="Новый пароль"
          fullWidth
          helperText="Оставьте пустым, чтобы не менять пароль"
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
          helperText="Роль пользователя в системе"
          sx={{ mb: 2 }}
        />
      </SimpleForm>
    </Card>
  </Edit>
);
