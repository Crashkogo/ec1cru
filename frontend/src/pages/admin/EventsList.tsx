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

const EventFilter = [
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
    <BooleanInput source="ours" label="Наше мероприятие" key="ours" />,
    <BooleanInput source="status" label="Прошедшее" key="status" />,
];

const EventListActions = () => (
    <TopToolbar>
        <FilterButton />
        <CreateButton />
    </TopToolbar>
);

const EventPagination = () => <Pagination rowsPerPageOptions={[5, 10, 25, 50]} />;

// Компонент для отображения статуса (прошло/будущее)
const EventStatusField = ({ record }: any) => {
    if (!record || !record.startDate) return null;

    const eventDate = new Date(record.startDate);
    const now = new Date();
    const isPast = eventDate < now;

    return (
        <span style={{
            color: isPast ? '#f44336' : '#4caf50',
            fontWeight: 'bold'
        }}>
            {isPast ? 'Прошло' : 'Предстоит'}
        </span>
    );
};

// Компонент для отображения ссылки на мероприятие
const EventLinkField = ({ record }: any) => {
    if (!record || !record.ours || !record.eventLink) return null;

    return (
        <a
            href={record.eventLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1976d2', textDecoration: 'underline' }}
        >
            Ссылка
        </a>
    );
};

export const EventsList = () => (
    <Card className="p-6">
        <List
            filters={EventFilter}
            actions={<EventListActions />}
            pagination={<EventPagination />}
            perPage={10}
            sort={{ field: 'createdAt', order: 'DESC' }}
            title="Управление мероприятиями"
        >
            <Datagrid>
                <TextField source="title" label="Название" />
                <TextField source="shortDescription" label="Описание" />
                <DateField source="startDate" label="Дата проведения" showTime />
                <BooleanField source="ours" label="Наше" />
                <FunctionField
                    label="Статус"
                    render={EventStatusField}
                />
                <FunctionField
                    label="Ссылка"
                    render={EventLinkField}
                />
                <BooleanField source="isPublished" label="Опубликовано" />
                <DateField source="createdAt" label="Создано" showTime />
                <EditButton />
                <DeleteButton />
            </Datagrid>
        </List>
    </Card>
); 