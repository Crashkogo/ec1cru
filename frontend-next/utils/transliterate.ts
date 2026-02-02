/**
 * Функция транслитерации русского текста в латинский slug
 *
 * Примеры:
 * "Привет Мир!" -> "privet-mir"
 * "Новость о важном событии" -> "novost-o-vazhnom-sobytii"
 * "ЗАГОЛОВОК В ВЕРХНЕМ РЕГИСТРЕ" -> "zagolovok-v-verhnem-registre"
 */
export const transliterate = (text: string): string => {
  const ruToEn: { [key: string]: string } = {
    // Нижний регистр
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
    // Верхний регистр
    А: 'a',
    Б: 'b',
    В: 'v',
    Г: 'g',
    Д: 'd',
    Е: 'e',
    Ё: 'e',
    Ж: 'zh',
    З: 'z',
    И: 'i',
    Й: 'y',
    К: 'k',
    Л: 'l',
    М: 'm',
    Н: 'n',
    О: 'o',
    П: 'p',
    Р: 'r',
    С: 's',
    Т: 't',
    У: 'u',
    Ф: 'f',
    Х: 'kh',
    Ц: 'ts',
    Ч: 'ch',
    Ш: 'sh',
    Щ: 'sch',
    Ъ: '',
    Ы: 'y',
    Ь: '',
    Э: 'e',
    Ю: 'yu',
    Я: 'ya',
    // Пробелы и знаки препинания
    ' ': '-',
    ',': '',
    '.': '',
    '!': '',
    '?': '',
    ':': '',
    ';': '',
    '"': '',
    "'": '',
    '(': '',
    ')': '',
    '[': '',
    ']': '',
    '{': '',
    '}': '',
    '/': '',
    '\\': '',
    '|': '',
    '+': '',
    '=': '',
    '*': '',
    '&': '',
    '%': '',
    '#': '',
    '@': '',
    '№': '',
  };

  return text
    .split('')
    .map((char) => ruToEn[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Тестовая функция для проверки в консоли браузера
// Использование: window.testTransliterate("Тестовый заголовок")
export const testTransliterate = (text: string) => {
  const result = transliterate(text);
  console.log(`"${text}" → "${result}"`);
  return result;
};

// Добавляем в window для доступа из консоли браузера
if (typeof window !== 'undefined') {
  (window as any).testTransliterate = testTransliterate;
}
