import { Metadata } from 'next';
import React from 'react';
import { ArrowLeft, FileText, Gavel, UserCheck, AlertTriangle, ShieldAlert, HeartHandshake, Mail } from 'lucide-react';
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
                        <a href="#aceptacion" className="hover:text-primary transition-colors">1. Aceptación del Contrato</a>
                        <a href="#roles" className="hover:text-primary transition-colors">2. Roles y Responsabilidades</a>
                        <a href="#conducta" className="hover:text-primary transition-colors">3. Código de Conducta</a>
                        <a href="#operaciones" className="hover:text-primary transition-colors">4. Operaciones Comerciales</a>
                        <a href="#propiedad" className="hover:text-primary transition-colors">5. Propiedad Intelectual</a>
                        <a href="#limitacion" className="hover:text-primary transition-colors">6. Limitación de Responsabilidad</a>
                        <a href="#modificaciones" className="hover:text-primary transition-colors">7. Modificaciones del Servicio</a>
                    </nav>
                </aside>

                <div className="lg:col-span-3 space-y-12 text-slate-700 leading-relaxed">
                    <p className="text-sm text-slate-400 italic">Última actualización legal: {lastUpdate}</p>

                    <section id="aceptacion">
                        <div className="flex items-center gap-3 mb-6">
                            <Gavel className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-slate-900">1. Aceptación del Contrato</h2>
                        </div>
                        <p>
                            Al registrarse o utilizar la plataforma <strong>PawLig</strong>, usted reconoce haber leído, comprendido y aceptado estar sujeto a estos Términos y Condiciones. Este documento constituye un contrato legalmente vinculante entre usted (el "Usuario") y PawLig respecto al acceso y uso de nuestra web y servicios relacionados.
                        </p>
                        <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-400 text-sm text-amber-900">
                            <strong>Aviso Importante:</strong> Si no está de acuerdo con alguna parte de estos términos, debe cesar inmediatamente el uso de la plataforma y solicitar la eliminación de su cuenta.
                        </div>
                    </section>

                    <section id="roles">
                        <div className="flex items-center gap-3 mb-6">
                            <UserCheck className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-slate-900">2. Roles y Responsabilidades</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-slate-900 mb-2">Para Adoptantes:</h4>
                                <ul className="list-disc ml-5 text-sm space-y-2">
                                    <li>Garantizar que toda la información proporcionada en formularios de postulación es verídica y verificable.</li>
                                    <li>Comprometerse con el bienestar animal y permitir el seguimiento post-adopción solicitado por los albergues.</li>
                                    <li>Hacer un uso responsable de las herramientas de comunicación con albergues y vendedores.</li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-slate-900 mb-2">Para Albergues y Vendedores:</h4>
                                <ul className="list-disc ml-5 text-sm space-y-2">
                                    <li>Mantener actualizado el inventario de productos y el estado de salud/disponibilidad de las mascotas.</li>
                                    <li>Cumplir con las normativas comerciales y de protección animal vigentes en Colombia.</li>
                                    <li>Gestionar las solicitudes de manera ética, oportuna y transparente.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section id="conducta">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldAlert className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-slate-900">3. Código de Conducta y Usos Prohibidos</h2>
                        </div>
                        <p className="mb-4">Queda estrictamente prohibido:</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <li className="flex gap-2 items-start"><AlertTriangle size={16} className="text-red-500 shrink-0 mt-1" /> Publicar contenido falso, engañoso o difamatorio.</li>
                            <li className="flex gap-2 items-start"><AlertTriangle size={16} className="text-red-500 shrink-0 mt-1" /> El uso de la plataforma para fines de lucro ilegal mediante la venta de animales no autorizada.</li>
                            <li className="flex gap-2 items-start"><AlertTriangle size={16} className="text-red-500 shrink-0 mt-1" /> Intentar vulnerar la seguridad de la infraestructura mediante ataques de fuerza bruta o inyecciones SQL.</li>
                            <li className="flex gap-2 items-start"><AlertTriangle size={16} className="text-red-500 shrink-0 mt-1" /> El acoso o uso de lenguaje ofensivo hacia otros miembros del ecosistema.</li>
                        </ul>
                    </section>

                    <section id="operaciones">
                        <div className="flex items-center gap-3 mb-6">
                            <HeartHandshake className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-slate-900">4. Operaciones dentro del Marketplace</h2>
                        </div>
                        <p className="text-sm mb-4">
                            PawLig actúa como un facilitador tecnológico que conecta a proveedores con usuarios finales. Por lo tanto:
                        </p>
                        <ul className="list-disc ml-5 text-sm space-y-2">
                            <li>La calidad, garantía y entrega de los productos son responsabilidad exclusiva del Vendedor.</li>
                            <li>Los precios indicados en la plataforma incluyen IVA cuando así lo exija la ley, a menos que se especifique lo contrario.</li>
                            <li>PawLig se reserva el derecho de cobrar comisiones por servicio de intermediación, las cuales serán notificadas previamente a los proveedores.</li>
                        </ul>
                    </section>

                    <section id="limitacion">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertTriangle className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-slate-900">5. Limitación de Responsabilidad</h2>
                        </div>
                        <p className="text-sm">
                            PawLig no garantiza que la plataforma esté libre de errores o interrupciones. En la medida máxima permitida por la ley colombiana, PawLig no será responsable de:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs font-medium uppercase tracking-tighter">
                            <div className="p-3 bg-slate-100 rounded border border-slate-200">Decisiones de adopción fallidas</div>
                            <div className="p-3 bg-slate-100 rounded border border-slate-200">Disputas entre proveedores y compradores</div>
                            <div className="p-3 bg-slate-100 rounded border border-slate-200">Pérdida de datos por ataques externos</div>
                            <div className="p-3 bg-slate-100 rounded border border-slate-200">Indisponibilidad técnica temporal</div>
                        </div>
                    </section>

                    <section id="modificaciones" className="p-8 bg-slate-900 text-white rounded-3xl shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <Mail className="text-primary-foreground" size={28} />
                            <h2 className="text-2xl font-bold">Contacto Legal</h2>
                        </div>
                        <p className="opacity-80 text-sm mb-6">
                            PawLig se reserva el derecho de modificar estos términos en cualquier momento. Los cambios significativos serán notificados mediante avisos en el dashboard. El uso continuado de la plataforma tras dichas modificaciones implica la aceptación de los nuevos términos.
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
