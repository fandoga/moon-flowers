import { Suspense } from "react";
import type { Metadata } from "next";
import Product from "@/widgets/product/Product";
import {
  getMpProductById,
  getPicturesListById,
  getPricesById,
  type MpProduct,
} from "@/entities/mp-product";
import { FullScreenLoader } from "@/widgets/initial-loader.tsx/InitialLoader";

type PageProps = {
  params: Promise<{ id: string }>;
};

const enrichProduct = async (
  productId: string,
  base: MpProduct,
): Promise<MpProduct> => {
  const [pictures, prices] = await Promise.all([
    getPicturesListById(productId),
    getPricesById(),
  ]);

  console.log("[enrichProduct] prices response:", prices);

  const sortedPictures = [...pictures].sort((a, b) => {
    const am = a?.is_main ? 1 : 0;
    const bm = b?.is_main ? 1 : 0;
    return bm - am;
  });
  const photoUrls = sortedPictures
    .map((p) => p.public_url || p.url)
    .filter(Boolean) as string[];

  const pricesList = Array.isArray(prices?.result)
    ? prices.result
    : prices?.result
      ? [prices.result]
      : [];

  console.log("[enrichProduct] pricesList:", pricesList);

  const resolvedPrice = pricesList.find(
    (item) => Number(item.nomenclature_id) === Number(base.id),
  );

  console.log("[enrichProduct] resolvedPrice for", base.id, ":", resolvedPrice);

  const fallbackPhoto =
    (base as MpProduct & { images?: string[]; photos?: string[] | null })
      .photos?.[0] ||
    (base as MpProduct & { images?: string[] }).images?.[0] ||
    "/placeholder.jpg";

  return {
    ...base,
    photos: photoUrls.length ? photoUrls : [fallbackPhoto],
    images: [photoUrls[0] || fallbackPhoto],
    price: Number(resolvedPrice?.price ?? base.price ?? 0),
  } as MpProduct;
};

async function EnrichedProduct({ id }: { id: string }) {
  const base = await getMpProductById(id);
  if (!base) {
    return (
      <div className="text-xl flex items-center justify-center min-h-[60vh]">
        Товар не найден
      </div>
    );
  }
  const enriched = await enrichProduct(id, base);
  return <Product enrichedProduct={enriched} />;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getMpProductById(id);

  if (!product) {
    return {
      title: "Товар не найден",
      description: "Страница товара недоступна",
    };
  }

  return {
    title: `${product.name} | Moon Flowers`,
    description: product.description_short || "Карточка товара Moon Flowers",
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="bg-background min-h-screen">
      <div className="md:py-12 bg-background max-w-[1440px] m-auto">
        <Suspense fallback={<FullScreenLoader />}>
          <EnrichedProduct id={id} />
        </Suspense>
      </div>
    </main>
  );
}
