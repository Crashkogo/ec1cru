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
    BooleanInput,
    Pagination,
    FunctionField,
    useRecordContext,
} from 'react-admin';
import { Card, Chip, IconButton, Tooltip } from '@mui/material';
import { glassCard, filterInputSx, toolbarClass, createBtnClass, filterBtnClass, pageHeaderClass, pageTitleClass, pageSubtitleClass } from '@/app/admin/adminStyles';
import {
    PlusIcon,
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    CalendarDaysIcon,
    UserGroupIcon
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
                    className="bg-blue-100 text-blue-800 border-blue-200"
                />
            ) : (
                <Chip
                    label="Партнерское"
                    size="small"
                    className="bg-amber-100 text-amber-800 border-amber-200"
                />
            )}
        </div>
    );
};

// Кастомный компонент для действий
const ActionButtons = () => {
    const record = useRecordContext();

    if (!record) return null;

    const handleViewRegistrations = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Используем полный путь для навигации
        window.location.href = `/admin#/events/${record.id}/registrations`;
    };

    return (
        <div className="flex items-center space-x-1">
            <Tooltip title="Просмотреть">
                <IconButton
                    size="small"
                    className="text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                    onClick={() => window.open(`/events/${record.slug}`, '_blank')}
                >
                    <EyeIcon className="h-4 w-4" />
                </IconButton>
            </Tooltip>
            {record.registrationEnabled && (
                <Tooltip title="Регистрации">
                    <IconButton
                        size="small"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={handleViewRegistrations}
                    >
                        <UserGroupIcon className="h-4 w-4" />
                    </IconButton>
                </Tooltip>
            )}
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
const EventFilter = [
    <SearchInput
        source="q"
        placeholder="Поиск по названию и описанию..."
        alwaysOn
        key="search"
        className="w-full max-w-lg"
        sx={filterInputSx}
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
    <TopToolbar className={toolbarClass}>
        <div className="flex items-center justify-end w-full px-6">
            <div className="flex items-center space-x-3">
                <FilterButton className={filterBtnClass} />
                <CreateButton
                    className={createBtnClass}
                    startIcon={<PlusIcon className="h-4 w-4" />}
                    label="Добавить мероприятие"
                />
            </div>
        </div>
    </TopToolbar>
);

// Кастомная пагинация
const EventPagination = () => (
    <Pagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        className="!border-t !border-slate-200 !pt-4 !mt-4"
    />
);

export const EventsList = () => (
    <div className="space-y-6">
        {/* Header */}
        <div className={pageHeaderClass}>
            <div>
                <h1 className={pageTitleClass}>Мероприятия</h1>
                <p className={pageSubtitleClass}>Управление мероприятиями и событиями</p>
            </div>
        </div>

        {/* Content Card */}
        <Card sx={glassCard}>
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
                        render={(record: { shortDescription?: string }) => (
                            <div className="max-w-md">
                                <p className="text-sm text-slate-500 line-clamp-2">
                                    {record.shortDescription}
                                </p>
                            </div>
                        )}
                    />
                    <DateField
                        source="startDate"
                        label="Дата проведения"
                        showTime
                        className="!text-sm !text-slate-500"
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
