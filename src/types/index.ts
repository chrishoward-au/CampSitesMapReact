export interface MapPoint {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  type: string;
  amenities?: string[];
  rating?: number;
  created_at: string;
  updated_at?: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  default_latitude: number;
  default_longitude: number;
  default_zoom: number;
  map_style: string;
  created_at: string;
  updated_at?: string;
}

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}
