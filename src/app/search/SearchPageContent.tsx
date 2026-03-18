// app/search/SearchPageClient.tsx
'use client';

import { motion } from 'framer-motion';
import Breadcrumb from '@/widgets/breadcrumb/Breadcrumb';
import SearchResults from '@/widgets/search-results/SearchResults';

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
  query?: string;
}

export default function SearchPageClient({ query }: Props) {
  if (!query) {
    return (
      <motion.main
        className="py-8 md:py-12 bg-[#F8F9FB]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto max-w-[1440px]">
          <motion.div variants={itemVariants}>
            <Breadcrumb
              paths={[
                { url: '/', name: 'Главная' },
                { url: '/search', name: 'Поиск' },
              ]}
            />
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-[#394426] mt-4 mb-8"
          >
            Поиск
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-gray-600">
            Введите поисковый запрос.
          </motion.p>
        </div>
      </motion.main>
    );
  }

  return (
    <motion.main
      className="py-8 md:py-12 bg-[#F8F9FB]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto max-w-[1440px]">
        <motion.div variants={itemVariants}>
          <Breadcrumb
            paths={[
              { url: '/', name: 'Главная' },
              { url: '/search', name: 'Поиск' },
              { url: `/search?q=${encodeURIComponent(query)}`, name: `«${query}»` },
            ]}
          />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-[#394426] mt-4 mb-8"
        >
          Результаты поиска: «{query}»
        </motion.h1>

        <motion.div variants={itemVariants}>
          <SearchResults query={query} />
        </motion.div>
      </div>
    </motion.main>
  );
}