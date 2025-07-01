import React from 'react';
import {
    Edit,
    SimpleForm,
    TextInput,
    BooleanInput,
    required,
    SaveButton,
    Toolbar,
    ListButton,
    TopToolbar,
} from 'react-admin';
import { Card, Box, Typography } from '@mui/material';

const SubscribersEditActions = () => (
    <TopToolbar>
        <ListButton />
    </TopToolbar>
);

const SubscribersEditToolbar = () => (
    <Toolbar>
        <SaveButton />
    </Toolbar>
);

export const SubscribersEdit = () => (
    <Edit title="Редактирование подписчика" actions={<SubscribersEditActions />}>
        <Card className="p-6">
            <SimpleForm toolbar={<SubscribersEditToolbar />}>
                <TextInput
                    source="email"
                    label="Email"
                    validate={[required()]}
                    fullWidth
                    type="email"
                />

                <BooleanInput
                    source="isActive"
                    label="Активная подписка"
                />
            </SimpleForm>
        </Card>
    </Edit>
); 