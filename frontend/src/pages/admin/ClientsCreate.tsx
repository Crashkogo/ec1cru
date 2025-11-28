import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  required,
  minLength,
  maxLength,
} from 'react-admin';

export const ClientsCreate: React.FC = () => (
  <Create>
    <SimpleForm>
      <TextInput
        source="inn"
        label="ИНН"
        validate={[required(), minLength(10), maxLength(12)]}
        fullWidth
      />
      <TextInput source="name" label="Наименование" validate={[required()]} fullWidth />
      <TextInput
        source="password"
        label="Пароль"
        type="password"
        validate={[required(), minLength(6)]}
        fullWidth
      />
      <ReferenceInput source="managerId" reference="employees" label="Менеджер">
        <SelectInput
          optionText={(record) => `${record.firstName} ${record.lastName}`}
          validate={[required()]}
          fullWidth
        />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);
