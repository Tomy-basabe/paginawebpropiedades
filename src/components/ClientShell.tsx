"use client";

import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppFloat from "./WhatsAppFloat";
import ValuationModal from "./ValuationModal";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [isValuationOpen, setIsValuationOpen] = useState(false);

  return (
    <>
      <Header onOpenValuation={() => setIsValuationOpen(true)} />
      <main className="min-h-screen pt-20">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <ValuationModal
        isOpen={isValuationOpen}
        onClose={() => setIsValuationOpen(false)}
      />
    </>
  );
}
