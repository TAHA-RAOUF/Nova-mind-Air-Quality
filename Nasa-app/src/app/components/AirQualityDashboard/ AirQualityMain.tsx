import React from 'react';
import { AirQualitySummary } from './types';
import styles from './airQuality.module.css';
import AirQualityChart from './ AirQualityChart';

type Props = { summary: AirQualitySummary };

export default function AirQualityMain({ summary }: Props) {
  return (
    <div>
      <div className={styles.header}>Today's air quality</div>
      <div className={styles.city}>{summary.city}, {summary.region}</div>
      <div style={{ margin: '1.2rem 0', fontWeight: 500 }}>
        <span className={styles[`status${summary.status}`]}>{summary.status}</span> · AQI {summary.aqi}
      </div>
      <div style={{ fontSize: '0.98rem', color: '#ccc', marginBottom: '1rem' }}>
        {summary.description}
      </div>
      <AirQualityChart chartData={summary.chartData} />
    </div>
  );
}
