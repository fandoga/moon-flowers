type CategoryPageContentProps = {
  category: { name?: string } | null | undefined;
  imageUrl: string | null;
  categoryId: number;
};

export default function CategoryPageContent({
  category,
  imageUrl,
  categoryId,
}: CategoryPageContentProps) {
  return (
    <section className="container py-8">
      <h1 className="text-2xl font-semibold">
        {category?.name ?? `Category #${categoryId}`}
      </h1>
      {imageUrl ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Main image: {imageUrl}
        </p>
      ) : null}
      <p className="mt-4 text-sm text-muted-foreground">
        This section is temporarily stubbed and will be redesigned later.
      </p>
    </section>
  );
}
