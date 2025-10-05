import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { AirQualitySummary } from './types';
import styles from './airQuality.module.css';

type Props = { chartData: AirQualitySummary['chartData'] };

export default function AirQualityChart({ chartData }: Props) {
  const data = {
    labels: chartData.map((d) => d.hour),
    datasets: [
      {
        label: 'AQI',
        data: chartData.map((d) => d.aqi),
        fill: false,
        borderColor: '#FFD600',
        tension: 0.4,
      },
    ],
  };
  return (
    <div className={styles.chart}>
      <Line data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
    </div>
  );
}
