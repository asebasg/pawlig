// lib/utils/logger.ts
type LogLevel = 'info' | 'warn' | 'error' | 'audit';

interface LogData {
  level: LogLevel;
  timestamp: string;
  message: string;
  [key: string]: any;
}

export const logger = {
  info: (message: string, meta?: Record<string, any>) => {
    const log: LogData = {
      level: 'info',
      timestamp: new Date().toISOString(),
      message,
      ...meta,
    };
    console.log(JSON.stringify(log));
  },

  warn: (message: string, meta?: Record<string, any>) => {
    const log: LogData = {
      level: 'warn',
      timestamp: new Date().toISOString(),
      message,
      ...meta,
    };
    console.warn(JSON.stringify(log));
  },

  error: (message: string, error: Error, meta?: Record<string, any>) => {
    const log: LogData = {
      level: 'error',
      timestamp: new Date().toISOString(),
      message,
      error: {
        message: error.message,
        stack: error.stack,
      },
      ...meta,
    };
    console.error(JSON.stringify(log));
  },

  audit: (
    action: string,
    adminId: string,
    targetUserId: string,
    details: Record<string, any>
  ) => {
    const log: LogData = {
      level: 'audit',
      timestamp: new Date().toISOString(),
      message: `AUDIT: ${action}`,
      action,
      adminId,
      targetUserId,
      ...details,
    };
    console.log(JSON.stringify(log));
  },
};

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * **Descripción General:**
 * Este archivo proporciona un logger estructurado y centralizado para toda la
 * aplicación. Su objetivo es estandarizar el formato de los logs en JSON,
 * facilitando su posterior análisis, filtrado y almacenamiento en sistemas
 * de monitoreo centralizado (como Datadog, Splunk, etc.).
 *
 * **Lógica Clave:**
 * - Formato JSON: Todos los logs se convierten a una cadena JSON. Esto es
 *   una práctica estándar en aplicaciones modernas porque permite adjuntar
 *   metadatos estructurados a cada mensaje de log.
 * - Niveles de Log: Se definen niveles estándar (info, warn, error) para
 *   clasificar la severidad de los mensajes.
 * - Nivel de Auditoría: Se incluye un nivel 'audit' específico para registrar
 *   eventos de seguridad críticos (ej: cambios de rol, bloqueos). Estos logs
 *   contienen información vital para la trazabilidad, como el ID del
 *   administrador que realiza la acción y el ID del usuario afectado.
 *
 * **Dependencias Externas:**
 * - Ninguna. Este logger es una implementación ligera que utiliza la API
 *   `console` nativa de Node.js.
 *
 */
