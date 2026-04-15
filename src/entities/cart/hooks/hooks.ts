import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, addToCart, removeFromCart } from "../api/api";
import {
  getCartMeta,
  addCartMeta,
  removeCartMeta,
} from "@/lib/cartLocalStorage";
import { CartGood } from "@/entities/cart/types/types";

export type CartItemWithProduct = CartGood & {
  product?: {
    id: number;
    name?: string;
    prices?: Array<{ price: number }>;
    photos?: Array<{ url: string }>;
  };
  addedAt: number;
};

export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
  });
};

export const useCartItemQuantity = (productId: number) => {
  const { data: cart } = useCart();
  const item = cart?.goods?.find(
    (g: CartGood) => g.nomenclature_id === productId,
  );
  return item?.quantity || 0;
};

export const useCartProducts = () => {
  const {
    data: cartData,
    isLoading: cartLoading,
    error: cartError,
  } = useCart();
  const cartItems = cartData?.goods || [];
  const isLoading = cartLoading;
  const error = cartError;
  const cartMeta = getCartMeta();

  const itemsWithProducts = cartItems.map((item: CartGood) => {
    const meta = cartMeta.find((m) => m.productId === item.nomenclature_id);
    return {
      ...item,
      product: undefined,
      addedAt: meta?.addedAt || 0,
    } as CartItemWithProduct;
  });

  itemsWithProducts.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));

  return {
    data: itemsWithProducts,
    totalCount: cartData?.total_count || 0,
    isLoading,
    error,
  };
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      nomenclature_id,
      quantity,
    }: {
      nomenclature_id: number;
      quantity?: number;
    }) => addToCart(nomenclature_id, quantity || 1),
    onSuccess: (data, variables) => {
      addCartMeta(variables.nomenclature_id);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ nomenclature_id }: { nomenclature_id: number }) =>
      removeFromCart(nomenclature_id),
    onSuccess: (data, variables) => {
      removeCartMeta(variables.nomenclature_id);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
