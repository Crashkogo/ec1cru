import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  required
} from 'react-admin';
import { TariffTableEditor } from '../../admin/components/TariffTableEditor';

export const TariffPlansEdit: React.FC = () => (
  <Edit>
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
  </Edit>
);
