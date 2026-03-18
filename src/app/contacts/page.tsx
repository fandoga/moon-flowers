import Breadcrumb from '@/widgets/breadcrumb/Breadcrumb';
import FormRequest from '@/widgets/form-request/FormRequest';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Контакты питомника Клевер — Казань',
  description: 'Адрес, телефоны, email, карта проезда. Питомник растений Клевер — крупномеры и саженцы в Казани.',
  
  openGraph: {
    title: 'Контакты питомника Клевер Казань',
    description: 'г. Казань, Мамадышский тракт, 56 / пос. Залесный, ул. Залесная, 58. Звоните: +7 (966) 240-90-53',
    url: 'https://ваш-домен.ru/contacts',
    images: [
      {
        url: '/og-contacts.jpg', 
        width: 1200,
        height: 630,
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Контакты питомника Клевер',
    images: ['/og-contacts.jpg'],
  },
  
  alternates: {
    canonical: 'https://ваш-домен.ru/contacts',
  },
};

export default function ContactsPage() {
  return (
    <main className="py-8 md:py-12 bg-[#F8F9FB]">
      <div className="container mx-auto max-w-[1440px]">
        <Breadcrumb paths={[{ url: '/', name: 'Главная' }, { url: '/contacts', name: 'Контакты' }]} />
        <h1 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold text-[#394426] mb-8">Контакты</h1>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-[#394426] mb-4">Адрес</h2>
            <p className="text-lg text-gray-700">г. Казань, Мамадышский тракт, 56<br />пос. Залесный, ул. Залесная, 58</p>

            <h2 className="text-2xl font-bold text-[#394426] mt-8 mb-4">Телефоны</h2>
            <p className="text-lg text-gray-700">+7 (843) 240-90-53<br />+7 (966) 240-90-53</p>

            <h2 className="text-2xl font-bold text-[#394426] mt-8 mb-4">Email</h2>
            <p className="text-lg text-gray-700">sadkzn@mail.ru</p>

            <h2 className="text-2xl font-bold text-[#394426] mt-8 mb-4">Режим работы</h2>
            <p className="text-lg text-gray-700">ежедневно с 09:00 до 18:00</p>
          </div>
          <div>
            <div className="bg-gray-200 h-115 rounded-xl overflow-hidden">
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=49.106414%2C55.796127&z=12&l=map&pt=49.106414,55.796127,pm2blm"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
              />
            </div>
          </div>
        </div>

        <FormRequest />
      </div>
    </main>
  );
}