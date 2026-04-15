// shared/api/api.ts
import api from './axios';
import {
  TokenResponse, LoginRequest, RefreshRequest,
  BlogFolder, BlogPost,
  PaymentListResponse, PaymentCreateRequest, Payment,
  YookassaPaymentRequest,
  ContragentListResponse, ContragentQueryParams, Contragent,
} from '../types/api/types';

export const auth = {
  login: (data: LoginRequest) =>
    api.post<TokenResponse>('/oauth/token', data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),
  refresh: (params: RefreshRequest) =>
    api.post<TokenResponse>('/oauth/token/refresh/', null, { params }),
};

export const blog = {
  folders: {
    list: () => api.get<BlogFolder[]>('/blog/folders'),
  },
  posts: {
    list: (params?: { folder_id?: number; status?: string; skip?: number; limit?: number }) =>
      api.get<BlogPost[]>('/blog/posts', { params }),
    getById: (post_id: number) =>
      api.get<BlogPost>(`/blog/posts/${post_id}`),
  },
};

export const payments = {
  list: (params?: Record<string, unknown>) =>
    api.get<PaymentListResponse>('/payments/', { params }),
  create: (data: PaymentCreateRequest) =>
    api.post<Payment>('/payments/', data),
  getById: (id: number) =>
    api.get<Payment>(`/payment/${id}/`),
  yookassa: (data: YookassaPaymentRequest, params: { warehouse: number; payment_crm_id?: number; doc_sales_id?: number }) =>
    api.post<unknown>('/yookassa/payments', data, { params }),
};

export const createYooKassaPayment = (
  warehouse_id: number,
  doc_sales_id: number,
  data: YookassaPaymentRequest
) => {
  return api.post(`/yookassa/payments`, data, {
    params: {
      warehouse: warehouse_id,
      doc_sales_id,
    },
  });
};

export const contragents = {
  list: (params?: ContragentQueryParams) =>
    api.get<ContragentListResponse>('/contragents/', { params }),
  create: (data: Contragent) =>
    api.post<Contragent>('/contragents/', data),
};