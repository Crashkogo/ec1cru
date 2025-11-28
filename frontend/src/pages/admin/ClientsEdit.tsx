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
} from 'react-admin';

export const ClientsEdit: React.FC = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" label="ID" disabled fullWidth />
      <TextInput
        source="inn"
        label="ИНН"
        validate={[required(), minLength(10), maxLength(12)]}
        fullWidth
      />
      <TextInput source="name" label="Наименование" validate={[required()]} fullWidth />
      <TextInput
        source="password"
        label="Новый пароль (оставьте пустым, чтобы не менять)"
        type="password"
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
  </Edit>
);
