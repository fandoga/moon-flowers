// app/catalog/page.tsx
"use client"
import { motion } from 'framer-motion';
import Breadcrumb from '@/widgets/breadcrumb/Breadcrumb';
import CategoryGrid from '@/widgets/category-grid/CategoryGrid';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function CatalogPage() {
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
            ]}
          />
        </motion.div>
        <motion.h1
          variants={itemVariants}
          className="mt-4 pb-10 text-4xl md:text-5xl font-bold text-[#394426] mb-2"
        >
          Каталог растений
        </motion.h1>
        <motion.div variants={itemVariants}>
          <CategoryGrid />
        </motion.div>
      </div>
    </motion.main>
  );
}