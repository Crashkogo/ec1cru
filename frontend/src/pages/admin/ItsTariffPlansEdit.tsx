import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  ArrayInput,
  SimpleFormIterator,
  required
} from 'react-admin';

export const ItsTariffPlansEdit: React.FC = () => (
  <Edit>
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
  </Edit>
);
