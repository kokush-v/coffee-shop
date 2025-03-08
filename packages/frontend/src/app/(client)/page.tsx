import { ProductsLayout } from "@/src/features/products/ui/products-layout";

import productsService from "@/src/features/products/api/product-service";
import { Unplug } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data, error } = await productsService.getProducts();

  if (error || !data) {
    return (
      <div className="flex-1 flex items-center justify-center text-xs flex-col text-zinc-400 font-medium">
        <div className="rounded-full bg-primary/5 p-4 mb-2">
          <Unplug />
        </div>
        Не вдалось отримати товари, спробуйте пізніше.
      </div>
    );
  }

  return <ProductsLayout initialData={data} />;
}
