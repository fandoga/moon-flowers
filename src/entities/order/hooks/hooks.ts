import { useMutation } from "@tanstack/react-query";
import {
  createContragent,
  createOrder,
  findContragentByPhone,
  patchDeliveryInfo,
} from "../api/api";
import {
  CreateContragentRequest,
  CreateContragentResponse,
  GetContragentsParams,
  type CreateOrderResponse,
  type DeliveryInfoRequest,
  type DeliveryInfoResponse,
  type DocSalesCreateItem,
} from "../types/types";

export const useCreateOrder = () => {
  return useMutation<CreateOrderResponse, Error, DocSalesCreateItem[]>({
    mutationFn: (documents) => createOrder(documents),
  });
};

export const useSendDeliveryInfo = () => {
  return useMutation<DeliveryInfoResponse, Error, DeliveryInfoRequest>({
    mutationFn: ({ orderId, ...data }) => patchDeliveryInfo(orderId, data),
  });
};

export const useCreateContragent = () => {
  return useMutation<CreateContragentResponse, Error, CreateContragentRequest>({
    mutationFn: (params) => createContragent(params),
  });
};

export const useFindContragentByPhone = () => {
  return useMutation<number | null, Error, GetContragentsParams>({
    mutationFn: async ({ phone }) => {
      if (!phone) return null;
      return findContragentByPhone(phone);
    },
  });
};
