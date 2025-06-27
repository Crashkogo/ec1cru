import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  CreateButton,
  TopToolbar,
  SearchInput,
  FilterForm,
  EditButton,
  DeleteButton,
  ShowButton,
  BulkDeleteButton,
  BulkExportButton,
  Pagination,
  useRecordContext,
  SelectInput,
} from 'react-admin';
import { Card, Chip, Box } from '@mui/material';

const UsersFilter = () => (
  <FilterForm>
    <SearchInput source="q" placeholder="Поиск по имени" alwaysOn />
    <SelectInput
      source="role"
      label="Роль"
      choices={[
        { id: 'ADMIN', name: 'Администратор' },
        { id: 'MODERATOR', name: 'Модератор' },
        { id: 'EVENTORG', name: 'Организатор событий' },
        { id: 'CLINE', name: 'Клиент' },
        { id: 'ITS', name: 'ИТ-специалист' },
        { id: 'DEVDEP', name: 'Разработчик' },
      ]}
      emptyText="Все роли"
      alwaysOn
    />
  </FilterForm>
);

const UsersListActions = () => (
  <TopToolbar>
    <CreateButton />
  </TopToolbar>
);

const UsersPagination = () => <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />;

const UsersBulkActionButtons = () => (
  <>
    <BulkExportButton />
    <BulkDeleteButton />
  </>
);

const RoleField = () => {
  const record = useRecordContext();
  if (!record) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return { bgcolor: '#f44336', color: 'white' }; // красный
      case 'MODERATOR':
        return { bgcolor: '#ff9800', color: 'white' }; // оранжевый
      case 'EVENTORG':
        return { bgcolor: '#2196f3', color: 'white' }; // синий
      case 'CLINE':
        return { bgcolor: '#4caf50', color: 'white' }; // зеленый
      case 'ITS':
        return { bgcolor: '#9c27b0', color: 'white' }; // фиолетовый
      case 'DEVDEP':
        return { bgcolor: '#607d8b', color: 'white' }; // серый
      default:
        return { bgcolor: '#757575', color: 'white' }; // серый по умолчанию
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Администратор';
      case 'MODERATOR': return 'Модератор';
      case 'EVENTORG': return 'Организатор событий';
      case 'CLINE': return 'Клиент';
      case 'ITS': return 'ИТ-специалист';
      case 'DEVDEP': return 'Разработчик';
      default: return role;
    }
  };

  return (
    <Chip
      label={getRoleName(record.role)}
      size="small"
      sx={{
        fontSize: '0.75rem',
        fontWeight: 'bold',
        ...getRoleColor(record.role)
      }}
    />
  );
};

export const UserList = () => (
  <Card className="p-6">
    <List
      filters={<UsersFilter />}
      actions={<UsersListActions />}
      pagination={<UsersPagination />}
      perPage={25}
      sort={{ field: 'name', order: 'ASC' }}
      title="Управление пользователями"
    >
      <Datagrid
        bulkActionButtons={<UsersBulkActionButtons />}
        sx={{
          '& .RaDatagrid-headerCell': {
            fontWeight: 'bold',
          },
          '& .RaDatagrid-rowCell': {
            paddingY: 1,
          },
        }}
      >
        <TextField source="id" label="ID" />
        <TextField source="name" label="Имя пользователя" />
        <RoleField label="Роль" />
        <DateField
          source="createdAt"
          label="Дата создания"
          locales="ru-RU"
          showTime
        />
        <ShowButton />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  </Card>
);