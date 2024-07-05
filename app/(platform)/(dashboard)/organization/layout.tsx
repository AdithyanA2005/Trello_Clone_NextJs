import React from "react";
import { Sidebar } from "../_components/sidebar";

export default function OrganizationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-20 md:pt-24 2xl:max-w-screen-xl">
      <div className="flex gap-x-7">
        <div className="hidden w-64 shrink-0 lg:block">
          <Sidebar />
        </div>

        {children}
      </div>
    </div>
  );
}
