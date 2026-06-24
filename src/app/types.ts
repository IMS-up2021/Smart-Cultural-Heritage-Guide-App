export interface AppSettings {
  contentMode: 'explorer' | 'scholar';
  language: string;
  gpsEnabled: boolean;
  searchRadius: number;
  notifyNearby: boolean;
  notifyTours: boolean;
  interests: string[];
  accessibilityMode: boolean;
  darkMode: boolean;
  visitDuration: 'quick' | 'halfday' | 'fullday';
  budgetPreference: 'free' | 'budget' | 'any';
}
