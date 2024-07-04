import React from "react";

export default function ClerkLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex h-full items-center justify-center">{children}</main>;
}
