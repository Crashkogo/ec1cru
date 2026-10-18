'use client';

import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  required,
  ListButton,
  TopToolbar
} from 'react-admin';
import { Card } from '@mui/material';
import { TariffTableEditor } from '@/components/admin/TariffTableEditor';
import { formCard, toolbarClass } from '@/app/admin/adminStyles';

const EditActions = () => (
  <TopToolbar className={toolbarClass}>
    <ListButton />
  </TopToolbar>
);

export const TariffPlansEdit: React.FC = () => (
  <Edit title="Редактирование тарифного плана" actions={<EditActions />}>
    <Card sx={formCard}>
      <SimpleForm>
        <TextInput source="name" label="Название тарифа" validate={required()} fullWidth />
        <TextInput source="subtitle" label="Подзаголовок" fullWidth />

        <TariffTableEditor />

        <TextInput
          source="footnote"
          label="Примечание под таблицей"
          multiline
          rows={3}
          fullWidth
          helperText="Например: * Цена указана в рублях за 1 месяц. Время расчета с 8 рабочих часов."
        />

        <NumberInput source="order" label="Порядок отображения" />
        <BooleanInput source="isPublished" label="Опубликован" />
      </SimpleForm>
    </Card>
  </Edit>
);
