import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kind Quest",
  description: "Incentivize your community to complete missions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
