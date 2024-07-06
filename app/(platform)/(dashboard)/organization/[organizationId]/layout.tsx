import React from "react";
import { auth } from "@clerk/nextjs/server";
import { startCase } from "lodash";
import { OrgControl } from "./_components/org-control";

export async function generateMetadata() {
  const { orgSlug } = auth();
  return {
    title: startCase(orgSlug || "Organization"),
  };
}

export default function OrganizationIdLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*When orgId in url change, this component will set that org as the activeOrg*/}
      <OrgControl />

      <main className="h-full w-full">{children}</main>
    </>
  );
}
