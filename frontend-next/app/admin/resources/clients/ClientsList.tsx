'use client';

import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  DeleteButton,
  ReferenceField,
  CreateButton,
  TopToolbar,
  SearchInput,
  Pagination,
  FunctionField,
  FilterButton,
  useRecordContext
} from 'react-admin';
import { Card, Box } from '@mui/material';
import { PlusIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { glassCard, filterInputSx, toolbarClass, createBtnClass, filterBtnClass, pageHeaderClass, pageTitleClass, pageSubtitleClass } from '@/admin/adminStyles';

// Кастомный компонент для отображения клиента
const ClientNameField = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <div className="flex items-center">
      <Box className="w-10 h-10 bg-modern-primary-100 rounded-lg flex items-center justify-center mr-3">
        <BuildingOfficeIcon className="h-5 w-5 text-modern-primary-600" />
      </Box>
      <div>
        <p className="font-medium text-modern-gray-900">{record.name}</p>
        <p className="text-sm text-modern-gray-500">ИНН: {record.inn}</p>
      </div>
    </div>
  );
};

// Кастомный компонент для действий
const ActionButtons = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <div className="flex items-center space-x-1">
      <EditButton
        record={record}
        label=""
        className="!p-1 !min-w-0 !min-h-0 !text-modern-gray-600 hover:!text-modern-primary-600 hover:!bg-modern-primary-50"
      />
      <DeleteButton
        record={record}
        label=""
        className="!p-1 !min-w-0 !min-h-0 !text-modern-gray-600 hover:!text-red-600 hover:!bg-red-50"
      />
    </div>
  );
};

// Фильтры
const ClientsFilter = [
  <SearchInput
    source="q"
    placeholder="Поиск по названию и ИНН..."
    alwaysOn
    key="search"
    className="w-full max-w-lg"
    sx={filterInputSx}
  />,
];

// Кастомная панель инструментов
const ClientsListActions = () => (
  <TopToolbar className={toolbarClass}>
    <div className="flex items-center justify-end w-full px-6">
      <div className="flex items-center space-x-3">
        <FilterButton className={filterBtnClass} />
        <CreateButton
          className={createBtnClass}
          startIcon={<PlusIcon className="h-4 w-4" />}
          label="Добавить клиента"
        />
      </div>
    </div>
  </TopToolbar>
);

// Кастомная пагинация
const ClientsPagination = () => (
  <Pagination
    rowsPerPageOptions={[10, 25, 50, 100]}
    className="!border-t !border-modern-gray-200 !pt-4 !mt-4"
  />
);

export const ClientsList: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className={pageHeaderClass}>
      <div>
        <h1 className={pageTitleClass}>Клиенты</h1>
        <p className={pageSubtitleClass}>Управление клиентами и их личными кабинетами</p>
      </div>
    </div>

    {/* Content Card */}
    <Card sx={glassCard}>
      <List
        filters={ClientsFilter}
        actions={<ClientsListActions />}
        pagination={<ClientsPagination />}
        perPage={25}
        sort={{ field: 'createdAt', order: 'DESC' }}
        title=""
        component="div"
      >
        <Datagrid
          bulkActionButtons={false}
          className="!shadow-none"
        >
          <FunctionField
            label="Клиент"
            render={() => <ClientNameField />}
          />
          <ReferenceField source="managerId" reference="employees" label="Менеджер">
            <FunctionField
              render={(record: any) => (
                <span className="text-sm text-modern-gray-700">
                  {record.firstName} {record.lastName}
                </span>
              )}
            />
          </ReferenceField>
          <DateField
            source="createdAt"
            label="Дата создания"
            showTime
            locales="ru-RU"
            className="!text-sm !text-modern-gray-600"
          />
          <FunctionField
            label="Действия"
            render={() => <ActionButtons />}
          />
        </Datagrid>
      </List>
    </Card>
  </div>
);
