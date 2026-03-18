// app/company/page.tsx
import type { Metadata } from 'next';
import Breadcrumb from '@/widgets/breadcrumb/Breadcrumb';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'О компании — питомник растений Клевер Казань',
  description:
    'Семейный питомник Клевер с 2016 года. Более 5000 сортов акклиматизированных растений для Татарстана. Гарантия приживаемости, доставка, посадка под ключ.',
  
  openGraph: {
    title: 'О питомнике Клевер — Казань',
    description:
      'Собственное производство крупномеров и саженцев. 8+ лет опыта, тысячи довольных клиентов, профессиональная команда и техника.',
    url: 'https://klever-sad.ru/company',
    type: 'website',
    images: [
      {
        url: '/og-company.jpg', 
        width: 1200,
        height: 630,
        alt: 'Питомник растений Клевер — о компании',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'О компании — питомник Клевер Казань',
    images: ['/og-company.jpg'],
  },
  
  alternates: {
    canonical: 'https://klever-sad.ru/company',
  },
};

export default function CompanyPage() {
  return (
    <main className="py-8 md:py-12 bg-[#F8F9FB] font-manrope">
      <div className="container mx-auto max-w-[1440px]">
        <Breadcrumb paths={[{ url: '/', name: 'Главная' }, { url: '/company', name: 'О компании' }]} />
        <h1 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-[#394426] mb-8">О компании</h1>

        <div className="prose prose-lg max-w-none text-gray-800 text-[#394426] space-y-6">
          <p className="leading-relaxed text-lg">
            Питомник «Клевер» — это семейное предприятие, основанное в 2016 году. Мы специализируемся на выращивании
            акклиматизированных растений для садов, парков и городского озеленения в Казани и Республике Татарстан.
            Наш ассортимент включает более 5000 сортов хвойных, лиственных, плодовых деревьев и кустарников.
          </p>
          <div className="relative h-[400px] md:h-[600px] w-full my-6 rounded-xl overflow-hidden">
            <Image 
              src="/company/img1.jpg" 
              alt="Питомник растений" 
              fill 
              className="object-cover"
              priority
              quality={85}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <p className="leading-relaxed text-lg text-[#394426]">
            Все растения проходят многоступенчатый контроль качества и адаптированы к местным климатическим условиям.
            Мы гарантируем приживаемость и предоставляем профессиональные консультации по посадке и уходу.
          </p>
          <div className="relative h-[400px] md:h-[600px] w-full my-6 rounded-xl overflow-hidden">
            <Image 
              src="/company/img2.jpg" 
              alt="Саженцы" 
              fill 
              className="object-cover"
              priority
              quality={85}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <p className="leading-relaxed text-lg text-[#394426]">
            Наши клиенты — владельцы частных участков, ландшафтные дизайнеры, строительные компании и городские службы.
            Мы гордимся тем, что тысячи растений, выращенных с заботой, украшают улицы и сады нашего региона.
          </p>
        </div>
      </div>
    </main>
  );
}