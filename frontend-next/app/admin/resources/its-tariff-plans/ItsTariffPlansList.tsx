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
import { glassCard, toolbarClass, createBtnClass, pageHeaderClass, pageTitleClass, pageSubtitleClass } from '@/admin/adminStyles';

const ListActions = () => (
  <TopToolbar className={toolbarClass}>
    <div className="flex items-center justify-end w-full px-6">
      <CreateButton
        className={createBtnClass}
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
    <div className={pageHeaderClass}>
      <div>
        <h1 className={pageTitleClass}>ИТС Тарифы</h1>
        <p className={pageSubtitleClass}>Управление тарифными планами 1С:ИТС</p>
      </div>
    </div>

    <Card sx={glassCard}>
      <List
        actions={<ListActions />}
        title=""
        component="div"
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
