import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ListContainer } from "./_components/list-container";

interface BoardIdPageProps {
  params: {
    boardId: string;
  };
}

export default async function BoardIdPage({ params }: BoardIdPageProps) {
  const { orgId } = auth();
  if (!orgId) redirect("/select-org");

  return (
    <div className="h-full overflow-x-auto p-4">
      <ListContainer />
    </div>
  );
}
