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
} from 'react-admin';
import { Card } from '@mui/material';

const PromotionFilter = [
    <SearchInput
        source="q"
        placeholder="Поиск по названию и описанию..."
        alwaysOn
        key="search"
        sx={{
            '& .MuiInputBase-root': {
                minWidth: '400px',
                backgroundColor: 'background.paper',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                    borderColor: 'primary.main',
                },
                '&.Mui-focused': {
                    borderColor: 'primary.main',
                    boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}20`,
                },
            },
            '& .MuiInputBase-input': {
                padding: '12px 16px',
                fontSize: '14px',
                '&::placeholder': {
                    color: 'text.secondary',
                    opacity: 1,
                },
            },
        }}
    />,
    <BooleanInput source="isPublished" label="Опубликовано" key="published" />,
    <BooleanInput source="status" label="Активная" key="status" />,
];

const PromotionListActions = () => (
    <TopToolbar>
        <FilterButton />
        <CreateButton />
    </TopToolbar>
);

const PromotionPagination = () => <Pagination rowsPerPageOptions={[5, 10, 25, 50]} />;

// Компонент для отображения статуса акции (активна/неактивна)
const PromotionStatusField = ({ record }: any) => {
    if (!record || !record.startDate || !record.endDate) return null;

    const startDate = new Date(record.startDate);
    const endDate = new Date(record.endDate);
    const now = new Date();

    const isActive = now >= startDate && now <= endDate;

    return (
        <span style={{
            color: isActive ? '#4caf50' : '#f44336',
            fontWeight: 'bold'
        }}>
            {isActive ? 'Активна' : 'Неактивна'}
        </span>
    );
};

export const PromotionsList = () => (
    <Card className="p-6">
        <List
            filters={PromotionFilter}
            actions={<PromotionListActions />}
            pagination={<PromotionPagination />}
            perPage={10}
            sort={{ field: 'createdAt', order: 'DESC' }}
            title="Управление акциями"
        >
            <Datagrid>
                <TextField source="title" label="Название" />
                <TextField source="shortDescription" label="Описание" />
                <DateField source="startDate" label="Начало акции" showTime />
                <DateField source="endDate" label="Конец акции" showTime />
                <FunctionField
                    label="Статус акции"
                    render={PromotionStatusField}
                />
                <BooleanField source="isPublished" label="Опубликовано" />
                <DateField source="createdAt" label="Создано" showTime />
                <EditButton />
                <DeleteButton />
            </Datagrid>
        </List>
    </Card>
); 