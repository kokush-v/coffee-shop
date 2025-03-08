"use client";

import { ProductCard } from "@/src/features/products/components/product-card";

import { PaginatedResponse } from "@/src/types/paginated-api-response";
import { Product } from "@/src/features/products/types/product";
import { useProductsAPI } from "@/src/features/products/api/use-products-api";
import { useMemo } from "react";
import { Button } from "@/src/components/ui/button";
import { RotateCcw } from "lucide-react";

export const ProductsLayout = ({ initialData }: { initialData: PaginatedResponse<Product[]> }) => {
	const { data, fetchNextPage, hasNextPage } = useProductsAPI(initialData);

	const products = useMemo(() => {
		return data.pages.flatMap((products) => {
			return products?.results?.map((product) => ({
				...product,
				price: Math.round(product.price),
				product_weight: Math.round(product.product_weight),
			}));
		});
	}, [data]);

	return (
		<>
			<div className="px-2 mx-auto grid gap-4 grid-cols-1 min-[500px]:grid-cols-2 min-[710px]:grid-cols-3 my-4 max-w-[880px] items-start">
				{products ? (
					products.map((product, index) => <ProductCard key={index} product={product as Product} />)
				) : (
					<div className="text-center">Немає товарів</div>
				)}
			</div>
			<Button
				disabled={!hasNextPage}
				onClick={() => fetchNextPage()}
				variant="ghost"
				size="sm"
				className="text-xs mt-2 mx-auto mb-3">
				<RotateCcw />
				{hasNextPage ? "Завантажити ще" : "Ви дійшли до кінця"}
			</Button>
		</>
	);
};
