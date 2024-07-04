import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 flex h-14 w-full items-center border-b bg-white px-4 shadow-sm">
      {/*TODO: Mobile sidebar*/}
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>

        <div>
          {/*Desktop Create Button*/}
          <Button variant="primary" size="sm" className="hidden h-auto rounded-sm px-2 py-1.5 md:block">
            Create
          </Button>
          {/*Mobile Create Button*/}
          <Button variant="primary" size="sm" className="block rounded-sm md:hidden">
            <PlusIcon className="size-4" />
          </Button>
        </div>
      </div>

      <div className="ml-auto flex h-full items-center gap-x-2">
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/organization/:id"
          afterLeaveOrganizationUrl="/select-org"
          afterSelectOrganizationUrl="/organization/:id"
          appearance={{
            elements: {
              organizationPreviewAvatarBox: {
                height: 30,
                width: 30,
              },
              organizationSwitcherTriggerIcon: {
                marginLeft: 12,
              },
            },
          }}
        />
        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                height: 30,
                width: 30,
              },
            },
          }}
        />
      </div>
    </header>
  );
}
