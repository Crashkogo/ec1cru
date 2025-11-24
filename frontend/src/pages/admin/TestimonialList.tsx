import {
    List,
    Datagrid,
    TextField,
    BooleanField,
    DateField,
    EditButton,
    DeleteButton,
    TopToolbar,
    CreateButton,
    FilterButton,
    TextInput,
    BooleanInput,
} from 'react-admin';
import { Card } from '@mui/material';

const TestimonialFilters = [
    <TextInput key="q" label="Поиск по названию компании" source="q" alwaysOn />,
    <BooleanInput key="isPublished" label="Опубликовано" source="isPublished" />,
];

const TestimonialListActions = () => (
    <TopToolbar>
        <FilterButton />
        <CreateButton />
    </TopToolbar>
);

export const TestimonialList = () => (
    <List
        title="Отзывы клиентов"
        filters={TestimonialFilters}
        actions={<TestimonialListActions />}
        perPage={25}
        sort={{ field: 'createdAt', order: 'DESC' }}
    >
        <Card className="overflow-hidden">
            <Datagrid
                bulkActionButtons={false}
                sx={{
                    '& .RaDatagrid-headerCell': {
                        backgroundColor: '#f8fafc',
                        fontWeight: 600,
                        color: '#475569',
                    },
                    '& .RaDatagrid-row:hover': {
                        backgroundColor: '#f1f5f9',
                    },
                }}
            >
                <TextField source="id" label="ID" />
                <TextField source="companyName" label="Название компании" />
                <TextField source="slug" label="Slug" />
                <BooleanField source="isPublished" label="Опубликовано" />
                <DateField source="createdAt" label="Дата создания" showTime />
                <EditButton />
                <DeleteButton />
            </Datagrid>
        </Card>
    </List>
);
