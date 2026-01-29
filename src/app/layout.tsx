import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tea Party | 행운의 티파티",
  description: "당신에게 행운을 전하는 모찌 토끼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Gaegu:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-[Gaegu]">
        {children}
      </body>
    </html>
  );
}
