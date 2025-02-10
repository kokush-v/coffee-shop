import { api } from "@/src/config/api";

import { Product } from "@/src/features/products/types/product";

class ProductsService {
  private routes = {
    products: "/products"
  }

  public async getProducts(): Promise<Product[]> {
    const products: Product[] = (await api.get(this.routes.products)).data.results
    
    return products.map((product) => ({
      ...product,
      price: Math.round(product.price),
      product_weight: Math.round(product.product_weight)
    }))
  }
}

export default new ProductsService()