import LogoutClientComponent from "@/components/logout/logout-client-component";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "logout page",
};

const LogoutPage = () => {
  return <LogoutClientComponent />;
};

export default LogoutPage;
