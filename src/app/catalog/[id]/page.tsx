// app/catalog/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getCategoryById, getCategoryPictures } from '@/entities/category/api/api';
import CategoryPageContent from './CategoryPageContent';
import { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const categoryId = parseInt(id);

  let category;
  try {
    category = await getCategoryById(categoryId);
  } catch {
    return { title: 'Категория не найдена' };
  }

  const pictures = await getCategoryPictures(categoryId);
  const mainPic = pictures.result.find(p => p.is_main) || pictures.result[0];
  const imageUrl = mainPic
    ? `${process.env.NEXT_PUBLIC_API_URL}/${mainPic.url}`
    : '/og-category-fallback.jpg';

  const categoryUrl = `https://klever plants.ru/catalog/${id}`;

  return {
    title: `${category.name} — купить в питомнике Клевер Казань`,
    description: `Широкий выбор ${category.name.toLowerCase()} в питомнике Клевер. Доставка по Казани и Татарстану.`,
    openGraph: {
      title: category.name,
      description: `Категория ${category.name} • Питомник Клевер Казань`,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      url: categoryUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: category.name,
      images: [imageUrl],
    },
    alternates: { canonical: categoryUrl },
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { id } = await params;
  const categoryId = parseInt(id);

  if (isNaN(categoryId)) notFound();

  let category;
  let imageUrl: string | null = null;
  
  try {
    category = await getCategoryById(categoryId);
    const pictures = await getCategoryPictures(categoryId);
    const mainPicture = pictures.result.find(p => p.is_main) || pictures.result[0];
    imageUrl = mainPicture ? `${process.env.NEXT_PUBLIC_API_URL}/${mainPicture.url}` : null;
  } catch {
    notFound();
  }

  return <CategoryPageContent category={category} imageUrl={imageUrl} categoryId={categoryId} />;
}