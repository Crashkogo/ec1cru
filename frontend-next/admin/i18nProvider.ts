// admin/i18nProvider.ts
import { TranslationMessages } from 'react-admin';
import russianMessages from 'ra-language-russian';

// Кастомные переводы для конкретных элементов
const customRussianMessages: TranslationMessages = {
  ...russianMessages,
  ra: {
    ...russianMessages.ra,
    action: {
      ...russianMessages.ra.action,
      create: 'Создать',
      export: 'Экспортировать',
      edit: 'Редактировать',
      delete: 'Удалить',
    },
    page: {
      ...russianMessages.ra.page,
      rows_per_page: 'Строк на странице:',
      range: '%{from}-%{to} из %{total}',
      empty: 'Нет записей',
      invite: 'Хотите добавить запись?',
    },
  },
  resources: {
    news: {
      name: 'Новость |||| Новости',
      fields: {
        title: 'Заголовок',
        shortDescription: 'Краткое описание',
        content: 'Содержание',
      },
      empty: 'Нет новостей',
      invite: 'Хотите создать первую новость?',
    },
    events: {
      name: 'Мероприятие |||| Мероприятия',
      fields: {
        title: 'Название',
        shortDescription: 'Краткое описание',
        startDate: 'Дата проведения',
      },
      empty: 'Нет мероприятий',
      invite: 'Хотите создать первое мероприятие?',
    },
    promotions: {
      name: 'Акция |||| Акции',
      fields: {
        title: 'Название',
        shortDescription: 'Краткое описание',
        startDate: 'Дата начала',
        endDate: 'Дата окончания',
      },
      empty: 'Нет акций',
      invite: 'Хотите создать первую акцию?',
    },
    'company-life': {
      name: 'Жизнь компании |||| Жизнь компании',
      fields: {
        title: 'Заголовок',
        shortDescription: 'Краткое описание',
      },
      empty: 'Нет постов о жизни компании',
      invite: 'Хотите создать первый пост?',
    },
    'ready-solutions': {
      name: 'Готовое решение |||| Готовые решения',
      fields: {
        title: 'Название',
        shortDescription: 'Краткое описание',
        type: 'Тип',
        price: 'Цена',
      },
      empty: 'Нет готовых решений',
      invite: 'Хотите добавить первое готовое решение?',
    },
    courses: {
      name: 'Курс |||| Курсы',
      fields: {
        title: 'Название',
        shortDescription: 'Краткое описание',
      },
      empty: 'Нет курсов',
      invite: 'Хотите создать первый курс?',
    },
    testimonials: {
      name: 'Отзыв |||| Отзывы',
      fields: {
        companyName: 'Название компании',
        content: 'Контент',
      },
      empty: 'Нет отзывов',
      invite: 'Хотите добавить первый отзыв?',
    },
    programs: {
      name: 'Программа |||| Программы',
      fields: {
        name: 'Название',
      },
      empty: 'Нет программ',
      invite: 'Хотите добавить первую программу?',
    },
    users: {
      name: 'Пользователь |||| Пользователи',
      fields: {
        name: 'Имя',
        email: 'Email',
        role: 'Роль',
      },
      empty: 'Нет пользователей',
      invite: 'Хотите добавить первого пользователя?',
    },
    employees: {
      name: 'Сотрудник |||| Сотрудники',
      fields: {
        name: 'Имя',
        position: 'Должность',
      },
      empty: 'Нет сотрудников',
      invite: 'Хотите добавить первого сотрудника?',
    },
    clients: {
      name: 'Клиент |||| Клиенты',
      fields: {
        companyName: 'Название компании',
        inn: 'ИНН',
      },
      empty: 'Нет клиентов',
      invite: 'Хотите добавить первого клиента?',
    },
    newsletters: {
      name: 'Рассылка |||| Рассылки',
      fields: {
        title: 'Название',
        htmlContent: 'HTML-контент',
      },
      empty: 'Нет шаблонов рассылок',
      invite: 'Хотите создать первый шаблон?',
    },
    'newsletters-send': {
      name: 'Отправка рассылок',
      empty: 'Отправка рассылок',
      invite: 'Настройте и отправьте рассылку',
    },
    subscribers: {
      name: 'Подписчик |||| Подписчики',
      fields: {
        email: 'Email',
        isActive: 'Активен',
        subscribedAt: 'Дата подписки',
      },
      empty: 'Нет подписчиков',
      invite: 'Подписчики появятся автоматически',
    },
    'tariff-plans': {
      name: 'Тарифный план |||| Тарифные планы',
      empty: 'Нет тарифных планов',
      invite: 'Хотите добавить первый тарифный план?',
    },
    'its-tariff-plans': {
      name: 'Тариф ИТС |||| Тарифы ИТС',
      empty: 'Нет тарифов ИТС',
      invite: 'Хотите добавить первый тариф ИТС?',
    },
  },
};

export const i18nProvider = {
  translate: (key: string, options?: { [key: string]: string }) => {
    const translation = key
      .split('.')
      .reduce<string | Record<string, unknown> | undefined>((obj, k) => {
        if (obj && typeof obj === 'object' && k in obj) {
          return (obj as Record<string, unknown>)[k] as
            | string
            | Record<string, unknown>
            | undefined;
        }
        return undefined;
      }, customRussianMessages);

    if (typeof translation !== 'string') {
      return key; // Возвращаем ключ, если перевод не найден или это не строка
    }

    if (options) {
      let translatedStr = translation;
      Object.keys(options).forEach((param) => {
        translatedStr = translatedStr.replace(`%{${param}}`, options[param]);
      });
      return translatedStr;
    }

    return translation;
  },
  changeLocale: () => Promise.resolve(), // Поддержка смены языка (пока только русский)
  getLocale: () => 'ru', // Текущий язык
};
