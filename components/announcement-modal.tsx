"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Announcement } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const AnnouncementModal = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get("/api/announcements/active");
        if (response.data) {
          setAnnouncement(response.data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Error fetching announcement:", error);
      }
    };

    fetchAnnouncement();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!announcement || !isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Anuncio Importante</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <ReactMarkdown
          components={{
            div: ({ ...props }) => <div className="prose" {...props} />,
          }}
          remarkPlugins={[remarkGfm]}
        >
          {announcement.content}
        </ReactMarkdown>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cerrar
          </Button>
          {announcement.buttonVisible && announcement.buttonLink && (
            <Link href={announcement.buttonLink} passHref>
              <Button>{announcement.buttonText || "Ir"}</Button>
            </Link>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
