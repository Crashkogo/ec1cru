import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  required
} from 'react-admin';
import { TariffTableEditor } from '../../admin/components/TariffTableEditor';

export const TariffPlansCreate: React.FC = () => (
  <Create>
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
  </Create>
);
