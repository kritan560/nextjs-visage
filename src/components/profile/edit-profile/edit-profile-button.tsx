import React from "react";
import { Button } from "../../ui/button";
import { Edit } from "lucide-react";

type EditProfileButtonProps = {
  buttonName: string;
};

export default function EditProfileButton(props: EditProfileButtonProps) {
  const { buttonName } = props;

  return (
    <Button
      className="flex justify-center items-center gap-x-2 px-6 font-medium text-base capitalize h-14"
      variant={"visage"}>
      <Edit size={21} />
      {buttonName}
    </Button>
  );
}
