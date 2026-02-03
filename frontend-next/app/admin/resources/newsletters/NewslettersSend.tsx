'use client';

import queryString from 'query-string';
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
    Divider,
    RadioGroup,
    FormControlLabel,
    Radio,
    SelectChangeEvent
} from '@mui/material';
import {
    PaperAirplaneIcon,
    CalendarDaysIcon,
    EnvelopeIcon,
    MegaphoneIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

interface Newsletter {
    id: number;
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
    id: number;
    subject: string;
    status: 'SCHEDULED' | 'SENDING' | 'COMPLETED' | 'FAILED';
    scheduledAt: string;
    audienceType: 'SUBSCRIBERS' | 'EVENT_GUESTS';
    audienceEventId?: number;
    sentCount: number;
    failedCount?: number;
    createdAt: string;
    template: {
        title: string;
    };
}

interface EventItem {
    id: number;
    title: string;
    startDate: string;
}

interface SendPayload {
    templateId: number;
    audience: {
        type: 'SUBSCRIBERS' | 'EVENT_GUESTS';
        eventId?: number;
    };
    subject?: string;
    scheduledAt?: string;
}

type AlertType = 'success' | 'error' | 'info';

interface AlertState {
    type: AlertType;
    message: string;
}

const NewslettersSend: React.FC = () => {
    const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<number | ''>('');
    const [customSubject, setCustomSubject] = useState<string>('');
    const [scheduledDate, setScheduledDate] = useState<string>('');
    const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [alert, setAlert] = useState<AlertState | null>(null);

    const [audienceType, setAudienceType] = useState<'SUBSCRIBERS' | 'EVENT_GUESTS'>('SUBSCRIBERS');
    const [selectedEventId, setSelectedEventId] = useState<number | ''>('');
    const [eventsList, setEventsList] = useState<EventItem[]>([]);

    // Загрузка данных
    useEffect(() => {
        fetchNewsletters();
        fetchQueueStatus();
        fetchCampaigns();
        fetchRecentEvents();

        const interval = setInterval(fetchQueueStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNewsletters = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/newsletters/all`, {
                withCredentials: true
            });
            setNewsletters(response.data);
        } catch (error) {
            console.error('Error fetching newsletters:', error);
        }
    };

    const fetchQueueStatus = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/newsletters/queue/status`, {
                withCredentials: true
            });
            setQueueStatus(response.data);
        } catch (error) {
            console.error('Error fetching queue status:', error);
        }
    };

    const fetchCampaigns = async () => {
        try {
            const query = {
                _start: "0",
                _end: "10",
                _sort: "createdAt",
                _order: "DESC",
            };
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/newsletters/campaigns?${queryString.stringify(query)}`, {
                withCredentials: true
            });
            setCampaigns(response.data);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        }
    };

    const fetchRecentEvents = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/events/recent`, {
                withCredentials: true
            });
            setEventsList(response.data);
        } catch (error) {
            console.error('Error fetching recent events:', error);
        }
    };

    const handleSendNewsletter = async () => {
        if (!selectedTemplate) {
            setAlert({ type: 'error', message: 'Выберите шаблон рассылки' });
            return;
        }
        if (audienceType === 'EVENT_GUESTS' && !selectedEventId) {
            setAlert({ type: 'error', message: 'Выберите мероприятие для рассылки' });
            return;
        }

        setLoading(true);
        try {
            const payload: SendPayload = {
                templateId: selectedTemplate as number,
                audience: {
                    type: audienceType,
                    ...(audienceType === 'EVENT_GUESTS' && { eventId: selectedEventId as number })
                }
            };

            if (customSubject) {
                payload.subject = customSubject;
            }

            if (scheduledDate) {
                payload.scheduledAt = new Date(scheduledDate).toISOString();
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/posts/newsletters/send`,
                payload,
                { withCredentials: true }
            );

            setAlert({ type: 'success', message: response.data.message });
            setConfirmDialog(false);
            setSelectedTemplate('');
            setCustomSubject('');
            setScheduledDate('');
            setAudienceType('SUBSCRIBERS');
            setSelectedEventId('');

            fetchQueueStatus();
            fetchCampaigns();
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            setAlert({
                type: 'error',
                message: err.response?.data?.message || 'Ошибка при отправке рассылки'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRetryCampaign = async (campaignId: number) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/posts/newsletters/campaigns/${campaignId}/retry`,
                {},
                { withCredentials: true }
            );

            setAlert({ type: 'success', message: response.data.message });
            fetchQueueStatus();
            fetchCampaigns();
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            setAlert({
                type: 'error',
                message: err.response?.data?.message || 'Ошибка при повторной отправке'
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string): 'success' | 'info' | 'warning' | 'error' | 'default' => {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'SENDING': return 'info';
            case 'SCHEDULED': return 'warning';
            case 'FAILED': return 'error';
            default: return 'default';
        }
    };

    const getStatusText = (status: string): string => {
        switch (status) {
            case 'COMPLETED': return 'Завершена';
            case 'SENDING': return 'Отправляется';
            case 'SCHEDULED': return 'Запланирована';
            case 'FAILED': return 'Ошибка';
            default: return status;
        }
    };

    const selectedNewsletterTitle = newsletters.find(n => n.id === selectedTemplate)?.title || '';
    const selectedEventTitle = eventsList.find(e => e.id === selectedEventId)?.title || '';

    const minDateTime = new Date(Date.now() + 5 * 60 * 1000).toISOString().slice(0, 16);

    const handleTemplateChange = (event: SelectChangeEvent<number | ''>) => {
        setSelectedTemplate(event.target.value as number | '');
    };

    const handleEventChange = (event: SelectChangeEvent<number | ''>) => {
        setSelectedEventId(event.target.value as number | '');
    };

    return (
        <div className="space-y-6">
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
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card className="!shadow-sm !border !border-modern-gray-200 !rounded-xl p-6">
                        <Typography variant="h6" className="!font-semibold !text-modern-gray-900 mb-4">
                            Новая рассылка
                        </Typography>

                        <div className="space-y-4">
                            <FormControl fullWidth>
                                <InputLabel>Шаблон рассылки</InputLabel>
                                <Select
                                    value={selectedTemplate}
                                    onChange={handleTemplateChange}
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

                            {/* Выбор аудитории */}
                            <FormControl component="fieldset" fullWidth>
                                <Typography variant="subtitle1" className="!font-medium !text-modern-gray-700 mb-2">
                                    Аудитория рассылки
                                </Typography>
                                <RadioGroup
                                    row
                                    value={audienceType}
                                    onChange={(e) => setAudienceType(e.target.value as 'SUBSCRIBERS' | 'EVENT_GUESTS')}
                                >
                                    <FormControlLabel value="SUBSCRIBERS" control={<Radio />} label="Всем подписчикам" />
                                    <FormControlLabel value="EVENT_GUESTS" control={<Radio />} label="Участникам мероприятия" />
                                </RadioGroup>
                            </FormControl>

                            {audienceType === 'EVENT_GUESTS' && (
                                <FormControl fullWidth>
                                    <InputLabel>Выберите мероприятие</InputLabel>
                                    <Select
                                        value={selectedEventId}
                                        onChange={handleEventChange}
                                        label="Выберите мероприятие"
                                        startAdornment={<MegaphoneIcon className="h-5 w-5 text-modern-gray-400 mr-2" />}
                                    >
                                        {eventsList.map((event) => (
                                            <MenuItem key={event.id} value={event.id}>
                                                {event.title} ({new Date(event.startDate).toLocaleDateString()})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}

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
                                    disabled={!selectedTemplate || (audienceType === 'EVENT_GUESTS' && !selectedEventId) || loading}
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
                                        setAudienceType('SUBSCRIBERS');
                                        setSelectedEventId('');
                                    }}
                                    disabled={loading}
                                >
                                    Очистить
                                </Button>
                            </Box>
                        </div>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
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

                <Grid size={12}>
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
                                                        color={getStatusColor(campaign.status)}
                                                    />
                                                </div>
                                            }
                                            secondary={
                                                <div className="flex items-center space-x-4 mt-1">
                                                    <span className="text-sm text-modern-gray-500">
                                                        Шаблон: {campaign.template.title}
                                                    </span>
                                                    <span className="text-sm text-modern-gray-500">
                                                        Аудитория: {
                                                            campaign.audienceType === 'SUBSCRIBERS'
                                                                ? 'Все подписчики'
                                                                : `Участники мероприятия ${eventsList.find(e => e.id === campaign.audienceEventId)?.title || campaign.audienceEventId}`
                                                        }
                                                    </span>
                                                    <span className="text-sm text-modern-gray-500">
                                                        Отправлено: {campaign.sentCount} / Ошибки: {campaign.failedCount || 0}
                                                    </span>
                                                    <span className="text-sm text-modern-gray-500">
                                                        {new Date(campaign.scheduledAt).toLocaleString('ru-RU')}
                                                    </span>
                                                </div>
                                            }
                                            primaryTypographyProps={{ component: 'div' }}
                                            secondaryTypographyProps={{ component: 'div' }}
                                        />
                                        {(campaign.status === 'FAILED' || campaign.status === 'SENDING') && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleRetryCampaign(campaign.id)}
                                                disabled={loading}
                                                startIcon={<ArrowPathIcon className="h-4 w-4" />}
                                                className="!ml-2"
                                            >
                                                Повторить
                                            </Button>
                                        )}
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
                        <Typography>
                            <strong>Аудитория:</strong> {
                                audienceType === 'SUBSCRIBERS'
                                    ? 'Все подписчики'
                                    : `Участники мероприятия ${selectedEventTitle}`
                            }
                        </Typography>
                        {scheduledDate && (
                            <Typography>
                                <strong>Время отправки:</strong> {new Date(scheduledDate).toLocaleString('ru-RU')}
                            </Typography>
                        )}
                        <Alert severity="info">
                            {scheduledDate
                                ? 'Рассылка будет запланирована и отправлена автоматически в указанное время.'
                                : 'Рассылка будет отправлена выбранной аудитории немедленно.'
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
                        startIcon={<PaperAirplaneIcon className="h-4 w-4" />}
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
