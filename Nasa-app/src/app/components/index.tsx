import Header from '../components/Header';
import AirQualityStats from '../components/AirQualityStats';
import PollutionRisk from '../components/PollutionRisk';
import SharePanel from '../components/ SharePanel';
import AQIGlobe from '../components/AQIGlobe';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950">
      <Header />
      <main className="flex p-8 gap-6">
        <section className="w-1/3 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white">Air Quality <span className="opacity-80">Index</span></h1>
            <p className="text-white opacity-70 mb-4">25/07/2025 10:11<br />Local → 🇮🇩 IDN</p>
            <AirQualityStats aqi={78} pollutant="PM2.5—Wind" />
            <PollutionRisk riskPercent={35} riskLevel="Moderate risk due to weather conditions" />
            <SharePanel />
            <div className="text-xs text-gray-400 pt-2">X: 5.404578<br />Y: -73.828177</div>
          </div>
        </section>
        <section className="w-2/3">
          <AQIGlobe aqiLocations={[/* AQI data */]} />
        </section>
      </main>
    </div>
  );
}
