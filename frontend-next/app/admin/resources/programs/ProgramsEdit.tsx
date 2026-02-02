'use client';

import React from 'react';
import {
    Edit,
    SimpleForm,
    TextInput,
    required,
    SaveButton,
    Toolbar,
    ListButton,
    TopToolbar,
    useRecordContext,
} from 'react-admin';
import { Card, Typography, Box } from '@mui/material';

const ProgramEditToolbar = () => (
    <Toolbar>
        <SaveButton />
    </Toolbar>
);

const ProgramEditActions = () => (
    <TopToolbar>
        <ListButton />
    </TopToolbar>
);

const ProgramTitle = () => {
    const record = useRecordContext();
    return record ? `Редактирование: ${record.fullName}` : 'Редактирование программы';
};

export const ProgramsEdit = () => (
    <Edit
        title={<ProgramTitle />}
        actions={<ProgramEditActions />}
    >
        <Card className="p-6">
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Редактирование программы
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Измените информацию о программе. Все поля обязательны для заполнения.
                </Typography>
            </Box>

            <SimpleForm toolbar={<ProgramEditToolbar />}>
                <TextInput
                    source="fullName"
                    label="Полное название"
                    validate={required()}
                    fullWidth
                    helperText="Например: 1С:Бухгалтерия предприятия"
                    sx={{ mb: 2 }}
                />

                <TextInput
                    source="shortName"
                    label="Короткое название"
                    validate={required()}
                    fullWidth
                    helperText="Например: БП"
                    sx={{ mb: 2 }}
                />
            </SimpleForm>
        </Card>
    </Edit>
);
