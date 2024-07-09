import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";

export default function PlatFormLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <QueryProvider>
        {children}

        <ModalProvider />
        <Toaster />
      </QueryProvider>
    </ClerkProvider>
  );
}
