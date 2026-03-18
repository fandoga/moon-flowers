import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  findContragentByPhone,
  createContragent,
  createDocsSales,
  addDeliveryInfo,
  createYooKassaPayment,
} from "../api/api";
import { IOrder, IDeliveryInfo, PaymentRequest } from "../types/types";

const WAREHOUSE_ID = 67;
const ORGANIZATION_ID = 69;

export const useCreateFullOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      goods: Array<{
        nomenclature_id: number;
        quantity: number;
        price: number;
      }>;
      customer: { firstName: string; lastName: string; phone: string };
      delivery: {
        method: "delivery" | "pickup";
        address?: string;
      };
      paymentMethod: "cash" | "card";
      comment: string;
      total: number;
    }) => {
      const { goods, customer, delivery, paymentMethod, comment, total } =
        params;

      // 1. Контрагент
      let contragentId: number;
      const existing = await findContragentByPhone(customer.phone);
      if (existing) {
        contragentId = existing.id;
      } else {
        const newContragent = await createContragent({
          name: `${customer.firstName} ${customer.lastName}`.trim(),
          phone: customer.phone,
        });
        contragentId = newContragent.id;
      }

      // 2. Подготовка данных заказа
      const orderGoods = goods.map((g) => ({
        price: g.price,
        quantity: g.quantity,
        nomenclature: g.nomenclature_id,
        discount: 0,
      }));

      const now = Math.floor(Date.now() / 1000);
      const orderData: IOrder = {
        dated: now,
        operation: "Заказ",
        comment,
        contragent: contragentId,
        tax_included: true,
        tax_active: true,
        goods: orderGoods,
        warehouse: WAREHOUSE_ID,
        organization: ORGANIZATION_ID,
        tags: `PAYMENT_${paymentMethod}, DELIVERY_${delivery.method}`,
        paid_rubles: total,
        paid_lt: 0,
        status: false,
        sum: total,
      };

      // 3. Создание заказа
      const createdOrder = await createDocsSales(orderData);
      const orderId = createdOrder.id!;

      // 4. Информация о доставке
      if (delivery.method === "delivery" && delivery.address) {
        const deliveryInfo: IDeliveryInfo = {
          address: delivery.address,
          delivery_date: now + 86400 * 2,
          recipient: {
            name: customer.firstName,
            surname: customer.lastName,
            phone: customer.phone,
          },
          note: comment,
        };
        await addDeliveryInfo(orderId, deliveryInfo);
      } else {
        await addDeliveryInfo(orderId, {
          address: "Самовывоз",
          delivery_date: now,
          recipient: {
            name: customer.firstName,
            surname: customer.lastName,
            phone: customer.phone,
          },
          note: comment,
        });
      }

      // 5. Если оплата картой – создаём платёж
      if (paymentMethod === "card") {
        const vatCode = 1;
        const paymentData: PaymentRequest = {
          amount: { value: total.toFixed(2), currency: "RUB" },
          capture: true,
          receipt: {
            customer: { phone: customer.phone },
            items: goods.map((g) => ({
              description: `Товар ${g.nomenclature_id}`,
              quantity: g.quantity,
              vat_code: vatCode,
              amount: {
                value: (g.price * g.quantity).toFixed(2),
                currency: "RUB",
              },
            })),
          },
          confirmation: {
            type: "redirect",
            return_url: `${window.location.origin}/order/success?order_id=${orderId}`,
          },
        };
        const payment = await createYooKassaPayment(
          WAREHOUSE_ID,
          orderId,
          paymentData,
        );
        return {
          type: "payment",
          url: payment.confirmation.confirmation_url,
          orderId,
        };
      }

      return { type: "success", orderId };
    },
    onSuccess: (data) => {
      // Удаляем корзину из localStorage по ключу 'cart'
      localStorage.removeItem('cart');
      // Инвалидируем запросы корзины в React Query
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};