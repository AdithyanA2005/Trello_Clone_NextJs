"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";

export function OrgControl() {
  const { organizationId } = useParams();
  const { setActive } = useOrganizationList();

  // This will look for change in orgId in url and if any it wil set that org as the active org
  useEffect(() => {
    if (!setActive || !organizationId) return;
    setActive({ organization: organizationId as string });
  }, [setActive, organizationId]);

  return null;
}
