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
