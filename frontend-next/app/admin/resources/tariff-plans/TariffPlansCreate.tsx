'use client';

import React from 'react';
import {
  Create,
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
import { formCard, pageHeaderClass, pageTitleClass, pageSubtitleClass, toolbarClass } from '@/app/admin/adminStyles';

const CreateActions = () => (
  <TopToolbar className={toolbarClass}>
    <ListButton />
  </TopToolbar>
);

export const TariffPlansCreate: React.FC = () => (
  <Create title="Создание тарифного плана" actions={<CreateActions />}>
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

        <NumberInput source="order" label="Порядок отображения" defaultValue={0} />
        <BooleanInput source="isPublished" label="Опубликован" defaultValue={true} />
      </SimpleForm>
    </Card>
  </Create>
);
