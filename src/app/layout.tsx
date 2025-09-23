import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Liigassa - Football League",
  description: "Experience the ultimate football league with teams, players, and passion like never before. Liigassa Season 2 brings thrilling matches and unforgettable moments.",
  icons: {
    icon: [
      { url: "/Ligassalogopng.png", sizes: "32x32", type: "image/png" },
      { url: "/Ligassalogopng.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/Ligassalogopng.png",
    apple: "/Ligassalogopng.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
