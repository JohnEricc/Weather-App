import React from 'react';
import { motion } from 'framer-motion';
import {
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  Droplets,
  Gauge,
  Sunrise,
  Sun,
  Sunset,
  Wind,
} from 'lucide-react';
import { useWeatherStore } from '../store/useWeatherStore';
import { formatTemperature } from '../utils/weatherFormat';

const getConditionIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return <Sun className="h-10 w-10 text-amber-200" />;
    case 'drizzle':
      return <CloudDrizzle className="h-10 w-10 text-sky-200" />;
    case 'rain':
      return <CloudRain className="h-10 w-10 text-sky-200" />;
    case 'snow':
      return <CloudSnow className="h-10 w-10 text-cyan-100" />;
    default:
      return <Cloud className="h-10 w-10 text-slate-200" />;
  }
};

const formatTime = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

const getAtmosphereCopy = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return 'Bright skies and calm light across the horizon.';
    case 'rain':
      return 'Rain bands are moving through with a cooler feel in the air.';
    case 'drizzle':
      return 'A soft drizzle keeps the atmosphere hazy and cool.';
    case 'snow':
      return 'Cold air settles in with a muted winter glow.';
    default:
      return 'The atmosphere feels soft, layered, and slightly overcast.';
  }
};

const WeatherCard: React.FC = () => {
  const { current, unit } = useWeatherStore();

  if (!current) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.07] shadow-[0_22px_90px_rgba(4,10,24,0.26)] backdrop-blur-xl"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_22%),radial-gradient(circle_at_78%_22%,rgba(242,187,120,0.18),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="relative grid gap-4 p-5 sm:p-6 xl:grid-cols-[minmax(0,1.2fr)_320px]">
          <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(112,126,156,0.46),rgba(36,50,78,0.64)_56%,rgba(14,23,39,0.78))]">
            <div className="min-h-[360px] bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.18),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_34%),linear-gradient(180deg,transparent,rgba(0,0,0,0.2))] px-5 py-5 sm:px-6 sm:py-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-sky-100/50">Current weather</p>
                  <p className="mt-2 text-sm text-sky-50/75">{formatTime(Math.floor(Date.now() / 1000))}</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] text-sky-50/70">
                  {getConditionIcon(current.condition)}
                  <span>{current.condition}</span>
                </div>
              </div>

              <div className="mt-8 max-w-2xl">
                <p className="text-sm text-sky-50/70">{current.city}, {current.country}</p>
                <h2 className="mt-4 text-4xl font-light leading-tight text-white sm:text-5xl lg:text-6xl">
                  {current.description}
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-sky-50/72">
                  {getAtmosphereCopy(current.condition)}
                </p>
              </div>

              <div className="mt-10 flex flex-wrap items-end gap-4">
                <span className="text-7xl font-extralight leading-none text-white sm:text-8xl">
                  {formatTemperature(current.temp, unit)}
                </span>
                <div className="pb-2 text-sm text-sky-50/80">
                  <p>Feels like {formatTemperature(current.feelsLike, unit)}</p>
                  <p>
                    High {formatTemperature(current.tempMax, unit)} · Low {formatTemperature(current.tempMin, unit)}
                  </p>
                </div>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[22px] border border-white/10 bg-black/10 p-4 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <Droplets className="h-5 w-5 text-sky-100/80" />
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Humidity</p>
                      <p className="mt-1 text-xl text-white">{current.humidity}%</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-black/10 p-4 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <Wind className="h-5 w-5 text-sky-100/80" />
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Wind</p>
                      <p className="mt-1 text-xl text-white">{current.windSpeed} km/h</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-black/10 p-4 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <Gauge className="h-5 w-5 text-sky-100/80" />
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Pressure</p>
                      <p className="mt-1 text-xl text-white">{current.pressure} hPa</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-black/10 p-4 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <Sunrise className="h-5 w-5 text-sky-100/80" />
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Sunrise</p>
                      <p className="mt-1 text-xl text-white">{formatTime(current.sunrise)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(202,163,109,0.16),rgba(37,48,67,0.55))]">
              <div className="border-b border-white/10 px-5 py-4">
                <p className="text-[11px] uppercase tracking-[0.3em] text-sky-100/45">Details</p>
              </div>
              <div className="space-y-4 px-5 py-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Humidity</p>
                  <p className="mt-2 text-4xl font-light text-white">{current.humidity}%</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Air pressure</p>
                  <p className="mt-2 text-3xl font-light text-white">{current.pressure} hPa</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Visibility</p>
                  <p className="mt-2 text-3xl font-light text-white">{current.visibility} km</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Wind</p>
                  <p className="mt-2 text-3xl font-light text-white">{current.windSpeed} km/h</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-lg">
                <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Sunrise</p>
                <p className="mt-3 text-2xl font-light text-white">{formatTime(current.sunrise)}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-lg">
                <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Sunset</p>
                <p className="mt-3 text-2xl font-light text-white">{formatTime(current.sunset)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default WeatherCard;
