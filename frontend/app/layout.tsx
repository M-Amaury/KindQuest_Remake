import type { Metadata } from "next";
<<<<<<< HEAD
import Navigation from "./components/Navigation";
=======
import Navigation from "@/components/Navigation";
>>>>>>> 33e616bb7a10880010ae1f9104db245c76fbcef7
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
<<<<<<< HEAD
        <Navigation />
=======
        <Navigation/>
>>>>>>> 33e616bb7a10880010ae1f9104db245c76fbcef7
        {children}
      </body>
    </html>
  );
}
