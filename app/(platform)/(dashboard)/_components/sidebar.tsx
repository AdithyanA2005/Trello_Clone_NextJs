"use client";

import Link from "next/link";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { PlusIcon } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { NavItem, Organization } from "./nav-item";

export function Sidebar() {
  const [expanded, setExpanded] = useLocalStorage<Record<string, boolean>>("at-sidebar-state", {});
  const { organization: activeOrg, isLoaded: isOrgLoaded } = useOrganization();
  const { userMemberships, isLoaded: isOrgListLoaded } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const isLoading = !isOrgLoaded || !isOrgListLoaded || userMemberships.isLoading;

  // Array of expanded accordion items
  const defaultAccordionValue: string[] = Object.keys(expanded).reduce((acc: string[], key: string) => {
    if (expanded[key]) acc.push(key);
    return acc;
  }, []);

  // Toggle the accordion item with a specific id
  const toggleAccordionItem = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !expanded[id] }));
  };

  if (isLoading) return <Sidebar.Skeleton />;

  return (
    <aside>
      <section aria-labelledby="workspaces-header">
        <div className="flex h-[40px] items-center text-gray-800">
          <h2 id="workspaces-header" className="pl-4 text-xs font-semibold">
            Workspaces
          </h2>
          <Button asChild size="icon" type="button" variant="ghost" className="ml-auto size-8">
            <Link href="/select-org">
              <PlusIcon className="size-4" />
            </Link>
          </Button>
        </div>

        <Accordion type="multiple" defaultValue={defaultAccordionValue} className="space-y-2">
          <nav>
            {userMemberships.data?.map(({ organization }) => (
              <NavItem
                key={organization.id}
                isActive={activeOrg?.id === organization.id}
                isExpanded={expanded[organization.id]}
                organization={organization as Organization}
                onExpand={toggleAccordionItem}
              />
            ))}
          </nav>
        </Accordion>
      </section>
    </aside>
  );
}

Sidebar.Skeleton = function SidebarSkeleton() {
  return (
    <aside>
      <div className="flex h-[40px] items-center">
        <Skeleton className="ml-4 h-6 w-[50%]" />
        <Skeleton className="ml-auto size-8" />
      </div>

      <div className="space-y-2">
        <NavItem.Skeleton />
        <NavItem.Skeleton />
        <NavItem.Skeleton />
      </div>
    </aside>
  );
};
