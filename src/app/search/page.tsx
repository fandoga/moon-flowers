// app/search/page.tsx
import SearchPageClient from './SearchPageContent';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  return <SearchPageClient query={q} />;
}