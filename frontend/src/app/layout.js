import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from '@/store/provider';
// import  {Toaster}  from "@/components/ui/sonner";
import ClientOnlyToaster from "@/components/actions/Toast"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "WELCOME TO BLUEPRINT!",
  description: "All in One Application for project management.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Providers>
      <ClientOnlyToaster position="top-right" />
                  {/* // <Toaster position="top-right" richColors closeButton/>  */}

             {children}
         
       
        </Providers>
      </body>
    </html>
  );
}
