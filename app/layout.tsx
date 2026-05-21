import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Germplasm Request Portal",
  description: "Search germplasm entries and submit research requests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
