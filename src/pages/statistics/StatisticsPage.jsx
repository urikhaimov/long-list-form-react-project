import { Pie } from 'react-chartjs-2';
import {useUsersContext} from '../../context/usersContext';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
} from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

function StatisticsPage() {
  const { users, isLoading } = useUsersContext();
  const chartRef = useRef(null);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

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
          '#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9800', '#9C27B0',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        onClick: (e, legendItem, legend) => {
          const index = legendItem.index;
          const ci = legend.chart;
          const meta = ci.getDatasetMeta(0);
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
    <Box
      sx={{
        width: '100%',
        maxWidth: '1000px',
        mx: 'auto',
        p: { xs: 1, sm: 2, md: 3 },
        boxSizing: 'border-box',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
      >
        Statistics Page
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          mb: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            p: { xs: 1, sm: 2 },
            boxSizing: 'border-box',
            maxHeight: { xs: 250, sm: 'auto' },
            overflowY: 'auto',
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}
          >
            Top Countries
          </Typography>
          <List dense>
            {sortedCountries.map(([country, count]) => (
              <ListItem key={country} disableGutters>
                <ListItemText
                  primary={`${country}: ${count} users (${(
                    (count / totalUsers) *
                    100
                  ).toFixed(1)}%)`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        <Paper
          elevation={3}
          sx={{
            flex: 1,
            p: { xs: 1, sm: 2 },
            boxSizing: 'border-box',
            height: { xs: 300, sm: 400, md: 'auto' },
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <Pie
              ref={chartRef}
              data={chartData}
              options={{
                ...chartOptions,
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </Box>
        </Paper>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleExport}
        sx={{ width: { xs: '100%', sm: 'auto' } }}
      >
        Export Chart as Image
      </Button>
    </Box>
  );
}

export default StatisticsPage;
