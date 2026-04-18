import { useQuery } from "@tanstack/react-query";
import { getMpProducts, getMpProductById } from "../api/api";
import { MpProductsQueryParams, MpProductsResponse, MpProduct } from "../types/types";

export const useMpProducts = (params?: MpProductsQueryParams) => {
  return useQuery<MpProductsResponse>({
    queryKey: ["mp-products", params],
    queryFn: () => getMpProducts(params),
  });
};

export const useMpProduct = (productId: number | string | null | undefined) => {
  return useQuery<MpProduct | null>({
    queryKey: ["mp-product", productId],
    queryFn: () => productId ? getMpProductById(productId) : null,
    enabled: !!productId,
  });
};

