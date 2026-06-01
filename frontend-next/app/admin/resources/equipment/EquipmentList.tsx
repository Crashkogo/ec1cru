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
        sx={{ marginLeft: '12px', '& .MuiInputBase-root': { backgroundColor: 'background.paper', borderRadius: '12px', border: '1px solid #e5e7eb' } }}
    />,
    <BooleanInput source="isPublished" label="Статус публикации" key="published" />,
];

const EquipmentListActions = () => (
    <TopToolbar className="!bg-transparent !shadow-none !p-0">
        <div className="flex items-center justify-end w-full px-6">
            <div className="flex items-center space-x-3">
                <FilterButton className="!bg-white !text-modern-gray-700 !border !border-modern-gray-300 hover:!bg-modern-gray-50 !rounded-lg !px-4 !py-2 !shadow-sm !min-h-[40px]" />
                <CreateButton
                    className="!bg-modern-primary-600 hover:!bg-modern-primary-700 !text-white !rounded-lg !px-4 !py-2 !shadow-sm !border-none !min-h-[40px]"
                    startIcon={<PlusIcon className="h-4 w-4" />}
                    label="Добавить товар"
                />
            </div>
        </div>
    </TopToolbar>
);

const EquipmentPagination = () => (
    <Pagination rowsPerPageOptions={[5, 10, 25, 50]} className="!border-t !border-modern-gray-200 !pt-4 !mt-4" />
);

export const EquipmentList = () => (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-modern-gray-900">Оборудование</h1>
            <p className="text-modern-gray-600 mt-1">Управление каталогом оборудования</p>
        </div>
        <Card
            className="!shadow-sm !border !border-modern-gray-200 !rounded-xl overflow-hidden"
            sx={{
                '& .MuiTableCell-head': { backgroundColor: '#f8fafc', borderBottom: '1px solid #e5e7eb', fontWeight: 600, fontSize: '14px', color: '#374151', padding: '16px' },
                '& .MuiTableCell-body': { borderBottom: '1px solid #f3f4f6', padding: '16px', fontSize: '14px', color: '#1f2937' },
                '& .MuiTableRow-root:hover': { backgroundColor: '#f8fafc' },
                '& .RaList-content': { padding: '24px' },
                '& .RaList-actions': { paddingBottom: '20px', paddingTop: '8px' },
            }}
        >
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
                            <p className="text-sm text-modern-gray-600 line-clamp-2 max-w-xs">{record.shortDescription}</p>
                        )}
                    />
                    <FunctionField
                        label="Цена"
                        render={(record: { price?: number }) => (
                            <span className="text-sm font-medium text-modern-gray-700">
                                {record.price ? `${Number(record.price).toLocaleString('ru-RU')} ₽` : '—'}
                            </span>
                        )}
                    />
                    <FunctionField label="Статус" render={() => <PublishedStatus />} />
                    <DateField source="createdAt" label="Дата" showTime className="!text-sm !text-modern-gray-600" />
                    <FunctionField label="Действия" render={() => <ActionButtons />} />
                </Datagrid>
            </List>
        </Card>
    </div>
);

export default EquipmentList;
