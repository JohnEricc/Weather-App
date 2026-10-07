import { create } from 'zustand';
import { ApiStatus, WeatherState, WeatherData, ForecastData, TemperatureUnit, WeatherView } from '../types/weather';

interface WeatherStore extends WeatherState {
  setWeather: (current: WeatherData, forecast: ForecastData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUnit: (unit: TemperatureUnit) => void;
  toggleUnit: () => void;
  setView: (view: WeatherView) => void;
  toggleFavorite: (city: string) => void;
  clearWeather: () => void;
  setApiStatus: (status: ApiStatus) => void;
  setLastUpdated: (timestamp: number | null) => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  current: null,
  forecast: [],
  loading: false,
  error: null,
  unit: 'celsius',
  view: 'today',
  favorites: [],
  apiStatus: 'unknown',
  lastUpdated: null,
  setWeather: (current, forecast) =>
    set({
      current,
      forecast,
      loading: false,
      error: null,
      apiStatus: 'ok',
      lastUpdated: Date.now(),
    }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  setUnit: (unit) => set({ unit }),
  toggleUnit: () =>
    set((state) => ({
      unit: state.unit === 'celsius' ? 'fahrenheit' : 'celsius',
    })),
  setView: (view) => set({ view }),
  toggleFavorite: (city) =>
    set((state) => ({
      favorites: state.favorites.includes(city)
        ? state.favorites.filter((item) => item !== city)
        : [...state.favorites, city],
    })),
  clearWeather: () => set({ current: null, forecast: [], error: null }),
  setApiStatus: (status) => set({ apiStatus: status }),
  setLastUpdated: (timestamp) => set({ lastUpdated: timestamp }),
}));
