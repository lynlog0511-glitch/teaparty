import type { Metadata } from "next";
import { ResetButton } from "@/components/shared/ResetButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tea Party | 행운의 티파티",
  description: "당신에게 행운을 전하는 모찌 토끼",
};

function BackgroundPattern() {
  return (
    <div
      className="fixed inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(#5D4037 1px, transparent 1px), linear-gradient(90deg, #5D4037 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    />
  );
}

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
        <main className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500 bg-[#FFFDF5] relative overflow-hidden">
          <BackgroundPattern />
          <ResetButton />
          {children}
        </main>
      </body>
    </html>
  );
}
