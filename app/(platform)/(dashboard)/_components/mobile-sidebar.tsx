"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

export function MobileSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // When ever a nav-item is clicked the url changes
  // Whenever url changes close the sidebar
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button size="sm" variant="ghost" className="mr-2 block md:hidden">
            <MenuIcon className="size-4" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="p-2 pt-10">
          <Sidebar />
        </SheetContent>
      </Sheet>
    </>
  );
}
