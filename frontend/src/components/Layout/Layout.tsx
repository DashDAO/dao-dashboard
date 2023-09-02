import { ReactNode } from "react";
import { NavBar } from "./NavBar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export function Layout({ children }: { children?: ReactNode }) {
  return (
    <>
      <header className="py-2 border-b">
        <div className="container">
          <NavBar />
        </div>
      </header>
      <main className={`min-h-screen container py-24 ${inter.className}`}>
        {children}
      </main>
    </>
  );
}
