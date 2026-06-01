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
import { glassCard, filterInputSx, toolbarClass, filterBtnClass, pageHeaderClass, pageTitleClass, pageSubtitleClass } from '@/admin/adminStyles';

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
        sx={filterInputSx}
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
    <TopToolbar className={toolbarClass}>
        <div className="flex items-center justify-end w-full px-6">
            <div className="flex items-center space-x-3">
                <FilterButton className={filterBtnClass} />
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
        <div className={pageHeaderClass}>
            <div>
                <h1 className={pageTitleClass}>Подписчики рассылки</h1>
                <p className={pageSubtitleClass}>Управление подписчиками на рассылку</p>
            </div>
        </div>

        {/* Content Card */}
        <Card sx={glassCard}>
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
