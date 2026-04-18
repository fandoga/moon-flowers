import { tableCrmApi } from "@/shared/api/clients";
import { MpProductsQueryParams, MpProductsResponse, MpProduct } from "../types/types";

export const getMpProducts = async (
  params?: MpProductsQueryParams,
): Promise<MpProductsResponse> => {
  try {
    const response = await tableCrmApi.get<MpProductsResponse>("/mp/products", {
      params,
    });
    return response.data;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load marketplace products";

    return {
      result: [],
      count: 0,
      size: params?.size,
      page: params?.page,
      error: message,
    };
  }
};

export const getMpProductById = async (
  productId: number | string,
): Promise<MpProduct | null> => {
  try {
    const response = await tableCrmApi.get<MpProduct>(`/mp/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to load product:", error);
    return null;
  }
};
