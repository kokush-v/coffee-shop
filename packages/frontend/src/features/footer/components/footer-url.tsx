import Image from "next/image";

export const FooterSocialUrl = ({
  src,
  children,
}: {
  src: string;
  children: string;
}) => {
  return (
    <div className="footer-url hover:underline select-none cursor-pointer">
      <Image src={src} alt={children} width={20} height={20} />
      <p>{children}</p>
    </div>
  );
};
