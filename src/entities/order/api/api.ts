import { tableCrmApi } from "@/shared/api/clients";
import type {
  CreateOrderResponse,
  DeliveryInfoPayload,
  DeliveryInfoResponse,
  DocSalesCreateItem,
} from "../types/types";

function normalizeCreateOrderResponse(data: unknown): CreateOrderResponse {
  if (data == null) {
    return { success: false, order_id: "", error: "Пустой ответ сервера" };
  }

  if (Array.isArray(data)) {
    const first = data[0] as { id?: number } | undefined;
    const id = first?.id;
    return {
      success: true,
      order_id: id != null ? String(id) : "",
    };
  }

  if (typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (typeof o.success === "boolean" && "order_id" in o) {
      return {
        success: o.success,
        order_id: String(o.order_id ?? ""),
        error: typeof o.error === "string" ? o.error : undefined,
      };
    }
    const result = o.result as { id?: number } | undefined;
    if (result?.id != null) {
      return { success: true, order_id: String(result.id) };
    }
  }

  return { success: true, order_id: "" };
}

export const createOrder = async (
  documents: DocSalesCreateItem[],
): Promise<CreateOrderResponse> => {
  try {
    const response = await tableCrmApi.post<unknown>("/docs_sales/", documents);
    return normalizeCreateOrderResponse(response.data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось создать заказ";

    return {
      success: false,
      order_id: "",
      error: message,
    };
  }
};

export const patchDeliveryInfo = async (
  orderId: string,
  data: DeliveryInfoPayload,
): Promise<DeliveryInfoResponse> => {
  try {
    const response = await tableCrmApi.post<DeliveryInfoResponse>(
      `/docs_sales/${orderId}/delivery_info/`,
      data,
    );
    const body = response.data;
    if (body && typeof body === "object" && "success" in body) {
      return body;
    }
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Не удалось обновить данные доставки";

    return {
      success: false,
      error: message,
    };
  }
};

/** @deprecated используйте patchDeliveryInfo */
export const sendDeliveryInfo = patchDeliveryInfo;
