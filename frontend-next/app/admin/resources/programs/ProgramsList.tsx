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
    FunctionField,
    FilterButton,
} from 'react-admin';
import { Card, Box } from '@mui/material';
import {
    PlusIcon,
    CogIcon
} from '@heroicons/react/24/outline';
import { glassCard, filterInputSx, toolbarClass, createBtnClass, filterBtnClass, pageHeaderClass, pageTitleClass, pageSubtitleClass } from '@/app/admin/adminStyles';

// Кастомный компонент для отображения названия программы
const ProgramNameField = () => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <div className="flex items-center">
            <Box className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <CogIcon className="h-4 w-4 text-blue-600" />
            </Box>
            <div>
                <p className="font-medium text-slate-900">{record.fullName}</p>
                <p className="text-sm text-slate-500">{record.shortName}</p>
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
const ProgramsFilter = [
    <SearchInput
        source="q"
        placeholder="Поиск по названию программы..."
        alwaysOn
        key="search"
        className="w-full max-w-lg"
        sx={filterInputSx}
    />,
];

// Кастомная панель инструментов
const ProgramsListActions = () => (
    <TopToolbar className={toolbarClass}>
        <div className="flex items-center justify-end w-full px-6">
            <div className="flex items-center space-x-3">
                <FilterButton className={filterBtnClass} />
                <CreateButton
                    className={createBtnClass}
                    startIcon={<PlusIcon className="h-4 w-4" />}
                    label="Добавить программу"
                />
            </div>
        </div>
    </TopToolbar>
);

// Кастомная пагинация
const ProgramsPagination = () => (
    <Pagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        className="!border-t !border-slate-200 !pt-4 !mt-4"
    />
);

export const ProgramsList = () => (
    <div className="space-y-6">
        {/* Header */}
        <div className={pageHeaderClass}>
            <div>
                <h1 className={pageTitleClass}>Программы 1С</h1>
                <p className={pageSubtitleClass}>Управление программными продуктами 1С</p>
            </div>
        </div>

        {/* Content Card */}
        <Card sx={glassCard}>
            <List
                filters={ProgramsFilter}
                actions={<ProgramsListActions />}
                pagination={<ProgramsPagination />}
                perPage={25}
                sort={{ field: 'fullName', order: 'ASC' }}
                title=""
                component="div"
            >
                <Datagrid
                    bulkActionButtons={false}
                    className="!shadow-none"
                >
                    <TextField
                        source="id"
                        label="ID"
                        className="!text-sm !text-slate-500"
                        sx={{
                            '& .MuiTypography-root': {
                                fontSize: '12px',
                                color: '#6b7280',
                            },
                        }}
                    />
                    <FunctionField
                        label="Программа"
                        render={() => <ProgramNameField />}
                    />
                    <DateField
                        source="createdAt"
                        label="Дата создания"
                        locales="ru-RU"
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
