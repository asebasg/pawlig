import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Middleware: Control de Acceso
 * Descripción: Intercepta las solicitudes a rutas protegidas para verificar la autenticación y autorización del usuario.
 * Requiere: Un token de sesión de NextAuth válido.
 * Implementa: RN-001 (Acceso por roles), RN-002 (Bloqueo de usuarios inactivos).
 */
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    //  Bloquear usuarios con isActive = false
    if (token && token.isActive === false) {
      return NextResponse.redirect(
        new URL("/unauthorized?reason=account_blocked", req.url)
      );
    }

    //  Protección de ruta /request-shelter
    // Solo usuarios con rol ADOPTER o VENDOR pueden solicitar ser albergue
    if (path === "/request-shelter") {
      if (!token) {
        return NextResponse.redirect(
          new URL("/login?callbackUrl=/request-shelter", req.url)
        );
      }

      const allowedRoles = ["ADOPTER", "VENDOR"];
      if (!allowedRoles.includes(token.role as string)) {
        return NextResponse.redirect(
          new URL("/unauthorized?reason=adopters_vendors_only", req.url)
        );
      }
    }

    //  Protección de rutas administrativas
    if (path.startsWith("/admin")) {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(
          new URL("/unauthorized?reason=admin_only", req.url)
        );
      }
    }

    //  Protección de rutas de albergues
    if (path.startsWith("/shelter")) {
      if (!token || token.role !== "SHELTER") {
        return NextResponse.redirect(
          new URL("/unauthorized?reason=shelter_only", req.url)
        );
      }
    }

    //  Protección de rutas de vendedores
    if (path.startsWith("/vendor")) {
      if (!token || token.role !== "VENDOR") {
        return NextResponse.redirect(
          new URL("/unauthorized?reason=vendor_only", req.url)
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/request-shelter",
    "/admin/:path*",
    "/shelter/:path*",
    "/vendor/:path*",
    "/user/:path*",
  ],
};

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * **Descripción General:**
 * Este archivo de middleware es un punto central de control de acceso para
 * las rutas protegidas de la aplicación. Utiliza `next-auth` para interceptar
 * las solicitudes, verificar la autenticación y la autorización del usuario
 * antes de permitir el acceso a las páginas solicitadas.
 *
 * **Lógica Clave:**
 * - **Envoltura con `withAuth`:** El middleware se exporta a través de la
 *   función `withAuth` de `next-auth`, que simplifica la obtención del token
 *   JWT y la gestión de la autenticación básica.
 * - **Orden de Verificación:** La lógica de autorización sigue un orden
 *   estricto para garantizar la seguridad:
 *   1. **Autenticación:** `withAuth` primero asegura que exista un token válido.
 *   2. **Estado de Actividad:** La primera verificación explícita es si el
 *      usuario está activo (`token.isActive`). Si no lo está, se le deniega
 *      el acceso a CUALQUIER ruta protegida, siendo esta la regla de mayor
 *      prioridad.
 *   3. **Autorización por Rol:** Se implementan chequeos específicos para cada
 *      grupo de rutas (ej: `/admin`, `/shelter`), verificando que el rol
 *      en el token (`token.role`) coincida con el requerido para esa sección.
 * - **Redirecciones Claras:** Si una verificación falla, el usuario es
 *   redirigido a una página de `/unauthorized` con un parámetro de `reason`
 *   en la URL. Esto permite mostrar mensajes de error específicos al usuario
 *   final, mejorando la experiencia y la depuración.
 * - **`config.matcher`:** Este objeto de configuración es crucial para el
 *   rendimiento, ya que le indica a Next.js que ejecute este middleware
 *   únicamente para las rutas que coincidan con los patrones definidos,
 *   evitando la sobrecarga en rutas públicas.
 *
 * **Dependencias Externas:**
 * - `next-auth/middleware`: Proporciona la función `withAuth` que es la base
 *   de este sistema de protección de rutas. El token JWT decodificado se
 *   adjunta automáticamente al objeto `req.nextauth`.
 *
 */
