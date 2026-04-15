import { AddToCartRequest, RemoveFromCartRequest } from '../types/types';

// Ключ для хранения в localStorage (без привязки к номеру телефона)
const getStorageKey = () => 'cart';

// Вспомогательные функции для работы с localStorage
const getCartFromStorage = (): CartGood[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(getStorageKey());
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveCartToStorage = (cart: CartGood[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getStorageKey(), JSON.stringify(cart));
};

// Тип товара в корзине (локальное представление)
interface CartGood {
  nomenclature_id: number;
  quantity: number;
}

// Получение корзины
export const getCart = async () => {
  const goods = getCartFromStorage();
  const total_count = goods.reduce((sum, item) => sum + item.quantity, 0);
  return {
    contragent_phone: '', // больше не привязано к USER_PHONE
    goods,
    total_count,
  };
};

// Добавление товара в корзину (поддерживает изменение количества)
export const addToCart = async (nomenclature_id: number, quantity: number = 1) => {
  const cart = getCartFromStorage();
  const existingIndex = cart.findIndex(item => item.nomenclature_id === nomenclature_id);

  if (existingIndex >= 0) {
    const newQuantity = cart[existingIndex].quantity + quantity;
    if (newQuantity <= 0) {
      cart.splice(existingIndex, 1);
    } else {
      cart[existingIndex].quantity = newQuantity;
    }
  } else {
    if (quantity > 0) {
      cart.push({ nomenclature_id, quantity });
    }
  }

  saveCartToStorage(cart);
  return getCart();
};

// Полное удаление товара из корзины
export const removeFromCart = async (nomenclature_id: number) => {
  const cart = getCartFromStorage();
  const updated = cart.filter(item => item.nomenclature_id !== nomenclature_id);
  saveCartToStorage(updated);
  return getCart();
};