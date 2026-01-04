import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/utils/db';
import { verifyPassword } from '@/lib/auth/password';

/**
 * Ruta/Componente/Servicio: Opciones de configuración de NextAuth
 * Descripción: Define la configuración completa de NextAuth.js para la autenticación de la aplicación, incluyendo proveedores, callbacks y gestión de sesión.
 * Requiere: -
 * Implementa: HU-002, HU-014, RNF-002
 */

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

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo es el núcleo de la autenticación en la aplicación. Contiene el
 * objeto 'authOptions' que configura 'NextAuth.js', definiendo la estrategia
 * de autenticación, la gestión de sesiones y los callbacks para extender la
 * funcionalidad del token y la sesión.
 *
 * Lógica Clave:
 * - 'CredentialsProvider': Se configura como el único método de autenticación,
 *   utilizando 'email' y 'password'. La función 'authorize' es el punto central
 *   donde se valida un usuario: se busca en la base de datos, se comprueba si
 *   su cuenta está activa ('isActive'), y se verifica la contraseña con 'verifyPassword'.
 * - 'Callbacks (jwt y session)': El callback 'jwt' enriquece el token con datos
 *   adicionales del usuario ('id', 'role', 'isActive') después de una autenticación
 *   exitosa. El callback 'session' transfiere estos datos del token a la sesión
 *   del cliente, haciéndolos accesibles en el frontend a través de 'useSession'.
 * - 'Estrategia de Sesión JWT': Se utiliza 'jwt' como estrategia de sesión para
 *   una arquitectura sin estado ('stateless'). El 'maxAge' se establece en 24 horas,
 *   cumpliendo con un requisito de seguridad del sistema.
 *
 * Dependencias Externas:
 * - 'next-auth': Librería principal para la gestión de autenticación.
 * - 'prisma': ORM utilizado para interactuar con la base de datos y buscar usuarios.
 * - 'bcryptjs': Usado indirectamente a través de 'verifyPassword' para la
 *   comparación segura de contraseñas.
 *
 */
