import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Lost & Found FTE – Telkom University",
  description: "Sistem Informasi Lost and Found Fakultas Teknik Elektro Universitas Telkom",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={sans.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}