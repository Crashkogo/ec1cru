import React from 'react';
import {
    Show,
    SimpleShowLayout,
    TextField,
    DateField,
    ListButton,
    TopToolbar,
    useRecordContext,
} from 'react-admin';
import { Card, Typography, Box, Chip } from '@mui/material';

const UserShowActions = () => (
    <TopToolbar>
        <ListButton />
    </TopToolbar>
);

const UserTitle = () => {
    const record = useRecordContext();
    return record ? `Пользователь: ${record.name}` : 'Пользователь';
};

const RoleField = () => {
    const record = useRecordContext();
    if (!record) return null;

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return { bgcolor: '#f44336', color: 'white' }; // красный
            case 'MODERATOR':
                return { bgcolor: '#ff9800', color: 'white' }; // оранжевый
            case 'EVENTORG':
                return { bgcolor: '#2196f3', color: 'white' }; // синий
            case 'CLINE':
                return { bgcolor: '#4caf50', color: 'white' }; // зеленый
            case 'ITS':
                return { bgcolor: '#9c27b0', color: 'white' }; // фиолетовый
            case 'DEVDEP':
                return { bgcolor: '#607d8b', color: 'white' }; // серый
            default:
                return { bgcolor: '#757575', color: 'white' }; // серый по умолчанию
        }
    };

    const getRoleName = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'Администратор';
            case 'MODERATOR': return 'Модератор';
            case 'EVENTORG': return 'Организатор событий';
            case 'CLINE': return 'Клиент';
            case 'ITS': return 'ИТ-специалист';
            case 'DEVDEP': return 'Разработчик';
            default: return role;
        }
    };

    return (
        <Chip
            label={getRoleName(record.role)}
            size="medium"
            sx={{
                fontSize: '0.875rem',
                fontWeight: 'bold',
                ...getRoleColor(record.role)
            }}
        />
    );
};

export const UserShow = () => (
    <Show
        title={<UserTitle />}
        actions={<UserShowActions />}
    >
        <Card className="p-6">
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Информация о пользователе
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Подробная информация о пользователе системы.
                </Typography>
            </Box>

            <SimpleShowLayout>
                <TextField source="id" label="ID пользователя" />
                <TextField source="name" label="Имя пользователя" />
                <RoleField label="Роль" />
                <DateField
                    source="createdAt"
                    label="Дата создания"
                    locales="ru-RU"
                    showTime
                />
            </SimpleShowLayout>
        </Card>
    </Show>
); 