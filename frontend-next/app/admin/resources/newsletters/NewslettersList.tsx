'use client';

import {
    List,
    Datagrid,
    TextField,
    DateField,
    EditButton,
    DeleteButton,
    CreateButton,
    TopToolbar,
    FilterButton,
    SearchInput,
    Pagination,
    FunctionField,
    useRecordContext
} from 'react-admin';
import { Card, IconButton, Tooltip } from '@mui/material';
import {
    PlusIcon
} from '@heroicons/react/24/outline';
import { glassCard, filterInputSx, toolbarClass, createBtnClass, filterBtnClass, pageHeaderClass, pageTitleClass, pageSubtitleClass } from '@/admin/adminStyles';

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
const NewsletterFilter = [
    <SearchInput
        source="q"
        placeholder="Поиск по названию..."
        alwaysOn
        key="search"
        className="w-full max-w-lg"
        sx={filterInputSx}
    />,
];

// Кастомная панель инструментов
const NewslettersListActions = () => (
    <TopToolbar className={toolbarClass}>
        <div className="flex items-center justify-end w-full px-6">
            <div className="flex items-center space-x-3">
                <FilterButton className={filterBtnClass} />
                <CreateButton
                    className={createBtnClass}
                    startIcon={<PlusIcon className="h-4 w-4" />}
                    label="Добавить шаблон"
                />
            </div>
        </div>
    </TopToolbar>
);

// Кастомная пагинация
const NewsletterPagination = () => (
    <Pagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        className="!border-t !border-modern-gray-200 !pt-4 !mt-4"
    />
);

export const NewslettersList = () => (
    <div className="space-y-6">
        {/* Header */}
        <div className={pageHeaderClass}>
            <div>
                <h1 className={pageTitleClass}>Шаблоны рассылок</h1>
                <p className={pageSubtitleClass}>Управление шаблонами для email-рассылок</p>
            </div>
        </div>

        {/* Content Card */}
        <Card sx={glassCard}>
            <List
                filters={NewsletterFilter}
                actions={<NewslettersListActions />}
                pagination={<NewsletterPagination />}
                perPage={10}
                sort={{ field: 'createdAt', order: 'DESC' }}
                title=""
                component="div"
            >
                <Datagrid
                    bulkActionButtons={false}
                    className="!shadow-none"
                >
                    <TextField
                        source="title"
                        label="Название"
                        className="!font-medium"
                        sx={{
                            '& .MuiTypography-root': {
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#1f2937',
                            },
                        }}
                    />
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
