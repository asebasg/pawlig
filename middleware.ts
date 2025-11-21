import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

//  Rutas públicas (accesibles sin autenticación)
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/adopciones',
  '/productos',
  '/albergues',
  '/terminos',
  '/privacidad',
];

//  Prefijos de rutas que SIEMPRE requieren autenticación
// (La validación de rol específico se hace con requireRole() en cada página)
const protectedPrefixes = [
  '/admin',
  '/shelter',
  '/vendor',
  '/user',
  '/request-shelter',
];

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
    pathname.startsWith('/icons') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Verificar si la ruta es pública
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Verificar si la ruta requiere autenticación
  const isProtectedRoute = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (isProtectedRoute) {
    // Obtener token de sesión
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Si no hay token → usuario anónimo → bloquear
    if (!token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    // Hay token → usuario autenticado → permitir pasar
    // La validación de rol específico se hará en la página con requireRole()
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

/**
 * 📚 FLUJO DE SEGURIDAD COMPLETO:
 * 
 * EJEMPLO: Usuario anónimo intenta acceder a /request-shelter
 * 
 * 1️⃣ CAPA 1 - MIDDLEWARE (este archivo):
 *    ❌ Sin token → Redirect a /login?callbackUrl=/request-shelter
 * 
 * Usuario inicia sesión correctamente
 * 
 * 2️⃣ CAPA 1 - MIDDLEWARE (este archivo):
 *    ✅ Con token → Permite pasar a la página
 * 
 * 3️⃣ CAPA 2 - REQUIREROLE() en la página:
 *    await requireAdopter();
 *    ❌ Si role !== 'ADOPTER' → Redirect a su dashboard
 *    ✅ Si role === 'ADOPTER' → Renderiza contenido
 * 
 * 4️⃣ CAPA 3 - API ROUTES (cuando el usuario envía el formulario):
 *    const session = await getServerSession(authOptions);
 *    ❌ Sin sesión → 401 Unauthorized
 *    ❌ Role incorrecto → 403 Forbidden
 *    ✅ Todo correcto → Procesa la solicitud
 * 
 * VENTAJAS DE ESTA ARQUITECTURA:
 * ✅ Defense in Depth (3 capas de validación)
 * ✅ Middleware simple y escalable (no crece con muchos ifs)
 * ✅ Cada página controla su autorización específica
 * ✅ API Routes validan independientemente
 * ✅ Si una capa falla, las otras siguen protegiendo
 * 
 * TRAZABILIDAD:
 * - RNF-002: Seguridad (autenticación y autorización) ✅
 * - RF-006: Gestión de roles y permisos ✅
 * - Arquitectura 6.1: Estrategia de autenticación ✅
 */