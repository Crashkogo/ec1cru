'use client';

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { Testimonial } from '@/types';

interface TestimonialSectionProps {
  testimonial: Testimonial | null;
}

export default function TestimonialSection({ testimonial }: TestimonialSectionProps) {
  if (!testimonial) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-modern-gray-50 to-modern-primary-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Заголовок секции */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-modern-gray-900 mb-4">
              Отзывы наших клиентов
            </h2>
            <p className="text-lg text-modern-gray-600">
              Мы гордимся доверием компаний, которые выбирают нас
            </p>
          </div>

          {/* Карточка отзыва */}
          <div className="bg-modern-white rounded-2xl shadow-modern-lg p-8 md:p-12 relative overflow-hidden">
            {/* Декоративный элемент */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-modern-primary-100/20 to-transparent rounded-full -mr-32 -mt-32"></div>

            {/* Иконка кавычек */}
            <div className="relative mb-6">
              <svg
                className="w-12 h-12 md:w-16 md:h-16 text-modern-primary-600 opacity-20"
                fill="currentColor"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
            </div>

            {/* Текст отзыва */}
            <div
              className="relative prose prose-lg max-w-none prose-headings:text-modern-gray-900 prose-p:text-modern-gray-700 prose-p:leading-relaxed mb-8"
              dangerouslySetInnerHTML={{ __html: testimonial.content }}
            />

            {/* Информация о компании */}
            <div className="relative flex items-center justify-between pt-6 border-t border-modern-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-modern-primary-100 to-modern-primary-200 flex items-center justify-center border-2 border-modern-primary-300 mr-4">
                  <span className="text-modern-primary-700 font-semibold text-lg">
                    {testimonial.companyName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-modern-gray-900 text-lg">
                    {testimonial.companyName}
                  </h4>
                  <p className="text-modern-gray-500 text-sm">Клиент</p>
                </div>
              </div>

              {/* Ссылка на полный отзыв */}
              <Link
                href={`/otzyvy/${testimonial.slug}`}
                className="inline-flex items-center text-modern-primary-600 hover:text-modern-primary-700 transition-colors duration-200 text-sm font-medium group"
              >
                Подробнее
                <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>

          {/* Кнопка "Посмотреть все отзывы" */}
          <div className="text-center mt-8">
            <Link
              href="/otzyvy"
              className="inline-flex items-center justify-center px-8 py-4 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold text-lg shadow-lg hover:shadow-xl group"
            >
              Посмотреть все отзывы
              <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
