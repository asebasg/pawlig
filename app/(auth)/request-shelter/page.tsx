import { ShelterRequestForm } from '@/components/forms/shelter-request-form';

export default function RequestShelterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Solicitud de Cuenta para Albergue
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Completa este formulario para solicitar tu cuenta especializada como representante de un albergue o entidad de rescate en el Valle de Aburrá
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-left max-w-2xl mx-auto rounded">
            <p className="text-blue-900">
              <strong>Importante:</strong> Todos los campos marcados con <span className="text-red-600">*</span> son obligatorios. Tu solicitud será revisada por el administrador del sistema y recibirás una notificación sobre su estado.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <ShelterRequestForm />
        </div>

        {/* Footer Info */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">¿Qué ocurre después?</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-sm font-semibold mr-3 flex-shrink-0">
                  1
                </span>
                <span>Tu solicitud quedará en estado "Pendiente de aprobación"</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-sm font-semibold mr-3 flex-shrink-0">
                  2
                </span>
                <span>El administrador del sistema revisará tu solicitud</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-sm font-semibold mr-3 flex-shrink-0">
                  3
                </span>
                <span>Recibirás una notificación vía email sobre el resultado</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-sm font-semibold mr-3 flex-shrink-0">
                  4
                </span>
                <span>Una vez aprobada, podrás publicar mascotas y gestionar solicitudes de adopción</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
