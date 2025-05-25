import styles from './statistics.module.css';
import { Pie } from 'react-chartjs-2';
import { useUsersContext } from '../../context/usersContext';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useRef } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

function StatisticsPage() {
  const { users } = useUsersContext();
  const chartRef = useRef(null);

  const countryCounts = users.reduce((acc, user) => {
    acc[user.country] = (acc[user.country] || 0) + 1;
    return acc;
  }, {});

  const totalUsers = Object.values(countryCounts).reduce((sum, count) => sum + count, 0);

  const sortedCountries = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]);

  const chartData = {
    labels: sortedCountries.map(([country]) => country),
    datasets: [
      {
        data: sortedCountries.map(([, count]) => count),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9800', '#9C27B0'
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        onClick: (e, legendItem, legend) => {
          const index = legendItem.index;
          const ci = legend.chart;
          const meta = ci.getDatasetMeta(0);
          // Toggle visibility
          meta.data[index].hidden = !meta.data[index].hidden;
          ci.update();
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = tooltipItem.label || '';
            const value = tooltipItem.raw || 0;
            const percentage = ((value / totalUsers) * 100).toFixed(1);
            return `${label}: ${value} users (${percentage}%)`;
          },
        },
      },
    },
  };

  const handleExport = () => {
    const chart = chartRef.current;
    if (chart) {
      const link = document.createElement('a');
      link.href = chart.toBase64Image();
      link.download = 'statistics-chart.png';
      link.click();
    }
  };

  return (
    <div className={styles.pageRoot}>
      <h2>Statistics Page</h2>

      <div className={styles.summary}>
        <h4>Top Countries</h4>
        <ul>
          {sortedCountries.map(([country, count]) => (
            <li key={country}>
              {country}: {count} users ({((count / totalUsers) * 100).toFixed(1)}%)
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.chartContainer}>
        <Pie ref={chartRef} data={chartData} options={chartOptions} />
      </div>

      <button className={styles.exportButton} onClick={handleExport}>
        Export Chart as Image
      </button>
    </div>
  );
}

export default StatisticsPage;
