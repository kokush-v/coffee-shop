import { cn } from "@/src/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

interface TypographyProps
  extends React.ButtonHTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof typographyVariants> {}

const typographyVariants = cva("text-black", {
  variants: {
    variant: {
      h1: "text-black text-4xl font-bold",
      h2: "text-zinc-800 text-2xl font-bold",
      h3: "text-zinc-800 text-lg font-bold",
      h4: "text-zinc-700 text-base font-semibold",
      p: "text-base",
    },
  },
  defaultVariants: {
    variant: "p",
  },
});

export const Typography = ({ variant, className, ...props }: TypographyProps) => {
  const Component = variant || "p";

  return (
    <Component className={cn(typographyVariants({ variant, className }))} {...props} />
  );
};
