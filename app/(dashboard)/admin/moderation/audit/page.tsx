import { Suspense } from "react";
import { AuditLogViewer } from "./audit-log-viewer";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Auditoría de Moderación",
  description: "Registro de auditoría de las acciones de moderación de albergues y negocios",
};

export default function AuditModerationPage() {
  return (
    <div className="p-6">
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <AuditLogViewer />
      </Suspense>
    </div>
  );
}
