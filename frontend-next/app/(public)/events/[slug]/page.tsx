import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import ShareButton from './ShareButton';
import RegistrationForm from './RegistrationForm';

interface EventData {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  eventDate: string;
  createdAt: string;
  isPublished: boolean;
  ours: boolean;
  registrationEnabled: boolean;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  eventLink?: string;
}

async function getEvent(slug: string): Promise<EventData | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/events/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return {
      title: 'Мероприятие не найдено - ООО «Инженер-центр»',
    };
  }

  return {
    title: `${event.metaTitle || event.title} - ООО «Инженер-центр»`,
    description: event.metaDescription || event.shortDescription,
    openGraph: {
      title: event.title,
      description: event.shortDescription,
    },
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    notFound();
  }

  const sanitizeHTML = (html: string) => html;
  const isPastEvent = new Date() > new Date(event.eventDate);
  const canRegister = event.registrationEnabled && !isPastEvent;

  return (
    <div className="min-h-screen bg-modern-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-4/5 mx-auto">
          {/* Навигация назад */}
          <div className="mb-8">
            <Link
              href="/events"
              className="inline-flex items-center text-modern-primary-600 hover:text-modern-primary-700 transition-colors duration-200 font-medium"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Все мероприятия
            </Link>
          </div>

          {/* Основной контент */}
          <article className="bg-modern-white rounded-xl shadow-modern overflow-hidden">
            {/* Заголовок */}
            <div className="p-8 lg:p-12 border-b border-modern-gray-200">
              <h1 className="text-3xl lg:text-4xl font-bold text-modern-gray-900 mb-6 leading-tight">
                {event.title}
              </h1>

              {/* Статусы и мета-информация */}
              <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Статус мероприятия */}
                  {isPastEvent ? (
                    <div className="flex items-center px-4 py-2 bg-modern-gray-100 text-modern-gray-600 rounded-full">
                      <XCircleIcon className="h-5 w-5 mr-2" />
                      <span className="font-medium">Завершено</span>
                    </div>
                  ) : (
                    <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      <span className="font-medium">Предстоит</span>
                    </div>
                  )}

                  {/* Тип мероприятия */}
                  <div
                    className={`flex items-center px-4 py-2 rounded-full ${
                      event.ours
                        ? 'bg-modern-primary-100 text-modern-primary-700'
                        : 'bg-modern-accent-100 text-modern-accent-700'
                    }`}
                  >
                    {event.ours ? (
                      <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                    ) : (
                      <AcademicCapIcon className="h-5 w-5 mr-2" />
                    )}
                    <span className="font-medium text-sm">{event.ours ? 'Наше' : 'Внешнее'}</span>
                  </div>

                  {canRegister && (
                    <div className="bg-gradient-to-r from-modern-primary-500 to-modern-primary-600 text-white px-6 py-2 rounded-lg font-medium text-sm">
                      📝 Регистрация открыта
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {event.eventLink && (
                    <a
                      href={event.eventLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-modern-primary-100 text-modern-primary-700 rounded-lg hover:bg-modern-primary-200 transition-colors duration-200 text-sm font-medium"
                    >
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Внешняя ссылка
                    </a>
                  )}

                  <ShareButton title={event.title} description={event.shortDescription} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-modern-gray-500">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-3 text-modern-primary-600" />
                  <div>
                    <div className="text-xs font-medium text-modern-gray-400 uppercase tracking-wider">
                      Дата
                    </div>
                    <div className="text-sm font-medium text-modern-gray-700">
                      {new Date(event.eventDate).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-3 text-modern-primary-600" />
                  <div>
                    <div className="text-xs font-medium text-modern-gray-400 uppercase tracking-wider">
                      Время
                    </div>
                    <div className="text-sm font-medium text-modern-gray-700">
                      {new Date(event.eventDate).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Содержимое мероприятия */}
            <div className="p-8 lg:p-12">
              <div
                className="prose prose-lg max-w-none
                  prose-headings:text-modern-gray-900 prose-headings:font-semibold
                  prose-p:text-modern-gray-700 prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-modern-primary-600 prose-a:hover:text-modern-primary-700 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-modern-gray-900 prose-strong:font-semibold
                  prose-ul:text-modern-gray-700 prose-ol:text-modern-gray-700
                  prose-li:mb-2 prose-li:leading-relaxed
                  prose-blockquote:border-l-4 prose-blockquote:border-modern-primary-500 prose-blockquote:bg-modern-primary-50 prose-blockquote:rounded-r-lg prose-blockquote:p-6 prose-blockquote:my-6
                  prose-code:bg-modern-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-modern-gray-800
                  prose-pre:bg-modern-gray-900 prose-pre:text-modern-gray-100 prose-pre:rounded-lg prose-pre:p-6
                  prose-img:rounded-lg prose-img:shadow-modern"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(event.content) }}
              />
            </div>

            {/* Форма регистрации */}
            {canRegister && <RegistrationForm slug={slug} />}
          </article>

          {/* Навигация внизу */}
          <div className="mt-12 text-center">
            <Link
              href="/events"
              className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Вернуться к мероприятиям
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
