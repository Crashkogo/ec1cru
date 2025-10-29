import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  EditButton,
  DeleteButton,
  NumberField,
  CreateButton,
  TopToolbar
} from 'react-admin';

const ListActions = () => (
  <TopToolbar>
    <CreateButton />
  </TopToolbar>
);

export const TariffPlansList: React.FC = () => (
  <List actions={<ListActions />}>
    <Datagrid>
      <NumberField source="id" label="ID" />
      <TextField source="name" label="Название" />
      <TextField source="subtitle" label="Подзаголовок" />
      <NumberField source="order" label="Порядок" />
      <BooleanField source="isPublished" label="Опубликован" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
