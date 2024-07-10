import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { checkSubscription } from "@/lib/subscription";
import { ActivityList } from "@/app/(platform)/(dashboard)/organization/[organizationId]/activity/_components/activity-list";
import { Info } from "../_components/info";

export default async function ActivityPage() {
  const isPro = await checkSubscription();

  return (
    <div className="w-full">
      <Info isPro={isPro} />

      <Separator className="my-2" />
      <Suspense fallback={<ActivityList.Skeleton />}>
        <ActivityList />
      </Suspense>
    </div>
  );
}
