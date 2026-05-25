import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Grady — Your grades, your goals.",
  description:
    "Gestisci voti, verifiche e obiettivi scolastici con l'aiuto dell'AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${jakarta.variable} antialiased`}>{children}</body>
    </html>
  );
}
