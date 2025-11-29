# Quick Start - Navbar y Footer

## 🚀 Inicio Rápido

### 1. Verificar Instalación
```bash
# Verificar que todas las dependencias estén instaladas
npm install

# Verificar que no haya errores de TypeScript
npx tsc --noEmit

# Verificar ESLint
npm run lint
```

### 2. Iniciar Servidor
```bash
npm run dev
```

Abrir http://localhost:3000

### 3. Verificación Visual Rápida

#### Sin Autenticación
- ✅ Logo visible en navbar
- ✅ Links: Inicio, Adopciones, Productos, Albergues
- ✅ Botones: "Iniciar Sesión" y "Registrarse"
- ✅ Footer con 4 columnas visible

#### Con Autenticación (Login)
1. Ir a http://localhost:3000/login
2. Iniciar sesión con cualquier usuario
3. Verificar:
   - ✅ Navbar actualizado con navegación por rol
   - ✅ Avatar de usuario visible
   - ✅ Menú de usuario funcional
   - ✅ Footer sigue visible

#### Responsive (Móvil)
1. Abrir DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Seleccionar iPhone o Android
4. Verificar:
   - ✅ Hamburger menu visible
   - ✅ Logo centrado
   - ✅ Drawer funcional
   - ✅ Footer en 1 columna

## 📁 Archivos Importantes

### Componentes Principales
```
components/layout/navbar.tsx       # Navbar principal
components/layout/footer.tsx       # Footer principal
components/ui/logo.tsx             # Logo
```

### Configuración
```
lib/constants.ts                   # Rutas y navegación
lib/auth/session.ts               # Helpers de sesión
tailwind.config.ts                # Colores y fuentes
```

### Layout
```
app/layout.tsx                    # Layout principal con Navbar + Footer
app/globals.css                   # Estilos globales
```

## 🎨 Personalización Rápida

### Cambiar Color Principal
```typescript
// tailwind.config.ts
colors: {
  purple: {
    600: '#7C3AED', // ← Cambiar aquí
  }
}
```

### Agregar Link Público
```typescript
// lib/constants.ts
export const PUBLIC_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Nuevo Link", href: "/nuevo" }, // ← Agregar aquí
];
```

### Cambiar Logo
```typescript
// components/ui/logo.tsx
// Reemplazar PawPrint con otro ícono de lucide-react
import { TuIcono } from "lucide-react";
```

## 🔧 Comandos Útiles

### Desarrollo
```bash
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm start                # Servidor de producción
```

### Prisma
```bash
npx prisma studio        # Ver base de datos
npx prisma generate      # Generar cliente
npx prisma db push       # Sincronizar schema
```

### Linting
```bash
npm run lint             # Ejecutar ESLint
npm run lint -- --fix    # Corregir automáticamente
```

## 🐛 Solución Rápida de Problemas

### Navbar no aparece
```bash
# 1. Verificar que layout.tsx tenga el import
# 2. Reiniciar servidor
npm run dev
```

### Colores no funcionan
```bash
# Limpiar cache de Tailwind
rm -rf .next
npm run dev
```

### TypeScript errors
```bash
# Regenerar tipos
npx prisma generate
npm run dev
```

### Sesión no funciona
```bash
# Verificar variables de entorno
cat .env.local

# Debe tener:
# NEXTAUTH_SECRET=...
# NEXTAUTH_URL=http://localhost:3000
```

## 📱 Prueba Rápida en Móvil

### Opción 1: DevTools
1. F12 → Toggle device toolbar
2. Seleccionar dispositivo
3. Probar navegación

### Opción 2: Dispositivo Real
1. Obtener IP local:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. En el dispositivo móvil:
   - Conectar a misma red WiFi
   - Abrir http://TU_IP:3000

## 🎯 Checklist Mínimo

Antes de hacer commit:

- [ ] `npm run dev` funciona sin errores
- [ ] `npm run lint` sin warnings
- [ ] Navbar visible en desktop
- [ ] Navbar visible en móvil
- [ ] Footer visible
- [ ] Login/Logout funciona
- [ ] Navegación por rol funciona

## 📚 Documentación Completa

Para más detalles, ver:

- **IMPLEMENTATION-SUMMARY.md** - Resumen técnico
- **USAGE-GUIDE.md** - Guía de uso completa
- **TESTING-CHECKLIST.md** - Pruebas detalladas
- **PR-DESCRIPTION.md** - Descripción del PR

## 💡 Tips

1. **Hot Reload**: Los cambios se reflejan automáticamente
2. **TypeScript**: Usa autocompletado (Ctrl+Space)
3. **Tailwind**: Usa extensión de VS Code para autocompletado
4. **Iconos**: Busca en https://lucide.dev/icons/
5. **Colores**: Usa https://tailwindcss.com/docs/customizing-colors

## 🆘 Ayuda

Si algo no funciona:

1. Revisar consola del navegador (F12)
2. Revisar terminal donde corre `npm run dev`
3. Revisar documentación en `/documentation/pull-request/Navbar-Footer/`
4. Contactar al equipo

## ✅ Todo Listo!

Si todo funciona correctamente, estás listo para:

1. Hacer commit de los cambios
2. Crear Pull Request
3. Solicitar revisión

---

**¡Feliz desarrollo! 🎉**
