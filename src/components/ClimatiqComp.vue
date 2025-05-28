<template>
  <form @submit.prevent="calculate">
    <div>
      <label>CPU (heures)</label>
      <input type="float" v-model.number="cpu" min="0" required />
    </div>

    <div>
      <label>RAM (Go)</label>
      <input type="number" v-model.number="ram" min="0" required />
    </div>

    <div>
      <label>Stockage (Go·mois)</label>
      <input type="number" v-model.number="storage" min="0" required />
    </div>

    <button type="submit"
      class="group relative px-3 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 min-w-[200px] mt-5">
      <div
        class="absolute inset-0 bg-gradient-to-r from-green-700 to-teal-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      </div>
      <div class="relative flex items-center justify-center">
        Calculer
      </div>
    </button>

    <div v-if="result !== null">
      <p>Résultat CO₂e total : {{ result }} kgCO₂e</p>
    </div>

    <div v-if="error">{{ error }}</div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const cpu = ref(0)
const ram = ref(0)
const storage = ref(0)
const result = ref(null)
const error = ref(null)

const CLIMATIQ_API_KEY = import.meta.env.VITE_CLIMATIQ_API_KEY

async function calculate() {
  result.value = null
  error.value = null

  const headers = {
    Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
    'Content-Type': 'application/json',
  }
  console.log(cpu);
  console.log(ram);
  console.log(storage);
  try {
    const response = await axios.post(
      'https://api.climatiq.io/compute/v1/azure/cpu',
      {
        cpu_count: 1,
        region: 'uk_west',
        average_vcpu_utilization: 0.75,
        duration: cpu.value,
        duration_unit: 'h',
      },
      { headers }
    )

    result.value = response.data.co2e.toFixed(4)
  } catch (err) {
    console.error(err)
    error.value = "Erreur lors du calcul des émissions"
  }
}
</script>

<style>
label {
  color: green;
}

input {
  background-color: #f5f5f5;
  padding: 2px;
  border-radius: 5px;
}
</style>
