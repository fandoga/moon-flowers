'use client';

import React from 'react';
import BlogCard from '@/widgets/blog-card/BlogCard';


const mockPosts = [
  {
    id: 2,
    title: 'Секрет пышного цветения: как правильно обрезать гортензию, чтобы летом выросли огромные шапки',
    excerpt: 'Сделай так осенью, а летом ты не узнаешь свою гортензию',
    description: 'Гортензия — бесспорная королева любого сада...',
    image: '/blog/img1.jpg',
    slug: 'kak-pravilno-obrezat-gortenziyu-2',
  },
  {
    id: 3,
    title: 'Секрет пышного цветения: как правильно обрезать гортензию, чтобы летом выросли огромные шапки',
    excerpt: 'Сделай так осенью, а летом ты не узнаешь свою гортензию',
    description: 'Гортензия — бесспорная королева любого сада...',
    image: '/blog/img1.jpg',
    slug: 'kak-pravilno-obrezat-gortenziyu-3',
  },
  {
    id: 4,
    title: 'Секрет пышного цветения: как правильно обрезать гортензию, чтобы летом выросли огромные шапки',
    excerpt: 'Сделай так осенью, а летом ты не узнаешь свою гортензию',
    description: 'Гортензия — бесспорная королева любого сада...',
    image: '/blog/img1.jpg',
    slug: 'kak-pravilno-obrezat-gortenziyu-4',
  },
];

interface RelatedPostsProps {
  currentPostId: number;
}

export default function RelatedPosts({ currentPostId }: RelatedPostsProps) {
  
  const related = mockPosts.filter(p => p.id !== currentPostId).slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {related.map(post => (
        <BlogCard key={post.id} {...post} />
      ))}
    </div>
  );
}