import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://greatinco.com"),

  title: {
    default: "Greatinco | Credit Management & Asset Servicing",
    template: "%s | Greatinco",
  },

  description:
    "Integrated credit management, servicing, recovery and portfolio solutions for financial institutions.",

  icons: {
    icon: [
      {
        url: "/favicon/favicon.ico",
      },
      {
        url: "/favicon/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
