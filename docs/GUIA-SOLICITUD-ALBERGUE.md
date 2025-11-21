# 🐾 PAWLIG - Historia de Usuario 2: Solicitud de Cuenta para Albergue

## 🎯 Objetivo

Permitir que representantes de albergues y entidades de rescate soliciten una cuenta especializada para publicar mascotas y gestionar solicitudes de adopción en el Valle de Aburrá.

## 🌐 Acceder al Formulario

### Para Representantes del Albergue:

**URL en Desarrollo:**
```
http://localhost:3000/request-shelter
```

**URL en Producción:**
```
https://pawlig.com/request-shelter
```

### Estructura de la Página:
1. **Header informativo** - Explica el propósito del formulario
2. **Formulario de solicitud** - En 2 secciones:
   - Datos del Representante
   - Datos del Albergue o Entidad de Rescate
3. **Footer informativo** - Explica qué ocurre después de enviar

## 📋 Campos del Formulario

### 👤 Datos del Representante (REQUERIDOS)
- **Nombre Completo** - Mínimo 2 caracteres
- **Número de Identificación** - Mínimo 5 caracteres
- **Fecha de Nacimiento** - Debe ser mayor de 18 años
- **Email** - Debe ser único en el sistema
- **Teléfono** - 7-15 caracteres
- **Municipio** - Seleccionar del Valle de Aburrá
- **Dirección Personal** - Mínimo 5 caracteres
- **Contraseña** - Mínimo 8 caracteres

### 🏠 Datos del Albergue (REQUERIDOS*)
- **Nombre del Albergue** - 3-100 caracteres (REQUERIDO)
- **Municipio del Albergue** - (REQUERIDO)
- **Dirección del Albergue** - 5-200 caracteres (REQUERIDO)
- **Descripción del Albergue** - 20-500 caracteres (OPCIONAL)
- **WhatsApp de Contacto** - Formato +57... (OPCIONAL)
- **Instagram del Albergue** - Formato @usuario (OPCIONAL)

## ✅ Validación de Campos

El formulario valida automáticamente:
- ✅ Que todos los campos obligatorios estén completos
- ✅ Formato correcto de emails
- ✅ Contraseña con longitud mínima
- ✅ Teléfonos en formato válido
- ✅ Municipios válidos
- ✅ Email único (no repetido en el sistema)
- ✅ Mayor de 18 años

**Si hay errores**, el sistema mostrará un mensaje bajo cada campo indicando qué está mal.

## 🚀 Proceso de Envío

1. **Rellenar formulario** - Completar todos los campos marcados con *
2. **Validación** - El sistema valida los datos
3. **Envío** - Al hacer clic en "Enviar Solicitud"
4. **Confirmación** - Mensaje de éxito
5. **Estado** - La solicitud queda en "Pendiente de aprobación"

## 📊 Estados de la Solicitud

| Estado | Significado | Acción |
|--------|-------------|--------|
| 🔄 PENDING | Esperando revisión del administrador | Esperar notificación |
| ✅ APPROVED | Solicitud aprobada | Puedes crear mascotas y gestionar adopciones |
| ❌ REJECTED | Solicitud rechazada | Revisar razón y reenviar |

## 📧 Notificaciones

Después de enviar tu solicitud:

1. **Inmediatamente**: Recibirás confirmación en pantalla
2. **En el plazo de 48 horas**: Recibirás un email del administrador con la decisión:
   - ✅ **Aprobación**: Puedes comenzar a usar tu cuenta
   - ❌ **Rechazo**: Te indicaremos la razón (puedes reenviar)

## 💡 Consejos para una Solicitud Exitosa

- ✨ Proporciona información completa y precisa
- 🏢 Incluye descripción clara de tu entidad de rescate
- 📱 Asegúrate de que los números de contacto sean correctos
- 📍 Verifica que el municipio sea dentro del Valle de Aburrá
- ✍️ Sé descriptivo sobre la misión y trabajo de tu albergue

## 🔐 Seguridad

- 🔒 Tu contraseña se encripta y nunca se muestra
- 🛡️ Todos los datos se validan en servidor
- 🔑 Solo tú tienes acceso a tu cuenta
- 📋 Tus datos se protegen conforme la ley

## ❓ Preguntas Frecuentes

### ¿Cuánto tiempo tarda la aprobación?
Usualmente 48 horas. Te notificaremos por email.

### ¿Qué pasa si mi solicitud es rechazada?
Recibirás un email con la razón. Puedes corregir los datos y enviar una nueva solicitud.

### ¿Puedo cambiar mi información después?
Sí, en tu perfil podrás editar los datos de tu albergue una vez aprobado.

### ¿Cuál es el municipio de mi albergue?
Debe ser uno del Valle de Aburrá:
- Medellín
- Bello
- Itagüí
- Envigado
- Sabaneta
- La Estrella
- Caldas
- Copacabana
- Girardota
- Barbosa

### ¿Qué puedo hacer una vez aprobado?
- 📸 Publicar mascotas disponibles para adopción
- 📝 Gestionar solicitudes de adopción
- 👥 Comunicarte con adoptantes potenciales
- 📊 Ver estadísticas de tus publicaciones

## 🆘 Soporte

Si tienes problemas:
1. Verifica que todos los campos estén completos
2. Recarga la página y intenta de nuevo
3. Contacta a: soporte@pawlig.com

## 📞 Contacto

- 📧 Email: info@pawlig.com
- 💬 WhatsApp: +57 (1) 234-5678
- 🌐 Web: www.pawlig.com

---

**¡Bienvenido a PAWLIG! 🐾**

Tu participación ayuda a encontrar hogares para mascotas en el Valle de Aburrá.
