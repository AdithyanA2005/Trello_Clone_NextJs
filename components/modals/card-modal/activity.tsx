"use client";

import { AuditLog } from "@prisma/client";
import { ActivityIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityItem } from "@/components/activity-item";

interface ActivityProps {
  logs: AuditLog[];
}

export function Activity({ logs }: ActivityProps) {
  return (
    <div className="flex w-full items-start gap-x-3">
      <ActivityIcon className="mt-0.5 size-5 text-neutral-700" />

      <div className="w-full">
        <p className="mb-2 font-semibold text-neutral-700">Activity</p>

        <ol className="mt-2 space-y-2">
          {logs.map((log) => (
            <ActivityItem key={log.id} data={log} />
          ))}
        </ol>
      </div>
    </div>
  );
}

Activity.Skeleton = function ActivitySkeleton() {
  return (
    <div className="flex w-full items-start gap-x-3">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="mb-2 h-6 w-24 bg-neutral-200" />
        <Skeleton className="h-10 w-full bg-neutral-200" />
      </div>
    </div>
  );
};
