import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { CourseSidebar } from '@/components/CourseSidebar';

interface CourseData {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface CourseItem {
  id: number;
  title: string;
  slug: string;
}

async function getCourse(slug: string): Promise<CourseData | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

async function getCoursesList(): Promise<CourseItem[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return { title: 'Курс не найден - ООО «Инженер-центр»' };
  return {
    title: `${course.metaTitle || course.title} - ООО «Инженер-центр»`,
    description: course.metaDescription || course.shortDescription,
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [course, coursesList] = await Promise.all([getCourse(slug), getCoursesList()]);

  if (!course) notFound();

  const sanitizeHTML = (html: string) => html;

  return (
    <div className="min-h-screen bg-modern-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Кнопка назад */}
        <div className="mb-6">
          <Link
            href="/1c-courses"
            className="inline-flex items-center text-modern-primary-600 hover:text-modern-primary-700 transition-colors duration-200 font-medium"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Все курсы
          </Link>
        </div>

        {/* Мобильный список курсов — показывается над статьёй */}
        {coursesList.length > 0 && (
          <div className="lg:hidden">
            <CourseSidebar courses={coursesList} currentSlug={slug} />
          </div>
        )}

        {/* Двухколоночный макет: сайдбар СЛЕВА, статья справа */}
        <div className="flex gap-8 items-start">
          {/* Сайдбар слева (только десктоп) */}
          {coursesList.length > 0 && (
            <div className="hidden lg:block">
              <CourseSidebar courses={coursesList} currentSlug={slug} />
            </div>
          )}

          {/* Контент курса */}
          <div className="flex-1 min-w-0">
            <article className="bg-modern-white rounded-xl shadow-modern overflow-hidden">
              <div className="p-8 lg:p-12 border-b border-modern-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-modern-primary-100 rounded-lg">
                    <AcademicCapIcon className="h-6 w-6 text-modern-primary-600" />
                  </div>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-modern-gray-900 mb-4 leading-tight">
                  {course.title}
                </h1>
                <p className="text-lg text-modern-gray-600">{course.shortDescription}</p>
              </div>

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
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(course.content) }}
                />
              </div>
            </article>
          </div>
        </div>

        {/* Контактный блок — вне двухколоночного макета, центрированный */}
        <div className="mt-10 bg-modern-primary-50 rounded-xl p-8 lg:p-12 border border-modern-primary-200">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-modern-primary-900 mb-4">
              Хотите записаться на курс?
            </h3>
            <p className="text-modern-primary-700 mb-6">
              Наши специалисты помогут с выбором курса под ваши нужды.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+78443300801"
                className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
              >
                📞 8 (8443) 300-801
              </a>
              <a
                href="mailto:mail@ec-1c.ru"
                className="inline-flex items-center px-6 py-3 bg-modern-white text-modern-primary-700 border-2 border-modern-primary-600 rounded-xl hover:bg-modern-primary-50 transition-colors duration-200 font-semibold"
              >
                ✉️ mail@ec-1c.ru
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/1c-courses"
            className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Вернуться к курсам
          </Link>
        </div>
      </div>
    </div>
  );
}
