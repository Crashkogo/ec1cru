import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    BooleanField,
    EditButton,
    DeleteButton,
    CreateButton,
    TopToolbar,
    FilterButton,
    SearchInput,
    BooleanInput,
    Pagination,
    FunctionField,
    useRecordContext,
} from 'react-admin';
import { Card, Chip, IconButton, Tooltip } from '@mui/material';
import {
    PlusIcon,
    FunnelIcon,
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';

// Кастомный компонент для статуса публикации
const PublishedStatus = () => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <div className="flex items-center">
            {record.isPublished ? (
                <Chip
                    icon={<CheckCircleIcon className="h-4 w-4" />}
                    label="Опубликовано"
                    size="small"
                    className="bg-green-100 text-green-800 border-green-200"
                />
            ) : (
                <Chip
                    icon={<XCircleIcon className="h-4 w-4" />}
                    label="Черновик"
                    size="small"
                    className="bg-gray-100 text-gray-800 border-gray-200"
                />
            )}
        </div>
    );
};

// Кастомный компонент для статуса мероприятия
const EventStatusField = () => {
    const record = useRecordContext();
    if (!record) return null;

    const eventDate = new Date(record.startDate);
    const now = new Date();
    const isPast = eventDate < now;

    return (
        <div className="flex items-center">
            {isPast ? (
                <Chip
                    icon={<ClockIcon className="h-4 w-4" />}
                    label="Прошедшее"
                    size="small"
                    className="bg-gray-100 text-gray-800 border-gray-200"
                />
            ) : (
                <Chip
                    icon={<CalendarDaysIcon className="h-4 w-4" />}
                    label="Предстоящее"
                    size="small"
                    className="bg-blue-100 text-blue-800 border-blue-200"
                />
            )}
        </div>
    );
};

// Кастомный компонент для статуса "наше/не наше"
const OurEventField = () => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <div className="flex items-center">
            {record.ours ? (
                <Chip
                    label="Наше"
                    size="small"
                    className="bg-modern-primary-100 text-modern-primary-800 border-modern-primary-200"
                />
            ) : (
                <Chip
                    label="Партнерское"
                    size="small"
                    className="bg-modern-accent-100 text-modern-accent-800 border-modern-accent-200"
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
        <div className="flex items-center space-x-2">
            <Tooltip title="Просмотреть">
                <IconButton
                    size="small"
                    className="text-modern-gray-600 hover:text-modern-primary-600 hover:bg-modern-primary-50"
                    onClick={() => window.open(`/events/${record.slug}`, '_blank')}
                >
                    <EyeIcon className="h-4 w-4" />
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
const EventFilter = [
    <SearchInput
        source="q"
        placeholder="Поиск по названию и описанию..."
        alwaysOn
        key="search"
        className="w-full max-w-md"
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
    <BooleanInput
        source="isPublished"
        label="Статус публикации"
        key="published"
        sx={{
            '& .MuiFormControl-root': {
                minWidth: '180px',
            },
        }}
    />,
    <BooleanInput
        source="ours"
        label="Наше мероприятие"
        key="ours"
        sx={{
            '& .MuiFormControl-root': {
                minWidth: '180px',
            },
        }}
    />,
];

// Кастомная панель инструментов
const EventListActions = () => (
    <TopToolbar className="!bg-transparent !shadow-none !border-none !p-0">
        <div className="flex items-center space-x-3">
            <FilterButton
                className="!bg-white !text-modern-gray-700 !border !border-modern-gray-300 hover:!bg-modern-gray-50 !rounded-lg !px-4 !py-2 !shadow-sm"
                startIcon={<FunnelIcon className="h-4 w-4" />}
            />
            <CreateButton
                className="!bg-modern-primary-600 hover:!bg-modern-primary-700 !text-white !rounded-lg !px-4 !py-2 !shadow-sm !border-none"
                startIcon={<PlusIcon className="h-4 w-4" />}
                label="Добавить мероприятие"
            />
        </div>
    </TopToolbar>
);

// Кастомная пагинация
const EventPagination = () => (
    <Pagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        className="!border-t !border-modern-gray-200 !pt-4 !mt-4"
    />
);

export const EventsList = () => (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-modern-gray-900">Мероприятия</h1>
                <p className="text-modern-gray-600 mt-1">Управление мероприятиями и событиями</p>
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
                    padding: '32px',
                },
                '& .RaList-actions': {
                    paddingBottom: '16px',
                },
                '& .RaFilterForm-form': {
                    paddingBottom: '24px',
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
                filters={EventFilter}
                actions={<EventListActions />}
                pagination={<EventPagination />}
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
                    <FunctionField
                        label="Описание"
                        render={(record: any) => (
                            <div className="max-w-md">
                                <p className="text-sm text-modern-gray-600 line-clamp-2">
                                    {record.shortDescription}
                                </p>
                            </div>
                        )}
                    />
                    <DateField
                        source="startDate"
                        label="Дата проведения"
                        showTime
                        className="!text-sm !text-modern-gray-600"
                    />
                    <FunctionField
                        label="Тип"
                        render={() => <OurEventField />}
                    />
                    <FunctionField
                        label="Статус"
                        render={() => <EventStatusField />}
                    />
                    <FunctionField
                        label="Публикация"
                        render={() => <PublishedStatus />}
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