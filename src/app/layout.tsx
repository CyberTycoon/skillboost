import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { UserPen } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./contexts/UserContext";
import { UIProvider } from "./contexts/UIContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AfroTask",
  description: "Built By Silas Okanlawon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <UserProvider>
        <UIProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Toaster position="top-center" reverseOrder={false} />
            <Navbar />
            {children}
            <Footer />
          </body>
        </UIProvider>
      </UserProvider>
    </html>
  );
}
