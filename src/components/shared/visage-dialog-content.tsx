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
      <DialogClose className="absolute -right-2 translate-x-full">
        <IoIosCloseCircle
          size={40}
          className="fill-stone-100 dark:fill-stone-400"
        />
      </DialogClose>
    </DialogContent>
  );
};

export default VisageDialogContent;
