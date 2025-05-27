<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    default: 'bar'
  }
});

const chartCanvas = ref(null);
let chart = null;

const createChart = () => {
  if (chart) {
    chart.destroy();
  }
  
  const ctx = chartCanvas.value.getContext('2d');
  
  const isDark = document.documentElement.classList.contains('dark');
  
  chart = new Chart(ctx, {
    type: props.type,
    data: props.data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            color: isDark ? '#e5e7eb' : '#374151'
          }
        },
        tooltip: {
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          titleColor: isDark ? '#e5e7eb' : '#111827',
          bodyColor: isDark ? '#d1d5db' : '#374151',
          borderColor: isDark ? '#374151' : '#e5e7eb',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: {
            color: isDark ? '#374151' : '#e5e7eb',
            drawBorder: false
          },
          ticks: {
            color: isDark ? '#9ca3af' : '#6b7280'
          }
        },
        y: {
          grid: {
            color: isDark ? '#374151' : '#e5e7eb',
            drawBorder: false
          },
          ticks: {
            color: isDark ? '#9ca3af' : '#6b7280'
          },
          beginAtZero: true
        }
      }
    }
  });
};

onMounted(() => {
  createChart();
});

watch(() => props.data, () => {
  createChart();
}, { deep: true });

watch(() => props.type, () => {
  createChart();
});

// Recréer le graphique si le thème change
const handleThemeChange = () => {
  createChart();
};

onMounted(() => {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleThemeChange);
});

onUnmounted(() => {
  window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleThemeChange);
  if (chart) {
    chart.destroy();
  }
});
</script>