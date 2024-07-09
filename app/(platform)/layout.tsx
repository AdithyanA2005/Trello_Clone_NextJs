import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";

export default function PlatFormLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      {children}
      <Toaster />
      <QueryProvider>
        {children}
        <Toaster />
      </QueryProvider>
    </ClerkProvider>
  );
}
