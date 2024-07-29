import React from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { DialogClose, DialogContent } from "../ui/dialog";

type VisageDialogContentProps = {
  children: React.ReactNode;
  className?: string;
};

const VisageDialogContent = (props: VisageDialogContentProps) => {
  const { children, className } = props;

  return (
    <DialogContent className={className}>
      {children}
      {/* visible in mobile */}
      <DialogClose className="absolute left-0 block -translate-y-full md:hidden">
        <IoIosCloseCircle
          size={40}
          className="fill-stone-100 dark:fill-stone-400"
        />
      </DialogClose>

      {/* visible in laptop */}
      <DialogClose className="absolute -right-2 top-0 hidden translate-x-full md:block">
        <IoIosCloseCircle
          size={40}
          className="fill-stone-100 dark:fill-stone-400"
        />
      </DialogClose>
    </DialogContent>
  );
};

export default VisageDialogContent;
