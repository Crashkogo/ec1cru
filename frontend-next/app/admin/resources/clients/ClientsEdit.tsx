'use client';

import React from 'react';
import {
  Edit,
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

const ClientTitle = () => {
  const record = useRecordContext();
  return record ? `Редактирование: ${record.name}` : 'Редактирование клиента';
};

export const ClientsEdit: React.FC = () => (
  <Edit title={<ClientTitle />} actions={<EditActions />}>
    <Card className="p-6">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Редактирование клиента
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Измените информацию о клиенте. Оставьте поле пароля пустым, если не хотите его менять.
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
          label="Новый пароль"
          type="password"
          fullWidth
          helperText="Оставьте пустым, чтобы не менять пароль"
          sx={{ mb: 2 }}
        />
        <ReferenceInput source="managerId" reference="employees" label="Менеджер">
          <SelectInput
            optionText={(record: any) => `${record.firstName} ${record.lastName}`}
            validate={[required()]}
            fullWidth
            helperText="Закрепленный менеджер"
            sx={{ mb: 2 }}
          />
        </ReferenceInput>
      </SimpleForm>
    </Card>
  </Edit>
);
