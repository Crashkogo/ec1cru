import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';

// Мокаем authProvider
vi.mock('../../admin/authProvider', () => ({
    authProvider: {
        checkAuth: vi.fn(),
    },
}));

// Мокаем navigate из react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Компонент-обертка для тестирования с Router
const HeaderWrapper = ({ setShowLogin }: { setShowLogin: React.Dispatch<React.SetStateAction<boolean>> }) => (
    <BrowserRouter>
        <Header setShowLogin={setShowLogin} />
    </BrowserRouter>
);

describe('Header Component', () => {
    const mockSetShowLogin = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // Мокаем localStorage
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: vi.fn(),
                setItem: vi.fn(),
                removeItem: vi.fn(),
                clear: vi.fn(),
            },
            writable: true,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Основной рендеринг', () => {
        it('рендерится без ошибок', () => {
            render(<HeaderWrapper setShowLogin={mockSetShowLogin} />);

            // Проверяем что header присутствует
            const header = screen.getByRole('banner');
            expect(header).toBeInTheDocument();
        });

        it('отображает логотип с правильной ссылкой', () => {
            render(<HeaderWrapper setShowLogin={mockSetShowLogin} />);

            // Проверяем логотип
            const logoLink = screen.getByLabelText('Перейти на главную страницу');
            expect(logoLink).toBeInTheDocument();
            expect(logoLink).toHaveAttribute('href', '/');

            // Проверяем что изображение логотипа присутствует
            const logoImg = screen.getByAltText('1C Support Logo');
            expect(logoImg).toBeInTheDocument();
        });

        it('отображает все основные пункты меню', () => {
            render(<HeaderWrapper setShowLogin={mockSetShowLogin} />);

            // Проверяем основные пункты меню
            expect(screen.getByText('Новости')).toBeInTheDocument();
            expect(screen.getByText('Акции')).toBeInTheDocument();
            expect(screen.getByText('Продукты')).toBeInTheDocument();
            expect(screen.getByText('Услуги')).toBeInTheDocument();
            expect(screen.getByText('Обучение')).toBeInTheDocument();
            expect(screen.getByText('Компания')).toBeInTheDocument();
        });

        it('отображает контактную информацию', () => {
            render(<HeaderWrapper setShowLogin={mockSetShowLogin} />);

            // Проверяем телефон и email
            expect(screen.getByText('8 (8443) 300-801')).toBeInTheDocument();
            expect(screen.getByText('mail@ec-1c.ru')).toBeInTheDocument();
        });

        it('отображает кнопки действий', () => {
            render(<HeaderWrapper setShowLogin={mockSetShowLogin} />);

            // Проверяем основные кнопки
            expect(screen.getByText('Заказать звонок')).toBeInTheDocument();
            expect(screen.getByText('Удаленный доступ')).toBeInTheDocument();
            expect(screen.getByText('Войти')).toBeInTheDocument();
        });
    });

    describe('Навигационное меню', () => {
        it('простые ссылки работают корректно', () => {
            render(<HeaderWrapper setShowLogin={mockSetShowLogin} />);

            // Проверяем что простые ссылки имеют правильные href
            const newsLink = screen.getByRole('link', { name: /новости/i });
            expect(newsLink).toHaveAttribute('href', '/news');

            const promotionsLink = screen.getByRole('link', { name: /акции/i });
            expect(promotionsLink).toHaveAttribute('href', '/promotions');
        });

        it('выпадающие меню открываются при клике', async () => {
            const user = userEvent.setup();
            render(<HeaderWrapper setShowLogin={mockSetShowLogin} />);

            // Кликаем по "Продукты"
            const productsButton = screen.getByRole('button', { name: /открыть меню продукты/i });
            await user.click(productsButton);

            // Проверяем что подменю открылось
            await waitFor(() => {
                expect(screen.getByText('Программы 1С')).toBeInTheDocument();
                expect(screen.getByText('Сервисы 1С')).toBeInTheDocument();
                expect(screen.getByText('Оборудование')).toBeInTheDocument();
                expect(screen.getByText('Наши разработки')).toBeInTheDocument();
            });
        });

        it('выпадающие меню закрываются при повторном клике', async () => {
            const user = userEvent.setup();
            render(<HeaderWrapper setShowLogin={mockSetShowLogin} />);

            const productsButton = screen.getByRole('button', { name: /открыть меню продукты/i });

            // Открываем меню
            await user.click(productsButton);
            await waitFor(() => {
                expect(screen.getByText('Программы 1С')).toBeInTheDocument();
            });

            // Закрываем меню
            await user.click(productsButton);
            await waitFor(() => {
                expect(screen.queryByText('Программы 1С')).not.toBeInTheDocument();
            });
        });

        it('клик по элементу подменю закрывает все меню', async () => {
            const user = userEvent.setup();
            render(<HeaderWrapper setShowLogin={mockSetShowLogin} />);

            // Открываем меню "Продукты"
            const productsButton = screen.getByRole('button', { name: /открыть меню продукты/i });
            await user.click(productsButton);

            await waitFor(() => {
                expect(screen.getByText('Программы 1С')).toBeInTheDocument();
            });

            // Кликаем по подпункту
            const programsLink = screen.getByRole('link', { name: /программы 1с/i });
            await user.click(programsLink);

            // Проверяем что меню закрылось
            await waitFor(() => {
                expect(screen.queryByText('Программы 1С')).not.toBeInTheDocument();
            });
        });
    });

    describe('Мобильная версия', () => {
        beforeEach(() => {
            // Мокаем размер окна для мобильной версии
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 640, // sm breakpoint
            });
        });

        it('показывает гамбургер-меню на мобильных устройствах', () => {
            render(<HeaderWrapper setShowLogin={mockSetShowLogin} />);

            // Проверяем наличие кнопки мобильного меню
            const mobileMenuButton = screen.getByLabelText('Открыть меню');
            expect(mobileMenuButton).toBeInTheDocument();
        });

        it('открывает мобильное меню при клике на гамбургер', async () => {
            const user = userEvent.setup();
            render(<HeaderWrapper setShowLogin={mockSetShowLogin} />);

            const mobileMenuButton = screen.getByLabelText('Открыть меню');
            await user.click(mobileMenuButton);

            // Проверяем что мобильное меню открылось и содержит все пункты
            await waitFor(() => {
                // В мобильном меню должны быть все те же пункты
                const mobileMenuItems = screen.getAllByText('Новости');
                expect(mobileMenuItems.length).toBeGreaterThan(1); // один в десктопе, один в мобиле
            });
        });

        it('закрывает мобильное меню при повторном клике', async () => {
            const user = userEvent.setup();
            render(<HeaderWrapper setShowLogin={mockSetShowLogin} />);

            const mobileMenuButton = screen.getByLabelText('Открыть меню');

            // Открываем меню
            await user.click(mobileMenuButton);
            await waitFor(() => {
                expect(screen.getByLabelText('Закрыть меню')).toBeInTheDocument();
            });

            // Закрываем меню
            const closeButton = screen.getByLabelText('Закрыть меню');
            await user.click(closeButton);

            await waitFor(() => {
                expect(screen.getByLabelText('Открыть меню')).toBeInTheDocument();
            });
        });
    });

    describe('Кнопка входа', () => {
        it('открывает модальное окно входа для неавторизованных пользователей', async () => {
            const user = userEvent.setup();

            // Мокаем ошибку авторизации
            const { authProvider } = await import('../../admin/authProvider');
            vi.mocked(authProvider.checkAuth).mockRejectedValue(new Error('Not authenticated'));

            render(<HeaderWrapper setShowLogin={mockSetShowLogin} />);

            const loginButton = screen.getByText('Войти');
            await user.click(loginButton);

            await waitFor(() => {
                expect(mockSetShowLogin).toHaveBeenCalledWith(true);
            });
        });

        it('перенаправляет админа в админ-панель', async () => {
            const user = userEvent.setup();

            // Мокаем успешную авторизацию как админ
            const { authProvider } = await import('../../admin/authProvider');
            vi.mocked(authProvider.checkAuth).mockResolvedValue({});
            vi.mocked(window.localStorage.getItem).mockReturnValue('ADMIN');

            render(<HeaderWrapper setShowLogin={mockSetShowLogin} />);

            const loginButton = screen.getByText('Войти');
            await user.click(loginButton);

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
            });
        });

        it('перенаправляет клиента в клиентскую зону', async () => {
            const user = userEvent.setup();

            // Мокаем успешную авторизацию как клиент
            const { authProvider } = await import('../../admin/authProvider');
            vi.mocked(authProvider.checkAuth).mockResolvedValue({});
            vi.mocked(window.localStorage.getItem).mockReturnValue('CLINE');

            render(<HeaderWrapper setShowLogin={mockSetShowLogin} />);

            const loginButton = screen.getByText('Войти');
            await user.click(loginButton);

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/client');
            });
        });
    });

    describe('Интерактивность', () => {
        it('применяет стили при скролле', () => {
            render(<HeaderWrapper setShowLogin={mockSetShowLogin} />);

            const header = screen.getByRole('banner');

            // Симулируем скролл
            Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
            fireEvent.scroll(window);

            // Проверяем что стили изменились (класс должен содержать backdrop-blur-lg)
            waitFor(() => {
                expect(header).toHaveClass('backdrop-blur-lg');
            });
        });

        it('закрывает выпадающие меню при клике вне их области', async () => {
            const user = userEvent.setup();
            render(<HeaderWrapper setShowLogin={mockSetShowLogin} />);

            // Открываем выпадающее меню
            const productsButton = screen.getByRole('button', { name: /открыть меню продукты/i });
            await user.click(productsButton);

            await waitFor(() => {
                expect(screen.getByText('Программы 1С')).toBeInTheDocument();
            });

            // Кликаем вне меню (например, на логотип)
            const logo = screen.getByAltText('1C Support Logo');
            await user.click(logo);

            await waitFor(() => {
                expect(screen.queryByText('Программы 1С')).not.toBeInTheDocument();
            });
        });
    });

    describe('Accessibility', () => {
        it('имеет правильные ARIA атрибуты', () => {
            render(<HeaderWrapper setShowLogin={mockSetShowLogin} />);

            // Проверяем основные ARIA атрибуты
            const header = screen.getByRole('banner');
            expect(header).toBeInTheDocument();

            // Проверяем кнопки с aria-label
            expect(screen.getByLabelText('Заказать звонок')).toBeInTheDocument();
            expect(screen.getByLabelText('Удаленный доступ')).toBeInTheDocument();
            expect(screen.getByLabelText('Открыть форму входа')).toBeInTheDocument();
        });

        it('поддерживает навигацию с клавиатуры', async () => {
            const user = userEvent.setup();
            render(<HeaderWrapper setShowLogin={mockSetShowLogin} />);

            // Проверяем что можно перемещаться по элементам с Tab
            await user.tab();

            // Первый focusable элемент должен быть логотип
            const logoLink = screen.getByLabelText('Перейти на главную страницу');
            expect(logoLink).toHaveFocus();

            // Проверяем что можно активировать элементы клавишей Enter
            const productsButton = screen.getByRole('button', { name: /открыть меню продукты/i });
            productsButton.focus();
            await user.keyboard('{Enter}');

            await waitFor(() => {
                expect(screen.getByText('Программы 1С')).toBeInTheDocument();
            });
        });
    });
}); 