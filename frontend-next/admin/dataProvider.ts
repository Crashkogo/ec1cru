import {
  DataProvider,
  fetchUtils,
  RaRecord,
  DeleteParams,
  DeleteResult,
} from 'react-admin';
import queryString from 'query-string';

const stringify = queryString.stringify;

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface HttpError {
  status: number;
  body?: { message?: string };
}

// БЕЗОПАСНОСТЬ: HTTP fetch с автоматической отправкой HttpOnly cookies
const httpClient = (url: string, options: any = {}) => {
  // Добавляем credentials для отправки cookies с каждым запросом
  const fetchOptions = {
    ...options,
    credentials: 'include', // ВАЖНО: Отправка HttpOnly cookies
  };
  return fetchUtils.fetchJson(url, fetchOptions);
};

export const dataProvider: DataProvider = {
  // Получение списка записей
  getList: async (resource, params) => {
    const pagination = params.pagination || { page: 1, perPage: 10 };
    const { page, perPage } = pagination;

    if (resource === 'users') {
      const query = {
        _start: ((page - 1) * perPage).toString(),
        _end: (page * perPage).toString(),
        _sort: params.sort?.field || 'id',
        _order: params.sort?.order || 'ASC',
        ...params.filter,
      };
      const url = `${apiUrl}/api/users?${stringify(query)}`;
      const { json, headers: responseHeaders } = await httpClient(url);
      return {
        data: json,
        total: parseInt(responseHeaders.get('X-Total-Count') || '0'),
      };
    }

    if (resource === 'news') {
      const query = {
        _start: ((page - 1) * perPage).toString(),
        _end: (page * perPage).toString(),
        _sort: params.sort?.field || 'createdAt',
        _order: params.sort?.order || 'DESC',
        ...params.filter,
      };
      const url = `${apiUrl}/api/posts/admin/news?${stringify(query)}`;
      const { json, headers: responseHeaders } = await httpClient(url);

      // Оставляем оригинальный ID для React Admin
      const data = Array.isArray(json)
        ? json.map((item) => ({
            ...item,
            id: item.id, // используем числовой ID
          }))
        : [json];

      return {
        data,
        total: parseInt(responseHeaders.get('X-Total-Count') || '0'),
      };
    }

    if (resource === 'courses') {
      const query = {
        _start: ((page - 1) * perPage).toString(),
        _end: (page * perPage).toString(),
        _sort: params.sort?.field || 'createdAt',
        _order: params.sort?.order || 'DESC',
        ...params.filter,
      };
      const url = `${apiUrl}/api/admin/courses?${stringify(query)}`;
      const { json, headers: responseHeaders } = await httpClient(url);

      const data = Array.isArray(json)
        ? json.map((item) => ({
            ...item,
            id: item.id,
          }))
        : [json];

      return {
        data,
        total: parseInt(responseHeaders.get('X-Total-Count') || '0'),
      };
    }

    if (resource === 'events') {
      const query = {
        _start: ((page - 1) * perPage).toString(),
        _end: (page * perPage).toString(),
        _sort: params.sort?.field || 'createdAt',
        _order: params.sort?.order || 'DESC',
        ...params.filter,
      };
      const url = `${apiUrl}/api/posts/admin/events?${stringify(query)}`;
      const { json, headers: responseHeaders } = await httpClient(url);

      // Оставляем оригинальный ID для React Admin
      const data = Array.isArray(json)
        ? json.map((item) => ({
            ...item,
            id: item.id, // используем числовой ID
          }))
        : [json];

      return {
        data,
        total: parseInt(responseHeaders.get('X-Total-Count') || '0'),
      };
    }

    if (resource === 'promotions') {
      const query = {
        _start: ((page - 1) * perPage).toString(),
        _end: (page * perPage).toString(),
        _sort: params.sort?.field || 'createdAt',
        _order: params.sort?.order || 'DESC',
        ...params.filter,
      };
      const url = `${apiUrl}/api/posts/admin/promotions?${stringify(query)}`;
      const { json, headers: responseHeaders } = await httpClient(url);

      // Оставляем оригинальный ID для React Admin
      const data = Array.isArray(json)
        ? json.map((item) => ({
            ...item,
            id: item.id, // используем числовой ID
          }))
        : [json];

      return {
        data,
        total: parseInt(responseHeaders.get('X-Total-Count') || '0'),
      };
    }

    if (resource === 'company-life') {
      const query = {
        _start: ((page - 1) * perPage).toString(),
        _end: (page * perPage).toString(),
        _sort: params.sort?.field || 'createdAt',
        _order: params.sort?.order || 'DESC',
        ...params.filter,
      };
      const url = `${apiUrl}/api/posts/admin/company-life?${stringify(query)}`;
      const { json, headers: responseHeaders } = await httpClient(url);

      // Оставляем оригинальный ID для React Admin
      const data = Array.isArray(json)
        ? json.map((item) => ({
            ...item,
            id: item.id, // используем числовой ID
          }))
        : [json];

      return {
        data,
        total: parseInt(responseHeaders.get('X-Total-Count') || '0'),
      };
    }

    if (resource === 'ready-solutions') {
      const query = {
        _start: ((page - 1) * perPage).toString(),
        _end: (page * perPage).toString(),
        _sort: params.sort?.field || 'createdAt',
        _order: params.sort?.order || 'DESC',
        ...params.filter,
      };
      const url = `${apiUrl}/api/posts/admin/ready-solutions?${stringify(query)}`;
      const { json, headers: responseHeaders } = await httpClient(url);

      // Используем числовой ID для React Admin
      const data = Array.isArray(json)
        ? json.map((item) => ({
            ...item,
            id: item.id, // используем числовой ID
          }))
        : [json];

      return {
        data,
        total: parseInt(responseHeaders.get('X-Total-Count') || '0'),
      };
    }

    if (resource === 'programs') {
      const query = {
        _start: ((page - 1) * perPage).toString(),
        _end: (page * perPage).toString(),
        _sort: params.sort?.field || 'id',
        _order: params.sort?.order || 'ASC',
        ...params.filter,
      };
      const url = `${apiUrl}/api/posts/admin/programs?${stringify(query)}`;
      const { json, headers: responseHeaders } = await httpClient(url);

      const data = Array.isArray(json) ? json : [json];

      return {
        data,
        total: parseInt(
          responseHeaders.get('X-Total-Count') || data.length.toString()
        ),
      };
    }

    if (resource === 'newsletters') {
      const query = {
        _start: ((page - 1) * perPage).toString(),
        _end: (page * perPage).toString(),
        _sort: params.sort?.field || 'createdAt',
        _order: params.sort?.order || 'DESC',
        ...params.filter,
      };
      const url = `${apiUrl}/api/posts/admin/newsletters?${stringify(query)}`;
      const { json, headers: responseHeaders } = await httpClient(url);

      const data = Array.isArray(json) ? json : [json];

      return {
        data,
        total: parseInt(responseHeaders.get('X-Total-Count') || '0'),
      };
    }

    if (resource === 'subscribers') {
      const query = {
        _start: ((page - 1) * perPage).toString(),
        _end: (page * perPage).toString(),
        _sort: params.sort?.field || 'createdAt',
        _order: params.sort?.order || 'DESC',
        ...params.filter,
      };
      const url = `${apiUrl}/api/posts/admin/subscribers?${stringify(query)}`;
      const { json, headers: responseHeaders } = await httpClient(url);

      const data = Array.isArray(json) ? json : [json];

      return {
        data,
        total: parseInt(responseHeaders.get('X-Total-Count') || '0'),
      };
    }

    if (resource === 'event-registrations') {
      let eventId = params.filter?.eventId;

      // Если eventId нет в фильтре, пробуем получить из URL (после хеша)
      if (!eventId && typeof window !== 'undefined') {
        // React Admin использует хеш-роутинг, поэтому параметры после #
        const hash = window.location.hash;

        // Извлекаем часть после ? в хеше
        const hashQueryIndex = hash.indexOf('?');
        if (hashQueryIndex !== -1) {
          const hashQuery = hash.substring(hashQueryIndex + 1);

          const urlParams = new URLSearchParams(hashQuery);
          const filterParam = urlParams.get('filter');

          if (filterParam) {
            try {
              const parsedFilter = JSON.parse(decodeURIComponent(filterParam));
              eventId = parsedFilter.eventId;
            } catch (e) {
              console.error('Error parsing filter from hash URL:', e);
            }
          }
        }
      }

      if (!eventId) {
        return { data: [], total: 0 };
      }

      const query = { eventId };
      const url = `${apiUrl}/api/posts/admin/events/registrations?${stringify(query)}`;

      try {
        const { json } = await httpClient(url);

        const data = Array.isArray(json) ? json : [json];

        return {
          data,
          total: data.length,
        };
      } catch (error) {
        console.error('Error fetching event registrations:', error);
        return { data: [], total: 0 };
      }
    }

    if (resource === 'testimonials') {
      const query = {
        _start: ((page - 1) * perPage).toString(),
        _end: (page * perPage).toString(),
        _sort: params.sort?.field || 'createdAt',
        _order: params.sort?.order || 'DESC',
        ...params.filter,
      };
      const url = `${apiUrl}/api/posts/admin/testimonials?${stringify(query)}`;
      const { json, headers: responseHeaders } = await httpClient(url);

      const data = Array.isArray(json)
        ? json.map((item) => ({
            ...item,
            id: item.id,
          }))
        : [json];

      return {
        data,
        total: parseInt(responseHeaders.get('X-Total-Count') || '0'),
      };
    }

    if (resource === 'tariff-plans') {
      const query = {
        _start: ((page - 1) * perPage).toString(),
        _end: (page * perPage).toString(),
        _sort: params.sort?.field || 'order',
        _order: params.sort?.order || 'ASC',
        ...params.filter,
      };
      const url = `${apiUrl}/api/admin/tariff-plans?${stringify(query)}`;

      try {
        const { json, headers: responseHeaders } = await httpClient(url);

        const data = Array.isArray(json) ? json : [json];

        return {
          data,
          total: parseInt(responseHeaders.get('X-Total-Count') || '0'),
        };
      } catch (error) {
        console.error('Error fetching tariff-plans:', error);
        throw error;
      }
    }

    if (resource === 'its-tariff-plans') {
      const query = {
        _start: ((page - 1) * perPage).toString(),
        _end: (page * perPage).toString(),
        _sort: params.sort?.field || 'order',
        _order: params.sort?.order || 'ASC',
        ...params.filter,
      };
      const url = `${apiUrl}/api/admin/its-tariff-plans?${stringify(query)}`;

      try {
        const { json, headers: responseHeaders } = await httpClient(url);

        const data = Array.isArray(json) ? json : [json];

        return {
          data,
          total: parseInt(responseHeaders.get('X-Total-Count') || '0'),
        };
      } catch (error) {
        console.error('Error fetching its-tariff-plans:', error);
        throw error;
      }
    }

    if (resource === 'employees') {
      const query = {
        _start: ((page - 1) * perPage).toString(),
        _end: (page * perPage).toString(),
        _sort: params.sort?.field || 'id',
        _order: params.sort?.order || 'ASC',
        ...params.filter,
      };
      const url = `${apiUrl}/api/employees?${stringify(query)}`;
      const { json, headers: responseHeaders } = await httpClient(url);
      return {
        data: json,
        total: parseInt(responseHeaders.get('X-Total-Count') || '0'),
      };
    }

    if (resource === 'clients') {
      const query = {
        _start: ((page - 1) * perPage).toString(),
        _end: (page * perPage).toString(),
        _sort: params.sort?.field || 'id',
        _order: params.sort?.order || 'ASC',
        ...params.filter,
      };
      const url = `${apiUrl}/api/clients?${stringify(query)}`;
      const { json, headers: responseHeaders } = await httpClient(url);
      return {
        data: json,
        total: parseInt(responseHeaders.get('X-Total-Count') || '0'),
      };
    }

    return Promise.reject('Resource not supported');
  },

  // Получение одной записи
  getOne: async (resource, params) => {
    if (resource === 'users') {
      const url = `${apiUrl}/api/users/${params.id}`;
      const { json } = await httpClient(url);
      return { data: json };
    }

    if (resource === 'news') {
      // Для админки получаем новость по slug через обычный маршрут
      const url = `${apiUrl}/api/posts/admin/news/${params.id}`;
      try {
        const { json } = await httpClient(url);
        return { data: { ...json, id: json.id } }; // используем оригинальный ID
      } catch (error) {
        console.error('GetOne news error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to fetch news'
        );
      }
    }

    if (resource === 'courses') {
      const url = `${apiUrl}/api/admin/courses/${params.id}`;
      try {
        const { json } = await httpClient(url);
        return { data: { ...json, id: json.id } };
      } catch (error) {
        console.error('GetOne course error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to fetch course'
        );
      }
    }

    if (resource === 'events') {
      const url = `${apiUrl}/api/posts/admin/events/${params.id}`;
      try {
        const { json } = await httpClient(url);
        return { data: { ...json, id: json.id } }; // используем оригинальный ID
      } catch (error) {
        console.error('GetOne event error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to fetch event'
        );
      }
    }

    if (resource === 'promotions') {
      const url = `${apiUrl}/api/posts/admin/promotions/${params.id}`;
      try {
        const { json } = await httpClient(url);
        return { data: { ...json, id: json.id } }; // используем оригинальный ID
      } catch (error) {
        console.error('GetOne promotion error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to fetch promotion'
        );
      }
    }

    if (resource === 'company-life') {
      const url = `${apiUrl}/api/posts/admin/company-life/${params.id}`;
      try {
        const { json } = await httpClient(url);
        return { data: { ...json, id: json.id } }; // используем оригинальный ID
      } catch (error) {
        console.error('GetOne company-life error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to fetch company-life post'
        );
      }
    }

    if (resource === 'ready-solutions') {
      const url = `${apiUrl}/api/posts/admin/ready-solutions/${params.id}`;
      try {
        const { json } = await httpClient(url);
        return { data: { ...json, id: json.id } }; // используем числовой ID
      } catch (error) {
        console.error('GetOne ready solution error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to fetch ready solution'
        );
      }
    }

    if (resource === 'programs') {
      const url = `${apiUrl}/api/posts/admin/programs/${params.id}`;
      try {
        const { json } = await httpClient(url);
        return { data: json };
      } catch (error) {
        console.error('GetOne program error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to fetch program'
        );
      }
    }

    if (resource === 'newsletters') {
      const url = `${apiUrl}/api/posts/admin/newsletters/${params.id}`;
      try {
        const { json } = await httpClient(url);
        return { data: json };
      } catch (error) {
        console.error('GetOne newsletter error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to fetch newsletter'
        );
      }
    }

    if (resource === 'subscribers') {
      const url = `${apiUrl}/api/posts/admin/subscribers/${params.id}`;
      try {
        const { json } = await httpClient(url);
        return { data: json };
      } catch (error) {
        console.error('GetOne subscriber error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to fetch subscriber'
        );
      }
    }

    if (resource === 'testimonials') {
      const url = `${apiUrl}/api/posts/admin/testimonials/${params.id}`;
      try {
        const { json } = await httpClient(url);
        return { data: { ...json, id: json.id } };
      } catch (error) {
        console.error('GetOne testimonial error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to fetch testimonial'
        );
      }
    }

    if (resource === 'tariff-plans') {
      const url = `${apiUrl}/api/admin/tariff-plans/${params.id}`;
      try {
        const { json } = await httpClient(url);
        return { data: json };
      } catch (error) {
        console.error('GetOne tariff plan error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to fetch tariff plan'
        );
      }
    }

    if (resource === 'its-tariff-plans') {
      const url = `${apiUrl}/api/admin/its-tariff-plans/${params.id}`;
      try {
        const { json } = await httpClient(url);
        return { data: json };
      } catch (error) {
        console.error('GetOne its-tariff plan error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to fetch its-tariff plan'
        );
      }
    }

    if (resource === 'employees') {
      const url = `${apiUrl}/api/employees/${params.id}`;
      try {
        const { json } = await httpClient(url);
        return { data: json };
      } catch (error) {
        console.error('GetOne employee error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to fetch employee'
        );
      }
    }

    if (resource === 'clients') {
      const url = `${apiUrl}/api/clients/${params.id}`;
      try {
        const { json } = await httpClient(url);
        return { data: json };
      } catch (error) {
        console.error('GetOne client error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to fetch client'
        );
      }
    }

    return Promise.reject('Resource not supported');
  },

  // Получение нескольких записей по ID
  getMany: async (resource, params) => {
    if (resource === 'users') {
      const query = { id: params.ids.join(',') };
      const url = `${apiUrl}/api/users?${stringify(query)}`;
      const { json } = await httpClient(url);
      return { data: Array.isArray(json) ? json : [json] };
    }

    if (resource === 'news') {
      // Для новостей получаем каждую по отдельности через админский маршрут
      const promises = params.ids.map((id) =>
        httpClient(`${apiUrl}/api/posts/admin/news/${id}`)
      );
      const results = await Promise.all(promises);
      const data = results.map(({ json }) => ({
        ...json,
        id: json.id, // используем оригинальный ID
      }));
      return { data };
    }

    if (resource === 'courses') {
      const promises = params.ids.map((id) =>
        httpClient(`${apiUrl}/api/admin/courses/${id}`)
      );
      const results = await Promise.all(promises);
      const data = results.map(({ json }) => ({
        ...json,
        id: json.id,
      }));
      return { data };
    }

    if (resource === 'events') {
      // Для мероприятий получаем каждое по отдельности через админский маршрут
      const promises = params.ids.map((id) =>
        httpClient(`${apiUrl}/api/posts/admin/events/${id}`)
      );
      const results = await Promise.all(promises);
      const data = results.map(({ json }) => ({
        ...json,
        id: json.id, // используем оригинальный ID
      }));
      return { data };
    }

    if (resource === 'promotions') {
      // Для акций получаем каждую по отдельности через админский маршрут
      const promises = params.ids.map((id) =>
        httpClient(`${apiUrl}/api/posts/admin/promotions/${id}`)
      );
      const results = await Promise.all(promises);
      const data = results.map(({ json }) => ({
        ...json,
        id: json.id, // используем оригинальный ID
      }));
      return { data };
    }

    if (resource === 'company-life') {
      // Для постов о жизни компании получаем каждый по отдельности через админский маршрут
      const promises = params.ids.map((id) =>
        httpClient(`${apiUrl}/api/posts/admin/company-life/${id}`)
      );
      const results = await Promise.all(promises);
      const data = results.map(({ json }) => ({
        ...json,
        id: json.id, // используем оригинальный ID
      }));
      return { data };
    }

    if (resource === 'ready-solutions') {
      // Для готовых решений получаем каждое по отдельности через админский маршрут
      const promises = params.ids.map((id) =>
        httpClient(`${apiUrl}/api/posts/admin/ready-solutions/${id}`)
      );
      const results = await Promise.all(promises);
      const data = results.map(({ json }) => ({
        ...json,
        id: json.id, // используем числовой ID
      }));
      return { data };
    }

    if (resource === 'employees') {
      const promises = params.ids.map((id) =>
        httpClient(`${apiUrl}/api/employees/${id}`)
      );
      const results = await Promise.all(promises);
      const data = results.map(({ json }) => json);
      return { data };
    }

    if (resource === 'clients') {
      const promises = params.ids.map((id) =>
        httpClient(`${apiUrl}/api/clients/${id}`)
      );
      const results = await Promise.all(promises);
      const data = results.map(({ json }) => json);
      return { data };
    }

    return Promise.reject('Resource not supported');
  },

  // Получение записей, ссылающихся на другую запись
  getManyReference: async (resource, params) => {
    const pagination = params.pagination || { page: 1, perPage: 10 };
    const { page, perPage } = pagination;

    if (resource === 'users') {
      const query = {
        [params.target]: params.id,
        page: page.toString(),
        limit: perPage.toString(),
      };
      const url = `${apiUrl}/api/users?${stringify(query)}`;
      const { json } = await httpClient(url);
      return { data: json, total: json.total || json.length };
    }

    if (resource === 'news') {
      // Для новостей возвращаем пустой результат, так как нет связанных записей
      return { data: [], total: 0 };
    }

    return Promise.reject('Resource not supported');
  },

  // Создание новой записи
  create: async (resource, params) => {
    if (resource === 'users') {
      const url = `${apiUrl}/api/users/register`;
      const { json } = await httpClient(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
      });
      return { data: json.user };
    }

    if (resource === 'news') {
      const url = `${apiUrl}/api/posts/news`;
      const { json } = await httpClient(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
      });
      return { data: { ...json, id: json.id } }; // используем оригинальный ID
    }

    if (resource === 'courses') {
      const url = `${apiUrl}/api/courses`;
      const { json } = await httpClient(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
      });
      return { data: { ...json, id: json.id } };
    }

    if (resource === 'events') {
      const url = `${apiUrl}/api/posts/events`;
      const { json } = await httpClient(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
      });
      return { data: { ...json, id: json.id } }; // используем оригинальный ID
    }

    if (resource === 'promotions') {
      const url = `${apiUrl}/api/posts/promotions`;
      const { json } = await httpClient(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
      });
      return { data: { ...json, id: json.id } }; // используем оригинальный ID
    }

    if (resource === 'company-life') {
      const url = `${apiUrl}/api/posts/company-life`;
      const { json } = await httpClient(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
      });
      return { data: { ...json, id: json.id } }; // используем оригинальный ID
    }

    if (resource === 'ready-solutions') {
      const url = `${apiUrl}/api/posts/admin/ready-solutions`;
      const { json } = await httpClient(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
      });
      return { data: { ...json, id: json.id } }; // используем числовой ID
    }

    if (resource === 'programs') {
      const url = `${apiUrl}/api/posts/admin/programs`;
      const { json } = await httpClient(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
      });
      return { data: json };
    }

    if (resource === 'newsletters') {
      const url = `${apiUrl}/api/posts/newsletters`;
      const { json } = await httpClient(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
      });
      return { data: json };
    }

    if (resource === 'testimonials') {
      const url = `${apiUrl}/api/posts/testimonials`;
      const { json } = await httpClient(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
      });
      return { data: { ...json, id: json.id } };
    }

    if (resource === 'tariff-plans') {
      const url = `${apiUrl}/api/admin/tariff-plans`;
      const { json } = await httpClient(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
      });
      return { data: json };
    }

    if (resource === 'its-tariff-plans') {
      const url = `${apiUrl}/api/admin/its-tariff-plans`;
      const { json } = await httpClient(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
      });
      return { data: json };
    }

    if (resource === 'employees') {
      const url = `${apiUrl}/api/employees`;
      const { json } = await httpClient(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
      });
      return { data: json };
    }

    if (resource === 'clients') {
      const url = `${apiUrl}/api/clients`;
      const { json } = await httpClient(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
      });
      return { data: json };
    }

    return Promise.reject('Resource not supported');
  },

  // Обновление записи
  update: async (resource, params) => {
    if (resource === 'users') {
      const url = `${apiUrl}/api/users/${params.id}`;
      const data = {
        name: params.data.name,
        role: params.data.role,
        ...(params.data.password ? { password: params.data.password } : {}),
      };
      try {
        const { json } = await httpClient(url, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        return { data: json.user };
      } catch (error) {
        console.error('Update error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to update user'
        );
      }
    }

    if (resource === 'news') {
      // Используем админский маршрут с ID
      const url = `${apiUrl}/api/posts/admin/news/${params.id}`;
      try {
        const { json } = await httpClient(url, {
          method: 'PATCH',
          body: JSON.stringify(params.data),
        });
        return { data: { ...json, id: json.id } }; // используем оригинальный ID
      } catch (error) {
        console.error('Update news error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to update news'
        );
      }
    }

    if (resource === 'courses') {
      const url = `${apiUrl}/api/admin/courses/${params.id}`;
      try {
        const { json } = await httpClient(url, {
          method: 'PATCH',
          body: JSON.stringify(params.data),
        });
        return { data: { ...json, id: json.id } };
      } catch (error) {
        console.error('Update course error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to update course'
        );
      }
    }

    if (resource === 'events') {
      // Используем админский маршрут с ID
      const url = `${apiUrl}/api/posts/admin/events/${params.id}`;
      try {
        const { json } = await httpClient(url, {
          method: 'PATCH',
          body: JSON.stringify(params.data),
        });
        return { data: { ...json, id: json.id } }; // используем оригинальный ID
      } catch (error) {
        console.error('Update event error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to update event'
        );
      }
    }

    if (resource === 'promotions') {
      // Используем админский маршрут с ID
      const url = `${apiUrl}/api/posts/admin/promotions/${params.id}`;
      try {
        const { json } = await httpClient(url, {
          method: 'PATCH',
          body: JSON.stringify(params.data),
        });
        return { data: { ...json, id: json.id } }; // используем оригинальный ID
      } catch (error) {
        console.error('Update promotion error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to update promotion'
        );
      }
    }

    if (resource === 'company-life') {
      // Используем админский маршрут с ID
      const url = `${apiUrl}/api/posts/admin/company-life/${params.id}`;
      try {
        const { json } = await httpClient(url, {
          method: 'PATCH',
          body: JSON.stringify(params.data),
        });
        return { data: { ...json, id: json.id } }; // используем оригинальный ID
      } catch (error) {
        console.error('Update company-life error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to update company-life post'
        );
      }
    }

    if (resource === 'ready-solutions') {
      // Используем админский маршрут с ID
      const url = `${apiUrl}/api/posts/admin/ready-solutions/${params.id}`;
      try {
        const { json } = await httpClient(url, {
          method: 'PATCH',
          body: JSON.stringify(params.data),
        });
        return { data: { ...json, id: json.id } }; // используем числовой ID
      } catch (error) {
        console.error('Update ready solution error:', error);
        throw new Error(
          (error as HttpError).body?.message ||
            'Failed to update ready solution'
        );
      }
    }

    if (resource === 'programs') {
      const url = `${apiUrl}/api/posts/admin/programs/${params.id}`;
      try {
        const { json } = await httpClient(url, {
          method: 'PATCH',
          body: JSON.stringify(params.data),
        });
        return { data: json };
      } catch (error) {
        console.error('Update program error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to update program'
        );
      }
    }

    if (resource === 'newsletters') {
      const url = `${apiUrl}/api/posts/admin/newsletters/${params.id}`;
      try {
        const { json } = await httpClient(url, {
          method: 'PATCH',
          body: JSON.stringify(params.data),
        });
        return { data: json };
      } catch (error) {
        console.error('Update newsletter error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to update newsletter'
        );
      }
    }

    if (resource === 'subscribers') {
      const url = `${apiUrl}/api/posts/admin/subscribers/${params.id}`;
      try {
        const { json } = await httpClient(url, {
          method: 'PATCH',
          body: JSON.stringify(params.data),
        });
        return { data: json };
      } catch (error) {
        console.error('Update subscriber error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to update subscriber'
        );
      }
    }

    if (resource === 'testimonials') {
      const url = `${apiUrl}/api/posts/admin/testimonials/${params.id}`;
      try {
        const { json } = await httpClient(url, {
          method: 'PATCH',
          body: JSON.stringify(params.data),
        });
        return { data: { ...json, id: json.id } };
      } catch (error) {
        console.error('Update testimonial error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to update testimonial'
        );
      }
    }

    if (resource === 'tariff-plans') {
      const url = `${apiUrl}/api/admin/tariff-plans/${params.id}`;
      try {
        const { json } = await httpClient(url, {
          method: 'PUT',
          body: JSON.stringify(params.data),
        });
        return { data: json };
      } catch (error) {
        console.error('Update tariff plan error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to update tariff plan'
        );
      }
    }

    if (resource === 'its-tariff-plans') {
      const url = `${apiUrl}/api/admin/its-tariff-plans/${params.id}`;
      try {
        const { json } = await httpClient(url, {
          method: 'PUT',
          body: JSON.stringify(params.data),
        });
        return { data: json };
      } catch (error) {
        console.error('Update its-tariff plan error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to update its-tariff plan'
        );
      }
    }

    if (resource === 'employees') {
      const url = `${apiUrl}/api/employees/${params.id}`;
      try {
        const { json } = await httpClient(url, {
          method: 'PUT',
          body: JSON.stringify(params.data),
        });
        return { data: json };
      } catch (error) {
        console.error('Update employee error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to update employee'
        );
      }
    }

    if (resource === 'clients') {
      const url = `${apiUrl}/api/clients/${params.id}`;
      try {
        const { json } = await httpClient(url, {
          method: 'PUT',
          body: JSON.stringify(params.data),
        });
        return { data: json };
      } catch (error) {
        console.error('Update client error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to update client'
        );
      }
    }

    return Promise.reject('Resource not supported');
  },

  // Обновление нескольких записей
  updateMany: async (resource, params) => {
    if (resource === 'users') {
      const data = {
        name: params.data.name,
        role: params.data.role,
        ...(params.data.password ? { password: params.data.password } : {}),
      };
      const results = await Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/api/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
          })
        )
      );
      return { data: results.map(({ json }) => json.user.id) };
    }

    if (resource === 'news') {
      // Используем админские маршруты с ID
      const results = await Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/api/posts/admin/news/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(params.data),
          })
        )
      );
      return { data: results.map(({ json }) => json.id) };
    }

    if (resource === 'events') {
      // Используем админские маршруты с ID
      const results = await Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/api/posts/admin/events/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(params.data),
          })
        )
      );
      return { data: results.map(({ json }) => json.id) };
    }

    if (resource === 'promotions') {
      // Используем админские маршруты с ID
      const results = await Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/api/posts/admin/promotions/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(params.data),
          })
        )
      );
      return { data: results.map(({ json }) => json.id) };
    }

    if (resource === 'company-life') {
      // Используем админские маршруты с ID
      const results = await Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/api/posts/admin/company-life/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(params.data),
          })
        )
      );
      return { data: results.map(({ json }) => json.id) };
    }

    if (resource === 'ready-solutions') {
      // Используем админские маршруты с ID
      const results = await Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/api/posts/admin/ready-solutions/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(params.data),
          })
        )
      );
      return { data: results.map(({ json }) => json.id) };
    }

    return Promise.reject('Resource not supported');
  },

  // Удаление записи
  delete: async <RecordType extends RaRecord>(
    resource: string,
    params: DeleteParams<RecordType>
  ): Promise<DeleteResult<RecordType>> => {
    if (resource === 'users') {
      const url = `${apiUrl}/api/users/${params.id}`;
      try {
        await httpClient(url, {
          method: 'DELETE',
        });
        return {
          data: {
            id: Number(params.id),
            name: '',
            role: '',
          } as unknown as RecordType,
        };
      } catch (error) {
        console.error('Delete error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to delete user'
        );
      }
    }

    if (resource === 'news') {
      // Используем админский маршрут с ID
      const url = `${apiUrl}/api/posts/admin/news/${params.id}`;
      try {
        await httpClient(url, {
          method: 'DELETE',
        });
        return { data: { id: params.id } as unknown as RecordType };
      } catch (error) {
        console.error('Delete news error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to delete news'
        );
      }
    }

    if (resource === 'courses') {
      const url = `${apiUrl}/api/admin/courses/${params.id}`;
      try {
        await httpClient(url, {
          method: 'DELETE',
        });
        return { data: { id: params.id } as unknown as RecordType };
      } catch (error) {
        console.error('Delete course error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to delete course'
        );
      }
    }

    if (resource === 'events') {
      // Используем админский маршрут с ID
      const url = `${apiUrl}/api/posts/admin/events/${params.id}`;
      try {
        await httpClient(url, {
          method: 'DELETE',
        });
        return { data: { id: params.id } as unknown as RecordType };
      } catch (error) {
        console.error('Delete event error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to delete event'
        );
      }
    }

    if (resource === 'promotions') {
      // Используем админский маршрут с ID
      const url = `${apiUrl}/api/posts/admin/promotions/${params.id}`;
      try {
        await httpClient(url, {
          method: 'DELETE',
        });
        return { data: { id: params.id } as unknown as RecordType };
      } catch (error) {
        console.error('Delete promotion error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to delete promotion'
        );
      }
    }

    if (resource === 'company-life') {
      // Используем админский маршрут с ID
      const url = `${apiUrl}/api/posts/admin/company-life/${params.id}`;
      try {
        await httpClient(url, {
          method: 'DELETE',
        });
        return { data: { id: params.id } as unknown as RecordType };
      } catch (error) {
        console.error('Delete company-life error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to delete company-life post'
        );
      }
    }

    if (resource === 'ready-solutions') {
      // Используем админский маршрут с ID
      const url = `${apiUrl}/api/posts/admin/ready-solutions/${params.id}`;
      try {
        await httpClient(url, {
          method: 'DELETE',
        });
        return { data: { id: params.id } as unknown as RecordType };
      } catch (error) {
        console.error('Delete ready solution error:', error);
        throw new Error(
          (error as HttpError).body?.message ||
            'Failed to delete ready solution'
        );
      }
    }

    if (resource === 'programs') {
      const url = `${apiUrl}/api/posts/admin/programs/${params.id}`;
      try {
        await httpClient(url, {
          method: 'DELETE',
        });
        return { data: { id: params.id } as unknown as RecordType };
      } catch (error) {
        console.error('Delete program error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to delete program'
        );
      }
    }

    if (resource === 'newsletters') {
      const url = `${apiUrl}/api/posts/admin/newsletters/${params.id}`;
      try {
        await httpClient(url, {
          method: 'DELETE',
        });
        return { data: { id: params.id } as unknown as RecordType };
      } catch (error) {
        console.error('Delete newsletter error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to delete newsletter'
        );
      }
    }

    if (resource === 'subscribers') {
      const url = `${apiUrl}/api/posts/admin/subscribers/${params.id}`;
      try {
        await httpClient(url, {
          method: 'DELETE',
        });
        return { data: { id: params.id } as unknown as RecordType };
      } catch (error) {
        console.error('Delete subscriber error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to delete subscriber'
        );
      }
    }

    if (resource === 'testimonials') {
      const url = `${apiUrl}/api/posts/admin/testimonials/${params.id}`;
      try {
        await httpClient(url, {
          method: 'DELETE',
        });
        return { data: { id: params.id } as unknown as RecordType };
      } catch (error) {
        console.error('Delete testimonial error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to delete testimonial'
        );
      }
    }

    if (resource === 'tariff-plans') {
      const url = `${apiUrl}/api/admin/tariff-plans/${params.id}`;
      try {
        await httpClient(url, {
          method: 'DELETE',
        });
        return { data: { id: params.id } as unknown as RecordType };
      } catch (error) {
        console.error('Delete tariff plan error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to delete tariff plan'
        );
      }
    }

    if (resource === 'its-tariff-plans') {
      const url = `${apiUrl}/api/admin/its-tariff-plans/${params.id}`;
      try {
        await httpClient(url, {
          method: 'DELETE',
        });
        return { data: { id: params.id } as unknown as RecordType };
      } catch (error) {
        console.error('Delete its-tariff plan error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to delete its-tariff plan'
        );
      }
    }

    if (resource === 'employees') {
      const url = `${apiUrl}/api/employees/${params.id}`;
      try {
        await httpClient(url, {
          method: 'DELETE',
        });
        return { data: { id: params.id } as unknown as RecordType };
      } catch (error) {
        console.error('Delete employee error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to delete employee'
        );
      }
    }

    if (resource === 'clients') {
      const url = `${apiUrl}/api/clients/${params.id}`;
      try {
        await httpClient(url, {
          method: 'DELETE',
        });
        return { data: { id: params.id } as unknown as RecordType };
      } catch (error) {
        console.error('Delete client error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to delete client'
        );
      }
    }

    return Promise.reject('Resource not supported');
  },

  // Удаление нескольких записей
  deleteMany: async (resource, params) => {
    if (resource === 'users') {
      await Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/api/users/${id}`, {
            method: 'DELETE',
          })
        )
      );
      return { data: params.ids };
    }

    if (resource === 'news') {
      // Используем админские маршруты с ID
      await Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/api/posts/admin/news/${id}`, {
            method: 'DELETE',
          })
        )
      );
      return { data: params.ids };
    }

    if (resource === 'events') {
      // Используем админские маршруты с ID
      await Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/api/posts/admin/events/${id}`, {
            method: 'DELETE',
          })
        )
      );
      return { data: params.ids };
    }

    if (resource === 'promotions') {
      // Используем админские маршруты с ID
      await Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/api/posts/admin/promotions/${id}`, {
            method: 'DELETE',
          })
        )
      );
      return { data: params.ids };
    }

    if (resource === 'company-life') {
      // Используем админские маршруты с ID
      await Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/api/posts/admin/company-life/${id}`, {
            method: 'DELETE',
          })
        )
      );
      return { data: params.ids };
    }

    if (resource === 'ready-solutions') {
      // Используем админские маршруты с ID
      await Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/api/posts/admin/ready-solutions/${id}`, {
            method: 'DELETE',
          })
        )
      );
      return { data: params.ids };
    }

    if (resource === 'employees') {
      await Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/api/employees/${id}`, {
            method: 'DELETE',
          })
        )
      );
      return { data: params.ids };
    }

    if (resource === 'clients') {
      await Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/api/clients/${id}`, {
            method: 'DELETE',
          })
        )
      );
      return { data: params.ids };
    }

    return Promise.reject('Resource not supported');
  },
};
