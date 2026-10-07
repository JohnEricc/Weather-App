export type TemperatureUnit = 'celsius' | 'fahrenheit';

export const convertTemperature = (value: number, unit: TemperatureUnit) =>
  unit === 'fahrenheit' ? Math.round((value * 9) / 5 + 32) : value;

export const formatTemperature = (value: number, unit: TemperatureUnit) =>
  `${convertTemperature(value, unit)}°`;

export const formatTemperaturePair = (high: number, low: number, unit: TemperatureUnit) =>
  `${formatTemperature(high, unit)} / ${formatTemperature(low, unit)}`;

export const formatUnitLabel = (unit: TemperatureUnit) => (unit === 'fahrenheit' ? 'F' : 'C');
