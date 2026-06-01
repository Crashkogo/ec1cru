'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

interface CourseItem {
  id: number;
  title: string;
  shortDescription: string;
  slug: string;
  createdAt: string;
  isPublished: boolean;
}

const ADVANTAGES = [
  'Авторская (уникальная) методика преподавания курсов, разработанных компанией 1С',
  'Дополнительные материалы для использования в работе',
  'Выполнение практических заданий в программе 1С',
  'Дистанционное обучение',
  'Персональные консультации с преподавателем',
];

const TRAINING_ROWS = [
  { label: 'Лекционные и практические занятия с преподавателем по двум курсам', online: true,  offline: true  },
  { label: 'Видеозаписи занятий',                                               online: true,  offline: false },
  { label: 'Учебные материалы в печатном виде',                                 online: false, offline: true  },
  { label: 'Учебные материалы в электронном виде',                              online: true,  offline: false },
  { label: 'Доступ в облачную 1С: Бухгалтерию',                                online: true,  offline: true  },
  { label: 'Поддержка преподавателя',                                            online: true,  offline: true  },
  { label: 'Нетворкинг и живое общение',                                        online: false, offline: true  },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`);
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-modern-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-4/5 mx-auto">
          <article className="bg-modern-white rounded-xl shadow-modern overflow-hidden">
            <div className="p-8 lg:p-12 space-y-12">

              {/* Заголовок */}
              <h1 className="text-4xl md:text-5xl font-bold text-center text-modern-primary-700">
                Курсы 1С
              </h1>

              {/* Блок преимуществ */}
              <section>
                <p className="text-xs font-bold uppercase tracking-widest text-modern-accent-600 mb-4">
                  Наши преимущества
                </p>
                <div className="border-2 border-modern-accent-300 rounded-xl p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {ADVANTAGES.map((text) => (
                      <div key={text} className="flex items-start gap-3">
                        <span className="mt-0.5 flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-modern-primary-600">
                          <CheckIcon className="w-3 h-3 text-white" />
                        </span>
                        <span className="text-modern-gray-700 text-sm leading-snug">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Плитки курсов */}
              <section>
                {loading ? (
                  <div className="text-center py-12 text-modern-gray-500">Загрузка курсов...</div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-12 text-modern-gray-500">Курсы скоро появятся</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {courses.map((course) => (
                      <Link
                        key={course.id}
                        href={`/1c-courses/${course.slug}`}
                        className="group flex flex-col bg-modern-gray-50 border border-modern-gray-200 rounded-xl p-6 hover:border-modern-primary-400 hover:shadow-modern-lg transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 bg-modern-primary-100 rounded-lg group-hover:bg-modern-primary-200 transition-colors">
                            <AcademicCapIcon className="w-5 h-5 text-modern-primary-600" />
                          </div>
                          <h3 className="text-base font-bold text-modern-gray-900 group-hover:text-modern-primary-700 transition-colors leading-snug">
                            {course.title}
                          </h3>
                        </div>
                        <p className="text-sm text-modern-gray-500 line-clamp-2 leading-relaxed">
                          {course.shortDescription}
                        </p>
                        <span className="mt-4 text-sm font-semibold text-modern-primary-600 group-hover:underline">
                          Подробнее →
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              {/* Таблица «В обучение входит» */}
              <section>
                <h2 className="text-2xl font-bold text-modern-gray-800 mb-6">В обучение входит</h2>
                <div className="overflow-x-auto rounded-xl border border-modern-gray-200">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-modern-gray-50">
                        <th className="text-left py-4 px-5 font-medium text-modern-gray-600 border-b border-modern-gray-200 w-2/3" />
                        <th className="py-4 px-6 font-semibold text-modern-primary-700 border-b border-modern-gray-200 bg-modern-primary-50 text-center">
                          Онлайн
                        </th>
                        <th className="py-4 px-6 font-semibold text-modern-primary-700 border-b border-modern-gray-200 bg-modern-primary-50 text-center">
                          Очно
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {TRAINING_ROWS.map((row, idx) => (
                        <tr
                          key={row.label}
                          className={idx % 2 === 0 ? 'bg-modern-white' : 'bg-modern-gray-50'}
                        >
                          <td className="py-3 px-5 text-modern-gray-700 border-b border-modern-gray-100">
                            {row.label}
                          </td>
                          <td className="py-3 px-6 text-center border-b border-modern-gray-100">
                            {row.online && (
                              <CheckIcon className="w-5 h-5 text-modern-primary-700 mx-auto" />
                            )}
                          </td>
                          <td className="py-3 px-6 text-center border-b border-modern-gray-100">
                            {row.offline && (
                              <CheckIcon className="w-5 h-5 text-modern-primary-700 mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

            </div>
          </article>

          {/* Контактный блок */}
          <div className="mt-8 bg-modern-primary-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-modern-primary-900 mb-2 text-center">
              Хочешь записаться на курс?
            </h2>
            <p className="text-modern-primary-700 mb-6 text-center text-sm">
              Наши специалисты помогут с выбором курса под ваши нужды.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+78443300801"
                className="inline-flex items-center gap-2 px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
              >
                <PhoneIcon className="w-4 h-4" />
                8 (8443) 300-801
              </a>
              <a
                href="mailto:mail@ec-1c.ru"
                className="inline-flex items-center gap-2 px-6 py-3 bg-modern-white text-modern-primary-700 border-2 border-modern-primary-600 rounded-xl hover:bg-modern-primary-50 transition-colors duration-200 font-semibold"
              >
                <EnvelopeIcon className="w-4 h-4" />
                mail@ec-1c.ru
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
