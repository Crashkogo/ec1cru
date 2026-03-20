import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircleIcon, WrenchScrewdriverIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
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

      {/* Результаты внедрения */}
      {industry.results && (
        <section className="py-14 bg-modern-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-modern-gray-900 mb-2">
                Результаты внедрения
              </h2>
              <p className="text-modern-gray-500">
                Типичные показатели после запуска системы на предприятиях отрасли
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {industry.results.map((r, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 border border-modern-gray-200 shadow-sm hover:shadow-modern hover:border-modern-primary-200 transition-all duration-200"
                >
                  <div className="text-3xl mb-3">{r.icon}</div>
                  <div className="text-3xl font-bold text-modern-primary-600 mb-1 leading-none">
                    {r.metric}
                  </div>
                  <div className="text-sm font-semibold text-modern-gray-900 mb-2">{r.label}</div>
                  <p className="text-xs text-modern-gray-500 leading-relaxed">{r.description}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-modern-gray-400 text-center">
              * Показатели основаны на типичных результатах внедрений в отрасли. Конкретные цифры
              зависят от масштаба и специфики предприятия.
            </p>
          </div>
        </section>
      )}

      {/* Решения 1С */}
      <section className="py-14 bg-modern-white">
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

      {/* Как проходит внедрение */}
      <section className="py-14 bg-modern-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-modern-gray-900 mb-2">
              Как проходит внедрение
            </h2>
            <p className="text-modern-gray-500">
              Структурированный процесс без остановки вашей работы
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {[
              {
                n: '1',
                title: 'Аудит',
                duration: '1–2 нед.',
                text: 'Изучаем текущие процессы, фиксируем требования, определяем объём работ',
              },
              {
                n: '2',
                title: 'Проектирование',
                duration: '1–2 нед.',
                text: 'Проектируем архитектуру системы, согласовываем план и стоимость',
              },
              {
                n: '3',
                title: 'Настройка',
                duration: '4–12 нед.',
                text: 'Настраиваем конфигурацию, разрабатываем доработки под ваши процессы',
              },
              {
                n: '4',
                title: 'Обучение',
                duration: '1–2 нед.',
                text: 'Обучаем каждую группу пользователей, тестируем совместно',
              },
              {
                n: '5',
                title: 'Запуск',
                duration: 'ongoing',
                text: 'Переходим на боевую систему, сопровождаем в первые месяцы работы',
              },
            ].map((step) => (
              <div
                key={step.n}
                className="relative bg-white rounded-xl p-5 border border-modern-gray-200 hover:border-modern-primary-200 hover:shadow-modern transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-full bg-modern-primary-600 text-white flex items-center justify-center text-sm font-bold mb-4 shadow-sm">
                  {step.n}
                </div>
                <div className="text-base font-bold text-modern-gray-900 mb-0.5">{step.title}</div>
                <div className="text-xs font-medium text-modern-primary-600 mb-2">{step.duration}</div>
                <p className="text-sm text-modern-gray-600 leading-relaxed">{step.text}</p>
              </div>
            ))}
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

      {/* Кейсы */}
      {industry.cases && (
        <section className="py-14 bg-modern-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-modern-gray-900 mb-2">
                Примеры из практики
              </h2>
              <p className="text-modern-gray-500">
                Типичные проекты, которые мы реализуем в этой отрасли
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {industry.cases.map((c, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-modern-gray-200 overflow-hidden shadow-sm hover:shadow-modern transition-all duration-200"
                >
                  <div className="bg-modern-primary-50 border-b border-modern-primary-100 px-5 py-3">
                    <span className="text-sm font-semibold text-modern-primary-700">{c.tag}</span>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="text-xs font-semibold text-modern-gray-400 uppercase tracking-wide mb-1">
                        Проблема
                      </div>
                      <p className="text-sm text-modern-gray-700 leading-relaxed">{c.problem}</p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-modern-gray-400 uppercase tracking-wide mb-1">
                        Решение
                      </div>
                      <p className="text-sm text-modern-gray-700 leading-relaxed">{c.solution}</p>
                    </div>
                    <div className="bg-modern-primary-50 rounded-lg p-4 border border-modern-primary-100">
                      <div className="text-xs font-semibold text-modern-primary-600 uppercase tracking-wide mb-1">
                        Результат
                      </div>
                      <p className="text-sm text-modern-primary-900 font-medium leading-relaxed">
                        {c.result}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-14 bg-modern-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-start gap-3">
            <div className="w-10 h-10 bg-modern-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <QuestionMarkCircleIcon className="h-5 w-5 text-modern-primary-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-modern-gray-900 mb-1">
                Часто задаваемые вопросы
              </h2>
              <p className="text-modern-gray-500">Ответы на вопросы, которые мы слышим чаще всего</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              {
                question: 'Сколько стоит внедрение 1С?',
                answer:
                  'Зависит от конфигурации и масштаба. Для малого бизнеса — от 150 тыс. руб. (лицензии + базовая настройка). Крупный проект с доработками — от 500 тыс. руб. Оцениваем задачи бесплатно на первичной консультации.',
              },
              {
                question: 'Сколько времени занимает внедрение?',
                answer:
                  'Базовая настройка — 1–3 месяца. Комплексный проект с разработкой доработок — 3–6 месяцев. Сроки зависят от сложности процессов и скорости предоставления данных со стороны клиента.',
              },
              {
                question: 'Придётся останавливать работу компании?',
                answer:
                  'Нет. Внедрение идёт параллельно с текущей работой. На финальном этапе «перехода» требуется 1–2 рабочих дня для переноса остатков и тестирования.',
              },
              {
                question: 'Наши сотрудники смогут разобраться в системе?',
                answer:
                  'Обучение пользователей входит в проект. Мы проводим занятия отдельно для каждой группы: бухгалтерия, менеджеры, склад. Оставляем видеозаписи и инструкции.',
              },
              {
                question: 'У нас уже есть старая 1С — это проблема?',
                answer:
                  'Нет. Мы переносим данные из любой версии 1С: справочники, контрагентов, остатки. Накопленная история не теряется.',
              },
              {
                question: 'Можно ли доработать систему под наши нестандартные процессы?',
                answer:
                  'Да, доработки — одно из ключевых направлений нашей работы. Любое изменение оформляем в техническое задание и согласовываем стоимость до начала работ.',
              },
              ...(industry.faqExtra || []),
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-modern-gray-50 rounded-xl p-5 border border-modern-gray-200 hover:border-modern-primary-200 transition-colors duration-200"
              >
                <h3 className="font-semibold text-modern-gray-900 mb-2 leading-snug">
                  {faq.question}
                </h3>
                <p className="text-sm text-modern-gray-600 leading-relaxed">{faq.answer}</p>
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
