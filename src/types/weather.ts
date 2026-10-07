export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  sunrise: number;
  sunset: number;
  icon: string;
}

export interface ForecastData {
  date: string;
  temp_min: number;
  temp_max: number;
  condition: string;
  icon: string;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export type WeatherView = 'today' | 'explore' | 'night';

export type ApiStatus = 'unknown' | 'missing_key' | 'ok' | 'unauthorized' | 'error';

export interface WeatherState {
  current: WeatherData | null;
  forecast: ForecastData[];
  loading: boolean;
  error: string | null;
  unit: TemperatureUnit;
  view: WeatherView;
  favorites: string[];
  apiStatus: ApiStatus;
  lastUpdated: number | null;
}
