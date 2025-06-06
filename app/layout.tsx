import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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

// ✅ エラー回避：props に型を指定して children を確実に受け取る
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`background-image ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="overlay" />
        <div className="content">
          {children}
        </div>
      </body>
    </html>
  );
}
