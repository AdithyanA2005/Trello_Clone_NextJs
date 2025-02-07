"use client";

import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import useAction from "@/hooks/useAction";
import { useProModal } from "@/hooks/useProModal";
import { stripeRedirect } from "@/actions/stripe-redirect";
import { siteConfig } from "@/lib/config/site";

export function ProModal() {
  const { isOpen, onClose } = useProModal();

  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onClick = async () => {
    await execute({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        <div className="relative flex aspect-video items-center justify-center">
          <Image src="/hero.svg" alt="hero" className="object-cover" fill />
        </div>
        <div className="mx-auto space-y-6 p-6 text-neutral-700">
          <DialogTitle className="text-xl font-semibold">Upgrade to {siteConfig.name} Pro Today!</DialogTitle>

          <div className="space-y-2">
            <DialogDescription className="text-sm font-semibold text-neutral-600">
              Explore the best of {siteConfig.name}
            </DialogDescription>
            <ul className="list-disc pl-4 text-sm">
              <li>Unlimited Boards</li>
              <li>Advanced checklists</li>
              <li>Admin and Security features</li>
              <li>And more!</li>`
            </ul>
          </div>

          <Button onClick={onClick} disabled={isLoading} className="w-full" variant="primary">
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
