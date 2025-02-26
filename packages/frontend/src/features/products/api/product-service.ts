import { api } from "@/src/config/api";

import { Product } from "@/src/features/products/types/product";
import { PaginatedResponse } from "@/src/types/paginated-api-response";

class ProductsService {
  private routes = {
    products: "/products",
  };

  public async getProducts(): Promise<Product[]> {
    const {
      data: { results: products },
    } = await api.get<PaginatedResponse<Product[]>>(this.routes.products);

    return products.map((product) => ({
      ...product,
      price: Math.round(product.price),
      product_weight: Math.round(product.product_weight),
    }));
  }
}

export default new ProductsService();
