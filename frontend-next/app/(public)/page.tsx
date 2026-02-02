import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';
import {
  fetchNews,
  fetchCompanyLife,
  fetchPromotions,
  fetchEvents,
  fetchReadySolutions,
  fetchTestimonials,
} from '@/lib/api';
import type {
  NewsItem,
  PromotionItem,
  EventItem,
  UnifiedPost,
  ReadySolutionItem,
  Testimonial,
} from '@/types';
import HeroSection from '@/components/HeroSection';
import AboutTabs from '@/components/AboutTabs';
import TestimonialSection from '@/components/TestimonialSection';
import SubscribeForm from '@/components/forms/SubscribeForm';

export const metadata: Metadata = {
  title: 'ООО «Инженер-центр» - Профессиональная автоматизация бизнеса',
  description:
    'Профессиональные услуги 1С: внедрение, сопровождение, техподдержка, обучение, IT-аутсорсинг. 30 лет опыта, 600+ довольных клиентов.',
  keywords: ['1С', 'Внедрение 1С', 'Сопровождение 1С', 'IT-аутсорсинг', 'Обучение 1С'],
  openGraph: {
    title: 'ООО «Инженер-центр» - Профессиональная автоматизация бизнеса',
    description:
      'Профессиональные услуги 1С: внедрение, сопровождение, техподдержка, обучение, IT-аутсорсинг.',
    type: 'website',
  },
};

export default async function HomePage() {
  // Загрузка данных на сервере (SSR)
  const [newsData, companyLifeData, promotionsData, eventsData, solutionsData, testimonialsData] =
    await Promise.all([
      fetchNews(10),
      fetchCompanyLife(10),
      fetchPromotions(10),
      fetchEvents(10),
      fetchReadySolutions(4),
      fetchTestimonials(),
    ]);

  // Выбираем случайный отзыв
  const randomTestimonial: Testimonial | null =
    testimonialsData && testimonialsData.length > 0
      ? testimonialsData[Math.floor(Math.random() * testimonialsData.length)]
      : null;

  // Объединяем все посты в один массив
  const allPosts: UnifiedPost[] = [
    ...newsData.map((item: NewsItem) => ({
      id: item.id,
      title: item.title,
      shortDescription: item.shortDescription,
      slug: item.slug,
      date: item.createdAt,
      type: 'news' as const,
      link: `/news/${item.slug}`,
      isPinned: item.isPinned,
      pinnedUntil: item.pinnedUntil,
    })),
    ...companyLifeData.map((item: NewsItem) => ({
      id: item.id,
      title: item.title,
      shortDescription: item.shortDescription,
      slug: item.slug,
      date: item.createdAt,
      type: 'companylife' as const,
      link: `/life/${item.slug}`,
      isPinned: item.isPinned,
      pinnedUntil: item.pinnedUntil,
    })),
    ...promotionsData.map((item: PromotionItem) => ({
      id: item.id,
      title: item.title,
      shortDescription: item.shortDescription,
      slug: item.slug,
      date: item.startDate,
      type: 'promotion' as const,
      link: `/promotions/${item.slug}`,
      isPinned: item.isPinned,
      pinnedUntil: item.pinnedUntil,
    })),
    ...eventsData.map((item: EventItem) => ({
      id: item.id,
      title: item.title,
      shortDescription: item.shortDescription,
      slug: item.slug,
      date: item.startDate,
      type: 'event' as const,
      link: `/events/${item.slug}`,
      isPinned: item.isPinned,
      pinnedUntil: item.pinnedUntil,
    })),
  ];

  // Фильтруем и сортируем посты
  const now = new Date();
  const pinnedPosts = allPosts.filter(
    (post) => post.isPinned && post.pinnedUntil && new Date(post.pinnedUntil) >= now
  );
  const regularPosts = allPosts.filter(
    (post) => !post.isPinned || !post.pinnedUntil || new Date(post.pinnedUntil) < now
  );

  pinnedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  regularPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const unifiedPosts = [...pinnedPosts, ...regularPosts];

  return (
    <>
      {/* Hero Section */}
      <HeroSection unifiedPosts={unifiedPosts} />

      {/* Готовые решения */}
      <section className="py-12 bg-modern-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-modern-gray-900 mb-4">
              Готовые решения 1С
            </h2>
            <p className="text-xl text-modern-gray-600">
              Проверенные решения для быстрого старта вашего бизнеса
            </p>
          </div>

          {solutionsData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {solutionsData.map((solution: ReadySolutionItem) => (
                  <Link
                    key={solution.slug}
                    href={`/ready-solutions/${solution.slug}`}
                    className="group bg-modern-white rounded-xl p-4 shadow-modern hover:shadow-modern-lg transition-all duration-200 transform hover:scale-105 flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <h3 className="text-lg font-semibold text-modern-gray-900 group-hover:text-modern-primary-600 transition-colors duration-200 flex-1">
                        {solution.title}
                      </h3>
                      <div className="flex flex-wrap gap-1 justify-end flex-shrink-0">
                        {solution.programs &&
                          solution.programs.length > 0 &&
                          solution.programs.slice(0, 2).map((programWrapper, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-modern-primary-100 text-modern-primary-700 rounded-full text-xs font-medium"
                            >
                              {programWrapper.program.shortName}
                            </span>
                          ))}
                        {solution.programs.length > 2 && (
                          <span className="px-2 py-1 bg-modern-gray-100 text-modern-gray-600 rounded-full text-xs font-medium">
                            ...
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-modern-gray-600 text-sm mb-4 line-clamp-4 flex-grow min-h-[4rem]">
                      {solution.shortDescription}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-lg font-bold text-modern-primary-600">
                        {solution.price !== null && solution.price !== undefined
                          ? `${solution.price.toLocaleString('ru-RU')} ₽`
                          : 'Цена по запросу'}
                      </span>
                      <ArrowRightIcon className="h-5 w-5 text-modern-gray-400 group-hover:text-modern-primary-600 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center">
                <Link
                  href="/ready-solutions"
                  className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
                >
                  Все готовые решения
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto bg-modern-white rounded-xl p-8 shadow-modern">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-modern-gray-900 mb-2">
                  Готовые решения скоро появятся
                </h3>
                <p className="text-modern-gray-600">
                  Мы работаем над наполнением раздела готовых решений.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* О компании с табами */}
      <AboutTabs />

      {/* Отзывы клиентов */}
      <TestimonialSection testimonial={randomTestimonial} />

      {/* Подписка на рассылку */}
      <section className="py-16 bg-modern-primary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <SubscribeForm
              title="Не пропустите важные новости!"
              description="Подпишитесь на нашу рассылку и получайте актуальную информацию о новых решениях, акциях и мероприятиях"
              className="mx-auto"
            />
          </div>
        </div>
      </section>
    </>
  );
}
