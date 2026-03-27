import axios, { AxiosRequestConfig } from 'axios';

import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const admin_axios = axios.create({ baseURL: HOST_API });
const customerAxiosInstance = axios.create({ baseURL: HOST_API });

admin_axios.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

customerAxiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export const customer_axios = customerAxiosInstance;
export default admin_axios;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await admin_axios.get(url, { ...config });

  return res.data;
};

export const customerFetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await customer_axios.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------
export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  order: {
    create: '/api/orders',
    list: '/api/orders',
  },
  product: {
    list: '/api/products',
    details: (id: string) => `/api/products/${id}`,
    update: (id: string) => `/api/products/${id}`,
    search: '/api/product/search',
    create: '/api/products',
  },
  customer: {

    create: '/api/customers',
    list: '/api/customers',
    one: (id: string) => `/api/customers/${id}`,
    update: (id: string) => `/api/customers/${id}`,
    delete: (id: string) => `/api/customers/${id}`,
    auth: {
      me: '/api/customers/auth/me',
      login: '/api/customers/auth/login',
      register: '/api/customers/register',
      // register: '/api/auth/register',
    },
  },
};
