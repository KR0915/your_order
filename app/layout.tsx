// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/header";


// ローカルフォント設定
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// メタデータ
export const metadata: Metadata = {
  title: "your_order",
  description: "その日に食べたいものをおすすめ",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "icon", url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { rel: "icon", url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={`background-image ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="pt-10 relative">
          <div className="overlay fixed inset-0 bg-black opacity-20 pointer-events-none" />
          <div className="content relative z-10">{children}</div>
        </main>
      </body>
    </html>
  );
}
