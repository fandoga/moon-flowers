import { useMutation } from "@tanstack/react-query";
import { createOrder, patchDeliveryInfo } from "../api/api";
import type {
  CreateOrderResponse,
  DeliveryInfoRequest,
  DeliveryInfoResponse,
  DocSalesCreateItem,
} from "../types/types";

export const useCreateOrder = () => {
  return useMutation<
    CreateOrderResponse,
    Error,
    DocSalesCreateItem[]
  >({
    mutationFn: (documents) => createOrder(documents),
  });
};

export const useSendDeliveryInfo = () => {
  return useMutation<
    DeliveryInfoResponse,
    Error,
    DeliveryInfoRequest
  >({
    mutationFn: ({ orderId, ...data }) =>
      patchDeliveryInfo(orderId, data),
  });
};
