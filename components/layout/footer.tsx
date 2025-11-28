import Link from "next/link";
import { Instagram, Facebook, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { FOOTER_LINKS, CONTACT_INFO } from "@/lib/constants";

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
              Promoviendo la adopción responsable de mascotas en el Valle de Aburrá.
              Conectamos albergues, adoptantes y proveedores para el bienestar animal.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Enlaces Rápidos</h3>
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
            <h3 className="font-bold text-white text-lg mb-4">Recursos</h3>
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
            <h3 className="font-bold text-white text-lg mb-4">Contacto</h3>
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
              <p className="text-sm font-semibold text-white mb-2">Síguenos</p>
              <div className="flex gap-3">
                {FOOTER_LINKS.social.map((social) => {
                  const Icon = social.icon === "Instagram" ? Instagram 
                    : social.icon === "Facebook" ? Facebook 
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-400">
            <p>© {currentYear} PawLig - SENA. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <Link href="/privacidad" className="hover:text-white transition-colors">
                Privacidad
              </Link>
              <span>|</span>
              <Link href="/terminos" className="hover:text-white transition-colors">
                Términos
              </Link>
              <span>|</span>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
