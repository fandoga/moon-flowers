import type { Metadata } from "next";
import DesktopProductPage from "@/widgets/product-page/ProductPage";
import {
  getMpProductById,
  getPicturesListById,
  getPricesById,
  type MpProduct,
} from "@/entities/mp-product";

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
  const resolvedPrice = pricesList.find(
    (item) => Number(item.nomenclature_id) === Number(base.id),
  );

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

const getEnrichedProduct = async (id: string): Promise<MpProduct | null> => {
  const base = await getMpProductById(id);
  if (!base) return null;
  return enrichProduct(id, base);
};

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
  const enrichedProduct = await getEnrichedProduct(id);

  if (!enrichedProduct) {
    return (
      <main className="py-8 md:py-12 bg-background max-w-[1440px] m-auto min-h-[60vh] flex items-center justify-center">
        <div className="text-xl">Товар не найден</div>
      </main>
    );
  }

  return (
    <main className="md:py-10 bg-background min-h-screen">
      <main className="md:py-12 bg-background max-w-[1440px] m-auto">
        <DesktopProductPage enrichedProduct={enrichedProduct} />
      </main>
    </main>
  );
}
