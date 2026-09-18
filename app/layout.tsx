import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SavedLeadsProvider } from "@/lib/savedLeads";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LeadScraper — Find Business Leads at Scale",
  description:
    "Discover and score 200–500+ business leads using Google Maps. Scored, segmented, and ready to pitch — in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakartaSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <SavedLeadsProvider>{children}</SavedLeadsProvider>
      </body>
    </html>
  );
}
