import type { Metadata } from "next";
import { Onest, Manrope } from "next/font/google";
import "./globals.css";

const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-onest",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RG Mazon — Full-Stack Developer",
  description: "Full-stack developer crafting fast, functional digital experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${onest.variable} ${manrope.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}