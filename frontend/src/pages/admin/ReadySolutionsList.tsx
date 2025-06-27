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
} from 'react-admin';
import { Card, Box, Chip } from '@mui/material';

const ReadySolutionsFilter = [
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
    <BooleanInput source="freshSupport" label="1С:Fresh" key="fresh" />,
];

const ReadySolutionsListActions = () => (
    <TopToolbar>
        <FilterButton />
        <CreateButton />
    </TopToolbar>
);

const ReadySolutionsPagination = () => <Pagination rowsPerPageOptions={[5, 10, 25, 50]} />;

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);
};

export const ReadySolutionsList = () => (
    <Card className="p-6">
        <List
            filters={ReadySolutionsFilter}
            actions={<ReadySolutionsListActions />}
            pagination={<ReadySolutionsPagination />}
            perPage={10}
            sort={{ field: 'createdAt', order: 'DESC' }}
            title="Управление готовыми решениями"
        >
            <Datagrid>
                <TextField source="title" label="Название" />
                <TextField source="shortDescription" label="Краткое описание" />
                <FunctionField
                    source="programs"
                    label="Программы"
                    render={(record: any) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {record.programs && record.programs.length > 0 ? (
                                record.programs.map((program: any, index: number) => (
                                    <Chip
                                        key={index}
                                        label={program.program.shortName}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: '0.75rem' }}
                                    />
                                ))
                            ) : (
                                <span style={{ color: '#666', fontStyle: 'italic' }}>Нет</span>
                            )}
                        </Box>
                    )}
                />
                <BooleanField source="freshSupport" label="1С:Fresh" />
                <FunctionField
                    source="price"
                    label="Цена"
                    render={(record: any) => (
                        <span>{formatPrice(record.price)}</span>
                    )}
                />
                <BooleanField source="isPublished" label="Опубликовано" />
                <DateField source="createdAt" label="Дата создания" showTime />
                <DateField source="updatedAt" label="Обновлено" showTime />
                <EditButton />
                <DeleteButton />
            </Datagrid>
        </List>
    </Card>
);

export default ReadySolutionsList; 