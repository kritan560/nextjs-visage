import Link from "next/link";
import { Button } from "../../ui/button";

type NavbarButtonProps = {
  buttonName: string;
  href: string;
};

export function NavbarButton(props: NavbarButtonProps) {
  const { buttonName, href } = props;

  return (
    <Link href={href}>
      <Button
        className="h-10 capitalize md:h-14"
        variant={"visage"}
        size={"visage"}
      >
        {buttonName}
      </Button>
    </Link>
  );
}
