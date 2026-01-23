# Alcance del Proyecto

## Índice

1. Descripción del proyecto
   &nbsp;&nbsp;&nbsp;&nbsp;1.1 ¿Qué es el sistema?
   &nbsp;&nbsp;&nbsp;&nbsp;1.2 ¿Para qué sirve?
   &nbsp;&nbsp;&nbsp;&nbsp;1.3 ¿Quiénes lo usarán?
2. Alcance del producto
   &nbsp;&nbsp;&nbsp;&nbsp;2.1 Lo que sí incluye _(in scope)_
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.1.1 Módulos a desarrollar
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.1.2 Características técnicas y de plataformas soportadas
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.1.3 Integraciones previstas
   &nbsp;&nbsp;&nbsp;&nbsp;2.2 Lo que no incluye _(out of scope)_
3. Entregables del proyecto
4. Criterios de aceptación
5. Supuestos
   &nbsp;&nbsp;&nbsp;&nbsp;5.1 Supuestos operativos
   &nbsp;&nbsp;&nbsp;&nbsp;5.2 Supuestos de desarrollo
   &nbsp;&nbsp;&nbsp;&nbsp;5.3 Supuestos de implementación
6. Restricciones
   &nbsp;&nbsp;&nbsp;&nbsp;6.1 Restricciones académicas
   &nbsp;&nbsp;&nbsp;&nbsp;6.2 Restricciones tecnológicas
   &nbsp;&nbsp;&nbsp;&nbsp;6.3 Restricciones de recursos
   &nbsp;&nbsp;&nbsp;&nbsp;6.4 Restricciones de alcance

---

## 1. Descripción del proyecto

### 1.1 ¿Qué es el sistema?

PawLig es una plataforma web integral orientada a optimizar el proceso de adopción de mascotas y la adquisición de productos para su cuidado. Su objetivo principal es conectar de forma confiable a albergues, adoptantes y la comunidad mediante un entorno digital seguro, transparente y de fácil acceso.

El sistema busca contribuir activamente al bienestar animal en el Valle de Aburrá, fomentando la adopción responsable, la gestión eficiente de refugios y la sostenibilidad de las organizaciones de protección animal, todo a través de herramientas tecnológicas modernas y accesibles.

### 1.2 ¿Para qué sirve?

La aplicación permite agilizar y simplificar los procesos de adopción, mejorar la visibilidad de los refugios y facilitar la compra de productos esenciales para el cuidado de los animales. Asimismo, promueve una comunicación directa y transparente entre adoptantes y albergues, fortaleciendo la confianza en el proceso y fomentando una cultura de tenencia responsable en la comunidad.

### 1.3 ¿Quiénes lo usarán?

- Albergues y fundaciones de animales del Valle de Aburrá.
- Adoptantes y cuidadores interesados en adquirir mascotas.
- Vendedores de productos y accesorios para mascotas.
- Administradores del sistema encargados de la supervisión general.

---

## 2. Alcance del producto

### 2.1 Lo que sí incluye _(in scope)_

1. Registro y autenticación de usuarios con roles diferenciados (administrador, albergue, vendedor, usuario).
2. Gestión de perfiles de albergues y usuarios, incluyendo información de contacto y verificación.
3. Módulo de adopción: registro, búsqueda y visualización de mascotas disponibles.
4. Módulo de productos: catálogo de artículos para el cuidado animal (alimentación, accesorios, medicamentos).
5. Carrito de compras y gestión de pedidos con simulación de transacciones.
6. Panel administrativo para supervisar usuarios, albergues, productos y adopciones.
7. Sistema de comunicación interna entre adoptantes y albergues.
8. Mapa interactivo con ubicación de refugios y puntos de contacto.
9. Sección educativa e informativa sobre adopción responsable y bienestar animal.
10. Interfaz intuitiva y responsive, accesible desde dispositivos móviles y de escritorio.

#### 2.1.1 Módulos a desarrollar

1. **Módulo de gestión de usuarios y autenticación**:  
   a. Registro y autenticación con roles diferenciados (Administrador, Albergue, Vendedor, Usuario).  
   b. Perfiles completos con información de contacto y verificación.  
   c. Gestión de credenciales y recuperación de contraseñas.

2. **Módulo de adopción de mascotas**:  
   a. Registro, edición y eliminación de animales por albergues verificados.  
   b. Búsqueda y filtrado avanzado (especie, raza, ubicación, características).  
   c. Visualización de mascotas disponibles para adopción.  
   d. Actualización de estados de adopción ("Disponible" → "Adoptado").

3. **Módulo de productos y pedidos**:  
   a. Catálogo de productos categorizados (alimentos, accesorios, medicamentos, juguetes).  
   b. Carrito de compras y gestión de pedidos simulados.  
   c. Gestión de inventario por vendedores autorizados.  
   d. Búsqueda y filtrado de productos.

4. **Módulo administrativo y de supervisión**:  
   a. Panel de control para supervisión global del sistema.  
   b. Gestión de usuarios y asignación de roles.  
   c. Moderación de contenido publicado (animales y productos).  
   d. Reportes básicos de actividad y estadísticas.

5. **Módulo de comunicación y contacto**:  
   a. Sistema de mensajería interna entre adoptantes y albergues.  
   b. Notificaciones de estado y actualizaciones.  
   c. Gestión de solicitudes de adopción.

6. **Módulo educativo e informativo**:  
   a. Contenido educativo sobre tenencia responsable y cuidados animales.  
   b. Mapa interactivo de albergues asociados en el Valle de Aburrá.  
   c. Preguntas frecuentes y recursos de apoyo para adoptantes.  
   d. Información de contacto y datos de albergues verificados.

#### 2.1.2 Características técnicas y de plataformas soportadas

- Interfaz web responsive compatible con navegadores modernos (Chrome, Edge, Firefox, Safari).
- Integración con Cloudinary para gestión optimizada de imágenes.
- Base de datos NoSQL en MongoDB mediante Prisma ORM.
- Control de versiones colaborativo con GitHub.
- Despliegue en entorno Node.js con MongoDB.

#### 2.1.3 Integraciones previstas

- Cloudinary (almacenamiento de imágenes).
- Prisma ORM + MongoDB (gestión de base de datos en la nube).
- GitHub (control de versiones y colaboración).

### 2.2 Lo que no incluye _(out of scope)_

- Pasarelas de pago reales ni integraciones con entidades bancarias.
- Aplicación móvil nativa (solo versión web responsive).
- Soporte multilingüe (exclusivamente idioma español).
- Reportes estadísticos avanzados (solo registros básicos en esta versión).
- Funcionalidades de logística o envío físico de productos.
- Integración con redes sociales externas.
- Sistema de calificaciones o reseñas de usuarios.

---

## 3. Entregables del proyecto

- Versión web funcional de PawLig, completamente operativa y accesible desde navegadores modernos.
- Documentación técnica completa, que incluye diagramas de arquitectura, modelo de base de datos, manual de instalación y guía de despliegue.
- Manuales de usuario dirigidos a los distintos roles del sistema: adoptantes, albergues y administradores.
- Código fuente documentado y versionado en GitHub, con control de cambios y trazabilidad de desarrollo.
- Base de datos MongoDB alojada en la nube, configurada con datos de prueba que incluyen usuarios, animales y productos.
- Scripts automatizados de instalación y despliegue, optimizados para entornos basados en Node.js, Prisma ORM y MongoDB Cloud.

---

## 4. Criterios de aceptación

1. **Versión web funcional de PawLig**: Aplicación web operativa, estable y accesible desde navegadores modernos, que implementa las funcionalidades críticas definidas en el alcance (módulos de adopción, productos, usuarios, administración y comunicación).
2. **Documentación técnica completa**: Con diagramas de arquitectura, modelo lógico y físico de datos, especificación de API, manual de instalación, guía de despliegue y notas de diseño.
3. **Manuales de usuario**: Guías prácticas dirigidas a adoptantes, albergues y administradores que describen flujos de uso, pantallas clave y procedimientos (registro, publicación de mascotas, gestión de pedidos, manejo de solicitudes de adopción).
4. **Código fuente documentado y versionado en GitHub**: Repositorio público o privado (según se acuerde) con control de versiones, historial de commits, ramas para features y releases, y README con instrucciones básicas.
5. **Base de datos MongoDB y servicio Cloudinary alojados en la nube**: Instancia establecida con información de prueba representativa (ejemplos de usuarios, animales, productos y pedidos) para ejecutar pruebas funcionales y demostraciones. Asimismo, se incluye Cloudinary como gestor de archivos multimedia, encargado del almacenamiento y administración eficiente de imágenes asociadas a mascotas y productos.
6. **Scripts automatizados de instalación y despliegue**: Scripts y/o instrucciones (shell/npm/docker-compose) que facilitan la puesta en marcha del sistema en entornos basados en Node.js, con configuración para Prisma ORM y la conexión a la instancia MongoDB en la nube.

---

## 5. Supuestos

### 5.1 Supuestos operativos

- Los usuarios objetivo dispondrán de acceso constante a internet.
- Los albergues proporcionarán información veraz y actualizada de los animales.
- Los usuarios finales poseerán competencias básicas de navegación web.
- Las organizaciones asociadas participarán activamente en el registro de animales.

### 5.2 Supuestos de desarrollo

- El equipo mantendrá disponibilidad durante las 7 semanas del cronograma.
- Las herramientas tecnológicas seleccionadas mantendrán su estabilidad operativa.
- Los recursos hardware y software estarán disponibles según lo planeado.
- La documentación será mantenida y actualizada consistentemente.

### 5.3 Supuestos de implementación

- La plataforma será adoptada como canal principal por los albergues asociados.
- Los procesos de adopción se realizarán predominantemente a través del sistema.
- Los diferentes roles de usuario cumplirán con las responsabilidades asignadas.

---

## 6. Restricciones

### 6.1 Restricciones académicas

- **Duración**: 7 semanas según cronograma académico establecido.
- **Presupuesto**: $0 COP (proyecto de carácter académico sin financiamiento).

### 6.2 Restricciones tecnológicas

- **Infraestructura limitada**: Dependencia exclusiva de servicios gratuitos en la nube (Aiven Cloud free tier) con recursos computacionales restringidos.
- **Capacidad de almacenamiento**: Límites impuestos por el plan gratuito de Cloudinary para gestión de imágenes.
- **Conectividad**: Ausencia de servidores dedicados, dependiendo exclusivamente de soluciones PaaS (Platform as a Service).
- **Compatibilidad**: Obligación de mantener compatibilidad con navegadores web estándar, excluyendo tecnologías obsoletas o propietarias.
- **Licencias**: Uso exclusivo de tecnologías de código abierto o con licencias gratuitas para entornos educativos.

### 6.3 Restricciones de recursos

- **Equipo de Desarrollo**: 3 integrantes con roles y responsabilidades específicas.
- **Infraestructura**: Recursos computacionales personales del equipo sin acceso a servidores dedicados.
- **Tiempo disponible**: Máximo 20 horas semanales por integrante debido a carga académica paralela.

### 6.4 Restricciones de alcance

- **Transacciones financieras**: Exclusión de pasarelas de pago reales (solo simulación).
- **Plataformas de despliegue**: Limitación a servicios cloud gratuitos (Vercel, MongoDB Atlas, Cloudinary).
- **Arquitectura**: Aplicación web exclusivamente (sin desarrollo móvil nativo).
- **Idiomas**: Soporte exclusivo en español para la versión inicial.
- **Alcance geográfico**: Enfoque inicial en el Valle de Aburrá sin expansión regional.
