import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityItem } from "@/components/activity-item";
import { prisma } from "@/lib/db";

export async function ActivityList() {
  const { orgId } = auth();
  if (!orgId) redirect("/select-org");

  const auditLogs = await prisma.auditLog.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <ol className="mt-4 space-y-4">
      <p className="hidden text-center text-xs text-muted-foreground last:block">
        No activity found inside this organization
      </p>
      {auditLogs.map((log) => (
        <ActivityItem data={log} key={log.id} />
      ))}
    </ol>
  );
}

ActivityList.Skeleton = function ActivityListSkeleton() {
  return (
    <ol className="mt-4 space-y-4">
      <Skeleton className="h-14 w-[80%]" />
      <Skeleton className="h-14 w-[50%]" />
      <Skeleton className="h-14 w-[70%]" />
      <Skeleton className="h-14 w-[80%]" />
      <Skeleton className="h-14 w-[75%]" />
    </ol>
  );
};
