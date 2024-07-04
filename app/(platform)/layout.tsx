import React from "react";
import { ClerkProvider } from "@clerk/nextjs";

export default function PlatFormLayout({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
