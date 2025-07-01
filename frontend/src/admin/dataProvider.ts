import {
  DataProvider,
  fetchUtils,
  RaRecord,
  DeleteParams,
  DeleteResult,
} from 'react-admin';
import { stringify } from 'query-string';

const apiUrl = import.meta.env.VITE_API_URL;

interface HttpError {
  status: number;
  body?: { message?: string };
}

export const dataProvider: DataProvider = {
  // Получение списка записей
  getList: async (resource, params) => {
    const pagination = params.pagination || { page: 1, perPage: 10 };
    const { page, perPage } = pagination;
    const token = localStorage.getItem('token');
    const headers = new Headers();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    if (resource === 'users') {
      const query = {
        _start: ((page - 1) * perPage).toString(),
        _end: (page * perPage).toString(),
        _sort: params.sort?.field || 'id',
        _order: params.sort?.order || 'ASC',
        ...params.filter,
      };
      const url = `${apiUrl}/api/users?${stringify(query)}`;
      const { json, headers: responseHeaders } = await fetchUtils.fetchJson(
        url,
        { headers }
      );
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
      const { json, headers: responseHeaders } = await fetchUtils.fetchJson(
        url,
        { headers }
      );

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

    if (resource === 'events') {
      const query = {
        _start: ((page - 1) * perPage).toString(),
        _end: (page * perPage).toString(),
        _sort: params.sort?.field || 'createdAt',
        _order: params.sort?.order || 'DESC',
        ...params.filter,
      };
      const url = `${apiUrl}/api/posts/admin/events?${stringify(query)}`;
      const { json, headers: responseHeaders } = await fetchUtils.fetchJson(
        url,
        { headers }
      );

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
      const { json, headers: responseHeaders } = await fetchUtils.fetchJson(
        url,
        { headers }
      );

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
      const { json, headers: responseHeaders } = await fetchUtils.fetchJson(
        url,
        { headers }
      );

      // Используем slug как ID для React Admin
      const data = Array.isArray(json)
        ? json.map((item) => ({
            ...item,
            id: item.slug, // используем slug как ID
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
      const { json, headers: responseHeaders } = await fetchUtils.fetchJson(
        url,
        { headers }
      );

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
      const { json, headers: responseHeaders } = await fetchUtils.fetchJson(
        url,
        { headers }
      );

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
        _sort: params.sort?.field || 'subscribedAt',
        _order: params.sort?.order || 'DESC',
        ...params.filter,
      };
      const url = `${apiUrl}/api/posts/admin/subscribers?${stringify(query)}`;
      const { json, headers: responseHeaders } = await fetchUtils.fetchJson(
        url,
        { headers }
      );

      const data = Array.isArray(json) ? json : [json];

      return {
        data,
        total: parseInt(responseHeaders.get('X-Total-Count') || '0'),
      };
    }

    return Promise.reject('Resource not supported');
  },

  // Получение одной записи
  getOne: async (resource, params) => {
    const token = localStorage.getItem('token');
    const headers = new Headers();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    if (resource === 'users') {
      const url = `${apiUrl}/api/users/${params.id}`;
      const { json } = await fetchUtils.fetchJson(url, { headers });
      return { data: json };
    }

    if (resource === 'news') {
      // Для админки получаем новость по slug через обычный маршрут
      const url = `${apiUrl}/api/posts/admin/news/${params.id}`;
      try {
        const { json } = await fetchUtils.fetchJson(url, { headers });
        return { data: { ...json, id: json.id } }; // используем оригинальный ID
      } catch (error) {
        console.error('GetOne news error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to fetch news'
        );
      }
    }

    if (resource === 'events') {
      const url = `${apiUrl}/api/posts/admin/events/${params.id}`;
      try {
        const { json } = await fetchUtils.fetchJson(url, { headers });
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
        const { json } = await fetchUtils.fetchJson(url, { headers });
        return { data: { ...json, id: json.id } }; // используем оригинальный ID
      } catch (error) {
        console.error('GetOne promotion error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to fetch promotion'
        );
      }
    }

    if (resource === 'ready-solutions') {
      const url = `${apiUrl}/api/posts/ready-solutions/${params.id}`;
      try {
        const { json } = await fetchUtils.fetchJson(url, { headers });
        return { data: { ...json, id: json.slug } }; // используем slug как ID
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
        const { json } = await fetchUtils.fetchJson(url, { headers });
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
        const { json } = await fetchUtils.fetchJson(url, { headers });
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
        const { json } = await fetchUtils.fetchJson(url, { headers });
        return { data: json };
      } catch (error) {
        console.error('GetOne subscriber error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to fetch subscriber'
        );
      }
    }

    return Promise.reject('Resource not supported');
  },

  // Получение нескольких записей по ID
  getMany: async (resource, params) => {
    const token = localStorage.getItem('token');
    const headers = new Headers();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    if (resource === 'users') {
      const query = { id: params.ids.join(',') };
      const url = `${apiUrl}/api/users?${stringify(query)}`;
      const { json } = await fetchUtils.fetchJson(url, { headers });
      return { data: Array.isArray(json) ? json : [json] };
    }

    if (resource === 'news') {
      // Для новостей получаем каждую по отдельности через админский маршрут
      const promises = params.ids.map((id) =>
        fetchUtils.fetchJson(`${apiUrl}/api/posts/admin/news/${id}`, {
          headers,
        })
      );
      const results = await Promise.all(promises);
      const data = results.map(({ json }) => ({
        ...json,
        id: json.id, // используем оригинальный ID
      }));
      return { data };
    }

    if (resource === 'events') {
      // Для мероприятий получаем каждое по отдельности через админский маршрут
      const promises = params.ids.map((id) =>
        fetchUtils.fetchJson(`${apiUrl}/api/posts/admin/events/${id}`, {
          headers,
        })
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
        fetchUtils.fetchJson(`${apiUrl}/api/posts/admin/promotions/${id}`, {
          headers,
        })
      );
      const results = await Promise.all(promises);
      const data = results.map(({ json }) => ({
        ...json,
        id: json.id, // используем оригинальный ID
      }));
      return { data };
    }

    if (resource === 'ready-solutions') {
      // Для готовых решений получаем каждое по отдельности через публичный маршрут
      const promises = params.ids.map((id) =>
        fetchUtils.fetchJson(`${apiUrl}/api/posts/ready-solutions/${id}`, {
          headers,
        })
      );
      const results = await Promise.all(promises);
      const data = results.map(({ json }) => ({
        ...json,
        id: json.slug, // используем slug как ID
      }));
      return { data };
    }

    return Promise.reject('Resource not supported');
  },

  // Получение записей, ссылающихся на другую запись
  getManyReference: async (resource, params) => {
    const pagination = params.pagination || { page: 1, perPage: 10 };
    const { page, perPage } = pagination;
    const token = localStorage.getItem('token');
    const headers = new Headers();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    if (resource === 'users') {
      const query = {
        [params.target]: params.id,
        page: page.toString(),
        limit: perPage.toString(),
      };
      const url = `${apiUrl}/api/users?${stringify(query)}`;
      const { json } = await fetchUtils.fetchJson(url, { headers });
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
    const token = localStorage.getItem('token');
    const headers = new Headers();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    if (resource === 'users') {
      const url = `${apiUrl}/api/users/register`;
      const { json } = await fetchUtils.fetchJson(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
        headers,
      });
      return { data: json.user };
    }

    if (resource === 'news') {
      const url = `${apiUrl}/api/posts/news`;
      const { json } = await fetchUtils.fetchJson(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
        headers,
      });
      return { data: { ...json, id: json.id } }; // используем оригинальный ID
    }

    if (resource === 'events') {
      const url = `${apiUrl}/api/posts/events`;
      const { json } = await fetchUtils.fetchJson(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
        headers,
      });
      return { data: { ...json, id: json.id } }; // используем оригинальный ID
    }

    if (resource === 'promotions') {
      const url = `${apiUrl}/api/posts/promotions`;
      const { json } = await fetchUtils.fetchJson(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
        headers,
      });
      return { data: { ...json, id: json.id } }; // используем оригинальный ID
    }

    if (resource === 'ready-solutions') {
      const url = `${apiUrl}/api/posts/admin/ready-solutions`;
      const { json } = await fetchUtils.fetchJson(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
        headers,
      });
      return { data: { ...json, id: json.slug } }; // используем slug как ID
    }

    if (resource === 'programs') {
      const url = `${apiUrl}/api/posts/admin/programs`;
      const { json } = await fetchUtils.fetchJson(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
        headers,
      });
      return { data: json };
    }

    if (resource === 'newsletters') {
      const url = `${apiUrl}/api/posts/admin/newsletters`;
      const { json } = await fetchUtils.fetchJson(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
        headers,
      });
      return { data: json };
    }

    return Promise.reject('Resource not supported');
  },

  // Обновление записи
  update: async (resource, params) => {
    const token = localStorage.getItem('token');
    const headers = new Headers();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    if (resource === 'users') {
      const url = `${apiUrl}/api/users/${params.id}`;
      const data = {
        name: params.data.name,
        role: params.data.role,
        ...(params.data.password ? { password: params.data.password } : {}),
      };
      try {
        const { json } = await fetchUtils.fetchJson(url, {
          method: 'PUT',
          body: JSON.stringify(data),
          headers,
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
        const { json } = await fetchUtils.fetchJson(url, {
          method: 'PATCH',
          body: JSON.stringify(params.data),
          headers,
        });
        return { data: { ...json, id: json.id } }; // используем оригинальный ID
      } catch (error) {
        console.error('Update news error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to update news'
        );
      }
    }

    if (resource === 'events') {
      // Используем админский маршрут с ID
      const url = `${apiUrl}/api/posts/admin/events/${params.id}`;
      try {
        const { json } = await fetchUtils.fetchJson(url, {
          method: 'PATCH',
          body: JSON.stringify(params.data),
          headers,
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
        const { json } = await fetchUtils.fetchJson(url, {
          method: 'PATCH',
          body: JSON.stringify(params.data),
          headers,
        });
        return { data: { ...json, id: json.id } }; // используем оригинальный ID
      } catch (error) {
        console.error('Update promotion error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to update promotion'
        );
      }
    }

    if (resource === 'ready-solutions') {
      // Используем админский маршрут со slug
      const url = `${apiUrl}/api/posts/ready-solutions/${params.id}`;
      try {
        const { json } = await fetchUtils.fetchJson(url, {
          method: 'PATCH',
          body: JSON.stringify(params.data),
          headers,
        });
        return { data: { ...json, id: json.slug } }; // используем slug как ID
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
        const { json } = await fetchUtils.fetchJson(url, {
          method: 'PATCH',
          body: JSON.stringify(params.data),
          headers,
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
        const { json } = await fetchUtils.fetchJson(url, {
          method: 'PATCH',
          body: JSON.stringify(params.data),
          headers,
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
        const { json } = await fetchUtils.fetchJson(url, {
          method: 'PATCH',
          body: JSON.stringify(params.data),
          headers,
        });
        return { data: json };
      } catch (error) {
        console.error('Update subscriber error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to update subscriber'
        );
      }
    }

    return Promise.reject('Resource not supported');
  },

  // Обновление нескольких записей
  updateMany: async (resource, params) => {
    const token = localStorage.getItem('token');
    const headers = new Headers();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    if (resource === 'users') {
      const data = {
        name: params.data.name,
        role: params.data.role,
        ...(params.data.password ? { password: params.data.password } : {}),
      };
      const results = await Promise.all(
        params.ids.map((id) =>
          fetchUtils.fetchJson(`${apiUrl}/api/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers,
          })
        )
      );
      return { data: results.map(({ json }) => json.user.id) };
    }

    if (resource === 'news') {
      // Используем админские маршруты с ID
      const results = await Promise.all(
        params.ids.map((id) =>
          fetchUtils.fetchJson(`${apiUrl}/api/posts/admin/news/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(params.data),
            headers,
          })
        )
      );
      return { data: results.map(({ json }) => json.id) };
    }

    if (resource === 'events') {
      // Используем админские маршруты с ID
      const results = await Promise.all(
        params.ids.map((id) =>
          fetchUtils.fetchJson(`${apiUrl}/api/posts/admin/events/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(params.data),
            headers,
          })
        )
      );
      return { data: results.map(({ json }) => json.id) };
    }

    if (resource === 'promotions') {
      // Используем админские маршруты с ID
      const results = await Promise.all(
        params.ids.map((id) =>
          fetchUtils.fetchJson(`${apiUrl}/api/posts/admin/promotions/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(params.data),
            headers,
          })
        )
      );
      return { data: results.map(({ json }) => json.id) };
    }

    if (resource === 'ready-solutions') {
      // Используем маршруты со slug
      const results = await Promise.all(
        params.ids.map((id) =>
          fetchUtils.fetchJson(`${apiUrl}/api/posts/ready-solutions/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(params.data),
            headers,
          })
        )
      );
      return { data: results.map(({ json }) => json.slug) };
    }

    return Promise.reject('Resource not supported');
  },

  // Удаление записи
  delete: async <RecordType extends RaRecord>(
    resource: string,
    params: DeleteParams<RecordType>
  ): Promise<DeleteResult<RecordType>> => {
    const token = localStorage.getItem('token');
    const headers = new Headers();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    if (resource === 'users') {
      const url = `${apiUrl}/api/users/${params.id}`;
      console.log('dataProvider.delete: token:', token);
      try {
        await fetchUtils.fetchJson(url, {
          method: 'DELETE',
          headers,
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
        await fetchUtils.fetchJson(url, {
          method: 'DELETE',
          headers,
        });
        return { data: { id: params.id } as unknown as RecordType };
      } catch (error) {
        console.error('Delete news error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to delete news'
        );
      }
    }

    if (resource === 'events') {
      // Используем админский маршрут с ID
      const url = `${apiUrl}/api/posts/admin/events/${params.id}`;
      try {
        await fetchUtils.fetchJson(url, {
          method: 'DELETE',
          headers,
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
        await fetchUtils.fetchJson(url, {
          method: 'DELETE',
          headers,
        });
        return { data: { id: params.id } as unknown as RecordType };
      } catch (error) {
        console.error('Delete promotion error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to delete promotion'
        );
      }
    }

    if (resource === 'ready-solutions') {
      // Используем маршрут со slug
      const url = `${apiUrl}/api/posts/ready-solutions/${params.id}`;
      try {
        await fetchUtils.fetchJson(url, {
          method: 'DELETE',
          headers,
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
        await fetchUtils.fetchJson(url, {
          method: 'DELETE',
          headers,
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
        await fetchUtils.fetchJson(url, {
          method: 'DELETE',
          headers,
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
        await fetchUtils.fetchJson(url, {
          method: 'DELETE',
          headers,
        });
        return { data: { id: params.id } as unknown as RecordType };
      } catch (error) {
        console.error('Delete subscriber error:', error);
        throw new Error(
          (error as HttpError).body?.message || 'Failed to delete subscriber'
        );
      }
    }

    return Promise.reject('Resource not supported');
  },

  // Удаление нескольких записей
  deleteMany: async (resource, params) => {
    const token = localStorage.getItem('token');
    const headers = new Headers();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    if (resource === 'users') {
      await Promise.all(
        params.ids.map((id) =>
          fetchUtils.fetchJson(`${apiUrl}/api/users/${id}`, {
            method: 'DELETE',
            headers,
          })
        )
      );
      return { data: params.ids };
    }

    if (resource === 'news') {
      // Используем админские маршруты с ID
      await Promise.all(
        params.ids.map((id) =>
          fetchUtils.fetchJson(`${apiUrl}/api/posts/admin/news/${id}`, {
            method: 'DELETE',
            headers,
          })
        )
      );
      return { data: params.ids };
    }

    if (resource === 'events') {
      // Используем админские маршруты с ID
      await Promise.all(
        params.ids.map((id) =>
          fetchUtils.fetchJson(`${apiUrl}/api/posts/admin/events/${id}`, {
            method: 'DELETE',
            headers,
          })
        )
      );
      return { data: params.ids };
    }

    if (resource === 'promotions') {
      // Используем админские маршруты с ID
      await Promise.all(
        params.ids.map((id) =>
          fetchUtils.fetchJson(`${apiUrl}/api/posts/admin/promotions/${id}`, {
            method: 'DELETE',
            headers,
          })
        )
      );
      return { data: params.ids };
    }

    if (resource === 'ready-solutions') {
      // Используем маршруты со slug
      await Promise.all(
        params.ids.map((id) =>
          fetchUtils.fetchJson(`${apiUrl}/api/posts/ready-solutions/${id}`, {
            method: 'DELETE',
            headers,
          })
        )
      );
      return { data: params.ids };
    }

    return Promise.reject('Resource not supported');
  },
};
