import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/database/prisma";

/**
 * GET handler for fetching card details by ID.
 * - Authenticates user.
 * - Fetches card details if user is authorized.
 * - Returns card details or error response.
 */
export async function GET(req: Request, { params }: { params: { cardId: string } }) {
  try {
    // Authenticate user.
    const { userId, orgId } = auth();
    if (!userId || !orgId) return new NextResponse("Unauthorized", { status: 401 });

    // Fetch card details.
    const card = await prisma.card.findUnique({
      where: {
        id: params.cardId,
        list: { board: { orgId } },
      },
      include: {
        list: {
          select: {
            title: true,
          },
        },
      },
    });
    return NextResponse.json(card);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
