import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from "@tanstack/react-query";
import { getCart, addToCart, removeFromCart } from "../api/api";
import { getProductById } from "@/entities/product/api/api";
import {
  getCartMeta,
  addCartMeta,
  removeCartMeta,
} from "@/lib/cartLocalStorage";
import { CartGood } from "@/entities/cart/types/types";
import { NomenclatureItem } from "@/entities/product/types/types";

type CartItemWithProduct = CartGood & {
  product: NomenclatureItem;
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

  const productQueries = useQueries({
    queries: cartItems.map((item: CartGood) => ({
      queryKey: ["product", item.nomenclature_id],
      queryFn: () => getProductById(item.nomenclature_id),
      enabled: !cartLoading,
    })),
  });

  const isLoading = cartLoading || productQueries.some((q) => q.isLoading);
  const error = cartError || productQueries.find((q) => q.error)?.error;

  const products = productQueries.map((q) => q.data).filter(Boolean);

  const cartMeta = getCartMeta();

  const itemsWithNullable = cartItems.map((item: CartGood, index: number) => {
    const meta = cartMeta.find((m) => m.productId === item.nomenclature_id);
    const product = products[index];
    if (!product) return null;
    return {
      ...item,
      product,
      addedAt: meta?.addedAt || 0,
    };
  });

  const itemsWithProducts = itemsWithNullable.filter(
    (item): item is CartItemWithProduct => item !== null,
  );

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
