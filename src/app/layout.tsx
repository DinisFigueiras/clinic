import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Centro de Tratamento de Sacavém",
  description: "Sistema de Gestão Clínica",
  icons: {
    icon: '/logoclinic.png',
    shortcut: '/logoclinic.png',
    apple: '/logoclinic.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={{
        locale: "pt-PT"
      }}
      signInUrl="/"
      signUpUrl="/"
      afterSignOutUrl="/"
    >
      <html lang="pt-PT">
      <head>
        <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />
      </head>
        <body className={inter.className}>{children}  <ToastContainer position="bottom-right" theme="dark"/> </body>
      </html>
    </ClerkProvider>
  );
}
