import React from 'react';
import { Create, SimpleForm, TextInput, required } from 'react-admin';

export const EmployeesCreate: React.FC = () => (
  <Create>
    <SimpleForm>
      <TextInput source="firstName" label="Имя" validate={[required()]} fullWidth />
      <TextInput source="lastName" label="Фамилия" validate={[required()]} fullWidth />
    </SimpleForm>
  </Create>
);
