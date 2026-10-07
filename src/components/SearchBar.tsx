import React, { useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { useWeatherStore } from '../store/useWeatherStore';
import { fetchWeatherBundle, hasWeatherApiKey } from '../utils/weatherApi';
const QUICK_SEARCHES = ['Manila', 'Tokyo', 'London', 'New York'];

const SearchBar: React.FC = () => {
  const [city, setCity] = useState('');
  const { setApiStatus, setLoading, setWeather, setError, loading } = useWeatherStore();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    if (!hasWeatherApiKey()) {
      setError('Please add your OpenWeatherMap API key to the .env file.');
      setApiStatus('missing_key');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { current, forecast } = await fetchWeatherBundle(city);
      setWeather(current, forecast);
      setCity('');
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('City not found. Please check the spelling.');
        setApiStatus('error');
      } else if (err.response?.status === 401) {
        setError('Invalid API Key. Please check your .env file.');
        setApiStatus('unauthorized');
      } else {
        setError('An error occurred while fetching weather data.');
        setApiStatus('error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.07] shadow-[0_18px_70px_rgba(4,10,24,0.22)] backdrop-blur-md">
      <div className="bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)] p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-sky-100/45">Location</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Search a place</h2>
          </div>
          <div className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-sky-100/50">
            Live
          </div>
        </div>

      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-100/45" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search city or airport"
              className="h-[52px] w-full rounded-[22px] border border-white/10 bg-[rgba(7,16,28,0.56)] pl-12 pr-4 text-sm text-white outline-none transition duration-300 placeholder:text-slate-300/45 focus:border-sky-300/45 focus:bg-[rgba(7,16,28,0.72)]"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[22px] bg-[linear-gradient(180deg,#d8b07b,#9f6a3c)] px-6 text-sm font-semibold text-slate-950 transition duration-300 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
            <span>{loading ? 'Fetching weather' : 'Search weather'}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {QUICK_SEARCHES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCity(item)}
              className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-medium text-sky-50/80 transition duration-300 hover:border-white/20 hover:bg-white/10"
            >
              {item}
            </button>
          ))}
        </div>
      </form>
      </div>
    </section>
  );
};

export default SearchBar;
