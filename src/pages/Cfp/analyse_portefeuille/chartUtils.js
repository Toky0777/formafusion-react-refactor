// Import sélectif pour de meilleures performances
import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  DoughnutController,
  PieController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

// Enregistrement des composants nécessaires
Chart.register(
  BarController, BarElement,
  LineController, LineElement, PointElement,
  DoughnutController, PieController, ArcElement,
  CategoryScale, LinearScale, Tooltip, Legend
);


const formatNumber = (number) => {
  let numStr = String(number).replace(/\s/g, "");
  if (!/^\d+$/.test(numStr)) {
    return number;
  }
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
// Stockage des instances de graphiques
const chartInstances = new Map();

// Configuration globale Chart.js
Chart.defaults.font.size = 10;
Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
Chart.defaults.animation.duration = 300;

// Graphique CA avec données réelles
export const createCAChartWithRealData = (canvasId, revenueData, clientName) => {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  // Détruire le graphique existant s'il y en a un
  if (chartInstances.has(canvasId)) {
    chartInstances.get(canvasId).destroy();
    chartInstances.delete(canvasId);
  }

  const ctx = canvas.getContext('2d');

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: revenueData.labels || ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
      datasets: [
        {
          label: `${clientName} - Année en cours`,
          data: revenueData.current_year || [],
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.6)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
        {
          label: 'Année précédente',
          data: revenueData.previous_year || [],
          borderColor: '#cbd5e0',
          backgroundColor: 'rgba(203, 213, 224, 0.1)',
          borderWidth: 1,
          fill: false,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 3,
          borderDash: [5, 5],
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 300,
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true,
          displayColors: false,
           callbacks: {
            label: function (context) {
              const value = context.parsed.y;
           
              return formatNumber(Math.round(value));
            }
          }
        },
         datalabels: {
          display: false
        }
      },
      scales: {
        x: {
          display: true,
          grid: { display: false },
          ticks: { font: { size: 8 } }
        },
        y: { 
          display: false // ← CECI cache complètement l'axe Y (chiffres et ligne)
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });

  chartInstances.set(canvasId, chart);
  return chart;
};

// Graphique apprenants avec données réelles
export const createLearnersChartWithRealData = (canvasId, learnersData, clientName) => {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  if (chartInstances.has(canvasId)) {
    chartInstances.get(canvasId).destroy();
    chartInstances.delete(canvasId);
  }

  const ctx = canvas.getContext('2d');

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: learnersData.labels || ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
      datasets: [
        {
          label: `${clientName} - Année en cours`,
          data: learnersData.current_year || [],
          backgroundColor: 'rgba(102, 126, 234, 0.6)',
          borderColor: '#667eea',
          borderWidth: 1,
          borderRadius: 2,
        },
        {
          label: 'Année précédente',
          data: learnersData.previous_year || [],
          backgroundColor: 'rgba(203, 213, 224, 0.6)',
          borderColor: '#cbd5e0',
          borderWidth: 1,
          borderRadius: 2,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 300,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          displayColors: false,
          callbacks: {
            label: function (context) {
              return `${context.parsed.y} apprenants`;
            }
          }
        },
         datalabels: {
          display: false
        }
      },
      scales: {
        x: {
          display: true,
          grid: { display: false },
          ticks: { font: { size: 8 } }
        },
        y: { 
          display: false 
        }
      }
    }
  });

  chartInstances.set(canvasId, chart);
  return chart;
};

// Graphique de répartition du CA par projet
export const createRevenueDistributionChart = (canvasId, distributionData) => {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  if (chartInstances.has(canvasId)) {
    chartInstances.get(canvasId).destroy();
    chartInstances.delete(canvasId);
  }

  const ctx = canvas.getContext('2d');

  // Préparer les données pour le graphique (limiter à 5 projets max pour la lisibilité)
  const topProjects = distributionData.distribution
    ?.sort((a, b) => b.revenue_amount - a.revenue_amount)
    .slice(0, 5) || [];

  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: topProjects.map(project => project.module_name),
      datasets: [{
        data: topProjects.map(project => project.revenue_amount),
        backgroundColor: [
          '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4fd1c7'
        ],
        borderWidth: 1,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 300,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              const project = topProjects[context.dataIndex];
              return `${project.module_name}: ${project.revenue_formatted || project.revenue_amount}€ (${project.percentage}%)`;
            }
          }
        }
      },
      cutout: '60%'
    }
  });

  chartInstances.set(canvasId, chart);
  return chart;
};

// Graphique de répartition des apprenants par projet
export const createLearnersDistributionChart = (canvasId, distributionData) => {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  if (chartInstances.has(canvasId)) {
    chartInstances.get(canvasId).destroy();
    chartInstances.delete(canvasId);
  }

  const ctx = canvas.getContext('2d');

  const topProjects = (distributionData || [])
    .sort((a, b) => b.learners_count - a.learners_count)
    .slice(0, 5);

  const chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: topProjects.map(project => project.module_name),
      datasets: [{
        data: topProjects.map(project => project.learners_count),
        backgroundColor: [
          '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4fd1c7'
        ],
        borderWidth: 1,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 300,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              const project = topProjects[context.dataIndex];
              return `${project.module_name}: ${project.learners_count} apprenants`;
            }
          }
        }
      }
    }
  });

  chartInstances.set(canvasId, chart);
  return chart;
};

// Graphique sparkline CA
export const createCASparkline = (canvasId, trendType = 'up') => {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  if (chartInstances.has(canvasId)) {
    chartInstances.get(canvasId).destroy();
    chartInstances.delete(canvasId);
  }

  const ctx = canvas.getContext('2d');

  // Génération de données réalistes sur 12 mois
  const baseValue = Math.random() * 5000 + 3000;
  const data = [];
  for (let i = 0; i < 12; i++) {
    if (trendType === 'up') {
      data.push(baseValue + (i * 80) + (Math.random() * 500 - 250));
    } else if (trendType === 'down') {
      data.push(baseValue - (i * 30) + (Math.random() * 500 - 250));
    } else {
      data.push(baseValue + (Math.random() * 800 - 400));
    }
  }

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array(12).fill(''),
      datasets: [{
        data: data,
        borderColor: trendType === 'down' ? '#f5576c' : '#667eea',
        backgroundColor: 'transparent',
        borderWidth: 1,
        fill: false,
        tension: 0.4,
        pointRadius: 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 200,
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      scales: {
        x: { display: false },
        y: { 
          display: false 
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });

  chartInstances.set(canvasId, chart);
  return chart;
};

// Fonction pour nettoyer tous les graphiques
export const destroyAllCharts = () => {
  chartInstances.forEach((chart, canvasId) => {
    chart.destroy();
    chartInstances.delete(canvasId);
  });
};

// Fonction pour détruire un graphique spécifique
export const destroyChart = (canvasId) => {
  if (chartInstances.has(canvasId)) {
    chartInstances.get(canvasId).destroy();
    chartInstances.delete(canvasId);
  }
};

// Fonction pour les graphiques d'apprenants (sparkline)
export const createLearnersChart = (canvasId, trendType = 'up') => {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  if (chartInstances.has(canvasId)) {
    chartInstances.get(canvasId).destroy();
    chartInstances.delete(canvasId);
  }

  const ctx = canvas.getContext('2d');

  const baseValue = Math.random() * 50 + 100;
  const data = [];
  for (let i = 0; i < 12; i++) {
    if (trendType === 'up') {
      data.push(Math.max(0, baseValue + (i * 3) + (Math.random() * 20 - 10)));
    } else if (trendType === 'down') {
      data.push(Math.max(0, baseValue - (i * 1.5) + (Math.random() * 20 - 10)));
    } else {
      data.push(Math.max(0, baseValue + (Math.random() * 30 - 15)));
    }
  }

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Array(12).fill(''),
      datasets: [{
        data: data,
        backgroundColor: trendType === 'down' ? 'rgba(245, 87, 108, 0.6)' : 'rgba(102, 126, 234, 0.6)',
        borderColor: trendType === 'down' ? '#f5576c' : '#667eea',
        borderWidth: 1,
        borderRadius: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 200,
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      scales: {
        x: { display: false },
        y: { 
          display: false // ← CECI cache complètement l'axe Y (chiffres et ligne)
        }
      }
    }
  });

  chartInstances.set(canvasId, chart);
  return chart;
};