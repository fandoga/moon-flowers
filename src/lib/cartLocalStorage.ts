export interface CartItemMeta {
  productId: number;
  addedAt: number; 
}

const STORAGE_KEY = 'cart_meta';

export const getCartMeta = (): CartItemMeta[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const setCartMeta = (meta: CartItemMeta[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
};

export const addCartMeta = (productId: number) => {
  const meta = getCartMeta();
  if (!meta.some(item => item.productId === productId)) {
    meta.push({ productId, addedAt: Date.now() });
    setCartMeta(meta);
  }
};

export const removeCartMeta = (productId: number) => {
  const meta = getCartMeta().filter(item => item.productId !== productId);
  setCartMeta(meta);
};

export const updateCartMetaQuantity = (productId: number, quantity: number) => {

};

export const clearCartMeta = () => {
  localStorage.removeItem(STORAGE_KEY);
};