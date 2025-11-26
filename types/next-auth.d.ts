import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      isActive: boolean; // Estado de cuenta (bloqueado/desbloqueado)
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: string; // Rol del usuario
    isActive: boolean; // Estado de cuenta (bloqueado/desbloqueado)
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    isActive: boolean; // Estado de cuenta (bloqueado/desbloqueado)
  }
}