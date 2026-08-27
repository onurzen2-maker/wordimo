import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wordimo Akademi — Tüm Sınıflar İçin İngilizce Kelime Öğrenme ve Oyun Platformu",
  description: "Türkiye Yüzyılı Maarif Modeli uyumlu, her sınıf seviyesine ve genel İngilizceye uygun eğlenceli kelime oyunları ve interaktif içeriklerle kelimeleri kalıcı olarak öğrenin.",
  openGraph: {
    title: "Wordimo Akademi — Tüm Sınıflar İçin İngilizce Kelime Öğrenme ve Oyun Platformu",
    description: "Türkiye Yüzyılı Maarif Modeli uyumlu, her sınıf seviyesine ve genel İngilizceye uygun eğlenceli kelime oyunları ve interaktif içeriklerle kelimeleri kalıcı olarak öğrenin.",
    url: 'https://www.wordimoakademi.com',
    siteName: 'Wordimo Akademi',
    images: [
      {
        url: 'https://www.wordimoakademi.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
