import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  UsersIcon,
  TrophyIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// Импортируем видео
import companyVideo from '../assets/1cfranc_compwithhumanface.mp4';

const About: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>О компании - ООО «Инженер-центр»</title>
        <meta
          name="description"
          content="Инженер-Центр — более 30 лет опыта на рынке автоматизации бизнеса. Внедрение, поддержка и разработка решений 1С для 1500+ компаний по всей России."
        />
      </Helmet>

      <div className="min-h-screen bg-modern-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-4/5 mx-auto">
            <article className="bg-modern-white rounded-xl shadow-modern overflow-hidden">
              <div className="p-8 lg:p-12">
                
                {/* Заголовок */}
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-modern-primary-700">
                  ИНЖЕНЕР-ЦЕНТР
                </h1>

                {/* Секция 1: История и Видео */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-16">
                  {/* Текст истории */}
                  <div className="lg:w-1/2 text-lg text-modern-gray-700 leading-relaxed space-y-4">
                    <p>
                      Инженер-Центр успешно развивается на IT-рынке с 1993 года. Более 30 лет выполняет работы по внедрению,
                      разработке, установке и сопровождению программ.
                    </p>
                    <p>
                      С 2015 года является Центром сопровождения, выдерживая высокий стандарт качества по обслуживанию клиентов.
                    </p>
                    <p>
                      Нашими услугами воспользовались более 1500 компаний. В настоящий момент на сопровождении находится 660 организаций.
                    </p>
                  </div>

                  {/* Видео плеер */}
                  <div className="lg:w-1/2 flex justify-center">
                    <video
                      className="w-full max-w-md rounded-lg shadow-modern-lg"
                      src={companyVideo}
                      controls
                      muted
                      autoPlay
                      loop
                      playsInline
                    >
                      Ваш браузер не поддерживает видео тег.
                    </video>
                  </div>
                </div>

                {/* Секция 2: Иконки с достижениями */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                  {/* Блок 1 */}
                  <div className="flex flex-col items-center text-center p-6 bg-modern-gray-50 rounded-xl shadow-sm hover:shadow-modern transition-all duration-200">
                    <div className="mb-4 p-4 bg-modern-primary-100 rounded-full">
                      <UsersIcon className="h-12 w-12 text-modern-primary-600" />
                    </div>
                    <p className="text-lg font-semibold text-modern-gray-800 leading-relaxed">
                      1500 компаний по всей России
                    </p>
                  </div>

                  {/* Блок 2 */}
                  <div className="flex flex-col items-center text-center p-6 bg-modern-gray-50 rounded-xl shadow-sm hover:shadow-modern transition-all duration-200">
                    <div className="mb-4 p-4 bg-modern-accent-100 rounded-full">
                      <TrophyIcon className="h-12 w-12 text-modern-accent-600" />
                    </div>
                    <p className="text-lg font-semibold text-modern-gray-800 leading-relaxed">
                      Победитель номинации «Прорыв года» премии «Партнёр года 1С:ИТС 2024»
                    </p>
                  </div>

                  {/* Блок 3 */}
                  <div className="flex flex-col items-center text-center p-6 bg-modern-gray-50 rounded-xl shadow-sm hover:shadow-modern transition-all duration-200">
                    <div className="mb-4 p-4 bg-modern-primary-100 rounded-full">
                      <ClockIcon className="h-12 w-12 text-modern-primary-600" />
                    </div>
                    <p className="text-lg font-semibold text-modern-gray-800 leading-relaxed">
                      30 лет опыта на рынке автоматизации бизнеса
                    </p>
                  </div>
                </div>

                {/* Горизонтальная отсечка */}
                <div className="relative mb-16">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-modern-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-modern-white px-6 text-modern-gray-400 text-sm font-medium">
                      •••
                    </span>
                  </div>
                </div>

                {/* Секция 3: Миссия и Видео */}
                <div className="flex flex-col lg:flex-row-reverse items-center lg:items-start gap-8 mb-16">
                  {/* Текст Миссии */}
                  <div className="lg:w-1/2 text-lg text-modern-gray-700 leading-relaxed">
                    <h2 className="text-3xl font-bold mb-6 text-modern-primary-600">
                      Миссия
                    </h2>
                    <p>
                      Помогать клиентам в повышении эффективности бизнеса, показывая своим примером возможность честного
                      взаимовыгодного сотрудничества, основанного на доверии, приносящего радость и удовлетворение его участникам!
                    </p>
                  </div>

                  {/* Видео плеер */}
                  <div className="lg:w-1/2 flex justify-center">
                    <video
                      className="w-full max-w-md rounded-lg shadow-modern-lg"
                      src={companyVideo}
                      controls
                      muted
                      autoPlay
                      loop
                      playsInline
                    >
                      Ваш браузер не поддерживает видео тег.
                    </video>
                  </div>
                </div>

                {/* Секция 4: С чем помогаем клиентам */}
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-modern-primary-600">
                    С чем помогаем клиентам?
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Блок 1: Внедрение 1С */}
                    <div className="p-6 bg-modern-gray-50 rounded-xl shadow-sm hover:shadow-modern transition-all duration-200 border-l-4 border-modern-primary-500">
                      <h3 className="text-xl font-semibold mb-3 text-modern-primary-700">
                        Внедрение 1С
                      </h3>
                      <p className="text-modern-gray-700 leading-relaxed">
                        Понимаем бизнес-процессы в разных отраслях. Думаем об эффективности цифровизации и не забываем о безопасности.
                        Настроим 1С, сделаем нужные интеграции и обучим сотрудников.
                      </p>
                    </div>

                    {/* Блок 2: Поддержка 1С */}
                    <div className="p-6 bg-modern-gray-50 rounded-xl shadow-sm hover:shadow-modern transition-all duration-200 border-l-4 border-modern-accent-500">
                      <h3 className="text-xl font-semibold mb-3 text-modern-accent-700">
                        Поддержка 1С
                      </h3>
                      <p className="text-modern-gray-700 leading-relaxed">
                        В вашем распоряжении — команда экспертов с опытом в самых разных задачах: от ускорения 1С до расчёта себестоимости.
                        Всё, чтобы вы использовали возможности программы на максимум.
                      </p>
                    </div>

                    {/* Блок 3: Индивидуальная разработка в 1С */}
                    <div className="p-6 bg-modern-gray-50 rounded-xl shadow-sm hover:shadow-modern transition-all duration-200 border-l-4 border-modern-primary-500">
                      <h3 className="text-xl font-semibold mb-3 text-modern-primary-700">
                        Индивидуальная разработка в 1С
                      </h3>
                      <p className="text-modern-gray-700 leading-relaxed">
                        Если функционала вашей 1С уже не хватает — доработаем её бережно и системно: с учётом дальнейшей поддержки
                        и без вреда для основного функционала.
                      </p>
                    </div>

                    {/* Блок 4: Интеграция 1С с другими программами */}
                    <div className="p-6 bg-modern-gray-50 rounded-xl shadow-sm hover:shadow-modern transition-all duration-200 border-l-4 border-modern-accent-500">
                      <h3 className="text-xl font-semibold mb-3 text-modern-accent-700">
                        Интеграция 1С с другими программами
                      </h3>
                      <p className="text-modern-gray-700 leading-relaxed">
                        Настроим обмен вашей 1С с сайтом компании, маркетплейсами и другими конфигурациями 1С.
                      </p>
                    </div>

                    {/* Блок 5: Индивидуальное и групповое обучение */}
                    <div className="md:col-span-2 max-w-xl mx-auto p-6 bg-modern-gray-50 rounded-xl shadow-sm hover:shadow-modern transition-all duration-200 border-l-4 border-modern-primary-500">
                      <h3 className="text-xl font-semibold mb-3 text-modern-primary-700">
                        Индивидуальное и групповое обучение
                      </h3>
                      <p className="text-modern-gray-700 leading-relaxed">
                        Проведем качественное и быстрое обучение пользователей для работы в новой для них программе.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </article>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;