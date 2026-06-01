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
import {
    PlusIcon,
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import { glassCard, filterInputSx, toolbarClass, createBtnClass, filterBtnClass, pageHeaderClass, pageTitleClass, pageSubtitleClass } from '@/admin/adminStyles';

const PublishedStatus = () => {
    const record = useRecordContext();
    if (!record) return null;
    return record.isPublished ? (
        <Chip icon={<CheckCircleIcon className="h-4 w-4" />} label="Опубликован" size="small" className="bg-green-100 text-green-800" />
    ) : (
        <Chip icon={<XCircleIcon className="h-4 w-4" />} label="Черновик" size="small" className="bg-gray-100 text-gray-800" />
    );
};

const ActionButtons = () => {
    const record = useRecordContext();
    if (!record) return null;
    return (
        <div className="flex items-center space-x-1">
            <Tooltip title="Просмотреть">
                <IconButton size="small" onClick={() => window.open(`/equipment/${record.slug}`, '_blank')}>
                    <EyeIcon className="h-4 w-4" />
                </IconButton>
            </Tooltip>
            <EditButton record={record} label="" className="!p-1 !min-w-0" />
            <DeleteButton record={record} label="" className="!p-1 !min-w-0" />
        </div>
    );
};

const EquipmentFilter = [
    <SearchInput source="q" placeholder="Поиск по названию..." alwaysOn key="search" className="w-full max-w-lg"
        sx={filterInputSx}
    />,
    <BooleanInput source="isPublished" label="Статус публикации" key="published" />,
];

const EquipmentListActions = () => (
    <TopToolbar className={toolbarClass}>
        <div className="flex items-center justify-end w-full px-6">
            <div className="flex items-center space-x-3">
                <FilterButton className={filterBtnClass} />
                <CreateButton
                    className={createBtnClass}
                    startIcon={<PlusIcon className="h-4 w-4" />}
                    label="Добавить товар"
                />
            </div>
        </div>
    </TopToolbar>
);

const EquipmentPagination = () => (
    <Pagination rowsPerPageOptions={[5, 10, 25, 50]} className="!border-t !border-slate-200 !pt-4 !mt-4" />
);

export const EquipmentList = () => (
    <div className="space-y-6">
        <div className={pageHeaderClass}>
            <div>
                <h1 className={pageTitleClass}>Оборудование</h1>
                <p className={pageSubtitleClass}>Управление каталогом оборудования</p>
            </div>
        </div>
        <Card sx={glassCard}>
            <List
                filters={EquipmentFilter}
                actions={<EquipmentListActions />}
                pagination={<EquipmentPagination />}
                perPage={10}
                sort={{ field: 'createdAt', order: 'DESC' }}
                title=""
                component="div"
            >
                <Datagrid bulkActionButtons={false} className="!shadow-none">
                    <TextField source="title" label="Название" className="!font-medium" />
                    <FunctionField
                        label="Описание"
                        render={(record: { shortDescription?: string }) => (
                            <p className="text-sm text-slate-500 line-clamp-2 max-w-xs">{record.shortDescription}</p>
                        )}
                    />
                    <FunctionField
                        label="Цена"
                        render={(record: { price?: number }) => (
                            <span className="text-sm font-medium text-slate-700">
                                {record.price ? `${Number(record.price).toLocaleString('ru-RU')} ₽` : '—'}
                            </span>
                        )}
                    />
                    <FunctionField label="Статус" render={() => <PublishedStatus />} />
                    <DateField source="createdAt" label="Дата" showTime className="!text-sm !text-slate-500" />
                    <FunctionField label="Действия" render={() => <ActionButtons />} />
                </Datagrid>
            </List>
        </Card>
    </div>
);

export default EquipmentList;
