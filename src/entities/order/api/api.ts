import api from '@/shared/api/axios';
import { USER_PHONE } from '@/shared/config/user';
import { MpOrderRequest, MpOrderResponse } from '../types/types';

export const createMarketplaceOrder = async (data: Omit<MpOrderRequest, 'contragent_phone'>) => {
  const payload: MpOrderRequest = {
    ...data,
    contragent_phone: USER_PHONE,
  };
  const response = await api.post<MpOrderResponse>('/mp/orders', payload, {
    params: { entity_type: 'docs_sales' },
  });
  return response.data;
};