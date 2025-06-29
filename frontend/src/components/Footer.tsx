import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
    return (
        <footer className="bg-modern-gray-900 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Компания */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Компания</h3>
                        <ul className="space-y-2 text-modern-gray-300">
                            <li><Link to="/about" className="hover:text-white transition-colors duration-200">О нас</Link></li>
                            <li><Link to="/team" className="hover:text-white transition-colors duration-200">Наша команда</Link></li>
                            <li><Link to="/events" className="hover:text-white transition-colors duration-200">Мероприятия</Link></li>
                            <li><Link to="/careers" className="hover:text-white transition-colors duration-200">Вакансии</Link></li>
                            <li><Link to="/life" className="hover:text-white transition-colors duration-200">Наша жизнь</Link></li>
                        </ul>
                    </div>

                    {/* Услуги */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Услуги</h3>
                        <ul className="space-y-2 text-modern-gray-300">
                            <li><Link to="/support" className="hover:text-white transition-colors duration-200">Сопровождение</Link></li>
                            <li><Link to="/implementation" className="hover:text-white transition-colors duration-200">Внедрение</Link></li>
                            <li><Link to="/customization" className="hover:text-white transition-colors duration-200">Доработка</Link></li>
                            <li><Link to="/updates" className="hover:text-white transition-colors duration-200">Обновление</Link></li>
                            <li><Link to="/tech-maintenance" className="hover:text-white transition-colors duration-200">Техобслуживание</Link></li>
                        </ul>
                    </div>

                    {/* Контакты */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Контакты</h3>
                        <div className="space-y-3 text-modern-gray-300">
                            <div className="flex items-center">
                                <PhoneIcon className="h-4 w-4 mr-2" />
                                <a href="tel:+78443300801" className="hover:text-white transition-colors duration-200">
                                    8 (8443) 300-801
                                </a>
                            </div>
                            <div className="flex items-center">
                                <EnvelopeIcon className="h-4 w-4 mr-2" />
                                <a href="mailto:mail@ec-1c.ru" className="hover:text-white transition-colors duration-200">
                                    mail@ec-1c.ru
                                </a>
                            </div>
                        </div>

                        {/* Социальные сети */}
                        <div className="mt-6">
                            <h4 className="text-sm font-semibold mb-3">Мы в соцсетях</h4>
                            <div className="flex space-x-3">
                                <a href="#" className="bg-modern-gray-800 hover:bg-modern-primary-600 p-2 rounded-lg transition-colors duration-200">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zM12 18.632c-3.66 0-6.632-2.972-6.632-6.632S8.34 5.368 12 5.368s6.632 2.972 6.632 6.632-2.972 6.632-6.632 6.632z" />
                                    </svg>
                                </a>
                                <a href="#" className="bg-modern-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-colors duration-200">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 9.728-.896 9.728-.379 3.008-1.418 3.53-2.924 3.53-.613 0-1.224-.613-1.632-1.022-.408-.408-.817-.817-1.632-1.632-1.632-1.632-2.04-2.04-2.04-3.264 0-.817.408-1.632 1.224-2.448l8.9-8.9z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Наши партнёры */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Наши партнёры</h3>
                        <div className="space-y-3">
                            <div className="bg-modern-gray-800 rounded-lg p-3 text-center">
                                <div className="text-sm font-medium text-modern-gray-300">1С</div>
                                <div className="text-xs text-modern-gray-400">Официальный партнёр</div>
                            </div>
                            <div className="bg-modern-gray-800 rounded-lg p-3 text-center">
                                <div className="text-sm font-medium text-modern-gray-300">Microsoft</div>
                                <div className="text-xs text-modern-gray-400">Сертифицированный партнёр</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Нижняя часть футера */}
                <div className="border-t border-modern-gray-800 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-modern-gray-400 text-sm">
                            © 2025 1С Поддержка. Все права защищены.
                        </div>

                        {/* Технические страницы */}
                        <div className="flex flex-wrap justify-center gap-4 text-xs text-modern-gray-500">
                            <Link to="/privacy-policy" className="hover:text-modern-gray-300 transition-colors duration-200">
                                Политика конфиденциальности
                            </Link>
                            <Link to="/personal-data-consent" className="hover:text-modern-gray-300 transition-colors duration-200">
                                Согласие на обработку ПД
                            </Link>
                            <Link to="/metrics-consent" className="hover:text-modern-gray-300 transition-colors duration-200">
                                Согласие на метрику
                            </Link>
                            <Link to="/user-agreement" className="hover:text-modern-gray-300 transition-colors duration-200">
                                Пользовательское соглашение
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 