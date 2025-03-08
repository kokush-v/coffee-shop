"use client";

import { cn } from "@/src/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image, { ImageProps } from "next/image";

import { useState } from "react";

type Props = ImageProps & {
  alt: string;
  className?: string;
};

export const AnimateImage = ({ alt, className, ...props }: Props) => {
  const [isLoaded, setLoaded] = useState(false);
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        onLoad={() => setLoaded(true)}
        className={cn("flex-1 bg-zinc-100 object-cover z-10", className)}
        alt={alt}
        {...props}
      />
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            exit={{ opacity: 0 }}
            className="absolute flex-1 bg-zinc-100 w-full h-full z-[900] top-0 left-0"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
