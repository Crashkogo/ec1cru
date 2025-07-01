import React, { useState, useEffect } from 'react';
import {
    Card,
    Box,
    Typography,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider
} from '@mui/material';
import {
    PaperAirplaneIcon,
    ClockIcon,
    QueueListIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    CalendarDaysIcon,
    EnvelopeIcon,
    UsersIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

interface Newsletter {
    id: string;
    title: string;
    htmlContent: string;
    createdAt: string;
}

interface QueueStatus {
    queueLength: number;
    isProcessing: boolean;
    sentThisMinute: number;
    sentThisHour: number;
    limitsReached: boolean;
}

interface Campaign {
    id: string;
    subject: string;
    status: 'SCHEDULED' | 'SENDING' | 'COMPLETED' | 'FAILED';
    scheduledDate: string;
    totalRecipients: number;
    sentEmails: number;
    createdAt: string;
    template: {
        title: string;
    };
}

const NewslettersSend: React.FC = () => {
    const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [customSubject, setCustomSubject] = useState<string>('');
    const [scheduledDate, setScheduledDate] = useState<string>('');
    const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

    // Загрузка данных
    useEffect(() => {
        fetchNewsletters();
        fetchQueueStatus();
        fetchCampaigns();

        // Обновляем статус очереди каждые 30 секунд
        const interval = setInterval(fetchQueueStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNewsletters = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/newsletters/all`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNewsletters(response.data);
        } catch (error) {
            console.error('Error fetching newsletters:', error);
        }
    };

    const fetchQueueStatus = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/newsletters/queue/status`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setQueueStatus(response.data);
        } catch (error) {
            console.error('Error fetching queue status:', error);
        }
    };

    const fetchCampaigns = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/newsletters/campaigns`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCampaigns(response.data);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        }
    };

    const handleSendNewsletter = async () => {
        if (!selectedTemplate) {
            setAlert({ type: 'error', message: 'Выберите шаблон рассылки' });
            return;
        }

        setLoading(true);
        try {
            const payload: any = {
                templateId: selectedTemplate,
            };

            if (customSubject) {
                payload.subject = customSubject;
            }

            if (scheduledDate) {
                payload.scheduledDate = new Date(scheduledDate).toISOString();
            }

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/posts/newsletters/send`,
                payload,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );

            setAlert({ type: 'success', message: response.data.message });
            setConfirmDialog(false);
            setSelectedTemplate('');
            setCustomSubject('');
            setScheduledDate('');

            // Обновляем данные
            fetchQueueStatus();
            fetchCampaigns();
        } catch (error: any) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Ошибка при отправке рассылки'
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'SENDING': return 'info';
            case 'SCHEDULED': return 'warning';
            case 'FAILED': return 'error';
            default: return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'Завершена';
            case 'SENDING': return 'Отправляется';
            case 'SCHEDULED': return 'Запланирована';
            case 'FAILED': return 'Ошибка';
            default: return status;
        }
    };

    const selectedNewsletterTitle = newsletters.find(n => n.id === selectedTemplate)?.title || '';

    // Минимальная дата - текущий момент + 5 минут
    const minDateTime = new Date(Date.now() + 5 * 60 * 1000).toISOString().slice(0, 16);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-modern-gray-900">Управление рассылками</h1>
                    <p className="text-modern-gray-600 mt-1">Отправка и планирование email-рассылок</p>
                </div>
            </div>

            {alert && (
                <Alert
                    severity={alert.type}
                    onClose={() => setAlert(null)}
                    className="mb-4"
                >
                    {alert.message}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Форма отправки */}
                <Grid item xs={12} md={8}>
                    <Card className="!shadow-sm !border !border-modern-gray-200 !rounded-xl p-6">
                        <Typography variant="h6" className="!font-semibold !text-modern-gray-900 mb-4">
                            Новая рассылка
                        </Typography>

                        <div className="space-y-4">
                            <FormControl fullWidth>
                                <InputLabel>Шаблон рассылки</InputLabel>
                                <Select
                                    value={selectedTemplate}
                                    onChange={(e) => setSelectedTemplate(e.target.value)}
                                    label="Шаблон рассылки"
                                >
                                    {newsletters.map((newsletter) => (
                                        <MenuItem key={newsletter.id} value={newsletter.id}>
                                            {newsletter.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Тема письма (необязательно)"
                                value={customSubject}
                                onChange={(e) => setCustomSubject(e.target.value)}
                                placeholder={selectedNewsletterTitle || 'Будет использована тема из шаблона'}
                                helperText="Оставьте пустым, чтобы использовать название шаблона"
                            />

                            <TextField
                                fullWidth
                                type="datetime-local"
                                label="Запланировать отправку (необязательно)"
                                value={scheduledDate}
                                onChange={(e) => setScheduledDate(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    min: minDateTime
                                }}
                                helperText="Оставьте пустым для немедленной отправки"
                            />

                            <Box className="flex space-x-3 pt-4">
                                <Button
                                    variant="contained"
                                    onClick={() => setConfirmDialog(true)}
                                    disabled={!selectedTemplate || loading}
                                    startIcon={scheduledDate ? <CalendarDaysIcon className="h-4 w-4" /> : <PaperAirplaneIcon className="h-4 w-4" />}
                                    className="!bg-modern-primary-600 hover:!bg-modern-primary-700"
                                >
                                    {scheduledDate ? 'Запланировать' : 'Отправить сейчас'}
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setSelectedTemplate('');
                                        setCustomSubject('');
                                        setScheduledDate('');
                                    }}
                                    disabled={loading}
                                >
                                    Очистить
                                </Button>
                            </Box>
                        </div>
                    </Card>
                </Grid>

                {/* Статус очереди */}
                <Grid item xs={12} md={4}>
                    <Card className="!shadow-sm !border !border-modern-gray-200 !rounded-xl p-6">
                        <Typography variant="h6" className="!font-semibold !text-modern-gray-900 mb-4">
                            Статус очереди
                        </Typography>

                        {queueStatus && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-modern-gray-600">В очереди:</span>
                                    <Chip
                                        label={queueStatus.queueLength}
                                        size="small"
                                        color={queueStatus.queueLength > 0 ? 'info' : 'default'}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-modern-gray-600">Статус:</span>
                                    <Chip
                                        label={queueStatus.isProcessing ? 'Отправляется' : 'Ожидание'}
                                        size="small"
                                        color={queueStatus.isProcessing ? 'success' : 'default'}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-modern-gray-600">За минуту:</span>
                                    <span className="text-sm font-medium">
                                        {queueStatus.sentThisMinute}/30
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-modern-gray-600">За час:</span>
                                    <span className="text-sm font-medium">
                                        {queueStatus.sentThisHour}/1000
                                    </span>
                                </div>

                                {queueStatus.limitsReached && (
                                    <Alert severity="warning" className="!mt-3">
                                        Достигнут лимит отправки. Ожидание...
                                    </Alert>
                                )}

                                <LinearProgress
                                    variant="determinate"
                                    value={(queueStatus.sentThisMinute / 30) * 100}
                                    className="!mt-3"
                                />
                            </div>
                        )}
                    </Card>
                </Grid>

                {/* История рассылок */}
                <Grid item xs={12}>
                    <Card className="!shadow-sm !border !border-modern-gray-200 !rounded-xl p-6">
                        <Typography variant="h6" className="!font-semibold !text-modern-gray-900 mb-4">
                            История рассылок
                        </Typography>

                        <List>
                            {campaigns.map((campaign, index) => (
                                <React.Fragment key={campaign.id}>
                                    <ListItem className="!px-0">
                                        <ListItemIcon>
                                            <EnvelopeIcon className="h-5 w-5 text-modern-gray-500" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <div className="flex items-center space-x-3">
                                                    <span className="font-medium">{campaign.subject}</span>
                                                    <Chip
                                                        label={getStatusText(campaign.status)}
                                                        size="small"
                                                        color={getStatusColor(campaign.status) as any}
                                                    />
                                                </div>
                                            }
                                            secondary={
                                                <div className="flex items-center space-x-4 mt-1">
                                                    <span className="text-sm text-modern-gray-500">
                                                        Шаблон: {campaign.template.title}
                                                    </span>
                                                    <span className="text-sm text-modern-gray-500">
                                                        Получателей: {campaign.totalRecipients}
                                                    </span>
                                                    <span className="text-sm text-modern-gray-500">
                                                        {new Date(campaign.scheduledDate).toLocaleString('ru-RU')}
                                                    </span>
                                                </div>
                                            }
                                        />
                                    </ListItem>
                                    {index < campaigns.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}

                            {campaigns.length === 0 && (
                                <ListItem className="!px-0">
                                    <ListItemText
                                        primary="Рассылки не найдены"
                                        secondary="Создайте первую рассылку"
                                    />
                                </ListItem>
                            )}
                        </List>
                    </Card>
                </Grid>
            </Grid>

            {/* Диалог подтверждения */}
            <Dialog
                open={confirmDialog}
                onClose={() => setConfirmDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {scheduledDate ? 'Запланировать рассылку?' : 'Отправить рассылку?'}
                </DialogTitle>
                <DialogContent>
                    <div className="space-y-3">
                        <Typography>
                            <strong>Шаблон:</strong> {selectedNewsletterTitle}
                        </Typography>
                        <Typography>
                            <strong>Тема:</strong> {customSubject || selectedNewsletterTitle}
                        </Typography>
                        {scheduledDate && (
                            <Typography>
                                <strong>Время отправки:</strong> {new Date(scheduledDate).toLocaleString('ru-RU')}
                            </Typography>
                        )}
                        <Alert severity="info">
                            {scheduledDate
                                ? 'Рассылка будет запланирована и отправлена автоматически в указанное время.'
                                : 'Рассылка будет отправлена всем активным подписчикам немедленно.'
                            }
                        </Alert>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialog(false)}>
                        Отмена
                    </Button>
                    <Button
                        onClick={handleSendNewsletter}
                        variant="contained"
                        disabled={loading}
                        className="!bg-modern-primary-600 hover:!bg-modern-primary-700"
                    >
                        {loading ? 'Отправка...' : (scheduledDate ? 'Запланировать' : 'Отправить')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default NewslettersSend; 