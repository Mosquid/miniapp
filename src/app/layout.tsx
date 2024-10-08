import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import CurrentUserProvider from "../components/CurrentUserProvider";
import Navigation from "@/components/Navigation";

const montserrat = Montserrat({
  subsets: ["latin"],
  fallback: ["monospace"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <CurrentUserProvider>
        <body className={montserrat.className}>
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ flex: 1 }}>{children}</div>
            <Navigation />
          </div>
        </body>
      </CurrentUserProvider>
    </html>
  );
}
