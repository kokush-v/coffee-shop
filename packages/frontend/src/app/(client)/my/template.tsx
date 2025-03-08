"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.main
      transition={{
        type: "tween",
        duration: 0.2,
      }}
      key={pathname}
      initial={{
        opacity: 0,
        x: -15,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: 15,
      }}
      className="flex-1 layout-spacing-rule py-4 flex flex-col"
    >
      {children}
    </motion.main>
  );
}
