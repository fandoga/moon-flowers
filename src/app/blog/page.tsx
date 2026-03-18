import { Suspense } from 'react';
import Breadcrumb from '@/widgets/breadcrumb/Breadcrumb';
import BlogList from '@/widgets/blog-list/BlogList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Блог питомника Клевер — советы по посадке и уходу за растениями',
  description: 'Полезные статьи о выборе, посадке, уходе за деревьями и кустарниками в условиях Татарстана. Секреты от питомника Клевер Казань.',
  keywords: ['посадка деревьев Казань', 'уход за хвойными', 'обрезка гортензии', 'саженцы советы'],
  
  twitter: {
    card: 'summary_large_image',
    title: 'Блог питомника Клевер — советы по садоводству',
    images: ['/og-blog.jpg'],
  },
};

export default function BlogPage() {
  return (
    <main className="py-8 md:py-12 bg-[#F8F9FB]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb paths={[{ url: '/', name: 'Главная' }, { url: '/blog', name: 'Блог' }]} />
        <h1 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold text-[#394426] mb-8">Блог</h1>
        <Suspense fallback={<div className="py-12 text-center">Загрузка статей...</div>}>
          <BlogList />
        </Suspense>
      </div>
    </main>
  );
}