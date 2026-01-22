# HISTORIAS DE USUARIO (SCRUM)

## Índice

1. Gestión de usuarios
2. Funcionalidades principales
3. Consulta y reportes
4. Administración

---

## 1. Gestión de usuarios

**HU-001: Registro de nuevo adoptante**

- **Como** adoptante potencial.
- **Quiero** poder registrarme en la plataforma con mi correo electrónico.
- **Para** guardar mis mascotas favoritas y aplicar formalmente a adopciones.
- **Prioridad**: Alta
- **Estimación**: 5 puntos
- **Sprint**: 1
- **Criterios de aceptación**:
  - Dado que soy un visitante nuevo,  
    cuando ingreso con mi correo y contraseña válidos,  
    entonces el sistema crea mi perfil de adoptante y me redirige a la galería de adopciones.
  - Dado que ingreso un correo que ya se encuentra registrado,  
    cuando intento registrarme,  
    entonces el sistema muestra _"Este correo ya está registrado"_ y me sugiere la recuperación de contraseña.
  - Dado que la contraseña que ingresé es menor a 8 caracteres o es débil,  
    cuando presiono el botón de registro,  
    entonces el sistema muestra un error de seguridad y no completa el registro.
- **Notas**: El sistema debe permitir el inicio de sesión para el rol de Adoptante inmediatamente después del registro.

**HU-002: Solicitud y aprobación de cuenta de albergue o entidad de rescate**

- **Como** representante de albergue o entidad de rescate.
- **Quiero** completar un formulario de solicitud de cuenta especializada.
- **Para** que el administrador del sistema me autorice a publicar mascotas y gestionar solicitudes de adopción dentro del Valle de Aburrá.
- **Prioridad**: Alta
- **Estimación**: 3 puntos
- **Sprint**: 1
- **Criterios de aceptación**:
  - Dado que soy un representante de una entidad de rescate (albergue o fundación),  
    cuando envío el formulario de solicitud de cuenta con todos los datos requeridos (incluyendo ciudad/municipio del Valle de Aburrá y contacto),  
    entonces la cuenta queda en estado _"Pendiente de aprobación"_ y se notifica al administrador.
  - Dado que envío el formulario sin completar todos los campos obligatorios,  
    cuando intento enviar la solicitud,  
    entonces el sistema me muestra los campos faltantes y no envía la solicitud.
  - Dado que mi cuenta de Albergue ha sido aprobada por el Administrador,  
    cuando ingreso mis credenciales,  
    entonces accedo al panel de gestión de mascotas.
  - Dado que mi cuenta de Albergue ha sido rechazada por el Administrador,  
    cuando intento iniciar sesión,  
    entonces se me notifica el rechazo con la justificación enviada al correo.

**HU-003: Actualización de perfil de vendedor**

- **Como** proveedor de productos y servicios para mascotas.
- **Quiero** actualizar mi perfil, información de contacto y descripción de mi negocio.
- **Para** asegurar que la información de mi catálogo esté correcta y sea atractiva para los adoptantes.
- **Prioridad**: Alta
- **Estimación**: 2 puntos
- **Sprint**: 2
- **Criterios de aceptación**:
  - Dado que estoy en la sección de edición de perfil de mi negocio,  
    cuando edito mi información y la guardo,  
    entonces el sistema guarda los cambios y los aplica inmediatamente a mi tienda visible.
  - Dado que intento actualizar un campo obligatorio y lo dejo vacío,  
    cuando guardo los cambios,  
    entonces el sistema me notifica qué campo debe ser completado antes de guardar.
  - Dado que cargo una nueva foto de perfil para mi negocio,  
    cuando la imagen excede el tamaño máximo permitido (definido en el sistema),  
    entonces el sistema rechaza la subida y sugiere reducir el tamaño.
  - Dado que actualizo mi ubicación dentro del Valle de Aburrá,  
    cuando guardo los cambios,  
    entonces el sistema valida que la ubicación pertenezca a un municipio del Valle de Aburrá.

**HU-004: Visualización del Panel de Usuario**

- **Como** adoptante registrado.
- **Quiero** acceder a mi panel de usuario personal.
- **Para** ver mis mascotas favoritas guardadas, el estado de mis solicitudes de adopción activas y realizar seguimiento a mis procesos.
- **Prioridad**: Alta
- **Estimación**: 2 puntos
- **Sprint**: 2
- **Criterios de aceptación**:
  - Dado que he iniciado sesión como adoptante,  
    cuando accedo a la sección _"Mi Perfil"_ o _"Mi Panel"_,  
    entonces veo una lista de las mascotas que marqué como favoritas y el estado (_pendiente, en proceso, rechazado, aprobado_) de mis solicitudes de adopción.
  - Dado que el estado de una de mis solicitudes de adopción ha cambiado,  
    cuando consulto el panel,  
    entonces el sistema me muestra una notificación destacada de la actualización del estado.
  - Dado que hago clic en una mascota marcada como favorita,  
    cuando navego a su perfil,  
    entonces accedo directamente a la información completa de la mascota y del albergue o entidad de rescate.
  - Dado que no tengo mascotas favoritas ni solicitudes activas,  
    cuando accedo a mi panel,  
    entonces el sistema muestra mensajes orientadores y sugerencias para comenzar a explorar mascotas disponibles.

---

## 2. Funcionalidades principales

**HU-005: Publicación y gestión de mascota en adopción**

- **Como** representante de albergue o entidad de rescate activo.
- **Quiero** registrar, editar y archivar activos completos de mascotas, incluyendo fotos, descripción y requisitos.
- **Para** que la mascota sea visible y activa en la galería principal y pueda encontrar un hogar en el Valle de Aburrá.
- **Prioridad**: Alta
- **Estimación**: 8 puntos
- **Sprint**: 2
- **Criterios de aceptación**:
  - Dado que ingreso todos los datos obligatorios de la mascota (incluyendo ubicación en el Valle de Aburrá) y al menos una foto,  
    cuando guardo la publicación,  
    entonces la mascota queda visible inmediatamente en la galería con estado _"Disponible"_.
  - Dado que edito la publicación de una mascota,  
    cuando cambio su estado de _"Disponible"_ a _"Adoptado"_ o _"Archivado"_,  
    entonces la publicación se retira de los resultados de búsqueda activos.
  - Dado que intento subir una foto que no cumple con el formato o está corrupta,  
    cuando intento guardar la publicación,  
    entonces el sistema rechaza la foto y solicita un archivo válido (JPEG/PNG).

**HU-006: Filtro y búsqueda de mascotas**

- **Como** adoptante potencial o usuario anónimo.
- **Quiero** poder filtrar las mascotas disponibles por múltiples criterios (ej. especie, tamaño, municipio del Valle de Aburrá).
- **Para** encontrar rápidamente el tipo de animal que busco en el Valle de Aburrá.
- **Prioridad**: Alta
- **Estimación**: 5 puntos
- **Sprint**: 1
- **Criterios de aceptación**:
  - Dado que visito la página principal de adopciones,  
    cuando aplico filtros de Especie, Tamaño y Municipio simultáneamente,  
    entonces solo se muestran las mascotas que cumplen con todos los criterios seleccionados.
  - Dado que no hay mascotas que cumplan con los filtros seleccionados,  
    cuando ejecuto la búsqueda,  
    entonces el sistema muestra un mensaje de _"No se encontraron resultados"_ y sugiere ampliar el criterio.
  - Dado que limpio todos los filtros,  
    cuando presiono buscar,  
    entonces se restablece la lista completa de todas las mascotas disponibles en la plataforma.

**HU-007: Postulación formal y seguimiento**

- **Como** adoptante registrado.
- **Quiero** poder enviar una solicitud de adopción a una mascota específica.
- **Para** iniciar el proceso formal de contacto y evaluación con el Albergue.
- **Prioridad**: Alta
- **Estimación**: 5 puntos
- **Sprint**: 3
- **Criterios de aceptación**:
  - Dado que he enviado una postulación con información completa,  
    cuando el albergue acepta la solicitud de adopción,  
    entonces el albergue recibe la solicitud en su panel y el estado de la mascota cambia a _"En Proceso"_ para ese adoptante.
  - Dado que intento postularme a una mascota ya adoptada,  
    cuando hago clic en el botón _"Postularme"_,  
    entonces el sistema muestra un mensaje indicando que la mascota ya no está disponible.
  - Dado que el albergue rechaza mi solicitud,  
    cuando reviso el estado en mi panel,  
    entonces el sistema muestra el estado _"Rechazado"_ y el adoptante recibe una notificación por correo.

**HU-008: Sistema de comunicación directa mediante redes sociales**

- **Como** representante de albergue o entidad de rescate o adoptante.
- **Quiero** acceder a un botón que me redirija a WhatsApp o Instagram del albergue.
- **Para** realizar la entrevista de adopción, seguimiento o resolver dudas de forma directa mediante la red social de mi preferencia.
- **Prioridad**: Alta
- **Estimación**: 3 puntos _(reducido de 8 – no hay desarrollo de chat interno)_
- **Sprint**: 2 _(adelantado de 3 – funcionalidad más simple)_
- **Criterios de aceptación**:
  - Dado que soy un adoptante y visualizo el perfil de una mascota,  
    cuando hago clic en el botón _"Contactar albergue"_,  
    entonces se despliega un modal o menú con las opciones de contacto disponibles (WhatsApp y/o Instagram) del albergue, con enlaces directos que abren la aplicación correspondiente.
  - Dado que el albergue ha configurado su número de WhatsApp,  
    cuando selecciono la opción de WhatsApp,  
    entonces se abre WhatsApp Web o la aplicación móvil con el número del albergue precargado y un mensaje predeterminado: _"Hola, me interesa adoptar a [nombre mascota] desde PawLig"_.
  - Dado que el albergue ha configurado su usuario de Instagram,  
    cuando selecciono la opción de Instagram,  
    entonces se abre Instagram Web o la aplicación móvil en el perfil del albergue, permitiéndome iniciar un mensaje directo.
  - Dado que el albergue NO ha configurado ningún método de contacto (WhatsApp e Instagram vacíos),  
    cuando intento contactar al albergue,  
    entonces el sistema muestra un mensaje: _"Este albergue aún no tiene métodos de contacto disponibles. Por favor, contacte con un administrador"_.
  - Dado que soy un albergue verificado,  
    cuando actualizo mi perfil en la sección de contacto,  
    entonces puedo agregar/editar mi número de WhatsApp (con código de país) y mi usuario de Instagram, con validación de formato.
  - Dado que la solicitud de adopción ha sido rechazada o la mascota ya fue adoptada,  
    cuando intento contactar al albergue desde esa solicitud específica,  
    entonces el botón de contacto se deshabilita o muestra un mensaje: _"Esta postulación ha sido cerrada. El contacto directo ya no está disponible para esta mascota"_.

**HU-009: Simulación de compra de productos y generación de pedido**

- **Como** adoptante o usuario registrado.
- **Quiero** completar el proceso de agregar productos al carrito y generar un pedido.
- **Para** obtener los accesorios necesarios para mi mascota (simulando la compra, ya que no hay pasarela de pago real).
- **Prioridad**: Media
- **Estimación**: 8 puntos
- **Sprint**: 4
- **Criterios de aceptación**:
  - Dado que tengo productos en el carrito, dirección de envío dentro del Valle de Aburrá y selecciono un método de pago simulado,  
    cuando confirmo la compra,  
    entonces se genera una _Orden de Compra Simulada_, se descuenta el stock (simulado) y se notifica al proveedor.
  - Dado que un artículo que estaba en el carrito se agota antes de confirmar la compra,  
    cuando intento finalizar la compra,  
    entonces el sistema me informa del producto agotado y me obliga a eliminarlo o reducir la cantidad para continuar.
  - Dado que la compra es una simulación,  
    cuando intento realizar el pago final,  
    entonces el sistema muestra una pantalla de confirmación de pedido, **NO** una pasarela de pago real.
- **Notas/Comentarios**: El Proveedor recibe la orden para coordinar la entrega y el pago fuera de la plataforma.

**HU-010: Gestión de inventario de productos por vendedor**

- **Como** vendedor de productos para mascotas.
- **Quiero** poder añadir, editar y eliminar productos de mi catálogo y gestionar su stock.
- **Para** mantener el inventario en línea actualizado y sincronizado con mis productos físicos.
- **Prioridad**: Media
- **Estimación**: 5 puntos
- **Sprint**: 2
- **Criterios de aceptación**:
  - Dado que estoy en mi panel de gestión de productos,  
    cuando ingreso nombre, precio, stock, categoría y descripción de un nuevo producto,  
    entonces el producto se añade a mi catálogo y está disponible para los usuarios.
  - Dado que un producto se queda sin stock,  
    cuando se genera una orden simulada que lo agota,  
    entonces el producto aparece como _"Agotado"_ en la vista de los usuarios.
  - Dado que quiero modificar un producto,  
    cuando edito el precio y lo guardo,  
    entonces el precio se actualiza inmediatamente en el catálogo visible.

---

## 3. Consulta y reportes

**HU-011: Historial y Reporte de Adopciones**

- **Como** representante de albergue o entidad de rescate.
- **Quiero** poder generar un listado de las adopciones finalizadas.
- **Para** llevar a cabo un control interno del impacto y generar informes para entidades como la Alcaldía (_stakeholder_).
- **Prioridad**: Alta
- **Estimación**: 5 puntos
- **Sprint**: 4
- **Criterios de aceptación**:
  - Dado que estoy en mi panel de reportes,  
    cuando accedo a _"Historial de Adopciones"_ y filtro por rango de fechas,  
    entonces el sistema me muestra la fecha de adopción, el Adoptante (ID o nombre), el nombre de la mascota y el municipio del Valle de Aburrá.
  - Dado que necesito la información para un informe oficial de impacto,  
    cuando utilizo la función de exportar,  
    entonces el sistema descarga el listado completo con métricas de adopción por municipio en formato CSV o Excel.
  - Dado que el reporte se ejecuta,  
    cuando no hay adopciones en el rango,  
    entonces el sistema muestra _"No hay adopciones completadas en este periodo"_.

**HU-012: Reporte de Órdenes Simuladas por Vendedor**

- **Como** vendedor de productos para mascotas.
- **Quiero** acceder a un reporte que detalle mis órdenes de compra simuladas y el estado de envío.
- **Para** saber qué productos tienen más éxito y gestionar el proceso logístico de envío dentro del Valle de Aburrá.
- **Prioridad**: Media
- **Estimación**: 3 puntos
- **Sprint**: 4
- **Criterios de aceptación**:
  - Dado que accedo a mi panel de control de ventas,  
    cuando genero el reporte,  
    entonces el sistema me muestra el total de unidades ordenadas y la información de contacto del cliente.
  - Dado que aplico un filtro por el estado de la orden (ej. _"Enviado"_ o _"Pendiente de Despacho"_) o por municipio de entrega,  
    cuando ejecuto el reporte,  
    entonces el reporte solo incluye las órdenes que coinciden con los criterios seleccionados.
  - Dado que necesito actualizar una orden,  
    cuando cambio el estado de una orden de _"Pendiente"_ a _"Enviado"_,  
    entonces el sistema notifica al cliente del cambio de estado.

**HU-013: Dashboard de Administración Central**

- **Como** administrador del sistema.
- **Quiero** tener un panel centralizado (_dashboard_).
- **Para** monitorear la salud general de la plataforma, el crecimiento de usuarios y el impacto (objetivos específicos del acta).
- **Prioridad**: Media
- **Estimación**: 8 puntos
- **Sprint**: 5
- **Criterios de aceptación**:
  - Dado que accedo al dashboard principal con credenciales de administrador,  
    cuando el dashboard carga,  
    entonces veo el número de mascotas adoptadas, mascotas activas, usuarios registrados y métricas de crecimiento mensual.
  - Dado que quiero segmentar las estadísticas por territorio,  
    cuando aplico un filtro por municipio del Valle de Aburrá o por mes de registro,  
    entonces los contadores y gráficos se ajustan para reflejar solo los datos del segmento.
  - Dado que necesito evaluar el impacto social del proyecto,  
    cuando consulto las métricas del dashboard,  
    entonces el sistema muestra indicadores de adopciones por municipio y crecimiento de la comunidad.
  - Dado que intento acceder a una métrica no incluida en el alcance,  
    cuando intento ver el dato,  
    entonces el sistema muestra el dato como _"No disponible"_ (N/A).

---

## 4. Administración

**HU-014: Gestión de usuarios y roles (bloqueo)**

- **Como** administrador del sistema.
- **Quiero** tener un módulo para supervisar y bloquear cuentas de adoptantes, vendedores y albergues.
- **Para** asegurar la seguridad, la legitimidad de las entidades y el cumplimiento de las políticas de uso.
- **Prioridad**: Alta
- **Estimación**: 3 puntos
- **Sprint**: 1
- **Criterios de aceptación**:
  - Dado que un albergue o proveedor activo publica contenido inadecuado o infringe las normas,  
    cuando el administrador desactiva o bloquea su cuenta con una justificación,  
    entonces todas sus publicaciones de mascotas y productos se ocultan automáticamente de la vista pública.
  - Dado que intento buscar un usuario específico por su ID, correo electrónico o tipo de rol,  
    cuando utilizo la función de búsqueda,  
    entonces el sistema me devuelve el perfil completo del usuario para su gestión.
  - Dado que bloqueo la cuenta de un adoptante, albergue o proveedor,  
    cuando ese usuario intenta iniciar sesión,  
    entonces el sistema muestra un mensaje de _"Cuenta bloqueada, contacte a soporte"_.

**HU-015: Configuración de categorías de productos y filtros**

- **Como** administrador del sistema.
- **Quiero** poder añadir, editar y eliminar las categorías del catálogo de productos y los criterios de filtro de mascotas.
- **Para** mantener el inventario de la tienda virtual y la galería de adopción organizados dentro del contexto del Valle de Aburrá.
- **Prioridad**: Media
- **Estimación**: 3 puntos
- **Sprint**: 5
- **Criterios de aceptación**:
  - Dado que creo una nueva categoría de productos,  
    cuando guardo la nueva categoría,  
    entonces la categoría aparece inmediatamente disponible para que los proveedores la seleccionen al publicar sus productos.
  - Dado que intento eliminar una categoría que contiene productos activos,  
    cuando ejecuto la eliminación,  
    entonces el sistema me advierte que debo reasignar o eliminar esos productos antes de borrar la categoría.
  - Dado que creo un nuevo filtro de mascotas (ej. por municipio del Valle de Aburrá, especie o tamaño),  
    cuando guardo el filtro después de validar que no existe uno idéntico,  
    entonces el nuevo filtro aparece disponible para todos los usuarios en la galería de búsqueda.
