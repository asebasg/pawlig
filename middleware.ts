import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    //  Protección de ruta /request-shelter
    // Solo usuarios con rol ADOPTER pueden solicitar ser albergue
    if (path === "/request-shelter") {
      if (!token || token.role !== "ADOPTER") {
        return NextResponse.redirect(
          new URL("/unauthorized?reason=adopters_only", req.url)
        );
      }
    }

    //  Protección de rutas administrativas
    // Solo usuarios con rol ADMIN pueden acceder a /admin/*
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
 *  NOTAS:
 * 
 * 1. Este middleware intercepta las rutas definidas en config.matcher ANTES de que Next.js renderice la página.
 * 
 * 2. Para HU-014: Solo usuarios con rol ADMIN pueden acceder a /admin/*
 * 
 * 3. Si la validación falla, redirige a /unauthorized con el motivo.
 * 
 * 4. Esta es la PRIMERA CAPA de seguridad. Las páginas y APIs deben validar nuevamente en el servidor (triple validación).
 */
