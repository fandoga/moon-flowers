import api from '@/shared/api/axios';
import { IOrder, IDeliveryInfo, PaymentRequest, IContragent } from '../types/types';

// ----- Контрагенты -----
export const findContragentByPhone = async (phone: string) => {
  const response = await api.get('/contragents/', {
    params: { phone },
  });

  if (response.data.count > 0 && response.data.result.length > 0) {
    return response.data.result[0];
  }
  return null;
};

export const createContragent = async (data: { name: string; phone: string }) => {
  const response = await api.post<IContragent>('/contragents/', data);
  return response.data;
};

// ----- Документы продажи (заказы) -----
export const createDocsSales = async (order: IOrder) => {
  // API ожидает массив, даже если один заказ
  const response = await api.post<IOrder[]>('/docs_sales/', [order]);
  return response.data[0];
};

// ----- Информация о доставке -----
export const addDeliveryInfo = async (docSalesId: number, deliveryInfo: IDeliveryInfo) => {
  const response = await api.post(`/docs_sales/${docSalesId}/delivery_info/`, deliveryInfo);
  return response.data;
};

// ----- ЮKassa -----
interface YooKassaPaymentResponse {
  confirmation: { confirmation_url: string; type: string };
  id: string;
  status: string;
}

export const createYooKassaPayment = async (
  warehouseId: number,
  docSalesId: number,
  paymentData: PaymentRequest
) => {
  const response = await api.post<YooKassaPaymentResponse>(
    `/yookassa/payments?warehouse=${warehouseId}&docs_sales_id=${docSalesId}`,
    paymentData
  );
  return response.data;
};