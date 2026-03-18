'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { blog } from '@/shared/api/api';
import BlogCard from '@/widgets/blog-card/BlogCard';

const mockPosts = [
  {
    id: 1,
    title: 'Секрет пышного цветения: как правильно обрезать гортензию, чтобы летом выросли огромные шапки',
    excerpt: 'Сделай так осенью, а летом ты не узнаешь свою гортензию',
    description:
      'Гортензия — бесспорная королева любого сада. Её пышные разноцветные «шапки» радуют глаз с середины лета до глубокой осени...',
    image: '/blog/img1.jpg',
    slug: 'kak-pravilno-obrezat-gortenziyu',
  },
  {
    id: 2,
    title: 'Секрет пышного цветения: как правильно обрезать гортензию, чтобы летом выросли огромные шапки',
    excerpt: 'Сделай так осенью, а летом ты не узнаешь свою гортензию',
    description:
      'Гортензия — бесспорная королева любого сада. Её пышные разноцветные «шапки» радуют глаз с середины лета до глубокой осени...',
    image: '/blog/img1.jpg',
    slug: 'kak-pravilno-obrezat-gortenziyu',
  },
  {
    id: 2,
    title: 'Секрет пышного цветения: как правильно обрезать гортензию, чтобы летом выросли огромные шапки',
    excerpt: 'Сделай так осенью, а летом ты не узнаешь свою гортензию',
    description:
      'Гортензия — бесспорная королева любого сада. Её пышные разноцветные «шапки» радуют глаз с середины лета до глубокой осени...',
    image: '/blog/img1.jpg',
    slug: 'kak-pravilno-obrezat-gortenziyu',
  },
  {
    id: 2,
    title: 'Секрет пышного цветения: как правильно обрезать гортензию, чтобы летом выросли огромные шапки',
    excerpt: 'Сделай так осенью, а летом ты не узнаешь свою гортензию',
    description:
      'Гортензия — бесспорная королева любого сада. Её пышные разноцветные «шапки» радуют глаз с середины лета до глубокой осени...',
    image: '/blog/img1.jpg',
    slug: 'kak-pravilno-obrezat-gortenziyu',
  },
  {
    id: 2,
    title: 'Секрет пышного цветения: как правильно обрезать гортензию, чтобы летом выросли огромные шапки',
    excerpt: 'Сделай так осенью, а летом ты не узнаешь свою гортензию',
    description:
      'Гортензия — бесспорная королева любого сада. Её пышные разноцветные «шапки» радуют глаз с середины лета до глубокой осени...',
    image: '/blog/img1.jpg',
    slug: 'kak-pravilno-obrezat-gortenziyu',
  },
  {
    id: 2,
    title: 'Секрет пышного цветения: как правильно обрезать гортензию, чтобы летом выросли огромные шапки',
    excerpt: 'Сделай так осенью, а летом ты не узнаешь свою гортензию',
    description:
      'Гортензия — бесспорная королева любого сада. Её пышные разноцветные «шапки» радуют глаз с середины лета до глубокой осени...',
    image: '/blog/img1.jpg',
    slug: 'kak-pravilno-obrezat-gortenziyu',
  },
  
];

export default function BlogList() {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => blog.posts.list().then(res => res.data),
  });

  if (isLoading) return <div className="py-12 text-center">Загрузка статей...</div>;
  if (error) {
    console.error('Ошибка загрузки блога:', error);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPosts.map(post => (
          <BlogCard key={post.id} {...post} />
        ))}
      </div>
    );
  }

  const displayPosts = posts?.length ? posts : mockPosts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayPosts.map(post => (
        <BlogCard
          key={post.id}
          id={post.id}
          title={post.title}
          excerpt={post.excerpt || 'Сделай так осенью, а летом ты не узнаешь свою гортензию'}
          description={post.description?.substring(0, 100)}
          image='/blog/img1.jpg'
          slug={post.slug}
        />
      ))}
    </div>
  );
}