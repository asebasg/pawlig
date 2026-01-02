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
            `Cuenta bloqueada. Contacta con soporte para más información`
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
          vendorId: user.vendor?.id,
          shelterId: user.shelter?.id,
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
        token.vendorId = user.vendorId;
        token.shelterId = user.shelterId;
      }
      return token;
    },

    //  Callback Session: pasar datos del token a la sesión del cliente
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isActive = token.isActive as boolean;
        session.user.vendorId = token.vendorId as string | null | undefined;
        session.user.shelterId = token.shelterId as string | null | undefined;
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

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo contiene el objeto de configuración authOptions para NextAuth.js,
 * que define toda la estrategia de autenticación de la aplicación. Es el
 * núcleo del sistema de gestión de sesiones y usuarios.
 *
 * Lógica Clave:
 * - Proveedor de Credenciales (CredentialsProvider):
 *   - Se utiliza como el único método de autenticación, basado en email y
 *     contraseña.
 *   - La función authorize es el corazón de la lógica: busca al usuario
 *     en la base de datos, verifica que no esté bloqueado (isActive), y
 *     luego valida la contraseña usando verifyPassword.
 *   - Si la autenticación es exitosa, devuelve un objeto de usuario que se
 *     utilizará para crear el token JWT.
 *   - Lanza errores específicos para cada caso de fallo (usuario no
 *     encontrado, cuenta bloqueada, contraseña incorrecta), que NextAuth
 *     maneja para redirigir al usuario con un mensaje de error.
 *
 * - Callbacks de JWT y Sesión:
 *   - jwt callback: Este callback se ejecuta al crear o actualizar un
 *     JSON Web Token. Se utiliza para "enriquecer" el token, añadiéndole
 *     datos adicionales del usuario como id, role y isActive.
 *   - session callback: Se ejecuta cuando se accede a la sesión desde el
 *     cliente (ej: con useSession). Su función es transferir los datos
 *     enriquecidos desde el token JWT a la sesión del cliente (session.user),
 *     haciendo que role y isActive estén disponibles en el frontend.
 *
 * - Configuración de Sesión:
 *   - strategy: 'jwt': Especifica que la gestión de sesiones se hará a
 *     través de JWT, lo cual es ideal para arquitecturas sin estado.
 *   - maxAge: Define la duración de la sesión en 24 horas, un requisito
 *     funcional de seguridad (RNF-002).
 *
 * Dependencias Externas:
 * - next-auth: La librería principal que gestiona todo el flujo de
 *   autenticación.
 * - next-auth/providers/credentials: El proveedor específico para la
 *   autenticación basada en credenciales.
 * - @prisma/client: Utilizado dentro de authorize para buscar usuarios
 *   en la base de datos.
 * - bcryptjs (a través de verifyPassword): Usado para comparar de forma
 *   segura la contraseña proporcionada con el hash almacenado.
 *
 */
