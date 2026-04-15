// app/catalog/[id]/CategoryPageClient.tsx
'use client';

import { motion } from 'framer-motion';
import Breadcrumb from '@/widgets/breadcrumb/Breadcrumb';
import CategoryProducts from '@/widgets/category-products/CategoryProducts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

interface Props {
  category: any;
  imageUrl: string | null;
  categoryId: number;
}

export default function CategoryPageContent({ category, imageUrl, categoryId }: Props) {
  return (
    <motion.main
      className="py-8 md:py-12 bg-[#F8F9FB] max-w-[1440px] m-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto">
        <motion.div variants={itemVariants}>
          <Breadcrumb
            paths={[
              { url: '/', name: 'Главная' },
              { url: '/catalog', name: 'Каталог' },
              { url: `/catalog/${categoryId}`, name: category.name },
            ]}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="mt-4 mb-8">
          <h1 className="text-4xl md:text-5xl py-3 font-bold text-[#394426] mb-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-gray-600 font-manrope">{category.description}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <CategoryProducts categoryId={categoryId} />
        </motion.div>
      </div>
    </motion.main>
  );
}