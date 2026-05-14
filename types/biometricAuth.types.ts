export type BiometricCapability = "none" | "available" | "enrolled";

export interface BiometricAuthPort {
  readonly capability: BiometricCapability;
  authenticate(reason: string): Promise<boolean>;
}

export const BIOMETRIC_AUTH_PORT = Symbol("BiometricAuthPort");
