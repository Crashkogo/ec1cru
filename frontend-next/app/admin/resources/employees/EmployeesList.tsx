'use client';

import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  DeleteButton,
  CreateButton,
  TopToolbar,
  SearchInput,
  Pagination,
  FunctionField,
  FilterButton,
  useRecordContext
} from 'react-admin';
import { Card, Box } from '@mui/material';
import { PlusIcon, UserIcon } from '@heroicons/react/24/outline';
import { glassCard, filterInputSx, toolbarClass, createBtnClass, filterBtnClass, pageHeaderClass, pageTitleClass, pageSubtitleClass } from '@/admin/adminStyles';

// Кастомный компонент для отображения ФИО сотрудника
const EmployeeNameField = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <div className="flex items-center">
      <Box className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
        <UserIcon className="h-5 w-5 text-blue-600" />
      </Box>
      <div>
        <p className="font-medium text-slate-900">{record.firstName} {record.lastName}</p>
        <p className="text-sm text-slate-500">ID: {record.id}</p>
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
        className="!p-1 !min-w-0 !min-h-0 !text-slate-500 hover:!text-blue-600 hover:!bg-blue-50"
      />
      <DeleteButton
        record={record}
        label=""
        className="!p-1 !min-w-0 !min-h-0 !text-slate-500 hover:!text-red-600 hover:!bg-red-50"
      />
    </div>
  );
};

// Фильтры
const EmployeesFilter = [
  <SearchInput
    source="q"
    placeholder="Поиск по имени и фамилии..."
    alwaysOn
    key="search"
    className="w-full max-w-lg"
    sx={filterInputSx}
  />,
];

// Кастомная панель инструментов
const EmployeesListActions = () => (
  <TopToolbar className={toolbarClass}>
    <div className="flex items-center justify-end w-full px-6">
      <div className="flex items-center space-x-3">
        <FilterButton className={filterBtnClass} />
        <CreateButton
          className={createBtnClass}
          startIcon={<PlusIcon className="h-4 w-4" />}
          label="Добавить сотрудника"
        />
      </div>
    </div>
  </TopToolbar>
);

// Кастомная пагинация
const EmployeesPagination = () => (
  <Pagination
    rowsPerPageOptions={[10, 25, 50, 100]}
    className="!border-t !border-slate-200 !pt-4 !mt-4"
  />
);

export const EmployeesList: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className={pageHeaderClass}>
      <div>
        <h1 className={pageTitleClass}>Сотрудники</h1>
        <p className={pageSubtitleClass}>Управление менеджерами компании</p>
      </div>
    </div>

    {/* Content Card */}
    <Card sx={glassCard}>
      <List
        filters={EmployeesFilter}
        actions={<EmployeesListActions />}
        pagination={<EmployeesPagination />}
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
            label="Сотрудник"
            render={() => <EmployeeNameField />}
          />
          <DateField
            source="createdAt"
            label="Дата создания"
            showTime
            locales="ru-RU"
            className="!text-sm !text-slate-500"
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
