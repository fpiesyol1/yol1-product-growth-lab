import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./design-system.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "YOL1 Product Growth Lab — Prototipo exploratorio",
  description: "Experiencia de prueba con datos ficticios para explorar oportunidades financieras cotidianas. No conecta bancos ni mueve dinero.",
  openGraph: {
    title: "YOL1 Product Growth Lab",
    description: "Encuentra dónde pierdes plata o desaprovechas beneficios y decide qué hacer.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "YOL1 Product Growth Lab — prototipo exploratorio con datos sintéticos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "YOL1 Product Growth Lab",
    description: "Prototipo exploratorio con datos sintéticos.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/yol1-icon.png",
    shortcut: "/yol1-icon.png",
    apple: "/yol1-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="yol1-system-v2">{children}</body>
    </html>
  );
}
