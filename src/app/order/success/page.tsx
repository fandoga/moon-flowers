import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <main className="py-12 md:py-20 bg-[#F8F9FB] min-h-screen">
      <div className="container mx-auto max-w-[1440px] text-center">
        <CheckCircle size={64} className="text-[#394426] mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-[#394426] mb-4">
          Заказ оформлен!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Спасибо за покупку. Мы свяжемся с вами в ближайшее время.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#394426] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#102902] transition-colors"
        >
          Вернуться на главную
        </Link>
      </div>
    </main>
  );
}