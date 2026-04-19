import type {
  DeliveryInfoPayload,
  DocSalesCreateItem,
  DocSalesGoodItem,
} from "../types/types";

export type CartLineForOrder = {
  id: number;
  price: number;
  quantity: number;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

const envInt = (value: string | undefined, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
};

export const getOrderEnvDefaults = () => ({
  organization: envInt(process.env.NEXT_PUBLIC_ORG_ID, 245),
  warehouse: envInt(process.env.NEXT_PUBLIC_ORDER_WAREHOUSE, 70),
  contragent: envInt(process.env.NEXT_PUBLIC_ORDER_CONTRAGENT, 854495),
  goodsUnit: envInt(process.env.NEXT_PUBLIC_ORDER_GOODS_UNIT, 116),
  deliveryNomenclatureId: envInt(
    process.env.NEXT_PUBLIC_DELIVERY_NOMENCLATURE_ID,
    0,
  ),
});

export function buildDocSalesOrder(params: {
  cartLines: CartLineForOrder[];
  deliveryPrice: number;
  escrowRub: number;
  loyalityCardId: number | null;
  contragentId: number | null;
  organization: number;
  warehouse: number;
  defaultUnit: number;
  deliveryNomenclatureId: number;
  settings?: Record<string, unknown>;
}): DocSalesCreateItem {
  const {
    cartLines,
    deliveryPrice,
    escrowRub,
    loyalityCardId,
    contragentId,
    organization,
    warehouse,
    defaultUnit,
    deliveryNomenclatureId,
    settings = {},
  } = params;

  const goods: DocSalesGoodItem[] = cartLines.map((item) => ({
    price: item.price,
    quantity: item.quantity,
    unit: defaultUnit,
    discount: 0,
    sum_discounted: 0,
    nomenclature: item.id,
  }));

  const env = getOrderEnvDefaults();

  if (deliveryPrice > 0) {
    if (deliveryNomenclatureId > 0) {
      goods.push({
        price: deliveryPrice,
        quantity: 1,
        unit: defaultUnit,
        discount: 0,
        sum_discounted: 0,
        nomenclature: deliveryNomenclatureId,
      });
    } else {
      Object.assign(settings, {
        delivery_price_rub: deliveryPrice,
        delivery_not_in_goods: true,
      });
    }
  }

  const goodsSum = goods.reduce((acc, g) => acc + g.price * g.quantity, 0);
  const sumNominal =
    deliveryPrice > 0 && deliveryNomenclatureId <= 0
      ? goodsSum + deliveryPrice
      : goodsSum;

  const sum = round2(sumNominal);
  const paidLt = round2(Math.min(sum, Math.max(0, escrowRub)));
  const paidRubles = round2(Math.max(0, sum - paidLt));

  return {
    priority: 0,
    dated: Math.floor(Date.now() / 1000),
    operation: "Заказ",
    tax_included: true,
    tax_active: true,
    goods,
    settings,
    loyality_card_id: loyalityCardId || 0,
    warehouse,
    contragent: contragentId || env.contragent,
    organization,
    status: true,
    paid_rubles: paidRubles,
    paid_lt: paidLt,
    sum,
  };
}

/** Unix-время доставки: «как можно скорее» или выбранные дата и время. */
export function resolveDeliveryUnix(params: {
  preferSoon: boolean;
  date?: Date;
  time: string;
}): number {
  if (params.preferSoon) {
    return Math.floor(Date.now() / 1000);
  }
  const base = params.date ?? new Date();
  const [hhRaw, mmRaw] = params.time.split(":");
  const hh = Number.parseInt(hhRaw ?? "10", 10);
  const mm = Number.parseInt(mmRaw ?? "30", 10);
  const d = new Date(base);
  d.setHours(
    Number.isFinite(hh) ? hh : 10,
    Number.isFinite(mm) ? mm : 0,
    0,
    0,
  );
  return Math.floor(d.getTime() / 1000);
}

export function splitRecipientName(full: string): {
  name: string;
  surname: string;
} {
  const t = full.trim();
  if (!t) return { name: "", surname: "" };
  const parts = t.split(/\s+/);
  if (parts.length === 1) return { name: parts[0], surname: "" };
  return { name: parts[0] ?? "", surname: parts.slice(1).join(" ") };
}

export function buildDeliveryDoc(params: {
  address: string;
  delivery_date: number;
  delivery_price: number;
  recipient: {
    name: string;
    surname?: string;
    phone: string;
  };
  note: string;
}): DeliveryInfoPayload {
  const { address, delivery_date, delivery_price, recipient, note } = params;
  const split = splitRecipientName(recipient.name);
  const firstName = split.name || recipient.name.trim();
  const surname = recipient.surname ?? split.surname;

  return {
    address,
    delivery_date,
    delivery_price,
    recipient: {
      name: firstName,
      surname,
      phone: recipient.phone,
    },
    note,
  };
}
