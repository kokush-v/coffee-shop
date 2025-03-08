import { api } from "@/src/config/api";

import { Product } from "@/src/features/products/types/product";
import { PaginatedResponse } from "@/src/types/paginated-api-response";

class ProductsService {
  private routes = {
    products: (page: number) => `/products?page=${page}`,
  };

  public async getProducts(page: number = 1) {
    try {
      const { data } = await api.get<PaginatedResponse<Product[]>>(this.routes.products(page));

      return { data, error: null };
    } catch {
      return { data: null, error: "Could not fetch products" };
    }
  }
}

export default new ProductsService();
