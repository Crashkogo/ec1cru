// backend/src/utils/sanitize.ts
import sanitizeHtml from 'sanitize-html';

/**
 * БЕЗОПАСНОСТЬ: Санитизация HTML контента перед сохранением в БД
 *
 * Удаляет потенциально опасные теги и атрибуты для защиты от XSS атак.
 * Используется для всего пользовательского контента из TinyMCE редактора.
 *
 * @param dirty - Небезопасный HTML контент
 * @returns Очищенный HTML контент
 */
export const sanitizeHTMLContent = (dirty: string): string => {
  return sanitizeHtml(dirty, {
    // Разрешённые теги (поддерживаются TinyMCE)
    allowedTags: [
      // Текстовые элементы
      'p', 'br', 'span', 'div',
      // Форматирование текста
      'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del', 'ins', 'mark', 'small', 'sub', 'sup',
      // Заголовки
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      // Списки
      'ul', 'ol', 'li',
      // Таблицы
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
      // Ссылки и медиа
      'a', 'img',
      // Цитаты и код
      'blockquote', 'q', 'cite', 'code', 'pre',
      // Разное
      'hr', 'abbr', 'address', 'time',
    ],

    // Разрешённые атрибуты
    allowedAttributes: {
      // Общие атрибуты для всех элементов
      '*': ['class', 'id', 'style'],

      // Ссылки
      'a': ['href', 'target', 'rel', 'title'],

      // Изображения
      'img': ['src', 'alt', 'title', 'width', 'height', 'loading'],

      // Таблицы
      'td': ['colspan', 'rowspan', 'headers'],
      'th': ['colspan', 'rowspan', 'scope', 'headers'],
      'col': ['span'],
      'colgroup': ['span'],

      // Семантические элементы
      'time': ['datetime'],
      'abbr': ['title'],
    },

    // Разрешённые схемы для URL (защита от javascript:, data: и т.д.)
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],

    // Разрешённые протоколы для схемы 'data:' (только безопасные типы изображений)
    allowedSchemesByTag: {
      img: ['http', 'https', 'data'],
    },

    // Фильтр для data: URI - только изображения
    allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],

    // Разрешённые классы (можно ограничить только классами Tailwind)
    allowedClasses: {
      '*': ['*'], // Разрешаем все классы (Tailwind, custom)
    },

    // Разрешённые inline стили (для форматирования из TinyMCE)
    allowedStyles: {
      '*': {
        // Текст
        'color': [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(/, /^rgba\(/],
        'background-color': [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(/, /^rgba\(/],
        'font-size': [/^\d+(?:px|em|rem|%)$/],
        'font-family': [/.*/],
        'font-weight': [/^\d+$/, /^normal$/, /^bold$/],
        'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
        'text-decoration': [/.*/],

        // Размеры и отступы
        'width': [/^\d+(?:px|em|rem|%)$/],
        'height': [/^\d+(?:px|em|rem|%)$/],
        'margin': [/^\d+(?:px|em|rem)\s?.*$/],
        'padding': [/^\d+(?:px|em|rem)\s?.*$/],

        // Границы
        'border': [/.*/],
        'border-radius': [/^\d+(?:px|em|rem)$/],
      },
    },

    // Автоматически добавлять rel="noopener noreferrer" к внешним ссылкам
    transformTags: {
      'a': (tagName, attribs) => {
        // Если ссылка открывается в новой вкладке, добавляем безопасные атрибуты
        if (attribs.target === '_blank') {
          return {
            tagName: 'a',
            attribs: {
              ...attribs,
              rel: 'noopener noreferrer',
            },
          };
        }
        return {
          tagName: 'a',
          attribs,
        };
      },
    },

    // Запрещаем iframe, script, style и другие опасные теги
    // (не указаны в allowedTags, поэтому автоматически удаляются)

    // Разрешаем пустые теги (например, <br>, <hr>)
    nonTextTags: ['style', 'script', 'textarea', 'option', 'noscript'],
  });
};

/**
 * БЕЗОПАСНОСТЬ: Санитизация короткого описания (без HTML тегов)
 *
 * @param text - Текст для очистки
 * @returns Очищенный текст без HTML
 */
export const sanitizeText = (text: string): string => {
  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  });
};
