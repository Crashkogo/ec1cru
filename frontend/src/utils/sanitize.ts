// frontend/src/utils/sanitize.ts
import DOMPurify from 'dompurify';

/**
 * БЕЗОПАСНОСТЬ: Санитизация HTML контента на стороне клиента (defence in depth)
 *
 * Несмотря на то, что бэкенд уже санитизирует HTML перед сохранением в БД,
 * мы применяем дополнительную санитизацию на клиенте для защиты от:
 * 1. Контента, который мог быть сохранён до внедрения санитизации на бэкенде
 * 2. Потенциальных уязвимостей в бэкенд-санитизации
 * 3. XSS атак через другие векторы (cache poisoning, MITM и т.д.)
 *
 * @param dirty - Потенциально небезопасный HTML контент
 * @returns Очищенный и безопасный HTML контент
 */
export const sanitizeHTML = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    // Разрешённые теги (соответствуют тем, что разрешены на бэкенде)
    ALLOWED_TAGS: [
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
    ALLOWED_ATTR: [
      // Общие атрибуты
      'class', 'id', 'style',
      // Ссылки
      'href', 'target', 'rel', 'title',
      // Изображения
      'src', 'alt', 'width', 'height', 'loading',
      // Таблицы
      'colspan', 'rowspan', 'headers', 'scope', 'span',
      // Семантические элементы
      'datetime',
    ],

    // Разрешённые URI схемы (защита от javascript:, data: и т.д.)
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,

    // Автоматически добавлять rel="noopener noreferrer" к внешним ссылкам
    ADD_ATTR: ['target'],

    // Хуки для дополнительной обработки
    HOOKS: {
      afterSanitizeAttributes: (node) => {
        // Добавляем безопасные атрибуты к ссылкам, открывающимся в новой вкладке
        if (node.hasAttribute('target') && node.getAttribute('target') === '_blank') {
          node.setAttribute('rel', 'noopener noreferrer');
        }
      },
    },

    // Дополнительные опции безопасности
    KEEP_CONTENT: true, // Сохранять текстовое содержимое запрещённых тегов
    RETURN_DOM: false, // Возвращать строку, а не DOM
    RETURN_DOM_FRAGMENT: false,
    RETURN_TRUSTED_TYPE: false,

    // Запрещаем опасные элементы
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'], // Запрещаем inline JS events
  });
};

/**
 * БЕЗОПАСНОСТЬ: Санитизация простого текста (удаление всех HTML тегов)
 *
 * Используется для полей, которые не должны содержать HTML вообще
 * (например, короткие описания, заголовки в некоторых случаях)
 *
 * @param text - Текст, который может содержать HTML
 * @returns Чистый текст без HTML тегов
 */
export const sanitizeText = (text: string): string => {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};
