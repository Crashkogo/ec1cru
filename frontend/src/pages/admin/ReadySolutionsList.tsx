import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    BooleanField,
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
    FunnelIcon,
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon,
    CogIcon,
    BuildingOffice2Icon,
    CurrencyDollarIcon
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
            <Box className="w-8 h-8 bg-modern-primary-100 rounded-lg flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                <BuildingOffice2Icon className="h-4 w-4 text-modern-primary-600" />
            </Box>
            <div className="flex-1">
                <p className="font-medium text-modern-gray-900 text-sm leading-tight">{record.title}</p>
                <p className="text-xs text-modern-gray-500 mt-1 line-clamp-2">{record.shortDescription}</p>
            </div>
        </div>
    );
};

// Кастомный компонент для программ
const ProgramsField = () => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <Box className="flex flex-wrap gap-1">
            {record.programs && record.programs.length > 0 ? (
                record.programs.slice(0, 3).map((program: any, index: number) => (
                    <Chip
                        key={index}
                        icon={<CogIcon className="h-3 w-3" />}
                        label={program.program.shortName}
                        size="small"
                        className="bg-modern-primary-50 text-modern-primary-700 border-modern-primary-200 text-xs"
                    />
                ))
            ) : (
                <span className="text-xs text-modern-gray-400 italic">Нет программ</span>
            )}
            {record.programs && record.programs.length > 3 && (
                <Chip
                    label={`+${record.programs.length - 3}`}
                    size="small"
                    className="bg-modern-gray-100 text-modern-gray-600 text-xs"
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
            <CurrencyDollarIcon className="h-4 w-4 text-modern-gray-400 mr-1" />
            <span className="font-medium text-modern-gray-900">{formatPrice(record.price)}</span>
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
                    onClick={() => window.open(`/ready-solutions/${record.slug}`, '_blank')}
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
const ReadySolutionsFilter = [
    <SearchInput
        source="q"
        placeholder="Поиск по названию и описанию..."
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
    <TopToolbar className="!bg-transparent !shadow-none !border-none !p-0">
        <div className="flex items-center justify-end w-full px-6">
            <div className="flex items-center space-x-3">
                <FilterButton
                    className="!bg-white !text-modern-gray-700 !border !border-modern-gray-300 hover:!bg-modern-gray-50 !rounded-lg !px-4 !py-2 !shadow-sm !min-h-[40px]"
                />
                <CreateButton
                    className="!bg-modern-primary-600 hover:!bg-modern-primary-700 !text-white !rounded-lg !px-4 !py-2 !shadow-sm !border-none !min-h-[40px]"
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
        className="!border-t !border-modern-gray-200 !pt-4 !mt-4"
    />
);

export const ReadySolutionsList = () => (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-modern-gray-900">Готовые решения</h1>
                <p className="text-modern-gray-600 mt-1">Управление готовыми решениями 1С</p>
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

export default ReadySolutionsList; 