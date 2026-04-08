import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LayoutShell } from "@/components/LayoutShell";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Next Generation Learners — AI Literacy Programs for Students & Schools",
  description: "AI literacy programs for 4th-5th graders and AI integration for schools in Connecticut. Partnering with libraries and school districts in Danbury, Ridgefield, Easton, and Wooster School. Founded at Babson College.",
  keywords: ["AI literacy", "AI education", "next generation learners", "AI for students", "AI programs Connecticut", "Danbury AI", "Babson College", "education technology", "AI integration schools", "AI workshops kids"],
  authors: [{ name: "Brayan Tenesaca" }, { name: "Ryan Vincent" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Next Generation Learners — AI Literacy for the Next Generation",
    description: "AI literacy programs for students and AI systems for education leaders across Connecticut. Founded at Babson College.",
    url: "https://nextgenerationlearners.com",
    siteName: "Next Generation Learners",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Next Generation Learners",
    description: "AI literacy programs for students. AI systems for education leaders. Connecticut.",
  },
  metadataBase: new URL("https://nextgenerationlearners.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakarta.variable} antialiased bg-[#FAFBFF] text-[#1E1B4B]`}
        style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}
      >
        <LayoutShell>
          {children}
        </LayoutShell>
      </body>
    </html>
  );
}
