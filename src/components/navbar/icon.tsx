import { LinkHomepage } from "@/links/links";
import { Link } from "next-view-transitions";
import LogoVisage from "./logo-visage";

export function NavbarIcon() {
  return (
    <Link href={LinkHomepage}>
      <LogoVisage />
    </Link>
  );
}
