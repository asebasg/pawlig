"use client";

import { Announcement } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AnnouncementListProps {
  announcements: Announcement[];
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: string) => void;
}

export const AnnouncementList = ({
  announcements,
  onEdit,
  onDelete,
}: AnnouncementListProps) => {
  return (
    <div className="mt-6 space-y-4">
      {announcements.map((announcement) => (
        <Card key={announcement.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Anuncio</span>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(announcement)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(announcement.id)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Expira el: {new Date(announcement.expiresAt).toLocaleDateString()}
            </p>
            <div className="mt-4">
              <p className="font-bold">Contenido:</p>
              <ReactMarkdown
                className="prose mt-2"
                remarkPlugins={[remarkGfm]}
              >
                {announcement.content}
              </ReactMarkdown>
            </div>
            {announcement.buttonVisible && (
              <div className="mt-4">
                <p className="font-bold">Botón:</p>
                <p>Texto: {announcement.buttonText}</p>
                <p>Enlace: {announcement.buttonLink}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
