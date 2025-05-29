import { DataProvider, fetchUtils, RaRecord, DeleteParams, DeleteResult } from 'react-admin';
import { stringify } from 'query-string';

const apiUrl = import.meta.env.VITE_API_URL;

interface HttpError {
  status: number;
  body?: { message?: string };
}

export const dataProvider: DataProvider = {
  // Получение списка пользователей
  getList: async (resource, params) => {
    if (resource !== 'users') return Promise.reject('Resource not supported');
    const pagination = params.pagination || { page: 1, perPage: 10 };
    const { page, perPage } = pagination;
    const query = { page: page.toString(), limit: perPage.toString() };
    const url = `${apiUrl}/api/users?${stringify(query)}`;
    const token = localStorage.getItem('token');
    console.log('Токен:', token);
    const headers = new Headers();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    const { json } = await fetchUtils.fetchJson(url, { headers });
    return { data: json.users, total: json.total };
  },

  // Получение одного пользователя
  getOne: async (resource, params) => {
    if (resource !== 'users') return Promise.reject('Resource not supported');
    const url = `${apiUrl}/api/users/${params.id}`;
    const token = localStorage.getItem('token');
    const headers = new Headers();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    try {
      const { json } = await fetchUtils.fetchJson(url, { headers });
      return { data: json };
    } catch (error) {
      console.error('GetOne error:', error);
      throw new Error(
        (error as HttpError).body?.message || 'Failed to fetch user'
      );
    }
  },

  // Получение нескольких пользователей по ID
  getMany: async (resource, params) => {
    if (resource !== 'users') return Promise.reject('Resource not supported');
    const query = { id: params.ids.join(',') };
    const url = `${apiUrl}/api/users?${stringify(query)}`;
    const token = localStorage.getItem('token');
    const headers = new Headers();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    const { json } = await fetchUtils.fetchJson(url, { headers });
    return { data: Array.isArray(json) ? json : [json] };
  },

  // Получение записей, ссылающихся на другую запись
  getManyReference: async (resource, params) => {
    if (resource !== 'users') return Promise.reject('Resource not supported');
    const pagination = params.pagination || { page: 1, perPage: 10 };
    const { page, perPage } = pagination;
    const query = {
      [params.target]: params.id,
      page: page.toString(),
      limit: perPage.toString(),
    };
    const url = `${apiUrl}/api/users?${stringify(query)}`;
    const token = localStorage.getItem('token');
    const headers = new Headers();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    const { json } = await fetchUtils.fetchJson(url, { headers });
    return { data: json, total: json.total || json.length };
  },

  // Создание нового пользователя
  create: async (resource, params) => {
    if (resource !== 'users') return Promise.reject('Resource not supported');
    const url = `${apiUrl}/api/users/register`;
    const token = localStorage.getItem('token');
    const headers = new Headers();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    const { json } = await fetchUtils.fetchJson(url, {
      method: 'POST',
      body: JSON.stringify(params.data),
      headers,
    });
    return { data: json.user };
  },

  // Обновление пользователя
  update: async (resource, params) => {
    if (resource !== 'users') return Promise.reject('Resource not supported');
    const url = `${apiUrl}/api/users/${params.id}`;
    const token = localStorage.getItem('token');
    const headers = new Headers();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
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
  },

  // Обновление нескольких пользователей
  updateMany: async (resource, params) => {
    if (resource !== 'users') return Promise.reject('Resource not supported');
    const token = localStorage.getItem('token');
    const headers = new Headers();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
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
  },

  // Удаление пользователя
delete: async <RecordType extends RaRecord>(
  resource: string,
  params: DeleteParams<RecordType>
): Promise<DeleteResult<RecordType>> => {
  if (resource !== 'users') return Promise.reject('Resource not supported');
  const url = `${apiUrl}/api/users/${params.id}`;
  const token = localStorage.getItem('token');
  console.log('dataProvider.delete: token:', token); // Отладка: токен перед отправкой
  const headers = new Headers();
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  try {
    await fetchUtils.fetchJson(url, {
      method: 'DELETE',
      headers,
    });
    return { data: { id: Number(params.id), name: '', role: '' } as unknown as RecordType };
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error((error as HttpError).body?.message || 'Failed to delete user');
  }
},

  // Удаление нескольких пользователей
 deleteMany: async (resource, params) => {
  if (resource !== 'users') return Promise.reject('Resource not supported');
  const token = localStorage.getItem('token');
  const headers = new Headers();
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  await Promise.all(
    params.ids.map(id =>
      fetchUtils.fetchJson(`${apiUrl}/api/users/${id}`, {
        method: 'DELETE',
        headers,
      })
    )
  );
  return { data: params.ids }; // Возвращаем массив ID
},
};
