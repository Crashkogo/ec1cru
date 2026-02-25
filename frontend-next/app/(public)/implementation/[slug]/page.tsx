import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircleIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { industriesData } from './industriesData';
import { IndustryCallbackButton } from '@/components/IndustryCallbackButton';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(industriesData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = industriesData[slug];
  if (!industry) return {};
  return {
    title: industry.seoTitle,
    description: industry.metaDescription,
  };
}

export default async function IndustryPage({ params }: PageProps) {
  const { slug } = await params;
  const industry = industriesData[slug];
  if (!industry) notFound();

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-modern-gray-50 border-b border-modern-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-modern-gray-500">
            <Link href="/" className="hover:text-modern-primary-600 transition-colors">
              Главная
            </Link>
            <span>/</span>
            <Link href="/implementation" className="hover:text-modern-primary-600 transition-colors">
              Внедрение
            </Link>
            <span>/</span>
            <span className="text-modern-gray-900 font-medium">{industry.title}</span>
          </nav>
        </div>
      </section>

      {/* Hero — светлый градиент в стиле сайта */}
      <section className="relative bg-gradient-to-br from-modern-primary-100 via-modern-white to-modern-accent-100 pt-12 pb-14 overflow-hidden">
        {/* Фоновый точечный узор */}
        <div className="absolute inset-0 opacity-40">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.05) 2px, transparent 2px)`,
              backgroundSize: '48px 48px',
            }}
          />
        </div>
        {/* Декоративный круг */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-modern-primary-100 rounded-full opacity-30 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            {/* Тег */}
            <span className="inline-flex items-center gap-1.5 bg-modern-primary-100 text-modern-primary-700 px-3 py-1 rounded-full text-sm font-semibold mb-5">
              <WrenchScrewdriverIcon className="h-4 w-4" />
              Отраслевое решение 1С
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-modern-gray-900 mb-5 leading-tight">
              {industry.title}
            </h1>
            <p className="text-modern-gray-600 text-lg leading-relaxed mb-8 max-w-2xl">
              {industry.heroText}
            </p>
            <IndustryCallbackButton />
          </div>
        </div>
      </section>

      {/* Боли отрасли */}
      <section className="py-14 bg-modern-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-modern-gray-900 mb-2">
              Типичные проблемы отрасли
            </h2>
            <p className="text-modern-gray-500">С чем сталкиваются предприятия до внедрения 1С</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {industry.pains.map((pain, i) => (
              <div
                key={i}
                className="bg-modern-gray-50 rounded-xl p-5 border border-modern-gray-200 hover:border-modern-primary-200 hover:shadow-modern transition-all duration-200"
              >
                <div className="text-3xl mb-3">{pain.icon}</div>
                <h3 className="font-bold text-modern-gray-900 mb-2 leading-snug">{pain.title}</h3>
                <p className="text-modern-gray-600 text-sm leading-relaxed">{pain.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Решения 1С */}
      <section className="py-14 bg-modern-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-modern-gray-900 mb-2">
              Решения 1С для вашей отрасли
            </h2>
            <p className="text-modern-gray-500">
              Подберём оптимальный продукт под задачи и масштаб вашего бизнеса
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-modern-gray-200 shadow-modern bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-modern-primary-100 bg-modern-primary-50">
                  <th className="text-left px-5 py-3.5 font-semibold text-modern-primary-700">
                    Продукт
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-modern-primary-700">
                    Для кого
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-modern-primary-700">
                    Что даёт
                  </th>
                </tr>
              </thead>
              <tbody>
                {industry.solutions.map((sol, i) => (
                  <tr
                    key={i}
                    className={`border-t border-modern-gray-100 ${
                      i % 2 === 0 ? 'bg-white' : 'bg-modern-gray-50/60'
                    } hover:bg-modern-primary-50/40 transition-colors duration-100`}
                  >
                    <td className="px-5 py-3.5 font-semibold text-modern-primary-700">
                      {sol.product}
                    </td>
                    <td className="px-5 py-3.5 text-modern-gray-600">{sol.audience}</td>
                    <td className="px-5 py-3.5 text-modern-gray-700">{sol.benefit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Что автоматизируем */}
      <section className="py-14 bg-modern-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-modern-gray-900 mb-2">Что автоматизируем</h2>
            <p className="text-modern-gray-500">
              Конкретные бизнес-процессы, которые мы берём на себя
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {industry.processes.map((process, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-modern-gray-50 rounded-xl border border-modern-gray-100 hover:border-modern-primary-200 hover:bg-modern-primary-50/30 transition-all duration-200"
              >
                <CheckCircleIcon className="h-5 w-5 text-modern-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-modern-gray-700 text-sm leading-relaxed">{process}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — карточка на сером фоне */}
      <section className="py-14 bg-modern-gray-50 border-t border-modern-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl shadow-modern-lg border border-modern-gray-200 px-8 py-12">
            {/* Иконка */}
            <div className="w-16 h-16 bg-modern-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <WrenchScrewdriverIcon className="h-8 w-8 text-modern-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-modern-gray-900 mb-3">
              Расскажите о задаче — подберём решение
            </h2>
            <p className="text-modern-gray-500 mb-8 leading-relaxed">
              Бесплатная консультация. Оценим задачи, подберём продукт и рассчитаем стоимость
              внедрения.
            </p>
            <IndustryCallbackButton label="Получить консультацию" />
          </div>
        </div>
      </section>

      {/* Назад */}
      <section className="py-5 bg-modern-gray-50 border-t border-modern-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/implementation"
            className="inline-flex items-center gap-2 text-modern-primary-600 hover:text-modern-primary-700 font-medium transition-colors text-sm"
          >
            ← Все отрасли
          </Link>
        </div>
      </section>
    </>
  );
}
