// frontend/src/admin/i18nProvider.ts
import { TranslationMessages } from 'react-admin';
import russianMessages from 'ra-language-russian';

// Кастомные переводы для конкретных элементов
const customRussianMessages: TranslationMessages = {
  ...russianMessages,
  ra: {
    ...russianMessages.ra,
    action: {
      ...russianMessages.ra.action,
      create: 'Создать', // Перевод кнопки "+ Create"
      export: 'Экспортировать', // Перевод кнопки "Export"
    },
    page: {
      ...russianMessages.ra.page,
      rows_per_page: 'Строк на странице:', // Перевод "Rows per page:"
      range: '%{from}-%{to} из %{total}', // Перевод "1-4 of 4"
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
