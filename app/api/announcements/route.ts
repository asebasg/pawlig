import { NextResponse } from "next/server";

import { prisma } from "@/lib/utils/db";
import { createAnnouncementSchema } from "@/lib/validations/announcement-validations";

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(announcements);
  } catch (error) {
    console.error("[ANNOUNCEMENTS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = createAnnouncementSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(validation.error.message, { status: 400 });
    }

    const { content, expiresAt, buttonText, buttonLink, buttonVisible } = validation.data;

    const announcement = await prisma.announcement.create({
      data: {
        content,
        expiresAt: new Date(expiresAt),
        buttonText,
        buttonLink,
        buttonVisible,
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("[ANNOUNCEMENTS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
