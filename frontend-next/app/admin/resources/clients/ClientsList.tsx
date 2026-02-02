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
    sx={{
      marginLeft: '12px',
      '& .MuiInputBase-root': {
        backgroundColor: 'background.paper',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        '&:hover': {
          borderColor: '#3b82f6',
        },
        '&.Mui-focused': {
          borderColor: '#3b82f6',
          boxShadow: '0 0 0 3px rgb(59 130 246 / 0.1)',
        },
      },
      '& .MuiInputBase-input': {
        padding: '12px 16px',
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
        '&::placeholder': {
          color: '#6b7280',
          opacity: 1,
        },
      },
    }}
  />,
];

// Кастомная панель инструментов
const ClientsListActions = () => (
  <TopToolbar className="!bg-transparent !shadow-none !border-none !p-0">
    <div className="flex items-center justify-end w-full px-6">
      <div className="flex items-center space-x-3">
        <FilterButton
          className="!bg-white !text-modern-gray-700 !border !border-modern-gray-300 hover:!bg-modern-gray-50 !rounded-lg !px-4 !py-2 !shadow-sm !min-h-[40px]"
        />
        <CreateButton
          className="!bg-modern-primary-600 hover:!bg-modern-primary-700 !text-white !rounded-lg !px-4 !py-2 !shadow-sm !border-none !min-h-[40px]"
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
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-modern-gray-900">Клиенты</h1>
        <p className="text-modern-gray-600 mt-1">Управление клиентами и их личными кабинетами</p>
      </div>
    </div>

    {/* Content Card */}
    <Card
      className="!shadow-sm !border !border-modern-gray-200 !rounded-xl overflow-hidden"
      sx={{
        '& .RaList-main': {
          padding: 0,
        },
        '& .RaList-content': {
          padding: '24px',
        },
        '& .RaList-actions': {
          paddingBottom: '20px',
          paddingTop: '8px',
        },
        '& .RaFilterForm-form': {
          paddingBottom: '20px',
          paddingLeft: '32px',
          paddingRight: '32px',
          backgroundColor: '#f8fafc',
          marginLeft: '-24px',
          marginRight: '-24px',
          marginTop: '-24px',
          paddingTop: '20px',
        },
        '& .MuiTableContainer-root': {
          borderRadius: '0px',
          border: 'none',
          boxShadow: 'none',
        },
        '& .MuiTable-root': {
          borderCollapse: 'separate',
          borderSpacing: 0,
        },
        '& .MuiTableHead-root': {
          backgroundColor: '#f8fafc',
        },
        '& .MuiTableCell-head': {
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e5e7eb',
          fontWeight: 600,
          fontSize: '14px',
          color: '#374151',
          padding: '16px',
        },
        '& .MuiTableCell-body': {
          borderBottom: '1px solid #f3f4f6',
          padding: '16px',
          fontSize: '14px',
          color: '#1f2937',
        },
        '& .MuiTableRow-root:hover': {
          backgroundColor: '#f8fafc',
        },
      }}
    >
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
