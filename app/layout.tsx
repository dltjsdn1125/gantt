import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Material Symbols Rounded font
const materialSymbols = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-material",
  weight: ["400"],
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-plus-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "간트차트 협업 플랫폼",
  description: "부서 간 프로젝트를 실시간으로 관리하는 간트차트 기반 협업 도구",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={plusJakarta.variable}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-display antialiased`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
