<template>
  <section class="max-w-5xl mx-auto mt-8">
    <h2 class="text-2xl font-bold text-green-700 mb-6">Comparaison des émissions de CO₂</h2>

    <p class="text-gray-600 mb-4">
      Voici une comparaison fictive des émissions moyennes par pays (ou activité). Tu peux enrichir cette vue avec tes
      propres données dynamiques.
    </p>

    <BarChart :chart-data="chartData" :chart-options="chartOptions" />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import BarChart from '@/components/charts/BarChart.vue'

// Données fictives pour démo
const chartData = ref({
  labels: ['France', 'USA', 'Chine', 'Inde', 'Allemagne'],
  datasets: [
    {
      label: 'kg CO₂e / an par habitant',
      data: [6000, 16000, 7800, 2400, 9000],
      backgroundColor: 'rgba(34, 197, 94, 0.7)',
    },
  ],
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    title: {
      display: true,
      text: 'Émissions de CO₂ par pays',
    },
  },
}
</script>
