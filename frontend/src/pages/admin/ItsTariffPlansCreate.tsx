import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  ArrayInput,
  SimpleFormIterator,
  required
} from 'react-admin';

export const ItsTariffPlansCreate: React.FC = () => (
  <Create>
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
  </Create>
);
