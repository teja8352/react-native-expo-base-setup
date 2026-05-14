import type { RuntimeConfig } from "config/runtimeConfig";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogPayload = Record<string, unknown> | undefined;

type LogTransport = (entry: {
  level: LogLevel;
  message: string;
  payload?: LogPayload;
  timestamp: string;
}) => void;

let remoteTransport: LogTransport | null = null;

function shouldLog(level: LogLevel, appEnv: RuntimeConfig["APP_ENV"]): boolean {
  if (appEnv === "production") {
    return level === "warn" || level === "error";
  }
  return true;
}

function writeConsole(level: LogLevel, message: string, payload?: LogPayload) {
  const line = `[${level.toUpperCase()}] ${message}`;
  switch (level) {
    case "debug":
      if (payload) {
        console.debug(line, payload);
      } else {
        console.debug(line);
      }
      break;
    case "info":
      if (payload) {
        console.info(line, payload);
      } else {
        console.info(line);
      }
      break;
    case "warn":
      if (payload) {
        console.warn(line, payload);
      } else {
        console.warn(line);
      }
      break;
    case "error":
      if (payload) {
        console.error(line, payload);
      } else {
        console.error(line);
      }
      break;
    default: {
      const _exhaustive: never = level;
      return _exhaustive;
    }
  }
}

export function createLoggerService(config: RuntimeConfig) {
  const emit = (level: LogLevel, message: string, payload?: LogPayload) => {
    if (!shouldLog(level, config.APP_ENV)) {
      return;
    }
    const timestamp = new Date().toISOString();
    remoteTransport?.({ level, message, payload, timestamp });
    if (__DEV__ || level === "warn" || level === "error") {
      writeConsole(level, message, payload);
    }
  };

  return {
    debug(message: string, payload?: LogPayload) {
      emit("debug", message, payload);
    },
    info(message: string, payload?: LogPayload) {
      emit("info", message, payload);
    },
    warn(message: string, payload?: LogPayload) {
      emit("warn", message, payload);
    },
    error(message: string, payload?: LogPayload) {
      emit("error", message, payload);
    },
    group(label: string, fn: () => void) {
      if (!shouldLog("debug", config.APP_ENV)) {
        fn();
        return;
      }
      console.groupCollapsed(label);
      try {
        fn();
      } finally {
        console.groupEnd();
      }
    },
    registerRemoteTransport(transport: LogTransport | null) {
      remoteTransport = transport;
    },
  };
}

export type LoggerService = ReturnType<typeof createLoggerService>;
