import { ThemeProvider } from "@/components/theme-provider";
import VisageScrollArea from "@/components/visage/visage-scroll-area";
import VisageLogo from "@/images/visage-logo.png";
import { cn } from "@/lib/utils";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const plus_Jakarta_sans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { template: "%s | Visage", default: "Visage" },
  description: "",
  icons: { icon: { url: VisageLogo.src } },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={cn(plus_Jakarta_sans.className, "")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader
            color="rgb(197 129 50)"
            crawlSpeed={600}
            speed={400}
            showSpinner={false}
            height={4}
          />

          <Toaster />

          <VisageScrollArea>
            <MantineProvider>{children}</MantineProvider>
          </VisageScrollArea>
        </ThemeProvider>
      </body>
    </html>
  );
}
