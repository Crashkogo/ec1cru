'use client';

import {
  List,
  Datagrid,
  TextField,
  DateField,
  CreateButton,
  TopToolbar,
  SearchInput,
  EditButton,
  DeleteButton,
  ShowButton,
  Pagination,
  useRecordContext,
  SelectInput,
  FunctionField,
  FilterButton,
} from 'react-admin';
import { Card, Chip, Box } from '@mui/material';
import {
  PlusIcon,
  UserIcon,
  ShieldCheckIcon,
  CogIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import { glassCard, filterInputSx, toolbarClass, createBtnClass, filterBtnClass, pageHeaderClass, pageTitleClass, pageSubtitleClass } from '@/app/admin/adminStyles';

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
      <Box className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
        <UserIcon className="h-5 w-5 text-blue-600" />
      </Box>
      <div>
        <p className="font-medium text-slate-900">{record.name}</p>
        <p className="text-sm text-slate-500">{record.email}</p>
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
      <ShowButton
        record={record}
        label=""
        className="!p-1 !min-w-0 !min-h-0 !text-slate-500 hover:!text-blue-600 hover:!bg-blue-50"
      />
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
const UsersFilter = [
  <SearchInput
    source="q"
    placeholder="Поиск по имени и email..."
    alwaysOn
    key="search"
    className="w-full max-w-lg"
    sx={filterInputSx}
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
  <TopToolbar className={toolbarClass}>
    <div className="flex items-center justify-end w-full px-6">
      <div className="flex items-center space-x-3">
        <FilterButton className={filterBtnClass} />
        <CreateButton
          className={createBtnClass}
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
    className="!border-t !border-slate-200 !pt-4 !mt-4"
  />
);

export const UserList = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className={pageHeaderClass}>
      <div>
        <h1 className={pageTitleClass}>Пользователи</h1>
        <p className={pageSubtitleClass}>Управление пользователями системы</p>
      </div>
    </div>

    {/* Content Card */}
    <Card sx={glassCard}>
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
            className="!text-sm !text-slate-500"
          />
          <FunctionField
            label="Роль"
            render={() => <UserRoleField />}
          />
          <DateField
            source="createdAt"
            label="Дата регистрации"
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
