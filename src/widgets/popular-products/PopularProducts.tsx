import React from "react";
import SearchResults from "../search-results/SearchResults";
import CatalogButton from "@/components/ui/catalog-button";

const PopularProducts = () => {
  return (
    <>
      <SearchResults loadMore={false} query="" limit={4} />
      <div className="w-full flex justify-center">
        <CatalogButton />
      </div>
    </>
  );
};

export default PopularProducts;
