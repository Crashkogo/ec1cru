// frontend/src/admin/dataProvider.ts
import { DataProvider, fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

const apiUrl = import.meta.env.VITE_API_URL;

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const pagination = params.pagination || { page: 1, perPage: 10 };
    const sort = params.sort || { field: 'id', order: 'ASC' };
    const { page, perPage } = pagination;
    const { field, order } = sort;
    const query = {
      page,
      limit: perPage,
      sort: field,
      order,
      ...params.filter,
    };
    const url =
      resource === 'users'
        ? `${apiUrl}/api/users`
        : resource === 'programs'
        ? `${apiUrl}/api/posts/admin/${resource}`
        : `${apiUrl}/api/posts/${resource}`;
    const { json } = await fetchUtils.fetchJson(`${url}?${stringify(query)}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return {
      data: Array.isArray(json) ? json : json.items || json,
      total: json.total || (Array.isArray(json) ? json.length : json.items?.length || 0),
    };
  },

  getOne: async (resource, params) => {
    const url =
      resource === 'users'
        ? `${apiUrl}/api/users/${params.id}`
        : resource === 'programs'
        ? `${apiUrl}/api/posts/admin/${resource}/${params.id}`
        : `${apiUrl}/api/posts/${resource}/${params.id}`;
    const { json } = await fetchUtils.fetchJson(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return { data: json };
  },

  getMany: async (resource, params) => {
    const query = { id: params.ids };
    const url =
      resource === 'users'
        ? `${apiUrl}/api/users`
        : resource === 'programs'
        ? `${apiUrl}/api/posts/admin/${resource}`
        : `${apiUrl}/api/posts/${resource}`;
    const { json } = await fetchUtils.fetchJson(`${url}?${stringify(query)}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return { data: Array.isArray(json) ? json : json.items || [] };
  },

  getManyReference: async (resource, params) => {
    const pagination = params.pagination || { page: 1, perPage: 10 };
    const sort = params.sort || { field: 'id', order: 'ASC' };
    const { page, perPage } = pagination;
    const { field, order } = sort;
    const query = {
      page,
      limit: perPage,
      sort: field,
      order,
      [params.target]: params.id,
      ...params.filter,
    };
    const url =
      resource === 'users'
        ? `${apiUrl}/api/users`
        : resource === 'programs'
        ? `${apiUrl}/api/posts/admin/${resource}`
        : `${apiUrl}/api/posts/${resource}`;
    const { json } = await fetchUtils.fetchJson(`${url}?${stringify(query)}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return {
      data: Array.isArray(json) ? json : json.items || [],
      total: json.total || (Array.isArray(json) ? json.length : json.items?.length || 0),
    };
  },

  create: async (resource, params) => {
    const url =
      resource === 'users'
        ? `${apiUrl}/api/users/register`
        : resource === 'programs'
        ? `${apiUrl}/api/posts/admin/${resource}`
        : `${apiUrl}/api/posts/${resource}`;
    const { json } = await fetchUtils.fetchJson(url, {
      method: 'POST',
      body: JSON.stringify(params.data),
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return { data: json };
  },

  update: async (resource, params) => {
    const url =
      resource === 'users'
        ? `${apiUrl}/api/users/${params.id}`
        : resource === 'programs'
        ? `${apiUrl}/api/posts/admin/${resource}/${params.id}`
        : `${apiUrl}/api/posts/${resource}/${params.id}`;
    const { json } = await fetchUtils.fetchJson(url, {
      method: resource === 'users' ? 'PUT' : 'PATCH',
      body: JSON.stringify(params.data),
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return { data: json };
  },

  updateMany: async (resource, params) => {
    const query = { id: params.ids };
    const url =
      resource === 'users'
        ? `${apiUrl}/api/users`
        : resource === 'programs'
        ? `${apiUrl}/api/posts/admin/${resource}`
        : `${apiUrl}/api/posts/${resource}`;
    const { json } = await fetchUtils.fetchJson(`${url}?${stringify(query)}`, {
      method: resource === 'users' ? 'PUT' : 'PATCH',
      body: JSON.stringify(params.data),
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return { data: json };
  },

  delete: async (resource, params) => {
    const url =
      resource === 'users'
        ? `${apiUrl}/api/users/${params.id}`
        : resource === 'programs'
        ? `${apiUrl}/api/posts/admin/${resource}/${params.id}`
        : `${apiUrl}/api/posts/${resource}/${params.id}`;
    const { json } = await fetchUtils.fetchJson(url, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return { data: json };
  },

  deleteMany: async (resource, params) => {
    const query = { id: params.ids };
    const url =
      resource === 'users'
        ? `${apiUrl}/api/users`
        : resource === 'programs'
        ? `${apiUrl}/api/posts/admin/${resource}`
        : `${apiUrl}/api/posts/${resource}`;
    const { json } = await fetchUtils.fetchJson(`${url}?${stringify(query)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return { data: json };
  },
};