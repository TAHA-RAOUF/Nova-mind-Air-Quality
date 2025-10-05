export type AirQualityStatus = 'Good' | 'Moderate' | 'Unhealthy';

export type Pollutant = {
  name: string;
  shortName: string;
  value: number;
  status: AirQualityStatus;
  unit: string;
};

export type AirQualitySummary = {
  aqi: number;
  city: string;
  region: string;
  status: AirQualityStatus;
  description: string;
  pollutants: Pollutant[];
  chartData: { hour: string; aqi: number }[];
};
