'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AcademicCapIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface CourseItem {
  id: number;
  title: string;
  slug: string;
}

interface CourseSidebarProps {
  courses: CourseItem[];
  currentSlug: string;
}

export function CourseSidebar({ courses, currentSlug }: CourseSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentCourse = courses.find((c) => c.slug === currentSlug);

  return (
    <>
      {/* Мобильный выпадающий список (< lg) */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 bg-modern-white border border-modern-gray-200 rounded-xl shadow-sm font-medium text-modern-gray-800"
        >
          <span className="flex items-center gap-2 truncate">
            <AcademicCapIcon className="h-5 w-5 text-modern-primary-600 flex-shrink-0" />
            <span className="truncate">
              {currentCourse ? currentCourse.title : 'Выбрать курс'}
            </span>
          </span>
          {mobileOpen ? (
            <ChevronUpIcon className="h-5 w-5 text-modern-gray-500 flex-shrink-0" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-modern-gray-500 flex-shrink-0" />
          )}
        </button>

        {mobileOpen && (
          <div className="mt-1 bg-modern-white border border-modern-gray-200 rounded-xl shadow-lg overflow-hidden">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/1c-courses/${course.slug}`}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 text-sm border-b border-modern-gray-100 last:border-0 transition-colors duration-150 ${
                  course.slug === currentSlug
                    ? 'bg-modern-primary-50 text-modern-primary-700 font-semibold'
                    : 'text-modern-gray-700 hover:bg-modern-gray-50'
                }`}
              >
                {course.title}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Десктопный сайдбар (>= lg) */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-6 bg-modern-white rounded-xl shadow-modern border border-modern-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-modern-primary-600 flex items-center gap-2">
            <AcademicCapIcon className="h-5 w-5 text-white flex-shrink-0" />
            <span className="font-semibold text-white text-sm">Все курсы 1С</span>
          </div>
          <nav className="max-h-[calc(100vh-120px)] overflow-y-auto">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/1c-courses/${course.slug}`}
                className={`block px-4 py-3 text-sm border-b border-modern-gray-100 last:border-0 transition-colors duration-150 leading-snug ${
                  course.slug === currentSlug
                    ? 'bg-modern-primary-50 text-modern-primary-700 font-semibold border-l-4 border-l-modern-primary-600'
                    : 'text-modern-gray-700 hover:bg-modern-gray-50 hover:text-modern-primary-600'
                }`}
              >
                {course.title}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
