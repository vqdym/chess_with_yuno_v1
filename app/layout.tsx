import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";
import { Cinzel, Marck_Script, Philosopher, Pinyon_Script } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({ 
  subsets: ["latin"],
  variable: "--font-cinzel", 
});

const pinyon = Pinyon_Script({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pinyon", 
});

const philosopher = Philosopher({ 
  weight: "400",
  subsets: ["latin", 'cyrillic'],
  variable: "--font-philosopher", 
});

const marck_script = Marck_Script({
  weight: "400",
  subsets: ["cyrillic", 'latin'],
  variable: "--font-marckscript"
})

export const metadata: Metadata = {
  title: "Chess With Yuno",
  description: "Play chess with Yuno",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${cinzel.variable} ${pinyon.variable} ${philosopher.variable} ${marck_script.variable}`}>
      <body className="antialiased">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}

