import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ComputerDesktopIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  BellAlertIcon,
  ChartBarIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

const Zabbix: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Zabbix - Мониторинг IT-инфраструктуры - ООО «Инженер-центр»</title>
        <meta
          name="description"
          content="Профессиональная система мониторинга Zabbix для контроля серверов, сетевого оборудования и рабочих станций 24/7"
        />
        <meta name="keywords" content="zabbix, мониторинг it инфраструктуры, мониторинг серверов, системы мониторинга" />
      </Helmet>

      <div className="min-h-screen bg-modern-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-4/5 mx-auto">
            <article className="bg-modern-white rounded-xl shadow-modern overflow-hidden">
              <div className="p-8 lg:p-12">

                {/* Заголовок */}
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-modern-primary-700">
                  Zabbix
                </h1>

                {/* Вводный блок */}
                <div className="mb-16 space-y-6 text-lg text-modern-gray-700 leading-relaxed">
                  <p>
                    <strong>Zabbix</strong> - это программное обеспечение, которое используется для мониторинга и управления различными аспектами информационных систем. Он может отслеживать такие важные параметры, как загрузка процессора, использование памяти, доступность сети, работы служб и многое другое.
                  </p>
                  <p>
                    Если что-то идет не так или возникают проблемы, Zabbix предупреждает администратора или ответственного за техническую поддержку, чтобы они могли быстро реагировать и устранить неполадки до того, как они повлияют на работоспособность системы.
                  </p>
                </div>

                {/* Горизонтальная отсечка */}
                <div className="relative mb-16">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t-2 border-modern-primary-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-modern-white px-6 text-2xl font-bold text-modern-primary-600">
                      Zabbix – это
                    </span>
                  </div>
                </div>

                {/* Секция преимуществ с иконками */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  {/* Преимущество 1 */}
                  <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-modern-primary-50 to-modern-white rounded-xl shadow-sm hover:shadow-modern transition-all duration-200">
                    <div className="mb-4 p-4 bg-modern-primary-100 rounded-full">
                      <ComputerDesktopIcon className="h-12 w-12 text-modern-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-modern-gray-800 mb-3">
                      Уверенность в том, что ничего не сломается
                    </h3>
                    <p className="text-base text-modern-gray-700 leading-relaxed">
                      Постоянный мониторинг компьютеров.
                    </p>
                  </div>

                  {/* Преимущество 2 */}
                  <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-modern-accent-50 to-modern-white rounded-xl shadow-sm hover:shadow-modern transition-all duration-200">
                    <div className="mb-4 p-4 bg-modern-accent-100 rounded-full">
                      <ShieldCheckIcon className="h-12 w-12 text-modern-accent-600" />
                    </div>
                    <h3 className="text-xl font-bold text-modern-gray-800 mb-3">
                      Спокойствие и комфорт
                    </h3>
                    <p className="text-base text-modern-gray-700 leading-relaxed">
                      Не нужно переживать за работоспособность компьютеров.
                    </p>
                  </div>

                  {/* Преимущество 3 */}
                  <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-modern-primary-50 to-modern-white rounded-xl shadow-sm hover:shadow-modern transition-all duration-200">
                    <div className="mb-4 p-4 bg-modern-primary-100 rounded-full">
                      <CurrencyDollarIcon className="h-12 w-12 text-modern-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-modern-gray-800 mb-3">
                      Отсутствие дополнительного персонала и сокращение издержек
                    </h3>
                    <p className="text-base text-modern-gray-700 leading-relaxed">
                      Все происходит удаленно, нет необходимости содержать отдельные штатные единицы.
                    </p>
                  </div>

                  {/* Преимущество 4 */}
                  <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-modern-accent-50 to-modern-white rounded-xl shadow-sm hover:shadow-modern transition-all duration-200">
                    <div className="mb-4 p-4 bg-modern-accent-100 rounded-full">
                      <ShieldCheckIcon className="h-12 w-12 text-modern-accent-600" />
                    </div>
                    <h3 className="text-xl font-bold text-modern-gray-800 mb-3">
                      Надежная защита данных
                    </h3>
                    <p className="text-base text-modern-gray-700 leading-relaxed">
                      Крупные поломки всегда можно предотвратить вовремя. Ценные данные всегда под надежной защитой.
                    </p>
                  </div>

                  {/* Преимущество 5 */}
                  <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-modern-primary-50 to-modern-white rounded-xl shadow-sm hover:shadow-modern transition-all duration-200">
                    <div className="mb-4 p-4 bg-modern-primary-100 rounded-full">
                      <LockClosedIcon className="h-12 w-12 text-modern-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-modern-gray-800 mb-3">
                      Безопасность
                    </h3>
                    <p className="text-base text-modern-gray-700 leading-relaxed">
                      Все абсолютно безопасно. Доступ осуществляется исключительно к определенным данным и участкам системы.
                    </p>
                  </div>
                </div>

                {/* Горизонтальная отсечка */}
                <div className="relative mb-16">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t-2 border-modern-primary-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-modern-white px-6 text-2xl font-bold text-modern-primary-600">
                      Зачем Вам Zabbix
                    </span>
                  </div>
                </div>

                {/* Список возможностей */}
                <div className="space-y-8 mb-16">
                  {/* Возможность 1 */}
                  <div className="flex gap-6 p-6 bg-modern-gray-50 rounded-xl hover:bg-modern-primary-50 transition-all duration-200">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-modern-primary-100 rounded-lg">
                        <ChartBarIcon className="h-8 w-8 text-modern-primary-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-modern-gray-800 mb-2">
                        Мониторинг ресурсов
                      </h3>
                      <p className="text-base text-modern-gray-700 leading-relaxed">
                        Zabbix позволяет отслеживать использование ресурсов в реальном времени. Вы можете следить за производительностью серверов, сетевых устройств, баз данных и других ресурсов. Это помогает предотвращать перегрузки, оптимизировать работу системы и предупреждать о возможных проблемах.
                      </p>
                    </div>
                  </div>

                  {/* Возможность 2 */}
                  <div className="flex gap-6 p-6 bg-modern-gray-50 rounded-xl hover:bg-modern-accent-50 transition-all duration-200">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-modern-accent-100 rounded-lg">
                        <BellAlertIcon className="h-8 w-8 text-modern-accent-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-modern-gray-800 mb-2">
                        Предупреждения и уведомления
                      </h3>
                      <p className="text-base text-modern-gray-700 leading-relaxed">
                        Zabbix может отправлять уведомления в случае возникновения проблем или нарушений в работе системы. Это позволяет оперативно реагировать на проблемы и минимизировать время простоя.
                      </p>
                    </div>
                  </div>

                  {/* Возможность 3 */}
                  <div className="flex gap-6 p-6 bg-modern-gray-50 rounded-xl hover:bg-modern-primary-50 transition-all duration-200">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-modern-primary-100 rounded-lg">
                        <ShieldCheckIcon className="h-8 w-8 text-modern-primary-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-modern-gray-800 mb-2">
                        Прогнозирование и предотвращение отказов
                      </h3>
                      <p className="text-base text-modern-gray-700 leading-relaxed">
                        Благодаря мониторингу и анализу данных, Zabbix помогает выявлять тенденции и позволяет предпринимать меры до того, как возникнут серьезные проблемы. Это позволяет предотвращать отказы системы и улучшать ее общую стабильность.
                      </p>
                    </div>
                  </div>

                  {/* Возможность 4 */}
                  <div className="flex gap-6 p-6 bg-modern-gray-50 rounded-xl hover:bg-modern-accent-50 transition-all duration-200">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-modern-accent-100 rounded-lg">
                        <CurrencyDollarIcon className="h-8 w-8 text-modern-accent-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-modern-gray-800 mb-2">
                        Оптимизация ресурсов
                      </h3>
                      <p className="text-base text-modern-gray-700 leading-relaxed">
                        Zabbix помогает оптимизировать использование ресурсов, таких как процессор, память, сеть и хранилище данных. Это позволяет эффективно использовать аппаратные ресурсы, избегать избыточной загрузки и, таким образом, сэкономить затраты на оборудование.
                      </p>
                    </div>
                  </div>

                  {/* Возможность 5 */}
                  <div className="flex gap-6 p-6 bg-modern-gray-50 rounded-xl hover:bg-modern-primary-50 transition-all duration-200">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-modern-primary-100 rounded-lg">
                        <ChartBarIcon className="h-8 w-8 text-modern-primary-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-modern-gray-800 mb-2">
                        Анализ производительности
                      </h3>
                      <p className="text-base text-modern-gray-700 leading-relaxed">
                        Zabbix предоставляет детальную статистику и анализ производительности, что помогает идентифицировать узкие места в инфраструктуре. Это может быть полезно для принятия решений о масштабировании или улучшении системы.
                      </p>
                    </div>
                  </div>

                  {/* Возможность 6 */}
                  <div className="flex gap-6 p-6 bg-modern-gray-50 rounded-xl hover:bg-modern-accent-50 transition-all duration-200">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-modern-accent-100 rounded-lg">
                        <LockClosedIcon className="h-8 w-8 text-modern-accent-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-modern-gray-800 mb-2">
                        Соблюдение стандартов безопасности
                      </h3>
                      <p className="text-base text-modern-gray-700 leading-relaxed">
                        Мониторинг событий и безопасности является важной частью работы Zabbix. Он может помочь выявить потенциальные угрозы и проблемы безопасности, обеспечивая высокий уровень безопасности корпоративной сети.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA блок */}
                <div className="bg-gradient-to-br from-modern-primary-600 to-modern-primary-700 rounded-xl p-8 text-center text-white">
                  <h2 className="text-3xl font-bold mb-4">
                    Готовы начать мониторинг?
                  </h2>
                  <p className="text-lg mb-6">
                    Свяжитесь с нами для консультации и внедрения Zabbix в вашу IT-инфраструктуру
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <a
                      href="tel:+78443300200"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-white text-modern-primary-700 rounded-xl hover:bg-modern-gray-100 transition-all duration-200 font-semibold shadow-lg hover:scale-105"
                    >
                      <span>📞</span>
                      <span>8 (8443) 300-200</span>
                    </a>
                    <a
                      href="mailto:it@enginf.ru"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-modern-primary-800 text-white rounded-xl hover:bg-modern-primary-900 transition-all duration-200 font-semibold shadow-lg hover:scale-105"
                    >
                      <span>✉️</span>
                      <span>it@enginf.ru</span>
                    </a>
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

export default Zabbix;
