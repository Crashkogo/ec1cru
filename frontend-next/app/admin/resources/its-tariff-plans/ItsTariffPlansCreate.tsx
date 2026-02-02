'use client';

import React from 'react';
import {
  Create,
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

const CreateActions = () => (
  <TopToolbar>
    <ListButton />
  </TopToolbar>
);

export const ItsTariffPlansCreate: React.FC = () => (
  <Create title="Создание тарифа ИТС" actions={<CreateActions />}>
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

        <NumberInput source="order" label="Порядок отображения" defaultValue={0} />
        <BooleanInput source="isPublished" label="Опубликован" defaultValue={true} />
      </SimpleForm>
    </Card>
  </Create>
);
