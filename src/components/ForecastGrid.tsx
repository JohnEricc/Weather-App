import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, Droplets, Gauge, MoonStar, Sun, Wind } from 'lucide-react';
import { useWeatherStore } from '../store/useWeatherStore';
import { formatTemperature } from '../utils/weatherFormat';

const RING_SIZE = 88;
const RING_STROKE = 7;
const RADIUS = (RING_SIZE - RING_STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const getIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return <Sun className="h-5 w-5 text-amber-200" />;
    case 'rain':
    case 'drizzle':
      return <CloudRain className="h-5 w-5 text-sky-200" />;
    default:
      return <Cloud className="h-5 w-5 text-slate-200" />;
  }
};

const MetricRing = ({
  label,
  value,
  sublabel,
  percent,
  accentClass,
}: {
  label: string;
  value: string;
  sublabel: string;
  percent: number;
  accentClass: string;
}) => {
  const progress = Math.max(0, Math.min(100, percent));
  const dashOffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 text-center">
      <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">{label}</p>
      <div className="relative mx-auto mt-3 h-[88px] w-[88px]">
        <svg className="h-full w-full -rotate-90" viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            className="fill-none stroke-white/10"
            strokeWidth={RING_STROKE}
          />
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            className={`fill-none ${accentClass}`}
            strokeWidth={RING_STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-light text-white">{value}</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-sky-100/45">{sublabel}</span>
        </div>
      </div>
    </div>
  );
};

const ForecastGrid: React.FC = () => {
  const { current, forecast, unit } = useWeatherStore();

  if (!current || forecast.length === 0) return null;

  const low = Math.min(...forecast.map((item) => item.temp_min));
  const high = Math.max(...forecast.map((item) => item.temp_max));
  const range = Math.max(high - low, 1);
  const points = forecast
    .map((day, index) => {
      const x = forecast.length === 1 ? 50 : (index / (forecast.length - 1)) * 100;
      const y = 78 - ((day.temp_max - low) / range) * 44;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <section className="grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.07] shadow-[0_18px_70px_rgba(4,10,24,0.22)] backdrop-blur-md"
      >
        <div className="border-b border-white/10 px-5 py-4 sm:px-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-sky-100/45">Forecast</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">This week</h3>
        </div>

        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-3">
            {forecast.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="grid items-center gap-3 rounded-[22px] border border-white/10 bg-black/10 px-4 py-4 sm:grid-cols-[74px_26px_1fr_auto]"
              >
                <div>
                  <p className="text-base font-medium text-white">{day.date}</p>
                  <p className="text-xs text-sky-100/45">
                    {formatTemperature(day.temp_max, unit)} / {formatTemperature(day.temp_min, unit)}
                  </p>
                </div>
                <div className="flex items-center justify-center">{getIcon(day.condition)}</div>
                <p className="text-sm text-sky-50/72">{day.condition}</p>
                <p className="text-right text-xl font-light text-white">{formatTemperature(day.temp_max, unit)}</p>
              </motion.div>
            ))}
          </div>

          <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Trend</p>
                <p className="mt-2 text-sm text-sky-50/70">{forecast[0].date} to {forecast[forecast.length - 1].date}</p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-sky-100/45">
                {formatTemperature(high, unit)} peak
              </div>
            </div>

            <div className="mt-6 h-[240px] rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))] p-4">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <defs>
                  <linearGradient id="forecastLine" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f5d08a" />
                    <stop offset="55%" stopColor="#c8defe" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                  <linearGradient id="forecastFill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 0 100 L ${points} L 100 100 Z`}
                  fill="url(#forecastFill)"
                  opacity="0.55"
                />
                <polyline
                  points={points}
                  fill="none"
                  stroke="url(#forecastLine)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {forecast.map((day, index) => {
                  const x = forecast.length === 1 ? 50 : (index / (forecast.length - 1)) * 100;
                  const y = 78 - ((day.temp_max - low) / range) * 44;

                  return (
                    <g key={day.date}>
                      <circle cx={x} cy={y} r="1.8" fill="#ffffff" />
                      <text x={x} y={y - 5} textAnchor="middle" fontSize="4.6" fill="rgba(255,255,255,0.82)">
                        {formatTemperature(day.temp_max, unit)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.07] shadow-[0_18px_70px_rgba(4,10,24,0.22)] backdrop-blur-md"
      >
        <div className="border-b border-white/10 px-5 py-4 sm:px-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-sky-100/45">Day details</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Atmosphere</h3>
        </div>

        <div className="grid gap-5 p-5 sm:p-6">
          <div className="grid grid-cols-2 gap-4">
            <MetricRing
              label="Humidity"
              value={`${current.humidity}%`}
              sublabel="Comfort"
              percent={current.humidity}
              accentClass="stroke-cyan-300"
            />
            <MetricRing
              label="Wind"
              value={`${current.windSpeed}`}
              sublabel="km/h"
              percent={Math.min((current.windSpeed / 60) * 100, 100)}
              accentClass="stroke-sky-300"
            />
            <MetricRing
              label="Pressure"
              value={`${current.pressure}`}
              sublabel="hPa"
              percent={Math.min(Math.max(((current.pressure - 960) / 80) * 100, 0), 100)}
              accentClass="stroke-indigo-300"
            />
            <MetricRing
              label="Visibility"
              value={`${current.visibility}`}
              sublabel="km"
              percent={Math.min((current.visibility / 12) * 100, 100)}
              accentClass="stroke-emerald-300"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[24px] border border-white/10 bg-black/10 p-4">
              <div className="flex items-center gap-3">
                <Droplets className="h-5 w-5 text-cyan-200" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Carry</p>
                  <p className="mt-1 text-sm text-sky-50/75">
                    {current.humidity > 70 ? 'A light layer or umbrella could help.' : 'The air feels fairly manageable.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-black/10 p-4">
              <div className="flex items-center gap-3">
                <Wind className="h-5 w-5 text-sky-200" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Outside</p>
                  <p className="mt-1 text-sm text-sky-50/75">
                    {current.windSpeed > 25 ? 'Expect movement in the air later on.' : 'Conditions look calm enough for a walk.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-black/10 p-4">
              <div className="flex items-center gap-3">
                <MoonStar className="h-5 w-5 text-indigo-200" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Later</p>
                  <p className="mt-1 text-sm text-sky-50/75">
                    {current.temp < 20 ? 'Evening temperatures may feel brisk.' : 'The night should stay relatively mild.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ForecastGrid;
