import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import CartSidebar from "@/components/CartSidebar";
import { Toaster } from "react-hot-toast";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Genial Stoffa | Bespoke Men's Suits",
  description: "Premium bespoke men's suit factory delivering luxury, minimalist design and perfect fit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${cormorant.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-[#111111]" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            {children}
            <CartSidebar />
          </CartProvider>
        </AuthProvider>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111111',
              color: '#fff',
              borderRadius: '2px',
              border: '1px solid #333',
              fontSize: '12px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            },
            success: {
              iconTheme: {
                primary: '#fff',
                secondary: '#111111',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
