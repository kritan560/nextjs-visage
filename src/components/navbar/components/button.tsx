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
        className="capitalize"
        variant={"visage"}
        size={"visage"}>
        {buttonName}
      </Button>
    </Link>
  );
}
