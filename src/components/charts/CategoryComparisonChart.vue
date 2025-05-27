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
  }
});

const chartCanvas = ref(null);
let chart = null;

const createChart = () => {
  if (chart) {
    chart.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');

  chart = new Chart(ctx, {
    type: 'bar',
    data: props.data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
          titleColor: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#111827',
          bodyColor: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#374151',
          borderColor: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280'
          }
        },
        y: {
          grid: {
            color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
            drawBorder: false
          },
          ticks: {
            color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280'
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
