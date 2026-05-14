export type GeofenceRegion = {
  id: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
};

export interface GeofencingPort {
  startMonitoring(regions: GeofenceRegion[]): Promise<void>;
  stopMonitoring(): Promise<void>;
}
