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
    const url = resource === 'users' ? `${apiUrl}/users` : `${apiUrl}/${resource}`;
    const { json } = await fetchUtils.fetchJson(`${url}?${stringify(query)}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return {
      data: json.users || json,
      total: json.total || json.length,
    };
  },

  getOne: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    const { json } = await fetchUtils.fetchJson(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return { data: json };
  },

  getMany: async (resource, params) => {
    const query = { id: params.ids };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const { json } = await fetchUtils.fetchJson(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return { data: json };
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
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const { json } = await fetchUtils.fetchJson(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return {
      data: json,
      total: json.total || json.length,
    };
  },

  create: async (resource, params) => {
    const url = resource === 'users' ? `${apiUrl}/users/register` : `${apiUrl}/${resource}`;
    const { json } = await fetchUtils.fetchJson(url, {
      method: 'POST',
      body: JSON.stringify(params.data),
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return { data: json };
  },

  update: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    const { json } = await fetchUtils.fetchJson(url, {
      method: resource === 'users' ? 'PUT' : 'PATCH',
      body: JSON.stringify(params.data),
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return { data: json };
  },

  updateMany: async (resource, params) => {
    const query = { id: params.ids };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const { json } = await fetchUtils.fetchJson(url, {
      method: resource === 'users' ? 'PUT' : 'PATCH',
      body: JSON.stringify(params.data),
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return { data: json };
  },

  delete: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    const { json } = await fetchUtils.fetchJson(url, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return { data: json };
  },

  deleteMany: async (resource, params) => {
    const query = { id: params.ids };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const { json } = await fetchUtils.fetchJson(url, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return { data: json };
  },
};