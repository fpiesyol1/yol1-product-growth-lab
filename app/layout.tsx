import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YOL1 Product Lab",
  description: "Laboratorio local para probar el piloto de YOL1.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
