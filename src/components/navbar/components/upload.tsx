import { LinkUploadPage } from "@/links/visage-links";
import Link from "next/link";
import React from "react";

const NavbarUpload = () => {
  return (
    <Link href={LinkUploadPage} className="px-0 text-base font-medium">
      Upload
    </Link>
  );
};

export default NavbarUpload;
