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
      <main
        className={`flex min-h-screen container flex-col items-center justify-between py-24 ${inter.className}`}
      >
        {children}
      </main>
    </>
  );
}
