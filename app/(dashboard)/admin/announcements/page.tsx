"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Announcement } from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";

import { AnnouncementList } from "./components/announcement-list";
import { AnnouncementForm } from "./components/announcement-form";

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get("/api/announcements");
        setAnnouncements(response.data);
      } catch (error) {
        toast.error("Error al cargar los anuncios");
      }
    };

    fetchAnnouncements();
  }, []);

  const handleCreate = () => {
    setEditingAnnouncement(null);
    setIsFormOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/announcements/${id}`);
      setAnnouncements(announcements.filter((a) => a.id !== id));
      toast.success("Anuncio eliminado correctamente");
    } catch (error) {
      toast.error("Error al eliminar el anuncio");
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingAnnouncement(null);
  };

  const handleFormSuccess = (announcement: Announcement) => {
    if (editingAnnouncement) {
      setAnnouncements(
        announcements.map((a) => (a.id === announcement.id ? announcement : a))
      );
    } else {
      setAnnouncements([...announcements, announcement]);
    }
    setIsFormOpen(false);
    setEditingAnnouncement(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Anuncios</h1>
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Anuncio
        </Button>
      </div>
      {isFormOpen ? (
        <AnnouncementForm
          initialData={editingAnnouncement}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      ) : (
        <AnnouncementList
          announcements={announcements}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AnnouncementsPage;
