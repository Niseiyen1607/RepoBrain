import "@/styles/globals.css";

import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { type Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans, Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "RepoBrain",
  description: "AI-powered GitHub repository analytics & automation",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(fontMono.variable, "font-sans", geist.variable)}
    >
      <body className="flex min-h-full flex-col">
        <ClerkProvider
          appearance={{
            variables: {
              fontFamily: "var(--font-sans)",
              fontFamilyMono: "var(--font-mono)",
              colorPrimary: "#3a64f2",
            },
            elements: {
              formButtonPrimary:
                "bg-[#3a64f2] hover:bg-[#5a3ae0] text-sm normal-case",
              card: "rounded-2xl",
              headerTitle: "text-slate-900",
              headerSubtitle: "text-slate-500",
            },
          }}
        >
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster richColors />
        </ClerkProvider>
      </body>
    </html>
  );
}
