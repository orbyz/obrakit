import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5"
      aria-label="ObraKit - Inicio"
    >
      <Image
        src="/images/brand/logo.png"
        alt=""
        width={38}
        height={38}
        className="h-9 w-9 object-cover"
        priority
      />

      <span className="text-xl font-semibold tracking-[-0.03em] text-white">
        ObraKit
      </span>
    </Link>
  );
};

export default Logo;
