import { tableCrmApi } from "@/shared/api/clients";
import {
  MpProductsQueryParams,
  MpProductsResponse,
  MpProduct,
  Pictures,
  Prices,
} from "../types/types";

export const getMpProducts = async (
  params?: MpProductsQueryParams,
): Promise<MpProductsResponse> => {
  try {
    const response = await tableCrmApi.get<MpProductsResponse>(
      "/nomenclature/",
      {
        params,
      },
    );
    return response.data;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load marketplace products";

    return {
      result: [],
      count: 0,
      limit: params?.limit,
      offset: params?.offset,
      error: message,
    };
  }
};

export const getMpProductById = async (
  productId: number | string,
): Promise<MpProduct | null> => {
  try {
    const response = await tableCrmApi.get<MpProduct>(
      `/nomenclature/${productId}/`,
    );
    return response.data;
  } catch (error) {
    console.error("Failed to load product:", error);
    return null;
  }
};

export const getPicturesById = async (
  productId: number | string,
): Promise<Pictures | null> => {
  try {
    const response = await tableCrmApi.get("/pictures/", {
      params: {
        entity: "nomenclature",
        entity_id: productId,
      },
    });
    const data = response.data as unknown;
    const dataWithResult = data as { result?: Pictures | Pictures[] } | null;

    let normalizedList: Pictures[] = [];
    if (Array.isArray(data)) {
      normalizedList = data as Pictures[];
    } else if (Array.isArray(dataWithResult?.result)) {
      normalizedList = dataWithResult.result;
    } else if (dataWithResult?.result) {
      normalizedList = [dataWithResult.result];
    } else if (data && typeof data === "object") {
      normalizedList = [data as Pictures];
    }

    const mainPicture =
      normalizedList.find((item) => Boolean(item?.is_main)) ??
      normalizedList[0];

    if (!mainPicture) return null;

    // Some responses may miss entity_id; keep mapping stable.
    if (!mainPicture.entity_id) {
      return { ...mainPicture, entity_id: Number(productId) } as Pictures;
    }

    return mainPicture;
  } catch (error) {
    console.error("Failed to load product:", error);
    return null;
  }
};

export const getPricesById = async (): Promise<Prices | null> => {
  try {
    const response = await tableCrmApi.get<Prices>(`/prices/`);
    return response.data;
  } catch (error) {
    console.error("Failed to load product:", error);
    return null;
  }
};
