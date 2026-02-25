'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, PhoneIcon } from '@heroicons/react/24/outline';
import CallbackModal from '@/components/ui/CallbackModal';
import { ItsTariffPlan } from '@/types/tariff';
import AccordionItem from '@/components/AccordionItem';

const SupportPage: React.FC = () => {
  const [tariffs, setTariffs] = useState<ItsTariffPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [callbackOpen, setCallbackOpen] = useState(false);

  // Загрузка ИТС тарифов из API
  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/its-tariff-plans`);
        if (response.ok) {
          const data = await response.json();
          setTariffs(data);
        } else {
          console.error('Failed to fetch ITS tariffs, status:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch ITS tariffs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTariffs();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-modern-primary-100 via-modern-white to-modern-accent-100 pt-16 pb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.03) 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Левая колонка с навигационными плитками */}
            <div className="w-full lg:w-80 flex-shrink-0 space-y-3">
              <Link href="/support" className="group bg-modern-white/80 backdrop-blur-sm rounded-xl p-4 shadow-modern flex items-center justify-between cursor-pointer hover:shadow-modern-lg transition-all duration-200">
                <div>
                  <div className="text-2xl font-bold text-modern-primary-600 mb-1">ИТС</div>
                  <div className="text-xs font-medium text-modern-gray-700">
                    Сопровождение 1С<br />Горячая линия
                  </div>
                </div>
                <ArrowRightIcon className="h-6 w-6 text-modern-primary-600 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link href="/implementation" className="group bg-modern-white/80 backdrop-blur-sm rounded-xl p-4 shadow-modern flex items-center justify-between cursor-pointer hover:shadow-modern-lg transition-all duration-200">
                <div>
                  <div className="text-2xl font-bold text-modern-primary-600 mb-1">Внедрение</div>
                  <div className="text-xs font-medium text-modern-gray-700">
                    Автоматизация бизнеса<br />От обследования до запуска
                  </div>
                </div>
                <ArrowRightIcon className="h-6 w-6 text-modern-primary-600 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link href="/tech-maintenance" className="group bg-modern-white/80 backdrop-blur-sm rounded-xl p-4 shadow-modern flex items-center justify-between cursor-pointer hover:shadow-modern-lg transition-all duration-200">
                <div>
                  <div className="text-2xl font-bold text-modern-primary-600 mb-1">IT-Аутсорс</div>
                  <div className="text-xs font-medium text-modern-gray-700">
                    Обслуживание ПК и серверов<br />Торговое оборудование
                  </div>
                </div>
                <ArrowRightIcon className="h-6 w-6 text-modern-primary-600 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <button
                onClick={() => setCallbackOpen(true)}
                className="group bg-modern-primary-600 rounded-xl p-4 shadow-modern flex items-center justify-between cursor-pointer hover:shadow-modern-lg hover:bg-modern-primary-700 transition-all duration-200 w-full text-left"
              >
                <div>
                  <div className="text-lg font-bold text-white mb-1">Заказать звонок</div>
                  <div className="text-xs font-medium text-modern-primary-100">
                    Хочу подробности<br />Подберём решение для вас
                  </div>
                </div>
                <PhoneIcon className="h-6 w-6 text-white flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
              </button>

              <CallbackModal isOpen={callbackOpen} onClose={() => setCallbackOpen(false)} />
            </div>

            {/* Правая часть - основной контент */}
            <div className="flex-1 bg-modern-white/80 backdrop-blur-sm rounded-xl p-8 shadow-modern">
              {/* Заголовок и описание по центру */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-modern-primary-600 mb-5 leading-tight">
                  Поддержка и сопровождение 1С
                </h1>
                <p className="text-lg text-modern-gray-700 leading-relaxed max-w-4xl mx-auto font-medium">
                  Заключив договор ИТС, вы не просто получаете абонентское обслуживание, а приобретаете «страховой полис» для стабильной, легальной и эффективной работы вашей программы 1С.
                </p>
              </div>


              {/* 4 блока в ряд */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="group">
                  <h3 className="text-lg font-bold text-modern-primary-600 mb-3 group-hover:text-modern-primary-700 transition-colors duration-200">
                    Программа всегда актуальна и легальна
                  </h3>
                  <p className="text-base text-modern-gray-700 leading-relaxed">
                    Своевременные обновления: Вы получаете официальные обновления от фирмы «1С», которые автоматически вносят все изменения в налоговое законодательство, формы отчетности (НДС, Налог на прибыль, НДФЛ, РСВ) и кадровые документы.
                    Легальность ПО: Гарантия использования только лицензионных и официально обновляемых версий программных продуктов «1С».
                    Нулевые ошибки по незнанию закона: Ваши бухгалтеры всегда работают в актуальной программе, что сводит к нулю риски технических ошибок из-за устаревших форм или расчетов.
                  </p>
                </div>

                <div className="group">
                  <h3 className="text-lg font-bold text-modern-primary-600 mb-3 group-hover:text-modern-primary-700 transition-colors duration-200">
                    Профессиональная техническая поддержка
                  </h3>
                  <p className="text-base text-modern-gray-700 leading-relaxed">
                    Консультации экспертов: Наши сертифицированные специалисты отвечают на любые ваши вопросы по работе с программой — от сложных проводок до настройки нестандартных отчетов.
                    «Скорая помощь» для 1С: Мы оперативно диагностируем и устраняем любые сбои: «вылеты» программы, ошибки при проведении документов, проблемы с обменом данными и многое другое.
                    Удаленный доступ: Большинство проблем решаются удаленно в кратчайшие сроки, без необходимости визита специалиста в ваш офис.
                  </p>
                </div>

                <div className="group">
                  <h3 className="text-lg font-bold text-modern-primary-600 mb-3 group-hover:text-modern-primary-700 transition-colors duration-200">
                    Доступ к эксклюзивным знаниям
                  </h3>
                  <p className="text-base text-modern-gray-700 leading-relaxed">
                    База знаний 1С:ИТС: Это ваша онлайн-библиотека с постоянным доступом к актуальным методическим материалам и рекомендациям по сложным вопросам учета.
                  </p>
                </div>

                <div className="group">
                  <h3 className="text-lg font-bold text-modern-primary-600 mb-3 group-hover:text-modern-primary-700 transition-colors duration-200">
                    Сохранность данных
                  </h3>
                  <p className="text-base text-modern-gray-700 leading-relaxed">
                    Помощь в настройке резервного копирования: Мы поможем правильно организовать автоматическое ежедневное резервное копирование вашей информационной базы.
                    Защита от потери информации: В случае серьезного сбоя, вирусной атаки или поломки оборудования вы всегда сможете восстановить работоспособность системы из последней резервной копии.
                  </p>
                </div>
              </div>

              {/* Заключительный текст */}
              <div className="bg-gradient-to-r from-modern-primary-50 to-modern-accent-50 rounded-xl p-6">
                <p className="text-center text-lg text-modern-gray-800 leading-relaxed font-medium">
                  Сопровождение 1С по договору ИТС — это не статья расходов, а <span className="text-modern-primary-700 font-bold">стратегическая инвестиция</span> в стабильность и безопасность вашего бизнеса. Вы платите за уверенность в том, что ваш финансовый учет в полном порядке, а ваша команда работает с максимальной эффективностью.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Тарифные планы ИТС */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-modern-primary-600 text-center mb-4">
            Тарифные планы
          </h2>
          <p className="text-center text-modern-gray-600 mb-10 max-w-3xl mx-auto">
            Мы предлагаем гибкие тарифы для сопровождения 1С. Выберите оптимальный план для вашего бизнеса.
          </p>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-modern-primary-600 mx-auto"></div>
              <p className="mt-4 text-modern-gray-600">Загрузка тарифов...</p>
            </div>
          ) : tariffs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {tariffs.map((tariff) => (
                <div
                  key={tariff.id}
                  className="bg-white rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 overflow-hidden border border-modern-gray-200"
                >
                  {/* Заголовок тарифа */}
                  <div className="bg-gradient-to-r from-modern-primary-600 to-modern-primary-700 text-white p-4 text-center">
                    <h3 className="text-xl font-bold">{tariff.title}</h3>
                  </div>

                  {/* Список строк тарифа */}
                  <div className="p-4">
                    <ul className="space-y-2">
                      {tariff.rows.map((row, index) => (
                        <li
                          key={index}
                          className="text-sm leading-relaxed"
                          style={{
                            color: row.color,
                            fontWeight: row.isBold ? 'bold' : 'normal',
                          }}
                        >
                          {row.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-5xl mx-auto bg-gradient-to-br from-modern-primary-50 to-modern-accent-50 rounded-xl p-8 text-center">
              <p className="text-lg text-modern-gray-700 mb-6">
                Тарифные планы пока не добавлены.
              </p>
              <p className="text-modern-gray-600">
                Для получения подробной информации о тарифах обращайтесь к нашим специалистам.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Регламент линии консультаций */}
      <section className="py-12 bg-gradient-to-br from-modern-gray-50 to-modern-primary-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-modern-primary-600 text-center mb-4">
            Регламент линии консультаций
          </h2>
          <p className="text-center text-modern-gray-600 mb-10 max-w-3xl mx-auto">
            Линия консультаций- самая востребованная услуга среди пользователей программных продуктов Фирмы «1С». Ежедневно сотни наших клиентов обращаются за помощью в решении своих профессиональных задач к сотрудникам Линии консультаций. Эта услуга в различном объеме заложена в более чем 80% действующих договоров сопровождения и является нашим регулярным обязательством перед клиентами.
          </p>

          <div className="max-w-5xl mx-auto">
            <AccordionItem title="1. Порядок оказания услуг на Линии консультаций" defaultOpen={true} id="section-1">
              <p>Все поступающие обращения в компанию могут быть разнесены по 3-м видам поддержки:</p>
              <p><span className="text-modern-primary-700 font-bold">Первая линия поддержки — это Линия консультаций.</span></p>
              <p>К вопросам Линии консультаций относятся:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Консультации по использованию типового функционала программных продуктов Фирмы «1С».</li>
                <li>Методики ввода документов, работы с журналами, настройки стандартных отчетов.</li>
                <li>Отражение хозяйственных операций в ПП «1С», последовательность заполнения регламентированной отчетности.</li>
                <li>Как настроить параметры учета?</li>
                <li>Рекомендации по поиску и устранению ошибок заполнения данных в информационной базе «1С».</li>
                <li>Как выполнить ту или иную операцию?</li>
                <li>Как сформировать и отправить ту или иную форму отчетности?</li>
                <li>Как создать пользователей?</li>
                <li>Как настроить права доступа для пользователей 1С?</li>
                <li>Как удалить из 1С помеченные на удаление объекты?</li>
                <li>Порядок сохранения, тестирования и исправления информационной базы.</li>
                <li>Как создать архив 1С?</li>
                <li>Проблемы запуска 1С.</li>
                <li>Что делать, если программа выдала ошибку?</li>
                <li>Выход новых релизов программ и конфигураций, форм отчетности, изменения в них.</li>
                <li>Реализовано ли в конфигурации изменение в законодательстве?</li>
                <li>Не удается войти на сайт ИТС.</li>
                <li>Как задать вопрос аудитору?</li>
                <li>Вопросы по работе с сервисами 1С: ИТС (например: 1С-ЭДО, отправка и получение отчетов через сервис 1С: Отчетность).</li>
                <li>Консультирование по работе с сервисом 1С: Предприятие 8 через Интернет.</li>
              </ul>
              <p>Ответы на стандартные, часто задаваемые вопросы, даются в виде ссылок на методические материалы сайта its.1c.ru.</p>
              <p><span className="text-modern-primary-700 font-bold">Важно! Все действия, рекомендованные консультантом, пользователь выполняет самостоятельно.</span></p>
              <p>Сотрудники Линии консультаций могут подключиться к базе клиента и предоставить устные рекомендации! Все изменения в базе – создание объектов, перезапись и прочее, клиент производит САМОСТОЯТЕЛЬНО и осознанно. Если клиент настаивает на вводе данных в программном продукте силами наших специалистов, выполнение такой задачи возможно только в рамках второй линии поддержки.</p>
            </AccordionItem>

            <AccordionItem title="2. По каким вопросам Линия консультаций не консультирует" id="section-2">
              <h3 className="text-xl font-bold mb-4">Специалисты Линии консультаций НЕ консультируют по:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Вопросы по нетиповым (измененным) конфигурациям и по программам 1С с «дописанным функционалом». Обновление нетиповой 1С.</li>
                <li>Подготовка информационной базы к переносу данных, перенос данных.</li>
                <li>Настройка базы под особенности учета в организации (вопросы по внедрению программного продукта).</li>
                <li>Обучение работе с программой.</li>
                <li>Вопросы по программированию и конфигурированию.</li>
                <li>Аудиторские и аутсорсинговые услуги.</li>
                <li>Выявление ошибок в учёте: проверка расчётов; корректировка данных.</li>
                <li>Проведение анализа финансового состояния организации.</li>
                <li>Формирование бухгалтерского отчета и отчетов регуляторам (Помощь в составлении квартальной/годовой отчетности).</li>
                <li>Проведение проверки правильности предоставления данных регуляторам и в прочие контролирующие органы.</li>
                <li>Настройка обмена (синхронизации) между конфигурациями.</li>
                <li>Настройка не стандартных прав пользователей.</li>
                <li>Настройка не стандартных отчетов.</li>
                <li>Исправление ошибок в базе данных пользователя.</li>
                <li>Методология ведения бухгалтерского и налогового учета: какие должны быть проводки? Какие должны быть данные? (Для решения данных вопросов можно воспользоваться сервисом «Отвечает аудитор»).</li>
                <li>Удаленное обновление «1С» и руководство процессом обновления по телефону (специалисты подскажут, как запустить автоматическое обновление, непосредственно процессом обновления руководить не будут.</li>
                <li>Услуги по администрированию конфигурации компьютерной сети пользователя, серверов и компьютеров.</li>
              </ul>
              <p><span className="text-modern-primary-700 font-bold">Сотрудникам Линии консультации запрещается проводить работы посредством удаленного подключения в отсутствии пользователя.</span></p>
            </AccordionItem>

            <AccordionItem title="3. По каким программным продуктам 1С оказывается консультационная поддержка Линией консультаций?" id="section-3">
              <h3 className="text-xl font-bold mb-4">Консультационная поддержка оказывается Линией консультаций пользователям по следующим программным продуктам 1С:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Бухгалтерия предприятия, редакция 3.0</li>
                <li>Бухгалтерия государственного учреждения ред. 2.0</li>
                <li>Зарплата и кадры государственного учреждения, редакция 3</li>
                <li>Зарплата и Управление Персоналом, редакция 3</li>
                <li>Комплексная автоматизация, редакция 2</li>
                <li>Управление нашей фирмой, редакция 3.0</li>
                <li>Управление торговлей, редакция 11</li>
                <li>1С-Учет в управляющих компаниях ЖКХ, ТСЖ и ЖСК, редакция 3.0</li>
                <li>Бухгалтерия сельскохозяйственного предприятия, редакция 3.0</li>
                <li>1С-КАМИН: Зарплата. Версия 5.0</li>
                <li>1С-КАМИН: Кадры бюджетного учреждения. Версия 5.5</li>
                <li>КАМИН: Расчет заработной платы. Версия 3.0</li>
                <li>КАМИН: Расчет заработной платы для бюджетных учреждений Версия 3.5</li>
                <li>1С:Гаражи</li>
                <li>1С:Садовод</li>
              </ul>
            </AccordionItem>

            <AccordionItem title="4. Способы обращения на Линию консультаций" id="section-4">
              <h3 className="text-xl font-bold mb-4">Способы обращения на Линию консультаций:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>По телефону: (8443)30-08-01;</li>
                <li>По электронной почте: 1c@enginf.ru; hotline@ec-1c.ru;</li>
                <li>Через сервис 1С-Коннект по линии: !Линия Консультаций;</li>
                <li>Передать заявку через своего обслуживающего специалиста.</li>
              </ul>
              <p>При обращении на Линию консультаций потребуется следующая информация:</p>
              <p><strong>По телефону:</strong></p>
              <ul className="list-disc pl-5 space-y-2">
                <li>ИНН организации;</li>
                <li>Наименование организации;</li>
                <li>Наименование программного продукта, по которому Вы хотите получить консультацию.</li>
              </ul>
              <p><strong>По электронной почте:</strong></p>
              <ul className="list-disc pl-5 space-y-2">
                <li>ИНН организации;</li>
                <li>Наименование организации;</li>
                <li>Наименование конфигурации и релиз конфигурации;</li>
                <li>Вопрос.</li>
              </ul>
              <p>Дополнительно можно указать:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>подробное описание проблемы и, по возможности, пошаговое описание действий по воспроизведению проблемы;</li>
                <li>прикрепить «скриншоты» в форматах: jpg, gif, png, doc, bmp, ссылку на видеозапись с демонстрацией проблемы или другую информацию.</li>
              </ul>
              <p><strong>Через сервис 1С-Коннект:</strong> данные клиента уточнять не нужно, вся информация есть в сервисе. Потребуется только задать вопрос.</p>
            </AccordionItem>

            <AccordionItem title="5. Порядок обработки обращений пользователей" id="section-5">
              <h3 className="text-xl font-bold mb-4">Порядок обработки обращений пользователей:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Общая продолжительность консультации не более 15 минут.</li>
                <li>Необходимость удаленного подключения определяет специалист Линии консультаций.</li>
                <li>Если при первичном контакте клиент сообщает, что он не готов общаться по заказанной консультации или не отвечает на поступающий звонок, то в соответствии с правилами оказания услуг, это обращение переносится в конец очереди.</li>
              </ul>
            </AccordionItem>

            <AccordionItem title="6. В каких случаях может быть отказано пользователям в консультации?" id="section-6">
              <h3 className="text-xl font-bold mb-4">Пользователям может быть отказано в консультации по следующим причинам:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Не предоставлена, либо предоставлена некорректно информация: ИНН, наименование клиента.</li>
                <li>Истек срок действия договора ИТС.</li>
                <li>Не оплачена услуга: Линия консультаций (для Базовых, ИТС Техно, 1С:ГРМ).</li>
                <li>При не уважительном обращении к сотрудникам компании ООО «ИЦ».</li>
              </ul>
            </AccordionItem>

            <AccordionItem title="7. Способы удаленного подключения" id="section-7">
              <h3 className="text-xl font-bold mb-4">Способы удаленного подключения:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Через сервис 1С-Коннект.</li>
              </ul>
            </AccordionItem>

            <AccordionItem title="8. Как быстро ответят на вопрос?" id="section-8">
              <h3 className="text-xl font-bold mb-4">Как быстро ответят на вопрос?</h3>
              <p>При наличии свободного специалиста – сразу переключат на него.  Если все заняты, Ваш вопрос зарегистрируют. Вам перезвонят, как только освободится специалист.</p>
              <p>Все обращения пользователя фиксируются и обязательно будут рассмотрены в порядке очереди.</p>
              <p>Также у нас есть "пиковые нагрузки" на Линию консультаций – период сдачи бухгалтерской отчетности.  Дозвониться на Линию консультаций в это время сложнее и ждать ответа приходится дольше.</p>
              <p>Вне очереди могут обрабатываться обращения с высоким уровнем критичности, требующие экстренного вмешательства или консультации специалистов технической поддержки. К таким обращениям могут быть отнесены вопросы восстановления работоспособности программы:</p>
              <p>Не открывается программа, не работает 1С….</p>
              <p><span className="text-modern-primary-700 font-bold">Критическими не считаются обращения вида: «Сегодня последний день сдачи отчётности, помогите отправить отчет»</span></p>
            </AccordionItem>

            <AccordionItem title="9. Сколько стоит Линия консультаций?" id="section-9">
              <h3 className="text-xl font-bold mb-4">Сколько стоит Линия консультаций?</h3>
              <p>Если у Вас заключен с нами договор на сопровождение уровня ПРОФ - бесплатно.</p>
              <p>Если у Вас:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Базовая версия программы 1С;</li>
                <li>Договор уровня ТЕХНО;</li>
                <li>Используете "1С:Готовое рабочее место" (1С:ГРМ).</li>
              </ul>
              <p>Стоимость пользования Линией консультаций составляет: 10 000 руб. за 12 месяцев.</p>
            </AccordionItem>

            <AccordionItem title="10. Как работает Линия консультаций?" id="section-10">
              <h3 className="text-xl font-bold mb-4">Как работает Линия консультаций?</h3>
              <p>По рабочим дням с 8-30 до 17-15 (время московское), за исключением выходных и праздничных дней (в соответствии с производственным календарем РФ).</p>
              <p>Время реакции на обращения включает в себя только рабочее время.</p>
              <p><span className="text-modern-primary-700 font-bold">Наша Компания может изменять положения настоящего регламента для повышения качества обслуживания. Об этом мы информируем пользователей на сайте «ООО ИЦ» (https://ec-1c.ru)</span></p>
              <p>Справочно сообщаем, что в рамках второй и третьей линий поддержки могут быть оказаны следующие услуги. Данные услуги оказываются на основании договора на адаптацию и ИТС ПП 1С.</p>
              <p><span className="text-modern-primary-700 font-bold">Вторая линия поддержки.</span></p>
              <p>К компетенции второй линии поддержки относятся:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Сложные вопросы учета, в которых требуется анализ действий пользователя и данных, введенных в программу.</li>
                <li>Вопросы, решение которых, по предварительной оценке консультанта, может превышать 15 минут.</li>
                <li>Обновление типовой программы 1С.</li>
                <li>Настройка синхронизации между конфигурациями 1С.</li>
                <li>Настройка прав пользователей силами специалистов ООО «ИЦ».</li>
                <li>Перенос базы данных.</li>
                <li>Обучение работе с программой 1С.</li>
                <li>Настройка не стандартных отчетов.</li>
                <li>Внедрение и настройка 1С.</li>
              </ul>
              <p><span className="text-modern-primary-700 font-bold">Третья линия поддержки.</span></p>
              <p>К компетенции третьей линии поддержки относятся:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Вопросы по доработанному функционалу программных продуктов, где требуется работа с кодом программного продукта.</li>
                <li>Доработка программ 1С.</li>
                <li>Обновление нетиповой программы 1С.</li>
              </ul>
            </AccordionItem>
          </div>
        </div>
      </section>

      {/* Типовые условия сопровождения */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-modern-primary-600 text-center mb-4">
            Типовые условия сопровождения
          </h2>
          <p className="text-center text-modern-gray-600 mb-10 max-w-3xl mx-auto">
            Подробная информация об условиях договора ИТС, правах и обязанностях сторон.
          </p>

          <div className="max-w-5xl mx-auto bg-gradient-to-br from-modern-primary-50 to-modern-accent-50 rounded-xl p-8 text-center">
            <p className="text-lg text-modern-gray-700 mb-6">
              Гарантируем качественное сопровождение программ 1С. Условия включают регулярные обновления и техподдержку. Подробности доступны по запросу.
            </p>
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-12 bg-gradient-to-br from-modern-primary-600 to-modern-primary-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Нужна консультация по выбору подходящего тарифа?
            </h2>
            <p className="text-xl mb-8 text-modern-primary-50">
              Наши специалисты помогут подобрать оптимальное решение для вашего бизнеса
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+78443300801"
                className="inline-flex items-center px-6 py-3 bg-white text-modern-primary-700 rounded-xl hover:bg-modern-gray-100 transition-all duration-200 font-semibold shadow-modern-lg hover:scale-105"
              >
                📞 8 (8443) 300-801
              </a>
              <a
                href="mailto:mail@ec-1c.ru"
                className="inline-flex items-center px-6 py-3 bg-modern-primary-800 text-white rounded-xl hover:bg-modern-primary-900 transition-all duration-200 font-semibold shadow-modern-lg hover:scale-105"
              >
                ✉️ mail@ec-1c.ru
              </a>
            </div>
            <p className="mt-6 text-modern-primary-100">
              Работаем по рабочим дням с 8:30 до 17:15 (МСК)
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default SupportPage;
