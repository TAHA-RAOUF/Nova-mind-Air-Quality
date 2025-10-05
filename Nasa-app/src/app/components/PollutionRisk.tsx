// components/PollutionRisk.tsx
type PollutionRiskProps = {
  riskPercent: number;
  riskLevel: string;
};

export default function PollutionRisk({riskPercent, riskLevel}: PollutionRiskProps) {
  return (
    <section className="bg-blue-900/80 rounded-xl p-6 text-white mb-8">
      <div className="flex justify-between items-center">
        <span className="font-bold">Risk of Pollution</span>
        <button className="bg-yellow-400 px-2 py-1 rounded-xl text-xs font-bold text-blue-900">Details</button>
      </div>
      <div className="pt-2 text-3xl font-bold">{riskPercent}%</div>
      <div className="opacity-70 text-sm">{riskLevel}</div>
    </section>
  );
}
