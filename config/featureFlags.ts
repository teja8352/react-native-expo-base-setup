import featureFlags from "./featureFlags.json";

export type FeatureFlags = typeof featureFlags;

export function getStaticFeatureFlags(): FeatureFlags {
  return featureFlags;
}
