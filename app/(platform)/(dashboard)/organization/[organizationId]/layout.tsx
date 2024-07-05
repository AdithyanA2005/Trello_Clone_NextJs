import React from "react";
import { OrgControl } from "./_components/org-control";

export default function OrganizationIdLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*When orgId in url change, this component will set that org as the activeOrg*/}
      <OrgControl />

      <main className="h-full w-full">{children}</main>
    </>
  );
}
