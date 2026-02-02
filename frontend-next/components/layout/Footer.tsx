'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <footer
      className="bg-modern-gray-900 text-white"
      style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
    >
      <div
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
        style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
          style={{ border: 'none', outline: 'none' }}
        >
          {/* Компания */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Компания</h3>
            <ul className="space-y-1 text-modern-gray-300">
              <li>
                <Link href="/about" className="hover:text-white transition-colors duration-200">
                  О компании
                </Link>
              </li>
              <li>
                <Link href="/otzyvy" className="hover:text-white transition-colors duration-200">
                  Отзывы
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-white transition-colors duration-200">
                  Супер команда
                </Link>
              </li>
              <li>
                <a
                  href="https://career-ec.ru/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-200"
                >
                  Работа у нас
                </a>
              </li>
              <li>
                <Link href="/life" className="hover:text-white transition-colors duration-200">
                  Наша жизнь
                </Link>
              </li>
            </ul>
          </div>

          {/* Продукты */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Продукты</h3>
            <ul className="space-y-1 text-modern-gray-300">
              <li>
                <Link
                  href="/1c-programs"
                  className="hover:text-white transition-colors duration-200"
                >
                  Программы 1С
                </Link>
              </li>
              <li>
                <Link
                  href="/1c-services"
                  className="hover:text-white transition-colors duration-200"
                >
                  Сервисы 1С
                </Link>
              </li>
              <li>
                <Link
                  href="/ready-solutions"
                  className="hover:text-white transition-colors duration-200"
                >
                  Наши разработки
                </Link>
              </li>
              <li>
                <Link href="/zabbix" className="hover:text-white transition-colors duration-200">
                  Zabbix
                </Link>
              </li>
              <li>
                <Link
                  href="/equipment"
                  className="hover:text-white transition-colors duration-200"
                >
                  Оборудование
                </Link>
              </li>
            </ul>
          </div>

          {/* Услуги */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Услуги</h3>
            <ul className="space-y-1 text-modern-gray-300">
              <li>
                <Link href="/support" className="hover:text-white transition-colors duration-200">
                  Сопровождение
                </Link>
              </li>
              <li>
                <Link
                  href="/implementation"
                  className="hover:text-white transition-colors duration-200"
                >
                  Внедрение
                </Link>
              </li>
              <li>
                <Link
                  href="/tech-maintenance"
                  className="hover:text-white transition-colors duration-200"
                >
                  IT-аутсорсинг
                </Link>
              </li>
              <li>
                <Link
                  href="/1c-courses"
                  className="hover:text-white transition-colors duration-200"
                >
                  Курсы 1С
                </Link>
              </li>
              <li>
                <Link
                  href="/certification"
                  className="hover:text-white transition-colors duration-200"
                >
                  Сертификация
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Контакты</h3>
            <div className="space-y-2 text-modern-gray-300">
              {/* Телефоны */}
              <div className="flex items-center">
                <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <a
                  href="tel:+78443300801"
                  className="hover:text-white transition-colors duration-200"
                >
                  8 (8443) 300-801
                </a>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <a
                  href="tel:+78443300200"
                  className="hover:text-white transition-colors duration-200"
                >
                  8 (8443) 300-200
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center">
                <EnvelopeIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <a
                  href="mailto:mail@ec-1c.ru"
                  className="hover:text-white transition-colors duration-200"
                >
                  mail@ec-1c.ru
                </a>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <a
                  href="mailto:it@enginf.ru"
                  className="hover:text-white transition-colors duration-200"
                >
                  it@enginf.ru
                </a>
              </div>

              {/* Адрес */}
              <div className="flex items-start mt-4">
                <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0 mt-1" />
                <p className="text-sm leading-relaxed">
                  г. Волжский, ул. Карбышева 76,
                  <br />
                  БЦ Акрас-Центр, 825, 827 офис,
                  <br />8 этаж
                </p>
              </div>
            </div>

            {/* Социальные сети */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Мы в соцсетях</h4>
              <div className="flex space-x-3">
                {/* ВКонтакте */}
                <a
                  href="https://vk.com/b2b34"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-modern-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-colors duration-200"
                  aria-label="ВКонтакте"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.15 14.99c-.26.32-.58.48-.97.48h-1.3c-.36 0-.66-.13-.92-.39-.23-.23-.43-.43-.62-.62-.49-.49-.91-.91-1.46-.91-.07 0-.15.01-.23.03-.41.11-.61.59-.61 1.44 0 .31-.25.47-.47.47h-1.01c-.36 0-2.22-.13-3.82-1.81-1.93-2.03-3.72-6.07-3.73-6.12-.13-.32.02-.49.33-.49h1.31c.3 0 .39.19.47.39 0 0 .87 2.09 2.1 3.44.32.35.48.46.62.46.09 0 .18-.04.27-.11.35-.29.28-1.18.27-1.38 0-.03-.01-.85-.26-1.23-.19-.28-.52-.37-.67-.39.14-.21.38-.45.75-.45h1.45c.33 0 .46.17.46.49v2.67c0 .33.15.46.25.46.18 0 .38-.13.77-.52 1.21-1.37 2.07-3.48 2.07-3.48.11-.23.29-.39.59-.39h1.31c.37 0 .45.19.37.45-.14.43-1.44 3.17-1.44 3.17-.12.21-.15.3 0 .53.1.17.42.5.64.74.41.44.73.81.91 1.09.21.32.04.49-.28.49z" />
                  </svg>
                </a>

                {/* Телеграм */}
                <a
                  href="https://t.me/b2b340"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-modern-gray-800 hover:bg-blue-500 p-2 rounded-lg transition-colors duration-200"
                  aria-label="Telegram"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.98 1.26-5.58 3.7-.53.36-.99.54-1.4.53-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.37-.48 1.02-.73 3.99-1.74 6.66-2.89 8-3.45 3.8-1.58 4.59-1.85 5.1-1.86.11 0 .37.03.54.17.14.11.18.26.2.37.01.08.03.29.01.45z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Наши партнёры */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Наши партнёры</h3>
            <div className="space-y-3">
              <a
                href="https://1c-gendalf.ru/"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-modern-gray-800 hover:bg-modern-gray-700 rounded-lg p-3 text-center transition-colors duration-200"
              >
                <div className="text-sm font-medium text-modern-gray-300 hover:text-white">
                  1С-Гэндальф
                </div>
                <div className="text-xs text-modern-gray-400 mt-1">Партнёр</div>
              </a>
              <a
                href="https://www.kaminsoft.ru/"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-modern-gray-800 hover:bg-modern-gray-700 rounded-lg p-3 text-center transition-colors duration-200"
              >
                <div className="text-sm font-medium text-modern-gray-300 hover:text-white">
                  КАМИН
                </div>
                <div className="text-xs text-modern-gray-400 mt-1">Партнёр</div>
              </a>
            </div>
          </div>
        </div>

        {/* Нижняя часть футера */}
        <div className="mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-modern-gray-400 text-sm">
              © 2025 ООО «Инженер-центр». Все права защищены.
            </div>

            <div className="text-center mt-4">
              <button
                onClick={() => {
                  setIsExpanded(!isExpanded);
                  if (!isExpanded) {
                    setTimeout(() => {
                      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    }, 0);
                  }
                }}
                className="bg-modern-gray-900 text-modern-gray-500 text-xs hover:text-modern-gray-300 transition-colors duration-200 focus:outline-none"
                style={{ outline: 'none', border: 'none' }}
              >
                Настоящий сайт является официальным сайтом Общества с ограниченной
                ответственностью &quot;Инженер-Центр&quot;.
              </button>
              {isExpanded && (
                <div className="mt-2 text-modern-gray-500 text-xs leading-relaxed max-w-3xl mx-auto">
                  Наша компания осуществляет деятельность в области информационных технологий,
                  включена в Реестр аккредитованных организаций, осуществляющих деятельность в
                  области информационных технологий (номер в Реестре № № 568, дата решения об
                  аккредитации от 14 декабря 2010 года). Основной вид деятельности компании:
                  адаптация, модификация и сопровождение систем 1С (ОКВЭД 62.01 Разработка
                  компьютерного программного обеспечения). Решения 1С зарегистрированы в едином
                  реестре российских программ для электронных вычислительных машин и баз данных.
                  Запись в реестре №7884 от 28.12.2020 произведена на основании приказа
                  Министерства цифрового развития, связи и массовых коммуникаций Российской
                  Федерации от 25.12.2020 №755 и другие решения. Компания осуществляет также и
                  другие виды деятельности в области информационных технологий. Компания является
                  правообладателем расширения конфигурации «ИЦ: Автоформирование актов сверки».
                  Запись в реестре №27561 произведена на основании поручения Министерства
                  цифрового развития, связи и массовых коммуникаций Российской Федерации от
                  11.04.2025 по протоколу заседания экспертного совета от 31.03.2025 №216пр
                  Компания в рамках осуществления деятельности в области информационных технологий
                  (адаптация, модификация и сопровождение систем 1С) использует программное
                  обеспечение 1С, язык программирования 1С, javascript,C++.
                </div>
              )}
            </div>

            {/* Технические страницы */}
            <div className="flex flex-wrap justify-center gap-4 text-xs text-modern-gray-500">
              <Link
                href="/privacy-policy"
                className="hover:text-modern-gray-300 transition-colors duration-200"
              >
                Политика конфиденциальности
              </Link>
              <Link
                href="/personal-data-consent"
                className="hover:text-modern-gray-300 transition-colors duration-200"
              >
                Согласие на обработку ПД
              </Link>
              <Link
                href="/metrics-consent"
                className="hover:text-modern-gray-300 transition-colors duration-200"
              >
                Согласие на метрику
              </Link>
              <Link
                href="/user-agreement"
                className="hover:text-modern-gray-300 transition-colors duration-200"
              >
                Пользовательское соглашение
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
