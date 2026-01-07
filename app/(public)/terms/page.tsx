import { Metadata } from 'next';
import React from 'react';
import { ArrowLeft, FileText, Gavel, UserCheck, AlertTriangle, ShieldAlert, HeartHandshake, Mail, Scale } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Términos y Condiciones de Uso - PawLig',
    description: 'Marco legal y condiciones de servicio para usuarios, albergues y vendedores en la plataforma PawLig.',
};

export default function TermsPage() {
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
                    <FileText className="text-primary" size={40} />
                </div>
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Términos y Condiciones</h1>
                    <p className="text-slate-500 font-medium">Acuerdo vinculante de uso de plataforma para el ecosistema PawLig.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Tabla de contenidos lateral */}
                <aside className="hidden lg:block space-y-4 sticky top-8 h-fit">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Contenido</h3>
                    <nav className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                        <a href="#clausula-1" className="hover:text-primary transition-colors">1. Naturaleza del Servicio</a>
                        <a href="#clausula-2" className="hover:text-primary transition-colors">2. Gestión de Cuentas</a>
                        <a href="#clausula-3" className="hover:text-primary transition-colors">3. Propiedad Intelectual</a>
                        <a href="#clausula-4" className="hover:text-primary transition-colors">4. Responsabilidades</a>
                        <a href="#clausula-5" className="hover:text-primary transition-colors">5. Modificaciones y Suspensión</a>
                        <a href="#clausula-6" className="hover:text-primary transition-colors">6. Ley Aplicable</a>
                    </nav>
                </aside>

                <div className="lg:col-span-3 space-y-12 text-slate-700 leading-relaxed">
                    <p className="text-sm text-slate-400 italic">Última actualización legal: {lastUpdate}</p>

                    <section id="clausula-1">
                        <div className="flex items-center gap-3 mb-6">
                            <Gavel className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-slate-900">CLÁUSULA 1: Naturaleza del Servicio y Alcance</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-slate-900 mb-2">1. Definición de PawLig</h4>
                                <p className="text-sm">PawLig es una plataforma digital que funciona como un punto de encuentro entre personas interesadas en adoptar mascotas, albergues de animales y vendedores de productos veterinarios. Nuestra labor principal es facilitar el contacto entre estas partes para promover el bienestar animal en los municipios que conforman el Valle de Aburrá.</p>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-slate-900 mb-2">2. Rol de Intermediario</h4>
                                <p className="text-sm">Usted acepta y entiende que PawLig no es el dueño, cuidador, fabricante ni vendedor de los animales o productos que aparecen en el sitio. La plataforma actúa exclusivamente como un canal de comunicación. En consecuencia, PawLig no se hace responsable por la salud, el comportamiento de los animales ni por la calidad de los artículos comerciales.</p>
                            </div>
                            <p><strong>Territorio de Operación:</strong> Los servicios de esta plataforma están diseñados y limitados exclusivamente para usuarios residentes y entidades ubicadas en el Valle de Aburrá.</p>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-2">4. Funcionamiento del Proceso de Adopción</h4>
                                <ul className="list-disc ml-5 text-sm space-y-2">
                                    <li><strong>Independencia de los Albergues:</strong> Cada albergue opera de manera autónoma, definiendo sus propios criterios de selección. El uso de PawLig no garantiza la aprobación de una solicitud.</li>
                                    <li><strong>Trámites Externos:</strong> Una vez enviada una solicitud, la relación continúa directamente con el albergue. Trámites legales y visitas ocurren fuera de la plataforma.</li>
                                </ul>
                            </div>
                             <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-400 text-sm text-amber-900">
                                <strong>Advertencia sobre Transacciones:</strong> Todas las funciones de "compra" o "pagos" dentro de PawLig son simulaciones con fines demostrativos. La plataforma no procesa dinero real ni solicita datos bancarios.
                            </div>
                        </div>
                    </section>

                    <section id="clausula-2">
                        <div className="flex items-center gap-3 mb-6">
                            <UserCheck className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-slate-900">CLÁUSULA 2: Gestión de Cuentas y Seguridad</h2>
                        </div>
                         <div className="space-y-6">
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-slate-900 mb-2">1. Requisitos para el Registro</h4>
                                <ul className="list-disc ml-5 text-sm space-y-2">
                                    <li><strong>Veracidad de la Información:</strong> Al registrarse, usted se obliga a suministrar datos reales, exactos y actualizados. El uso de identidades falsas resultará en la eliminación de la cuenta.</li>
                                    <li><strong>Uso Personal:</strong> Su cuenta es personal e intransferible. Usted es responsable de mantener la confidencialidad de sus credenciales.</li>
                                </ul>
                            </div>
                             <p><strong>Seguridad de la Sesión:</strong> Por seguridad, su sesión activa tendrá una duración máxima de 24 horas. Una vez cumplido este tiempo, el sistema cerrará la sesión automáticamente.</p>
                             <div>
                                <h4 className="font-bold text-slate-900 mb-2">3. Procedimiento de Solicitud de Adopción</h4>
                                 <ul className="list-disc ml-5 text-sm space-y-2">
                                     <li>Al aplicar, sus datos de contacto serán enviados automáticamente al Albergue responsable.</li>
                                     <li>El Albergue se comunicará con usted de forma independiente. PawLig no interviene en entrevistas ni validaciones.</li>
                                     <li>La entrega física del animal depende del cumplimiento de los requisitos del Albergue.</li>
                                 </ul>
                            </div>
                        </div>
                    </section>

                    <section id="clausula-3">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldAlert className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-slate-900">CLÁUSULA 3: Propiedad Intelectual</h2>
                        </div>
                        <p className="mb-4">Todo el contenido de PawLig, incluyendo código fuente, diseño y logotipo, es propiedad exclusiva del equipo de desarrollo. Queda estrictamente prohibido copiar, reproducir o distribuir cualquier componente sin autorización.</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <li className="flex gap-2 items-start"><AlertTriangle size={16} className="text-red-500 shrink-0 mt-1" /> Las imágenes de las mascotas son propiedad del albergue que las sube.</li>
                            <li className="flex gap-2 items-start"><AlertTriangle size={16} className="text-red-500 shrink-0 mt-1" /> Las marcas de terceros se utilizan con fines identificativos.</li>
                            <li className="flex gap-2 items-start"><AlertTriangle size={16} className="text-red-500 shrink-0 mt-1" /> El contenido inadecuado puede ser reportado para su revisión.</li>
                        </ul>
                    </section>

                    <section id="clausula-4">
                        <div className="flex items-center gap-3 mb-6">
                            <HeartHandshake className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-slate-900">CLÁUSULA 4: Responsabilidades y Garantías</h2>
                        </div>
                        <p className="text-sm mb-4">
                            PawLig no es propietario de los animales y no ofrece garantías sobre su salud o comportamiento. La responsabilidad recae en los Albergues.
                        </p>
                        <ul className="list-disc ml-5 text-sm space-y-2">
                            <li>La calidad y garantía de los productos son responsabilidad del Vendedor.</li>
                            <li>No garantizamos que la plataforma funcione de manera ininterrumpida o libre de errores.</li>
                            <li>En ningún caso PawLig será responsable por daños indirectos derivados del uso del sitio web.</li>
                        </ul>
                    </section>

                    <section id="clausula-5">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertTriangle className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-slate-900">CLÁUSULA 5: Modificaciones y Suspensión</h2>
                        </div>
                        <p className="text-sm">
                            PawLig se reserva el derecho de modificar estos términos en cualquier momento. Los cambios significativos serán notificados.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs font-medium uppercase tracking-tighter">
                            <div className="p-3 bg-slate-100 rounded border border-slate-200">Causas de cierre: información falsa, actividades ilícitas.</div>
                            <div className="p-3 bg-slate-100 rounded border border-slate-200">El usuario puede solicitar la eliminación de su cuenta.</div>
                            <div className="p-3 bg-slate-100 rounded border border-slate-200">El proyecto puede ser dado de baja al finalizar el ciclo académico.</div>
                        </div>
                    </section>

                     <section id="clausula-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Scale className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-slate-900">CLÁUSULA 6: Ley Aplicable y Solución de Conflictos</h2>
                        </div>
                        <p className="text-sm">
                            Estos Términos y Condiciones se rigen por las leyes de la República de Colombia. En caso de conflicto, las partes se comprometen a buscar una solución amistosa.
                        </p>
                    </section>

                    <section id="aceptacion-final" className="p-8 bg-slate-900 text-white rounded-3xl shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <Mail className="text-primary-foreground" size={28} />
                            <h2 className="text-2xl font-bold">Aceptación de los Términos</h2>
                        </div>
                        <p className="opacity-80 text-sm mb-6">
                           Al pulsar el botón de registro, iniciar sesión o utilizar cualquier servicio de <strong>PawLig</strong>, usted confirma que ha leído, entendido y aceptado en su totalidad los presentes Términos y Condiciones de Uso. Si no está de acuerdo, deberá abstenerse de utilizar la plataforma.
                        </p>
                        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                            <span className="text-xs font-mono">legal@pawlig.com</span>
                            <button className="px-6 py-2 bg-white text-slate-900 text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all uppercase tracking-widest">
                                Reportar infracción
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
