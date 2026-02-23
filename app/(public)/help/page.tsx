import React from "react";
import { Metadata } from "next";
import {
  ArrowLeft, HelpCircle, Info, Heart, Home, ShoppingBag, Wrench, Mail,
  ShieldCheck, UserPlus, CheckCircle2, MessageCircle,
  Clock, MapPin, Monitor, BookOpen, BarChart2, Settings, Lock,
  Zap, ChevronRight, Phone, Github,
} from "lucide-react";
import Link from "next/link";
import { AccordionSection } from "@/components/help/accordion-section";

export const metadata: Metadata = {
  title: "Centro de Ayuda - PawLig",
  description: "Manual de usuario completo y guías de ayuda para la plataforma PawLig.",
};

/* ──────────────────────────── Helpers de UI ──────────────────────────── */

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
      <ChevronRight size={15} className="text-primary shrink-0" />
      {title}
    </h3>
    <div className="pl-5 space-y-3">{children}</div>
  </div>
);

const Tip = ({ type, children }: { type: "info" | "warning" | "success"; children: React.ReactNode }) => {
  const styles = { info: "bg-blue-50 border-blue-200 text-blue-900", warning: "bg-amber-50 border-amber-200 text-amber-900", success: "bg-emerald-50 border-emerald-200 text-emerald-900" };
  const icons = { info: "💡", warning: "⚠️", success: "✅" };
  return (
    <div className={`p-3 rounded-xl border text-xs flex gap-2 ${styles[type]}`}>
      <span className="shrink-0">{icons[type]}</span>
      <p>{children}</p>
    </div>
  );
};

const Steps = ({ steps }: { steps: string[] }) => (
  <ol className="space-y-2">
    {steps.map((step, i) => (
      <li key={i} className="flex gap-3 text-sm">
        <span className="shrink-0 w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs">{i + 1}</span>
        <span className="text-slate-600 pt-0.5" dangerouslySetInnerHTML={{ __html: step }} />
      </li>
    ))}
  </ol>
);

/* ───────────────────────────── Página ───────────────────────────── */

export default function HelpPage() {
  const currentYear = new Date().getFullYear();
  const lastUpdate = "20 de febrero de 2026";

  return (
    <main className="container mx-auto px-4 py-16 max-w-5xl">
      {/* Back link */}
      <div className="mb-12">
        <Link href="/" className="group inline-flex items-center text-sm font-semibold text-primary hover:opacity-80 transition-all">
          <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
          Volver a la plataforma
        </Link>
      </div>

      {/* Hero */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 pb-8 border-b border-slate-100">
        <div className="p-4 bg-primary/10 rounded-2xl w-fit">
          <HelpCircle className="text-primary" size={40} />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Centro de Ayuda</h1>
          <p className="text-slate-500 font-medium">Manual de usuario completo y recursos de soporte para PawLig</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block space-y-4 sticky top-24 h-fit">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Contenido</h3>
          <nav className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            {[
              ["#introduccion", "1. Introducción"],
              ["#requisitos", "2. Requisitos del Sistema"],
              ["#acceso", "3. Acceso al Sistema"],
              ["#roles", "4. Roles de Usuario"],
              ["#adoptantes", "5. Guía Adoptantes"],
              ["#albergues", "6. Guía Albergues"],
              ["#vendedores", "7. Guía Vendedores"],
              ["#admin", "8. Administradores"],
              ["#troubleshooting", "9. Solución de Problemas"],
              ["#faq", "10. FAQ"],
              ["#contacto", "11. Soporte"],
              ["#glosario", "12. Glosario"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="hover:text-primary transition-colors py-0.5 hover:pl-1 transition-all">{label}</a>
            ))}
          </nav>
        </aside>

        {/* Contenido con acordeones */}
        <div className="lg:col-span-3 space-y-3">
          <p className="text-xs text-slate-400 font-medium italic mb-4">Última actualización: {lastUpdate} · Haz clic en cada sección para expandirla.</p>

          {/* ── 1. INTRODUCCIÓN ── */}
          <AccordionSection icon={<Info className="text-primary" size={20} />} number="1" id="introduccion" title="Introducción a PawLig" defaultOpen>
            <div className="bg-slate-50 p-5 rounded-2xl border-l-4 border-primary mb-4">
              <p className="text-sm"><strong>PawLig</strong> es una plataforma web integral para la adopción responsable de mascotas y comercio electrónico de productos para animales en el <strong>Valle de Aburrá</strong>. Conectamos albergues, adoptantes, vendedores y la comunidad en un solo espacio digital.</p>
            </div>
            <SubSection title="Misión del Manual">
              <p className="text-sm">Esta guía proporciona instrucciones paso a paso para utilizar todas las funcionalidades de PawLig, asegurando una experiencia óptima para cada tipo de usuario.</p>
            </SubSection>
            <SubSection title="Audiencia">
              <div className="grid grid-cols-2 gap-3">
                {[["🐾", "Adoptantes", "Personas que buscan adoptar una mascota"], ["🏠", "Albergues", "Entidades de rescate animal que publican mascotas"], ["🛒", "Vendedores", "Proveedores de productos para mascotas"], ["⚙️", "Administradores", "Personal encargado de supervisar el sistema"]].map(([emoji, name, desc]) => (
                  <div key={name} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <span className="text-lg">{emoji}</span>
                    <p className="font-bold text-slate-800 mt-1">{name}</p>
                    <p className="text-slate-500">{desc}</p>
                  </div>
                ))}
              </div>
            </SubSection>
            <SubSection title="Convenciones del documento">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span>💡 <strong>NOTA</strong>: Información adicional</span>
                <span>⚠️ <strong>ADVERTENCIA</strong>: Precaución</span>
                <span>✅ <strong>CONSEJO</strong>: Recomendaciones</span>
                <span>🌐 <strong>URL</strong>: Enlace de acceso</span>
              </div>
            </SubSection>
          </AccordionSection>

          {/* ── 2. REQUISITOS ── */}
          <AccordionSection icon={<Monitor className="text-primary" size={20} />} number="2" id="requisitos" title="Requisitos del Sistema">
            <SubSection title="Requisitos mínimos">
              <div className="overflow-hidden rounded-xl border border-slate-200">
                {[["Sistema Operativo", "Windows 10+, macOS 10.14+, Linux Ubuntu 20.04+, iOS 14+, Android 10+"], ["Memoria RAM", "4 GB mínimo (8 GB recomendado)"], ["Pantalla", "320px mínimo (móvil) · 1366×768px recomendado (escritorio)"], ["Internet", "10 Mbps o superior · Conexión estable requerida"]].map(([k, v]) => (
                  <div key={k} className="flex gap-4 px-4 py-2.5 text-xs border-b border-slate-100 last:border-0">
                    <span className="font-semibold text-slate-700 w-32 shrink-0">{k}</span>
                    <span className="text-slate-500">{v}</span>
                  </div>
                ))}
              </div>
            </SubSection>
            <SubSection title="Navegadores compatibles">
              <div className="grid grid-cols-2 gap-2">
                {["✅ Google Chrome 90+ (Recomendado)", "✅ Mozilla Firefox 88+", "✅ Safari 14+", "✅ Microsoft Edge 90+"].map(b => (
                  <div key={b} className="text-xs p-2 bg-emerald-50 rounded-lg border border-emerald-100">{b}</div>
                ))}
              </div>
              <Tip type="warning">Navegadores antiguos pueden presentar problemas de visualización o funcionalidad.</Tip>
            </SubSection>
            <SubSection title="Dispositivos soportados">
              <div className="flex gap-3 flex-wrap text-xs">
                {[["💻", "Escritorio y Laptops"], ["📱", "Tablets (iPad, Android)"], ["📱", "Smartphones"]].map(([icon, label]) => (
                  <div key={label} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">{icon} {label}</div>
                ))}
              </div>
              <Tip type="info">PawLig <strong>NO</strong> funciona sin conexión a internet (offline).</Tip>
            </SubSection>
          </AccordionSection>

          {/* ── 3. ACCESO ── */}
          <AccordionSection icon={<UserPlus className="text-primary" size={20} />} number="3" id="acceso" title="Acceso al Sistema">
            <SubSection title="3.1. URL de Acceso">
              <div className="p-3 bg-slate-900 text-white rounded-xl text-sm font-mono flex items-center gap-3">
                <span className="text-primary">🌐</span> https://pawlig.vercel.app
              </div>
            </SubSection>
            <SubSection title="3.2. Crear una cuenta (Adoptantes)">
              <Steps steps={['En la página de inicio, haga clic en <strong>"Registrarse"</strong>.', "Complete el formulario: correo electrónico, contraseña (mín. 8 caracteres), nombre completo, teléfono, municipio, dirección, cédula y fecha de nacimiento (mayor de 18 años).", 'Revise los datos y haga clic en <strong>"Registrarse"</strong>. Será redirigido a la galería de mascotas.']} />
              <Tip type="warning">El correo solo puede usarse una vez. Los Albergues y Vendedores deben solicitar cuenta especializada (ver secciones 6 y 7).</Tip>
            </SubSection>
            <SubSection title="3.3. Iniciar sesión">
              <Steps steps={['Haga clic en <strong>"Iniciar Sesión"</strong>.', "Ingrese su correo y contraseña.", "El sistema lo redirigirá según su rol: Adoptante → Panel de Usuario · Albergue → Panel del Albergue · Vendedor → Panel del Vendedor · Administrador → Panel Administrativo."]} />
              <Tip type="warning">Después de 3 intentos fallidos, su cuenta se bloqueará temporalmente 15 minutos. La sesión dura máximo 24 horas.</Tip>
            </SubSection>
            <SubSection title="3.4. Recuperar contraseña">
              <Steps steps={['Haga clic en <strong>"¿Olvidaste tu contraseña?"</strong> en la pantalla de Login.', "Ingrese su correo registrado y haga clic en \"Enviar enlace\".", "Revise su correo (también spam). El enlace es válido por 1 hora.", "Cree su nueva contraseña y confirme. Luego inicie sesión normalmente."]} />
            </SubSection>
            <SubSection title="3.5. Cerrar sesión">
              <Steps steps={["Haga clic en su nombre/foto en la esquina superior derecha.", 'Seleccione <strong>"Cerrar Sesión"</strong>. Será redirigido a la página de inicio.']} />
              <Tip type="success">Siempre cierre sesión en computadoras compartidas.</Tip>
            </SubSection>
          </AccordionSection>

          {/* ── 4. ROLES ── */}
          <AccordionSection icon={<ShieldCheck className="text-primary" size={20} />} number="4" id="roles" title="Roles de Usuario">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["bg-emerald-500", "Adoptante", "Rol base. Buscar mascotas, guardar favoritos, postularse para adopción y comprar en el marketplace."],
                ["bg-blue-500", "Albergue", "Publicar mascotas, gestionar postulaciones, aprobar adopciones y ver métricas."],
                ["bg-purple-500", "Vendedor", "Gestionar catálogo de productos, inventario y seguimiento de pedidos."],
                ["bg-slate-900", "Administrador", "Control total: gestión de usuarios, aprobaciones institucionales y auditoría."],
              ].map(([color, name, desc]) => (
                <div key={name} className="p-5 border border-slate-100 rounded-2xl hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 ${color} rounded-full`} />
                    <h4 className="font-bold text-sm">{name}</h4>
                  </div>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </AccordionSection>

          {/* ── 5. ADOPTANTES ── */}
          <AccordionSection icon={<Heart className="text-primary" size={20} />} number="5" id="adoptantes" title="Guía para Adoptantes">
            <SubSection title="5.1. Panel del Usuario">
              <p className="text-sm">Acceda haciendo clic en su nombre o en <strong>&quot;Mi Panel&quot;</strong>. Desde aquí puede ver favoritas, seguir postulaciones, revisar el historial de compras y actualizar su perfil.</p>
            </SubSection>
            <SubSection title="5.2. Buscar mascotas">
              <Steps steps={['Haga clic en <strong>&quot;Adopciones&quot;</strong> en el menú principal.', "Use los filtros: Especie · Municipio · Edad · Sexo · Estado (Disponible / En proceso).", "Los resultados muestran foto, nombre, edad, municipio, albergue y estado."]} />
              <Tip type="success">Si no encuentra resultados, amplíe los criterios de búsqueda o elimine algunos filtros.</Tip>
            </SubSection>
            <SubSection title="5.3. Ver detalles de una mascota">
              <p className="text-sm">Haga clic en cualquier tarjeta de mascota para ver: galería de fotos, especie, raza, edad, sexo, descripción de carácter, requisitos de adopción, estado de salud e información del albergue. Desde aquí puede guardar como favorita, postularse y contactar al albergue.</p>
            </SubSection>
            <SubSection title="5.4. Guardar mascotas favoritas">
              <Steps steps={["Haga clic en el ícono de corazón ❤ en la tarjeta o página de detalles.", "El corazón se rellenará indicando que se guardó.", 'Para ver sus favoritas vaya a su panel → <strong>"Mis Favoritos"</strong>.', "Para eliminarla de favoritos, haga clic nuevamente en el corazón."]} />
            </SubSection>
            <SubSection title="5.5. Postularse para una adopción">
              <Steps steps={['En la página de detalles, haga clic en <strong>"Postularme para Adoptar"</strong>.', "Complete el formulario: mensaje al albergue, confirmación de requisitos y aceptación de términos.", 'Haga clic en <strong>"Enviar Postulación"</strong>.', "El albergue recibirá su solicitud. Recibirá notificación por email cuando responda."]} />
              <Tip type="warning">Solo puede postularse UNA VEZ por mascota. La postulación NO garantiza la adopción; el albergue debe aprobar su solicitud.</Tip>
            </SubSection>
            <SubSection title="5.6. Contactar al albergue">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="font-bold mb-1">Opción 1 – WhatsApp</p>
                  <p className="text-slate-600">Haga clic en &quot;Contactar Albergue&quot; → &quot;WhatsApp&quot;. Se abre con un mensaje predeterminado que puede modificar.</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <p className="font-bold mb-1">Opción 2 – Instagram</p>
                  <p className="text-slate-600">Haga clic en &quot;Contactar Albergue&quot; → &quot;Instagram&quot;. Se abre el perfil del albergue para chat directo.</p>
                </div>
              </div>
              <Tip type="info">PawLig NO almacena historial de mensajes. Las conversaciones ocurren en WhatsApp o Instagram.</Tip>
            </SubSection>
            <SubSection title="5.7. Seguimiento de postulaciones">
              <Steps steps={['Vaya a su panel → <strong>"Mis Postulaciones"</strong>.', "Verá el estado: 🟡 Pendiente · 🟢 Aprobada · 🔴 Rechazada.", "Haga clic en cualquier postulación para ver más detalles."]} />
            </SubSection>
            <SubSection title="5.8–5.10. Compras, carrito y checkout">
              <Steps steps={['Vaya a <strong>"Productos"</strong> y use los filtros (categoría, precio, vendedor).', 'Haga clic en un producto, seleccione cantidad y haga clic en <strong>"Agregar al Carrito"</strong>.', "Desde el ícono del carrito 🛒 puede ver productos, modificar cantidades (+/−) y eliminar items.", 'Haga clic en <strong>"Finalizar Compra"</strong>, verifique su dirección y método de pago simulado y confirme el pedido.', "Recibirá un email con el número de orden y los datos del vendedor para coordinar entrega real."]} />
              <Tip type="warning">PawLig simula el proceso de compra con fines demostrativos. NO se procesan pagos reales.</Tip>
            </SubSection>
          </AccordionSection>

          {/* ── 6. ALBERGUES ── */}
          <AccordionSection icon={<Home className="text-primary" size={20} />} number="6" id="albergues" title="Guía para Albergues">
            <SubSection title="6.1. Solicitar cuenta de albergue">
              <Steps steps={["Inicie sesión con una cuenta de adoptante.", 'Vaya a su panel → <strong>"Solicitar Albergue"</strong>.', "Complete: datos del representante (nombre, ID, teléfono, dirección) · datos de la entidad (nombre legal, NIT, municipio, misión) · métodos de contacto (WhatsApp e Instagram).", "Un administrador revisará en 2–3 días laborables y recibirá respuesta por email."]} />
              <Tip type="warning">Solo albergues legalmente constituidos pueden solicitar este tipo de cuenta. Información falsa resultará en rechazo permanente.</Tip>
            </SubSection>
            <SubSection title="6.2. Panel del albergue">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {["Publicar mascotas para adopción", "Ver y editar mascotas publicadas", "Gestionar postulaciones de adoptantes", "Generar reportes de adopciones", "Actualizar perfil y métodos de contacto"].map(f => (
                  <div key={f} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"><CheckCircle2 size={12} className="text-primary shrink-0" />{f}</div>
                ))}
              </div>
            </SubSection>
            <SubSection title="6.3. Publicar una mascota">
              <Steps steps={['Haga clic en <strong>&quot;Publicar Mascota&quot;</strong>.', "Complete información básica: Nombre, Especie, Raza, Edad y Sexo.", "Escriba una descripción del carácter y personalidad (20–500 caracteres).", "Indique requisitos para la adopción (espacio, experiencia, etc.).", "Marque el estado de salud (vacunado/esterilizado).", "Suba al menos 1 foto (JPEG/PNG, máx. 5 MB). Se recomiendan 3–5 fotos.", 'Haga clic en <strong>&quot;Publicar&quot;</strong>. La mascota aparece inmediatamente en la galería pública.']} />
            </SubSection>
            <SubSection title="6.3.1. Refinamiento con IA">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100 text-xs">
                <p className="font-bold text-purple-800 mb-2 flex items-center gap-1"><Zap size={13} /> Inteligencia Artificial</p>
                <p className="text-slate-600">Escriba una descripción básica y haga clic en <strong>&quot;Refinar con IA&quot;</strong>. El sistema presentará una propuesta más clara y empática. Puede aceptarla o cancelar para mantener su texto original.</p>
              </div>
            </SubSection>
            <SubSection title="6.4. Editar mascota">
              <Steps steps={['Vaya a <strong>&quot;Mis Mascotas&quot;</strong> → icono de lápiz ✏ sobre la mascota.', "Modifique los campos necesarios. Para cambiar fotos: use \"Agregar más fotos\" o haga clic en la X para eliminar.", 'Haga clic en <strong>&quot;Guardar Cambios&quot;</strong>.']} />
            </SubSection>
            <SubSection title="6.5. Estados de la mascota">
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[["🟢 Disponible", "Lista para adopción. Visible en búsquedas."], ["🟡 En Proceso", "Con postulación en revisión. Oculta de búsquedas."], ["⚫ Adoptada", "Con hogar definitivo. Oculta de búsquedas."]].map(([s, d]) => (
                  <div key={s} className="p-2 bg-slate-50 rounded-xl border border-slate-100"><p className="font-bold mb-1">{s}</p><p className="text-slate-500">{d}</p></div>
                ))}
              </div>
            </SubSection>
            <SubSection title="6.6–6.7. Gestionar y resolver postulaciones">
              <Steps steps={['Vaya a <strong>"Postulaciones"</strong> en su panel.', "Haga clic en \"Ver Detalles\" para revisar datos del adoptante y su mensaje.", "<strong>Aprobar:</strong> haga clic en \"Aprobar\" y confirme. El adoptante recibe un email.", "<strong>Rechazar:</strong> haga clic en \"Rechazar\", ingrese motivo (obligatorio) y confirme."]} />
            </SubSection>
            <SubSection title="6.8. Reportes de adopciones">
              <Steps steps={['Vaya a <strong>&quot;Reportes&quot; → &quot;Historial de Adopciones&quot;</strong>.', "Configure filtros: fechas, municipio y estado.", 'Haga clic en <strong>&quot;Generar Reporte&quot;</strong> para ver métricas, gráficos y totales.', 'Exporte con <strong>&quot;Descargar Excel&quot;</strong>.']} />
            </SubSection>
            <SubSection title="6.9. Actualizar perfil del albergue">
              <p className="text-sm">Vaya a su nombre → <strong>&quot;Mi Perfil&quot;</strong>. Puede actualizar: descripción, dirección, WhatsApp, Instagram y logo.</p>
              <Tip type="warning">Mantenga WhatsApp e Instagram actualizados; son los canales de contacto con los adoptantes.</Tip>
            </SubSection>
          </AccordionSection>

          {/* ── 7. VENDEDORES ── */}
          <AccordionSection icon={<ShoppingBag className="text-primary" size={20} />} number="7" id="vendedores" title="Guía para Vendedores">
            <SubSection title="7.1. Solicitar cuenta de vendedor">
              <Steps steps={['Haga clic en <strong>"¿Eres vendedor?"</strong> en la página de inicio.', "Complete datos personales (correo, contraseña, nombre, teléfono, cédula) y datos del negocio (nombre comercial, NIT/RUT, municipio, dirección, descripción de productos, logo opcional).", "Un administrador revisará en 2–3 días laborables."]} />
            </SubSection>
            <SubSection title="7.2. Agregar productos">
              <Steps steps={['En su panel, vaya a <strong>"Mis Productos" → "Agregar Producto"</strong>.', "Complete: nombre, categoría, precio (COP) y stock disponible.", "Escriba una descripción detallada (características, uso). Mín. 20 caracteres.", "Suba al menos 1 foto (JPEG/PNG, máx. 5 MB). Se recomiendan 2–3 ángulos.", 'Haga clic en <strong>"Publicar Producto"</strong>.']} />
              <Tip type="success">Use fotos con fondo blanco para mayor profesionalismo.</Tip>
            </SubSection>
            <SubSection title="7.3. Gestionar inventario">
              <Steps steps={['Vaya a <strong>"Mis Productos"</strong> → ícono de lápiz sobre el producto.', "Actualice el campo \"Stock disponible\" y cualquier otro dato que necesite cambiar.", 'Haga clic en <strong>"Guardar Cambios"</strong>.']} />
              <Tip type="info">Si el stock llega a 0, el producto se marca automáticamente como &quot;Agotado&quot;. El stock se descuenta automáticamente con cada compra completada.</Tip>
            </SubSection>
            <SubSection title="7.4–7.5. Órdenes y reportes de ventas">
              <Steps steps={['Vaya a <strong>"Órdenes"</strong> para ver pedidos con: número, fecha, cliente, productos, total y estado.', "Haga clic en \"Ver Detalles\" para acceder a datos de contacto, dirección y método de pago del cliente.", 'Actualice el estado de la orden con el dropdown: Pendiente → Confirmada → Enviada → Entregada.', 'Vaya a <strong>"Reportes" → "Ventas"</strong> para ver métricas, productos más vendidos y exportar a Excel.']} />
            </SubSection>
          </AccordionSection>

          {/* ── 8. ADMIN ── */}
          <AccordionSection icon={<Settings className="text-primary" size={20} />} number="8" id="admin" title="Guía para Administradores">
            <div className="p-4 bg-slate-900 text-white rounded-2xl mb-4">
              <p className="font-bold text-sm mb-2 flex items-center gap-2"><Lock size={14} className="text-primary" /> Acceso restringido al rol Administrador</p>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {["Gestionar todos los usuarios", "Aprobar/rechazar solicitudes", "Bloquear usuarios", "Ver métricas globales", "Configurar categorías de productos", "Moderar contenido"].map(f => (
                  <div key={f} className="flex items-center gap-1.5 bg-white/10 p-1.5 rounded-lg"><ChevronRight size={11} className="text-primary shrink-0" />{f}</div>
                ))}
              </div>
            </div>
            <SubSection title="8.1. Gestionar usuarios">
              <Steps steps={['En el panel administrativo, haga clic en <strong>"Usuarios"</strong>.', "Verá todos los usuarios con: nombre, email, rol, fecha de registro y estado.", "Use filtros por rol, municipio, estado o nombre/email.", 'Desde <strong>"Ver Perfil"</strong> puede ver actividad completa, cambiar rol y bloquear/desbloquear la cuenta.']} />
            </SubSection>
            <SubSection title="8.2. Aprobar solicitudes (Albergues y Vendedores)">
              <Steps steps={['Vaya a <strong>"Albergues" → "Solicitudes Pendientes"</strong> (o "Vendedores").', "Revise la información: representante, entidad, NIT, descripción.", "<strong>APROBAR:</strong> haga clic en \"Aprobar\" y confirme. El sistema envía email al solicitante.", "<strong>RECHAZAR:</strong> ingrese un motivo claro, confirme. El sistema notifica con el motivo."]} />
              <Tip type="success">Verifique la legitimidad del albergue buscando su NIT en registros públicos.</Tip>
            </SubSection>
            <SubSection title="8.3. Bloquear usuarios">
              <Steps steps={["Localice el usuario y haga clic en \"Bloquear Usuario\".", "Ingrese el motivo (obligatorio): contenido inapropiado, fraude, comportamiento abusivo o violación de términos.", "Confirme. El sistema desactiva la cuenta, oculta sus publicaciones y notifica al usuario."]} />
              <Tip type="warning">Use esta función solo en casos justificados. Puede desbloquear desde la misma sección.</Tip>
            </SubSection>
            <SubSection title="8.4. Dashboard de métricas">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {["Total de usuarios", "Albergues activos", "Vendedores activos", "Mascotas (disponibles vs adoptadas)", "Total de adopciones", "Total de órdenes"].map(m => (
                  <div key={m} className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-1.5"><BarChart2 size={12} className="text-primary shrink-0 mt-0.5" />{m}</div>
                ))}
              </div>
            </SubSection>
            <SubSection title="8.5. Configurar categorías de productos">
              <Steps steps={['Vaya a <strong>"Configuración" → "Categorías de Productos"</strong>.', '<strong>Agregar:</strong> "Nueva Categoría" → nombre → descripción opcional → "Crear".', "<strong>Editar:</strong> ícono de editar → modifique → guarde.", "<strong>Eliminar:</strong> el sistema advierte si hay productos usando esa categoría (debe reasignarlos antes)."]} />
            </SubSection>
          </AccordionSection>

          {/* ── 9. TROUBLESHOOTING ── */}
          <AccordionSection icon={<Wrench className="text-primary" size={20} />} number="9" id="troubleshooting" title="Solución de Problemas">
            <div className="space-y-5">
              {[
                { category: "Problemas de Acceso", items: [["No puedo iniciar sesión", "Verifique email y contraseña · Compruebe que su cuenta no esté bloqueada · Use la recuperación de contraseña · Limpie caché y cookies del navegador."], ["Mi cuenta fue bloqueada", "Revise el correo de notificación · Contacte a soporte: soporte@pawlig.com · No cree cuentas duplicadas (bloqueo permanente)."], ["No recibí el email de recuperación", "Revise la carpeta de spam · Espere hasta 10 minutos · Verifique que el email sea el correcto."]] },
                { category: "Problemas con Imágenes", items: [["No puedo subir fotos", "Use solo JPEG o PNG · Verifique que el archivo sea menor a 5 MB · Use herramientas de compresión."], ["Imágenes borrosas o de baja calidad", "Suba imágenes de mín. 800×600px · No use capturas de pantalla · Tome fotos con buena iluminación."]] },
                { category: "Problemas con el Carrito", items: [["No puedo agregar productos", "Verifique que el producto tenga stock · Asegúrese de haber iniciado sesión."], ["Los productos desaparecen del carrito", "El carrito se limpia al cerrar sesión (comportamiento esperado) · Expira después de 24 horas de inactividad."]] },
                { category: "Problemas de Rendimiento", items: [["El sitio carga muy lento", "Verifique su conexión (mín. 10 Mbps) · Cierre otras pestañas · Limpie caché · Actualice su navegador."], ["Las imágenes tardan en cargar", "Normal con conexiones lentas. Las imágenes se optimizan automaticamente. Use WiFi en lugar de datos móviles."]] },
                { category: "Errores Comunes", items: [['"Este email ya está registrado"', "Use otro email o recupere su contraseña."], ['"Contraseña muy corta"', "Use al menos 8 caracteres con mayúsculas, minúsculas y números."], ['"Mascota no disponible"', "La mascota ya fue adoptada o el albergue cambió su estado."], ['"No tienes permisos"', "Verifique su rol o contacte a un administrador."]] },
              ].map(({ category, items }) => (
                <div key={category} className="border border-slate-100 rounded-2xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-3 font-bold text-slate-700 text-sm">{category}</div>
                  <div className="p-4 space-y-3">
                    {items.map(([problem, solution]) => (
                      <div key={problem}>
                        <span className="font-bold text-sm text-slate-800 block mb-0.5">{problem}</span>
                        <p className="text-xs text-slate-500">{solution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AccordionSection>

          {/* ── 10. FAQ ── */}
          <AccordionSection icon={<MessageCircle className="text-primary" size={20} />} number="10" id="faq" title="Preguntas Frecuentes (FAQ)">
            <div className="space-y-2.5">
              {[
                ["¿PawLig es gratis para usuarios?", "Sí, crear una cuenta y usar la plataforma es completamente gratuito para adoptantes y albergues."],
                ["¿Debo pagar para adoptar una mascota?", "No. La adopción es gratuita. Cada albergue puede tener sus propias políticas (ej. donación voluntaria para vacunas)."],
                ["¿Las compras en la tienda son reales?", "El sistema simula el proceso de compra. El vendedor coordinará el pago y entrega real fuera de la plataforma."],
                ["¿Cómo contacto a un albergue?", "Después de postularse, use los botones de WhatsApp o Instagram en la página de la mascota."],
                ["¿Puedo postularme a varias mascotas?", "Sí, pero sea responsable. Solo postúlese a mascotas que realmente pueda adoptar."],
                ["¿Cuánto tarda la aprobación de una postulación?", "Depende de cada albergue. Generalmente entre 2–5 días laborables. Recibirá notificación por email."],
                ["¿Puedo cancelar una postulación?", "Actualmente no hay opción de cancelar. Comuníquese con el albergue directamente para informarles."],
                ["¿Puedo cambiar mi rol de Adoptante a Albergue?", "No directamente. Debe crear una solicitud de albergue por separado."],
                ["¿Es seguro usar PawLig?", "Sí. Usamos encriptación HTTPS, contraseñas con hash bcrypt y sesiones JWT seguras."],
                ["¿PawLig tiene aplicación móvil?", "No por el momento. El sitio web es completamente responsive y funciona perfectamente en navegadores móviles."],
                ["¿Cómo reporto contenido inapropiado?", "Contacte a soporte.pawlig@gmail.com con detalles y capturas de pantalla del contenido."],
              ].map(([q, a]) => (
                <div key={q} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-900 text-sm mb-1">{q}</p>
                  <p className="text-xs text-slate-600">{a}</p>
                </div>
              ))}

              {/* CTA a /faq */}
              <div className="mt-4 p-1 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 rounded-[2.5rem]">
                <div className="p-7 bg-white rounded-[2.4rem] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                      <HelpCircle className="text-primary" size={20} /> ¿Buscas algo más específico?
                    </h4>
                    <p className="text-slate-600 text-sm mb-4">Explora nuestra base de conocimientos con dudas técnicas, procesos legales y seguridad.</p>
                    <Link href="/faq" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-primary/20 hover:opacity-95 active:scale-95 transition-all text-sm">
                      Ir al FAQ completo
                      <ArrowLeft size={16} className="ml-2 rotate-180" />
                    </Link>
                  </div>
                  <div className="hidden lg:flex w-24 h-24 items-center justify-center bg-primary/5 rounded-full relative shrink-0">
                    <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full animate-[spin_20s_linear_infinite]" />
                    <MessageCircle className="text-primary opacity-40" size={38} />
                  </div>
                </div>
              </div>
            </div>
          </AccordionSection>

          {/* ── 11. SOPORTE ── */}
          <AccordionSection icon={<Mail className="text-primary" size={20} />} number="11" id="contacto" title="Soporte Directo">
            <p className="text-sm text-slate-600 mb-5">¿No encontró lo que buscaba? Nuestro equipo de soporte técnico está disponible para ayudarle.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {[[Mail, "Correo Electrónico", "soporte@pawlig.com"], [Phone, "Teléfono", "+57 (4) 123-4567"], [Clock, "Horario de Atención", "Lun–Vie, 8:00 AM – 6:00 PM"], [MapPin, "Sede", "Universidad de San Buenaventura, Bello, Antioquia, Colombia"]].map(([Icon, label, value]) => (
                <div key={label as string} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Icon className="text-primary shrink-0" size={18} />
                  <div>
                    <span className="block text-xs text-slate-500">{label as string}</span>
                    <span className="font-bold text-sm">{value as string}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm">
              <p className="font-bold mb-2 text-xs uppercase tracking-widest text-slate-500">Equipo de Desarrollo</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <span>👨‍💻 Andrés Sebastián Ospina Guzmán <span className="text-xs text-slate-400">(Líder)</span></span>
                <span>👨‍💻 Mateo Úsuga Vasco <span className="text-xs text-slate-400">(Desarrollador)</span></span>
                <span>🎨 Santiago Lezcano Escobar <span className="text-xs text-slate-400">(Diseño y QA)</span></span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200/60">
                <p className="font-bold mb-2 text-xs uppercase tracking-widest text-slate-500">Código Fuente</p>
                <a href="https://github.com/asebasg/pawlig" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                  <Github size={14} />
                  <span>github.com/asebasg/pawlig</span>
                </a>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 text-right mt-4 font-bold tracking-widest uppercase">© {currentYear} PawLig v1.6.0 Stable</p>
          </AccordionSection>

          {/* ── 12. GLOSARIO ── */}
          <AccordionSection icon={<BookOpen className="text-primary" size={20} />} number="12" id="glosario" title="Glosario de Términos">
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
              {[
                ["Adoptante", "Usuario registrado que busca adoptar una mascota."],
                ["Albergue", "Entidad de rescate animal verificada que publica mascotas para adopción."],
                ["Badge", "Etiqueta visual que indica el estado de una mascota (Disponible, En Proceso, Adoptado)."],
                ["Carrito", "Espacio virtual donde se acumulan productos antes de finalizar la compra."],
                ["Cloudinary", "Servicio de almacenamiento de imágenes utilizado por PawLig."],
                ["Dashboard", "Panel de control personalizado según el rol del usuario."],
                ["JWT (JSON Web Token)", "Tecnología de autenticación que mantiene su sesión segura."],
                ["Mascota Favorita", "Mascota guardada en su lista personal para acceso rápido."],
                ["Municipio", "Uno de los 10 municipios del Valle de Aburrá donde opera PawLig."],
                ["Postulación", "Solicitud formal para adoptar una mascota específica."],
                ["Rol", "Nivel de permisos de un usuario (Adoptante, Albergue, Vendedor, Admin)."],
                ["Stock", "Cantidad disponible de un producto en inventario."],
                ["Valle de Aburrá", "Región de 10 municipios: Medellín, Bello, Itagüí, Envigado, Sabaneta, La Estrella, Caldas, Copacabana, Girardota y Barbosa."],
                ["Vendedor", "Proveedor de productos para mascotas con cuenta verificada."],
              ].map(([term, def]) => (
                <div key={term} className="flex gap-4 px-4 py-2.5 text-xs hover:bg-slate-50 transition-colors">
                  <span className="font-bold text-slate-800 w-40 shrink-0">{term}</span>
                  <span className="text-slate-500">{def}</span>
                </div>
              ))}
            </div>
          </AccordionSection>

        </div>
      </div>
    </main>
  );
}
