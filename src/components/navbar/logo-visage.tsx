import VisageLogo from "@/images/visage-logo.png";
import Image from "next/image";

export default function NavbarLogoVisage() {
  return (
    <div className="flex gap-x-4 items-center">
      <Image
        className="h-14 w-14 rounded-lg"
        src={VisageLogo}
        alt="visage-logo"
      />
      <p className="font-semibold text-2xl tracking-[0.008rem]">Visage</p>
    </div>
  );
}
