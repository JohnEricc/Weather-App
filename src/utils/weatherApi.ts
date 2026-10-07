import axios from 'axios';
import { ForecastData, WeatherData } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const hasWeatherApiKey = () => Boolean(API_KEY);

export const fetchWeatherBundle = async (city: string): Promise<{
  current: WeatherData;
  forecast: ForecastData[];
}> => {
  const query = city.trim();

  if (!API_KEY) {
    throw new Error('missing_api_key');
  }

  const weatherRes = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: query,
      appid: API_KEY,
      units: 'metric',
    },
  });

  const forecastRes = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      q: query,
      appid: API_KEY,
      units: 'metric',
    },
  });

  const current: WeatherData = {
    city: weatherRes.data.name,
    country: weatherRes.data.sys.country,
    temp: Math.round(weatherRes.data.main.temp),
    tempMin: Math.round(weatherRes.data.main.temp_min),
    tempMax: Math.round(weatherRes.data.main.temp_max),
    feelsLike: Math.round(weatherRes.data.main.feels_like),
    condition: weatherRes.data.weather[0].main,
    description: weatherRes.data.weather[0].description,
    humidity: weatherRes.data.main.humidity,
    windSpeed: Math.round(weatherRes.data.wind.speed * 3.6),
    pressure: weatherRes.data.main.pressure,
    visibility: Math.round((weatherRes.data.visibility ?? 0) / 1000),
    sunrise: weatherRes.data.sys.sunrise,
    sunset: weatherRes.data.sys.sunset,
    icon: weatherRes.data.weather[0].icon,
  };

  const forecast: ForecastData[] = forecastRes.data.list
    .filter((_: unknown, index: number) => index % 8 === 0)
    .slice(0, 5)
    .map((item: any) => ({
      date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
      temp_min: Math.round(item.main.temp_min),
      temp_max: Math.round(item.main.temp_max),
      condition: item.weather[0].main,
      icon: item.weather[0].icon,
    }));

  return { current, forecast };
};
