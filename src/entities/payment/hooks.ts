import { useMutation } from '@tanstack/react-query';
import { createYooKassaPayment } from '@/shared/api/api';
import { YookassaPaymentRequest } from '@/shared/types/api/types';

export const useCreateYooKassaPayment = () => {
  return useMutation({
    mutationFn: ({
      warehouse_id,
      doc_sales_id,
      data,
    }: {
      warehouse_id: number;
      doc_sales_id: number;
      data: YookassaPaymentRequest;
    }) => createYooKassaPayment(warehouse_id, doc_sales_id, data),
  });
};