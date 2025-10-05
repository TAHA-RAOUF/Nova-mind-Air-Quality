// components/AirQualityStats.tsx
export default function AirQualityStats() {
  return (
    <div className="space-y-3">
      {/* Main AQI Stats */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl text-white">
        <h2 className="text-sm font-semibold text-blue-300 mb-3">Main Statistics</h2>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-white">78</p>
          <p className="text-sm text-gray-300">AQI</p>
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-xs text-gray-400">Dominant Pollutant</p>
          <p className="text-sm font-medium text-yellow-400">PM2.5 — Wind</p>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          <span className="text-xs text-yellow-400 font-medium">Moderate</span>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl text-white">
        <h2 className="text-sm font-semibold text-blue-300 mb-3">Risk Assessment</h2>
        <div className="flex items-baseline gap-2 mb-3">
          <p className="text-2xl font-bold text-yellow-400">35%</p>
          <p className="text-xs text-gray-300">Risk Level</p>
        </div>
        <p className="text-gray-300 mb-3 text-xs leading-relaxed">
          Moderate risk due to weather conditions. Air quality may affect sensitive individuals.
        </p>
        <button className="w-full px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-lg text-xs font-medium hover:from-yellow-500 hover:to-orange-500 transition-all">
          View Details
        </button>
      </div>

      {/* Quick Stats */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl text-white">
        <h2 className="text-sm font-semibold text-blue-300 mb-3">Live Data</h2>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-slate-700/50 rounded-lg p-2">
            <p className="text-lg font-bold text-green-400">4</p>
            <p className="text-xs text-gray-400">Good</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-2">
            <p className="text-lg font-bold text-red-400">2</p>
            <p className="text-xs text-gray-400">Alert</p>
          </div>
        </div>
      </div>
    </div>
  );
}
