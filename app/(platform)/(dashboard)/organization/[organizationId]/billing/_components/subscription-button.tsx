"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import useAction from "@/hooks/useAction";
import { useProModal } from "@/hooks/useProModal";
import { stripeRedirect } from "@/actions/stripe-redirect";

interface SubscriptionButtonProps {
  isPro: boolean;
}

export function SubscriptionButton({ isPro }: SubscriptionButtonProps) {
  const proModal = useProModal();

  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onClick = async () => {
    if (isPro) await execute({});
    else proModal.onOpen();
  };

  return (
    <Button disabled={isLoading} onClick={onClick} variant="primary">
      {isPro ? "Manage Subscription" : "Upgrade to Pro"}
    </Button>
  );
}
