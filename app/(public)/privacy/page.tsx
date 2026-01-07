import { Metadata } from 'next';
import React from 'react';
import { ArrowLeft, ShieldCheck, Eye, Lock, Cookie, Scale, Clock, UserCheck } from 'lucide-react';
import Link from 'next/link';

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
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Política de Privacidad Integral</h1>
                    <p className="text-slate-500 font-medium">Cumplimiento Normativo Ley 1581 de 2012 (Habeas Data) y lineamientos de seguridad técnica.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Tabla de contenidos lateral para facilidad de lectura */}
                <aside className="hidden lg:block space-y-4 sticky top-8 h-fit">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Secciones</h3>
                    <nav className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                        <a href="#recoleccion" className="hover:text-primary transition-colors">1. Recolección de Datos</a>
                        <a href="#finalidad" className="hover:text-primary transition-colors">2. Finalidad del Tratamiento</a>
                        <a href="#seguridad" className="hover:text-primary transition-colors">3. Seguridad Técnica</a>
                        <a href="#cookies" className="hover:text-primary transition-colors">4. Gestión de Cookies</a>
                        <a href="#terceros" className="hover:text-primary transition-colors">5. Transferencia a Terceros</a>
                        <a href="#retencion" className="hover:text-primary transition-colors">6. Retención de Datos</a>
                        <a href="#derechos" className="hover:text-primary transition-colors">7. Derechos del Titular</a>
                    </nav>
                </aside>

                <div className="lg:col-span-3 space-y-12 text-slate-700 leading-relaxed">
                    <p className="text-sm text-slate-400 italic">Última revisión técnica: {lastUpdate}</p>

                    <section id="recoleccion">
                        <div className="flex items-center gap-3 mb-6">
                            <Eye className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-slate-900 text-left">1. Información Recolectada y Naturaleza de los Datos</h2>
                        </div>
                        <p className="mb-4">
                            PawLig recolecta datos personales de manera directa y automatizada a través de la interacción con el sistema.
                            Clasificamos la información según el rol del usuario y la sensibilidad del dato:
                        </p>
                        <div className="space-y-4">
                            <div className="bg-slate-50 border-l-4 border-primary p-5 rounded-r-xl">
                                <h4 className="font-bold text-slate-900 mb-2">Información del Perfil de Usuario</h4>
                                <ul className="list-disc ml-5 space-y-1 text-sm">
                                    <li><strong>Identificación:</strong> Nombre completo, direcciones de correo electrónico vinculadas a vendedores de OAuth (Google/GitHub).</li>
                                    <li><strong>Contacto:</strong> Número telefónico validado y dirección física (necesaria para visitas de inspección en adopciones o entrega de productos).</li>
                                    <li><strong>Multimedia:</strong> Fotografías de perfil y evidencias del entorno doméstico cargadas voluntariamente en postulaciones (Procesadas vía Cloudinary).</li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 border-l-4 border-emerald-500 p-5 rounded-r-xl">
                                <h4 className="font-bold text-slate-900 mb-2">Información de Albergues y Vendedores</h4>
                                <ul className="list-disc ml-5 space-y-1 text-sm">
                                    <li><strong>Registros Legales:</strong> NIT, RUT y certificaciones de existencia y representación legal.</li>
                                    <li><strong>Geolocalización:</strong> Coordenadas exactas del establecimiento para optimización de logística y visibilidad en el ecosistema del Valle de Aburrá.</li>
                                    <li><strong>Operatividad:</strong> Inventario de productos, historial de precios y estados de salud de mascotas bajo custodia.</li>
                                </ul>
                            </div>
                            <p className="text-sm font-medium">
                                🔒 <strong>Nota sobre datos sensibles:</strong> PawLig no solicita datos biométricos, de orientación política o sexual.
                                Cualquier dato relacionado con la salud animal se considera información técnica operativa, no personal.
                            </p>
                        </div>
                    </section>

                    <section id="finalidad">
                        <div className="flex items-center gap-3 mb-6">
                            <UserCheck className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-slate-900 text-left">2. Finalidad Sistémica del Tratamiento</h2>
                        </div>
                        <p className="mb-4">El tratamiento de sus datos se limita estrictamente a las siguientes funcionalidades del ecosistema:</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <li className="p-3 border border-slate-100 rounded-lg shadow-sm font-medium">
                                🐾 Facilitar el match entre adoptantes potenciales y albergues mediante algoritmos de afinidad.
                            </li>
                            <li className="p-3 border border-slate-100 rounded-lg shadow-sm font-medium">
                                ⚖️ Mitigar riesgos de maltrato animal mediante la verificación de antecedentes y referencias en el sistema.
                            </li>
                            <li className="p-3 border border-slate-100 rounded-lg shadow-sm font-medium">
                                🛒 Garantizar la trazabilidad de las transacciones comerciales en el Marketplace de vendedores.
                            </li>
                            <li className="p-3 border border-slate-100 rounded-lg shadow-sm font-medium">
                                📊 Generación de reportes de impacto social (siempre de forma anonimizada y agregada).
                            </li>
                        </ul>
                    </section>

                    <section id="seguridad">
                        <div className="flex items-center gap-3 mb-6">
                            <Lock className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-slate-900 text-left">3. Infraestructura de Seguridad Técnica</h2>
                        </div>
                        <p className="mb-4">
                            Garantizamos la integridad y confidencialidad mediante estándares industriales avanzados:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h4 className="font-bold flex items-center gap-2"><div className="w-2 h-2 bg-primary rounded-full" /> Encriptación de Datos</h4>
                                <p className="text-sm">Tránsito de datos protegido mediante <strong>TLS 1.3 (SSL)</strong>. Contraseñas (si aplica) procesadas con <strong>Argon2id o bcrypt</strong> con factor de costo dinámico.</p>
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-bold flex items-center gap-2"><div className="w-2 h-2 bg-primary rounded-full" /> Protocolo de Autenticación</h4>
                                <p className="text-sm">Implementamos <strong>OIDC (OpenID Connect)</strong> vía Next-Auth, eliminando la necesidad de almacenar credenciales críticas en nuestros servidores.</p>
                            </div>
                        </div>
                    </section>

                    <section id="cookies">
                        <div className="flex items-center gap-3 mb-6">
                            <Cookie className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-slate-900 text-left">4. Gestión de Cookies y Persistencia</h2>
                        </div>
                        <p className="text-sm mb-4">
                            PawLig utiliza exclusivamente cookies técnicas esenciales para el funcionamiento del servicio. No utilizamos cookies de rastreo publicitario de terceros (tracking pixels).
                        </p>
                        <table className="w-full text-xs border-collapse">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="p-2 text-left border">Nombre</th>
                                    <th className="p-2 text-left border">Propósito</th>
                                    <th className="p-2 text-left border">Duración</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-2 border font-mono">next-auth.session-token</td>
                                    <td className="p-2 border">Mantiene la sesión activa del usuario.</td>
                                    <td className="p-2 border">30 días / Fin de sesión</td>
                                </tr>
                                <tr className="bg-slate-50">
                                    <td className="p-2 border font-mono">__Secure-next-auth.callback-url</td>
                                    <td className="p-2 border">Gestión segura de redirecciones OAuth.</td>
                                    <td className="p-2 border">Sesión</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section id="retencion">
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-slate-900 text-left">5. Periodo de Retención de Datos</h2>
                        </div>
                        <p className="text-sm">
                            Conservaremos sus datos personales únicamente durante el tiempo necesario para cumplir con los fines para los cuales fueron recolectados:
                        </p>
                        <ul className="list-disc ml-5 mt-2 text-sm space-y-1">
                            <li><strong>Datos de Sesión:</strong> Eliminación inmediata tras el cierre de cuenta.</li>
                            <li><strong>Historial de Adopciones:</strong> Almacenamiento por un periodo de 10 años (requerimiento legal para seguimiento de bienestar animal).</li>
                            <li><strong>Transacciones Financieras:</strong> Conservación según normatividad contable vigente en Colombia.</li>
                        </ul>
                    </section>

                    <section id="derechos" className="p-8 bg-primary/5 border border-primary/10 rounded-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <Scale className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-slate-900 text-left">6. Derechos ARCO y Protección Habeas Data</h2>
                        </div>
                        <p className="font-medium text-slate-800 mb-4">
                            Usted es dueño de su información. De acuerdo con la Ley 1581 de 2012, usted puede:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-[10px] font-bold uppercase tracking-wider">
                            <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-100">Acceder</div>
                            <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-100">Rectificar</div>
                            <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-100">Cancelar</div>
                            <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-100">Oponerse</div>
                        </div>
                        <p className="mt-8 text-sm bg-primary text-white p-4 rounded-xl text-center font-bold">
                            Para cualquier solicitud, comuníquese formalmente al correo institucional:
                            <span className="underline ml-1">protecciondatos@pawlig.com</span>
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
