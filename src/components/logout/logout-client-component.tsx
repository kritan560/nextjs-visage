"use client";

import { LinkHomepage } from "@/links/visage-links";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

const LogoutClientComponent = () => {
  useEffect(() => {
    async function signoutUser() {
      await signOut({ callbackUrl: LinkHomepage, redirect: true });
    }
    signoutUser();
  }, []);

  return <></>;
};

export default LogoutClientComponent;
