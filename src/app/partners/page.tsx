import Breadcrumb from '@/widgets/breadcrumb/Breadcrumb';
import FormRequest from '@/widgets/form-request/FormRequest';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Сотрудничество и партнёрство — питомник Клевер Казань',
  description:
    'Выгодные условия для ландшафтных дизайнеров, строительных компаний, садовых центров и архитектурных бюро. Индивидуальные скидки, прайс-лист, быстрая доставка.',
  
  openGraph: {
    title: 'Партнёрам — питомник Клевер Казань',
    description:
      'Сотрудничество с профессионалами: крупномеры, саженцы, оптовые цены, доставка, посадка. Заполните форму и получите коммерческое предложение.',
    url: 'https://klever-sad.ru/partners',
    type: 'website',
    images: [
      {
        url: '/og-partners.jpg', 
        width: 1200,
        height: 630,
        alt: 'Сотрудничество с питомником Клевер — Казань',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Партнёрам — питомник растений Клевер',
    images: ['/og-partners.jpg'],
  },
  
  alternates: {
    canonical: 'https://klever-sad.ru/partners',
  },
};

export default function PartnersPage() {
  return (
    <main className="bg-[#F8F9FB] bg-[#F8F9FB]">
      <div className="container mx-auto max-w-[1440px]">
        <Breadcrumb paths={[{ url: '/', name: 'Главная' }, { url: '/partners', name: 'Партнёрам' }]} />
        <h1 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold text-[#394426] mb-8">Партнёрам</h1>

        <div className="prose prose-lg max-w-none text-[#394426] text-lg mb-12">
          <p>
            Мы открыты к сотрудничеству с ландшафтными дизайнерами, строительными компаниями, садовыми центрами и
            архитектурными бюро. Предлагаем выгодные условия, индивидуальные скидки и оперативную доставку.
          </p>
          <p>
            Для получения коммерческого предложения и прайс-листа заполните форму ниже – наш менеджер свяжется с вами
            в ближайшее время.
          </p>
        </div>

        <FormRequest />
      </div>
    </main>
  );
}