import styles from '../style/dashboard.module.css';

interface StatsGridProps {
  userCountry?: string;
}

export default function StatsGrid({ userCountry }: StatsGridProps) {
  // Mock data that could be different based on country
  const getLocationBasedData = () => {
    if (!userCountry) return { indoor: 12, outdoor: 244, power: 151.27 };
    
    // Mock different data based on country
    const countryData: Record<string, { indoor: number; outdoor: number; power: number }> = {
      'US': { indoor: 8, outdoor: 35, power: 180.50 },
      'CA': { indoor: 6, outdoor: 28, power: 165.20 },
      'GB': { indoor: 10, outdoor: 42, power: 145.75 },
      'FR': { indoor: 9, outdoor: 38, power: 155.30 },
      'DE': { indoor: 7, outdoor: 31, power: 170.85 },
      'JP': { indoor: 11, outdoor: 45, power: 195.60 },
      'CN': { indoor: 25, outdoor: 95, power: 220.40 },
      'IN': { indoor: 35, outdoor: 155, power: 125.90 },
      'MA': { indoor: 15, outdoor: 65, power: 140.25 },
    };
    
    return countryData[userCountry] || { indoor: 12, outdoor: 244, power: 151.27 };
  };

  const data = getLocationBasedData();

  return (
    <section className={styles.statsGrid}>
      <div className={styles.statCard}>
        <h4>Current PM2.5 Level {userCountry ? `(${userCountry})` : ''}</h4>
        <div>
          <span className={styles.green}>{data.indoor} Indoor μg/m³</span>
        </div>
      </div>
      <div className={styles.statCard}>
        <h4>Today's Average PM2.5 Levels</h4>
        <div>
          <span className={styles.green}>{data.indoor} Indoor</span>
          <span className={styles.purple}>{data.outdoor} Outdoor μg/m³</span>
        </div>
      </div>
      <div className={styles.statCard}>
        <h4>Power Consumption</h4>
        <div>
          <span className={styles.energy}>{data.power} kWh</span>
          <button>Details</button>
        </div>
      </div>
    </section>
  );
}
