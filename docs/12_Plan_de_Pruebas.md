# Plan de Pruebas

## Índice

1. Introducción
   &nbsp;&nbsp;&nbsp;&nbsp;1.1. Propósito
   &nbsp;&nbsp;&nbsp;&nbsp;1.2. Alcance
2. Estrategia de pruebas
   &nbsp;&nbsp;&nbsp;&nbsp;2.1. Niveles de pruebas
   &nbsp;&nbsp;&nbsp;&nbsp;2.2. Tipos de pruebas
3. Criterios de prueba
   &nbsp;&nbsp;&nbsp;&nbsp;3.1. Criterios de entrada
   &nbsp;&nbsp;&nbsp;&nbsp;3.2. Criterios de salida
   &nbsp;&nbsp;&nbsp;&nbsp;3.3. Criterios de suspensión
4. Recursos
   &nbsp;&nbsp;&nbsp;&nbsp;4.1. Equipo de pruebas
   &nbsp;&nbsp;&nbsp;&nbsp;4.2. Herramientas
5. Cronograma de pruebas
6. Gestión de riesgos
7. Entregables
8. Aprobaciones

---

## 1. Introducción

### 1.1. Propósito

Este Plan de Pruebas define la estrategia, alcance, recursos y cronograma de las actividades de testing para **PawLig**, plataforma web integral para la adopción responsable de mascotas y comercio electrónico de productos para animales en el Valle de Aburrá.

El objetivo es asegurar que el sistema cumpla con los **18 requerimientos funcionales (RF-001 a RF-018)** y **8 requerimientos no funcionales (RNF-001 a RNF-008)** establecidos en la documentación del proyecto, garantizando la calidad del producto antes de su despliegue en producción.

### 1.2. Alcance

Las pruebas cubrirán los siguientes módulos de PawLig versión 1.0.

**MÓDULOS INCLUIDOS:**  
01. Autenticación y gestión de usuarios (RF-001, RF-002, RF-003, RF-004)  
02. Gestión de roles y permisos (RF-005, RF-006, RF-007, RF-008)  
03. Módulo de adopción de mascotas (RF-009, RF-010, RF-011, RF-012)  
04. Sistema de comunicación externa (WhatsApp/Instagram)  
05. Módulo de productos y pedidos simulados (RF-013, RF-014, RF-015, RF-016)  
06. Reportes y consultas (RF-017, RF-018)  
07. Panel administrativo  
08. Requerimientos no funcionales (rendimiento, seguridad, usabilidad, compatibilidad)

**MÓDULOS EXCLUIDOS:**  
01. Pasarelas de pago reales (fuera del alcance v1.0)  
02. Aplicaciones móviles nativas (solo web responsive)  
03. Soporte multilingüe (solo español)  
04. Integraciones con APIs de redes sociales (solo redirección)

---

## 2. Estrategia de pruebas

### 2.1. Niveles de pruebas

| Nivel       | Descripción                                                                       | Responsable                     | Herramientas                |
| ----------- | --------------------------------------------------------------------------------- | ------------------------------- | --------------------------- |
| Unitarias   | Verificación de funciones y componentes individuales (API Routes, Server Actions) | Desarrolladores (Andrés, Mateo) | Jest, React Testing Library |
| Integración | Prueba de interacción entre módulos (Frontend-Backend, Backend-MongoDB)           | Equipo QA (Santiago + Equipo)   | Postman, Playwright         |
| Sistema     | Validación completa del sistema en entorno de desarrollo y preview de Vercel      | Líder QA (Santiago)             | Playwright, Manual          |
| Aceptación  | Validación con usuarios finales simulados y docente orientador                    | Equipo completo + Docente       | Manual, Checklist UAT       |

### 2.2. Tipos de pruebas

| Tipo de Prueba | Descripción                                                                                                                                                                                                                                             | Prioridad |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| Funcionales    | Verificación de RF-001 a RF-018:<br>● Login/Registro (RF-001, RF-002)<br>● CRUD mascotas (RF-009)<br>● Búsqueda y filtros (RF-010)<br>● Postulaciones (RF-011)<br>● Carrito y checkout simulado (RF-015, RF-016)<br>● Gestión de roles (RF-005, RF-006) | Alta      |
| Regresión      | Validación de funcionalidades existentes después de cambios o correcciones de bugs. Se ejecutarán casos críticos (login, búsqueda, postulaciones) después de cada sprint.                                                                               | Media     |
| Rendimiento    | Evaluación de RNF-001:<br>● Tiempo de carga página inicial < 3 segundos<br>● Tiempo de respuesta API < 2 segundos<br>● Búsqueda con 1,000 registros < 2 segundos<br>● 100 usuarios concurrentes soportados                                              | Alta      |
| Seguridad      | Análisis de RNF-002:<br>● Encriptación de contraseñas (bcrypt salt 12)<br>● Protección SQL Injection (Prisma ORM)<br>● Protección XSS (sanitización inputs)<br>● Sesiones JWT (expiración 24 horas)<br>● HTTPS obligatorio                              | Alta      |
| Usabilidad     | Evaluación de RNF-003:<br>● Interfaz intuitiva (tareas sin entrenamiento)<br>● Diseño responsive (320px+ móvil, desktop)<br>● Accesibilidad WCAG 2.1 AA<br>● Tiempo de aprendizaje <15 minutos                                                          | Media     |
| Compatibilidad | Validación de RNF-004 en:<br>● Chrome 90+<br>● Firefox 88+<br>● Safari 14+<br>● Edge 90+<br>Dispositivos: Desktop, tablet, móvil                                                                                                                        | Media     |

---

## 3. Criterios de prueba

### 3.1. Criterios de entrada

Para iniciar las pruebas se requiere:  
01. Sprint 5 completado con todas las historias de usuario implementadas.  
02. Código fuente desplegado en ambiente de preview de Vercel.  
03. Base de datos MongoDB con datos de prueba poblados:  
&nbsp;&nbsp;&nbsp;&nbsp;a. Mínimo 3 usuarios por rol (Admin, Albergue, Vendedor, Adoptante).  
&nbsp;&nbsp;&nbsp;&nbsp;b. Mínimo 20 mascotas en diferentes estados.  
&nbsp;&nbsp;&nbsp;&nbsp;c. Mínimo 15 productos con stock variado.  
04. Documentación de requerimientos aprobada (RF y RNF).  
05. Casos de prueba diseñados, revisados y aprobados (Documento 17).  
06. Cloudinary configurado con imágenes de prueba.  
07. Ambiente de pruebas estable y accesible.

### 3.2. Criterios de salida

Las pruebas se consideran completas cuando:  
01. Se han ejecutado el 100% de los casos de prueba planificados.  
02. No existen defectos críticos (Severity 1) o bloqueantes abiertos.  
03. 95% o más de casos de prueba exitosos (máximo 5% de fallos aceptables).  
04. Todos los defectos de severidad alta (Severity 2) están resueltos y verificados.  
05. Defectos de severidad media/baja documentados con plan de corrección post-lanzamiento.  
06. Aprobación formal del líder de QA (Santiago) y líder de proyecto (Andrés).  
07. Informe de Resultados de Pruebas completado.  
08. Requerimientos no funcionales cumplidos (performance, seguridad, usabilidad).

### 3.3. Criterios de suspensión

Las pruebas se suspenderán temporalmente si:  
01. Ambiente de preview de Vercel no disponible por más de 4 horas.  
02. Base de datos MongoDB inaccesible o corrupta.  
03. Se detectan más de 3 defectos críticos (Severity 1) en una sesión de testing.  
04. Tasa de fallas supera el 50% de los casos ejecutados en un módulo.  
05. Cambios mayores en requerimientos que invalidan casos de prueba existentes.  
06. Build de Vercel falla continuamente, impidiendo despliegue.

**Proceso de reanudación:**  
● Documentar causa de suspensión.  
● Corregir problema raíz.  
● Re-validar ambiente de pruebas.  
● Obtener aprobación del líder de proyecto.  
● Reanudar testing desde último punto estable.

---

## 4. Recursos

### 4.1. Equipo de pruebas

| Rol                          | Responsabilidades                                                                                                                                                      | Integrante                           | Horas Asignadas                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ----------------------------------- |
| Líder de QA                  | ● Planificación y coordinación de pruebas.<br>● Diseño de casos de prueba.<br>● Ejecución de pruebas de sistema.<br>● Generación de reportes.<br>● Gestión de defectos | Santiago Lezcano Escobar             | 24 horas                            |
| Tester Funcional             | ● Ejecución de casos de prueba funcionales.<br>● Pruebas de regresión.<br>● Reporte de defectos.<br>● Validación de correcciones                                       | Andrés Ospina, Mateo Úsuga (8 h c/u) | 16 horas                            |
| Desarrollador (Soporte a QA) | ● Corrección de defectos.<br>● Explicación de comportamientos esperados.<br>● Re-despliegue de builds                                                                  | Andrés Ospina, Mateo Úsuga           | Variable según defectos encontrados |

### 4.2. Herramientas

| Categoría                 | Herramienta               | Propósito                                                                  |
| ------------------------- | ------------------------- | -------------------------------------------------------------------------- |
| Gestión de Pruebas        | GitHub Projects           | Tracking de casos de prueba                                                |
| Gestión de Pruebas        | Excel/Google Sheets       | Matriz de trazabilidad                                                     |
| Automatización Frontend   | Playwright                | Pruebas E2E de flujos críticos, Pruebas de regresión automatizadas         |
| Pruebas de API            | Postman                   | Testing de API Routes                                                      |
| Pruebas de API            | Thunder Client (VSCode)   | Validación de endpoints REST                                               |
| Rendimiento               | Lighthouse CI             | Análisis de Web Vitals                                                     |
| Rendimiento               | Chrome DevTools           | Performance profiling                                                      |
| Análisis de Seguridad     | OWASP ZAP (opcional)      | Análisis de vulnerabilidades                                               |
| Análisis de Seguridad     | Manual Security Testing   | Validación de controles de seguridad                                       |
| Seguimiento de Defectos   | GitHub Issues             | Registro y tracking de bugs (con labels: bug, critical, high, medium, low) |
| Testing de Compatibilidad | BrowserStack (free trial) | Testing cross-browser                                                      |
| Testing de Compatibilidad | Dispositivos físicos      | Testing responsive                                                         |

---

## 5. Cronograma de pruebas

| Fase                | Actividades                                                                                                                                                                                                 | Duración              | Fechas                                            |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------- |
| Planificación       | ● Análisis de requerimientos.<br>● Diseño de casos de prueba (Doc 17).<br>● Revisión y aprobación del plan                                                                                                  | 1 día                 | 27 Nov 2025                                       |
| Preparación         | ● Configuración de ambientes.<br>● Población de datos de prueba en MongoDB.<br>● Setup de herramientas (Playwright, Postman).<br>● Configuración de usuarios de prueba.                                     | 1 día                 | 28 Nov 2025                                       |
| Ejecución - Ciclo 1 | ● Pruebas funcionales de módulos críticos: Autenticación, gestión de mascotas, búsqueda y filtros.<br>● Registro de defectos encontrados.                                                                   | 2 días                | 29–30 nov 2025                                    |
| Correcciones        | ● Desarrollo corrige defectos del Ciclo 1.<br>● Re-despliegue en preview de Vercel.                                                                                                                         | 1 día                 | 1 dic 2025                                        |
| Ejecución - Ciclo 2 | ● Re-pruebas (defectos corregidos).<br>● Pruebas de regresión.<br>● Pruebas de módulos restantes: Postulaciones, Productos y carrito, Reportes.<br>● Pruebas de rendimiento.<br>● Pruebas de compatibilidad | 1 día                 | 2 dic 2025                                        |
| Validación Final    | ● Pruebas de aceptación de usuario (UAT).<br>● Validación de RNF (performance, seguridad).<br>● Generación de informe de resultados.<br>● Aprobaciones finales                                              | 1 día                 | 3 dic 2025                                        |
| Cierre              | ● Documentación de lecciones aprendidas.<br>● Entrega de reportes finales.<br>● Archivado de evidencias                                                                                                     | Mismo día             | 3 dic 2025                                        |
| **TOTAL**           |                                                                                                                                                                                                             | **7 días (1 semana)** | **Del 27 de noviembre al 3 de diciembre de 2025** |

**HITOS CLAVE:**  
● 27 nov: Plan de pruebas aprobado.  
● 28 nov: Casos de prueba completados (Doc 17).  
● 30 nov: Ciclo 1 completado, defectos reportados.  
● 2 dic: Ciclo 2 completado, repruebas finalizadas.  
● 3 dic: Informe de resultados entregado, aprobación final.

---

## 6. Gestión de riesgos

| Riesgo                                                     | Probabilidad | Impacto | Mitigación                                                                                                                              |
| ---------------------------------------------------------- | ------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Retrasos en corrección de defectos críticos encontrados    | Media        | Alto    | ● Priorizar defectos críticos.<br>● Sesiones diarias de revisión de bugs.<br>● Asignar desarrolladores dedicados                        |
| Ambiente de Vercel inestable (downtime, errores de deploy) | Baja         | Alto    | ● Usar preview deployments estables.<br>● Tener build local como respaldo.<br>● Contacto directo con soporte Vercel                     |
| Datos de prueba insuficientes o corruptos en MongoDB       | Media        | Medio   | ● Scripts automatizados de población.<br>● Backup de datos de prueba.<br>● Validación de datos pre-testing                              |
| Falta de tiempo para completar todos los casos de prueba   | Alta         | Alto    | ● Priorizar casos de prueba críticos.<br>● Automatizar casos repetitivos con Playwright.<br>● Extender 1–2 días si es necesario         |
| Cambios de última hora en requerimientos                   | Media        | Alto    | ● Control de cambios estricto post-Sprint 5.<br>● Congelar features después del 26 nov.<br>● Documentar cambios urgentes                |
| Incompatibilidad con navegadores específicos no probados   | Baja         | Medio   | ● Testing temprano en múltiples navegadores.<br>● Uso de BrowserStack para cobertura.<br>● Priorizar Chrome/Firefox (80% usuarios)      |
| Problemas de performance no detectados tempranamente       | Media        | Alto    | ● Pruebas de rendimiento desde Ciclo 1.<br>● Monitoreo con Lighthouse en cada deploy.<br>● Optimización proactiva (lazy loading, caché) |

---

## 7. Entregables

Los siguientes documentos serán entregados al finalizar la fase de pruebas:

| Documento              | Descripción                                                                              | Responsable | Fecha Entrega |
| ---------------------- | ---------------------------------------------------------------------------------------- | ----------- | ------------- |
| 16_Plan_de_Pruebas.pdf | Estrategia y planificación de las pruebas.                                               | Santiago    | 27 Nov 2025   |
| 17_Casos_de_Prueba.pdf | Casos de prueba detallados (mínimo 20) con pasos, precondiciones y resultados esperados. | Santiago    | 28 Nov 2025   |
| Evidencias_Pruebas/    | Carpeta con screenshots, videos, logs de Playwright y reportes de Lighthouse.            | Santiago    | 3 dic 2025    |

---

## 8. Aprobaciones

El presente Plan de Pruebas ha sido revisado y aprobado por:

**Andrés Sebastián Ospina Guzmán**  
Líder del proyecto  
20 de noviembre de 2025

**Santiago Lezcano Escobar**  
Líder de QA  
20 de noviembre de 2025
