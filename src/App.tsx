import React, { useMemo, useState } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastGrid from './components/ForecastGrid';
import { useWeatherStore } from './store/useWeatherStore';
import {
  Check,
  CloudMoon,
  CloudSun,
  Compass,
  Heart,
  Menu,
  Plus,
  Search,
  Settings2,
  Star,
  Thermometer,
} from 'lucide-react';
import { fetchWeatherBundle, hasWeatherApiKey } from './utils/weatherApi';
import { formatUnitLabel } from './utils/weatherFormat';
import { WeatherView } from './types/weather';

const NAV_ITEMS = [
  { label: 'today', icon: CloudSun },
  { label: 'explore', icon: Compass },
  { label: 'night', icon: CloudMoon },
];

function App() {
  const {
    current,
    error,
    favorites,
    loading,
    setError,
    setLoading,
    setWeather,
    toggleFavorite,
    unit,
    toggleUnit,
    view,
    setView,
  } = useWeatherStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const currentCity = current?.city ?? '';
  const isFavorite = currentCity ? favorites.includes(currentCity) : false;

  const panelTitle = useMemo(() => {
    if (view === 'explore') return 'Explore saved locations';
    if (view === 'night') return 'Night outlook';
    return 'Search a city to bring the dashboard to life.';
  }, [view]);

  const panelDescription = useMemo(() => {
    if (view === 'explore') {
      return favorites.length > 0
        ? 'Choose one of your saved cities to load the latest weather conditions.'
        : 'Save a city with the star button and it will appear here for quick access.';
    }

    if (view === 'night') {
      return 'Switching to night mode softens the palette and keeps the layout focused on evening conditions.';
    }

    return 'Current conditions, forecast rows, and atmospheric detail panels will appear here after your first search.';
  }, [favorites.length, view]);

  const loadFavoriteCity = async (city: string) => {
    if (!hasWeatherApiKey()) {
      setError('Please add your OpenWeatherMap API key to the .env file.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { current: nextCurrent, forecast } = await fetchWeatherBundle(city);
      setWeather(nextCurrent, forecast);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Saved city could not be found.');
      } else if (err.response?.status === 401) {
        setError('Invalid API Key. Please check your .env file.');
      } else {
        setError('Unable to load the selected city right now.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTopFavorite = () => {
    if (!currentCity) {
      setError('Search for a city first, then you can save it to favorites.');
      return;
    }

    toggleFavorite(currentCity);
    setError(isFavorite ? 'Removed from favorites.' : 'Saved to favorites.');
  };

  const handleAddLocation = () => {
    setView('explore');
    setMenuOpen(true);
    setSettingsOpen(false);
  };

  const handleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleSettings = () => {
    setMenuOpen(false);
    setSettingsOpen((prev) => !prev);
    setView('today');
  };

  const handleViewChange = (nextView: WeatherView) => {
    if (nextView === 'night') {
      setView(view === 'night' ? 'today' : 'night');
      return;
    }

    if (nextView === 'explore') {
      setView('explore');
      setMenuOpen(true);
      setSettingsOpen(false);
      return;
    }

    setView('today');
    setMenuOpen(false);
    setSettingsOpen(false);
  };

  return (
    <div
      className={`min-h-screen overflow-hidden text-white selection:bg-sky-200 selection:text-slate-950 ${
        view === 'night' ? 'bg-[#050c18]' : 'bg-[#081120]'
      }`}
    >
      <div className="fixed inset-0 pointer-events-none">
        <div
          className={`absolute inset-0 ${
            view === 'night'
              ? 'bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_28%),radial-gradient(circle_at_78%_14%,rgba(148,163,184,0.12),transparent_24%),linear-gradient(180deg,#090f19_0%,#0d1624_24%,#101b2f_48%,#08111e_76%,#040913_100%)]'
              : 'bg-[radial-gradient(circle_at_top_left,rgba(164,202,255,0.18),transparent_28%),radial-gradient(circle_at_75%_15%,rgba(243,191,126,0.16),transparent_20%),linear-gradient(180deg,#0f1f35_0%,#132b4a_22%,#16365f_48%,#102744_70%,#091527_100%)]'
          }`}
        />
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgba(255,255,255,0.9)_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
        <div
          className={`absolute inset-x-0 bottom-0 h-[38%] ${
            view === 'night'
              ? 'bg-[linear-gradient(180deg,transparent,rgba(97,84,166,0.16))]'
              : 'bg-[linear-gradient(180deg,transparent,rgba(209,155,88,0.16))]'
          }`}
        />
      </div>

      <main className="relative z-10 mx-auto min-h-screen w-full max-w-[1680px] px-3 py-3 sm:px-4 sm:py-4">
        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(7,17,30,0.56)] shadow-[0_32px_140px_rgba(1,4,12,0.52)] backdrop-blur-xl">
          <header className="border-b border-white/10 bg-[rgba(6,12,22,0.64)]">
            <div className="grid grid-cols-[96px_1fr_auto] items-center gap-4 px-4 py-3 sm:px-5">
              <div className="flex justify-center">
                <button
                  onClick={handleMenu}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border text-sky-50/85 transition hover:bg-white/10 ${
                    menuOpen ? 'border-white/20 bg-white/12' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>

              <div className="justify-self-center text-center">
                <p className="text-xs uppercase tracking-[0.28em] text-sky-100/45">Forecast</p>
                <h1 className="mt-1 text-xl font-semibold text-white font-display sm:text-2xl">Weather App</h1>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handleTopFavorite}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border text-sky-50/80 transition hover:bg-white/10 ${
                    isFavorite ? 'border-amber-200/35 bg-amber-200/10 text-amber-100' : 'border-white/10 bg-white/5'
                  }`}
                  aria-label="Toggle favorite city"
                >
                  {isFavorite ? <Heart className="h-[18px] w-[18px]" /> : <Star className="h-[18px] w-[18px]" />}
                </button>
                <button
                  onClick={handleAddLocation}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sky-50/80 transition hover:bg-white/10"
                  aria-label="Open saved locations"
                >
                  <Plus className="h-[18px] w-[18px]" />
                </button>
                <button
                  onClick={handleSettings}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border text-sky-50/80 transition hover:bg-white/10 ${
                    settingsOpen ? 'border-white/20 bg-white/12' : 'border-white/10 bg-white/5'
                  }`}
                  aria-label="Toggle settings panel"
                >
                  <Settings2 className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>
          </header>

          <div className="flex min-h-[calc(100vh-2rem)]">
            <aside className="hidden w-[96px] shrink-0 border-r border-white/10 bg-[rgba(3,9,18,0.42)] px-3 py-4 lg:block">
              <div className="flex h-full flex-col justify-between">
                <div className="flex flex-col items-center gap-3">
                  {NAV_ITEMS.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      aria-label={label}
                      onClick={() => handleViewChange(label as WeatherView)}
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border transition ${
                        view === label
                          ? 'border-white/15 bg-white/12 text-white'
                          : 'border-white/8 bg-white/5 text-sky-50/70 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  ))}
                </div>

                <div className="rounded-[22px] border border-white/10 bg-white/5 p-3">
                  <button
                    onClick={toggleUnit}
                    className="flex min-h-[86px] w-full flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-black/10 px-3 py-3 text-center transition hover:bg-white/10"
                    aria-label="Toggle temperature unit"
                    type="button"
                  >
                    <Thermometer className="h-4 w-4 text-sky-100/75" />
                    <p className="text-[10px] uppercase tracking-[0.2em] text-sky-100/45">Unit</p>
                    <p className="text-[11px] font-medium leading-tight text-white">°{formatUnitLabel(unit)}</p>
                  </button>
                </div>
              </div>
            </aside>

            <div className="min-w-0 flex-1 p-4 sm:p-5">
              <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
                <aside className="space-y-5">
                  <SearchBar />

                  <section className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_18px_70px_rgba(4,10,24,0.22)] backdrop-blur-xl">
                    {menuOpen ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Search className="h-5 w-5 text-sky-100/70" />
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Saved locations</p>
                            <p className="mt-1 text-sm text-sky-50/70">
                              {favorites.length > 0 ? 'Tap a saved city to load it.' : 'Use the top star button to save cities.'}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {favorites.length > 0 ? (
                            favorites.map((city) => (
                              <button
                                key={city}
                                onClick={() => loadFavoriteCity(city)}
                                disabled={loading}
                                className="flex w-full items-center justify-between rounded-[22px] border border-white/10 bg-black/10 px-4 py-3 text-left transition hover:bg-white/10 disabled:opacity-60"
                              >
                                <span className="text-sm text-white">{city}</span>
                                <Check className="h-4 w-4 text-sky-100/60" />
                              </button>
                            ))
                          ) : (
                            <div className="rounded-[22px] border border-white/10 bg-black/10 p-4 text-sm text-sky-50/70">
                              No saved cities yet.
                            </div>
                          )}
                        </div>
                      </div>
                    ) : settingsOpen ? (
                      <div className="space-y-3">
                        <div className="rounded-[22px] border border-white/10 bg-black/10 p-4">
                          <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Temperature unit</p>
                          <div className="mt-4 flex items-center gap-2">
                            <button
                              onClick={() => useWeatherStore.getState().setUnit('celsius')}
                              className={`rounded-full px-4 py-2 text-sm transition ${
                                unit === 'celsius' ? 'bg-white text-slate-950' : 'bg-white/8 text-sky-50/75'
                              }`}
                            >
                              Celsius
                            </button>
                            <button
                              onClick={() => useWeatherStore.getState().setUnit('fahrenheit')}
                              className={`rounded-full px-4 py-2 text-sm transition ${
                                unit === 'fahrenheit' ? 'bg-white text-slate-950' : 'bg-white/8 text-sky-50/75'
                              }`}
                            >
                              Fahrenheit
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={toggleUnit}
                          className="flex w-full items-center justify-between rounded-[22px] border border-white/10 bg-black/10 px-4 py-3 text-left transition hover:bg-white/10"
                        >
                          <span className="text-sm text-white">Quick toggle unit</span>
                          <span className="text-sm text-sky-100/60">{formatUnitLabel(unit)}</span>
                        </button>
                      </div>
                    ) : current ? (
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                        <div className="rounded-[22px] border border-white/10 bg-black/10 p-4">
                          <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Feels like</p>
                          <p className="mt-3 text-3xl font-light text-white">{current.feelsLike}°</p>
                        </div>
                        <div className="rounded-[22px] border border-white/10 bg-black/10 p-4">
                          <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Sunrise</p>
                          <p className="mt-3 text-2xl font-light text-white">
                            {new Date(current.sunrise * 1000).toLocaleTimeString([], {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="rounded-[22px] border border-white/10 bg-black/10 p-4">
                          <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Sunset</p>
                          <p className="mt-3 text-2xl font-light text-white">
                            {new Date(current.sunset * 1000).toLocaleTimeString([], {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="rounded-[22px] border border-white/10 bg-black/10 p-4">
                          <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Visibility</p>
                          <p className="mt-3 text-3xl font-light text-white">{current.visibility} km</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="h-24 rounded-[22px] bg-white/6" />
                        <div className="grid grid-cols-2 gap-3">
                          <div className="h-24 rounded-[22px] bg-white/6" />
                          <div className="h-24 rounded-[22px] bg-white/6" />
                        </div>
                      </div>
                    )}
                  </section>
                </aside>

                <section className="space-y-5">
                  {error && (
                    <div className="rounded-[24px] border border-red-300/20 bg-red-500/10 px-4 py-4 text-sm font-medium text-red-100 shadow-[0_10px_40px_rgba(127,29,29,0.25)]">
                      {error}
                    </div>
                  )}

                  {settingsOpen ? (
                    <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.06] shadow-[0_18px_70px_rgba(4,10,24,0.22)] backdrop-blur-xl">
                      <div className="border-b border-white/10 px-6 py-5 sm:px-8">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-sky-100/45">Settings</p>
                        <h2 className="mt-3 text-3xl font-light text-white sm:text-4xl">Preferences</h2>
                        <p className="mt-3 max-w-2xl text-base leading-7 text-sky-50/70">
                          Adjust how weather data is displayed.
                        </p>
                      </div>

                      <div className="grid gap-5 p-6 sm:p-8 lg:grid-cols-2">
                        <div className="rounded-[26px] border border-white/10 bg-black/10 p-5">
                          <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Temperature unit</p>
                          <div className="mt-5 flex flex-wrap gap-2">
                            <button
                              onClick={() => useWeatherStore.getState().setUnit('celsius')}
                              className={`rounded-full px-4 py-2 text-sm transition ${
                                unit === 'celsius' ? 'bg-white text-slate-950' : 'bg-white/8 text-sky-50/75 hover:bg-white/12'
                              }`}
                            >
                              Celsius (°C)
                            </button>
                            <button
                              onClick={() => useWeatherStore.getState().setUnit('fahrenheit')}
                              className={`rounded-full px-4 py-2 text-sm transition ${
                                unit === 'fahrenheit' ? 'bg-white text-slate-950' : 'bg-white/8 text-sky-50/75 hover:bg-white/12'
                              }`}
                            >
                              Fahrenheit (°F)
                            </button>
                          </div>
                          <p className="mt-4 text-sm text-sky-50/65">
                            Current unit: <span className="text-white">{formatUnitLabel(unit)}</span>
                          </p>
                        </div>

                        <div className="rounded-[26px] border border-white/10 bg-black/10 p-5">
                          <p className="text-[11px] uppercase tracking-[0.24em] text-sky-100/45">Saved locations</p>
                          <p className="mt-4 text-sm text-sky-50/70">
                            Favorites: <span className="text-white">{favorites.length}</span>
                          </p>
                          <p className="mt-2 text-sm text-sky-50/65">
                            Use the star button in the top bar to save or remove cities.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : view === 'explore' ? (
                    <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.06] shadow-[0_18px_70px_rgba(4,10,24,0.22)] backdrop-blur-xl">
                      <div className="border-b border-white/10 px-6 py-5 sm:px-8">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-sky-100/45">Explore</p>
                        <p className="mt-3 max-w-2xl text-base leading-7 text-sky-50/70">
                          Pick a city to load it instantly, or search a new location from the left panel.
                        </p>
                      </div>

                      <div className="p-6 sm:p-8">
                        {favorites.length === 0 ? (
                          <div className="rounded-[24px] border border-white/10 bg-black/10 p-5 text-sky-50/70">
                            No saved cities yet. Search for a city, then tap the star in the top bar to save it.
                          </div>
                        ) : (
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {favorites.map((city) => (
                              <button
                                key={city}
                                onClick={() => loadFavoriteCity(city)}
                                disabled={loading}
                                className="rounded-[24px] border border-white/10 bg-black/10 p-5 text-left transition hover:bg-white/10 disabled:opacity-60"
                              >
                                <p className="text-lg font-medium text-white">{city}</p>
                                <p className="mt-2 text-sm text-sky-50/65">Load latest conditions</p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : !current ? (
                    <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.06] shadow-[0_18px_70px_rgba(4,10,24,0.22)] backdrop-blur-xl">
                      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="space-y-4">
                          <p className="text-[11px] uppercase tracking-[0.3em] text-sky-100/45">Now</p>
                          <h2 className="max-w-2xl text-4xl font-light leading-tight text-white sm:text-5xl">
                            {panelTitle}
                          </h2>
                          <p className="max-w-2xl text-base leading-7 text-sky-50/70">
                            {panelDescription}
                          </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="h-32 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.03))]" />
                          <div className="h-32 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
                          <div className="h-32 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] sm:col-span-2" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <WeatherCard />
                      <ForecastGrid />
                    </>
                  )}
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
