'use client';

import {
    List,
    Datagrid,
    DateField,
    FunctionField,
    EditButton,
    DeleteButton,
    CreateButton,
    TopToolbar,
    FilterButton,
    SearchInput,
    BooleanInput,
    Pagination,
    useRecordContext,
} from 'react-admin';
import { Card, Box, Chip, IconButton, Tooltip } from '@mui/material';
import {
    PlusIcon,
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon,
    CogIcon,
    BuildingOffice2Icon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { glassCard, filterInputSx, toolbarClass, createBtnClass, filterBtnClass, pageHeaderClass, pageTitleClass, pageSubtitleClass } from '@/admin/adminStyles';

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

// Кастомный компонент для Fresh Support
const FreshSupportField = () => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <div className="flex items-center">
            {record.freshSupport ? (
                <Chip
                    label="1С:Fresh"
                    size="small"
                    className="bg-blue-100 text-blue-800 border-blue-200"
                />
            ) : (
                <Chip
                    label="Обычная"
                    size="small"
                    className="bg-gray-100 text-gray-800 border-gray-200"
                />
            )}
        </div>
    );
};

// Кастомный компонент для отображения решения с иконкой
const SolutionNameField = () => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <div className="flex items-start">
            <Box className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                <BuildingOffice2Icon className="h-4 w-4 text-blue-600" />
            </Box>
            <div className="flex-1">
                <p className="font-medium text-slate-900 text-sm leading-tight">{record.title}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{record.shortDescription}</p>
            </div>
        </div>
    );
};

// Кастомный компонент для программ
const ProgramsField = () => {
    const record = useRecordContext();
    if (!record) return null;

    interface Program {
        program: {
            shortName: string;
        };
    }

    return (
        <Box className="flex flex-wrap gap-1">
            {record.programs && record.programs.length > 0 ? (
                record.programs.slice(0, 3).map((program: Program, index: number) => (
                    <Chip
                        key={index}
                        icon={<CogIcon className="h-3 w-3" />}
                        label={program.program.shortName}
                        size="small"
                        className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                    />
                ))
            ) : (
                <span className="text-xs text-slate-400 italic">Нет программ</span>
            )}
            {record.programs && record.programs.length > 3 && (
                <Chip
                    label={`+${record.programs.length - 3}`}
                    size="small"
                    className="bg-slate-100 text-slate-500 text-xs"
                />
            )}
        </Box>
    );
};

// Кастомный компонент для цены
const PriceField = () => {
    const record = useRecordContext();
    if (!record) return null;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price);
    };

    return (
        <div className="flex items-center">
            <CurrencyDollarIcon className="h-4 w-4 text-slate-400 mr-1" />
            <span className="font-medium text-slate-900">{formatPrice(record.price)}</span>
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
                    className="text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                    onClick={() => window.open(`/ready-solutions/${record.slug}`, '_blank')}
                >
                    <EyeIcon className="h-4 w-4" />
                </IconButton>
            </Tooltip>
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
const ReadySolutionsFilter = [
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
        source="freshSupport"
        label="Поддержка 1С:Fresh"
        key="fresh"
        sx={{
            '& .MuiFormControl-root': {
                minWidth: '180px',
            },
        }}
    />,
];

// Кастомная панель инструментов
const ReadySolutionsListActions = () => (
    <TopToolbar className={toolbarClass}>
        <div className="flex items-center justify-end w-full px-6">
            <div className="flex items-center space-x-3">
                <FilterButton className={filterBtnClass} />
                <CreateButton
                    className={createBtnClass}
                    startIcon={<PlusIcon className="h-4 w-4" />}
                    label="Добавить решение"
                />
            </div>
        </div>
    </TopToolbar>
);

// Кастомная пагинация
const ReadySolutionsPagination = () => (
    <Pagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        className="!border-t !border-slate-200 !pt-4 !mt-4"
    />
);

export const ReadySolutionsList = () => (
    <div className="space-y-6">
        {/* Header */}
        <div className={pageHeaderClass}>
            <div>
                <h1 className={pageTitleClass}>Готовые решения</h1>
                <p className={pageSubtitleClass}>Управление готовыми решениями 1С</p>
            </div>
        </div>

        {/* Content Card */}
        <Card sx={glassCard}>
            <List
                filters={ReadySolutionsFilter}
                actions={<ReadySolutionsListActions />}
                pagination={<ReadySolutionsPagination />}
                perPage={10}
                sort={{ field: 'createdAt', order: 'DESC' }}
                title=""
                component="div"
            >
                <Datagrid
                    bulkActionButtons={false}
                    className="!shadow-none"
                >
                    <FunctionField
                        label="Решение"
                        render={() => <SolutionNameField />}
                    />
                    <FunctionField
                        label="Программы"
                        render={() => <ProgramsField />}
                    />
                    <FunctionField
                        label="Цена"
                        render={() => <PriceField />}
                    />
                    <FunctionField
                        label="Поддержка"
                        render={() => <FreshSupportField />}
                    />
                    <FunctionField
                        label="Публикация"
                        render={() => <PublishedStatus />}
                    />
                    <DateField
                        source="createdAt"
                        label="Дата создания"
                        showTime
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

export default ReadySolutionsList;
