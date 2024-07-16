import VisageLogo from "@/images/visage-logo.png";
import VisageScrollArea from "@/components/visage-scroll-area";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plus_Jakarta_sans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  icons: { icon: { url: VisageLogo.src } },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(plus_Jakarta_sans.className, "")}>
        <VisageScrollArea>{children}</VisageScrollArea>
      </body>
    </html>
  );
}
