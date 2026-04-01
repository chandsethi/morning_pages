import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Morning Pages",
  description:
    "Write 3 pages of stream-of-consciousness thoughts every morning. No editing, no deleting — just write.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full font-serif antialiased">{children}</body>
    </html>
  );
}
