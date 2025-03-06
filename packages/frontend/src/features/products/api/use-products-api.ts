import { useInfiniteQuery } from "@tanstack/react-query";

import { PaginatedResponse } from "@/src/types/paginated-api-response";
import { Product } from "@/src/features/products/types/product";
import productService from "@/src/features/products/api/product-service";

export const useProductsAPI = (initialData: PaginatedResponse<Product[]>) => {
  return useInfiniteQuery({
    queryKey: ["orders"],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return await productService.getProducts(pageParam);
    },
    initialData: {
      pageParams: [1],
      pages: [initialData],
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.next) {
        return allPages.length + 1;
      }

      return undefined;
    },
    staleTime: 1000 * 60 * 60 * 0.1,
  });
};
