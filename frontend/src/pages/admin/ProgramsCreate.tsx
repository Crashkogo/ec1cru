import React from 'react';
import {
    Create,
    SimpleForm,
    TextInput,
    required,
    SaveButton,
    Toolbar,
    ListButton,
    TopToolbar,
} from 'react-admin';
import { Card, Typography, Box } from '@mui/material';

const ProgramCreateToolbar = () => (
    <Toolbar>
        <SaveButton />
    </Toolbar>
);

const ProgramCreateActions = () => (
    <TopToolbar>
        <ListButton />
    </TopToolbar>
);

export const ProgramsCreate = () => (
    <Create
        title="Создание программы"
        actions={<ProgramCreateActions />}
    >
        <Card className="p-6">
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Добавление новой программы
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Заполните информацию о программе. Все поля обязательны для заполнения.
                </Typography>
            </Box>

            <SimpleForm toolbar={<ProgramCreateToolbar />}>
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
    </Create>
); 