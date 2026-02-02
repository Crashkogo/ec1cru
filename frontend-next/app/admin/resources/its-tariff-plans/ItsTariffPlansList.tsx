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
  TopToolbar,
  FunctionField
} from 'react-admin';
import { Card } from '@mui/material';
import { PlusIcon } from '@heroicons/react/24/outline';

const ListActions = () => (
  <TopToolbar className="!bg-transparent !shadow-none !border-none !p-0">
    <div className="flex items-center justify-end w-full px-6">
      <CreateButton
        className="!bg-modern-primary-600 hover:!bg-modern-primary-700 !text-white !rounded-lg !px-4 !py-2 !shadow-sm !border-none !min-h-[40px]"
        startIcon={<PlusIcon className="h-4 w-4" />}
        label="Добавить тариф ИТС"
      />
    </div>
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
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-modern-gray-900">ИТС Тарифы</h1>
        <p className="text-modern-gray-600 mt-1">Управление тарифными планами 1С:ИТС</p>
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
          <TextField source="title" label="Название" />
          <FunctionField
            label="Количество строк"
            render={(record: ItsTariffPlan) => record.rows?.length || 0}
          />
          <NumberField source="order" label="Порядок" />
          <BooleanField source="isPublished" label="Опубликован" />
          <EditButton label="" className="!p-1 !min-w-0 !min-h-0" />
          <DeleteButton label="" className="!p-1 !min-w-0 !min-h-0" />
        </Datagrid>
      </List>
    </Card>
  </div>
);
