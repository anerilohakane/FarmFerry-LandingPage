import { Quicksand, Cookie } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import Script from "next/script";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

const cookie = Cookie({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cookie",
  display: "swap",
});

export const metadata = {
  title: {
    default: "FarmFerry - Fresh Farm Products Delivered to Your Doorstep",
    template: "%s | FarmFerry",
  },
  description: "Order fresh fruits, vegetables, dairy and farm products online. Farm-to-home delivery with best quality and prices across India.",
  keywords: ["fresh vegetables", "organic fruits", "farm delivery", "dairy products", "online grocery", "farm to home"],
  metadataBase: new URL("https://www.farmferry.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FarmFerry - Fresh Farm Products Delivered",
    description: "Order fresh farm products online with doorstep delivery across India.",
    url: "https://www.farmferry.in",
    siteName: "FarmFerry",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FarmFerry - Fresh Farm Products",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FarmFerry - Fresh Farm Products Delivered",
    description: "Order fresh farm products online with doorstep delivery across India.",
    images: ["/twitter-image.jpg"],
  },
  verification: {
    google: "4MCdnp-K0Pb77w3z6a-TLdQ6X1qpeFC83IuBXj98RRE",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry&region=IN&language=en`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${quicksand.variable} ${cookie.variable} font-sans antialiased text-gray-800`}>
        <AuthProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}