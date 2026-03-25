'use client';

import React from 'react';
import {
  List,
  Datagrid,
  NumberField,
  DateField,
  EditButton,
  DeleteButton,
  CreateButton,
  TopToolbar,
  SearchInput,
  Pagination,
  FunctionField,
  useRecordContext,
  SelectInput,
} from 'react-admin';
import { Card, Avatar } from '@mui/material';
import { PlusIcon } from '@heroicons/react/24/outline';

const sectionLabels: Record<string, string> = {
  MANAGERS:       'Менеджеры',
  CONSULTATION:   'Сектор Линия консультаций',
  ITS:            'Сектор ИТС',
  IMPLEMENTATION: 'Сектор Внедрения',
  TECH:           'Технический отдел',
};

const MemberNameField = () => {
  const record = useRecordContext();
  if (!record) return null;
  const photoSrc = record.photoUrl
    ? `${process.env.NEXT_PUBLIC_API_URL || ''}${record.photoUrl}`
    : undefined;
  return (
    <div className="flex items-center gap-3">
      <Avatar src={photoSrc} sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontSize: 16 }}>
        {!photoSrc && `${record.firstName?.charAt(0) || ''}${record.lastName?.charAt(0) || ''}`}
      </Avatar>
      <div>
        <p className="font-medium text-modern-gray-900">{record.firstName} {record.lastName}</p>
        <p className="text-sm text-modern-gray-500">{record.position}</p>
      </div>
    </div>
  );
};

const SectionField = () => {
  const record = useRecordContext();
  if (!record) return null;
  return <span>{sectionLabels[record.section] || record.section}</span>;
};

const ActionButtons = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <div className="flex items-center space-x-1">
      <EditButton record={record} label="" className="!p-1 !min-w-0 !min-h-0" />
      <DeleteButton record={record} label="" className="!p-1 !min-w-0 !min-h-0" />
    </div>
  );
};

const sectionChoices = Object.entries(sectionLabels).map(([id, name]) => ({ id, name }));

const TeamFilters = [
  <SearchInput source="q" placeholder="Поиск по имени..." alwaysOn key="search"
    sx={{ marginLeft: '12px', '& .MuiInputBase-root': { borderRadius: '12px', border: '1px solid #e5e7eb' } }}
  />,
  <SelectInput source="section" label="Раздел" choices={sectionChoices} key="section" />,
];

const ListActions = () => (
  <TopToolbar className="!bg-transparent !shadow-none !border-none !p-0">
    <div className="flex items-center justify-end w-full px-6">
      <CreateButton
        className="!bg-modern-primary-600 hover:!bg-modern-primary-700 !text-white !rounded-lg !px-4 !py-2 !shadow-sm !border-none !min-h-[40px]"
        startIcon={<PlusIcon className="h-4 w-4" />}
        label="Добавить сотрудника"
      />
    </div>
  </TopToolbar>
);

export const TeamMembersList: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-modern-gray-900">Команда сайта</h1>
      <p className="text-modern-gray-600 mt-1">Управление карточками сотрудников на странице /team</p>
    </div>
    <Card className="!shadow-sm !border !border-modern-gray-200 !rounded-xl overflow-hidden"
      sx={{
        '& .RaList-content': { padding: '24px' },
        '& .RaList-actions': { paddingBottom: '20px', paddingTop: '8px' },
        '& .MuiTableCell-head': { backgroundColor: '#f8fafc', borderBottom: '1px solid #e5e7eb', fontWeight: 600, fontSize: '14px', padding: '16px' },
        '& .MuiTableCell-body': { borderBottom: '1px solid #f3f4f6', padding: '16px', fontSize: '14px' },
      }}
    >
      <List
        filters={TeamFilters}
        actions={<ListActions />}
        pagination={<Pagination rowsPerPageOptions={[10, 25, 50]} />}
        perPage={25}
        sort={{ field: 'section', order: 'ASC' }}
        title=""
        component="div"
      >
        <Datagrid bulkActionButtons={false}>
          <FunctionField label="Сотрудник" render={() => <MemberNameField />} />
          <FunctionField label="Раздел" render={() => <SectionField />} />
          <NumberField source="sortOrder" label="Порядок" />
          <DateField source="createdAt" label="Создан" locales="ru-RU" />
          <FunctionField label="Действия" render={() => <ActionButtons />} />
        </Datagrid>
      </List>
    </Card>
  </div>
);
