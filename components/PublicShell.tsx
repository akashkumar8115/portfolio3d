"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  );
}
