"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/useCardModal";

export function CardModal() {
  const { id, isOpen, onClose } = useCardModal();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>Dialog Content</DialogContent>
    </Dialog>
  );
}
