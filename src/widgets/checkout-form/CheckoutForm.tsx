// components/widgets/checkout-form/CheckoutForm.tsx
import React from 'react';

const CheckoutForm = () => {
  return (
    <form className="bg-gray-100 p-6 rounded-lg">
      <h2 className="text-2xl font-serif mb-4">Данные получателя</h2>
      <input type="text" placeholder="Имя" className="w-full mb-4 p-2 border rounded" />
      <input type="text" placeholder="Фамилия" className="w-full mb-4 p-2 border rounded" />
      <input type="tel" placeholder="Телефон" className="w-full mb-4 p-2 border rounded" />
      <h2 className="text-2xl font-serif mb-4">Способ получения</h2>
      <label className="flex items-center mb-2">
        <input type="radio" name="delivery" className="mr-2" />
        Доставка
      </label>
      <label className="flex items-center mb-4">
        <input type="radio" name="delivery" className="mr-2" />
        Самовывоз
      </label>
      <input type="text" placeholder="Адрес доставки" className="w-full mb-4 p-2 border rounded" />
      <h2 className="text-2xl font-serif mb-4">Способ оплаты</h2>
      <label className="flex items-center mb-2">
        <input type="radio" name="payment" className="mr-2" />
        Наличными при получении
      </label>
      <label className="flex items-center mb-4">
        <input type="radio" name="payment" className="mr-2" />
        Банковская карта
      </label>
      <textarea placeholder="Комментарий к заказу" className="w-full mb-4 p-2 border rounded" />
      <button className="bg-green-700 text-white w-full p-3 rounded">Оформить заказ</button>
      <p className="text-sm text-gray-600 mt-2">Нажимая на кнопку, вы даете согласие на обработку персональных данных</p>
    </form>
  );
};

export default CheckoutForm;