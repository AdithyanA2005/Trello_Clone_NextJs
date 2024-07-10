import { AuditLog } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Actions } from "@/components/modals/card-modal/actions";
import { Activity } from "@/components/modals/card-modal/activity";
import { Description } from "@/components/modals/card-modal/description";
import { useCardModal } from "@/hooks/useCardModal";
import { fetcher } from "@/lib/helpers/fetcher";
import { CardWithList } from "@/types";
import { Header } from "./header";

export function CardModal() {
  const { id, isOpen, onClose } = useCardModal();
  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ["card", id],
    queryFn: () => fetcher(`/api/cards/${id}`),
  });
  const { data: auditLogsData } = useQuery<AuditLog[]>({
    queryKey: ["card-logs", id],
    queryFn: () => fetcher(`/api/cards/${id}/audit-logs`),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}

        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!cardData ? <Description.Skeleton /> : <Description data={cardData} />}
              {!auditLogsData ? <Activity.Skeleton /> : <Activity logs={auditLogsData} />}
            </div>
          </div>

          {!cardData ? <Actions.Skeleton /> : <Actions data={cardData} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
