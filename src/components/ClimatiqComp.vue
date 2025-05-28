<template>
  <div class="flex flex-col lg:flex-row gap-10 items-start">
    <!-- Formulaire -->
    <form @submit.prevent="calculate" class="flex-1 max-w-md p-4 space-y-4 bg-white rounded-xl shadow">
    <label for="region">Choisir une région :</label>
    <select id="region" v-model="region">
      <option value="af_south_1">af_south_1</option>
      <option value="ap_east_1">ap_east_1</option>
      <option value="ap_northeast_1">ap_northeast_1</option>
      <option value="ap_northeast_2">ap_northeast_2</option>
      <option value="ap_northeast_3">ap_northeast_3</option>
      <option value="ap_south_1">ap_south_1</option>
      <option value="ap_southeast_1">ap_southeast_1</option>
      <option value="ap_southeast_2">ap_southeast_2</option>
      <option value="ap_southeast_3">ap_southeast_3</option>
      <option value="ca_central_1">ca_central_1</option>
      <option value="cn_north_1">cn_north_1</option>
      <option value="cn_northwest_1">cn_northwest_1</option>
      <option value="eu_central_1">eu_central_1</option>
      <option value="eu_central_2">eu_central_2</option>
      <option value="eu_north_1">eu_north_1</option>
      <option value="eu_south_1">eu_south_1</option>
      <option value="eu_west_1">eu_west_1</option>
      <option value="eu_west_2">eu_west_2</option>
      <option value="eu_west_3">eu_west_3</option>
      <option value="me_south_1">me_south_1</option>
      <option value="sa_east_1">sa_east_1</option>
      <option value="us_east_1">us_east_1</option>
      <option value="us_east_2">us_east_2</option>
      <option value="us_gov_east_1">us_gov_east_1</option>
      <option value="us_gov_west_1">us_gov_west_1</option>
      <option value="us_west_1">us_west_1</option>
      <option value="us_west_2">us_west_2</option>
    </select>
      <div>
        <label class="block text-green-700 font-medium mb-1">CPU</label>
        <input type="number" v-model.number="cpu" min="0" required
          class="w-full px-3 py-2 rounded border border-gray-300 bg-gray-100" />
      </div>

      <button type="submit"
        class="group relative px-3 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 min-w-[200px]">
        <div
          class="absolute inset-0 bg-gradient-to-r from-green-700 to-teal-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        </div>
        <div class="relative flex items-center justify-center">
          Calculer
        </div>
      </button>

      <div v-if="result !== null" class="mt-4 text-gray-800">
        <p>Résultat CO₂e total : <span class="font-bold">{{ result }}</span> kgCO₂e</p>
      </div>

      <div v-if="error" class="text-red-600 mt-2 font-medium">{{ error }}</div>
    </form>

    <!-- Graphique -->
    <div v-if="result !== null" class="flex-1 p-4 max-w-xl bg-white rounded-xl shadow">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'

import { estimateCpuEmission } from '@/services/climatiqService'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const cpu = ref(0)
const co2 = ref(0)
const ch4 = ref(0)
const n2o = ref(0)
const result = ref(null)
const error = ref(null)

async function calculate() {
  result.value = null
  error.value = null

  try {
    const cpuData = await estimateCpuEmission(region.value, cpu.value)

    result.value = cpuData.co2e.toFixed(4)

    co2.value = cpuData.constituent_gases.co2 || 0
    ch4.value = cpuData.constituent_gases.ch4 || 0
    n2o.value = cpuData.constituent_gases.n2o || 0
  } catch (err) {
    error.value = err.message || "Erreur lors du calcul des émissions"
  }
}

const chartData = computed(() => ({
  labels: ['CO₂', 'CH₄', 'N₂O'],
  datasets: [
    {
      label: 'Émissions CO₂e (kg)',
      data: [co2.value, ch4.value, n2o.value],
      backgroundColor: ['#16a34a', '#3b82f6', '#f59e0b'],
    }
  ]
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'kgCO₂e'
      }
    }
  }
}
</script>
