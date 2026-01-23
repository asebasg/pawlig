# Casos de Prueba

## Índice

1. Introducción
2. Convenciones y nomenclatura
3. Casos de prueba: Autenticación
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-001: Registro de Usuario Adoptante Exitoso
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-002: Inicio de Sesión con Credenciales Válidas
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-003: Inicio de Sesión con Credenciales Inválidas
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-004: Recuperación de Contraseña
4. Casos de prueba: Gestión de mascotas
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-005: Publicar Mascota en Adopción
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-006: Buscar y Filtrar Mascotas
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-007: Editar Estado de Mascota
5. Casos de prueba: Adopciones
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-008: Postularse para Adopción
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-009: Contactar Albergue vía WhatsApp
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-010: Gestionar Postulación – Aprobar
6. Casos de prueba: Productos y carritos
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-011: Agregar Producto al Carrito
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-012: Finalizar Compra Simulada
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-013: Gestionar Inventario de Productos
7. Casos de prueba: Administración
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-014: Aprobar Solicitud de Albergue
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-015: Bloquear Usuario
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-016: Generar Reporte de Adopciones
8. Casos de prueba: Rendimiento y seguridad
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-017: Tiempo de Carga de Página Inicial
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-018: Tiempo de Respuesta de API – Búsqueda
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-019: Seguridad – Encriptación de Contraseñas
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-020: Seguridad – Protección contra SQL Injection
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-021: Seguridad – Sesiones JWT
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-022: Usabilidad – Diseño Responsive Móvil
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-023: Compatibilidad – Navegadores
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-024: Accesibilidad – WCAG 2.1 AA
   &nbsp;&nbsp;&nbsp;&nbsp;CASO DE PRUEBA CP-025: Carga Concurrente – 100 Usuarios
9. Matriz de trazabilidad
   &nbsp;&nbsp;&nbsp;&nbsp;Cobertura por módulo
   &nbsp;&nbsp;&nbsp;&nbsp;Cobertura de requerimientos
   &nbsp;&nbsp;&nbsp;&nbsp;Requerimientos no cubiertos:
   &nbsp;&nbsp;&nbsp;&nbsp;Resumen:

---

## 1. Introducción

Este documento contiene los casos de prueba diseñados para validar las funcionalidades del sistema **PawLig** versión 1.0. Cada caso incluye identificador único, módulo, prioridad, precondiciones, datos de entrada, pasos detallados de ejecución, y resultados esperados.

Los casos cubren:  
● 18 Requerimientos Funcionales (RF-001 a RF-018)  
● 8 Requerimientos No Funcionales (RNF-001 a RNF-008)  
● 15 Historias de Usuario principales (HU-001 a HU-015)  
● 10 Casos de Uso (CU-001 a CU-010)

**Total de casos de prueba**: 25 casos que cubren todos los módulos críticos del sistema.

---

## 2. Convenciones y nomenclatura

**ID**: Identificador único del caso (CP-XXX).  
**Módulo**: Área funcional del sistema.  
**Prioridad**: Alta, Media, Baja.  
**Precondiciones**: Estado inicial requerido antes de ejecutar el caso.  
**Datos de Entrada**: Información específica necesaria para la prueba.  
**Pasos**: Secuencia de acciones a ejecutar (numeradas).  
**Resultado Esperado**: Comportamiento esperado del sistema.  
**Postcondiciones**: Estado final del sistema después de la ejecución.

**CRITERIOS DE ÉXITO**:  
✅ **PASS**: El resultado obtenido coincide con el resultado esperado.  
❌ **FAIL**: El resultado obtenido difiere del resultado esperado.

---

## 3. Casos de prueba: Autenticación

### CASO DE PRUEBA CP-001: Registro de Usuario Adoptante Exitoso

**ID**: CP-001  
**Módulo**: Autenticación  
**Prioridad**: ALTA  
**Relacionado**: RF-001, HU-001, CU-001

**PRECONDICIONES**:  
● Usuario no registrado previamente en el sistema  
● Navegador web abierto en la página de registro  
● Conexión a internet activa

**DATOS DE ENTRADA**:  
● Email: `usuario.prueba@example.com`  
● Contraseña: `Prueba123$`  
● Nombre completo: Juan Carlos Pérez  
● Teléfono: `3001234567`  
● Municipio: `MEDELLIN`  
● Dirección: Calle 50#45-30, Laureles  
● Número de identificación: `1234567890`  
● Fecha de nacimiento: `01/05/1995`

**PASOS**:  
01. Acceder a la URL `https://pawlig.vercel.app/register`  
02. Ingresar el email en el campo "Correo electrónico"  
03. Ingresar la contraseña en el campo "Contraseña"  
04. Ingresar el nombre completo en el campo "Nombre completo"  
05. Ingresar el teléfono en el campo "Teléfono"  
06. Seleccionar "Medellín" en el dropdown "Municipio"  
07. Ingresar la dirección en el campo "Dirección"  
08. Ingresar el número de identificación en el campo "Cédula"  
09. Seleccionar la fecha de nacimiento en el campo "Fecha de nacimiento"  
10. Hacer clic en el botón "Registrarse"

**RESULTADO ESPERADO**:  
● El sistema valida que el email no esté registrado  
● El sistema valida que la contraseña tenga mínimo 8 caracteres (RN-001)  
● El sistema crea una cuenta con rol "ADOPTER"  
● El sistema muestra mensaje de confirmación "Cuenta creada exitosamente"  
● El sistema inicia sesión automáticamente  
● El sistema redirige al usuario a la página `/adopciones` (galería de mascotas)  
● La sesión JWT se almacena en cookies HttpOnly con expiración de 24 horas

**POSTCONDICIONES**:  
● Usuario registrado en base de datos con rol ADOPTER.  
● Sesión activa iniciada.  
● Usuario puede navegar por la plataforma.

---

### CASO DE PRUEBA CP-002: Inicio de Sesión con Credenciales Válidas

**ID**: CP-002  
**Módulo**: Autenticación  
**Prioridad**: ALTA  
**Relacionado**: RF-002, CU-002

**PRECONDICIONES**:  
● Usuario registrado en el sistema con credenciales válidas.  
● Navegador web abierto en la página de login.  
● Sesión NO iniciada.

**DATOS DE ENTRADA**:  
● Email: `adoptante@pawlig.com`  
● Contraseña: `Adoptante123$`

**PASOS**:  
01. Acceder a la URL `https://pawlig.vercel.app/login`.  
02. Ingresar el email `adoptante@pawlig.com` en el campo "Correo electrónico".  
03. Ingresar la contraseña `Adoptante123$` en el campo "Contraseña".  
04. Hacer clic en el botón "Iniciar Sesión".

**RESULTADO ESPERADO**:  
● El sistema valida las credenciales contra la base de datos.  
● El sistema genera un token JWT con vigencia de 24 horas.  
● El sistema almacena el token en cookies HttpOnly seguras.  
● El sistema redirige al dashboard correspondiente según el rol:  
&nbsp;&nbsp;&nbsp;&nbsp;○ ADOPTER → `/user`  
&nbsp;&nbsp;&nbsp;&nbsp;○ SHELTER → `/shelter`  
&nbsp;&nbsp;&nbsp;&nbsp;○ VENDOR → `/vendor`  
&nbsp;&nbsp;&nbsp;&nbsp;○ ADMIN → `/admin`  
● El nombre del usuario aparece en la barra superior de navegación.  
● El tiempo de autenticación es menor a 3 segundos.

**POSTCONDICIONES**:  
● Usuario autenticado con sesión activa.  
● Token JWT válido por 24 horas.

---

### CASO DE PRUEBA CP-003: Inicio de Sesión con Credenciales Inválidas

**ID**: CP-003  
**Módulo**: Autenticación  
**Prioridad**: ALTA  
**Relacionado**: RF-002, CU-002

**PRECONDICIONES**:  
● Navegador web abierto en la página de login

**DATOS DE ENTRADA**:  
● Email: `usuario.invalido@test.com`  
● Contraseña: `ClaveIncorrecta123`

**PASOS**:  
01. Acceder a la URL `https://pawlig.vercel.app/login`  
02. Ingresar email `usuario.invalido@test.com`  
03. Ingresar contraseña `ClaveIncorrecta123`  
04. Hacer clic en "Iniciar Sesión"

**RESULTADO ESPERADO**:  
● El sistema valida las credenciales  
● El sistema muestra mensaje de error: "Credenciales incorrectas"  
● El usuario permanece en la página de login  
● Los campos se limpian para permitir reintento  
● Después de 3 intentos fallidos, el sistema bloquea temporalmente la cuenta por 15 minutos

**POSTCONDICIONES**:  
● No se crea sesión  
● Usuario permanece no autenticado

---

### CASO DE PRUEBA CP-004: Recuperación de Contraseña

**ID**: CP-004  
**Módulo**: Autenticación  
**Prioridad**: MEDIA  
**Relacionado**: RF-004, HU-004

**PRECONDICIONES**:  
● Usuario registrado con email: `adoptante@pawlig.com`  
● Navegador en página de login

**DATOS DE ENTRADA**:  
● Email: `adoptante@pawlig.com`

**PASOS**:  
01. Acceder a `https://pawlig.vercel.app/login`  
02. Hacer clic en el enlace "¿Olvidaste tu contraseña?"  
03. Ingresar el email `adoptante@pawlig.com`  
04. Hacer clic en "Enviar enlace de recuperación"  
05. Abrir el correo electrónico recibido  
06. Hacer clic en el enlace de recuperación  
07. Ingresar nueva contraseña `NuevaPass123$`  
08. Confirmar nueva contraseña `NuevaPass123$`  
09. Hacer clic en "Restablecer contraseña"

**RESULTADO ESPERADO**:  
● El sistema valida que el email existe en la base de datos  
● El sistema genera un token temporal con expiración de 1 hora  
● El sistema envía un email con el enlace de recuperación  
● El enlace redirige a la página de restablecimiento  
● El sistema valida que la nueva contraseña tenga mínimo 8 caracteres  
● El sistema actualiza la contraseña con encriptación bcrypt (salt rounds 12)  
● El sistema muestra mensaje "Contraseña actualizada exitosamente"  
● El usuario puede iniciar sesión con la nueva contraseña

**POSTCONDICIONES**:  
● Contraseña actualizada en base de datos  
● Token de recuperación invalidado

---

## 4. Casos de prueba: Gestión de mascotas

### CASO DE PRUEBA CP-005: Publicar Mascota en Adopción

**ID**: CP-005  
**Módulo**: Gestión de Mascotas  
**Prioridad**: ALTA  
**Relacionado**: RF-009, HU-005, CU-004

**PRECONDICIONES**:  
● Usuario autenticado con rol SHELTER  
● Albergue verificado (`verified: true`)  
● Navegador en el panel del albergue

**DATOS DE ENTRADA**:  
● Nombre: Luna  
● Especie: Perro  
● Raza: Labrador Retriever  
● Edad: 2 años  
● Sexo: Hembra  
● Descripción: "Perra juguetona, cariñosa y muy activa. Ideal para familias con niños."  
● Requisitos: "Casa con jardín, experiencia previa con perros"  
● Estado de salud: Bueno (vacunada, esterilizada)  
● Imágenes: 3 fotos (JPEG, <5MB cada una)

**PASOS**:  
01. Acceder al panel del albergue `/shelter`  
02. Hacer clic en el botón "Publicar Mascota"  
03. Ingresar el nombre "Luna"  
04. Seleccionar especie "Perro" del dropdown  
05. Ingresar raza "Labrador Retriever"  
06. Ingresar edad "2"  
07. Seleccionar sexo "Hembra"  
08. Ingresar descripción en el textarea  
09. Ingresar requisitos en el textarea  
10. Subir 3 fotos mediante el botón de carga  
11. Hacer clic en "Publicar"

**RESULTADO ESPERADO**:  
● El sistema valida que todos los campos obligatorios estén completos  
● El sistema valida que se haya subido al menos 1 foto (RN-007)  
● El sistema sube las imágenes a Cloudinary  
● El sistema almacena la mascota en MongoDB con estado "AVAILABLE"  
● El sistema muestra mensaje "Mascota publicada exitosamente"  
● La mascota aparece inmediatamente en la galería pública de adopciones  
● La mascota aparece en el listado del albergue

**POSTCONDICIONES**:  
● Mascota registrada en base de datos  
● Mascota visible en galería pública (`/adopciones`)  
● Imágenes almacenadas en Cloudinary

---

### CASO DE PRUEBA CP-006: Buscar y Filtrar Mascotas

**ID**: CP-006  
**Módulo**: Gestión de Mascotas  
**Prioridad**: ALTA  
**Relacionado**: RF-010, HU-006, CU-005

**PRECONDICIONES**:  
● Sistema con al menos 20 mascotas publicadas  
● Usuario en la página de adopciones (autenticado o anónimo)  
● Mascotas distribuidas en diferentes municipios del Valle de Aburrá

**DATOS DE ENTRADA**:  
● Especie: Perro  
● Municipio: MEDELLIN  
● Estado: AVAILABLE

**PASOS**:  
01. Acceder a `https://pawlig.vercel.app/adopciones`  
02. Seleccionar "Perro" en el filtro de especie  
03. Seleccionar "Medellín" en el filtro de municipio  
04. Verificar que el filtro de estado "Disponible" esté activo por defecto  
05. Hacer clic en el botón "Buscar"

**RESULTADO ESPERADO**:  
● El sistema consulta la base de datos con los criterios especificados  
● El sistema muestra solo mascotas que cumplen TODOS los filtros:  
&nbsp;&nbsp;&nbsp;&nbsp;○ Especie = "Perro"  
&nbsp;&nbsp;&nbsp;&nbsp;○ Municipio = "MEDELLIN"  
&nbsp;&nbsp;&nbsp;&nbsp;○ Estado = "AVAILABLE"  
● El tiempo de respuesta es menor a 2 segundos (RNF-001)  
● Si hay resultados, se muestran en formato de cards (grid 3 columnas desktop, 1 móvil)  
● Si NO hay resultados, se muestra mensaje "No se encontraron mascotas con estos criterios"  
● El sistema sugiere "Amplía tu búsqueda para ver más resultados"  
● Los resultados muestran: foto, nombre, edad, municipio, albergue

**POSTCONDICIONES**:  
● Filtros aplicados y visibles  
● Resultados mostrados correctamente

---

### CASO DE PRUEBA CP-007: Editar Estado de Mascota

**ID**: CP-007  
**Módulo**: Gestión de Mascotas  
**Prioridad**: ALTA  
**Relacionado**: RF-011, HU-005

**PRECONDICIONES**:  
● Usuario autenticado con rol SHELTER  
● Mascota publicada con estado "AVAILABLE"  
● Usuario tiene permisos sobre esa mascota (es su albergue)

**DATOS DE ENTRADA**:  
● ID de mascota: `507f1f77bcf86cd799439011`  
● Nuevo estado: ADOPTED

**PASOS**:  
01. Acceder al panel del albergue `/shelter/pets`  
02. Localizar la mascota "Luna" en el listado  
03. Hacer clic en el botón "Editar"  
04. Cambiar el estado de "Disponible" a "Adoptado" en el dropdown  
05. Hacer clic en "Guardar cambios"

**RESULTADO ESPERADO**:  
● El sistema valida que el usuario tiene permisos sobre la mascota  
● El sistema actualiza el estado en MongoDB a "ADOPTED"  
● El sistema muestra mensaje "Estado actualizado exitosamente"  
● La mascota se oculta de la galería pública de adopciones  
● La mascota permanece visible en el panel del albergue con badge "Adoptado"  
● El cambio se refleja inmediatamente en toda la plataforma (sin necesidad de recargar)

**POSTCONDICIONES**:  
● Estado de mascota = "ADOPTED"  
● Mascota no visible en búsquedas públicas

---

## 5. Casos de prueba: Adopciones

### CASO DE PRUEBA CP-008: Postularse para Adopción

**ID**: CP-008  
**Módulo**: Adopciones  
**Prioridad**: ALTA  
**Relacionado**: RF-011, HU-007, CU-006

**PRECONDICIONES**:  
● Usuario autenticado con rol ADOPTER  
● Mascota disponible con estado "AVAILABLE"  
● Usuario NO ha aplicado previamente a esa mascota

**DATOS DE ENTRADA**:  
● ID de mascota: `507f1f77bcf86cd799439011`  
● Mensaje: "Me encantaría adoptar a Luna. Tengo casa con jardín y experiencia con perros."

**PASOS**:  
01. Iniciar sesión como adoptante  
02. Navegar a `/adopciones`  
03. Hacer clic en la card de la mascota "Luna"  
04. En la página de detalle, hacer clic en "Postularme para adoptar"  
05. Ingresar el mensaje en el textarea  
06. Hacer clic en "Enviar postulación"

**RESULTADO ESPERADO**:  
● El sistema verifica que la mascota esté en estado "AVAILABLE"  
● El sistema verifica que el usuario NO tenga postulación previa a esa mascota  
● El sistema crea un registro en la tabla Adoption con estado "PENDING"  
● El sistema envía notificación por email al albergue (RN-012)  
● El sistema muestra modal de confirmación "Postulación enviada exitosamente"  
● El sistema muestra botón "Contactar Albergue" (WhatsApp/Instagram)  
● La postulación aparece en el panel del adoptante con estado "Pendiente"

**POSTCONDICIONES**:  
● Postulación registrada con estado "PENDING"  
● Notificación enviada al albergue  
● Adoptante puede ver su postulación en su dashboard

---

### CASO DE PRUEBA CP-009: Contactar Albergue vía WhatsApp

**ID**: CP-009  
**Módulo**: Adopciones – Comunicación Externa  
**Prioridad**: ALTA  
**Relacionado**: RF-012, HU-008, CU-007

**PRECONDICIONES**:  
● Usuario autenticado con postulación activa  
● Albergue tiene configurado número de WhatsApp: `+573001234567`  
● Usuario en la página de detalle de la mascota

**DATOS DE ENTRADA**:  
● Número WhatsApp del albergue: `+573001234567`  
● Nombre de la mascota: Luna

**PASOS**:  
01. Iniciar sesión como adoptante  
02. Navegar a la mascota "Luna"  
03. Hacer clic en el botón "Contactar Albergue"  
04. Seleccionar la opción "WhatsApp"

**RESULTADO ESPERADO**:  
● El sistema genera un enlace: `https://wa.me/573001234567?text=...`  
● El mensaje predeterminado incluye (RN-021):  
&nbsp;&nbsp;&nbsp;&nbsp;○ Referencia a PawLig  
&nbsp;&nbsp;&nbsp;&nbsp;○ Nombre de la mascota  
&nbsp;&nbsp;&nbsp;&nbsp;○ Ejemplo: "Hola, me interesa adoptar a Luna que vi en PawLig"  
● El sistema redirige a WhatsApp Web (desktop) o WhatsApp App (móvil)  
● WhatsApp se abre con el número y mensaje precargados  
● El adoptante puede modificar el mensaje antes de enviar  
● El sistema NO almacena historial de la conversación

**POSTCONDICIONES**:  
● Usuario redirigido a WhatsApp  
● Conversación iniciada fuera de PawLig

---

### CASO DE PRUEBA CP-010: Gestionar Postulación – Aprobar

**ID**: CP-010  
**Módulo**: Adopciones  
**Prioridad**: ALTA  
**Relacionado**: RF-011, HU-007

**PRECONDICIONES**:  
● Usuario autenticado con rol SHELTER  
● Postulación existente con estado "PENDING"  
● Albergue tiene permisos sobre la mascota

**DATOS DE ENTRADA**:  
● ID de postulación: `507f1f77bcf86cd799439012`  
● Acción: Aprobar

**PASOS**:  
01. Iniciar sesión como albergue  
02. Navegar a `/shelter/adoptions`  
03. Localizar la postulación pendiente  
04. Hacer clic en "Ver detalles"  
05. Revisar información del adoptante  
06. Hacer clic en el botón "Aprobar"  
07. Confirmar la acción en el modal

**RESULTADO ESPERADO**:  
● El sistema actualiza el estado de la postulación a "APPROVED"  
● El sistema envía notificación por email al adoptante  
● El sistema muestra mensaje "Postulación aprobada exitosamente"  
● El adoptante ve el cambio de estado en su dashboard  
● El albergue puede ver los datos de contacto del adoptante para coordinar entrega

**POSTCONDICIONES**:  
● Postulación con estado "APPROVED"  
● Adoptante notificado por email

---

## 6. Casos de prueba: Productos y carritos

### CASO DE PRUEBA CP-011: Agregar Producto al Carrito

**ID**: CP-011  
**Módulo**: Productos  
**Prioridad**: ALTA  
**Relacionado**: RF-015, HU-009

**PRECONDICIONES**:  
● Usuario autenticado con rol ADOPTER o VENDOR  
● Producto disponible con stock > 0  
● Usuario en la página de productos

**DATOS DE ENTRADA**:  
● ID de producto: `507f1f77bcf86cd799439013`  
● Nombre: Alimento Premium para Perros 20kg  
● Precio: $85,000  
● Stock disponible: 25 unidades  
● Cantidad a agregar: 2

**PASOS**:  
01. Iniciar sesión como usuario  
02. Navegar a `/productos`  
03. Localizar el producto "Alimento Premium para Perros 20kg"  
04. Hacer clic en "Ver detalles"  
05. Ingresar cantidad "2" en el campo de cantidad  
06. Hacer clic en "Agregar al carrito"

**RESULTADO ESPERADO**:  
● El sistema valida que el stock sea suficiente (stock ≥ cantidad)  
● El sistema agrega el producto al carrito de sesión  
● El sistema muestra notificación "Producto agregado al carrito"  
● El ícono del carrito en el navbar muestra el contador actualizado (+2)  
● El subtotal se calcula correctamente: $85,000 × 2 = $170,000  
● El producto puede agregarse múltiples veces (incrementa cantidad)

**POSTCONDICIONES**:  
● Producto en carrito con cantidad = 2  
● Carrito persiste durante la sesión

---

### CASO DE PRUEBA CP-012: Finalizar Compra Simulada

**ID**: CP-012  
**Módulo**: Productos – Checkout  
**Prioridad**: ALTA  
**Relacionado**: RF-016, HU-009

**PRECONDICIONES**:  
● Usuario autenticado  
● Carrito con al menos 1 producto  
● Productos con stock suficiente

**DATOS DE ENTRADA**:  
● Productos en carrito: 2 items (total $200,000)  
● Dirección de envío: Calle 50#45-30, Medellín  
● Municipio: MEDELLIN  
● Método de pago: Transferencia Bancaria (simulado)

**PASOS**:  
01. Iniciar sesión como usuario  
02. Agregar productos al carrito (o usar carrito existente)  
03. Hacer clic en el ícono del carrito  
04. Revisar los productos en el carrito  
05. Hacer clic en "Finalizar compra"  
06. Verificar dirección de envío (o ingresarla si no existe)  
07. Seleccionar municipio "Medellín" del Valle de Aburrá  
08. Seleccionar método de pago "Transferencia Bancaria"  
09. Hacer clic en "Confirmar pedido"

**RESULTADO ESPERADO**:  
● El sistema valida la disponibilidad de stock de todos los productos  
● El sistema valida que la dirección esté en el Valle de Aburrá (RN-016)  
● El sistema genera una orden con estado "PENDING"  
● El sistema actualiza el stock de los productos (descuenta cantidades)  
● El sistema envía notificación al vendedor con detalles de la orden  
● El sistema muestra página de confirmación con número de orden  
● El sistema NO procesa pago real (solo simulación – RN-015)  
● El usuario recibe confirmación por email  
● El carrito se vacía después de confirmar

**POSTCONDICIONES**:  
● Orden creada con estado "PENDING"  
● Stock actualizado  
● Vendedor notificado  
● Carrito vacío

---

### CASO DE PRUEBA CP-013: Gestionar Inventario de Productos

**ID**: CP-013  
**Módulo**: Productos  
**Prioridad**: MEDIA  
**Relacionado**: RF-014, HU-010

**PRECONDICIONES**:  
● Usuario autenticado con rol VENDOR  
● Producto existente en el catálogo del vendedor

**DATOS DE ENTRADA**:  
● ID de producto: `507f1f77bcf86cd799439013`  
● Stock actual: 25  
● Nuevo stock: 50

**PASOS**:  
01. Iniciar sesión como vendedor  
02. Navegar a `/vendor/products`  
03. Localizar el producto "Alimento Premium para Perros"  
04. Hacer clic en "Editar"  
05. Cambiar el stock de 25 a 50  
06. Hacer clic en "Guardar cambios"

**RESULTADO ESPERADO**:  
● El sistema valida que el usuario sea el propietario del producto  
● El sistema actualiza el stock en la base de datos  
● El sistema muestra mensaje "Stock actualizado exitosamente"  
● El cambio se refleja inmediatamente en el catálogo público  
● Si el stock anterior era 0, el producto vuelve a estar disponible para compra

**POSTCONDICIONES**:  
● Stock actualizado a 50 unidades  
● Producto disponible en catálogo

---

## 7. Casos de prueba: Administración

### CASO DE PRUEBA CP-014: Aprobar Solicitud de Albergue

**ID**: CP-014  
**Módulo**: Administración  
**Prioridad**: ALTA  
**Relacionado**: RF-007, HU-002, CU-007

**PRECONDICIONES**:  
● Usuario autenticado con rol ADMIN  
● Solicitud de albergue pendiente con estado `verified = false`

**DATOS DE ENTRADA**:  
● ID de albergue: `507f1f77bcf86cd799439014`  
● Nombre: Fundación Amigos Peludos  
● Estado actual: `verified = false`  
● Acción: Aprobar

**PASOS**:  
01. Iniciar sesión como administrador  
02. Navegar a `/admin/shelters`  
03. Filtrar solicitudes por estado "Pendiente de aprobación"  
04. Localizar "Fundación Amigos Peludos"  
05. Hacer clic en "Ver detalles"  
06. Revisar documentación (NIT, dirección, contacto)  
07. Hacer clic en el botón "Aprobar"  
08. Confirmar la acción

**RESULTADO ESPERADO**:  
● El sistema actualiza el campo `verified` a `true`  
● El sistema registra fecha de aprobación (`approvedAt`)  
● El sistema envía notificación por email al representante del albergue  
● El albergue puede acceder inmediatamente a su panel `/shelter`  
● El albergue puede comenzar a publicar mascotas  
● El sistema muestra mensaje "Albergue aprobado exitosamente"

**POSTCONDICIONES**:  
● Albergue verificado (`verified = true`)  
● Albergue con acceso completo al sistema  
● Notificación enviada

---

### CASO DE PRUEBA CP-015: Bloquear Usuario

**ID**: CP-015  
**Módulo**: Administración  
**Prioridad**: MEDIA  
**Relacionado**: RF-005, HU-014, CU-009

**PRECONDICIONES**:  
● Usuario autenticado con rol ADMIN  
● Usuario objetivo activo en el sistema

**DATOS DE ENTRADA**:  
● ID de usuario: `507f1f77bcf86cd799439015`  
● Email: `usuario.problematico@example.com`  
● Acción: Bloquear  
● Motivo: "Publicación de contenido inapropiado"

**PASOS**:  
01. Iniciar sesión como administrador  
02. Navegar a `/admin/users`  
03. Buscar usuario por email `usuario.problematico@example.com`  
04. Hacer clic en "Gestionar"  
05. Hacer clic en "Bloquear usuario"  
06. Ingresar motivo del bloqueo (obligatorio – RN-017)  
07. Confirmar la acción

**RESULTADO ESPERADO**:  
● El sistema desactiva la cuenta (`activo = false`)  
● El sistema oculta todas las publicaciones del usuario (mascotas/productos)  
● El sistema registra el motivo del bloqueo con auditoría  
● El sistema envía notificación al usuario con la justificación (RN-018)  
● Si el usuario intenta iniciar sesión, ve mensaje "Cuenta bloqueada. Contacte a soporte."  
● El administrador puede ver el historial de bloqueos en el panel

**POSTCONDICIONES**:  
● Usuario bloqueado  
● Publicaciones ocultas  
● Auditoría registrada

---

### CASO DE PRUEBA CP-016: Generar Reporte de Adopciones

**ID**: CP-016  
**Módulo**: Reportes  
**Prioridad**: MEDIA  
**Relacionado**: RF-017, HU-011, CU-010

**PRECONDICIONES**:  
● Usuario autenticado con rol SHELTER  
● Albergue con adopciones completadas en el sistema

**DATOS DE ENTRADA**:  
● Fecha inicio: `01/09/2025`  
● Fecha fin: `30/11/2025`  
● Formato: Excel (.xlsx)

**PASOS**:  
01. Iniciar sesión como albergue  
02. Navegar a `/shelter/reports`  
03. Seleccionar "Historial de Adopciones"  
04. Ingresar fecha de inicio: `01/09/2025`  
05. Ingresar fecha de fin: `30/11/2025`  
06. Hacer clic en "Generar reporte"  
07. Esperar generación del reporte  
08. Hacer clic en "Descargar Excel"

**RESULTADO ESPERADO**:  
● El sistema consulta adopciones con estado "APPROVED" en el rango de fechas  
● El sistema genera un reporte que incluye:  
&nbsp;&nbsp;&nbsp;&nbsp;○ Fecha de adopción  
&nbsp;&nbsp;&nbsp;&nbsp;○ Nombre de la mascota  
&nbsp;&nbsp;&nbsp;&nbsp;○ Especie y raza  
&nbsp;&nbsp;&nbsp;&nbsp;○ Nombre del adoptante  
&nbsp;&nbsp;&nbsp;&nbsp;○ Municipio  
● El sistema muestra métricas: Total de adopciones, Adopciones por municipio (RN-019)  
● El archivo Excel se descarga automáticamente al dispositivo  
● El reporte está en formato compatible para informes oficiales (RN-020)  
● Si no hay adopciones en el periodo, muestra mensaje "No hay adopciones en este periodo"

**POSTCONDICIONES**:  
● Reporte generado y descargado  
● Datos precisos según rango de fechas

---

## 8. Casos de prueba: Rendimiento y seguridad

### CASO DE PRUEBA CP-017: Tiempo de Carga de Página Inicial

**ID**: CP-017  
**Módulo**: Rendimiento  
**Prioridad**: ALTA  
**Relacionado**: RNF-001

**PRECONDICIONES**:  
● Navegador Chrome en dispositivo con conexión estable  
● Caché del navegador limpiado  
● Lighthouse configurado en Chrome DevTools

**DATOS DE ENTRADA**:  
● URL: `https://pawlig.vercel.app`  
● Dispositivo: Desktop (1920x1080)  
● Conexión: Broadband (10 Mbps)

**PASOS**:  
01. Abrir Chrome DevTools (F12)  
02. Navegar a la pestaña "Lighthouse"  
03. Seleccionar "Performance" y "Desktop"  
04. Hacer clic en "Analyze page load"  
05. Esperar a que complete el análisis  
06. Revisar las métricas de Web Vitals

**RESULTADO ESPERADO**:  
● Largest Contentful Paint (LCP) < 2.5 segundos  
● First Input Delay (FID) < 100 milisegundos  
● Cumulative Layout Shift (CLS) < 0.1  
● Time to Interactive (TTI) < 3.8 segundos  
● Performance Score > 90/100  
● Tiempo de carga total < 3 segundos (RNF-001)

**POSTCONDICIONES**:  
● Reporte de Lighthouse generado  
● Métricas documentadas

---

### CASO DE PRUEBA CP-018: Tiempo de Respuesta de API – Búsqueda

**ID**: CP-018  
**Módulo**: Rendimiento  
**Prioridad**: ALTA  
**Relacionado**: RNF-001

**PRECONDICIONES**:  
● Base de datos con 1,000 mascotas registradas  
● Usuario autenticado o anónimo  
● Postman configurado

**DATOS DE ENTRADA**:  
● Endpoint: `GET /api/pets?species=Perro&municipality=MEDELLIN`  
● Base de datos: 1,000 registros de mascotas

**PASOS**:  
01. Abrir Postman  
02. Crear request GET a `https://pawlig.vercel.app/api/pets`  
03. Agregar query params: `species=Perro`, `municipality=MEDELLIN`  
04. Enviar request  
05. Revisar el tiempo de respuesta en la sección "Time"  
06. Repetir 10 veces para obtener promedio

**RESULTADO ESPERADO**:  
● Tiempo de respuesta promedio < 2 segundos (RNF-001)  
● Respuesta JSON válida con array de mascotas  
● Filtros aplicados correctamente  
● Paginación funcional (20 resultados por página)  
● Status code: 200 OK

**POSTCONDICIONES**:  
● Métricas de rendimiento documentadas

---

### CASO DE PRUEBA CP-019: Seguridad – Encriptación de Contraseñas

**ID**: CP-019  
**Módulo**: Seguridad  
**Prioridad**: ALTA  
**Relacionado**: RNF-002

**PRECONDICIONES**:  
● Acceso a MongoDB Atlas (solo para testing de seguridad)  
● Usuario registrado en el sistema

**DATOS DE ENTRADA**:  
● Email: `test.security@pawlig.com`  
● Contraseña en texto plano: `SecurePass123$`

**PASOS**:  
01. Registrar un nuevo usuario con contraseña `SecurePass123$`  
02. Acceder a MongoDB Atlas  
03. Navegar a la colección Users  
04. Buscar el usuario por email `test.security@pawlig.com`  
05. Inspeccionar el campo "password"

**RESULTADO ESPERADO**:  
● El campo password NO contiene la contraseña en texto plano  
● El hash comienza con "2b$" (bcrypt)  
● El hash tiene longitud de 60 caracteres  
● El salt rounds es 12 (visible en el prefijo `2b$12`)  
● Es imposible revertir el hash a la contraseña original  
● Dos usuarios con la misma contraseña tienen hashes diferentes (salt único)

**POSTCONDICIONES**:  
● Contraseña almacenada de forma segura  
● Cumplimiento de RNF-002

---

### CASO DE PRUEBA CP-020: Seguridad – Protección contra SQL Injection

**ID**: CP-020  
**Módulo**: Seguridad  
**Prioridad**: ALTA  
**Relacionado**: RNF-002

**PRECONDICIONES**:  
● Sistema en ejecución  
● Endpoint de búsqueda expuesto

**DATOS DE ENTRADA**:  
● Payload malicioso 1: `' OR '1' = '1`  
● Payload malicioso 2: `'; DROP TABLE Users;--`  
● Payload malicioso 3: `<script>alert('XSS')</script>`

**PASOS**:  
01. Intentar login con email: `admin@pawlig.com' OR '1' = '1`  
02. Intentar búsqueda con filtro: `species=Perro'; DROP TABLE Pets;--`  
03. Intentar crear mascota con nombre: `<script>alert('XSS')</script>`  
04. Observar respuesta del sistema

**RESULTADO ESPERADO**:  
● El sistema usa Prisma ORM con queries parametrizadas (RNF-002)  
● No se ejecutan comandos SQL maliciosos  
● Los payloads se tratan como strings literales  
● El sistema retorna error 400 Bad Request para inputs inválidos  
● Los scripts XSS son sanitizados y no se ejecutan  
● No se expone información sensible en mensajes de error

**POSTCONDICIONES**:  
● Sistema protegido contra ataques comunes  
● Logs de intentos de ataque registrados

---

### CASO DE PRUEBA CP-021: Seguridad – Sesiones JWT

**ID**: CP-021  
**Módulo**: Seguridad  
**Prioridad**: ALTA  
**Relacionado**: RNF-002

**PRECONDICIONES**:  
● Usuario autenticado en el sistema  
● Chrome DevTools abierto

**DATOS DE ENTRADA**:  
● Usuario: `adoptante@pawlig.com`  
● Contraseña: `Adoptante123$`

**PASOS**:  
01. Iniciar sesión con las credenciales  
02. Abrir Chrome DevTools (F12)  
03. Navegar a Application > Cookies  
04. Localizar cookies del dominio `pawlig.vercel.app`  
05. Inspeccionar las propiedades de la cookie de sesión  
06. Esperar 24 horas  
07. Intentar acceder a una página protegida

**RESULTADO ESPERADO**:  
● Cookie de sesión está configurada como HttpOnly (no accesible vía JavaScript)  
● Cookie tiene flag Secure (solo transmitida vía HTTPS)  
● Cookie tiene SameSite = Lax o Strict (protección CSRF)  
● Token JWT tiene expiración de 24 horas (RNF-002)  
● Después de 24 horas, el sistema redirige a login automáticamente  
● No es posible acceder al token desde JavaScript (console)

**POSTCONDICIONES**:  
● Sesión segura validada  
● Expiración de sesión funcional

---

### CASO DE PRUEBA CP-022: Usabilidad – Diseño Responsive Móvil

**ID**: CP-022  
**Módulo**: Usabilidad  
**Prioridad**: MEDIA  
**Relacionado**: RNF-003

**PRECONDICIONES**:  
● Navegador Chrome con DevTools  
● Página de adopciones cargada

**DATOS DE ENTRADA**:  
● Viewport: 375x667 (iPhone SE)  
● Orientación: Portrait

**PASOS**:  
01. Abrir `https://pawlig.vercel.app/adopciones`  
02. Abrir Chrome DevTools (F12)  
03. Activar modo dispositivo (Toggle device toolbar)  
04. Seleccionar iPhone SE (375x667)  
05. Navegar por la página  
06. Probar interacciones (botones, filtros, cards)  
07. Cambiar a orientación landscape  
08. Repetir pruebas

**RESULTADO ESPERADO**:  
● Todos los elementos son visibles sin scroll horizontal  
● Los botones tienen área táctil mínima de 44px x 44px (WCAG 2.1)  
● El texto es legible (mínimo 14px)  
● Las imágenes se adaptan al ancho del viewport  
● La navegación se convierte en menú hamburguesa  
● Los filtros son accesibles (drawer lateral)  
● Las cards se apilan en una sola columna  
● Los formularios son completables sin zoom forzado  
● La experiencia es fluida en ambas orientaciones

**POSTCONDICIONES**:  
● Diseño responsive validado  
● Cumplimiento de RNF-003

---

### CASO DE PRUEBA CP-023: Compatibilidad – Navegadores

**ID**: CP-023  
**Módulo**: Compatibilidad  
**Prioridad**: MEDIA  
**Relacionado**: RNF-004

**PRECONDICIONES**:  
● Acceso a múltiples navegadores o BrowserStack

**DATOS DE ENTRADA**:  
● Navegadores a probar:  
&nbsp;&nbsp;&nbsp;&nbsp;○ Chrome 90+  
&nbsp;&nbsp;&nbsp;&nbsp;○ Firefox 88+  
&nbsp;&nbsp;&nbsp;&nbsp;○ Safari 14+  
&nbsp;&nbsp;&nbsp;&nbsp;○ Edge 90+

**PASOS**:  
01. Abrir `https://pawlig.vercel.app` en Chrome 90+  
02. Probar funcionalidades principales: login, búsqueda, postulación  
03. Repetir en Firefox 88+  
04. Repetir en Safari 14+  
05. Repetir en Edge 90+  
06. Documentar inconsistencias

**RESULTADO ESPERADO**:  
● Todas las funcionalidades principales funcionan en los 4 navegadores  
● El diseño se renderiza correctamente (sin elementos rotos)  
● Las animaciones CSS funcionan (o tienen fallback graceful)  
● Los formularios son funcionales  
● La navegación es fluida  
● No hay errores de JavaScript en la consola  
● Los tiempos de carga son similares (±10%)

**POSTCONDICIONES**:  
● Compatibilidad cross-browser validada  
● Cumplimiento de RNF-004

---

### CASO DE PRUEBA CP-024: Accesibilidad – WCAG 2.1 AA

**ID**: CP-024  
**Módulo**: Usabilidad – Accesibilidad  
**Prioridad**: MEDIA  
**Relacionado**: RNF-003

**PRECONDICIONES**:  
● Extensión axe DevTools instalada en Chrome  
● Página de adopciones cargada

**DATOS DE ENTRADA**:  
● URL: `https://pawlig.vercel.app/adopciones`  
● Estándar: WCAG 2.1 Level AA

**PASOS**:  
01. Abrir `https://pawlig.vercel.app/adopciones`  
02. Abrir Chrome DevTools  
03. Navegar a la pestaña "axe DevTools"  
04. Hacer clic en "Scan ALL of my page"  
05. Esperar resultados del análisis  
06. Revisar violaciones encontradas

**RESULTADO ESPERADO**:  
● Contraste de colores cumple ratio 4.5:1 para texto normal  
● Contraste de colores cumple ratio 3:1 para texto grande (24px+)  
● Todos los elementos interactivos son accesibles por teclado  
● Los estados de focus son visibles (outline o box-shadow)  
● Las imágenes tienen atributos alt descriptivos  
● Los formularios tienen labels asociados correctamente  
● Los botones tienen texto descriptivo o aria-label  
● No hay violaciones críticas (Critical) o serias (Serious)  
● Máximo 5 violaciones menores (Moderate o Minor) permitidas

**POSTCONDICIONES**:  
● Accesibilidad WCAG 2.1 AA validada  
● Reporte de axe generado

---

### CASO DE PRUEBA CP-025: Carga Concurrente – 100 Usuarios

**ID**: CP-025  
**Módulo**: Rendimiento  
**Prioridad**: MEDIA  
**Relacionado**: RNF-001

**PRECONDICIONES**:  
● Sistema desplegado en producción (Vercel)  
● Herramienta de carga (Artillery o Apache JMeter) configurada

**DATOS DE ENTRADA**:  
● Usuarios virtuales: 100 concurrentes  
● Duración: 5 minutos  
● Acciones: Login, búsqueda, vista de detalle

**PASOS**:  
01. Configurar Artillery con script de carga  
02. Definir escenario: login → búsqueda → vista detalle  
03. Configurar 100 usuarios virtuales concurrentes  
04. Ejecutar test de carga por 5 minutos  
05. Monitorear respuestas y errores  
06. Revisar métricas de Vercel Dashboard

**RESULTADO ESPERADO**:  
● El sistema soporta 100 usuarios concurrentes (RNF-001)  
● Tasa de éxito > 95% (máximo 5% de errores)  
● Tiempo de respuesta promedio < 2 segundos  
● No hay errores 500 (Internal Server Error)  
● No hay timeouts de funciones serverless (< 10s)  
● Vercel Analytics muestra performance estable  
● MongoDB connections no exceden límite de 500

**POSTCONDICIONES**:  
● Capacidad de carga validada  
● Métricas de concurrencia documentadas

---

## 9. Matriz de trazabilidad

| CASO DE PRUEBA | REQUERIMIENTO | HISTORIA USUARIO | CASO DE USO | PRIORIDAD |
| -------------- | ------------- | ---------------- | ----------- | --------- |
| CP-001         | RF-001        | HU-001           | CU-001      | Alta      |
| CP-002         | RF-002        | HU-002           | CU-002      | Alta      |
| CP-003         | RF-002        | HU-002           | CU-002      | Alta      |
| CP-004         | RF-004        | HU-004           | CU-004      | Media     |
| CP-005         | RF-009        | HU-005           | CU-004      | Alta      |
| CP-006         | RF-010        | HU-006           | CU-005      | Alta      |
| CP-007         | RF-011        | HU-005           | CU-004      | Alta      |
| CP-008         | RF-011        | HU-007           | CU-006      | Alta      |
| CP-009         | RF-012        | HU-008           | CU-007      | Alta      |
| CP-010         | RF-011        | HU-007           | CU-006      | Alta      |
| CP-011         | RF-015        | HU-009           | CU-008      | Alta      |
| CP-012         | RF-016        | HU-009           | CU-008      | Alta      |
| CP-013         | RF-014        | HU-010           | CU-008      | Media     |
| CP-014         | RF-007        | HU-002           | CU-007      | Alta      |
| CP-015         | RF-005        | HU-014           | CU-009      | Media     |
| CP-016         | RF-017        | HU-011           | CU-010      | Media     |
| CP-017         | RNF-001       | N/A              | N/A         | Alta      |
| CP-018         | RNF-001       | N/A              | N/A         | Alta      |
| CP-019         | RNF-002       | N/A              | N/A         | Alta      |
| CP-020         | RNF-002       | N/A              | N/A         | Alta      |
| CP-021         | RNF-002       | N/A              | N/A         | Alta      |
| CP-022         | RNF-003       | N/A              | N/A         | Media     |
| CP-023         | RNF-004       | N/A              | N/A         | Media     |
| CP-024         | RNF-003       | N/A              | N/A         | Media     |
| CP-025         | RNF-001       | N/A              | N/A         | Media     |

### Cobertura por módulo

| MÓDULO              | CASOS DE PRUEBA                | COBERTURA |
| ------------------- | ------------------------------ | --------- |
| Autenticación       | CP-001, CP-002, CP-003, CP-004 | 100%      |
| Gestión de Mascotas | CP-005, CP-006, CP-007         | 100%      |
| Adopciones          | CP-008, CP-009, CP-010         | 100%      |
| Productos y Carrito | CP-011, CP-012, CP-013         | 100%      |
| Administración      | CP-014, CP-015                 | 100%      |
| Reportes            | CP-016                         | 100%      |
| Rendimiento         | CP-017, CP-018, CP-025         | 100%      |
| Seguridad           | CP-019, CP-020, CP-021         | 100%      |
| Usabilidad          | CP-022, CP-024                 | 100%      |
| Compatibilidad      | CP-023                         | 100%      |

### Cobertura de requerimientos

| TIPO                 | TOTAL  | CUBIERTOS | % COBERTURA |
| -------------------- | ------ | --------- | ----------- |
| Funcionales (RF)     | 18     | 16        | 89%         |
| No Funcionales (RNF) | 8      | 8         | 100%        |
| **TOTAL**            | **26** | **24**    | **92%**     |

**Requerimientos no cubiertos**:  
● RF-003 (Gestión de perfil): Validado en pruebas de integración manual  
● RF-018 (Dashboard administrativo): Validado en pruebas de UAT

**Resumen**:  
● Total de Casos de Prueba: **25**  
● Casos Críticos (Alta prioridad): **17 (68%)**  
● Casos Importantes (Media prioridad): **8 (32%)**  
● Cobertura de Módulos: **100%**  
● Cobertura de Requerimientos: **92%**
