import { Metadata } from 'next';
import RegisterForm from '@/components/forms/register-form';

/**
 * Metadata para SEO y redes sociales
 */
export const metadata: Metadata = {
  title: 'Registro - PawLig',
  description: 'Crea tu cuenta en PawLig para adoptar mascotas de forma responsable en el Valle de Aburrá',
};

/**
 * Página de registro de nuevos usuarios adoptantes
 * Ruta: /register
 * Implementa HU-001: Registro de nuevo adoptante
 */
export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card contenedor */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <RegisterForm />
        </div>

        {/* Disclaimer legal */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Al registrarte, aceptas nuestros{' '}
          <a href="/terminos" className="text-purple-600 hover:underline">
            Términos de Servicio
          </a>{' '}
          y{' '}
          <a href="/privacidad" className="text-purple-600 hover:underline">
            Política de Privacidad
          </a>
        </p>
      </div>
    </div>
  );
}