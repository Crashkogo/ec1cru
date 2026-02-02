'use client';

import {
    List,
    Datagrid,
    EmailField,
    DateField,
    EditButton,
    DeleteButton,
    TopToolbar,
    FilterButton,
    SearchInput,
    BooleanInput,
    Pagination,
    FunctionField,
    useRecordContext
} from 'react-admin';
import { Card, Chip } from '@mui/material';
import {
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

// Кастомный компонент для статуса активности
const ActiveStatus = () => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <div className="flex items-center">
            {record.isActive ? (
                <Chip
                    icon={<CheckCircleIcon className="h-4 w-4" />}
                    label="Активен"
                    size="small"
                    className="bg-green-100 text-green-800 border-green-200"
                />
            ) : (
                <Chip
                    icon={<XCircleIcon className="h-4 w-4" />}
                    label="Неактивен"
                    size="small"
                    className="bg-gray-100 text-gray-800 border-gray-200"
                />
            )}
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
const SubscriberFilter = [
    <SearchInput
        source="q"
        placeholder="Поиск по email..."
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
    <BooleanInput
        source="isActive"
        label="Статус подписки"
        key="active"
        sx={{
            '& .MuiFormControl-root': {
                minWidth: '180px',
            },
        }}
    />,
];

// Кастомная панель инструментов
const SubscriberListActions = () => (
    <TopToolbar className="!bg-transparent !shadow-none !border-none !p-0">
        <div className="flex items-center justify-end w-full px-6">
            <div className="flex items-center space-x-3">
                <FilterButton
                    className="!bg-white !text-modern-gray-700 !border !border-modern-gray-300 hover:!bg-modern-gray-50 !rounded-lg !px-4 !py-2 !shadow-sm !min-h-[40px]"
                />
            </div>
        </div>
    </TopToolbar>
);

// Кастомная пагинация
const SubscriberPagination = () => (
    <Pagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        className="!border-t !border-modern-gray-200 !pt-4 !mt-4"
    />
);

export const SubscribersList = () => (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-modern-gray-900">Подписчики рассылки</h1>
                <p className="text-modern-gray-600 mt-1">Управление подписчиками на рассылку</p>
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
                filters={SubscriberFilter}
                actions={<SubscriberListActions />}
                pagination={<SubscriberPagination />}
                perPage={10}
                sort={{ field: 'subscribedAt', order: 'DESC' }}
                title=""
                component="div"
            >
                <Datagrid
                    bulkActionButtons={false}
                    className="!shadow-none"
                >
                    <EmailField
                        source="email"
                        label="Email"
                        className="!font-medium"
                        sx={{
                            '& .MuiTypography-root': {
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#1f2937',
                            },
                        }}
                    />
                    <FunctionField
                        label="Статус"
                        render={() => <ActiveStatus />}
                    />
                    <DateField
                        source="subscribedAt"
                        label="Дата подписки"
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
