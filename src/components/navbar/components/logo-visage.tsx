import VisageLogo from "@/images/visage-logo.png";
import { LinkHomepage } from "@/links/visage-links";
import Image from "next/image";
import Link from "next/link";

export default function NavbarLogoVisage() {
  return (
    <Link href={LinkHomepage} className="flex items-center gap-x-4">
      <Image
        className="h-14 w-14 rounded-lg"
        src={VisageLogo}
        alt="visage-logo"
      />
      <p className="text-2xl font-semibold tracking-[0.008rem]">Visage</p>
    </Link>
  );
}
