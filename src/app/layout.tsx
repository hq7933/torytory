import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "토리토리 — 수제 쿠키 & 디저트",
  description: "두바이 쫀득쿠키, 황치즈 보또 등 정성껏 만든 수제 베이커리",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
