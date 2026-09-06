import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Hero from "./Sections/Hero";
import Services from "./Sections/Services";
import Stats from "./Sections/Stats";
import HowItWorks from "./Sections/HowItWorks";
import WhyChooseUs from "./Sections/WhyChooseUs";
import Testimony from "./Sections/Testimony";
import Footer from "./Sections/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gidrock Online Printing",
  description: "Get your printed Graphic works at your door step",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col px-5">
        <Nav/>
        <main className="bg-gradient-to-br from-green-500 via-green-100 to-green-400 border-2 rounded text-dark p-5">
          <Hero />
          <Services />
          <Stats />
          <HowItWorks />
          <WhyChooseUs />
          <Testimony />
          {children}</main> 
          <Footer />
        </body>
    </html>
  );
}
