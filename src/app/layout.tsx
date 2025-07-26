import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider"; // ✅ Import Client Component
import { GlobalStyles } from '../styles';
import StyledComponentsRegistry from "@/lib/StyledComponentsRegistry";
import { Toaster } from "react-hot-toast";
import I18nProvider from "@/providers/I18nProvider"; // ✅ Import new wrapper
import DarkModeProvider from "@/context/DarkModeContext";
import ProfileLoader from "@/components/ui/ProfileLoader";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Wild Oasis",
  description: "Hotel Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <script
      crossOrigin="anonymous"
      src="//unpkg.com/react-scan/dist/auto.global.js"
      async
    ></script>
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        > 
        <StyledComponentsRegistry>
          <GlobalStyles />
          <I18nProvider>
          <DarkModeProvider>
          <QueryProvider>
          <ProfileLoader>
          {children}
          </ProfileLoader>
          </QueryProvider>
          </DarkModeProvider>
          </I18nProvider>
        </StyledComponentsRegistry>
        <Toaster
                position="top-center"
                gutter={12}
                containerStyle={{ margin: "8px" }}
                toastOptions={{
                    success: {
                        duration: 3000,
                    },
                    error: {    
                        duration: 3000,
                    },
                    loading: {
                        duration: 3000,
                    },
                    style: {
                        fontSize: "16px",
                        maxWidth: "500px",
                        padding: "16px 24px",
                        backgroundColor: "var(--color-grey-table)",
                        color: "var(--color-grey-700)",
                        borderRadius: "30px",
                    },
                }}
            />
      </body>
    </html>
  );
}
