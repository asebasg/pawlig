# REQUERIMIENTOS

## Índice

1. Introducción
   &nbsp;&nbsp;&nbsp;&nbsp;1.1. Propósito del documento
   &nbsp;&nbsp;&nbsp;&nbsp;1.2. Alcance del documento
   &nbsp;&nbsp;&nbsp;&nbsp;1.3. Definiciones, acrónimos y abreviaturas
   &nbsp;&nbsp;&nbsp;&nbsp;1.4. Referencias a otros documentos
2. Requerimientos funcionales
   &nbsp;&nbsp;&nbsp;&nbsp;2.1. Gestión de usuarios
   &nbsp;&nbsp;&nbsp;&nbsp;2.2. Gestión de roles y permisos
   &nbsp;&nbsp;&nbsp;&nbsp;2.3. Gestión de adopciones
   &nbsp;&nbsp;&nbsp;&nbsp;2.4. Gestión de productos y pedidos
   &nbsp;&nbsp;&nbsp;&nbsp;2.5. Reportes y consultas
3. Requerimientos no funcionales
   &nbsp;&nbsp;&nbsp;&nbsp;3.1. Rendimiento
   &nbsp;&nbsp;&nbsp;&nbsp;3.2. Seguridad
   &nbsp;&nbsp;&nbsp;&nbsp;3.3. Usabilidad
   &nbsp;&nbsp;&nbsp;&nbsp;3.4. Compatibilidad
   &nbsp;&nbsp;&nbsp;&nbsp;3.5. Disponibilidad
   &nbsp;&nbsp;&nbsp;&nbsp;3.6. Escalabilidad
   &nbsp;&nbsp;&nbsp;&nbsp;3.7. Mantenibilidad
   &nbsp;&nbsp;&nbsp;&nbsp;3.8. Portabilidad
4. Matriz de trazabilidad

---

## 1. Introducción

### 1.1. Propósito del documento

El presente documento establece la especificación formal de requerimientos funcionales y no funcionales para el sistema **PawLig**, plataforma web integral para adopción responsable de mascotas y comercio electrónico de productos para animales. Este documento servirá como referencia técnica para el equipo de desarrollo, garantizando la alineación entre las expectativas de _stakeholders_ y la implementación técnica del sistema.

### 1.2. Alcance del documento

Este documento cubrirá exclusivamente los requerimientos del sistema **PawLig versión 1.0**, delimitados por el alcance establecido en el _Documento de Alcance versión 1.0_. No incluye requerimientos para versiones futuras, integraciones externas no precisas o funcionalidades excluidas explícitamente.

### 1.3. Definiciones, acrónimos y abreviaturas

- **RF**: Requerimiento funcional
- **RNF**: Requerimiento no funcional
- **HU**: Historia de usuario
- **CU**: Caso de uso
- **UI**: Interfaz de Usuario
- **API**: Interfaz de Programación de Aplicaciones
- **JWT**: JSON Web Token
- **SSR**: Server-Side Rendering
- **WCAG**: Web Content Accessibility Guidelines

### 1.4. Referencias a otros documentos

- Ospina Guzmán, A. S., Úsuga Vasco, M., & Lezcano Escobar, S. (2025). _Acta de Constitución del Proyecto PawLig_. SENA.
- Ospina Guzmán, A. S., Úsuga Vasco, M., & Lezcano Escobar, S. (2025). _Documento de Alcance del Proyecto PawLig_. SENA.
- IEEE Computer Society. (1998). _IEEE Std 830-1998: Recommended Practice for Software Requirements Specifications_.

---

## 2. Requerimientos funcionales

### 2.1. Gestión de usuarios

**RF-001: Registro de Usuario Básico**

- **Descripción**: El sistema debe permitir el registro de nuevos usuarios con información básica.
- **Prioridad**: Alta
- **Entrada**: Email, contraseña, nombre completo, número de identificación, fecha de nacimiento, teléfono, dirección.
- **Proceso**: Validar datos, verificar unicidad de email, crear cuenta con rol "Usuario".
- **Salida**: Cuenta creada, email de confirmación, sesión iniciada automáticamente.
- **Criterios de aceptación**: El usuario puede acceder al sistema inmediatamente después del registro.

**RF-002: Autenticación de Usuarios**

- **Descripción**: El sistema debe permitir el inicio de sesión con credenciales válidas.
- **Prioridad**: Alta
- **Entrada**: Email y contraseña.
- **Proceso**: Validar credenciales, generar token JWT, iniciar sesión.
- **Salida**: Sesión activa, redirección a dashboard según rol.
- **Criterios de aceptación**: Tiempo de autenticación < 3 segundos, bloqueo tras 3 intentos fallidos.

**RF-003: Gestión de Perfil de Usuario**

- **Descripción**: El sistema debe permitir editar información del perfil de usuario.
- **Prioridad**: Media
- **Entrada**: Datos actualizables (teléfono, dirección, foto de perfil)
- **Proceso**: Validar cambios, actualizar base de datos.
- **Salida**: Perfil actualizado, confirmación visual.
- **Criterios de aceptación**: Cambios persisten después de recargar la página.

**RF-004: Recuperación de Contraseña**

- **Descripción**: El sistema debe permitir recuperar contraseña mediante email.
- **Prioridad**: Media
- **Entrada**: Email registrado.
- **Proceso**: Generar token temporal, enviar email con enlace seguro.
- **Salida**: Email enviado, formulario de restablecimiento.
- **Criterios de aceptación**: Enlace expira en 1 hora, contraseña requiere 8 caracteres mínimo.

**RF-005: Gestión de Favoritos**

- **Descripción**: El sistema debe permitir a los usuarios guardar mascotas como favoritas para acceso rápido posterior.
- **Prioridad**: Media
- **Entrada**: ID de mascota a marcar/desmarcar como favorita.
- **Proceso**: Validar que el usuario esté autenticado, verificar existencia de la mascota, agregar o remover de favoritos.
- **Salida**: Mascota agregada o removida de favoritos, confirmación visual.
- **Criterios de aceptación**: Cambios reflejados inmediatamente en el panel de usuario, lista de favoritos persistente entre sesiones.

### 2.2. Gestión de roles y permisos

**RF-006: Asignación de Roles de Usuario**

- **Descripción**: El sistema debe asignar y gestionar roles (Administrador, Albergue, Vendedor, Usuario).
- **Prioridad**: Alta
- **Entrada**: Usuario y rol a asignar (solo Administrador)
- **Proceso**: Validar permisos, actualizar rol en base de datos.
- **Salida**: Rol actualizado, permisos aplicados inmediatamente.
- **Criterios de aceptación**: Usuario ve solo funcionalidades de su rol.

**RF-007: Administración de Albergues**

- **Descripción**: El sistema debe permitir a administradores crear y gestionar cuentas de albergues.
- **Prioridad**: Alta
- **Entrada**: Datos del albergue (nombre, ubicación, contacto, descripción)
- **Proceso**: Validar datos, crear cuenta con rol "Albergue".
- **Salida**: Albergue registrado, credenciales generadas.
- **Criterios de aceptación**: Albergue puede acceder inmediatamente a su panel.

**RF-008: Aprobación de Cuentas de Vendedores**

- **Descripción**: El sistema debe permitir a administradores aprobar solicitudes de vendedores.
- **Prioridad**: Media
- **Entrada**: Solicitud de vendedor, decisión de aprobación.
- **Proceso**: Evaluar solicitud, asignar rol "Vendedor" o rechazar.
- **Salida**: Notificación al solicitante, actualización de permisos.
- **Criterios de aceptación**: Vendedor aprobado puede publicar productos inmediatamente.

### 2.3. Gestión de adopciones

**RF-009: Registro de Animales para Adopción**

- **Descripción**: El sistema debe permitir a albergues registrar animales disponibles para adopción.
- **Prioridad**: Alta
- **Entrada**: Datos del animal (nombre, especie, raza, edad, sexo, descripción, fotos).
- **Proceso**: Validar datos, almacenar en base de datos, generar ficha pública.
- **Salida**: Animal registrado, visible en catálogo de adopciones.
- **Criterios de aceptación**: Ficha muestra toda la información correctamente.

**RF-010: Búsqueda y Filtrado de Animales**

- **Descripción**: El sistema debe permitir buscar y filtrar animales por múltiples criterios.
- **Prioridad**: Alta
- **Entrada**: Criterios de búsqueda (especie, raza, ubicación, edad, etc.)
- **Proceso**: Consultar base de datos, aplicar filtros, ordenar resultados.
- **Salida**: Lista de animales que coinciden con los criterios.
- **Criterios de aceptación**: Tiempo de respuesta < 2 segundos con 1000 registros.

**RF-011: Gestión de Estados de Adopción**

- **Descripción**: El sistema debe permitir actualizar el estado de adopción de los animales.
- **Prioridad**: Alta
- **Entrada**: Nuevo estado ("Disponible", "En proceso", "Adoptado").
- **Proceso**: Validar permisos, actualizar estado en base de datos.
- **Salida**: Estado actualizado, notificaciones si aplica.
- **Criterios de aceptación**: Cambio de estado reflejado inmediatamente en toda la plataforma.

**RF-012: Sistema de Contacto Externo para Adopciones**

- **Descripción**: El sistema debe facilitar el contacto directo entre adoptantes y albergues mediante redirección a sus canales de comunicación externos (WhatsApp e Instagram).
- **Prioridad**: Media
- **Entrada**: Selección de método de contacto (WhatsApp o Instagram), datos de contacto del albergue.
- **Proceso**: Validar que el albergue tenga configurado al menos un método de contacto, generar enlace de redirección con mensaje predeterminado.
- **Salida**: Redirección a aplicación externa (WhatsApp Web/App o Instagram), mensaje predeterminado cargado.
- **Criterios de aceptación**: Redirección funciona correctamente en dispositivos móviles y desktop, mensaje predeterminado incluye referencia a PawLig y nombre de la mascota.

### 2.4. Gestión de productos y pedidos

**RF-013: Publicación de Productos**

- **Descripción**: El sistema debe permitir a vendedores publicar productos en el catálogo.
- **Prioridad**: Alta
- **Entrada**: Datos del producto (nombre, descripción, precio, categoría, stock, imágenes).
- **Proceso**: Validar datos, almacenar en base de datos, generar ficha de producto.
- **Salida**: Producto publicado, visible en tienda.
- **Criterios de aceptación**: Producto aparece en búsquedas inmediatamente.

**RF-014: Gestión de Inventario**

- **Descripción**: El sistema debe permitir a vendedores gestionar stock de productos.
- **Prioridad**: Media
- **Entrada**: Cambios en stock (actualizaciones, nuevas entradas).
- **Proceso**: Validar cambios, actualizar base de datos.
- **Salida**: Stock actualizado, notificaciones si stock bajo.
- **Criterios de aceptación**: No se permiten ventas si stock = 0.

**RF-015: Carrito de Compras**

- **Descripción**: El sistema debe permitir a usuarios agregar productos al carrito de compras.
- **Prioridad**: Alta
- **Entrada**: Producto y cantidad a agregar.
- **Proceso**: Validar disponibilidad, agregar al carrito de sesión.
- **Salida**: Carrito actualizado, resumen de compra.
- **Criterios de aceptación**: Carrito persiste durante la sesión, cálculo correcto de totales.

**RF-016: Proceso de Checkout Simulado**

- **Descripción**: El sistema debe simular el proceso de checkout sin transacciones reales.
- **Prioridad**: Media
- **Entrada**: Datos de envío, método de pago simulado.
- **Proceso**: Validar datos, generar pedido simulado, actualizar stock.
- **Salida**: Confirmación de pedido, número de seguimiento simulado.
- **Criterios de aceptación**: Stock se actualiza correctamente, usuario recibe confirmación.

### 2.5. Reportes y consultas

**RF-017: Reporte de Adopciones por Albergue**

- **Descripción**: El sistema debe generar reportes de adopciones para albergues.
- **Prioridad**: Baja
- **Entrada**: Rango de fechas, albergue específico.
- **Proceso**: Consultar base de datos, generar estadísticas.
- **Salida**: Reporte con métricas de adopción.
- **Criterios de aceptación**: Datos precisos, formato descargable (PDF).

**RF-018: Dashboard Administrativo**

- **Descripción**: El sistema debe proporcionar dashboard con métricas globales para administradores.
- **Prioridad**: Media
- **Entrada**: Filtros opcionales (fechas, tipos de usuario)
- **Proceso**: Agregar datos de múltiples fuentes, calcular KPIs.
- **Salida**: Visualización de métricas principales.
- **Criterios de aceptación**: Tiempo de carga < 5 segundos, datos actualizados.

---

## 3. Requerimientos no funcionales

### 3.1. Rendimiento

**RNF-001: Tiempos de respuesta**

- Tiempo de carga página inicial: < 3 segundos.
- Tiempo de respuesta API: < 2 segundos para operaciones críticas.
- Tiempo de búsqueda: < 2 segundos con 10,000 registros.
- Usuarios concurrentes soportados: 100 simultáneos.

### 3.2. Seguridad

**RNF-002: Protección de datos**

- Encriptación de contraseñas: Bcrypt con salt rounds 12.
- Protección contra SQL Injection: Validación parametrizada de queries.
- Protección contra XSS: Sanitización de inputs y outputs.
- Manejo de sesiones: JWT con expiración de 24 horas.
- HTTPS obligatorio para todas las comunicaciones.

### 3.3. Usabilidad

**RNF-003: Experiencia de usuario**

- Interfaz intuitiva: Usuario puede realizar tareas principales sin entrenamiento.
- Diseño responsive: Funcionalidad completa en dispositivos móviles (320px+) y desktop.
- Accesibilidad: Cumplimiento WCAG 2.1 nivel AA.
- Tiempo de aprendizaje: < 15 minutos para usuarios básicos.

### 3.4. Compatibilidad

**RNF-004: Navegadores soportados**

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Dispositivos: Desktop, tablet, móvil
- Sistemas operativos: Windows 10+, macOS 10.14+, iOS 14+, Android 10+

### 3.5. Disponibilidad

**RNF-005: Tiempo de actividad**

- Uptime esperado: 99% en horario laboral (7:00 AM – 10:00 PM).
- Mantenimiento: Ventanas los domingos 2:00 AM – 4:00 AM.
- Tolerancia a fallos: Recuperación automática en < 5 minutos.

### 3.6. Escalabilidad

**RNF-006: Crecimiento del sistema**

- Capacidad inicial: 10,000 usuarios registrados.
- Escalabilidad horizontal: Posibilidad de agregar más instancias.
- Base de datos: Diseñada para 100,000 registros de animales.
- Arquitectura: Microservicios preparados para escalado independiente.

### 3.7. Mantenibilidad

**RNF-007: Facilidad de mantenimiento**

- Código documentado: 80% de cobertura de comentarios.
- Logs estructurados: Trazabilidad completa de operaciones.
- Testing: 70% cobertura de pruebas unitarias.
- Documentación técnica: Actualizada con cada release.

### 3.8. Portabilidad

**RNF-008: Despliegue en diferentes entornos**

- Contenedores: Docker para todos los componentes.
- Cloud: Compatible con Vercel, Railway, MongoDB Atlas.
- Variables de entorno: Configuración externalizada.
- Scripts de despliegue: Automatizados y documentados.

---

## 4. Matriz de trazabilidad

| ID     | Requerimiento                               | Prioridad | Fuente               | Historia de usuario | Caso de uso |
| ------ | ------------------------------------------- | --------- | -------------------- | ------------------- | ----------- |
| RF-001 | Registro de usuario básico                  | Alta      | Acta de constitución | HU-001              | CU-001      |
| RF-002 | Autenticación de usuarios                   | Alta      | Stakeholders         | HU-002              | CU-002      |
| RF-003 | Gestión de perfil de usuario                | Media     | Alcance              | HU-003              | CU-003      |
| RF-004 | Recuperación de contraseña                  | Media     | Stakeholders         | HU-004              | CU-004      |
| RF-005 | Gestión de favoritos                        | Media     | Stakeholders         | HU-004              | CU-003      |
| RF-006 | Asignación de roles de usuario              | Alta      | Alcance              | HU-005              | CU-005      |
| RF-007 | Administración de albergues                 | Alta      | Stakeholders         | HU-006              | CU-006      |
| RF-008 | Aprobación de cuentas de vendedores         | Media     | Alcance              | HU-007              | CU-007      |
| RF-009 | Registro de animales para adopción          | Alta      | Acta de constitución | HU-008              | CU-008      |
| RF-010 | Búsqueda y filtrado de animales             | Alta      | Stakeholders         | HU-009              | CU-009      |
| RF-011 | Gestión de estados de adopción              | Alta      | Alcance              | HU-010              | CU-010      |
| RF-012 | Sistema de contacto externo para adopciones | Media     | Stakeholders         | HU-008              | CU-007      |
| RF-013 | Publicación de productos                    | Alta      | Acta de constitución | HU-012              | CU-012      |
| RF-014 | Gestión de inventario                       | Media     | Alcance              | HU-013              | CU-013      |
| RF-015 | Carrito de compras                          | Alta      | Stakeholders         | HU-014              | CU-014      |
| RF-016 | Proceso de checkout simulado                | Media     | Alcance              | HU-015              | CU-015      |
| RF-017 | Reporte de adopciones por albergue          | Baja      | Stakeholders         | HU-016              | CU-016      |
| RF-018 | Dashboard administrativo                    | Media     | Alcance              | HU-017              | CU-017      |
