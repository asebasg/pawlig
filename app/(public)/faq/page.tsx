
import { Metadata } from 'next';
import React from 'react';
import { ArrowLeft, HelpCircle, User, Server, ShieldCheck, HeartHandshake, FileText, Scale, Flag, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Preguntas Frecuentes (FAQ) - PawLig',
    description: 'Encuentra respuestas a las dudas más comunes sobre el funcionamiento de PawLig, el proceso de adopción y la gestión de tu cuenta.',
};

export default function FaqPage() {
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
                    <HelpCircle className="text-primary" size={40} />
                </div>
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">Preguntas Frecuentes</h1>
                    <p className="text-slate-500 font-medium">Respuestas claras a las dudas más comunes sobre la plataforma PawLig</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Tabla de contenidos lateral */}
                <aside className="hidden lg:block space-y-4 sticky top-24 h-fit">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Contenido</h3>
                    <nav className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
                        <a href="#preguntas-generales" className="hover:text-primary transition-colors">I. Preguntas Generales</a>
                        <a href="#sobre-plataforma" className="hover:text-primary transition-colors">II. Sobre la Plataforma</a>
                        <a href="#proceso-adopcion" className="hover:text-primary transition-colors">III. Proceso de Adopción</a>
                        <a href="#gestion-datos" className="hover:text-primary transition-colors">IV. Gestión de Datos</a>
                        <a href="#cuentas-usuario" className="hover:text-primary transition-colors">V. Cuentas de Usuario</a>
                        <a href="#ley-aplicable" className="hover:text-primary transition-colors">VI. Ley Aplicable</a>
                    </nav>
                </aside>

                <div className="lg:col-span-3 space-y-12 text-slate-700 leading-relaxed">
                    <p className="text-sm text-slate-400 font-medium">Última actualización: {lastUpdate}</p>

                    <section id="preguntas-generales" className="scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <User className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-foreground">I. Preguntas Generales de PawLig</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-muted p-5 rounded-xl border border-border">
                                <h4 className="font-bold text-foreground mb-2">¿Cómo me registro en la plataforma?</h4>
                                <p className="text-sm">Haz clic en el botón de &quot;Registro&quot;, completa tus datos básicos (nombre, correo y teléfono) y crea una contraseña segura. Al registrarte, confirmas la aceptación de nuestros <Link href="/terms" className="text-primary font-semibold hover:underline">Términos y Condiciones</Link> y nuestra <Link href="/privacy" className="text-primary font-semibold hover:underline">Política de Privacidad</Link>.</p>
                            </div>
                            <div className="bg-muted p-5 rounded-xl border border-border">
                                <h4 className="font-bold text-foreground mb-2">¿Cómo puedo subir una mascota para adopción?</h4>
                                <p className="text-sm">Desde tu panel de usuario, selecciona &quot;Publicar Mascota&quot;. Deberás completar un formulario con el nombre, edad, raza y una descripción clara de la mascota. Es obligatorio subir al menos una fotografía.</p>
                            </div>
                            <div className="bg-muted p-5 rounded-xl border border-border">
                                <h4 className="font-bold text-foreground mb-2">¿Cómo aplico para adoptar a un animal?</h4>
                                <p className="text-sm">Navega por las publicaciones. Cuando encuentres una mascota de tu interés, presiona &quot;Aplicar para Adopción&quot;. Tus datos de contacto serán enviados al encargado para que inicie la comunicación.</p>
                            </div>
                             <div className="bg-muted p-5 rounded-xl border border-border">
                                <h4 className="font-bold text-foreground mb-2">¿Puedo comprar productos en la sección veterinaria?</h4>
                                <p className="text-sm">No. Todas las compras y pagos en PawLig son simulaciones. No se procesa dinero real ni se realizan envíos. No ingreses datos de tarjetas de crédito.</p>
                            </div>
                            <div className="bg-muted p-5 rounded-xl border border-border">
                                <h4 className="font-bold text-foreground mb-2">¿Qué costo tiene usar PawLig?</h4>
                                <p className="text-sm">Ninguno. El servicio es 100% gratuito tanto para quienes buscan adoptar como para los albergues que publican a sus mascotas.</p>
                            </div>
                            <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-400 text-sm text-amber-900">
                                <strong>Territorio de operación:</strong> PawLig está limitado exclusivamente a los municipios del Valle de Aburrá, en el departamento de Antioquia (Colombia). No se aceptan publicaciones de otras regiones.
                            </div>
                        </div>
                    </section>

                    <section id="sobre-plataforma" className="scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <Server className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-foreground">II. Sobre la Plataforma y el Servicio</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-muted p-5 rounded-xl border border-border">
                                <h4 className="font-bold text-foreground mb-2">¿Cuál es el rol de PawLig en el proceso de adopción?</h4>
                                <p className="text-sm">PawLig actúa exclusivamente como un canal de comunicación e intermediario. La plataforma no es la dueña, cuidadora, fabricante ni vendedora de los animales o productos. La responsabilidad final recae en los albergues y usuarios.</p>
                            </div>
                            <div className="bg-muted p-5 rounded-xl border border-border">
                                <h4 className="font-bold text-foreground mb-2">¿El proceso de compra de productos es real?</h4>
                                <p className="text-sm">No. Todas las funciones de &quot;compra&quot; o &quot;pagos&quot; son simulaciones. La plataforma no procesa dinero real ni solicita datos bancarios, según se especifica en la <Link href="/terms#clausula-1" className="text-primary font-semibold hover:underline">Cláusula 1 de los Términos y Condiciones</Link>.</p>
                            </div>
                        </div>
                    </section>

                    <section id="proceso-adopcion" className="scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <HeartHandshake className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-foreground">III. Proceso de Adopción y Requisitos</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-muted p-5 rounded-xl border border-border">
                                <h4 className="font-bold text-foreground mb-2">¿PawLig garantiza que mi solicitud de adopción será aprobada?</h4>
                                <p className="text-sm">No. Los albergues operan de manera autónoma y tienen sus propios criterios de selección. PawLig no interviene ni garantiza la aprobación de una solicitud, como se detalla en la <Link href="/terms#clausula-1" className="text-primary font-semibold hover:underline">Cláusula 1.2.1 de los Términos y Condiciones</Link>.</p>
                            </div>
                            <div className="bg-muted p-5 rounded-xl border border-border">
                                <h4 className="font-bold text-foreground mb-2">¿Qué pasa si la mascota adoptada presenta problemas de salud?</h4>
                                <p className="text-sm">PawLig no ofrece garantías sobre el temperamento o estado de salud de los animales. El proceso de convivencia y adaptación es un riesgo que el adoptante asume, como se indica en la <Link href="/terms#clausula-4" className="text-primary font-semibold hover:underline">Cláusula 4.1 de los Términos y Condiciones</Link>.</p>
                            </div>
                        </div>
                    </section>

                    <section id="gestion-datos" className="scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-foreground">IV. Gestión de Datos y Seguridad</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-muted p-5 rounded-xl border border-border">
                                <h4 className="font-bold text-foreground mb-2">¿Mis datos se comparten o se venden a terceros?</h4>
                                <p className="text-sm">No. PawLig mantiene un compromiso estricto de confidencialidad y no vende ni alquila sus datos, según la <Link href="/privacy#comparticion" className="text-primary font-semibold hover:underline">Sección 4 de la Política de Privacidad</Link>.</p>
                            </div>
                            <div className="bg-muted p-5 rounded-xl border border-border">
                                <h4 className="font-bold text-foreground mb-2">¿Cómo puedo ejercer mis derechos sobre mis datos (Habeas Data)?</h4>
                                <p className="text-sm">Puedes ejercer tus derechos (Conocer, Actualizar, Rectificar, etc.) enviando una solicitud a nuestro correo oficial de privacidad: <a href="mailto:asebasg07@gmail.com" className="text-primary font-semibold hover:underline">asebasg07@gmail.com</a>, como se explica en la <Link href="/privacy#derechos" className="text-primary font-semibold hover:underline">Sección 7 de la Política de Privacidad</Link>.</p>
                            </div>
                        </div>
                    </section>

                    <section id="cuentas-usuario" className="scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-foreground">V. Cuentas de Usuario</h2>
                        </div>
                        <div className="space-y-6">
                             <div className="bg-muted p-5 rounded-xl border border-border">
                                <h4 className="font-bold text-foreground mb-2">¿Qué tan segura es mi sesión?</h4>
                                <p className="text-sm">Su cuenta es personal e intransferible. Por seguridad, su sesión activa durará un máximo de 24 horas, como se detalla en la <Link href="/terms#clausula-2" className="text-primary font-semibold hover:underline">Cláusula 2.2 de los Términos y Condiciones</Link>.</p>
                            </div>
                            <div className="bg-muted p-5 rounded-xl border border-border">
                                <h4 className="font-bold text-foreground mb-2">¿Por qué mi cuenta podría ser suspendida o cerrada?</h4>
                                <p className="text-sm">Una cuenta puede ser cerrada por suministrar información falsa, realizar actividades ilícitas o por reportes de maltrato animal, de acuerdo a la <Link href="/terms#clausula-5" className="text-primary font-semibold hover:underline">Cláusula 5.2.1 de los Términos y Condiciones</Link>.</p>
                            </div>
                        </div>
                    </section>

                    <section id="ley-aplicable" className="scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <Scale className="text-primary" size={28} />
                            <h2 className="text-2xl font-bold text-foreground">VI. Ley Aplicable y Modificaciones</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-muted p-5 rounded-xl border border-border">
                                <h4 className="font-bold text-foreground mb-2">¿Cuál es la ley que rige el uso de PawLig?</h4>
                                <p className="text-sm">Los documentos legales se rigen por las leyes de la República de Colombia. Cualquier disputa se someterá a la jurisdicción de las autoridades colombianas, como se establece en la <Link href="/terms#clausula-6" className="text-primary font-semibold hover:underline">Cláusula 6.1 de los Términos y Condiciones</Link>.</p>
                            </div>
                        </div>
                    </section>

                    <section id="reporte-infraccion" className="scroll-mt-24 p-8 bg-slate-900 text-white rounded-3xl shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <Mail className="text-primary-foreground" size={28} />
                            <h2 className="text-2xl font-bold">¿Tienes otra pregunta o necesitas reportar algo?</h2>
                        </div>
                        <p className="opacity-80 text-sm mb-6">
                           Si encuentras un error técnico en la página, un usuario sospechoso o tienes alguna duda que no fue resuelta aquí, por favor contacta a nuestro equipo de soporte para que podamos tomar las medidas necesarias.
                        </p>
                        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                            <span className="text-xs font-semibold">support@pawlig.com</span>
                            <a href="mailto:support@pawlig.com?subject=Reporte%20desde%20la%20página%20de%20FAQ" className="flex items-center px-6 py-2 bg-card text-foreground text-xs font-bold rounded-lg hover:bg-primary hover:text-red-500 transition-all uppercase tracking-widest">
                                <Flag className="mr-2" size={22} />
                                Reportar infracción
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
