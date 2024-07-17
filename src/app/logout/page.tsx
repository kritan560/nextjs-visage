"use client";

import { LinkHomepage } from "@/links/links";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

const LogoutPage = () => {
  useEffect(() => {
    async function signoutUser() {
      await signOut({ callbackUrl: LinkHomepage, redirect: true });
    }
    signoutUser();
  }, []);

  return <></>;
};

export default LogoutPage;
