import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  DeleteButton,
} from 'react-admin';

export const EmployeesList: React.FC = () => (
  <List>
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="firstName" label="Имя" />
      <TextField source="lastName" label="Фамилия" />
      <DateField source="createdAt" label="Создано" showTime />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
