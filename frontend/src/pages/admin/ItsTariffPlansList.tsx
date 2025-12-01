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
  TopToolbar,
  FunctionField
} from 'react-admin';

const ListActions = () => (
  <TopToolbar>
    <CreateButton />
  </TopToolbar>
);

interface ItsTariffPlan {
  id: number;
  title: string;
  rows: Array<{
    text: string;
    color: string;
    isBold: boolean;
  }>;
  order: number;
  isPublished: boolean;
}

export const ItsTariffPlansList: React.FC = () => (
  <List actions={<ListActions />}>
    <Datagrid>
      <NumberField source="id" label="ID" />
      <TextField source="title" label="Название" />
      <FunctionField
        label="Количество строк"
        render={(record: ItsTariffPlan) => record.rows?.length || 0}
      />
      <NumberField source="order" label="Порядок" />
      <BooleanField source="isPublished" label="Опубликован" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
