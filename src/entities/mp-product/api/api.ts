import { tableCrmApi } from "@/shared/api/clients";
import { MpProductsQueryParams, MpProductsResponse } from "../types/types";

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
