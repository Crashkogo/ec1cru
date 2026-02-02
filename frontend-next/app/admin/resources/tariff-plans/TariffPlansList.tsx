'use client';

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
import { Card } from '@mui/material';
import { PlusIcon } from '@heroicons/react/24/outline';

const ListActions = () => (
  <TopToolbar className="!bg-transparent !shadow-none !border-none !p-0">
    <div className="flex items-center justify-end w-full px-6">
      <CreateButton
        className="!bg-modern-primary-600 hover:!bg-modern-primary-700 !text-white !rounded-lg !px-4 !py-2 !shadow-sm !border-none !min-h-[40px]"
        startIcon={<PlusIcon className="h-4 w-4" />}
        label="Добавить тариф"
      />
    </div>
  </TopToolbar>
);

export const TariffPlansList: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-modern-gray-900">IT-Тарифы</h1>
        <p className="text-modern-gray-600 mt-1">Управление тарифными планами IT-аутсорсинга</p>
      </div>
    </div>

    <Card className="!shadow-sm !border !border-modern-gray-200 !rounded-xl overflow-hidden">
      <List
        actions={<ListActions />}
        title=""
        component="div"
        sx={{
          '& .RaList-main': { padding: 0 },
          '& .RaList-content': { padding: '24px' },
        }}
      >
        <Datagrid bulkActionButtons={false} className="!shadow-none">
          <NumberField source="id" label="ID" />
          <TextField source="name" label="Название" />
          <TextField source="subtitle" label="Подзаголовок" />
          <NumberField source="order" label="Порядок" />
          <BooleanField source="isPublished" label="Опубликован" />
          <EditButton label="" className="!p-1 !min-w-0 !min-h-0" />
          <DeleteButton label="" className="!p-1 !min-w-0 !min-h-0" />
        </Datagrid>
      </List>
    </Card>
  </div>
);
