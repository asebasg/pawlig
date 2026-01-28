import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const updateAnnouncementSchema = z.object({
  content: z.string().min(1, { message: "El contenido es requerido" }).optional(),
  expiresAt: z.string().datetime({ message: "La fecha de expiración es requerida" }).optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  buttonVisible: z.boolean().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { announcementId: string } }
) {
  try {
    const { announcementId } = params;

    if (!announcementId) {
      return new NextResponse("Announcement ID is required", { status: 400 });
    }

    const announcement = await prisma.announcement.findUnique({
      where: {
        id: announcementId,
      },
    });

    if (!announcement) {
      return new NextResponse("Announcement not found", { status: 404 });
    }

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("[ANNOUNCEMENT_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { announcementId: string } }
) {
  try {
    const { announcementId } = params;
    const body = await req.json();
    const validation = updateAnnouncementSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(validation.error.message, { status: 400 });
    }

    if (!announcementId) {
      return new NextResponse("Announcement ID is required", { status: 400 });
    }

    const { content, expiresAt, buttonText, buttonLink, buttonVisible } = validation.data;

    const announcement = await prisma.announcement.update({
      where: {
        id: announcementId,
      },
      data: {
        content,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        buttonText,
        buttonLink,
        buttonVisible,
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("[ANNOUNCEMENT_PUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { announcementId: string } }
) {
  try {
    const { announcementId } = params;

    if (!announcementId) {
      return new NextResponse("Announcement ID is required", { status: 400 });
    }

    await prisma.announcement.delete({
      where: {
        id: announcementId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ANNOUNCEMENT_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
