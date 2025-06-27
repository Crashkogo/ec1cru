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
    TextInput,
    BooleanInput,
    SelectInput,
    Pagination,
} from 'react-admin';
import { Card, Box } from '@mui/material';

const PostFilter = [
    <SearchInput
        source="q"
        placeholder="Поиск по заголовку и описанию..."
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
    <BooleanInput source="isPublished" label="Опубликована" key="published" />,
];

const PostListActions = () => (
    <TopToolbar>
        <FilterButton />
        <CreateButton />
    </TopToolbar>
);

const PostPagination = () => <Pagination rowsPerPageOptions={[5, 10, 25, 50]} />;

export const NewsList = () => (
    <Card className="p-6">
        <List
            filters={PostFilter}
            actions={<PostListActions />}
            pagination={<PostPagination />}
            perPage={10}
            sort={{ field: 'createdAt', order: 'DESC' }}
            title="Управление новостями"
        >
            <Datagrid>
                <TextField source="title" label="Заголовок" />
                <TextField source="shortDescription" label="Описание" />
                <BooleanField source="isPublished" label="Опубликована" />
                <DateField source="createdAt" label="Дата создания" showTime />
                <DateField source="updatedAt" label="Обновлена" showTime />
                <EditButton />
                <DeleteButton />
            </Datagrid>
        </List>
    </Card>
); 