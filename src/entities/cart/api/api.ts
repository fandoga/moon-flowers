import api from '@/shared/api/axios';
import { AddToCartRequest, RemoveFromCartRequest } from '../types/types';
import { USER_PHONE } from '@/shared/config/user';

export const getCart = async () => {
  const response = await api.get('/mp/cart', { params: { contragent_phone: USER_PHONE } });
  return response.data;
};

export const addToCart = async (nomenclature_id: number, quantity: number = 1) => {
  const data: AddToCartRequest = {
    contragent_phone: USER_PHONE,
    good: {
      nomenclature_id,
      quantity,
    },
  };
  const response = await api.post('/mp/cart/add', data);
  return response.data;
};

export const removeFromCart = async (nomenclature_id: number) => {
  const data: RemoveFromCartRequest = {
    contragent_phone: USER_PHONE,
    nomenclature_id,
  };
  const response = await api.delete('/mp/cart/remove', { data });
  return response.data;
};