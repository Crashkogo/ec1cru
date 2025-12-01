import { useEffect, useState } from 'react';
import { Card, Chip, IconButton } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface Registration {
    id: number;
    name: string;
    email: string;
    phone: string;
    organization: string;
    privacyConsent: boolean;
    createdAt: string;
}

export const EventRegistrationsList = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRegistrations = async () => {
            if (!id) return;

            try {
                // БЕЗОПАСНОСТЬ: HttpOnly cookies отправляются автоматически через withCredentials
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/posts/admin/events/registrations?eventId=${id}`,
                    { withCredentials: true }
                );
                console.log('Fetched registrations:', response.data);
                setRegistrations(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching registrations:', err);
                setError('Ошибка загрузки регистраций');
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, [id]);

    const handleBack = () => {
        navigate('/admin#/events');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-modern-primary-600 mx-auto"></div>
                    <p className="mt-4 text-modern-gray-600">Загрузка...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={handleBack}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-modern-gray-100 text-modern-gray-700 rounded-lg hover:bg-modern-gray-200 transition-colors duration-200"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Назад к мероприятиям
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-modern-gray-900">Регистрации на мероприятие</h1>
                    <p className="text-modern-gray-600 mt-1">
                        Список зарегистрированных участников ({registrations.length})
                    </p>
                </div>
                <button
                    onClick={handleBack}
                    className="inline-flex items-center px-4 py-2 bg-modern-gray-100 text-modern-gray-700 rounded-lg hover:bg-modern-gray-200 transition-colors duration-200 text-sm font-medium"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Назад к мероприятиям
                </button>
            </div>

            {/* Content Card */}
            <Card className="shadow-sm border border-modern-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-modern-gray-200">
                        <thead className="bg-modern-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-modern-gray-500 uppercase tracking-wider">
                                    Имя
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-modern-gray-500 uppercase tracking-wider">
                                    Организация
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-modern-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-modern-gray-500 uppercase tracking-wider">
                                    Телефон
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-modern-gray-500 uppercase tracking-wider">
                                    Согласие
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-modern-gray-500 uppercase tracking-wider">
                                    Дата регистрации
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-modern-gray-200">
                            {registrations.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-modern-gray-500">
                                        Нет зарегистрированных участников
                                    </td>
                                </tr>
                            ) : (
                                registrations.map((registration) => (
                                    <tr key={registration.id} className="hover:bg-modern-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-modern-gray-900">
                                            {registration.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-modern-gray-600">
                                            {registration.organization}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-modern-gray-600">
                                            <a
                                                href={`mailto:${registration.email}`}
                                                className="text-modern-primary-600 hover:text-modern-primary-700"
                                            >
                                                {registration.email}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-modern-gray-600">
                                            {registration.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {registration.privacyConsent ? (
                                                <Chip
                                                    icon={<CheckCircleIcon className="h-4 w-4" />}
                                                    label="Да"
                                                    size="small"
                                                    className="bg-green-100 text-green-800"
                                                />
                                            ) : (
                                                <Chip
                                                    icon={<XCircleIcon className="h-4 w-4" />}
                                                    label="Нет"
                                                    size="small"
                                                    className="bg-red-100 text-red-800"
                                                />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-modern-gray-600">
                                            {formatDate(registration.createdAt)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

