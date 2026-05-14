type SessionInvalidatedHandler = () => void;

let sessionInvalidatedHandler: SessionInvalidatedHandler | null = null;

export const httpAuthBridge = {
  setSessionInvalidatedHandler(handler: SessionInvalidatedHandler | null) {
    sessionInvalidatedHandler = handler;
  },
  notifySessionInvalidated() {
    sessionInvalidatedHandler?.();
  },
};
