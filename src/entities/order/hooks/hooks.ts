import { useMutation } from '@tanstack/react-query';
import { createMarketplaceOrder } from '../api/api';
import { MpOrderRequest } from '../types/types';

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (data: Omit<MpOrderRequest, 'contragent_phone'>) =>
      createMarketplaceOrder(data),
  });
};