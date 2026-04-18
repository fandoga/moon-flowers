import { useQuery } from "@tanstack/react-query";
import {
  getMpProducts,
  getMpProductById,
  getPicturesById,
  getPricesById,
} from "../api/api";
import {
  MpProductsQueryParams,
  MpProductsResponse,
  MpProduct,
  Pictures,
  Prices,
} from "../types/types";

export const useMpProducts = (params?: MpProductsQueryParams) => {
  return useQuery<MpProductsResponse>({
    queryKey: ["mp-products", params],
    queryFn: () => getMpProducts(params),
  });
};

export const useMpProduct = (productId: number | string | null | undefined) => {
  return useQuery<MpProduct | null>({
    queryKey: ["mp-product", productId],
    queryFn: () => (productId ? getMpProductById(productId) : null),
    enabled: !!productId,
  });
};

export const usePictures = (productId: number | string | null | undefined) => {
  return useQuery<Pictures | null>({
    queryKey: ["mp-product-pictures", productId],
    queryFn: () => (productId ? getPicturesById(productId) : null),
    enabled: !!productId,
  });
};

export const usePrices = () => {
  return useQuery<Prices | null>({
    queryKey: ["mp-product-prices"],
    queryFn: () => getPricesById(),
  });
};
