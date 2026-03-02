import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
//importando el proveedor que acabamos de crear
import ProveedorRedux from "@/src/redux/ProveedorRedux";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mis Habitos",
  description: "App para control de habitos semanales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* envolvemos todo aqui para que redux funcione en todas las paginas */}
        <ProveedorRedux>
          {children}
        </ProveedorRedux>
      </body>
    </html>
  );
}