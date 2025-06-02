import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { error } from "console";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clinic",
  description: "Next.js Clinic Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
    localization={{
      locale: "pt-PT"}}>
      <html lang="pt-PT">
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
        <body className={inter.className}>{children}  <ToastContainer position="bottom-right" theme="dark"/> </body>
      </html>
    </ClerkProvider>
  );
}
