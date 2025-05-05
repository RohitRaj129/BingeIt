import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import { Poppins } from "next/font/google";
import "./globals.css";
// import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProviders";
import { GlobalDrawerProvider } from "@/contexts/GlobalDrawerContext";
import GlobalDrawer from "@/components/GlobalDrawer";
// import FooterSection from "@/components/Footer";
import { ProfileProvider } from "@/contexts/ProfileContext";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "BingeIt",
  description: "Your Favorite Streaming and Booking Platform",
  icons: {
    icon: [
      { url: "/bingeit_logo.svg" },
      { url: "/bingeit_logo.svg", sizes: "32x32", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/bingeit_logo.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} font-sans bg-slate-50 dark:bg-[#0c0e1a] min-h-screen`}
        suppressHydrationWarning
      >
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <GlobalDrawerProvider>
                <div className="flex flex-col min-h-screen">
                  {/* <Header /> */}
                  <ProfileProvider>
                    <main className="flex-1">{children}</main>
                  </ProfileProvider>
                  <GlobalDrawer />
                  {/* <FooterSection /> */}
                </div>
              </GlobalDrawerProvider>
            </ThemeProvider>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
