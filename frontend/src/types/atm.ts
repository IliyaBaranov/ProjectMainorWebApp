
export interface Location {
  lat: number;
  lon: number;
}

export interface ATM {
  id: number;
  operator: string;
  name: string;
  location: Location;
}

export interface ATMWithDistance extends ATM {
  distance?: number; // Distance in meters
}
