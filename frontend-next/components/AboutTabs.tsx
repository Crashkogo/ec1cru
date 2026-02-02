'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function AboutTabs() {
  const [activeAboutTab, setActiveAboutTab] = useState('history');

  return (
    <section className="py-16 bg-modern-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-modern-gray-900 text-center mb-12">
            О компании
          </h2>

          {/* Переключатели */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveAboutTab('history')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeAboutTab === 'history'
                  ? 'bg-modern-primary-600 text-white shadow-modern-md'
                  : 'bg-modern-gray-100 text-modern-gray-700 hover:bg-modern-gray-200'
              }`}
            >
              История
            </button>
            <button
              onClick={() => setActiveAboutTab('team')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeAboutTab === 'team'
                  ? 'bg-modern-primary-600 text-white shadow-modern-md'
                  : 'bg-modern-gray-100 text-modern-gray-700 hover:bg-modern-gray-200'
              }`}
            >
              Наша команда
            </button>
            <button
              onClick={() => setActiveAboutTab('careers')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeAboutTab === 'careers'
                  ? 'bg-modern-primary-600 text-white shadow-modern-md'
                  : 'bg-modern-gray-100 text-modern-gray-700 hover:bg-modern-gray-200'
              }`}
            >
              Вакансии
            </button>
          </div>

          {/* Контент */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Левая часть - текст */}
            <div className="space-y-6">
              {activeAboutTab === 'history' && (
                <>
                  <h3 className="text-2xl font-bold text-modern-gray-900">История компании</h3>
                  <div className="space-y-4 text-modern-gray-600">
                    <p>
                      Компания «ООО «Инженер-центр»» - ведущий региональный интегратор решений 1С
                      с 30-летним опытом работы на рынке автоматизации бизнеса.
                    </p>
                    <p>
                      За годы работы мы успешно реализовали более 50 проектов внедрения,
                      обслуживаем свыше 600 клиентов различного масштаба - от небольших
                      предприятий до крупных корпораций.
                    </p>
                    <p>
                      Наша команда состоит из сертифицированных специалистов, которые постоянно
                      повышают квалификацию и следят за новейшими тенденциями в области
                      информационных технологий.
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 pt-4">
                    <span className="text-3xl font-bold text-modern-primary-600">30</span>
                    <span className="text-modern-gray-600">лет успешной работы на рынке</span>
                  </div>
                  <Link
                    href="/about"
                    className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
                  >
                    Подробнее о компании
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </Link>
                </>
              )}

              {activeAboutTab === 'team' && (
                <>
                  <h3 className="text-2xl font-bold text-modern-gray-900">Наша команда</h3>
                  <div className="space-y-4 text-modern-gray-600">
                    <p>
                      Наша команда - это высококвалифицированные специалисты с многолетним опытом
                      работы в области автоматизации бизнес-процессов.
                    </p>
                    <p>
                      Мы объединяем профессионалов различных направлений: разработчиков,
                      консультантов по внедрению, специалистов технической поддержки и
                      преподавателей учебного центра.
                    </p>
                    <p>
                      Каждый член команды имеет официальные сертификаты 1С и регулярно проходит
                      обучение для поддержания высокого уровня экспертизы.
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 pt-4">
                    <span className="text-3xl font-bold text-modern-primary-600">25+</span>
                    <span className="text-modern-gray-600">сертифицированных специалистов</span>
                  </div>
                  <Link
                    href="/team"
                    className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
                  >
                    Познакомиться с командой
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </Link>
                </>
              )}

              {activeAboutTab === 'careers' && (
                <>
                  <h3 className="text-2xl font-bold text-modern-gray-900">
                    Карьера в нашей компании
                  </h3>
                  <div className="space-y-4 text-modern-gray-600">
                    <p>
                      Мы всегда рады видеть в нашей команде талантливых и амбициозных
                      специалистов, готовых развиваться в сфере информационных технологий.
                    </p>
                    <p>
                      Предлагаем стабильную работу в дружном коллективе, возможности
                      профессионального роста, обучение за счет компании и участие в интересных
                      проектах.
                    </p>
                    <p>
                      Мы предоставляем менторскую поддержку и помогаем раскрыть потенциал каждого
                      сотрудника.
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 pt-4">
                    <span className="text-3xl font-bold text-modern-primary-600">5+</span>
                    <span className="text-modern-gray-600">открытых вакансий</span>
                  </div>
                  <Link
                    href="/careers"
                    className="inline-flex items-center px-6 py-3 bg-modern-primary-600 text-white rounded-xl hover:bg-modern-primary-700 transition-colors duration-200 font-semibold"
                  >
                    Посмотреть вакансии
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </Link>
                </>
              )}
            </div>

            {/* Правая часть - изображение */}
            <div className="flex justify-center">
              <div className="relative">
                {activeAboutTab === 'history' && (
                  <div className="w-80 h-80 bg-gradient-to-br from-modern-primary-100 to-modern-primary-200 rounded-2xl flex items-center justify-center shadow-modern-lg">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-modern-primary-600 mb-4">30</div>
                      <div className="text-xl font-semibold text-modern-primary-700">лет опыта</div>
                      <div className="text-modern-primary-600 mt-2">на рынке 1С</div>
                    </div>
                  </div>
                )}

                {activeAboutTab === 'team' && (
                  <div className="w-80 h-80 bg-gradient-to-br from-modern-accent-100 to-modern-accent-200 rounded-2xl flex items-center justify-center shadow-modern-lg">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-modern-accent-600 mb-4">25+</div>
                      <div className="text-xl font-semibold text-modern-accent-700">
                        специалистов
                      </div>
                      <div className="text-modern-accent-600 mt-2">в нашей команде</div>
                    </div>
                  </div>
                )}

                {activeAboutTab === 'careers' && (
                  <div className="w-80 h-80 bg-gradient-to-br from-modern-gray-100 to-modern-gray-200 rounded-2xl flex items-center justify-center shadow-modern-lg">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-modern-gray-600 mb-4">5+</div>
                      <div className="text-xl font-semibold text-modern-gray-700">вакансий</div>
                      <div className="text-modern-gray-600 mt-2">ждут вас</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
