import { notFound } from 'next/navigation';
import Breadcrumb from '@/widgets/breadcrumb/Breadcrumb';
import RelatedPosts from '@/widgets/related-posts/RelatedPosts';
import Recomended from '@/widgets/recommended/Recomended';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  const post = mockPosts.find(p => p.slug === slug); 

  if (!post) {
    return {
      title: 'Статья не найдена',
      robots: { index: false },
    };
  }

  const firstImage = post.image || '/og-blog-default.jpg';
  const fullImageUrl = firstImage.startsWith('http') ? firstImage : `https://ваш-домен.ru${firstImage}`;

  const postUrl = `https://ваш-домен.ru/blog/${slug}`;

  return {
    title: `${post.title} — Блог питомника Клевер Казань`,
    description: post.excerpt?.substring(0, 160) || 'Полезная статья от питомника растений Клевер.',
    
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      type: 'article',
      publishedTime: '2024-05-15T08:00:00.000Z', 
      url: postUrl,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || '',
      images: [fullImageUrl],
    },
    
    alternates: {
      canonical: postUrl,
    },
  };
}


const mockPosts = [
  {
    id: 1,
    title: 'Секрет пышного цветения: как правильно обрезать гортензию, чтобы летом выросли огромные шапки',
    excerpt: 'Сделай так осенью, а летом ты не узнаешь свою гортензию',
    content: `
      <p>Гортензия — бесспорная королева любого сада. Её пышные разноцветные «шапки» радуют глаз с середины лета до глубокой осени. Но иногда случается разочарование: куст зелёный и большой, а цветов мало, или они мелкие и бледные.</p>
      <p>Почему так происходит? В 90% случаев это ошибка в обрезке. Многие садоводы либо жалеют куст и не обрезают его вовсе, либо стригут его «под одну гребёнку», не учитывая сорт. Давайте разберёмся, как правильно провести эту процедуру, чтобы следующим летом ваш сад утопал в цветах.</p>
      <h2>Шаг 1. Знакомство: какая гортензия у вас растёт?</h2>
      <p>Это самый важный пункт. Обрезка гортензии напрямую зависит от того, на каких побегах она цветёт...</p>
    `,
    image: '/blog/img1.jpg',
    slug: 'kak-pravilno-obrezat-gortenziyu',
  },
  
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = mockPosts.find(p => p.slug === slug);
  if (!post) notFound();

  return (
    <main className="py-8 md:py-12 bg-[#F8F9FB]">
      <div className="container mx-auto max-w-[1440px]">
        <Breadcrumb
          paths={[
            { url: '/', name: 'Главная' },
            { url: '/blog', name: 'Блог' },
            { url: `/blog/${slug}`, name: post.title },
          ]}
        />

        <article className="mt-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#394426] mb-4">{post.title}</h1>

          <div className="relative h-96 mb-8 rounded-xl overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover float-left" />
          </div>

          <div className="prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-[#394426] mb-6">Рекомендуем почитать</h2>
          <RelatedPosts currentPostId={post.id} />
        </div>
      </div>
      <div className="mt-16">
        <Recomended />
        </div>
    </main>
  );
}