import type { LoggerService } from "services/logger";

export function registerGlobalErrorHandlers(logger: LoggerService): void {
  const previousHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
    logger.error("Uncaught exception", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      isFatal: Boolean(isFatal),
    });
    previousHandler?.(error, isFatal);
  });
}
