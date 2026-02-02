'use client';

import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  ArrayInput,
  SimpleFormIterator,
  required,
  ListButton,
  TopToolbar
} from 'react-admin';
import { Card } from '@mui/material';

const EditActions = () => (
  <TopToolbar>
    <ListButton />
  </TopToolbar>
);

export const ItsTariffPlansEdit: React.FC = () => (
  <Edit title="Редактирование тарифа ИТС" actions={<EditActions />}>
    <Card className="p-6">
      <SimpleForm>
        <TextInput source="title" label="Название тарифа" validate={required()} fullWidth />

        <ArrayInput source="rows" label="Строки тарифа">
          <SimpleFormIterator inline>
            <TextInput source="text" label="Текст" validate={required()} fullWidth />
            <TextInput
              source="color"
              label="Цвет текста"
              type="color"
              defaultValue="#000000"
              helperText="Выберите цвет текста"
            />
            <BooleanInput source="isBold" label="Жирный шрифт" defaultValue={false} />
          </SimpleFormIterator>
        </ArrayInput>

        <NumberInput source="order" label="Порядок отображения" />
        <BooleanInput source="isPublished" label="Опубликован" />
      </SimpleForm>
    </Card>
  </Edit>
);
