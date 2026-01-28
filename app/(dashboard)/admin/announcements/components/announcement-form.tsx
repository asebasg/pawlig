"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Announcement } from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  content: z.string().min(1, { message: "El contenido es requerido" }),
  expiresAt: z.string().datetime({ message: "La fecha de expiración es requerida" }),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  buttonVisible: z.boolean().optional(),
});

type AnnouncementFormValues = z.infer<typeof formSchema>;

interface AnnouncementFormProps {
  initialData: Announcement | null;
  onClose: () => void;
  onSuccess: (announcement: Announcement) => void;
}

export const AnnouncementForm = ({
  initialData,
  onClose,
  onSuccess,
}: AnnouncementFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          expiresAt: new Date(initialData.expiresAt).toISOString().slice(0, 16),
        }
      : {
          content: "",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
          buttonText: "",
          buttonLink: "",
          buttonVisible: false,
        },
  });

  const onSubmit = async (data: AnnouncementFormValues) => {
    try {
      let response;
      if (initialData) {
        response = await axios.put(
          `/api/announcements/${initialData.id}`,
          data
        );
        toast.success("Anuncio actualizado correctamente");
      } else {
        response = await axios.post("/api/announcements", data);
        toast.success("Anuncio creado correctamente");
      }
      onSuccess(response.data);
    } catch (error) {
      toast.error("Error al guardar el anuncio");
    }
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="content">Contenido (Markdown)</Label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <textarea
                id="content"
                {...field}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            )}
          />
          {errors.content && (
            <p className="text-sm text-red-500">{errors.content.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="expiresAt">Fecha de expiración</Label>
          <Controller
            name="expiresAt"
            control={control}
            render={({ field }) => (
              <Input id="expiresAt" type="datetime-local" {...field} />
            )}
          />
          {errors.expiresAt && (
            <p className="text-sm text-red-500">{errors.expiresAt.message}</p>
          )}
        </div>
        <div>
          <Controller
            name="buttonVisible"
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="buttonVisible"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="buttonVisible">Mostrar botón personalizado</Label>
              </div>
            )}
          />
        </div>
        <div>
          <Label htmlFor="buttonText">Texto del botón</Label>
          <Controller
            name="buttonText"
            control={control}
            render={({ field }) => <Input id="buttonText" {...field} />}
          />
        </div>
        <div>
          <Label htmlFor="buttonLink">Enlace del botón</Label>
          <Controller
            name="buttonLink"
            control={control}
            render={({ field }) => <Input id="buttonLink" {...field} />}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </div>
  );
};
