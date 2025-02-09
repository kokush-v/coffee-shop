import { ProductCard } from "@/src/features/products/components/product-card";

export const ProductsLayout = () => {
  return (
    <div className="px-2 mx-auto grid gap-4 grid-cols-1 min-[500px]:grid-cols-2 min-[710px]:grid-cols-3 my-4 max-w-[880px]">
      {Array.from({ length: 20 }).map((_, index) => (
        <ProductCard
          key={index}
          product={{
            id: index,
            title: "Very Detailed And Long Product Title",
            description:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            price: Math.floor(Math.random() * 500),
            image_src: "",
            product_weight: Math.floor(Math.random() * 2000),
          }}
        />
      ))}
    </div>
  );
};
