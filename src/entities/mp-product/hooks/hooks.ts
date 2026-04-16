import { useQuery } from "@tanstack/react-query";
import { getMpProducts } from "../api/api";
import { MpProductsQueryParams, MpProductsResponse } from "../types/types";

export const useMpProducts = (params?: MpProductsQueryParams) => {
  return useQuery<MpProductsResponse>({
    queryKey: ["mp-products", params],
    queryFn: () => getMpProducts(params),
  });
};

