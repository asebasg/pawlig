import { Metadata } from 'next';
import React from 'react';
import { ArrowLeft, ShieldCheck, User, Server, Share2, Shield, Clock, FileCheck, GitBranch, Bell, Cookie } from 'lucide-react';
import Link from 'next/link';

/**
 * Ruta/Componente/Servicio: PrivacyPage
 * Descripción: Página que detalla la política de privacidad y tratamiento de datos personales.
 * Requiere: lucide-react, next/link
 * Implementa: Cumplimiento de la Ley 1581 de 2012 (Habeas Data).
 */

export const metadata: Metadata = {
    title: 'Política de Privacidad Integral - PawLig',
    description: 'Documentación técnica y legal sobre el tratamiento de datos personales en la plataforma PawLig bajo la normativa colombiana.',
};

export default function PrivacyPage() {
    const lastUpdate = new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <main className="container mx-auto px-4 py-16 max-w-5xl">
            <div className="mb-12">
                <Link
                    href="/"
                    className="group inline-flex items-center text-sm font-semibold text-primary hover:opacity-80 transition-all"
                >
                    <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
                    Volver a la plataforma
                </Link>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 pb-8 border-b border-slate-100">
                <div className="p-4 bg-primary/10 rounded-2xl w-fit">
                    <ShieldCheck className="text-primary" size={40} />
                </div>
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">Políticas de Privacidad de PawLig</h1>
                    <p className="text-slate-500 font-medium">Cumplimiento Normativo Ley 1581 de 2012 (Habeas Data) y lineamientos de seguridad técnica</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                <aside className="hidden lg:block space-y-4 sticky top-24 h-fit">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Secciones</h3>
                    <nav className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
                        <a href="#responsable" className="hover:text-primary transition-colors">1. Responsable</a>
                        <a href="#recoleccion" className="hover:text-primary transition-colors">2. Recolección</a>
                        <a href="#finalidad" className="hover:text-primary transition-colors">3. Finalidad</a>
                        <a href="#comparticion" className="hover:text-primary transition-colors">4. Compartición</a>
                        <a href="#seguridad" className="hover:text-primary transition-colors">5. Seguridad</a>
                        <a href="#conservacion" className="hover:text-primary transition-colors">6. Conservación</a>
                        <a href="#derechos" className="hover:text-primary transition-colors">7. Derechos</a>
                        <a href="#cookies" className="hover:text-primary transition-colors">8. Cookies</a>
                        <a href="#cambios" className="hover:text-primary transition-colors">9. Cambios</a>
                        <a href="#marco-legal" className="hover:text-primary transition-colors">10. Marco Legal</a>
                    </nav>
                </aside>

                <div className="lg:col-span-3 space-y-12 text-slate-700 leading-relaxed">
                    <p className="text-sm text-slate-400 font-medium">Última revisión técnica: {lastUpdate}</p>

                    <section id="responsable" className='scroll-mt-24'>
                        <div className="flex items-center gap-3 mb-6">
                            <User className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-foreground text-left">1. Responsable del Tratamiento</h2>
                        </div>
                        <p className="mb-4">
                            El responsable del tratamiento de los datos personales recolectados a través de la plataforma <strong>PawLig</strong> es <strong>Sebastián Ospina Guzmán</strong>.
                        </p>
                        <div className="bg-muted border-l-4 border-teal-500 p-5 rounded-r-xl">
                            <h4 className="font-bold text-foreground mb-2">Datos de Contacto:</h4>
                            <ul className="list-disc ml-5 space-y-1 text-sm">
                                <li><strong>Domicilio:</strong> Girardota, Antioquia, Colombia.</li>
                                <li><strong>Correo Electrónico de Privacidad:</strong> asebasg07@gmail.com</li>
                            </ul>
                        </div>
                    </section>

                    <section id="recoleccion" className='scroll-mt-24'>
                        <div className="flex items-center gap-3 mb-6">
                            <Server className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-foreground text-left">2. Información que Recopilamos</h2>
                        </div>
                        <p className="mb-4">
                            En <strong>PawLig</strong>, recolectamos únicamente la información necesaria para gestionar el proceso de adopción y asegurar el funcionamiento técnico de la plataforma. Clasificamos los datos en tres categorías:
                        </p>
                        <div className="space-y-4">
                            <div className="bg-muted border-l-4 border-violet-500 p-5 rounded-r-xl">
                                <h4 className="font-bold text-foreground mb-2">1. Información que usted nos proporciona directamente</h4>
                                <ul className="list-disc ml-5 space-y-1 text-sm">
                                    <li><strong>Datos de Identificación y Contacto:</strong> Nombre completo, dirección de correo electrónico y número de teléfono.</li>
                                    <li><strong>Credenciales de Acceso:</strong> Contraseña (la cual es encriptada y almacenada de forma segura, siendo ilegible incluso para nosotros).</li>
                                    <li><strong>Datos de la Mascota:</strong> Información descriptiva sobre los animales que usted publica para adopción (nombre, edad, raza, estado de salud).</li>
                                </ul>
                            </div>
                            <div className="bg-muted border-l-4 border-emerald-500 p-5 rounded-r-xl">
                                <h4 className="font-bold text-foreground mb-2">2. Contenido Multimedia</h4>
                                <ul className="list-disc ml-5 space-y-1 text-sm">
                                    <li>Almacenamos los archivos de imagen en nuestros servidores externos de gestión multimedia (<strong>Cloudinary</strong>).</li>
                                    <li>Estas imágenes pueden contener metadatos técnicos (información EXIF) sobre el dispositivo o la fecha de la captura, los cuales procesamos como parte del archivo.</li>
                                </ul>
                            </div>
                            <div className="bg-muted border-l-4 border-cyan-500 p-5 rounded-r-xl">
                                <h4 className="font-bold text-foreground mb-2">3. Información Técnica y de Uso</h4>
                                <ul className="list-disc ml-5 space-y-1 text-sm">
                                    <li>Dirección IP (Protocolo de Internet) para fines de seguridad y control de acceso.</li>
                                    <li>Tipo de navegador y sistema operativo.</li>
                                    <li>Registros de actividad (logs) para detectar errores o intentos de acceso no autorizado.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section id="finalidad" className='scroll-mt-24'>
                        <div className="flex items-center gap-3 mb-6">
                            <FileCheck className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-foreground text-left">3. Para qué usamos su información</h2>
                        </div>
                        <p className="mb-4">
                            La información personal que recopilamos en <strong>PawLig</strong> tiene finalidades específicas, explícitas y legítimas. No procesaremos sus datos para fines distintos a los establecidos a continuación:
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <li className="p-3 border border-slate-100 rounded-lg shadow-sm font-medium">🐾 <strong>Gestión del Servicio de Adopción:</strong> Crear y gestionar su cuenta, publicar mascotas y facilitar la comunicación.</li>
                            <li className="p-3 border border-slate-100 rounded-lg shadow-sm font-medium">️🛡️ <strong>Seguridad y Funcionamiento Técnico:</strong> Proteger la plataforma, detectar fraudes y garantizar la disponibilidad del servicio.</li>
                            <li className="p-3 border border-slate-100 rounded-lg shadow-sm font-medium">🔔 <strong>Comunicaciones del Servicio:</strong> Enviarle notificaciones técnicas, actualizaciones de seguridad o alertas sobre sus publicaciones.</li>
                        </ul>
                    </section>

                    <section id="comparticion" className='scroll-mt-24'>
                        <div className="flex items-center gap-3 mb-6">
                            <Share2 className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-foreground text-left">4. Compartición y Transferencia de Datos</h2>
                        </div>
                        <p className="mb-4">
                            En <strong>PawLig</strong> mantenemos un compromiso estricto de confidencialidad. No vendemos, alquilamos ni comercializamos sus datos personales. Sin embargo, para que la plataforma funcione, compartimos información con proveedores de servicios tecnológicos:
                        </p>
                        <div className="space-y-4">
                            <div className="bg-muted border-l-4 border-pink-500 p-5 rounded-r-xl">
                                <h4 className="font-bold text-foreground mb-2">Proveedores de Servicios (Encargados del Tratamiento)</h4>
                                <ul className="list-disc ml-5 space-y-1 text-sm">
                                    <li><strong>MongoDB Atlas:</strong> Proveedor de base de datos en la nube.</li>
                                    <li><strong>Cloudinary:</strong> Servicio de gestión de medios.</li>
                                </ul>
                            </div>
                            <div className="bg-muted border-l-4 border-emerald-500 p-5 rounded-r-xl">
                                <h4 className="font-bold text-foreground mb-2">Transferencia Internacional de Datos</h4>
                                <p className="text-sm">Su información puede ser transferida, almacenada y procesada en servidores ubicados fuera de Colombia (principalmente en Estados Unidos). Al usar <strong>PawLig</strong>, usted acepta esta transferencia.</p>
                            </div>
                        </div>
                    </section>

                    <section id="seguridad" className='scroll-mt-24'>
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-foreground text-left">5. Seguridad de la Información</h2>
                        </div>
                        <p className="mb-4">
                            Implementamos medidas técnicas, administrativas y digitales para proteger sus datos personales contra acceso no autorizado, pérdida, alteración o uso indebido.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h4 className="font-bold flex items-center gap-2"><div className="w-2 h-2 bg-primary rounded-full" />Cifrado en Tránsito</h4>
                                <p className="text-sm">Toda la información viaja encriptada mediante protocolos <strong>SSL/TLS</strong>.</p>
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-bold flex items-center gap-2"><div className="w-2 h-2 bg-primary rounded-full" />Protección de Contraseñas</h4>
                                <p className="text-sm">Sus credenciales se almacenan transformadas mediante algoritmos criptográficos robustos (<strong>hashing</strong>).</p>
                            </div>
                        </div>
                    </section>

                    <section id="conservacion" className='scroll-mt-24'>
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-foreground text-left">6. Tiempo de Conservación y Eliminación</h2>
                        </div>
                        <p className="mb-4">
                            No almacenamos su información indefinidamente. Mantenemos sus datos únicamente durante el tiempo necesario para cumplir con los fines descritos.
                        </p>
                        <div className="bg-muted border-l-4 border-x-sky-500 p-5 rounded-r-xl">
                            <h4 className="font-bold text-foreground mb-2">Proceso de Eliminación Sincronizada</h4>
                            <p className="text-sm">Si usted decide eliminar su cuenta, ejecutamos un borrado completo tanto en la base de datos (<strong>MongoDB</strong>) como en los servidores de imágenes (<strong>Cloudinary</strong>) para no dejar rastros digitales.</p>
                        </div>
                    </section>

                    <section id="derechos" className='scroll-mt-24'>
                        <div className="flex items-center gap-3 mb-6">
                            <GitBranch className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-foreground text-left">7. Sus Derechos sobre la Información</h2>
                        </div>
                        <p className="font-medium text-slate-800 mb-4">
                            Usted es el único dueño de su información personal y tiene plena facultad para controlar cómo la utilizamos. Puede ejercer los siguientes derechos:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm font-bold">
                            <div className="p-3 bg-card rounded-lg shadow-sm border border-slate-100">Conocer</div>
                            <div className="p-3 bg-card rounded-lg shadow-sm border border-slate-100">Actualizar</div>
                            <div className="p-3 bg-card rounded-lg shadow-sm border border-slate-100">Suprimir</div>
                            <div className="p-3 bg-card rounded-lg shadow-sm border border-slate-100">Revocar</div>
                        </div>
                        <p className="mt-8 text-sm bg-primary text-white p-4 rounded-xl text-center font-bold">
                            Para cualquier solicitud, comuníquese formalmente al correo institucional:
                            <span className="underline ml-1">asebasg07@gmail.com</span>
                        </p>
                    </section>

                    <section id="cookies" className='scroll-mt-24'>
                        <div className="flex items-center gap-3 mb-6">
                            <Cookie className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-foreground text-left">8. Uso de Cookies y Tecnologías de Rastreo</h2>
                        </div>
                        <p className="mb-4">
                            Utilizamos tecnologías de almacenamiento local y cookies estrictamente necesarias para el funcionamiento de la plataforma. No utilizamos estas tecnologías para rastrear su comportamiento fuera de nuestro sitio web ni para mostrarle publicidad personalizada.
                        </p>
                        <div className="bg-muted border-l-4 border-orange-400 p-5 rounded-r-xl">
                            <h4 className="font-bold text-foreground mb-2">Tecnologías Utilizadas:</h4>
                            <ul className="list-disc ml-5 space-y-1 text-sm">
                                <li><strong>Cookies de Sesión y Autenticación:</strong> Esenciales para mantener su sesión iniciada.</li>
                                <li><strong>Almacenamiento Local (Local Storage):</strong> Guardamos preferencias de configuración para mejorar la experiencia.</li>
                            </ul>
                        </div>
                    </section>

                    <section id="cambios" className='scroll-mt-24'>
                        <div className="flex items-center gap-3 mb-6">
                            <Bell className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-foreground text-left">9. Cambios en esta Política de Privacidad</h2>
                        </div>
                        <p className="mb-4">
                            Podemos actualizar nuestra Política de Privacidad ocasionalmente. Si realizamos modificaciones sustanciales, se lo notificaremos publicando la nueva versión en este enlace y, en caso de cambios críticos, a través de su correo electrónico.
                        </p>
                    </section>

                    <section id="marco-legal" className='scroll-mt-24'>
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-foreground text-left">10. Marco Legal y Aceptación</h2>
                        </div>
                        <p className="mb-4">
                            Esta Política de Privacidad se rige por las leyes de la República de Colombia, especialmente la <strong>Ley 1581 de 2012</strong>. Al registrarse en <strong>PawLig</strong>, usted confirma que ha leído, entendido y aceptado todos los términos expuestos en este documento.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Esta página informa a los usuarios sobre cómo se recolectan, utilizan y
 * protegen sus datos personales en PawLig, siguiendo la normativa colombiana.
 *
 * Lógica Clave:
 * - 'Navegación por secciones': Al igual que la página de términos, utiliza
 *   un menú lateral para acceder rápidamente a las diferentes secciones de la
 *   política.
 * - 'Categorización de Datos': Explica de forma clara qué tipo de información
 *   se recopila (directa, multimedia, técnica).
 * - 'Derechos del Usuario': Enumera los derechos ARCO (Acceso, Rectificación,
 *   Cancelación y Oposición) que el usuario puede ejercer.
 *
 * Dependencias Externas:
 * - 'lucide-react': Para representar visualmente los conceptos de seguridad y
 *   privacidad.
 * - 'next/link': Para enlaces de retorno y navegación.
 *
 */
