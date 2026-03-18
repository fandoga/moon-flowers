'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';

interface BlogCardProps {
  id: number;
  title: string;
  excerpt: string;
  description?: string;
  image: string;
  slug?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ id, title, excerpt, description, image, slug }) => {
  const href = slug ? `/blog/${slug}` : `/blog/${id}`;

  return (
    <Link href={href} className="block group">
      <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-[#394426]">
              <Play size={32} fill="currentColor" />
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-sm font-medium bg-[#394426]/80 inline-block px-3 py-1 rounded-full">
              {excerpt}
            </p>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold text-[#394426] mb-2 line-clamp-2">{title}</h3>
          <p className="text-gray-600 line-clamp-2">{description || excerpt}</p>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;