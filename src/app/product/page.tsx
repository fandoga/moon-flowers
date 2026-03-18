import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Breadcrumb from '@/widgets/breadcrumb/Breadcrumb';
import { getProductsByCategoryAndName } from '@/entities/product/api/api';
import ProductPageContent from './ProductPageContent';
import Recomended from '@/widgets/recommended/Recomended';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  searchParams: Promise<{ category?: string; name?: string; variantId?: string }>;
};

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { category, name, variantId } = await searchParams;
  if (!category || !name) return { title: 'Товар не найден' };

  const categoryId = parseInt(category);
  const decodedName = decodeURIComponent(name);

  let products;
  try {
    const data = await getProductsByCategoryAndName(categoryId, decodedName, 1);
    products = data.result;
  } catch {
    return { title: 'Товар не найден' };
  }

  if (!products?.length) return { title: 'Товар не найден' };

  const product = variantId
    ? products.find(p => p.id === parseInt(variantId)) || products[0]
    : products[0];

  const firstPhoto = product.photos?.[0];
  const imageUrl = firstPhoto
    ? `${process.env.NEXT_PUBLIC_API_URL}/${firstPhoto.url.startsWith('pictures/') ? '' : 'photos/'}${firstPhoto.url}`
    : '/og-product-fallback.jpg';

  const productUrl = `https://klever plants.ru/product?category=${category}&name=${encodeURIComponent(decodedName)}${variantId ? `&variantId=${variantId}` : ''}`;

  return {
    title: `${product.name} — купить в питомнике Клевер Казань`,
    description: `Цена ${product.prices?.[0]?.price || '?'} ₽. ${product.name}. Доставка и посадка в Казани и Татарстане. Гарантия приживаемости.`,
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: `Цена от ${product.prices?.[0]?.price || '?'} ₽ • Питомник Клевер Казань`,
      images: [imageUrl],
    },
    alternates: {
      canonical: productUrl,
    },
  };
}


interface PageProps {
  searchParams: Promise<{ category?: string; name?: string; variantId?: string }>;
}

export default async function ProductPage({ searchParams }: PageProps) {
  const { category, name, variantId } = await searchParams;

  if (!category || !name) notFound();

  const categoryId = parseInt(category);
  if (isNaN(categoryId)) notFound();

  const decodedName = decodeURIComponent(name);

  let products;
  try {
    const data = await getProductsByCategoryAndName(categoryId, decodedName, 20);
    products = data.result;
  } catch {
    notFound(); 
  }

  if (!products || products.length === 0) notFound();

  let initialProduct = products[0];
  if (variantId) {
    const variantIdNum = parseInt(variantId);
    const found = products.find(p => p.id === variantIdNum);
    if (found) initialProduct = found;
  }

  return (
    <main className="py-6 mb-8 md:py-10 bg-white min-h-screen">
      <div className="container mx-auto max-w-[1440px]">
        <Breadcrumb
          paths={[
            { url: '/', name: 'Главная' },
            { url: '/catalog', name: 'Каталог' },
            { url: `/catalog/${category}`, name: 'Категория' },
            { url: `/product?category=${category}&name=${encodeURIComponent(decodedName)}`, name: initialProduct.name },
          ]}
        />

        <Suspense fallback={<div className="py-12 text-center">Загрузка...</div>}>
          <ProductPageContent
            initialProduct={initialProduct}
            allProducts={products}
          />
          <Recomended/>
        </Suspense>
      </div>
    </main>
  );
}