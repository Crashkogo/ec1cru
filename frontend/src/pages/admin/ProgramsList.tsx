import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    CreateButton,
    TopToolbar,
    SearchInput,
    FilterForm,
    EditButton,
    DeleteButton,
    ShowButton,
    BulkDeleteButton,
    BulkExportButton,
    Pagination,
    useRecordContext,
} from 'react-admin';
import { Card, Chip, Box } from '@mui/material';

const ProgramsFilter = () => (
    <FilterForm>
        <SearchInput source="q" placeholder="Поиск по названию" alwaysOn />
    </FilterForm>
);

const ProgramsListActions = () => (
    <TopToolbar>
        <CreateButton />
    </TopToolbar>
);

const ProgramsPagination = () => <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />;

const ProgramsBulkActionButtons = () => (
    <>
        <BulkExportButton />
        <BulkDeleteButton />
    </>
);

const ProgramNameField = () => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>{record.fullName}</span>
            <Chip
                label={record.shortName}
                size="small"
                variant="outlined"
                sx={{
                    fontSize: '0.75rem',
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    border: 'none'
                }}
            />
        </Box>
    );
};

export const ProgramsList = () => (
    <Card className="p-6">
        <List
            filters={<ProgramsFilter />}
            actions={<ProgramsListActions />}
            pagination={<ProgramsPagination />}
            perPage={25}
            sort={{ field: 'fullName', order: 'ASC' }}
            title="Управление программами"
        >
            <Datagrid
                bulkActionButtons={<ProgramsBulkActionButtons />}
                sx={{
                    '& .RaDatagrid-headerCell': {
                        fontWeight: 'bold',
                    },
                    '& .RaDatagrid-rowCell': {
                        paddingY: 1,
                    },
                }}
            >
                <TextField source="id" label="ID" />
                <ProgramNameField label="Название программы" />
                <TextField source="fullName" label="Полное название" />
                <TextField source="shortName" label="Короткое название" />
                <DateField
                    source="createdAt"
                    label="Дата создания"
                    locales="ru-RU"
                    showTime
                />
                <ShowButton />
                <EditButton />
                <DeleteButton />
            </Datagrid>
        </List>
    </Card>
); 