import type { Metadata } from "next";
import { Mona_Sans, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InterviewAce",
  description: "AI powered mock interview.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${monaSans.variable} ${roboto.variable} antialiased pattern`}
      >
        {children}

        <Toaster />
      </body>
    </html>
  );
}
