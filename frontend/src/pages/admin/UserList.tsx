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
  FunctionField,
  FilterButton,
} from 'react-admin';
import { Card, Chip, Box, IconButton, Tooltip } from '@mui/material';
import {
  PlusIcon,
  FunnelIcon,
  EyeIcon,
  UserIcon,
  ShieldCheckIcon,
  CogIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

// Кастомный компонент для отображения роли
const UserRoleField = () => {
  const record = useRecordContext();
  if (!record) return null;

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return { label: 'Администратор', icon: ShieldCheckIcon, color: 'bg-red-100 text-red-800 border-red-200' };
      case 'MODERATOR':
        return { label: 'Модератор', icon: CogIcon, color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'EVENTORG':
        return { label: 'Организатор событий', icon: UsersIcon, color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'CLINE':
        return { label: 'Клиент', icon: UserIcon, color: 'bg-green-100 text-green-800 border-green-200' };
      case 'ITS':
        return { label: 'ИТ-специалист', icon: ComputerDesktopIcon, color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'DEVDEP':
        return { label: 'Разработчик', icon: WrenchScrewdriverIcon, color: 'bg-orange-100 text-orange-800 border-orange-200' };
      default:
        return { label: 'Пользователь', icon: UserIcon, color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  const roleConfig = getRoleConfig(record.role);
  const IconComponent = roleConfig.icon;

  return (
    <Chip
      icon={<IconComponent className="h-4 w-4" />}
      label={roleConfig.label}
      size="small"
      className={roleConfig.color}
    />
  );
};

// Кастомный компонент для отображения пользователя
const UserNameField = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <div className="flex items-center">
      <Box className="w-10 h-10 bg-modern-primary-100 rounded-full flex items-center justify-center mr-3">
        <UserIcon className="h-5 w-5 text-modern-primary-600" />
      </Box>
      <div>
        <p className="font-medium text-modern-gray-900">{record.name}</p>
        <p className="text-sm text-modern-gray-500">{record.email}</p>
      </div>
    </div>
  );
};

// Кастомный компонент для действий
const ActionButtons = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <div className="flex items-center space-x-2">
      <Tooltip title="Просмотреть">
        <IconButton size="small" className="text-modern-gray-600 hover:text-modern-primary-600 hover:bg-modern-primary-50">
          <ShowButton
            record={record}
            className="!p-0 !min-w-0 !bg-transparent !text-inherit hover:!bg-transparent"
          />
        </IconButton>
      </Tooltip>
      <Tooltip title="Редактировать">
        <IconButton size="small" className="text-modern-gray-600 hover:text-modern-primary-600 hover:bg-modern-primary-50">
          <EditButton
            record={record}
            className="!p-0 !min-w-0 !bg-transparent !text-inherit hover:!bg-transparent"
          />
        </IconButton>
      </Tooltip>
      <Tooltip title="Удалить">
        <IconButton size="small" className="text-modern-gray-600 hover:text-red-600 hover:bg-red-50">
          <DeleteButton
            record={record}
            className="!p-0 !min-w-0 !bg-transparent !text-inherit hover:!bg-transparent"
          />
        </IconButton>
      </Tooltip>
    </div>
  );
};

// Фильтры
const UsersFilter = [
  <SearchInput
    source="q"
    placeholder="Поиск по имени и email..."
    alwaysOn
    key="search"
    className="w-full max-w-lg"
    sx={{
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
    key="role"
    sx={{
      '& .MuiFormControl-root': {
        minWidth: '200px',
      },
    }}
  />,
];

// Кастомная панель инструментов
const UsersListActions = () => (
  <TopToolbar className="!bg-transparent !shadow-none !border-none !p-0">
    <div className="flex items-center justify-end w-full px-6">
      <div className="flex items-center space-x-3">
        <FilterButton
          className="!bg-white !text-modern-gray-700 !border !border-modern-gray-300 hover:!bg-modern-gray-50 !rounded-lg !px-4 !py-2 !shadow-sm !min-h-[40px]"
        />
        <CreateButton
          className="!bg-modern-primary-600 hover:!bg-modern-primary-700 !text-white !rounded-lg !px-4 !py-2 !shadow-sm !border-none !min-h-[40px]"
          startIcon={<PlusIcon className="h-4 w-4" />}
          label="Добавить пользователя"
        />
      </div>
    </div>
  </TopToolbar>
);

// Кастомная пагинация
const UsersPagination = () => (
  <Pagination
    rowsPerPageOptions={[10, 25, 50, 100]}
    className="!border-t !border-modern-gray-200 !pt-4 !mt-4"
  />
);

export const UserList = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-modern-gray-900">Пользователи</h1>
        <p className="text-modern-gray-600 mt-1">Управление пользователями системы</p>
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
          paddingLeft: '24px',
          paddingRight: '24px',
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
        filters={UsersFilter}
        actions={<UsersListActions />}
        pagination={<UsersPagination />}
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
            label="Пользователь"
            render={() => <UserNameField />}
          />
          <TextField
            source="phone"
            label="Телефон"
            className="!text-sm !text-modern-gray-600"
          />
          <FunctionField
            label="Роль"
            render={() => <UserRoleField />}
          />
          <DateField
            source="createdAt"
            label="Дата регистрации"
            showTime
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