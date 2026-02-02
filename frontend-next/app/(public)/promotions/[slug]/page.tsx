import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

interface PromotionData {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  startDate: string;
  endDate: string;
  status: boolean;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
}

async function getPromotion(slug: string): Promise<PromotionData | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/promotions/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching promotion:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const promotion = await getPromotion(slug);

  if (!promotion) {
    return {
      title: 'Акция не найдена - ООО «Инженер-центр»',
    };
  }

  return {
    title: `${promotion.metaTitle || promotion.title} - ООО «Инженер-центр»`,
    description: promotion.metaDescription || promotion.shortDescription,
    openGraph: {
      title: promotion.title,
      description: promotion.shortDescription,
    },
  };
}

export default async function PromotionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const promotion = await getPromotion(slug);

  if (!promotion) {
    notFound();
  }

  const sanitizeHTML = (html: string) => html;

  return (
    <div className="min-h-screen bg-modern-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-4/5 mx-auto">
          <div className="mb-8">
            <Link
              href="/promotions"
              className="inline-flex items-center text-modern-accent-600 hover:text-modern-accent-700 transition-colors duration-200 font-medium"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Все акции
            </Link>
          </div>

          <article className="bg-modern-white rounded-xl shadow-modern overflow-hidden">
            <div className="p-8 lg:p-12 border-b border-modern-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-modern-accent-100 rounded-lg">
                  <TagIcon className="h-6 w-6 text-modern-accent-600" />
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    promotion.status
                      ? 'bg-green-100 text-green-700'
                      : 'bg-modern-gray-100 text-modern-gray-600'
                  }`}
                >
                  {promotion.status ? 'Активна' : 'Завершена'}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-modern-gray-900 mb-6 leading-tight">
                {promotion.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-modern-gray-500">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-modern-accent-600" />
                  <span className="text-sm">
                    С {new Date(promotion.startDate).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2 text-modern-accent-600" />
                  <span className="text-sm">
                    До {new Date(promotion.endDate).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 lg:p-12">
              <div
                className="prose prose-lg max-w-none
                  prose-headings:text-modern-gray-900 prose-headings:font-semibold
                  prose-p:text-modern-gray-700 prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-modern-accent-600 prose-a:hover:text-modern-accent-700 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-modern-gray-900 prose-strong:font-semibold
                  prose-ul:text-modern-gray-700 prose-ol:text-modern-gray-700
                  prose-li:mb-2 prose-li:leading-relaxed
                  prose-blockquote:border-l-4 prose-blockquote:border-modern-accent-500 prose-blockquote:bg-modern-accent-50 prose-blockquote:rounded-r-lg prose-blockquote:p-6 prose-blockquote:my-6
                  prose-code:bg-modern-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-modern-gray-800
                  prose-pre:bg-modern-gray-900 prose-pre:text-modern-gray-100 prose-pre:rounded-lg prose-pre:p-6
                  prose-img:rounded-lg prose-img:shadow-modern"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(promotion.content) }}
              />
            </div>
          </article>

          <div className="mt-12 text-center">
            <Link
              href="/promotions"
              className="inline-flex items-center px-6 py-3 bg-modern-accent-600 text-white rounded-xl hover:bg-modern-accent-700 transition-colors duration-200 font-semibold"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Вернуться к акциям
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
