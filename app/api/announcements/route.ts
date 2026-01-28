import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const createAnnouncementSchema = z.object({
  content: z.string().min(1, { message: "El contenido es requerido" }),
  expiresAt: z.string().datetime({ message: "La fecha de expiración es requerida" }),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  buttonVisible: z.boolean().optional(),
});

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
