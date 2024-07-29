import VisageLogo from "@/images/visage-logo.png";
import { LinkHomepage } from "@/links/visage-links";
import Image from "next/image";
import Link from "next/link";

export default function NavbarLogoVisage() {
  return (
    <Link href={LinkHomepage} className="flex items-center gap-x-4">
      <div className="relative h-10 w-10 md:h-14 md:w-14">
        <Image
          className="rounded-lg"
          src={VisageLogo}
          alt="visage-logo"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <span className="hidden text-2xl font-semibold tracking-[0.008rem] md:block">
        Visage{" "}
      </span>
    </Link>
  );
}
