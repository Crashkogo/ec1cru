import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeftIcon,
  ComputerDesktopIcon,
  DocumentTextIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';

interface Program {
  id: number;
  shortName: string;
}

interface ReadySolutionData {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  price: number | null;
  type: 'PROCESSING' | 'PRINT_FORM' | 'REPORT';
  freshSupport: boolean;
  programs: { program: Program }[];
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
}

async function getReadySolution(slug: string): Promise<ReadySolutionData | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/ready-solutions/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching ready solution:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const solution = await getReadySolution(slug);

  if (!solution) {
    return {
      title: 'Решение не найдено - ООО «Инженер-центр»',
    };
  }

  return {
    title: `${solution.metaTitle || solution.title} - ООО «Инженер-центр»`,
    description: solution.metaDescription || solution.shortDescription,
  };
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'PROCESSING':
      return <ComputerDesktopIcon className="h-6 w-6 text-modern-primary-600" />;
    case 'PRINT_FORM':
      return <PrinterIcon className="h-6 w-6 text-modern-primary-600" />;
    case 'REPORT':
      return <DocumentTextIcon className="h-6 w-6 text-modern-primary-600" />;
    default:
      return <DocumentTextIcon className="h-6 w-6 text-modern-primary-600" />;
  }
};

const getTypeName = (type: string) => {
  switch (type) {
    case 'PROCESSING':
      return 'Обработка';
    case 'PRINT_FORM':
      return 'Печатная форма';
    case 'REPORT':
      return 'Отчёт';
    default:
      return type;
  }
};

export default async function ReadySolutionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = await getReadySolution(slug);

  if (!solution) {
    notFound();
  }

  const sanitizeHTML = (html: string) => html;

  return (
    <div className="min-h-screen bg-modern-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-4/5 mx-auto">
          <div className="mb-8">
            <Link
              href="/ready-solutions"
              className="inline-flex items-center text-modern-primary-600 hover:text-modern-primary-700 transition-colors duration-200 font-medium"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Все решения
            </Link>
          </div>

          <article className="bg-modern-white rounded-xl shadow-modern overflow-hidden">
            <div className="p-8 lg:p-12 border-b border-modern-gray-200">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-modern-primary-100 rounded-lg">
                    {getTypeIcon(solution.type)}
                  </div>
                  <div>
                    <div className="text-sm text-modern-gray-500 mb-1">
                      {getTypeName(solution.type)}
                    </div>
                    {solution.freshSupport && (
                      <span className="px-2 py-1 bg-modern-accent-100 text-modern-accent-700 rounded-full text-xs font-medium">
                        1C:Fresh
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-modern-primary-600">
                    {solution.price !== null && solution.price !== undefined
                      ? `${solution.price.toLocaleString('ru-RU')} ₽`
                      : 'Цена по запросу'}
                  </div>
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-modern-gray-900 mb-4 leading-tight">
                {solution.title}
              </h1>

              <div className="flex flex-wrap gap-2 mb-4">
                {solution.programs.map((p) => (
                  <span
                    key={p.program.id}
                    className="px-3 py-1 bg-modern-primary-50 text-modern-primary-700 rounded-full text-sm font-medium"
                  >
                    {p.program.shortName}
                  </span>
                ))}
              </div>

              <p className="text-lg text-modern-gray-600">{solution.shortDescription}</p>
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
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(solution.content) }}
              />
            </div>

            {/* Контактный блок */}
            <div className="bg-modern-primary-50 p-8 lg:p-12 border-t border-modern-primary-200">
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-2xl font-bold text-modern-primary-900 mb-4">
                  Заинтересовало решение?
                </h3>
                <p className="text-modern-primary-700 mb-6">
                  Свяжитесь с нами для получения дополнительной информации и заказа
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
          </article>

          <div className="mt-12 text-center">
            <Link
              href="/ready-solutions"
              className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Все решения
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
