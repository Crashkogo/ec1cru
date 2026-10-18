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
import { glassCard, toolbarClass, createBtnClass, pageHeaderClass, pageTitleClass, pageSubtitleClass } from '@/app/admin/adminStyles';

const ListActions = () => (
  <TopToolbar className={toolbarClass}>
    <div className="flex items-center justify-end w-full px-6">
      <CreateButton
        className={createBtnClass}
        startIcon={<PlusIcon className="h-4 w-4" />}
        label="Добавить тариф"
      />
    </div>
  </TopToolbar>
);

export const TariffPlansList: React.FC = () => (
  <div className="space-y-6">
    <div className={pageHeaderClass}>
      <div>
        <h1 className={pageTitleClass}>IT-Тарифы</h1>
        <p className={pageSubtitleClass}>Управление тарифными планами IT-аутсорсинга</p>
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
