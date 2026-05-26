import { Suspense } from "react";
import { ShelterModerationClient } from "./shelter-moderation-client";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Moderación de Albergues",
  description: "Revisa y gestiona las solicitudes de albergues",
};

export default function ShelterModerationPage() {
  return (
    <div className="p-6">
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <ShelterModerationClient />
      </Suspense>
    </div>
  );
}
