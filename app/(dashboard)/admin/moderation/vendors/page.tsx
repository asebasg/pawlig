import { Suspense } from "react";
import { VendorModerationClient } from "./vendor-moderation-client";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Moderación de Negocios",
  description: "Revisa y gestiona las solicitudes de negocios y vendedores",
};

export default function VendorModerationPage() {
  return (
    <div className="p-6">
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <VendorModerationClient />
      </Suspense>
    </div>
  );
}
