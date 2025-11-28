import React from 'react';
import { Edit, SimpleForm, TextInput, required } from 'react-admin';

export const EmployeesEdit: React.FC = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" label="ID" disabled fullWidth />
      <TextInput source="firstName" label="Имя" validate={[required()]} fullWidth />
      <TextInput source="lastName" label="Фамилия" validate={[required()]} fullWidth />
    </SimpleForm>
  </Edit>
);
