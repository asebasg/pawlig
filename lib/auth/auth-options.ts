import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/utils/db';
import { verifyPassword } from '@/lib/auth/password';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Credenciales incompletas');
        }

        //  Buscar usuario por email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            shelter: true,
            vendor: true,
          },
        });

        if (!user) {
          throw new Error('Usuario no encontrado');
        }

        //  Verificar si el usuario está bloqueado (HU-014)
        if (!user.isActive) {
          throw new Error(
            `Cuenta bloqueada. Motivo: ${user.blockReason || 'Contacta con soporte para más información'}`
          );
        }

        //  Verificar contraseña
        const isValidPassword = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          throw new Error('Contraseña incorrecta');
        }

        //  Retornar datos del usuario (sin password)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
        };
      },
    }),
  ],
  
  callbacks: {
    //  Callback JWT: agregar role e isActive al token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isActive = user.isActive;
      }
      return token;
    },
    
    //  Callback Session: pasar datos del token a la sesión del cliente
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isActive = token.isActive as boolean;
      }
      return session;
    },
  },
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 horas (RNF-002)
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * 📚 CAMBIOS IMPLEMENTADOS:
 * 
 * 1. MEJORA 1: Validación de bloqueo en authorize()
 *    - Verifica user.isActive antes de crear sesión
 *    - Lanza error descriptivo con motivo del bloqueo
 *    - Bloqueo ocurre ANTES de iniciar sesión (prevención total)
 * 
 * 2. Token JWT enriquecido:
 *    - Agregado campo isActive al token
 *    - Disponible en session.user.isActive para validaciones
 * 
 * 3. Trazabilidad:
 *    - HU-014: Gestión de usuarios (bloqueo) ✅
 *    - RN-017: Justificación obligatoria ✅
 *    - RNF-002: Seguridad (prevención de acceso) ✅
 */