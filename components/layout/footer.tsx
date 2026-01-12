import Link from "next/link";
import {
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Link2,
  Album,
  FileUser,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { FOOTER_LINKS, CONTACT_INFO } from "@/lib/constants";

/**
 * Descripción: Componente de UI que renderiza el pie de página principal
 *              de la aplicación.
 * Requiere: Acceso a las constantes 'FOOTER_LINKS' y 'CONTACT_INFO' para
 *           poblar los datos de los enlaces y la información de contacto.
 * Implementa: Requisito de layout para una navegación secundaria y acceso a
 *             información legal y de contacto en todas las páginas.
 */

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: About PawLig */}
          <div>
            <Logo size="lg" variant="full" />
            <p className="mt-4 text-sm leading-relaxed">
              Promoviendo la adopción responsable de mascotas en el Valle de
              Aburrá. Conectamos albergues, adoptantes y proveedores para el
              bienestar animal.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <div className="flex items-start gap-2">
              <Link2 size={24} className="mt-0.5 flex-shrink-0" />
              <h3 className="font-bold text-white text-lg mb-4">
                Enlaces Rápidos
              </h3>
            </div>
            <ul className="space-y-2">
              {FOOTER_LINKS.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <div className="flex items-start gap-2">
              <Album size={24} className="mt-0.5 flex-shrink-0" />
              <h3 className="font-bold text-white text-lg mb-4">Recursos</h3>
            </div>
            <ul className="space-y-2">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <div className="flex items-start gap-2">
              <FileUser size={24} className="mt-0.5 flex-shrink-0" />
              <h3 className="font-bold text-white text-lg mb-4">Contacto</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail size={18} className="mt-0.5 flex-shrink-0" />
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={18} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">{CONTACT_INFO.address}</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-4">
              <p className="text-sm font-semibold text-white mb-2">
                Síguenos en nuestras redes
              </p>
              <div className="flex gap-3">
                {FOOTER_LINKS.social.map((social) => {
                  const Icon =
                    social.icon === "Instagram"
                      ? Instagram
                      : social.icon === "Facebook"
                      ? Facebook
                      : social.icon === "Twitter"
                      ? Twitter
                      : MessageCircle;

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-700 rounded-lg hover:bg-purple-600 transition-colors"
                      aria-label={social.label}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-900 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-300/50">
            <p>© {currentYear} PawLig. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente define la estructura y el contenido del pie de página global
 * de la aplicación. Es un componente estático que no gestiona estado, enfocado
 * únicamente en la presentación de información.
 *
 * Lógica Clave:
 * - 'Datos centralizados': La información de los enlaces y los datos de contacto
 *   no están codificados directamente en el componente. En su lugar, se importan
 *   de 'lib/constants.ts'. Este enfoque facilita las actualizaciones, ya que
 *   los datos solo necesitan ser modificados en un único lugar.
 * - 'Cálculo del Año Actual': El año en el aviso de derechos de autor se calcula
 *   dinámicamente usando 'new Date().getFullYear()', asegurando que siempre
 *   esté actualizado sin necesidad de intervención manual.
 * - 'Mapeo de Iconos': Los iconos de redes sociales se renderizan dinámicamente
 *   mapeando el string del nombre del icono (ej. "Instagram") al componente de
 *   icono correspondiente de 'lucide-react'.
 *
 * Dependencias Externas:
 * - 'next/link': Para la navegación interna optimizada.
 * - 'lucide-react': Para la iconografía utilizada en el pie de página.
 * - '@/components/ui/logo': Para mostrar el logotipo de la aplicación.
 * - '@/lib/constants': Fuente de datos para los enlaces y la info de contacto.
 *
 */
