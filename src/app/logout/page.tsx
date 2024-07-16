"use client";

import { LinkHomepage } from "@/links/links";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    async function signOutUser() {
      await signOut({ redirect: true, callbackUrl: LinkHomepage });
    }
    signOutUser();
  }, []);
}
