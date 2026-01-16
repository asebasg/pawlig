/**
 * Ruta/Componente/Servicio: Utilidad de Logger
 * Descripción: Proporciona un logger estructurado para estandarizar la salida de logs en formato JSON en toda la aplicación.
 * Requiere: -
 * Implementa: -
 */

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
 * Descripción General:
 * Este archivo proporciona un logger estructurado y centralizado. Su objetivo es
 * estandarizar el formato de los logs en JSON, facilitando su análisis,
 * filtrado y almacenamiento en sistemas de monitoreo (como Datadog o Splunk).
 *
 * Lógica Clave:
 * - 'Formato JSON': Todos los logs se convierten a una cadena JSON. Esto permite
 *   adjuntar metadatos estructurados a cada mensaje, lo cual es fundamental
 *   para una observabilidad efectiva en producción.
 * - 'Niveles de Log': Se definen niveles estándar ('info', 'warn', 'error') para
 *   clasificar la severidad de los mensajes y permitir un filtrado eficiente.
 * - 'Nivel de Auditoría': Se incluye un nivel 'audit' específico para registrar
 *   eventos de seguridad críticos (ej: cambios de rol). Estos logs contienen
 *   información clave para la trazabilidad, como el 'adminId' y el 'targetUserId'.
 *
 * Dependencias Externas:
 * - Ninguna. Este logger es una implementación ligera que utiliza la API
 *   'console' nativa de Node.js.
 *
 */
