import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  DeleteButton,
  ReferenceField,
} from 'react-admin';

export const ClientsList: React.FC = () => (
  <List>
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="inn" label="ИНН" />
      <TextField source="name" label="Наименование" />
      <ReferenceField source="managerId" reference="employees" label="Менеджер">
        <TextField source="firstName" />
      </ReferenceField>
      <DateField source="createdAt" label="Создано" showTime />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
