import { tableCrmApi } from "@/shared/api/clients";
import type {
  ContragentItem,
  CreateContragentRequest,
  CreateContragentResponse,
  CreateOrderResponse,
  DeliveryInfoPayload,
  DeliveryInfoResponse,
  DocSalesCreateItem,
  GetContragentsParams,
  GetContragentsResponse,
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

export const createContragent = async (
  params: CreateContragentRequest,
): Promise<CreateContragentResponse> => {
  try {
    const response = await tableCrmApi.post<unknown>("/contragents/", {
      name: params.name,
      phone: params.phone,
      contragent_type: "Покупатель",
    });
    const data = response.data as unknown;
    if (data && typeof data === "object") {
      const o = data as Record<string, unknown>;
      const directId = o.contragent_id ?? o.id;
      if (directId != null) {
        return { success: true, contragent_id: String(directId) };
      }
      const result = o.result as
        | { id?: number; contragent_id?: number }
        | undefined;
      const nestedId = result?.contragent_id ?? result?.id;
      if (nestedId != null) {
        return { success: true, contragent_id: String(nestedId) };
      }
      if (
        typeof o.success === "boolean" &&
        typeof o.contragent_id === "string"
      ) {
        return {
          success: o.success,
          contragent_id: o.contragent_id,
          error: typeof o.error === "string" ? o.error : undefined,
        };
      }
    }
    return { success: true, contragent_id: "" };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось создать заказ";

    return {
      success: false,
      contragent_id: "",
      error: message,
    };
  }
};

export const createOrGetContragent = async (
  params: CreateContragentRequest,
): Promise<CreateContragentResponse> => {
  if (!params.phone) {
    return {
      success: false,
      contragent_id: "",
      error: "Некорректный номер телефона",
    };
  }

  const targetPhone = normalizePhone(params.phone);
  if (!targetPhone) {
    return {
      success: false,
      contragent_id: "",
      error: "Некорректный номер телефона",
    };
  }

  const existingId = await findContragentByPhone(targetPhone);
  if (existingId) {
    return { success: true, contragent_id: String(existingId) };
  }

  return createContragent(params);
};

const normalizePhone = (phone: string) => phone.replace(/\D/g, "");

const extractContragents = (data: unknown): ContragentItem[] => {
  if (Array.isArray(data)) return data as ContragentItem[];
  if (data && typeof data === "object") {
    const result = (data as { result?: unknown }).result;
    if (Array.isArray(result)) return result as ContragentItem[];
  }
  return [];
};

export const getContragents = async (
  params: GetContragentsParams,
): Promise<GetContragentsResponse> => {
  try {
    const response = await tableCrmApi.get<unknown>("/contragents/", {
      params,
    });
    const result = extractContragents(response.data);
    return {
      result,
      count: result.length,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Не удалось получить контрагентов";
    return {
      result: [],
      count: 0,
      error: message,
    };
  }
};

export const findContragentByPhone = async (
  phone: string,
): Promise<number | null> => {
  const target = normalizePhone(phone);
  if (!target) return null;

  const listResponse = await getContragents({ phone: target, limit: 100 });
  const candidates = listResponse.result;

  for (const item of candidates) {
    const id = Number(item.id);
    if (!Number.isFinite(id) || id <= 0) continue;

    const primary = item.phone ? normalizePhone(item.phone) : "";
    if (primary === target) return id;

    if (item.additional_phones) {
      const extra = item.additional_phones
        .split(/[;,]/)
        .map((p) => normalizePhone(p.trim()))
        .filter(Boolean);
      if (extra.includes(target)) return id;
    }
  }

  return null;
};

/** @deprecated используйте patchDeliveryInfo */
export const sendDeliveryInfo = patchDeliveryInfo;
