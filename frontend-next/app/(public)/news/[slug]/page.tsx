import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeftIcon,
  ClockIcon,
  CalendarIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import ShareButton from './ShareButton';

interface News {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  createdAt: string;
  isPublished: boolean;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
}

async function getNews(slug: string): Promise<News | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/news/${slug}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching news:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNews(slug);

  if (!news) {
    return {
      title: 'Новость не найдена - ООО «Инженер-центр»',
    };
  }

  return {
    title: `${news.metaTitle || news.title} - ООО «Инженер-центр»`,
    description: news.metaDescription || news.shortDescription,
    openGraph: {
      title: news.title,
      description: news.shortDescription,
    },
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news = await getNews(slug);

  if (!news) {
    notFound();
  }

  const sanitizeHTML = (html: string) => {
    // Basic sanitization - в продакшене лучше использовать библиотеку типа DOMPurify
    return html;
  };

  return (
    <div className="min-h-screen bg-modern-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-4/5 mx-auto">
          {/* Навигация назад */}
          <div className="mb-8">
            <Link
              href="/news"
              className="inline-flex items-center text-modern-primary-600 hover:text-modern-primary-700 transition-colors duration-200 font-medium"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Все новости
            </Link>
          </div>

          {/* Основной контент */}
          <article className="bg-modern-white rounded-xl shadow-modern overflow-hidden">
            {/* Заголовок */}
            <div className="p-8 lg:p-12 border-b border-modern-gray-200">
              <h1 className="text-3xl lg:text-4xl font-bold text-modern-gray-900 mb-6 leading-tight">
                {news.title}
              </h1>

              {/* Мета-информация и действия */}
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex flex-wrap items-center gap-6 text-modern-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">
                      {new Date(news.createdAt).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">
                      {new Date(news.createdAt).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <ShareButton title={news.title} description={news.shortDescription} />
              </div>
            </div>

            {/* Содержимое новости */}
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
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(news.content) }}
              />
            </div>
          </article>

          {/* Навигация внизу */}
          <div className="mt-12 text-center">
            <Link
              href="/news"
              className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Вернуться к новостям
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
