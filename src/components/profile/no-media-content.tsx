import { LinkHomepage } from "@/links/visage-links";
import Link from "next/link";
import { Button } from "../ui/button";

type NoMediaContentProps = {
  heading: string;
  message: string;
};

const NoMediaContent = (props: NoMediaContentProps) => {
  const { heading, message } = props;
  return (
    <div className="mx-auto w-[70%] rounded-2xl border-2 border-dashed border-stone-800 px-14 py-8 dark:border-stone-300">
      <h1 className="text-center text-3xl font-semibold text-stone-800 dark:text-stone-400">
        {heading}{" "}
      </h1>
      <p className="mt-4 text-lg font-semibold text-stone-800 dark:text-stone-400">
        {message}
      </p>

      <Link href={LinkHomepage}>
        <Button
          className="mx-auto mt-8 block"
          variant={"visage"}
          size={"visage"}
        >
          Get Inspired
        </Button>
      </Link>
    </div>
  );
};

export default NoMediaContent;
