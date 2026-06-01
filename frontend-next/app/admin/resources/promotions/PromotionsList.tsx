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
import { glassCard, filterInputSx, toolbarClass, createBtnClass, filterBtnClass, pageHeaderClass, pageTitleClass, pageSubtitleClass } from '@/admin/adminStyles';
import {
    PlusIcon,
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    GiftIcon
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

// Кастомный компонент для статуса акции
const PromotionStatusField = () => {
    const record = useRecordContext();
    if (!record) return null;

    // Вычисляем актуальный статус на основе даты окончания
    const endDate = new Date(record.endDate);
    const now = new Date();
    const isExpired = endDate < now;

    // Используем вычисленный статус с сервера, если доступен, иначе вычисляем сами
    const actualStatus = record.calculatedStatus !== undefined
        ? record.calculatedStatus
        : !isExpired;

    if (isExpired) {
        return (
            <Tooltip title={`Акция завершилась ${endDate.toLocaleDateString('ru-RU')}`}>
                <Chip
                    icon={<ClockIcon className="h-4 w-4" />}
                    label="Завершена"
                    size="small"
                    className="bg-gray-100 text-gray-800 border-gray-200"
                />
            </Tooltip>
        );
    }

    return (
        <div className="flex items-center">
            {actualStatus ? (
                <Tooltip title={`Активна до ${endDate.toLocaleDateString('ru-RU')}`}>
                    <Chip
                        icon={<GiftIcon className="h-4 w-4" />}
                        label="Активная"
                        size="small"
                        className="bg-green-100 text-green-800 border-green-200"
                    />
                </Tooltip>
            ) : (
                <Tooltip title="Акция неактивна (проверьте настройки)">
                    <Chip
                        icon={<ClockIcon className="h-4 w-4" />}
                        label="Неактивная"
                        size="small"
                        className="bg-orange-100 text-orange-800 border-orange-200"
                    />
                </Tooltip>
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
            <Tooltip title="Просмотреть">
                <IconButton
                    size="small"
                    className="text-modern-gray-600 hover:text-modern-primary-600 hover:bg-modern-primary-50"
                    onClick={() => window.open(`/promotions/${record.slug}`, '_blank')}
                >
                    <EyeIcon className="h-4 w-4" />
                </IconButton>
            </Tooltip>
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
const PromotionFilter = [
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
        source="status"
        label="Активная акция"
        key="status"
        sx={{
            '& .MuiFormControl-root': {
                minWidth: '180px',
            },
        }}
    />,
];

// Кастомная панель инструментов
const PromotionListActions = () => (
    <TopToolbar className={toolbarClass}>
        <div className="flex items-center justify-end w-full px-6">
            <div className="flex items-center space-x-3">
                <FilterButton className={filterBtnClass} />
                <CreateButton
                    className={createBtnClass}
                    startIcon={<PlusIcon className="h-4 w-4" />}
                    label="Добавить акцию"
                />
            </div>
        </div>
    </TopToolbar>
);

// Кастомная пагинация
const PromotionPagination = () => (
    <Pagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        className="!border-t !border-modern-gray-200 !pt-4 !mt-4"
    />
);

export const PromotionsList = () => (
    <div className="space-y-6">
        {/* Header */}
        <div className={pageHeaderClass}>
            <div>
                <h1 className={pageTitleClass}>Акции</h1>
                <p className={pageSubtitleClass}>Управление акциями и специальными предложениями</p>
            </div>
        </div>

        {/* Content Card */}
        <Card sx={glassCard}>
            <List
                filters={PromotionFilter}
                actions={<PromotionListActions />}
                pagination={<PromotionPagination />}
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
                                <p className="text-sm text-modern-gray-600 line-clamp-2">
                                    {record.shortDescription}
                                </p>
                            </div>
                        )}
                    />
                    <DateField
                        source="startDate"
                        label="Начало акции"
                        showTime
                        className="!text-sm !text-modern-gray-600"
                    />
                    <DateField
                        source="endDate"
                        label="Конец акции"
                        showTime
                        className="!text-sm !text-modern-gray-600"
                    />
                    <FunctionField
                        label="Статус акции"
                        render={() => <PromotionStatusField />}
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
