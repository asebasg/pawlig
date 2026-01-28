import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const announcement = await prisma.announcement.findFirst({
      where: {
        expiresAt: {
          gt: now,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!announcement) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("[ANNOUNCEMENT_ACTIVE_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
