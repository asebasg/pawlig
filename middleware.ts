import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

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

/**
 * 📚 CAMBIOS IMPLEMENTADOS:
 * 
 * 1. Bloqueo de usuarios inactivos
 *    - Verificación: token.isActive === false
 *    - Redirección: /unauthorized?reason=account_blocked
 *    - Prevención TOTAL de acceso a rutas protegidas
 * 
 * 2. Protección reforzada de /request-shelter
 *    - Permitidos: ADOPTER, VENDOR
 *    - Bloqueados: SHELTER, ADMIN
 *    - Razón: adopters_vendors_only
 * 
 * 3. Validación en orden:
 *    1. Token existe (authorized callback)
 *    2. Usuario NO bloqueado (isActive = true)
 *    3. Rol apropiado para la ruta
 * 
 * 4. Razones de redirección:
 *    - account_blocked: Usuario bloqueado
 *    - adopters_vendors_only: Solo ADOPTER/VENDOR
 *    - admin_only: Solo ADMIN
 *    - shelter_only: Solo SHELTER
 *    - vendor_only: Solo VENDOR
 * 
 * 5. Trazabilidad:
 *    - Bloqueo de usuarios ✅
 *    - Solo ADOPTER/VENDOR ✅
 *    - HU-014: Gestión de usuarios (bloqueo) ✅
 *    - RNF-002: Seguridad (autorización) ✅
 */