import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserRole } from '@prisma/client';

// Rutas públicas (no requieren autenticación)
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/register-shelter',
  '/adopciones',
  '/productos',
  '/albergues',
];

// Rutas protegidas por rol
const roleBasedRoutes: Record<UserRole, string[]> = {
  ADMIN: ['/admin'],
  SHELTER: ['/shelter'],
  PROVIDER: ['/vendor'],
  ADOPTER: ['/user'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acceso a rutas de API de NextAuth
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Permitir acceso a archivos estáticos
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/icons')
  ) {
    return NextResponse.next();
  }

  // Verificar si la ruta es pública
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Obtener token de sesión
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Si no hay token y la ruta no es pública, redirigir a login
  if (!token && !isPublicRoute) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Si hay token, verificar permisos por rol
  if (token) {
    const userRole = token.role as UserRole;

    // Verificar si intenta acceder a una ruta de otro rol
    for (const [role, routes] of Object.entries(roleBasedRoutes)) {
      if (role !== userRole) {
        const isUnauthorizedRoute = routes.some((route) =>
          pathname.startsWith(route)
        );
        if (isUnauthorizedRoute) {
          // Redirigir al dashboard correspondiente a su rol
          return NextResponse.redirect(
            new URL(roleBasedRoutes[userRole][0] || '/', request.url)
          );
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|images|icons).*)',
  ],
};