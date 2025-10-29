import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

interface CourseItem {
  id: number;
  title: string;
  shortDescription: string;
  slug: string;
  createdAt: string;
  isPublished: boolean;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка всех курсов
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`);
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <>
      <Helmet>
        <title>Курсы 1С - Обучение и повышение квалификации | ООО «Инженер-центр»</title>
        <meta
          name="description"
          content="Курсы и обучающие программы по 1С от ООО «Инженер-центр». Повышайте квалификацию вашей команды."
        />
      </Helmet>

      <div className="min-h-screen bg-modern-gray-50">
        {/* Основной контент */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-modern-primary-700">
              Курсы 1С
            </h1>
          </div>

          <div className="bg-modern-white rounded-xl shadow-modern p-8 mx-auto">
            {/* Список курсов */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-modern-gray-600">Загрузка курсов...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-modern-gray-600">Курсы скоро появятся</p>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/1c-courses/${course.slug}`}
                    className="group block bg-modern-gray-50 rounded-xl hover:shadow-lg transition-all duration-300 border border-modern-gray-200 hover:border-modern-primary-300"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="inline-flex items-center justify-center w-12 h-12 bg-modern-primary-100 rounded-lg group-hover:bg-modern-primary-200 transition-colors">
                            <AcademicCapIcon className="w-6 h-6 text-modern-primary-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-modern-gray-900 mb-2 group-hover:text-modern-primary-600 transition-colors duration-200">
                            {course.title}
                          </h3>
                          <p className="text-modern-gray-600 text-sm">
                            {course.shortDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Контактный блок */}
          <div className="mt-16">
            <div className="bg-modern-primary-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-modern-primary-900 mb-4 text-center">
                Хочешь записаться на курс?
              </h2>
              <p className="text-modern-primary-700 mb-6 text-center">
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
        </div>
      </div>
    </>
  );
};

export default Courses;
