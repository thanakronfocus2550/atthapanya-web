import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/components/CartProvider";
import { SiteDataProvider } from "@/components/SiteDataProvider";
import MetadataUpdater from "@/components/MetadataUpdater";
import AdminShortcut from "@/components/AdminShortcut";


const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "สถาบันกวดวิชาอรรถปัญญา | E-Learning Platform",
  description:
    "สถาบันกวดวิชาชั้นนำ มุ่งเน้นพัฒนาศักยภาพผู้เรียนสู่ความสำเร็จในการสอบ A-Level, TGAT และเตรียมเข้ามหาวิทยาลัย",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${kanit.variable} font-sans antialiased`}>
        <SiteDataProvider>
          <MetadataUpdater />
          <AdminShortcut />
          <ThemeProvider>
            <CartProvider>
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </CartProvider>
          </ThemeProvider>
        </SiteDataProvider>
      </body>
    </html>
  );
}
