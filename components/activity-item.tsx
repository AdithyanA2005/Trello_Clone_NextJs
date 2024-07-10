import { AuditLog } from "@prisma/client";
import { format } from "date-fns";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { generateLogMessage } from "@/lib/generate-log-message";

interface ActivityItemProps {
  data: AuditLog;
}
export function ActivityItem({ data }: ActivityItemProps) {
  return (
    <li className="flex items-center gap-x-2">
      <Avatar className="size-8">
        <AvatarImage src={data.userImage} alt={data.userName} />
      </Avatar>
      <div className="flex flex-col gap-y-0.5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold lowercase text-neutral-700">{data.userName}</span>
          &nbsp;
          {generateLogMessage(data)}
        </p>
        <p className="text-xs text-muted-foreground">{format(new Date(data.createdAt), "MMM d, yyy 'at' h:mm a")}</p>
      </div>
    </li>
  );
}
