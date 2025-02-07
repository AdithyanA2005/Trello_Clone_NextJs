import React from "react";
import { Footer } from "./_components/footer";
import { Navbar } from "./_components/navbar";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full bg-slate-100">
      <Navbar />
      <main className="bg-stone-100 pb-20 pt-40">{children}</main>
      <Footer />
    </div>
  );
}
