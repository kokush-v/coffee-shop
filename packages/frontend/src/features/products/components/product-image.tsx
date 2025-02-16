import Image from "next/image";

import { useContext, useState } from "react";
import { ProductContext } from "@/src/features/products/context/product-context";

import { Typography } from "@/src/components/ui/typography";
import { AnimatePresence, motion } from "framer-motion";

export const ProductImage = () => {
  const product = useContext(ProductContext);

  const [isLoaded, setLoaded] = useState(false);

  if (!product) return null;

  return (
    <div className="rounded-lg overflow-hidden mb-1 flex relative w-full h-[200px]">
      <Typography className="bg-white p-2 py-1 text-xs font-medium text-zinc-700 absolute top-2 right-2 rounded-lg">
        {product.product_weight} г.
      </Typography>
      <Image
        onLoad={() => setLoaded(true)}
        src={product.image_src}
        alt={product.title}
        width={300}
        height={400}
        className="flex-1 bg-zinc-100 object-cover"
      />
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            exit={{ opacity: 0 }}
            className="absolute flex-1 bg-zinc-100 z-[900] w-full h-full"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
