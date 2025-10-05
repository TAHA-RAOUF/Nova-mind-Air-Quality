import styles from '../style/dashboard.module.css';

interface RoomListProps {
  userCountry?: string;
}

export default function RoomList({ userCountry }: RoomListProps) {
  // Generate location-based monitoring areas
  const getLocationAreas = () => {
    if (!userCountry) {
      return [
        { name: "Area 1", pm: 149, pmStatus: "Unhealthy", co2: 79, co2Status: "Average", devices: 16 },
        { name: "Area 2", pm: 149, pmStatus: "Moderate", co2: 79, co2Status: "High", devices: 12 },
        { name: "Area 3", pm: 149, pmStatus: "Good", co2: 79, co2Status: "High", devices: 18 },
      ];
    }

    const locationMappings: Record<string, string[]> = {
      'US': ['Downtown', 'Suburbs', 'Industrial Area', 'Park Area'],
      'CA': ['Toronto Center', 'Vancouver Downtown', 'Calgary Area', 'Montreal District'],
      'GB': ['London City', 'Manchester Area', 'Birmingham District', 'Liverpool Zone'],
      'FR': ['Paris Center', 'Lyon Area', 'Marseille District', 'Toulouse Zone'],
      'DE': ['Berlin Center', 'Munich Area', 'Hamburg District', 'Frankfurt Zone'],
      'JP': ['Tokyo Downtown', 'Osaka Area', 'Kyoto District', 'Yokohama Zone'],
      'CN': ['Beijing Center', 'Shanghai Area', 'Shenzhen District', 'Guangzhou Zone'],
      'IN': ['Mumbai Center', 'Delhi Area', 'Bangalore District', 'Chennai Zone'],
      'MA': ['Casablanca Center', 'Rabat Area', 'Marrakech District', 'Fes Zone'],
    };

    const areas = locationMappings[userCountry] || ['Area 1', 'Area 2', 'Area 3', 'Area 4'];
    
    return areas.map((area, index) => ({
      name: area,
      pm: Math.floor(Math.random() * 200) + 50,
      pmStatus: ['Good', 'Moderate', 'Unhealthy', 'Hazardous'][Math.floor(Math.random() * 4)],
      co2: Math.floor(Math.random() * 100) + 50,
      co2Status: ['Normal', 'Average', 'High'][Math.floor(Math.random() * 3)],
      devices: Math.floor(Math.random() * 20) + 10
    }));
  };

  const areas = getLocationAreas();

  return (
    <section>
      <h3 className="text-xl font-semibold mb-4 text-gray-200">
        Monitoring Areas {userCountry ? `in ${userCountry}` : '(Global)'}
      </h3>
      <div className={styles.roomList}>
        {areas.map(area => (
          <div key={area.name} className={styles.roomCard}>
            <h4>{area.name} <span>{area.devices || 16} sensors</span></h4>
            <div>PM2.5: <b>{area.pm}</b> <span>{area.pmStatus}</span></div>
            <div>CO₂: <b>{area.co2}</b> <span>{area.co2Status}</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}
