import styles from '../style/dashboard.module.css';

interface ChartSectionProps {
  userCountry?: string;
}

export default function ChartSection({ userCountry }: ChartSectionProps) {
  return (
    <section className={styles.chartSection}>
      <div className={styles.chartHeader}>
        <h4>Outdoor vs Indoor PM 2.5 {userCountry ? `- ${userCountry}` : '- Global'}</h4>
        <select className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600">
          <option>Monthly</option>
          <option>Weekly</option>
          <option>Daily</option>
        </select>
      </div>
      <div className={styles.chartPlaceholder}>
        {/* Insert chart library component here */}
        <span>Air Quality Chart for {userCountry || 'Global'} - Chart Component Coming Soon</span>
      </div>
    </section>
  );
}
