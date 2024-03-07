import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

const IBMPlex = IBM_Plex_Sans({
   subsets: ["latin"],
   weight: ["400", "500", "600", "700"],
   variable: "--font-ibm",
   });

export const metadata: Metadata = {
  title: "Fantasy AI",
  description: "AI-powered image generator",
};

export function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      variables: {
        colorPrimary: "#624cf5"
      } as const
    }}>
      <html lang="en">
        <body className={cn(
          "bg-slate-50 dark:bg-slate-900 font-IBMPlex antialiased",
          IBMPlex.variable
        ) as string | undefined} >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
