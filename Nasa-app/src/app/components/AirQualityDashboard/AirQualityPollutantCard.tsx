import React from 'react';
import styles from './airQuality.module.css';
import { Pollutant } from './types';

type Props = { pollutant: Pollutant };

export default function AirQualityPollutantCard({ pollutant }: Props) {
  return (
    <div className={styles.pollutantCard}>
      <div>
        <div>{pollutant.shortName}</div>
        <div style={{ fontSize: '0.9rem', color: '#aaa' }}>
          {pollutant.name}
        </div>
      </div>
      <div>
        <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
          {pollutant.value} {pollutant.unit}
        </div>
        <div className={styles[`status${pollutant.status}`]}>
          {pollutant.status}
        </div>
      </div>
    </div>
  );
}
