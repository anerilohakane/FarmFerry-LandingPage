import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header"
import Footer from "./components/Footer";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // improves font loading performance
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: {
    default: "FarmFerry - Fresh Farm Products Delivered to Your Doorstep",
    template: "%s | FarmFerry" // This will add FarmFerry suffix to child page titles
  },
  description: "Order fresh fruits, vegetables, dairy and farm products online. Farm-to-home delivery with best quality and prices across India.",
  keywords: ["fresh vegetables", "organic fruits", "farm delivery", "dairy products", "online grocery", "farm to home"],
  metadataBase: new URL('https://www.farmferry.in'), // Required for OG tags
  alternates: {
    canonical: '/', // Helps prevent duplicate content issues
  },
  openGraph: {
    title: "FarmFerry - Fresh Farm Products Delivered",
    description: "Order fresh farm products online with doorstep delivery across India.",
    url: "https://www.farmferry.in",
    siteName: "FarmFerry",
    images: [
      {
        url: '/og-image.jpg', // Recommended size: 1200x630
        width: 1200,
        height: 630,
        alt: 'FarmFerry - Fresh Farm Products',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "FarmFerry - Fresh Farm Products Delivered",
    description: "Order fresh farm products online with doorstep delivery across India.",
    images: ['/twitter-image.jpg'], // Recommended size: 1200x628
  },
  verification: {
    google: '4MCdnp-K0Pb77w3z6a-TLdQ6X1qpeFC83IuBXj98RRE', // For Google Search Console
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <Header/>
            {children}
            <Footer/>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}